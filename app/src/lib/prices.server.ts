import { getRequestHeader } from "@tanstack/react-start/server";

import { bindings } from "./bindings.server";

/**
 * Cheapest published fares, from the Travelpayouts Data API.
 *
 * Every price on this site has always lived behind an outbound click -- a
 * visitor could not see a number until they had already left. This is the
 * first thing that puts a figure on our own pages.
 *
 * ── Three decisions worth knowing ────────────────────────────────────────
 *
 * ONE CALL PER ORIGIN, NOT PER ROUTE. `v1/city-directions` answers "cheapest
 * fare from X to everywhere" in a single request, so all 42 destination cards
 * are served by one response. The obvious alternative, `v1/prices/cheap` per
 * route, would be forty-two API calls to render one index page, which the
 * rate limit would refuse and which would be slow even if it did not.
 *
 * TWO LAYERS OF CACHE, doing different jobs. The Cache API is per-colo and
 * fast; D1 is global and slow. A colo that has never seen an origin misses the
 * first, and without the second that miss means either a blocking API call in
 * the render path or a card with no price. So: edge first, table second, API
 * last, and the API is reached because the DATA aged out, not because an edge
 * forgot.
 *
 * ABSENCE IS A SUPPORTED STATE, and has to be. No token, API down, unknown
 * origin, route not covered -- every one of those returns null and the card
 * falls back to the affiliate link it has always had. A price is an
 * enhancement; the site works without it, and it must never be the reason a
 * page fails to render.
 */

/** Fares older than this are refetched. Twelve hours because these are cached
 *  aggregates at source -- Travelpayouts is not quoting live inventory -- so a
 *  shorter TTL spends rate limit to re-read a number that has not moved. */
const MAX_AGE_MS = 12 * 60 * 60 * 1000;

/** Edge cache TTL, deliberately shorter than MAX_AGE_MS so the table is what
 *  decides staleness and the edge is only ever a fast path to it. */
const EDGE_TTL_SECONDS = 60 * 60;

const API_BASE = "https://api.travelpayouts.com";

export interface FarePrice {
  /** Whole units in `currency` -- these are "from" prices, never exact. */
  value: number;
  currency: string;
  /** ISO date the fare departs, so the UI can say when it applies. */
  departDate: string | null;
}

/** destination IATA -> cheapest fare found from the origin. */
type FareMap = Record<string, FarePrice>;

/**
 * Departure hub per visitor country.
 *
 * A price with no origin is meaningless -- "Lisbon from 89" is not a claim
 * until it says from where -- and CF-IPCountry is country-level, so this maps
 * a country to the airport most of its outbound traffic actually leaves from.
 *
 * Deliberately incomplete. A country not listed here yields no origin and
 * therefore no price, which is the correct outcome: a fare from the wrong
 * continent is worse than no fare at all, because the visitor cannot tell it
 * is wrong. Extending the list is how coverage grows, never a nearest-guess
 * fallback.
 */
const COUNTRY_HUBS: Record<string, string> = {
  GB: "LON", IE: "DUB", FR: "PAR", DE: "BER", NL: "AMS", BE: "BRU",
  ES: "MAD", PT: "LIS", IT: "ROM", CH: "ZRH", AT: "VIE", DK: "CPH",
  SE: "STO", NO: "OSL", FI: "HEL", PL: "WAW", CZ: "PRG", GR: "ATH",
  RO: "OTP", HU: "BUD", US: "NYC", CA: "YTO", MX: "MEX", BR: "SAO",
  AR: "BUE", AE: "DXB", SA: "RUH", QA: "DOH", EG: "CAI", MA: "CMN",
  ZA: "JNB", TR: "IST", IN: "DEL", SG: "SIN", MY: "KUL", TH: "BKK",
  ID: "JKT", PH: "MNL", VN: "SGN", JP: "TYO", KR: "SEL", CN: "BJS",
  HK: "HKG", AU: "SYD", NZ: "AKL", IL: "TLV", UA: "IEV",
};

/** Currency per country, so a British visitor is not quoted in euros. Same
 *  principle as the hubs: unlisted means the default below, not a guess. */
const COUNTRY_CURRENCY: Record<string, string> = {
  GB: "gbp", US: "usd", CA: "cad", AU: "aud", NZ: "nzd", JP: "jpy",
  CH: "chf", SE: "sek", NO: "nok", DK: "dkk", PL: "pln", CZ: "czk",
  AE: "aed", SA: "sar", IN: "inr", SG: "sgd", BR: "brl", ZA: "zar",
  TR: "try", KR: "krw", CN: "cny", HK: "hkd", TH: "thb", MX: "mxn",
};

