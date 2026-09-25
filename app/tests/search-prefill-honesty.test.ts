import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  carRentalLink,
  esimLink,
  flightsLink,
  hotelsLink,
  toursLink,
} from "../src/lib/affiliate";

/**
 * The homepage search tells the visitor what its button will do: either
 * "Opens {partner} results for {place}" or "Opens {partner} -- this one
 * cannot be pre-filled". Which sentence appears comes from a `prefills` flag
 * hand-written in TripSearch.tsx, and that flag is not connected to the link
 * functions it describes.
 *
 * So it went stale. Airalo once took a country slug; the deep link was traded
 * for a tracking link that earns, esimLink became a constant, and `prefills`
 * stayed `true`. Typing "Portugal" and choosing eSIM promised "Opens Airalo
 * results for Portugal" and delivered Airalo's home page -- a claim the site
 * made to every visitor who tried it.
 *
 * These tests make the flag answerable to the code: a link function either
 * varies with the destination or it does not, and that is checked here rather
 * than trusted.
 */

const TRIP_SEARCH = readFileSync(
  new URL("../src/components/site/TripSearch.tsx", import.meta.url),
  "utf8",
);

/** Reads `prefills: true|false` out of the MODES table for one mode id. */
function declaredPrefill(modeId: string): boolean {
  const row = new RegExp(`\\{ id: "${modeId}",[^}]*\\}`).exec(TRIP_SEARCH);
  if (!row) throw new Error(`no MODES row for "${modeId}"`);
  return /prefills:\s*true/.test(row[0]);
}

/** Whether a link function's output actually changes with a destination. */
const varies = (link: (d?: string) => string, destination: string) =>
  link(destination) !== link(undefined);

describe("homepage search tells the truth about pre-filling", () => {
  test("partners that take a destination do change their link", () => {
    expect(varies(hotelsLink, "Lisbon, Portugal")).toBe(true);
    // Flights vary only when the place resolved to an airport code, which is
    // why TripSearch computes that mode's note from the link, not the flag.
    expect(varies(flightsLink, "LIS")).toBe(true);
  });

  test("partners reached through a short link do not, and must not claim to", () => {
    // A short link mints the per-click id. Appending a destination is ignored
    // at best and drops the attribution at worst -- see affiliate.ts. These
    // being constant is correct; claiming otherwise in the UI is the bug.
    expect(varies(toursLink, "Lisbon")).toBe(false);
    expect(varies(esimLink, "portugal")).toBe(false);
    expect(carRentalLink()).toBe(carRentalLink());

    expect(declaredPrefill("tours")).toBe(false);
    expect(declaredPrefill("esim")).toBe(false);
    expect(declaredPrefill("cars")).toBe(false);
  });

  test("a mode claims pre-fill only when its link function earns it", () => {
    expect(declaredPrefill("hotels")).toBe(true);
    expect(varies(hotelsLink, "Lisbon, Portugal")).toBe(true);
  });
});
