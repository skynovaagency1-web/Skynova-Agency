/**
 * Affiliate links for physical gear.
 *
 * SEPARATE FROM lib/affiliate.ts ON PURPOSE. That file is Travelpayouts, and
 * the Travelpayouts marker earns on travel SERVICES -- flights, hotels, tours,
 * eSIM, car hire. It pays nothing on a backpack. The monetisation script in
 * TravelpayoutsLink.tsx does not rewrite these links either, because a
 * retailer is not in that network. Gear is a different programme entirely,
 * and mixing the two would silently produce links that look attributed and
 * are not.
 *
 * ===================================================================
 * THESE LINKS CURRENTLY EARN NOTHING. That is expected, not a bug.
 * ===================================================================
 *
 * TAG is empty because this site has no retail affiliate account yet. With it
 * empty every link below still WORKS -- a visitor reaches the product and can
 * buy it -- there is simply no attribution, so no commission. The page is
 * honest either way: nothing claims a partnership that does not exist.
 *
 * To switch attribution on: sign up for Amazon Associates, then put the
 * tracking id in TAG. Nothing else needs to change.
 *
 * THE MARKETPLACE PROBLEM, because it will bite whoever does that:
 *
 * Amazon Associates ids are per-marketplace. A tag issued for amazon.com does
 * NOT work on amazon.fr or amazon.de -- the link resolves, the sale happens,
 * and you earn nothing, with no error anywhere you would notice. This site
 * serves EN and FR and wants customers worldwide, so a single tag would leak
 * commission on most of its traffic.
 *
 * Two ways to handle it, in order of preference:
 *
 *   1. Amazon OneLink. Amazon redirects each visitor to their own
 *      marketplace and applies the right tag. Set up once in the Associates
 *      dashboard, then a single tag here is genuinely enough. This is the
 *      right answer and the reason TAG is a single string rather than a map.
 *
 *   2. Per-market tags. Register in each marketplace and fill TAGS_BY_MARKET
 *      below. More accounts to maintain, more thresholds to clear, and every
 *      marketplace expires its own account for inactivity independently.
 *
 * Until one of those exists, leave TAG empty rather than inventing a value:
 * a malformed tag is not neutral, it can send the sale to somebody else.
 */

import type { Locale } from "@/lib/i18n";

/** Amazon Associates tracking id. Empty = links work, nothing is attributed. */
const TAG = "";

/**
 * Optional per-marketplace override, for approach 2 above. A market absent
 * here falls back to TAG, which is correct for OneLink and harmless when TAG
 * is empty.
 */
const TAGS_BY_MARKET: Partial<Record<string, string>> = {};

/**
 * Which Amazon a visitor is sent to, by page locale.
 *
 * Locale, not geography. The pages are prerendered (see
 * lib/prerendered.server.ts), so the document that ships is the same for
 * everyone and cannot carry a per-visitor decision baked in. Locale is
 * something the build genuinely knows. It is a weaker signal than country --
 * a French speaker in Canada lands on amazon.fr -- but it is honest about
 * what it is, and OneLink corrects it at Amazon's end once configured.
 */
const MARKET_BY_LOCALE: Record<Locale, string> = {
  en: "www.amazon.com",
  fr: "www.amazon.fr",
  es: "www.amazon.es",
  // Brazil, not Portugal: Amazon has no amazon.pt, and pt-BR is the larger
  // audience for this site by some distance.
  pt: "www.amazon.com.br",
  // The Gulf marketplace. Arabic-speaking visitors outside it are served
  // worse than the others here, which OneLink would fix.
  ar: "www.amazon.ae",
};

/**
 * A SEARCH link, deliberately, rather than a deep link to one product.
 *
 * A product URL pins an ASIN, and ASINs churn: items are relisted, replaced
 * by a new model, or go region-unavailable. When that happens a deep link
 * 404s or lands on something unrelated, and nothing on this end reports it --
 * the page keeps looking correct while sending every visitor into a dead end.
 * A search for the product name survives all of that and puts the visitor in
 * front of current stock and a live price.
 *
 * It is also the only honest option here: prices and availability are not
 * stored on this site (see data/gear.ts), so the merchant has to be the one
 * to state them.
 */
export function gearLink(query: string, locale: Locale = "en"): string {
  const market = MARKET_BY_LOCALE[locale] ?? MARKET_BY_LOCALE.en;
  const tag = TAGS_BY_MARKET[market] ?? TAG;
  const params = new URLSearchParams({ k: query });
  if (tag) params.set("tag", tag);
  return `https://${market}/s?${params.toString()}`;
}

/** Whether any attribution is configured at all. The page uses this to avoid
 *  claiming a commercial relationship it does not have. */
export function gearLinksAreAttributed(): boolean {
  return TAG !== "" || Object.keys(TAGS_BY_MARKET).length > 0;
}
