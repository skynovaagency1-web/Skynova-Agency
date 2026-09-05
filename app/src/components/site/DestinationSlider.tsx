import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";

import { DESTINATIONS, PHOTO_SLUG_ORDER } from "@/data/destinations";
import { CardActions } from "./CardActions";

// Only destinations with a real hero photo. The canonical list lives in
// data/destinations.ts -- it was previously copied into three files and had
// drifted apart.
const SLIDER_DESTINATIONS = PHOTO_SLUG_ORDER.map((slug) =>
  DESTINATIONS.find((d) => d.slug === slug),
).filter((d): d is NonNullable<typeof d> => Boolean(d));
const ORIGINAL_COUNT = SLIDER_DESTINATIONS.length;
// Three identical sets so the loop can wrap seamlessly -- see the
// normalize() function below for how it snaps back to the middle set.
const SETS = [0, 1, 2];

export function DestinationSlider() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(ORIGINAL_COUNT);
  const jumpingRef = useRef(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function cardStep() {
      const first = cardRefs.current[0];
      if (!first) return 0;
      const gap = parseFloat(getComputedStyle(track!).columnGap || "0");
      return first.getBoundingClientRect().width + gap;
    }

    function render() {
      const step = cardStep();
      track!.style.transform = `translate3d(${-step * activeRef.current}px, 0, 0)`;
      cardRefs.current.forEach((el, i) => {
        el?.classList.toggle("is-active", i === activeRef.current);
      });
    }

    function normalize() {
      if (activeRef.current >= ORIGINAL_COUNT * 2) {
        jump(activeRef.current - ORIGINAL_COUNT);
      } else if (activeRef.current < ORIGINAL_COUNT) {
        jump(activeRef.current + ORIGINAL_COUNT);
      }
    }

    function jump(index: number) {
      jumpingRef.current = true;
      track!.classList.add("is-jumping");
      activeRef.current = index;
      render();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          track!.classList.remove("is-jumping");
          jumpingRef.current = false;
        });
      });
    }

    function onTransitionEnd() {
      if (!jumpingRef.current) normalize();
    }

    function onResize() {
      render();
    }

    track.addEventListener("transitionend", onTransitionEnd);
    window.addEventListener("resize", onResize);
    render();
    return () => {
      track.removeEventListener("transitionend", onTransitionEnd);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Auto-advance instead of prev/next buttons -- pauses while the pointer
  // is over the slider so a card can actually be read, and is skipped
  // entirely for reduced-motion users.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!pausedRef.current) move(1);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  function move(dir: 1 | -1) {
    activeRef.current += dir;
    const track = trackRef.current;
    if (!track) return;
    const step = (() => {
      const first = cardRefs.current[0];
      if (!first) return 0;
      const gap = parseFloat(getComputedStyle(track).columnGap || "0");
      return first.getBoundingClientRect().width + gap;
    })();
    track.style.transform = `translate3d(${-step * activeRef.current}px, 0, 0)`;
    cardRefs.current.forEach((el, i) => el?.classList.toggle("is-active", i === activeRef.current));
  }

  return (
    <section className="site-section site-hairline border-t" aria-label="Popular destinations slider">
      <div className="site-container">
        <div className="dest-slider-head">
          <div>
            <p className="site-eyebrow mb-3">Popular Right Now</p>
            <h2 className="site-h2 max-w-lg text-3xl md:text-4xl">Destinations worth booking today.</h2>
          </div>
        </div>
      </div>
      <div
        ref={viewportRef}
        className="dest-slider-viewport"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        onTouchStart={() => (pausedRef.current = true)}
        onTouchEnd={() => (pausedRef.current = false)}
      >
        <div ref={trackRef} className="dest-slider-track">
          {SETS.flatMap((setIndex) =>
            SLIDER_DESTINATIONS.map((d, i) => {
              const flatIndex = setIndex * ORIGINAL_COUNT + i;
              return (
                <div
                  key={`${setIndex}-${d.slug}`}
                  ref={(el) => {
                    cardRefs.current[flatIndex] = el;
                  }}
                  className="dest-slider-card glass-bezel"
                >
                  <Link to="/destinations/$slug" params={{ slug: d.slug }} className="dest-slider-card-link">
                    <img src={`/assets/destinations/${d.slug}.webp`} alt={`${d.name} travel scene`} loading="lazy" />
                    <span className="dest-slider-card-scrim" aria-hidden="true" />
                    <span className="dest-slider-card-copy">
                      <span className="dest-slider-card-flag" aria-hidden="true">
                        {d.flag}
                      </span>
                      <span className="dest-slider-card-name">{d.name}</span>
                      <span className="dest-slider-card-hook">{d.hook}</span>
                    </span>
                  </Link>
                  <CardActions slug={d.slug} name={d.name} />
                </div>
              );
            }),
          )}
        </div>
      </div>
    </section>
  );
}
