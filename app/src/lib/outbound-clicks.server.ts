import { bindings } from "./bindings.server";

/**
 * Records one outbound affiliate click.
 *
 * Served from `server.ts` rather than a TanStack server function, because the
 * client sends these with `navigator.sendBeacon`. A beacon is a plain POST
 * that the browser keeps alive across the navigation the click causes -- and
 * that survival is the point: many affiliate links open in the same tab, and
 * a normal fetch is cancelled the moment the page starts unloading, which
 * would silently drop exactly the clicks we most want to count.
 *
 * Everything here is allow-listed. The endpoint is public and unauthenticated
 * (it has to be), so it must be impossible to write anything into the table
 * that this file did not choose: free-text fields would make the table a
 * dumping ground for whatever anyone felt like POSTing.
 */

/** The only verticals that can be written. Anything else is dropped. */
const VERTICALS = new Set([
  "flights",
  "hotels",
  "cars",
  "tours",
  "events",
  "esim",
  "transfers",
  "bikes",
]);

/** Partner hosts we knowingly link to, mapped to the vertical they serve.
 *  The client sends the host it is about to open; anything not on this list
 *  is not an affiliate click and is ignored. */
export const PARTNER_VERTICALS: Record<string, string> = {
  "www.aviasales.com": "flights",
  "aviasales.com": "flights",
  "search.hotellook.com": "hotels",
  "hotellook.com": "hotels",
  "www.rentalcars.com": "cars",
  "rentalcars.com": "cars",
  "gettransfer.com": "transfers",
  "www.tiqets.com": "events",
  "tiqets.com": "events",
  "www.airalo.com": "esim",
  "airalo.com": "esim",
  "www.getyourguide.com": "tours",
  "getyourguide.com": "tours",
};

/** Slug-shaped and bounded, so the column cannot be used for free text. */
const SLUG = /^[a-z0-9-]{1,64}$/;
/** Path only, no query, no fragment, bounded. */
const PATH = /^\/[A-Za-z0-9\-._~/]{0,120}$/;

export async function handleOutboundClick(request: Request): Promise<Response> {
  // 204 on every path below, including the rejections. This endpoint exists
  // to count things; telling a caller their payload was malformed serves no
  // one, and a beacon cannot read the response anyway.
  const noContent = new Response(null, { status: 204 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return noContent;
  }
  if (!body || typeof body !== "object") return noContent;

  const { partner, vertical, destinationSlug, pagePath } = body as Record<string, unknown>;

  if (typeof partner !== "string" || !(partner in PARTNER_VERTICALS)) return noContent;
  // The vertical is taken from OUR map, not from the payload -- the client's
  // value is only accepted when it agrees with what the host implies, so a
  // caller cannot file hotel clicks under flights.
  const resolved = PARTNER_VERTICALS[partner];
  if (typeof vertical === "string" && vertical !== resolved) return noContent;
  if (!VERTICALS.has(resolved)) return noContent;

  const path = typeof pagePath === "string" && PATH.test(pagePath) ? pagePath : null;
  if (!path) return noContent;

  const slug =
    typeof destinationSlug === "string" && SLUG.test(destinationSlug) ? destinationSlug : null;

  const { DB } = bindings();
  if (!DB) return noContent;

  try {
    await DB.prepare(
      "INSERT INTO outbound_clicks (id, vertical, partner, destination_slug, page_path)" +
        " VALUES (?, ?, ?, ?, ?)",
    )
      .bind(crypto.randomUUID(), resolved, partner, slug, path)
      .run();
  } catch (error) {
    // A failed count must never surface to the visitor -- they are on their
    // way to a booking partner and this is bookkeeping.
    console.error("outbound click insert failed", error);
  }

  return noContent;
}
