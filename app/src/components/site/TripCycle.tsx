import type { ReactNode } from "react";

/**
 * Four small glass cards in a row -- one per stage of a trip.
 *
 * Adapted from the "Cycle of Vitality" reference: surfaces lit from INSIDE
 * rather than merely translucent, each icon sitting on its own pool of
 * coloured light. The reference's pastel blue and lilac were dropped, as
 * they fight this site's cream-and-gold ground; the glow is warm instead.
 *
 * Started life as a single wide card holding all the phases, which was too
 * heavy for the page -- four separate cards carry the same idea at a quarter
 * of the visual weight each.
 *
 * Class names are prefixed `cycle-` and were checked against the stylesheet
 * before use: the marquee shipped with names that collided with an existing
 * component and silently restyled it.
 */

type Phase = {
  key: string;
  label: string;
  body: string;
  /** Inline SVG rather than an emoji, so the glow can sit behind the shape. */
  icon: ReactNode;
};

const PHASES: Phase[] = [
  {
    key: "depart",
    label: "Depart",
    body: "Flights and airport transfers, sorted before you leave.",
    icon: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="8" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <line
            key={a}
            x1="20"
            y1="5"
            x2="20"
            y2="9.5"
            transform={`rotate(${a} 20 20)`}
            strokeLinecap="round"
          />
        ))}
      </svg>
    ),
  },
  {
    key: "connect",
    label: "Connect",
    body: "An eSIM that works the moment you land.",
    icon: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="29" r="2.6" />
        {[7, 13, 19].map((r, i) => (
          <path
            key={r}
            d={`M ${20 - r} ${29 - r * 0.62} A ${r} ${r} 0 0 1 ${20 + r} ${29 - r * 0.62}`}
            strokeLinecap="round"
            opacity={1 - i * 0.22}
          />
        ))}
      </svg>
    ),
  },
  {
    key: "explore",
    label: "Explore",
    body: "Tours, tickets and events worth booking ahead.",
    icon: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <ellipse key={a} cx="20" cy="13.5" rx="4.2" ry="7.4" transform={`rotate(${a} 20 20)`} />
        ))}
        <circle cx="20" cy="20" r="3.1" />
      </svg>
    ),
  },
  {
    key: "rest",
    label: "Rest",
    body: "Stays and a car, booked with the partner direct.",
    icon: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path d="M27.5 24.5A11 11 0 0 1 15.5 8a11.5 11.5 0 1 0 12 16.5Z" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function TripCycle() {
  return (
    <section className="cycle-section">
      <div className="cycle-glow" aria-hidden="true" />
      {/* The light ribbon. It sits BEHIND the cards, which is the whole
          point of the effect: the glass blurs the section of ribbon passing
          under it, so the light reads sharp above and below each card and
          soft through it. Purely decorative, so it is hidden from readers. */}
      <svg className="cycle-ribbon" viewBox="0 0 1200 420" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="cycleRibbon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c9a227" stopOpacity="0" />
            <stop offset="18%" stopColor="#e8b53f" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ffd98a" stopOpacity="1" />
            <stop offset="82%" stopColor="#e8b53f" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
          </linearGradient>
          <filter id="cycleRibbonGlow" x="-20%" y="-60%" width="140%" height="220%">
            <feGaussianBlur stdDeviation="14" result="wide" />
            <feMerge>
              <feMergeNode in="wide" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Broad soft pass for the bloom, then a tight bright core on top --
            one stroke alone reads as a flat line rather than light. */}
        <path className="cycle-ribbon-glow" d="M -40 300 C 240 120, 420 400, 640 210 S 1020 40, 1240 150" />
        <path className="cycle-ribbon-core" d="M -40 300 C 240 120, 420 400, 640 210 S 1020 40, 1240 150" />
      </svg>
      <div className="site-container">
        <p className="site-eyebrow cycle-eyebrow">One trip, four moments</p>
        <div className="cycle-grid">
          {PHASES.map((p) => (
            <div key={p.key} className={`cycle-card cycle-phase-${p.key}`}>
              <span className="cycle-icon">{p.icon}</span>
              <p className="cycle-label">{p.label}</p>
              <p className="cycle-body">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
