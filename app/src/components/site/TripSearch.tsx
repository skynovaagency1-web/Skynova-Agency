import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { DESTINATIONS } from "@/data/destinations";
import { flightsLink, hotelsLink, carRentalLink, toursLink, esimLink } from "@/lib/affiliate";

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

const MODES: { id: Mode; label: string; partner: string; prefills: boolean }[] = [
  { id: "hotels", label: "Hotels", partner: "Hotellook", prefills: true },
  { id: "flights", label: "Flights", partner: "Aviasales", prefills: false },
  { id: "cars", label: "Car rental", partner: "Rentalcars", prefills: false },
  { id: "tours", label: "Tours", partner: "GetYourGuide", prefills: true },
  { id: "esim", label: "eSIM", partner: "Airalo", prefills: true },
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

  const active = MODES.find((m) => m.id === mode)!;

  // Exact name first, then prefix. Typing "port" should reach Portugal, but
  // an exact "Jordan" must never be beaten by a longer prefix match.
  const match = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return (
      DESTINATIONS.find((d) => d.name.toLowerCase() === q) ??
      DESTINATIONS.find((d) => d.name.toLowerCase().startsWith(q)) ??
      null
    );
  }, [query]);

  const place = match?.name ?? query.trim();

  const href = useMemo(() => {
    switch (mode) {
      case "hotels":
        return hotelsLink(place || undefined, { checkIn, checkOut });
      case "tours":
        return toursLink(place || undefined);
      case "esim":
        return esimLink(match?.slug);
      case "flights":
        return flightsLink();
      case "cars":
        return carRentalLink();
    }
  }, [mode, place, checkIn, checkOut, match]);

  const note = active.prefills
    ? place
      ? `Opens ${active.partner} results for ${place}.`
      : `Opens ${active.partner}. Add a destination to land straight on results.`
    : `Opens ${active.partner}' own search — they need airport and pickup codes, so we don't guess them for you.`;

  return (
    <section id="trip-search" className="trip-search-section" aria-labelledby="trip-search-heading">
      <div className="site-container">
        <div className="site-panel trip-search">
          <div className="trip-search-head">
            <p className="site-eyebrow">Plan it here</p>
            <h2 id="trip-search-heading" className="site-h2 trip-search-title">
              Where are you going?
            </h2>
          </div>

          <div className="trip-search-modes" role="tablist" aria-label="What to search">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={m.id === mode}
                className={`trip-search-chip${m.id === mode ? " is-active" : ""}`}
                onClick={() => setMode(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="trip-search-row">
            <label className="trip-search-field trip-search-field-grow">
              <span className="trip-search-label">Destination</span>
              <input
                type="text"
                list="trip-search-destinations"
                className="trip-search-input"
                placeholder="Portugal, Japan, Kenya…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
            </label>

            {mode === "hotels" ? (
              <>
                <label className="trip-search-field">
                  <span className="trip-search-label">Check in</span>
                  <input
                    type="date"
                    className="trip-search-input"
                    min={isoIn(0)}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </label>
                <label className="trip-search-field">
                  <span className="trip-search-label">Check out</span>
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
              <span>Search {active.label.toLowerCase()}</span>
            </a>
          </div>

          <datalist id="trip-search-destinations">
            {DESTINATIONS.map((d) => (
              <option key={d.slug} value={d.name} />
            ))}
          </datalist>

          <p className="trip-search-note">
            {note}
            {match ? (
              <>
                {" "}
                <Link to="/destinations/$slug" params={{ slug: match.slug }} className="trip-search-guide-link">
                  Read the {match.name} guide first →
                </Link>
              </>
            ) : null}
          </p>
        </div>
      </div>
    </section>
  );
}
