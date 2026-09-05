import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { bindings } from "../bindings.server";
import { getSessionUserId } from "../auth.server";

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
 * Records a contact message.
 *
 * No email is sent, because no email provider is wired up -- and the domain
 * had no MX records at all, which is why the mailto: links this replaces
 * bounced. The confirmation copy therefore promises a reply, never claims a
 * message was emailed.
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
    return { ok: true };
  });
