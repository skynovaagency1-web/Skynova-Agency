import { ArrowRight, Plane } from "lucide-react";

// Each route ends at a destination we have a real photo for. No fares are
// shown since Aviasales' link can't be pre-filled with real pricing (see
// lib/affiliate.ts) -- these are inspiration, not a live price feed.
const ROUTES = [
  { fromCity: "London", fromCode: "LON", toCity: "Dubai", toCode: "DXB", toSlug: "dubai" },
  { fromCity: "New York", fromCode: "NYC", toCity: "Paris", toCode: "PAR", toSlug: "paris" },
  { fromCity: "Toronto", fromCode: "YYZ", toCity: "Tokyo", toCode: "TYO", toSlug: "tokyo" },
  { fromCity: "Dubai", fromCode: "DXB", toCity: "Maldives", toCode: "MLE", toSlug: "maldives" },
  { fromCity: "Singapore", fromCode: "SIN", toCity: "Bali", toCode: "DPS", toSlug: "bali" },
  { fromCity: "Johannesburg", fromCode: "JNB", toCity: "Zanzibar", toCode: "ZNZ", toSlug: "zanzibar" },
];

// The flight-path arc is the same shape on every card (the media box is a
// fixed 16/10 aspect ratio at every breakpoint, so a 160x100 viewBox --
// same 1.6 ratio -- scales cleanly everywhere with no distortion) --
// only the endpoints' labels change per route.
const ARC = "M 20 84 Q 80 8 140 26";

export function FlightRoutesSection({ href }: { href: string }) {
  return (
    <section className="site-section pt-0">
      <div className="site-container">
        <p className="site-eyebrow mb-3">Popular routes</p>
        <h2 className="site-h2 max-w-md text-3xl md:text-4xl">Fares worth watching.</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROUTES.map((r, i) => {
            const pathId = `flight-arc-${r.fromCode}-${r.toCode}-${i}`;
            return (
            <a
              key={`${r.fromCode}-${r.toCode}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="route-card flight-route-card"
            >
              <div className="route-card-media">
                <img src={`/assets/destinations/${r.toSlug}.webp`} alt={`${r.toCity} skyline`} loading="lazy" />
                <div className="flight-path-overlay" aria-hidden="true">
                  <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="flight-path-svg">
                    <path id={pathId} d={ARC} className="flight-path-line" />
                    <circle cx="20" cy="84" r="3" className="flight-path-dot flight-path-dot-origin" />
                    <circle cx="140" cy="26" r="3" className="flight-path-dot flight-path-dot-dest" />
                    <g className="flight-path-plane">
                      <Plane size={11} strokeWidth={2.5} />
                      <animateMotion dur="2.4s" repeatCount="indefinite" rotate="auto">
                        <mpath href={`#${pathId}`} xlinkHref={`#${pathId}`} />
                      </animateMotion>
                    </g>
                  </svg>
                  <span className="flight-path-code flight-path-code-origin">{r.fromCode}</span>
                  <span className="flight-path-code flight-path-code-dest">{r.toCode}</span>
                </div>
              </div>
              <div className="route-card-copy">
                <span className="route-card-path">
                  {r.fromCity} <ArrowRight size={14} aria-hidden="true" /> {r.toCity}
                </span>
                <span className="route-card-cta">
                  See fares <span className="arrow">&rarr;</span>
                </span>
              </div>
            </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
