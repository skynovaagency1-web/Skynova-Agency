import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { bindings } from "../bindings.server";

const SubscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

/** systeme.io: POST /api/contacts, X-API-Key header, {email, locale}. */
const SYSTEME_CONTACTS_URL = "https://api.systeme.io/api/contacts";

/**
 * Pushes one address to systeme.io.
 *
 * Returns a reason string on failure rather than throwing: the subscriber is
 * already safely in D1 by this point, so a provider outage must not turn a
 * successful signup into an error for the visitor.
 */
async function syncToSysteme(apiKey: string, email: string): Promise<string | null> {
  // Trimmed because the key arrives via `wrangler secret put`, which keeps
  // whatever was pasted -- a trailing newline off the clipboard is invisible
  // in the dashboard and rejects every request with a 401.
  const key = apiKey.trim();
  if (!key) return "api key is empty";

  let res: Response;
  try {
    res = await fetch(SYSTEME_CONTACTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": key },
      body: JSON.stringify({ email, locale: "en" }),
    });
  } catch (err) {
    return `network: ${err instanceof Error ? err.message : "unknown"}`;
  }

  if (res.status === 201) return null;
  // 422 is the validation/constraint response, which is also what a duplicate
  // address comes back as. Already being on the list is a success from our
  // side -- the goal is that the address is on it, not that we put it there.
  if (res.status === 422) return null;

  // Record what the provider actually said. "http 401" alone cannot tell a
  // bad key apart from a plan that does not include API access, and the
  // subscriber is already saved, so there is nothing to lose by asking.
  // Never includes the key itself -- only the response body.
  let detail = "";
  try {
    detail = (await res.text()).slice(0, 200).replace(/\s+/g, " ").trim();
  } catch {
    /* body already consumed or unreadable; the status alone will do */
  }
  return detail ? `http ${res.status}: ${detail}` : `http ${res.status}`;
}

/**
 * Records a newsletter signup.
 *
 * The form used to store nothing whatsoever -- it flipped a local `submitted`
 * flag and showed "You're on the list", so every address typed into the footer
 * was discarded. This writes to D1 FIRST and treats that as the commitment;
 * the systeme.io push is a best-effort second step whose outcome is recorded
 * on the row. That ordering is deliberate: a missing or wrong API key can
 * never cost a subscriber, and `sync_error` makes the failures findable so
 * they can be replayed later.
 *
 * Always returns the same shape whether or not the address was already known.
 * Telling a stranger "you are already subscribed" discloses whether a given
 * person is on the list, which is not ours to reveal.
 */
export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .validator((data: unknown) => SubscribeSchema.parse(data))
  .handler(async ({ data }) => {
    const { DB, SYSTEME_API_KEY } = bindings();
    if (!DB) throw new Error("Sign-ups aren't available right now.");

    // ON CONFLICT DO NOTHING keeps a repeat submission idempotent instead of
    // failing the UNIQUE constraint and showing the visitor an error.
    await DB.prepare(
      "INSERT INTO newsletter_subscribers (id, email, source) VALUES (?, ?, 'site') " +
        "ON CONFLICT(email) DO NOTHING",
    )
      .bind(crypto.randomUUID(), data.email)
      .run();

    if (SYSTEME_API_KEY) {
      const error = await syncToSysteme(SYSTEME_API_KEY, data.email);
      await DB.prepare(
        error
          ? "UPDATE newsletter_subscribers SET sync_error = ? WHERE email = ?"
          : "UPDATE newsletter_subscribers SET synced_at = datetime('now'), sync_error = NULL WHERE email = ?",
      )
        .bind(...(error ? [error, data.email] : [data.email]))
        .run();
    }

    return { ok: true as const };
  });
