import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { bindings } from "../bindings.server";
import { sendEmail, resetEmail } from "../email.server";
import { SITE_URL } from "../seo";
import {
  clearFailedLogins,
  createSession,
  destroySession,
  generateReferralCode,
  getSessionUserId,
  hashPassword,
  isLockedOut,
  recordFailedLogin,
  verifyPassword,
} from "../auth.server";

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  password_salt: string;
  referral_code: string;
  failed_login_attempts: number;
  locked_until: string | null;
};

export type CurrentUser = { id: string; email: string; referralCode: string };

const SignUpSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(200),
  referralCode: z.string().trim().max(20).optional(),
});

export const signUp = createServerFn({ method: "POST" })
  .validator((data: unknown) => SignUpSchema.parse(data))
  .handler(async ({ data }): Promise<CurrentUser> => {
    const { DB } = bindings();
    if (!DB) throw new Error("Accounts aren't available right now.");

    const existing = await DB.prepare("SELECT id FROM users WHERE email = ?").bind(data.email).first();
    if (existing) throw new Error("An account with that email already exists.");

    let referredByUserId: string | null = null;
    if (data.referralCode) {
      const referrer = await DB.prepare("SELECT id FROM users WHERE referral_code = ?")
        .bind(data.referralCode)
        .first<{ id: string }>();
      referredByUserId = referrer?.id ?? null;
    }

    const { hash, salt } = await hashPassword(data.password);
    const id = crypto.randomUUID();

    // referral_code is UNIQUE -- collisions are astronomically unlikely at
    // 8 hex chars, but retry a few times rather than trust that blindly.
    let referralCode = generateReferralCode();
    for (let attempt = 0; attempt < 5; attempt++) {
      const clash = await DB.prepare("SELECT id FROM users WHERE referral_code = ?").bind(referralCode).first();
      if (!clash) break;
      referralCode = generateReferralCode();
    }

    await DB.prepare(
      "INSERT INTO users (id, email, password_hash, password_salt, referral_code, referred_by_user_id) VALUES (?, ?, ?, ?, ?, ?)",
    )
      .bind(id, data.email, hash, salt, referralCode, referredByUserId)
      .run();

    await createSession(id);
    return { id, email: data.email, referralCode };
  });

const SignInSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

export const signIn = createServerFn({ method: "POST" })
  .validator((data: unknown) => SignInSchema.parse(data))
  .handler(async ({ data }): Promise<CurrentUser> => {
    const { DB } = bindings();
    if (!DB) throw new Error("Accounts aren't available right now.");

    const user = await DB.prepare(
      "SELECT id, email, password_hash, password_salt, referral_code, failed_login_attempts, locked_until FROM users WHERE email = ?",
    )
      .bind(data.email)
      .first<UserRow>();

    // Same generic message whether the email doesn't exist or the password
    // is wrong -- don't let the error reveal which emails are registered.
    const invalid = () => new Error("Invalid email or password.");
    if (!user) throw invalid();

    if (isLockedOut({ failed_login_attempts: user.failed_login_attempts, locked_until: user.locked_until })) {
      throw new Error("Too many failed attempts. Try again in a few minutes.");
    }

    const valid = await verifyPassword(data.password, user.password_hash, user.password_salt);
    if (!valid) {
      await recordFailedLogin(user.id, user.failed_login_attempts);
      throw invalid();
    }

    await clearFailedLogins(user.id);
    await createSession(user.id);
    return { id: user.id, email: user.email, referralCode: user.referral_code };
  });

export const signOut = createServerFn({ method: "POST" }).handler(async () => {
  await destroySession();
  return { ok: true };
});

export const getCurrentUser = createServerFn({ method: "GET" }).handler(async (): Promise<CurrentUser | null> => {
  const { DB } = bindings();
  const userId = await getSessionUserId();
  if (!DB || !userId) return null;
  const user = await DB.prepare("SELECT id, email, referral_code AS referralCode FROM users WHERE id = ?")
    .bind(userId)
    .first<CurrentUser>();
  return user ?? null;
});

const PasswordResetSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

const PerformResetSchema = z.object({
  token: z.string().trim().min(32).max(128),
  password: z.string().min(8).max(200),
});

