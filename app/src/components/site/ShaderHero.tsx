import { useEffect, useRef } from "react";
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
 * --hero-grow is pinned to 1, the state the old hero reaches at the end of its
 * run where the copy is fully composed in. It never changes here.
 *
 * --hero-progress is NOT pinned -- it is written from scroll, below, so the
 * cards fade as the reader starts moving. The CSS that consumes it already
 * exists and is unchanged; this only supplies the number Hero.tsx would
 * otherwise be supplying.
 *
 * An earlier version of this file pinned both and claimed "nothing moves, so
 * nothing collides". That was wrong, and measurably so: the bottom card strip
 * sat across the copy by 16,385px at 1440x900. The two were never laid out
 * around each other because in the boarding hero they are never visible at the
 * same time. The layout fix lives in styles.css under .shader-hero.
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

/** Fully faded by the time a quarter of the hero has passed. The CSS multiplies
 *  progress by 3.4, so the cards are gone at ~0.29 -- brisk enough that they
 *  clear before the reader is properly into the page. */
const FADE_OVER = 0.9;

export function ShaderHero() {
  const layersRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = layersRef.current;
    if (!el) return;

    // Read in rAF, never in the scroll handler itself: getBoundingClientRect
    // forces layout, and doing that synchronously on every scroll event is how
    // a hero starts dropping frames on a phone.
    let frame = 0;
    let queued = false;

    const apply = () => {
      queued = false;
      const stage = el.parentElement;
      if (!stage) return;
      const height = stage.offsetHeight || 1;
      const progress = Math.min(1, Math.max(0, window.scrollY / (height * FADE_OVER)));
      el.style.setProperty("--hero-progress", progress.toFixed(4));
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
        /* hero-stage-portal is not decoration: it carries the light-text
       overrides (.hero-stage-portal .hero-copy, .site-eyebrow,
       .site-ink-muted, .btn-ghost-link) that were written for a dark hero.
       Without it the copy is near-black on a near-black shader. */
    <section
      id="hero"
      className="hero-stage hero-stage-portal shader-hero relative w-full overflow-hidden bg-black"
    >
      <ShaderBackground />

      {/* Above the canvas. The shader paints the full stage, so everything
          here needs to sit on its own layer. */}
      <div ref={layersRef} className="hero-shader-layers relative z-10 h-full" style={PINNED}>
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
