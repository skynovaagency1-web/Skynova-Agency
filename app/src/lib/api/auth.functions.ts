import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { bindings } from "../bindings.server";
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

// No email provider is wired up yet, so this can't send an automated
// reset link -- it logs the request so it can be followed up by hand
// (same honest pattern as the Gift form). Always returns the same
// result regardless of whether the email is registered, so this can't
// be used to check which emails have accounts.
export const requestPasswordReset = createServerFn({ method: "POST" })
  .validator((data: unknown) => PasswordResetSchema.parse(data))
  .handler(async ({ data }) => {
    const { DB } = bindings();
    if (!DB) throw new Error("This isn't available right now.");
    await DB.prepare("INSERT INTO password_reset_requests (id, email) VALUES (?, ?)")
      .bind(crypto.randomUUID(), data.email)
      .run();
    return { ok: true };
  });
