import { useEffect } from "react";

import { Globe3D } from "@/components/site/Globe3D";
import { HeroCards } from "@/components/site/HeroCards";
import { DayNightToggle } from "@/components/site/DayNightToggle";
import { applyThemeMode, getThemeMode, DEFAULT_THEME } from "@/lib/theme-mode";

/**
 * The WebGL globe as the hero, on screen from the first paint.
 *
 * HeroStage.tsx put a cheap CSS globe in the hero and flew it down five
 * screens of scroll to hand over to this real one in "Fly anywhere"; HeroPlay
 * held the page while a clip ran to the window. This does neither. The planet
 * is simply there, the aircraft orbits it, and the page scrolls normally from
 * the first frame.
 *
 * NO HANDOFF, AND NOTHING TO ARRANGE. Globe3D already covers this case: it
 * subscribes to lib/globe-handoff.ts, which reports `docked` as true whenever
 * no travelling stage is mounted, precisely so the globe can never sit
 * invisible waiting for a handoff that is not coming. This component simply
 * never calls setStagePresent, so the globe shows itself.
 *
 * WHAT IT COSTS, since globe-handoff.ts warns against exactly this ("pulling
 * that into the hero would put the whole model in front of the first paint"):
 *
 *   earth.glb           3.18MB  <- genuinely new in the critical path
 *   airliner.glb        373KB   ] already fetched on every page: FlightRail
 *   three               724KB   ] is mounted in routes/__root.tsx and
 *   GLTFLoader          45KB    ] dynamically imports all three already
 *
 * So the marginal cost is the earth, not the stack -- and it replaces a hero
 * that shipped 3.7MB of MP4 on desktop. That note was written when the hero
 * was the only thing that would have pulled three.js in; it is not any more.
 *
 * Mobile is the side that loses: the portrait cut of the clip was 2.6MB, so
 * a phone pays about 600KB more here than it did, for a model that is the
 * same size on every screen.
 */
export function HeroOrbit() {
  // Night mode is scoped to this page by mounting, the same way Hero.tsx,
  // HeroStage.tsx and HeroPlay.tsx all do it: the attribute goes on <html> so
  // CSS can reach .site-body, and comes off when the hero unmounts. Without
  // it, choosing night here and clicking through to /hotels leaves a dark
  // ground under sections that have no dark styles at all.
  useEffect(() => {
    applyThemeMode(getThemeMode());
    return () => applyThemeMode(DEFAULT_THEME);
  }, []);

  return (
    <section id="hero" className="hero-stage hero-stage-portal heroorbit-stage">
      {/* Behind everything, and not interactive: the destination links that
          matter for crawling live in the sections below, and Globe3D's own
          canvas is pointer-events: none for the same reason. */}
      <div className="heroorbit-globe" aria-hidden="true">
        <Globe3D className="heroorbit-globe-canvas" />
      </div>

      <div className="hero-copy heroorbit-copy">
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
      <p className="heroplay-hint">Scroll</p>
    </section>
  );
}
