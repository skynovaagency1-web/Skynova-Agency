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

/**
 * Flights: Aviasales' deep link takes a `params` value built from IATA codes,
 * and a destination-only form is valid -- documented as "you can create a
 * link without dates for the pre-filled search form, e.g. PARNYC, or specify
 * only the point of departure: PAR".
 *
 * This site's search collects a destination and no origin, so the link is
 * destination-only: the partner's form opens with the arrival airport already
 * filled, and the visitor picks where they are flying from. That is a real
 * improvement on the blank search this used to open, and it is the most the
 * available data honestly supports.
 *
 * Dates are deliberately NOT appended. The grammar is ORIGIN + DDMM + DEST
 * ("PAR0101NYC") -- the date sits between the two airports, so with no origin
 * there is nowhere valid to put it: "DXB0410" is not a string the parser can
 * read. The documented dateless form is the destination on its own.
 *
 * Without a code (a country, or a city with no commercial airport) the link
 * is exactly what it always was.
 */
export function flightsLink(iata?: string): string {
  const params = new URLSearchParams({ marker: TP_MARKER });
  if (iata) params.set("params", iata);
  return `https://www.aviasales.com/?${params.toString()}`;
}

// Hotels: Hotellook's search does accept a free-text destination plus
// check-in/check-out dates and resolves them itself -- so this goes
// straight to results when a destination is given (defaulting to a
// 3-night stay starting 30 days out).
export function hotelsLink(destinationName?: string, dates?: { checkIn?: string; checkOut?: string }): string {
  const params = new URLSearchParams({ marker: TP_MARKER });
  if (destinationName) {
    params.set("destination", destinationName);
    // Real dates when the visitor gave them (the homepage search does), and
    // the +30/+33 placeholder otherwise. Hotellook needs SOME date range to
    // return prices at all -- with none it lands on an empty search form,
    // which is the one outcome worth avoiding.
    const fallbackIn = new Date();
    fallbackIn.setDate(fallbackIn.getDate() + 30);
    const fallbackOut = new Date();
    fallbackOut.setDate(fallbackOut.getDate() + 33);
    params.set("checkIn", dates?.checkIn || fallbackIn.toISOString().slice(0, 10));
    params.set("checkOut", dates?.checkOut || fallbackOut.toISOString().slice(0, 10));
    params.set("adults", "2");
  }
  return `https://search.hotellook.com/?${params.toString()}`;
}

/**
 * Car rentals: GetRentacar, through the tracking link Travelpayouts issued for
 * this account.
 *
 * This replaces `rentalcars.com/?affiliateCode=720297`, which earned nothing.
 * 720297 is a TRAVELPAYOUTS marker, and `affiliateCode` is RentalCars' own id
 * namespace -- the two are unrelated, so that link sent RentalCars free traffic
 * with no attribution. It is precisely the mistake the DISCOVER_CARS_AID note
 * below describes and refuses to make.
 *
 * Resolving this short link shows what a correctly tracked click looks like:
 *
 *   getrentacar.com/en-US/car-rental
 *     ?track_id=b389a54924874771ac8fb4e35-720297
 *     &utm_source=travelpayouts&utm_medium=partner_cpa
 *
 * The partner's parameter is `track_id`, and the marker is only a SUFFIX
 * inside a longer id the redirector mints per click -- it came back different
 * on every hop of the same chain. So the short link is the thing to publish:
 * expanding it and hard-coding the result would hand every visitor on the site
 * one shared click id, which is a different way of earning nothing.
 *
 * The cost is that it cannot be deep-linked to a destination. No loss here:
 * the link it replaces was a bare homepage too, because RentalCars' search
 * needs a pickup-location ID we do not have.
 */
export function carRentalLink(): string {
  return "https://getrentacar.tpm.li/kSJDKj1G";
}

/**
 * Airport services: GetTransfer, through this account's tracking link.
 *
 * Replaces `gettransfer.com/?marker=720297`. `marker` is Travelpayouts' own
 * parameter name and GetTransfer is not a Travelpayouts-owned site, so it
 * meant nothing to them -- the resolved link shows the parameter they
 * actually read:
 *
 *   gettransfer.com/en?sub_id=cfa051e941b740bfb79fc10c2-720297
 *     &utm_source=travelpayouts&utm_medium=cpa
 */
export function airportServicesLink(): string {
  return "https://gettransfer.tpm.li/bi7xLTDZ";
}

/**
 * Events & tickets: Tiqets, through this account's tracking link.
 *
 * Replaces `tiqets.com/en/?partner=720297`, which put a Travelpayouts marker
 * into Tiqets' own `partner` field. Their real link carries three parameters,
 * and `partner` is not an id at all -- it names the network:
 *
 *   tiqets.com/en/?partner=travelpayouts.com
 *     &tq_campaign=6e51565b90b34ef59f2e66b7e-720297
 *     &tq_click_id=6e51565b90b34ef59f2e66b7e-720297
 *
 * Still their homepage rather than a search: Tiqets' listing pages need a
 * numeric location id we do not have, and an invalid one silently lands on a
 * generic page instead of erroring. That constraint has not changed; only the
 * attribution has.
 */
export function eventsLink(): string {
  return "https://tiqets.tpm.li/riu4Kn7I";
}

