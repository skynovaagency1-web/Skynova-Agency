import { Suspense, lazy, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { DayNightToggle } from "@/components/site/DayNightToggle";
import { applyThemeMode, getThemeMode, DEFAULT_THEME } from "@/lib/theme-mode";
import { flightAt } from "@/lib/globe-flight";

/**
 * The flight hero: a pinned track down which the camera falls from orbit to
 * Paris.
 *
 * PINNED, because that is what was asked for. The stage is sticky inside a
 * tall track -- the same device ScrollStage uses -- so the reader's scroll
 * drives the camera rather than moving the page, and the page resumes the
 * moment the track ends. No ScrollTrigger: gsap is in the bundle already, but
 * its pinning would want to own a layout that has a sticky nav and its own
 * stage, and a scroll listener writing one number is fewer moving parts.
 *
 * NOBODY IS HELD. The track is 220vh, so the whole flight is roughly two
 * screens of scrolling and it always advances -- unlike a timed hold, there
 * is no moment where scrolling does nothing. A reader who keeps going reaches
 * the page; a reader who stops sees the planet turning.
 *
 * Reduced motion gets the arrival state outright: Paris centred, no flight,
 * no idle spin. There is nothing here that carries information, so there is
 * nothing to replace it with.
 */
const Scene = lazy(() => import("@/components/site/HeroGlobeScene"));

export function HeroGlobeFlight() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  /** The single number the whole scene is a function of. A ref, not state:
   *  sixty state updates a second re-render the tree that is trying to
   *  animate smoothly. */
  const progressRef = useRef(0);

  const reduceMotion = useSyncExternalStore(
    () => () => {},
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  // Mounted only once the hero is actually on screen, so a visitor who lands
  // deeper in the page never pays for the renderer.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    applyThemeMode(getThemeMode());
    return () => applyThemeMode(DEFAULT_THEME);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (reduceMotion) {
      progressRef.current = 1;
      copyRef.current?.style.setProperty("opacity", "0");
      return;
    }

    let frame = 0;
    let queued = false;

    const apply = () => {
      queued = false;
      const rect = track.getBoundingClientRect();
      // Progress across the track's own travel, not the document's: the hero
      // owns its scroll and nothing below it changes what the camera does.
      const travel = rect.height - window.innerHeight;
      const t = travel > 0 ? Math.min(Math.max(-rect.top / travel, 0), 1) : 0;
      progressRef.current = t;
      // The copy is DOM, so it is faded here rather than in the frame loop.
      copyRef.current?.style.setProperty("opacity", flightAt(t).copy.toFixed(3));
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(apply);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduceMotion]);

  return (
    <div ref={trackRef} className="globeflight-track">
      <section id="hero" className="globeflight-stage hero-stage-portal">
        <div className="globeflight-canvas" aria-hidden="true">
          {mounted && !reduceMotion ? (
            <Suspense fallback={null}>
              <Scene progressRef={progressRef} />
            </Suspense>
          ) : null}
        </div>

        <div ref={copyRef} className="globeflight-copy">
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

        <DayNightToggle className="globeflight-daynight" />
      </section>
    </div>
  );
}
