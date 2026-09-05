import { createServerFn } from "@tanstack/react-start";

import { bindings } from "../bindings.server";
import { getSessionUserId } from "../auth.server";

export type ReferralStats = { referralCode: string; referralCount: number } | null;

export const getReferralStats = createServerFn({ method: "GET" }).handler(async (): Promise<ReferralStats> => {
  const { DB } = bindings();
  const userId = await getSessionUserId();
  if (!DB || !userId) return null;

  const user = await DB.prepare("SELECT referral_code AS referralCode FROM users WHERE id = ?")
    .bind(userId)
    .first<{ referralCode: string }>();
  if (!user) return null;

  const countRow = await DB.prepare("SELECT COUNT(*) AS n FROM users WHERE referred_by_user_id = ?")
    .bind(userId)
    .first<{ n: number }>();

  return { referralCode: user.referralCode, referralCount: countRow?.n ?? 0 };
});