/**
 * eSIM: Airalo, through this account's tracking link.
 *
 * THIS TRADES A DEEP LINK FOR ATTRIBUTION, knowingly. The previous version
 * built `airalo.com/{country-slug}-esim?ref=720297`, which landed on exactly
 * the right per-country product page -- genuinely better for the visitor. But
 * `ref` is not a parameter Airalo reads, so every one of those clicks was
 * unattributed, and a deep link that earns nothing is worth less than a
 * homepage link that earns. The short link cannot carry a destination.
 *
 * Airalo is also the one partner here whose link does not contain the marker
 * at all. It routes through Impact rather than Travelpayouts' own redirector:
 *
 *   airalo.com/?irclickid=1wb3pqTx9xyZU5vyl239Azo5Ukr25OxRkVDlTI0
 *     &utm_source=impact&utm_campaign=Travelspark%20Limited
 *
 * `irclickid` is Impact's per-click id and is how the click is tracked, so
 * this is expected rather than broken -- but it is the reason a search for
 * "720297" in the outbound URL comes up empty for this one partner, and worth
 * knowing before anyone concludes it is misconfigured.
 *
 * The destinationSlug parameter is kept so callers need not change; it is
 * accepted and ignored.
 */
export function esimLink(_destinationSlug?: string): string {
  return "https://airalo.tpm.li/eW0hFF6F";
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

/**
 * Second partners, added once real tracking links existed for them.
 *
 * ONE alternate per vertical, not every link available. Three more eSIM
 * providers were on offer (Yesim and Drimsim alongside Saily); a page offering
 * four near-identical eSIM sellers helps nobody choose, and the point of the
 * second partner is resilience and a genuine choice, not a longer list. Those
 * two are deliberately unused rather than forgotten.
 *
 * Go City is the exception that is not really an alternate at all: it sells
 * multi-attraction passes where Tiqets sells single tickets, so the two answer
 * different questions in the same vertical.
 */

/** eSIM, second to Airalo. */
export function esimAltLink(): string {
  return "https://saily.tpm.li/oyqP3Ceg";
}

/** City attraction passes, beside Tiqets' single tickets. */
export function cityPassLink(): string {
  return "https://gocity.tpm.li/ACmthcS2";
}

/** Airport transfers, second to GetTransfer. */
/**
 * Car rentals, second to GetRentacar.
 *
 * Verified end to end on 17 Sep 2026: the short link 302s to
 * autoeurope.eu/luxury.cfm?aff=travelpayoutseu&sub_id=<per-click id>-720297,
 * and Auto Europe's own 301 then strips the query to a clean URL once the
 * click is registered -- the same pattern Hotellook uses handing off to
 * Booking. The bare final address is not a missing parameter.
 *
 * NOTE WHERE IT LANDS: the generated link opens their LUXURY rentals page,
 * not the general search. That is the link as issued; a general one would be
 * the better default for most of this site's traffic, and is worth
 * regenerating if the luxury framing converts badly.
 */
export function carRentalAltLink(): string {
  return "https://autoeurope.tpm.li/U2lUWggg";
}

export function transfersAltLink(): string {
  return "https://tpm.li/iHI3oFXX";
}

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

/* ---------------------------------------------------------------------------
 * Travel protection.
 *
 * Neither of these is a booking, which is why they are not in data/verticals.ts
 * and do not appear in the "kinds of booking" count the homepage reads off it.
 * They are things that pay out when a trip goes wrong.
 *
 * Both are Travelpayouts short links rather than composed URLs, and that is
 * deliberate. Resolving one shows why:
 *
 *   ektatraveling.com/?sub_id=822d723c493e4da1a19f0a893-720297
 *
 * The partner's parameter is `sub_id`, and the marker is only a SUFFIX inside
 * an id the redirector mints fresh on every request -- it came back different
 * on each resolution of the same link. Expanding these and hard-coding the
 * result would give every visitor on the site one shared click id.
 * ------------------------------------------------------------------------- */

/** Compensation for a delayed, cancelled or overbooked flight. Compensair take
 *  a percentage of whatever they recover, which the page says plainly -- a
 *  visitor should not have to find that out from the partner. */
export function flightCompensationLink(): string {
  return "https://compensair.tpm.li/Bpj6H2xG";
}

/** Travel and medical cover, through Ekta.
 *
 *  Note for anyone testing this by hand: a HEAD request to the resolved URL
 *  answers 404 and a GET answers 200. The link is fine; their origin simply
 *  does not serve HEAD. Checking with `curl -I` will tell you it is broken. */
export function travelInsuranceLink(): string {
  return "https://ektatraveling.tpm.li/n0UXWrFZ";
}

/**
 * Yacht and small-ship cruise charter, through Searadar.
 *
 * ⚠ THIS LINK SHOWS NO ATTRIBUTION AND MAY EARN NOTHING. Every other partner
 * link on this page resolves carrying the marker inside the partner's own
 * tracking parameter -- `sub_id`, `track_id`, `tq_click_id`, `aff_sub`. This
 * one does a single 302 to a bare homepage:
 *
 *   https://searadar.tpm.li/A8ZHWPiU  ->  302  ->  https://searadar.com/
 *
 * No query string, and no Set-Cookie anywhere in the chain, so there is no
 * visible mechanism by which a booking would be traced back to this account.
 * It is shipped because a page with no link is worth less than a page with an
 * unproven one, and because the failure is invisible either way -- but it
 * should be regenerated from the Travelpayouts dashboard, or confirmed against
 * a real click in their stats, before anyone counts on income from it.
 */
export function yachtCharterLink(): string {
  return "https://searadar.tpm.li/A8ZHWPiU";
}