const DEFAULT_CURRENCY = "eur";

/** The visitor's departure hub and currency, from Cloudflare's country header.
 *  Null origin when we do not have a hub for their country. */
export function resolveOrigin(): { origin: string | null; currency: string } {
  let country: string | null = null;
  try {
    // Cloudflare sets this on every request that reaches the Worker.
    country = (getRequestHeader("cf-ipcountry") || "").toUpperCase() || null;
  } catch {
    // Called outside a request scope (a build step, a test). No geo, no price.
    return { origin: null, currency: DEFAULT_CURRENCY };
  }
  if (!country || country === "XX" || country === "T1") {
    // XX is Cloudflare's "unknown"; T1 is Tor. Neither implies a departure
    // airport, and guessing one would quote a fare from the wrong continent.
    return { origin: null, currency: DEFAULT_CURRENCY };
  }
  return {
    origin: COUNTRY_HUBS[country] ?? null,
    currency: COUNTRY_CURRENCY[country] ?? DEFAULT_CURRENCY,
  };
}

/** Shape of one entry in the city-directions response. */
interface RawDirection {
  price?: number;
  value?: number;
  depart_date?: string;
  departure_at?: string;
  /** Present on the array shape (prices/latest), absent on the map shape. */
  destination?: string;
}

function reduceResponse(raw: unknown, currency: string): FareMap {
  const out: FareMap = {};
  const data = (raw as { data?: unknown })?.data;
  if (!data || typeof data !== "object") return out;

  /* Two shapes, one reducer. city-directions returns a MAP keyed by
   * destination; prices/latest returns an ARRAY whose entries carry their own
   * `destination`. Normalising here means the endpoint can be swapped without
   * touching anything downstream -- which is exactly what happened once. */
  const entries: [string, RawDirection][] = Array.isArray(data)
    ? (data as RawDirection[])
        .filter((e) => typeof e?.destination === "string")
        .map((e) => [e.destination as string, e])
    : Object.entries(data as Record<string, RawDirection>);

  for (const [destination, entry] of entries) {
    // The endpoint has used both `price` and `value` across versions; take
    // whichever is present rather than pinning to one and silently getting
    // zero prices if they change it again.
    const value = entry?.price ?? entry?.value;
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) continue;
    if (!/^[A-Z]{3}$/.test(destination)) continue;
    const existing = out[destination];
    if (existing && existing.value <= Math.round(value)) continue;
    out[destination] = {
      value: Math.round(value),
      currency,
      departDate:
        typeof entry?.depart_date === "string"
          ? entry.depart_date
          : typeof entry?.departure_at === "string"
            ? entry.departure_at.slice(0, 10)
            : null,
    };
  }
  return out;
}

async function readFromTable(cacheKey: string): Promise<{ fares: FareMap; ageMs: number } | null> {
  const { DB } = bindings();
  if (!DB) return null;
  try {
    const row = await DB.prepare(
      "SELECT payload, fetched_at FROM flight_prices WHERE cache_key = ?",
    )
      .bind(cacheKey)
      .first<{ payload: string; fetched_at: string }>();
    if (!row) return null;
    // SQLite's datetime('now') is UTC without a zone marker; make that explicit
    // or the parse is read as local time and the age comes out hours wrong.
    const fetchedAt = Date.parse(`${row.fetched_at.replace(" ", "T")}Z`);
    if (!Number.isFinite(fetchedAt)) return null;
    return { fares: JSON.parse(row.payload) as FareMap, ageMs: Date.now() - fetchedAt };
  } catch {
    return null;
  }
}

async function writeToTable(cacheKey: string, origin: string, currency: string, fares: FareMap) {
  const { DB } = bindings();
  if (!DB) return;
  try {
    await DB.prepare(
      "INSERT INTO flight_prices (cache_key, origin_iata, currency, payload, fetched_at)" +
        " VALUES (?, ?, ?, ?, datetime('now'))" +
        " ON CONFLICT(cache_key) DO UPDATE SET payload = excluded.payload," +
        " fetched_at = excluded.fetched_at",
    )
      .bind(cacheKey, origin, currency, JSON.stringify(fares))
      .run();
  } catch (error) {
    // A price that cannot be cached is still a price worth returning.
    console.error("flight_prices write failed", error);
  }
}

