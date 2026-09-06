/**
 * Travelpayouts-network affiliate link helpers.
 *
 * TP_MARKER is the real, live Travelpayouts marker for this account (the
 * same one already used in the tours and car-rentals page widgets --
 * see AffiliateWidget usage in tours.tsx/car-rentals.tsx).
 *
 * Where a partner's real search only works with data we don't have (an
 * airport IATA code for flights, a pickup-location ID for car rentals),
 * the link opens that partner's own live search tool instead of a broken
 * pre-filled query -- a working, blank search beats a pre-filled one that
 * errors out. Where a partner supports a genuine destination deep link
 * (Hotellook's city search, Airalo's per-country eSIM pages, GetYourGuide's
 * text search), the link goes straight to results.
 */
export const TP_MARKER = "720297";

// Flights: Aviasales' real search deep link requires IATA airport codes
// (e.g. "JFK2601LAX1"), not a city or country name -- there's no valid way
// to pre-fill it from a destination name. This opens their live search tool.
export function flightsLink(): string {
  return `https://www.aviasales.com/?marker=${TP_MARKER}`;
}

// Hotels: Hotellook's search does accept a free-text destination plus
// check-in/check-out dates and resolves them itself -- so this goes
// straight to results when a destination is given (defaulting to a
// 3-night stay starting 30 days out).
export function hotelsLink(destinationName?: string): string {
  const params = new URLSearchParams({ marker: TP_MARKER });
  if (destinationName) {
    params.set("destination", destinationName);
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 30);
    const checkOut = new Date();
    checkOut.setDate(checkOut.getDate() + 33);
    params.set("checkIn", checkIn.toISOString().slice(0, 10));
    params.set("checkOut", checkOut.toISOString().slice(0, 10));
    params.set("adults", "2");
  }
  return `https://search.hotellook.com/?${params.toString()}`;
}

// Car rentals: Rentalcars' real search needs a specific pickup-location ID,
// not a free-text place name -- there's no valid way to pre-fill it from a
// destination name. This opens their live search tool.
export function carRentalLink(): string {
  return `https://www.rentalcars.com/?affiliateCode=${TP_MARKER}`;
}

// Airport services: routed to GetTransfer, a real working transfer-booking
// site (the placeholder used earlier, airporttransfer.com, was a dead
// domain and is no longer used).
export function airportServicesLink(): string {
  return `https://gettransfer.com/?marker=${TP_MARKER}`;
}

// Events & tickets: Tiqets has no public free-text search URL (their
// listing pages need a real numeric location ID we don't have -- an
// invalid one silently falls back to a generic page instead of a 404,
// which is worse). This opens their real homepage search instead.
export function eventsLink(): string {
  return `https://www.tiqets.com/en/?partner=${TP_MARKER}`;
}

// eSIM: Airalo publishes a real per-country product page at
// airalo.com/{country-slug}-esim (verified against their live site) --
// since our destination slugs are already kebab-case country names, this
// goes straight to that destination's eSIM product page.
export function esimLink(destinationSlug?: string): string {
  const params = new URLSearchParams({ ref: TP_MARKER });
  if (destinationSlug) {
    return `https://www.airalo.com/${destinationSlug}-esim?${params.toString()}`;
  }
  return `https://www.airalo.com/?${params.toString()}`;
}

// Tours & activities: GetYourGuide's search page takes a free-text query
// and returns real results for it.
export function toursLink(destinationName?: string): string {
  const params = new URLSearchParams({ partner_id: TP_MARKER });
  if (destinationName) params.set("q", destinationName);
  return `https://www.getyourguide.com/s/?${params.toString()}`;
}

// Bike rentals: this vertical doesn't have its own dedicated affiliate
// partner yet -- GetYourGuide lists real bike rentals and cycling tours
// as a genuine category, so this reuses its free-text search rather than
// invent a fake partner link.
export function bikeRentalLink(destinationName?: string): string {
  const params = new URLSearchParams({ partner_id: TP_MARKER });
  params.set("q", destinationName ? `bike rental ${destinationName}` : "bike rental");
  return `https://www.getyourguide.com/s/?${params.toString()}`;
}

/* ---------------------------------------------------------------------------
 * Second partner per vertical.
 *
 * Not to put more buttons on the page, but so no vertical depends on a single
 * programme: if one partner suspends the account, changes terms or simply
 * converts badly in a given market, the vertical still earns. It also gives
 * the visitor a real choice, which the single-partner version never did.
 * ------------------------------------------------------------------------- */

// Attractions & tickets, second to Tiqets. Uses the SAME GetYourGuide search
// already proven by toursLink() -- free-text, real results, and unlike Tiqets
// it can be pre-filled with the destination, so this link lands on results
// for the country rather than on a homepage.
export function attractionsLink(destinationName?: string): string {
  const params = new URLSearchParams({ partner_id: TP_MARKER });
  params.set("q", destinationName ? `${destinationName} attractions and tickets` : "attractions");
  return `https://www.getyourguide.com/s/?${params.toString()}`;
}

/**
 * Discover Cars affiliate id.
 *
 * EMPTY ON PURPOSE, and the UI renders no Discover Cars link until it is set.
 * Their parameter is `a_aid`, which is their own affiliate id -- NOT the
 * Travelpayouts marker above. Shipping this with TP_MARKER in it would look
 * like it worked while sending Discover Cars free traffic with no attribution,
 * which is strictly worse than not having the link at all.
 *
 * To switch it on: Travelpayouts -> Programs -> Discover Cars -> join, then
 * take the id out of the deep link their tool generates and paste it here.
 * Same pattern as CF_BEACON_TOKEN in lib/analytics.tsx: unset renders nothing,
 * so it is safe to ship half-configured.
 */
const DISCOVER_CARS_AID = "";

/** Slugs with no country page on discovercars.com -- verified by request, all
 *  404. Everything else in DESTINATIONS resolves (italy 301s to
 *  /italy-mainland, which is fine). These fall back to the site root. */
const DISCOVER_CARS_NO_COUNTRY_PAGE = new Set([
  "vietnam",
  "united-states",
  "cuba",
  "bahamas",
  "french-polynesia",
  "samoa",
]);

/** Null until DISCOVER_CARS_AID is set, so callers can simply omit the link. */
export function discoverCarsLink(destinationSlug?: string): string | null {
  if (!DISCOVER_CARS_AID) return null;
  const params = new URLSearchParams({ a_aid: DISCOVER_CARS_AID });
  const path =
    destinationSlug && !DISCOVER_CARS_NO_COUNTRY_PAGE.has(destinationSlug)
      ? `/${destinationSlug}`
      : "";
  return `https://www.discovercars.com${path}?${params.toString()}`;
}
