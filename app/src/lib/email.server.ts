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

/** Where form notifications land. The site publishes no contact address of
 *  its own, so this is the operator's own inbox -- change it here and both
 *  the contact and gift notifications follow. */
export const MAIL_TO_OWNER = "skynovaagency1@gmail.com";

export type SendResult = { ok: true } | { ok: false; reason: string };

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Set on operator notifications so hitting reply in the inbox answers the
   *  person who wrote in, rather than the no-reply sending identity. */
  replyTo?: string;
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
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
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

/** Everything below interpolates visitor-supplied text into an HTML email.
 *  Escaped first: a message body containing a tag would otherwise render as
 *  markup in the operator's mail client, and the whole point of these is to
 *  show what was actually typed. */
function esc(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Wraps a notification body in the same plain shell resetEmail() uses. */
function ownerShell(heading: string, rows: [string, string][], body?: string): string {
  const rowHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;font-size:13px;color:#6e6555;white-space:nowrap">${esc(k)}</td>` +
        `<td style="padding:4px 0;font-size:14px;color:#1c1a14">${esc(v)}</td></tr>`,
    )
    .join("");
  const bodyHtml = body
    ? `<p style="margin:20px 0 0;font-size:15px;line-height:1.6;color:#1c1a14;white-space:pre-wrap">${esc(body)}</p>`
    : "";
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#faf7f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1c1a14">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e7e0cd;border-radius:16px;padding:32px">
    <h1 style="margin:0 0 16px;font-size:20px;font-weight:700">${esc(heading)}</h1>
    <table style="border-collapse:collapse">${rowHtml}</table>${bodyHtml}
  </div>
</body></html>`;
}

/**
 * Contact form landed. Goes to the operator, never to the person who wrote
 * in -- they already saw the on-page confirmation, and an auto-reply from a
 * no-reply address helps nobody.
 */
export function contactNotification(m: {
  name: string;
  email: string;
  topic: string;
  message: string;
}): { subject: string; html: string; text: string; replyTo: string } {
  return {
    subject: `Contact form: ${m.topic} -- ${m.name}`,
    text: [
      `New contact message (${m.topic})`,
      "",
      `From:  ${m.name}`,
      `Email: ${m.email}`,
      "",
      m.message,
      "",
      "Reply straight to this email to answer them.",
    ].join("\n"),
    html: ownerShell(
      "New contact message",
      [
        ["From", m.name],
        ["Email", m.email],
        ["Topic", m.topic],
      ],
      m.message,
    ),
    // Reply goes to the sender, not to no-reply@.
    replyTo: m.email,
  };
}

/**
 * Gift request landed. Also operator-only, and deliberately so: the
 * recipient address is whatever the submitter typed, so mailing it directly
 * would let anyone use this form to send mail from a verified skynova
 * domain to a stranger. The operator decides what, if anything, goes out.
 */
export function giftNotification(g: { recipientEmail: string; message?: string | null }): {
  subject: string;
  html: string;
  text: string;
} {
  return {
    subject: `Gift request for ${g.recipientEmail}`,
    text: [
      "New gift request",
      "",
      `Recipient: ${g.recipientEmail}`,
      "",
      g.message ?? "(no message)",
      "",
      "Nothing has been sent to the recipient -- this is a notification only.",
    ].join("\n"),
    html: ownerShell("New gift request", [["Recipient", g.recipientEmail]], g.message ?? "(no message)"),
  };
}
