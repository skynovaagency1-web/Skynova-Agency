import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { bindings } from "../bindings.server";
import { getSessionUserId } from "../auth.server";

const GiftRequestSchema = z.object({
  recipientEmail: z.string().trim().toLowerCase().email(),
  message: z.string().trim().max(1000).optional(),
});

// No email provider is wired up, so this only ever records the request --
// the confirmation copy in gift.tsx says "we'll be in touch," never
// "email sent," so the feature stays honest about what it actually does.
export const submitGiftRequest = createServerFn({ method: "POST" })
  .validator((data: unknown) => GiftRequestSchema.parse(data))
  .handler(async ({ data }) => {
    const { DB } = bindings();
    if (!DB) throw new Error("Gifting isn't available right now.");
    const userId = await getSessionUserId();
    await DB.prepare("INSERT INTO gift_requests (id, user_id, recipient_email, message) VALUES (?, ?, ?, ?)")
      .bind(crypto.randomUUID(), userId, data.recipientEmail, data.message ?? null)
      .run();
    return { ok: true };
  });
