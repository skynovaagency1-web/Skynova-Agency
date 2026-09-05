import { useState } from "react";
import { Link } from "@tanstack/react-router";

import { VERTICALS } from "@/data/verticals";

// The homepage's curated 6 (3x2 grid, per an earlier explicit request) --
// the nav's mega menu (see Nav.tsx) shows all 8 from the same shared list.
const FEATURED_KEYS = ["flights", "hotels", "car-rentals", "esim", "tours", "events"];
const FEATURED = FEATURED_KEYS.map((key) => VERTICALS.find((v) => v.key === key)!);

// Same hover/focus-to-preview pattern as the region explorer this
// replaced, laid out as a 3x2 grid of verticals instead of a stacked
// region list -- each tile is a real link to that vertical's own page.
export function VerticalExplorerSection() {
  const [active, setActive] = useState<string>(FEATURED[0].key);
  const current = FEATURED.find((v) => v.key === active) ?? FEATURED[0];

  return (
    <section className="site-section cloud-photo-section">
      <div className="site-container">
        <p className="site-eyebrow mb-3">Explore by vertical</p>
        <h2 className="site-h2 max-w-lg text-3xl md:text-4xl">Every trip, one search away.</h2>
        <div className="vertical-explorer-grid mt-8">
          {FEATURED.map((v) => (
            <Link
              key={v.key}
              to={v.href}
              className={`vertical-explorer-item${active === v.key ? " is-active" : ""}`}
              onMouseEnter={() => setActive(v.key)}
              onFocus={() => setActive(v.key)}
            >
              <v.icon size={20} aria-hidden="true" />
              <span>{v.label}</span>
            </Link>
          ))}
        </div>
        <div className="region-explorer-preview mt-6" aria-live="polite">
          <div key={current.key} className="region-explorer-preview-inner">
            <p className="region-explorer-preview-tag">{current.label}</p>
            <h3 className="region-explorer-preview-title">{current.title}</h3>
            <p className="region-explorer-preview-subtitle">{current.subtitle}</p>
            <Link to={current.href} className="btn-underline mt-5">
              Open {current.label} <span className="arrow">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
