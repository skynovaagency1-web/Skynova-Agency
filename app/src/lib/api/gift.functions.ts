import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { bindings } from "../bindings.server";
import { getSessionUserId } from "../auth.server";
import { MAIL_TO_OWNER, giftNotification, sendEmail } from "../email.server";

const GiftRequestSchema = z.object({
  recipientEmail: z.string().trim().toLowerCase().email(),
  message: z.string().trim().max(1000).optional(),
});

// Records the request and notifies the operator. Nothing is sent to the
// recipient: that address is simply whatever the submitter typed, so mailing
// it would let anyone use this form to send mail from a verified skynova
// domain to a stranger who never asked for it. The confirmation copy in
// gift.tsx says "we'll be in touch," which stays accurate -- a person now
// actually hears about it and decides what to send.
export const submitGiftRequest = createServerFn({ method: "POST" })
  .validator((data: unknown) => GiftRequestSchema.parse(data))
  .handler(async ({ data }) => {
    const { DB } = bindings();
    if (!DB) throw new Error("Gifting isn't available right now.");
    const userId = await getSessionUserId();
    await DB.prepare("INSERT INTO gift_requests (id, user_id, recipient_email, message) VALUES (?, ?, ?, ?)")
      .bind(crypto.randomUUID(), userId, data.recipientEmail, data.message ?? null)
      .run();

    // Best-effort, after the insert -- same contract as the contact form.
    const sent = await sendEmail({ to: MAIL_TO_OWNER, ...giftNotification(data) });
    if (!sent.ok) console.error("gift notification failed:", sent.reason);

    return { ok: true };
  });
