import type { CSSProperties } from "react";

import { ShaderBackground } from "@/components/ui/animated-shader-hero";
import { HeroCards } from "@/components/site/HeroCards";
import { DayNightToggle } from "@/components/site/DayNightToggle";

/**
 * The boarding-sequence hero's copy and cards, over the animated shader
 * instead of the frame sequence.
 *
 * A PREVIEW, not a replacement. Hero.tsx is untouched and still what the
 * homepage renders; this exists so the two can be looked at side by side
 * before anything is decided.
 *
 * WHY THE CSS VARIABLES ARE PINNED HERE. Both .hero-copy and .hero-cards are
 * driven by --hero-grow and --hero-progress, which Hero.tsx writes on every
 * scroll tick. This hero has no such loop -- the shader is on its own clock
 * and nothing here reads scroll position -- so both would fall back to their
 * defaults, and the defaults are not neutral:
 *
 *   .hero-copy   opacity: clamp(0, (var(--hero-grow, 0) - .85) * 6.7, 1)
 *                -> 0 at rest. The copy would never appear at all.
 *   .hero-cards  opacity: clamp(0, 1 - var(--hero-progress, 0) * 3.4, 1)
 *                -> 1 at rest. The cards are already correct.
 *
 * So --hero-grow is pinned to 1 (the state the old hero reaches at the end of
 * its run, where the copy is fully composed in) and --hero-progress to 0 (the
 * state where the cards are fully present). That is the one combination where
 * both layers show at once -- in the old hero they deliberately never do,
 * because the cards fade out as the copy arrives so the two never share the
 * stage. Here nothing moves, so nothing collides.
 */

/* STRINGS, not numbers. React writes custom properties through
   style.setProperty, and a numeric value for a `--custom-prop` does not
   serialise -- the declaration is dropped silently and the variable falls back
   to its default. Measured: with numbers here .hero-copy computed to
   opacity 0, which is exactly the "never appears" case the comment above
   warns about. */
const PINNED = {
  "--hero-grow": "1",
  "--hero-progress": "0",
} as CSSProperties;

export function ShaderHero() {
  return (
        /* hero-stage-portal is not decoration: it carries the light-text
       overrides (.hero-stage-portal .hero-copy, .site-eyebrow,
       .site-ink-muted, .btn-ghost-link) that were written for a dark hero.
       Without it the copy is near-black on a near-black shader. */
    <section
      id="hero"
      className="hero-stage hero-stage-portal relative w-full overflow-hidden bg-black"
    >
      <ShaderBackground />

      {/* Above the canvas. The shader paints the full stage, so everything
          here needs to sit on its own layer. */}
      <div className="relative z-10 h-full" style={PINNED}>
        <div className="hero-copy">
          <div className="site-container">
            <p className="site-eyebrow mb-4">Skynova Agency</p>
            <h1 className="site-h2 max-w-2xl text-4xl md:text-6xl">Every trip. One place.</h1>
            <p className="site-ink-muted mt-4 max-w-lg text-base leading-relaxed">
              Flights, stays, cars, connectivity, tickets and tours &mdash; compared in one place,
              booked with trusted travel partners at no extra cost.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <a href="/#trip-search" className="btn-hero-pill">
                <span className="spark" />
                <span>Start your trip</span>
              </a>
              <a href="/#how-it-works" className="btn-ghost-link">
                See how it works <span className="arrow">&rarr;</span>
              </a>
            </div>
          </div>
        </div>

        <DayNightToggle className="hero-daynight" />
        <HeroCards />
      </div>
    </section>
  );
}
