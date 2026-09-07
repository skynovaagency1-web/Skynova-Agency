import { bindings } from "./bindings.server";

/**
 * Transactional email, via Resend.
 *
 * The site had no way to send mail at all, and three separate features
 * quietly depended on one: the password reset promised "we'll be in touch",
 * the contact form promised a reply within a working day, and the gift form
 * promised follow-up. All three wrote a row to D1 and stopped. Nothing read
 * those tables, so every one of those promises was false in effect while
 * being honest in the code.
 *
 * Returns a reason string on failure instead of throwing. The caller has
 * already committed its database write by this point -- a provider outage
 * must not turn a successful signup or reset request into an error for the
 * visitor. Same contract as syncToSysteme() in newsletter.functions.ts.
 */

const RESEND_URL = "https://api.resend.com/emails";

/** Verified sending identity. Must match the domain verified in Resend. */
export const MAIL_FROM = "Skynova Agency <no-reply@skynovaagency.com>";

export type SendResult = { ok: true } | { ok: false; reason: string };

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<SendResult> {
  const { RESEND_API_KEY } = bindings();

  // Not configured yet. This is a real state, not an error: the key is set
  // with `wrangler secret put RESEND_API_KEY`, and until it is, everything
  // else in the flow still works -- the token is issued and stored, the row
  // is written. Only delivery is missing, and the caller says so.
  if (!RESEND_API_KEY) return { ok: false, reason: "no email provider configured" };

  // Trimmed because the key arrives via `wrangler secret put`, which keeps
  // whatever was pasted -- a trailing newline off the clipboard is invisible
  // in the dashboard and rejects every request with a 401. Same trap the
  // systeme.io key hit.
  const key = RESEND_API_KEY.trim();
  if (!key) return { ok: false, reason: "api key is empty" };

  let res: Response;
  try {
    res = await fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      }),
    });
  } catch (err) {
    return { ok: false, reason: `network: ${err instanceof Error ? err.message : "unknown"}` };
  }

  if (res.ok) return { ok: true };

  // Record what the provider actually said. "http 403" alone cannot tell an
  // unverified sending domain apart from a revoked key, and those have very
  // different fixes. Never includes the key -- only the response body.
  let detail = "";
  try {
    detail = (await res.text()).slice(0, 200).replace(/\s+/g, " ").trim();
  } catch {
    /* body already consumed or unreadable; the status alone will do */
  }
  return { ok: false, reason: detail ? `http ${res.status}: ${detail}` : `http ${res.status}` };
}

/** Plain, brand-consistent wrapper. Deliberately simple markup: transactional
 *  mail is read in clients with wildly varying CSS support, and a reset link
 *  that fails to render is an account nobody can recover. */
export function resetEmail(resetUrl: string): { subject: string; html: string; text: string } {
  const subject = "Reset your Skynova password";
  const text = [
    "Reset your Skynova password",
    "",
    "Open this link to choose a new password. It works once and expires in one hour:",
    resetUrl,
    "",
    "If you didn't ask for this, you can ignore this email -- your password stays as it is.",
    "",
    "Skynova Agency",
  ].join("\n");
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#faf7f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1c1a14">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e7e0cd;border-radius:16px;padding:32px">
    <h1 style="margin:0 0 16px;font-size:20px;font-weight:700">Reset your Skynova password</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#6e6555">Choose a new password with the link below. It works once and expires in one hour.</p>
    <a href="${resetUrl}" style="display:inline-block;background:#c9a227;color:#1c1400;text-decoration:none;font-weight:600;font-size:15px;padding:12px 24px;border-radius:999px">Choose a new password</a>
    <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6e6555">If the button doesn't work, paste this into your browser:<br><span style="word-break:break-all;color:#93711d">${resetUrl}</span></p>
    <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6e6555">If you didn't ask for this, ignore this email &mdash; your password stays as it is.</p>
  </div>
</body></html>`;
  return { subject, html, text };
}
