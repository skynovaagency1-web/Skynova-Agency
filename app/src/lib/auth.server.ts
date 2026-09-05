import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";

import { bindings } from "./bindings.server";

const SESSION_COOKIE = "skynova_session";
const SESSION_DAYS = 30;
const PBKDF2_ITERATIONS = 100_000;

function toBase64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function fromBase64(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function deriveBits(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    256,
  );
}

// No bcrypt/argon2 package is installed, and Workers ship crypto.subtle
// natively -- PBKDF2-SHA256 with a random per-user salt is the standard
// dependency-free password hash available in this runtime.
export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derived = await deriveBits(password, salt);
  return { hash: toBase64(derived), salt: toBase64(salt) };
}

// Cloudflare Workers extend SubtleCrypto with timingSafeEqual (used in the
// platform's own security.md worker-hardening example), but the DOM lib
// types this build checks against don't declare it -- narrow the cast to
// just this one call rather than reaching for `any`.
type WorkersSubtleCrypto = SubtleCrypto & {
  timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean;
};

// Timing-safe: re-derive from the stored salt and compare with
// crypto.subtle.timingSafeEqual (never `===` on secret bytes) -- matches
// the platform's own security.md worker-hardening rule 4.
export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  const derived = new Uint8Array(await deriveBits(password, fromBase64(salt)));
  const stored = fromBase64(hash);
  if (derived.byteLength !== stored.byteLength) return false;
  return (crypto.subtle as WorkersSubtleCrypto).timingSafeEqual(derived, stored);
}

export function generateReferralCode(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8);
}

// Sessions rotate on every login (a fresh row + fresh cookie, never a
// reused id) and live in D1 rather than a signed/stateless token so a
// sign-out or expiry actually revokes access immediately.
export async function createSession(userId: string): Promise<void> {
  const { DB } = bindings();
  if (!DB) throw new Error("Database not configured");
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await DB.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").bind(id, userId, expiresAt).run();
  setCookie(SESSION_COOKIE, id, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession(): Promise<void> {
  const { DB } = bindings();
  const sessionId = getCookie(SESSION_COOKIE);
  if (DB && sessionId) {
    await DB.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
  }
  deleteCookie(SESSION_COOKIE, { path: "/" });
}

// The only source of truth for "who is this request" -- every wishlist,
// gift, and referral server function calls this first and scopes its D1
// queries to the returned id. Never trust a userId sent by the client.
export async function getSessionUserId(): Promise<string | null> {
  const { DB } = bindings();
  if (!DB) return null;
  const sessionId = getCookie(SESSION_COOKIE);
  if (!sessionId) return null;
  const row = await DB.prepare("SELECT user_id AS userId, expires_at AS expiresAt FROM sessions WHERE id = ?")
    .bind(sessionId)
    .first<{ userId: string; expiresAt: string }>();
  if (!row) return null;
  if (new Date(row.expiresAt).getTime() < Date.now()) {
    await DB.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
    return null;
  }
  return row.userId;
}

const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_MINUTES = 15;

export function isLockedOut(user: { failed_login_attempts: number; locked_until: string | null }): boolean {
  if (!user.locked_until) return false;
  return new Date(user.locked_until).getTime() > Date.now();
}

export async function recordFailedLogin(userId: string, currentAttempts: number): Promise<void> {
  const { DB } = bindings();
  if (!DB) return;
  const attempts = currentAttempts + 1;
  const lockedUntil =
    attempts >= LOCKOUT_THRESHOLD ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000).toISOString() : null;
  await DB.prepare("UPDATE users SET failed_login_attempts = ?, locked_until = ? WHERE id = ?")
    .bind(attempts, lockedUntil, userId)
    .run();
}

export async function clearFailedLogins(userId: string): Promise<void> {
  const { DB } = bindings();
  if (!DB) return;
  await DB.prepare("UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = ?").bind(userId).run();
}
