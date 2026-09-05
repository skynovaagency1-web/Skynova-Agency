import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { bindings } from "../bindings.server";
import { getSessionUserId } from "../auth.server";

export type WishlistItem = { itemType: "destination" | "vertical"; itemSlug: string };

export const getWishlist = createServerFn({ method: "GET" }).handler(async (): Promise<WishlistItem[]> => {
  const { DB } = bindings();
  const userId = await getSessionUserId();
  if (!DB || !userId) return [];
  const { results } = await DB.prepare(
    "SELECT item_type AS itemType, item_slug AS itemSlug FROM wishlist_items WHERE user_id = ? ORDER BY created_at DESC",
  )
    .bind(userId)
    .all<WishlistItem>();
  return results;
});

const ItemSchema = z.object({
  itemType: z.enum(["destination", "vertical"]),
  itemSlug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
});

export const addWishlistItem = createServerFn({ method: "POST" })
  .validator((data: unknown) => ItemSchema.parse(data))
  .handler(async ({ data }) => {
    const { DB } = bindings();
    const userId = await getSessionUserId();
    if (!DB || !userId) throw new Error("Sign in to save destinations.");
    await DB.prepare(
      "INSERT INTO wishlist_items (id, user_id, item_type, item_slug) VALUES (?, ?, ?, ?) ON CONFLICT(user_id, item_type, item_slug) DO NOTHING",
    )
      .bind(crypto.randomUUID(), userId, data.itemType, data.itemSlug)
      .run();
    return { ok: true };
  });

export const removeWishlistItem = createServerFn({ method: "POST" })
  .validator((data: unknown) => ItemSchema.parse(data))
  .handler(async ({ data }) => {
    const { DB } = bindings();
    const userId = await getSessionUserId();
    if (!DB || !userId) throw new Error("Sign in to manage your wishlist.");
    // Scoped by user_id, not just the item row id -- a signed-in visitor
    // can only ever remove their own saved items (IDOR guard).
    await DB.prepare("DELETE FROM wishlist_items WHERE user_id = ? AND item_type = ? AND item_slug = ?")
      .bind(userId, data.itemType, data.itemSlug)
      .run();
    return { ok: true };
  });
