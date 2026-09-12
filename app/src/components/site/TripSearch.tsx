import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

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
 * Honesty about pre-filling: Hotellook, GetYourGuide and Airalo all take a
 * destination in the URL and land on real results. Aviasales and Rentalcars
 * need IATA / location IDs we cannot derive from a country name (see
 * affiliate.ts), so for those two the link opens the partner's own search
 * and the note under the form says so rather than pretending otherwise.
 */

type Mode = "hotels" | "flights" | "cars" | "tours" | "esim";

const MODES: { id: Mode; labelKey: TKey; partner: string; prefills: boolean }[] = [
  { id: "hotels", labelKey: "search.modeHotels", partner: "Hotellook", prefills: true },
  { id: "flights", labelKey: "search.modeFlights", partner: "Aviasales", prefills: false },
  { id: "cars", labelKey: "search.modeCars", partner: "Rentalcars", prefills: false },
  { id: "tours", labelKey: "search.modeTours", partner: "GetYourGuide", prefills: true },
  { id: "esim", labelKey: "search.modeEsim", partner: "Airalo", prefills: true },
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
        return esimLink(match?.slug);
      case "flights":
        return flightsLink(resolved?.iata);
      case "cars":
        return carRentalLink();
    }
  }, [mode, resolved, checkIn, checkOut, match]);

  // eSIMs are sold per country, so that note names the country even when a
  // city was typed; the others name exactly what gets searched.
  const noteLabel = mode === "esim" ? match?.name : resolved?.label;
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
              <Search size={17} aria-hidden="true" />
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
