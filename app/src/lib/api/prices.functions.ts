import { createServerFn } from "@tanstack/react-start";

import { DESTINATION_IATA } from "../../data/search-cities";
import { getFaresForVisitor } from "../prices.server";

/** What a card needs to render a price, and nothing more. */
export interface DestinationFare {
  value: number;
  currency: string;
  departDate: string | null;
}

export interface VisitorFares {
  /** Keyed by destination SLUG, so a card looks up its own price with the id
   *  it already has and knows nothing about airport codes. */
  bySlug: Record<string, DestinationFare>;
  /** The hub these are quoted from, for the "from London" label. Null when we
   *  have no hub for the visitor's country, in which case bySlug is empty. */
  origin: string | null;
}

/**
 * Cheapest fare to each destination, from wherever the visitor is.
 *
 * Returns an empty map on every failure path rather than throwing: no token,
 * no geo, API down, route not covered. A price is an enhancement on top of the
 * affiliate link that has always been there, and must never be the reason a
 * page fails to render.
 *
 * The translation from airport code to destination slug happens HERE rather
 * than in the component, so the UI never learns what an IATA code is and the
 * mapping has exactly one home.
 */
export const getVisitorFares = createServerFn({ method: "GET" }).handler(
  async (): Promise<VisitorFares> => {
    const { fares, origin } = await getFaresForVisitor();
    if (!origin) return { bySlug: {}, origin: null };

    const bySlug: Record<string, DestinationFare> = {};
    for (const [slug, iata] of Object.entries(DESTINATION_IATA)) {
      const fare = fares[iata];
      if (!fare) continue;
      // A fare from a hub to itself is a quirk of the endpoint, not an offer.
      if (iata === origin) continue;
      bySlug[slug] = {
        value: fare.value,
        currency: fare.currency,
        departDate: fare.departDate,
      };
    }
    return { bySlug, origin };
  },
);