/** One hour. A reset link left valid overnight is a standing key to the account. */
const TOKEN_TTL_MINUTES = 60;
/** Requests per email per hour before we stop issuing. Cheap defence against
 *  using this endpoint to spray mail at somebody else's address. */
const MAX_REQUESTS_PER_HOUR = 5;

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** SHA-256. The token is 32 bytes of CSPRNG output, so there is no low-entropy
 *  guess space that would justify a slow KDF here -- only the "never store the
 *  live credential" rule, which this satisfies. */
async function hashToken(token: string): Promise<string> {
  return toHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token)));
}

/**
 * Issues a reset link.
 *
 * Always returns the same shape whether or not the address has an account --
 * a differing response, or a differing response TIME, turns this into an
 * oracle for which emails are registered.
 */
export const requestPasswordReset = createServerFn({ method: "POST" })
  .validator((data: unknown) => PasswordResetSchema.parse(data))
  .handler(async ({ data }) => {
    const { DB } = bindings();
    if (!DB) throw new Error("This isn't available right now.");

    // Logged first, and for every attempt, so the rate-limit count below is
    // honest even for addresses with no account.
    await DB.prepare("INSERT INTO password_reset_requests (id, email) VALUES (?, ?)")
      .bind(crypto.randomUUID(), data.email)
      .run();

    const recent = await DB.prepare(
      "SELECT COUNT(*) AS n FROM password_reset_requests WHERE email = ? AND created_at > datetime('now', '-1 hour')",
    )
      .bind(data.email)
      .first<{ n: number }>();
    if ((recent?.n ?? 0) > MAX_REQUESTS_PER_HOUR) return { ok: true };

    const user = await DB.prepare("SELECT id FROM users WHERE email = ?")
      .bind(data.email)
      .first<{ id: string }>();
    // No account: stop here, and say exactly what we say to everyone else.
    if (!user) return { ok: true };

    const token = toHex(crypto.getRandomValues(new Uint8Array(32)).buffer);
    await DB.prepare(
      "INSERT INTO password_reset_tokens (token_hash, user_id, expires_at) VALUES (?, ?, datetime('now', ?))",
    )
      .bind(await hashToken(token), user.id, `+${TOKEN_TTL_MINUTES} minutes`)
      .run();

    const mail = resetEmail(`${SITE_URL}/reset-password?token=${token}`);
    // Delivery failure is not surfaced to the visitor: the token is already
    // valid, and telling an unauthenticated caller that mail failed leaks
    // that the address exists. It is logged for the operator instead.
    const sent = await sendEmail({ to: data.email, ...mail });
    if (!sent.ok) console.error("password reset email failed:", sent.reason);

    return { ok: true };
  });

/** Spends a token and sets the new password. */
export const performPasswordReset = createServerFn({ method: "POST" })
  .validator((data: unknown) => PerformResetSchema.parse(data))
  .handler(async ({ data }) => {
    const { DB } = bindings();
    if (!DB) throw new Error("This isn't available right now.");

    const row = await DB.prepare(
      "SELECT token_hash, user_id FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > datetime('now')",
    )
      .bind(await hashToken(data.token))
      .first<{ token_hash: string; user_id: string }>();
    // Expired, already spent, or never existed -- one message for all three,
    // so this cannot be used to probe which tokens are real.
    if (!row) throw new Error("That reset link has expired or has already been used.");

    const { hash, salt } = await hashPassword(data.password);
    await DB.batch([
      DB.prepare(
        "UPDATE users SET password_hash = ?, password_salt = ?, failed_login_attempts = 0, locked_until = NULL WHERE id = ?",
      ).bind(hash, salt, row.user_id),
      DB.prepare("UPDATE password_reset_tokens SET used_at = datetime('now') WHERE token_hash = ?").bind(
        row.token_hash,
      ),
      // Any other outstanding link for this account dies with it.
      DB.prepare(
        "UPDATE password_reset_tokens SET used_at = datetime('now') WHERE user_id = ? AND used_at IS NULL",
      ).bind(row.user_id),
      // Every existing session is revoked. If the reset was prompted by
      // someone else having the password, leaving their session alive would
      // defeat the whole exercise.
      DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(row.user_id),
    ]);

    return { ok: true };
  });