async function fetchFromApi(origin: string, currency: string): Promise<FareMap | null> {
  const { TRAVELPAYOUTS_TOKEN } = bindings();
  if (!TRAVELPAYOUTS_TOKEN) return null;

  /* v2/prices/latest, NOT v1/city-directions.
   *
   * city-directions answers "where is cheap from here" and returns about
   * thirty budget routes. Measured from Paris it gave Algiers, Marrakesh and
   * the like -- and this site's destinations are Zanzibar, Samoa, Namibia,
   * the Bahamas. The intersection was exactly zero, so every card rendered
   * without a price while the API reported a perfectly healthy 200.
   *
   * latest answers "what have fares been on routes from here", takes the same
   * single request, and returns up to a thousand of them -- which is wide
   * enough to actually contain the places we sell. */
  const url =
    `${API_BASE}/v2/prices/latest?origin=${origin}&currency=${currency}` +
    `&limit=1000&one_way=false&show_to_affiliates=true&period_type=year`;

  // A HARD CEILING ON THE RENDER PATH. The destinations route awaits this in
  // its loader, so without a timeout an upstream having a slow day becomes our
  // page having a slow day -- and the thing being waited for is a decorative
  // "from" figure. Two and a half seconds is longer than the API needs when it
  // is healthy and shorter than a visitor will wait for a price they did not
  // ask for. On abort the caller falls back to the stored copy, or to no price.
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 2500);

  try {
    const response = await fetch(url, {
      headers: { "X-Access-Token": TRAVELPAYOUTS_TOKEN, Accept: "application/json" },
      signal: abort.signal,
      // Belt and braces with the caches below: this also lets Cloudflare
      // collapse concurrent identical requests from the same colo.
      cf: { cacheTtl: EDGE_TTL_SECONDS, cacheEverything: true },
    } as RequestInit);
    if (!response.ok) {
      console.error("travelpayouts prices", response.status, origin, currency);
      return null;
    }
    const fares = reduceResponse(await response.json(), currency);
    return Object.keys(fares).length > 0 ? fares : null;
  } catch (error) {
    console.error("travelpayouts prices failed", error);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Cheapest fares from the visitor's hub to every destination we cover.
 *
 * Returns an empty map rather than throwing on every failure path, so a caller
 * can render a card with or without a price using the same code.
 */
export async function getFaresForVisitor(): Promise<{ fares: FareMap; origin: string | null }> {
  const { origin, currency } = resolveOrigin();
  if (!origin) return { fares: {}, origin: null };

  const cacheKey = `v3:${origin}:${currency}`;
  const edgeUrl = `https://prices.internal/${encodeURIComponent(cacheKey)}`;

  // 1. Edge, per-colo and fastest.
  try {
    const cache = (globalThis as unknown as { caches?: { default?: Cache } }).caches?.default;
    if (cache) {
      const hit = await cache.match(edgeUrl);
      if (hit) return { fares: (await hit.json()) as FareMap, origin };
    }
  } catch {
    // Cache API absent (dev under Node). Fall through.
  }

  // 2. Table, global. Serve it when it is fresh enough; otherwise it is only
  //    a fallback for when the API below fails.
  const stored = await readFromTable(cacheKey);
  if (stored && stored.ageMs < MAX_AGE_MS) {
    await putEdge(edgeUrl, stored.fares);
    return { fares: stored.fares, origin };
  }

  // 3. The API. Last, and only because the data aged out.
  const fresh = await fetchFromApi(origin, currency);
  if (fresh) {
    await writeToTable(cacheKey, origin, currency, fresh);
    await putEdge(edgeUrl, fresh);
    return { fares: fresh, origin };
  }

  // The API failed and we have a stale copy: a price from yesterday beats no
  // price, because it is a "from" figure either way.
  if (stored) return { fares: stored.fares, origin };
  return { fares: {}, origin };
}

async function putEdge(url: string, fares: FareMap) {
  try {
    const cache = (globalThis as unknown as { caches?: { default?: Cache } }).caches?.default;
    if (!cache) return;
    await cache.put(
      url,
      new Response(JSON.stringify(fares), {
        headers: {
          "content-type": "application/json",
          "cache-control": `max-age=${EDGE_TTL_SECONDS}`,
        },
      }),
    );
  } catch {
    // Caching is an optimisation; failing to cache is not a failure.
  }
}
