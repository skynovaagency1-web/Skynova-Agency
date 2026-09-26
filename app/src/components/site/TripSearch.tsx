import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatedIcon } from "@/components/ui/animated-icon";

import { SEARCH_OPTIONS, resolvePlace } from "@/data/search-cities";
import { flightsLink, hotelsLink, carRentalLink, toursLink, esimLink } from "@/lib/affiliate";
import { useT, type TKey } from "@/lib/i18n-strings";

/**
 * The homepage's one interactive thing.
 *
 * Until this existed the homepage had exactly one input on it -- the
 * newsletter email field -- so a visitor who arrived wanting to book had to
 * read the nav, pick a vertical and load a second page before they could
 * type anything. Every travel site that converts leads with a search box for
 * that reason.
 *
 * The submit control is a real <a>, never a button with a JS navigation.
 * That is deliberate: OutboundClickTracker counts affiliate clicks with a
 * single delegated listener on document that reads anchor hrefs, so a
 * window.open() here would earn commission that never showed up in the
 * numbers. An anchor also gives middle-click and cmd-click for free.
 *
 * Honesty about pre-filling, and it has to be checked against affiliate.ts
 * rather than remembered. Hotellook takes a destination in the URL and lands
 * on real results; Aviasales does when the place resolves to an IATA code.
 * The other three cannot: Aviasales without a code and GetRentacar need IDs
 * we cannot derive from a country name, and Tiqets and Airalo are reached
 * through short links that mint a per-click id, so anything appended is
 * ignored at best and drops the attribution at worst.
 *
 * `prefills` below said `true` for Airalo and was wrong for months. Airalo
 * USED to take a country slug; that deep link was traded away for a tracking
 * link that earns (see esimLink in affiliate.ts), and this table was not
 * updated with it. The visible result was the site lying to the visitor:
 * typing "Portugal" and choosing eSIM produced the note "Opens Airalo results
 * for Portugal" above a link to Airalo's home page. Measured on the live site
 * before the fix, not inferred.
 *
 * So: a mode prefills only if the link function it calls actually reads the
 * destination. Nothing else is evidence.
 */

type Mode = "hotels" | "flights" | "cars" | "tours" | "esim";

const MODES: { id: Mode; labelKey: TKey; partner: string; prefills: boolean }[] = [
  { id: "hotels", labelKey: "search.modeHotels", partner: "Hotellook", prefills: true },
  { id: "flights", labelKey: "search.modeFlights", partner: "Aviasales", prefills: false },
  { id: "cars", labelKey: "search.modeCars", partner: "GetRentacar", prefills: false },
  { id: "tours", labelKey: "search.modeTours", partner: "Tiqets", prefills: false },
  { id: "esim", labelKey: "search.modeEsim", partner: "Airalo", prefills: false },
];

/** YYYY-MM-DD, `days` from today. */
function isoIn(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function TripSearch() {
  const [mode, setMode] = useState<Mode>("hotels");
  const [query, setQuery] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const t = useT();

  const active = MODES.find((m) => m.id === mode)!;

  // Countries AND their main cities, resolved in data/search-cities.ts. A
  // bare city used to go to Hotellook raw, and "Dubai" landed on Dubai
  // International Airport hotels -- Booking's matcher ranks that airport above
  // the city. Known cities now go out as "City, Country".
  const resolved = useMemo(() => resolvePlace(query), [query]);
  const match = resolved?.destination ?? null;

  const href = useMemo(() => {
    switch (mode) {
      case "hotels":
        return hotelsLink(resolved?.hotelsQuery || undefined, { checkIn, checkOut });
      case "tours":
        return toursLink(resolved?.toursQuery || undefined);
      case "esim":
        // No argument: esimLink accepts a slug for callers that predate the
        // short link and ignores it. Passing one here would read as targeting
        // that does not happen.
        return esimLink();
      case "flights":
        return flightsLink(resolved?.iata);
      case "cars":
        return carRentalLink();
    }
    // `match` is deliberately absent: it was here only for the eSIM branch,
    // which no longer passes a destination to a link that ignored it.
  }, [mode, resolved, checkIn, checkOut]);

  // Names exactly what gets searched. Only the modes that really do pre-fill
  // reach this, so there is no longer an eSIM special case naming a country
  // the link never receives.
  const noteLabel = resolved?.label;
  // Flights pre-fill only when the resolved place has an airport code, so the
  // note has to follow the link rather than the mode.
  const prefills = active.prefills || (mode === "flights" && Boolean(resolved?.iata));
  const note = prefills
    ? noteLabel
      ? t("search.noteResults", { partner: active.partner, place: noteLabel })
      : t("search.notePartner", { partner: active.partner })
    : t("search.noteNoPrefill", { partner: active.partner });

  return (
    <section id="trip-search" className="trip-search-section" aria-labelledby="trip-search-heading">
      <div className="site-container">
        <div className="site-panel trip-search">
          <div className="trip-search-head">
            <p className="site-eyebrow">{t("search.eyebrow")}</p>
            <h2 id="trip-search-heading" className="site-h2 trip-search-title">
              {t("search.heading")}
            </h2>
          </div>

          <div className="trip-search-modes" role="tablist" aria-label={t("search.tablistAria")}>
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={m.id === mode}
                className={`trip-search-chip${m.id === mode ? " is-active" : ""}`}
                onClick={() => setMode(m.id)}
              >
                {t(m.labelKey)}
              </button>
            ))}
          </div>

          <div className="trip-search-row">
            <label className="trip-search-field trip-search-field-grow">
              <span className="trip-search-label">{t("search.destination")}</span>
              <input
                type="text"
                list="trip-search-destinations"
                className="trip-search-input"
                placeholder={t("search.placeholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
            </label>

            {mode === "hotels" ? (
              <>
                <label className="trip-search-field">
                  <span className="trip-search-label">{t("search.checkIn")}</span>
                  <input
                    type="date"
                    className="trip-search-input"
                    min={isoIn(0)}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </label>
                <label className="trip-search-field">
                  <span className="trip-search-label">{t("search.checkOut")}</span>
                  <input
                    type="date"
                    className="trip-search-input"
                    min={checkIn || isoIn(1)}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </label>
              </>
            ) : null}

            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="btn-hero-pill trip-search-go"
            >
              <span className="spark" />
              <AnimatedIcon name="search" size={17} />
              <span>{t("search.go", { what: t(active.labelKey).toLowerCase() })}</span>
            </a>
          </div>

          <datalist id="trip-search-destinations">
            {SEARCH_OPTIONS.map((o) => (
              <option key={o} value={o} />
            ))}
          </datalist>

          <p className="trip-search-note">
            {note}
            {match ? (
              <>
                {" "}
                <Link to="/destinations/$slug" params={{ slug: match.slug }} className="trip-search-guide-link">
                  {t("search.guideLink", { name: match.name })} →
                </Link>
              </>
            ) : null}
          </p>
        </div>
      </div>
    </section>
  );
}
