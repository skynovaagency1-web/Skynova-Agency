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
 * ATTRIBUTED ON amazon.com ONLY, AND THAT IS THE STATE TO KNOW.
 *
 * skynova07-20 is a US Associates id -- the `-20` suffix IS the marketplace.
 * It earns on amazon.com and is ignored everywhere else. This site routes by
 * page locale, so English readers are attributed and French, Spanish,
 * Portuguese and Arabic readers are not: their links work, reach the product
 * and can be bought from, but generate no commission.
 *
 * THE MARKETPLACE PROBLEM, because this is where it bites: a tag issued for
 * amazon.com does NOT work on amazon.fr. The link resolves, the sale
 * completes, and nothing anywhere reports that the commission was lost --
 * there is no error, no warning, no failed request. It is invisible unless
 * somebody already knows to look.
 *
 * Two ways out, in order of preference:
 *
 *   1. Amazon OneLink. Amazon redirects each visitor to their own
 *      marketplace and applies the right id. Configured once in the
 *      Associates dashboard, after which a single value in TAG covers every
 *      locale and TAGS_BY_MARKET can go back to empty. This is the fix.
 *
 *   2. Register in each marketplace and add ids to TAGS_BY_MARKET. More
 *      accounts, more thresholds, and each marketplace closes its own
 *      account for inactivity independently.
 *
 * Do not paste a marketplace id into TAG to "cover" the others: an id the
 * marketplace does not recognise earns no more than none, and can in some
 * cases credit the sale elsewhere.
 */

import type { Locale } from "@/lib/i18n";

/**
 * A tag that applies to EVERY marketplace. Empty today, and it should stay
 * empty until OneLink is switched on: a marketplace-specific id put here
 * would be appended to amazon.fr and amazon.es links where it cannot earn,
 * which reads in code as though those links are attributed when they are not.
 */
const TAG = "";

/**
 * Per-marketplace tags. A market absent here gets TAG, and if that is empty
 * the link ships unattributed -- which is correct and honest, rather than
 * carrying an id that marketplace will ignore.
 *
 * skynova07-20 is the US id: the `-20` suffix IS the marketplace. It earns on
 * amazon.com and nowhere else. French, Spanish, Portuguese and Arabic
 * visitors are routed to their own Amazon by MARKET_BY_LOCALE below, so they
 * currently generate no commission at all.
 *
 * The fix is Amazon OneLink, not more entries here: it redirects each visitor
 * to their own marketplace and applies the right id, set up once in the
 * Associates dashboard. Until then this is four-fifths of the locales earning
 * nothing, and it is deliberate -- an invalid id earns no more than no id,
 * and can in some cases credit the sale elsewhere.
 */
const TAGS_BY_MARKET: Partial<Record<string, string>> = {
  "www.amazon.com": "skynova07-20",
};

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

/**
 * Whether links on THIS locale's page actually earn anything.
 *
 * Per-locale, not global, because the answer genuinely differs by locale
 * while only one marketplace has an id. The English page earns and says so;
 * the French page does not and must not claim otherwise. A disclosure that
 * promises a commission the page cannot collect is a small lie told to every
 * French reader, and it costs nothing to get right.
 */
export function gearLinksAreAttributed(locale: Locale = "en"): boolean {
  const market = MARKET_BY_LOCALE[locale] ?? MARKET_BY_LOCALE.en;
  return Boolean(TAGS_BY_MARKET[market] ?? (TAG || ""));
}
