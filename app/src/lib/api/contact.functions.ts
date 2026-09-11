import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { bindings } from "../bindings.server";
import { getSessionUserId } from "../auth.server";
import { MAIL_TO_OWNER, contactNotification, sendEmail } from "../email.server";

/** Topics the form offers. Kept as an enum so a crafted request cannot write
 * arbitrary strings into the column. */
export const CONTACT_TOPICS = ["Booking help", "Partnership", "Feedback", "Something else"] as const;

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email(),
  topic: z.enum(CONTACT_TOPICS),
  message: z.string().trim().min(10).max(2000),
});

/**
 * Records a contact message, then tells the operator it arrived.
 *
 * The row was always written; nothing ever read it, so a form that promised
 * a reply within a working day sat silently in a table for six days at a
 * time. The notification is what makes that promise keepable.
 *
 * Delivery is best-effort and deliberately after the insert: the message is
 * already safely recorded by that point, and a provider outage must not turn
 * a message that WAS received into an error telling the visitor it wasn't.
 */
export const submitContactMessage = createServerFn({ method: "POST" })
  .validator((data: unknown) => ContactSchema.parse(data))
  .handler(async ({ data }) => {
    const { DB } = bindings();
    if (!DB) throw new Error("The contact form isn't available right now.");
    const userId = await getSessionUserId();
    await DB.prepare(
      "INSERT INTO contact_messages (id, user_id, name, email, topic, message) VALUES (?, ?, ?, ?, ?, ?)",
    )
      .bind(crypto.randomUUID(), userId, data.name, data.email, data.topic, data.message)
      .run();

    const sent = await sendEmail({ to: MAIL_TO_OWNER, ...contactNotification(data) });
    if (!sent.ok) console.error("contact notification failed:", sent.reason);

    return { ok: true };
  });
