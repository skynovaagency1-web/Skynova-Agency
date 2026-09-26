import { Suspense, lazy, useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * The destination photos orbiting a particle sphere, on /destinations.
 *
 * DECORATION, AND ONLY DECORATION. Everything inside a canvas is invisible to
 * a crawler, and /destinations' link grid is how forty-two destination pages
 * get found -- so this sits above that grid and replaces none of it. The same
 * rule components/site/Globe3D.tsx states for its orbit chips.
 *
 * LAZY AND GATED, for the same reason OrbitMarkerGlobe is: three,
 * @react-three/fiber and @react-three/drei are about 200KB of chunk, and
 * /destinations is one of only two routes on the site that still render per
 * request (live fares), so it is the last page that should be carrying
 * more work to first paint.
 *
 * TWELVE IMAGES, cut to 256px squares in /assets/cosmos. The destination
 * heroes are 1200x900 and 100-200KB each; at full size a ring of twelve is
 * several megabytes of texture for something drawn at roughly 120px. The
 * crops total 296KB.
 */
const CosmosScene = lazy(() => import("@/components/site/DestinationCosmosScene"));

export function DestinationCosmos() {
  const holderRef = useRef<HTMLDivElement | null>(null);
  const [seen, setSeen] = useState(false);

  // A capability check, derived rather than written from an effect: it cannot
  // change while the page is open, so mirroring it into state would be a
  // render, an effect and a second render for something already known.
  const noObserver = useSyncExternalStore(
    () => () => {},
    () => typeof IntersectionObserver === "undefined",
    () => false,
  );

  // Reduced motion gets no spinning galaxy. Nothing here carries information,
  // so there is nothing to replace it with.
  const reduceMotion = useSyncExternalStore(
    () => () => {},
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  const near = !reduceMotion && (noObserver || seen);

  /**
   * Fade with scroll.
   *
   * Full strength when the band is centred in the viewport, easing off as it
   * leaves in either direction, so it arrives and departs instead of being
   * cut off at the edges of its box. Written to a custom property on this
   * element only -- writing scroll values to :root invalidates style for the
   * whole document on every frame, which this codebase has already had to fix
   * once (see the note on writeVar in Hero.tsx).
   *
   * Read inside rAF, never in the scroll handler: getBoundingClientRect
   * forces layout, and doing that synchronously on every scroll event is how
   * a page starts dropping frames.
   */
  useEffect(() => {
    const el = holderRef.current;
    if (!el || reduceMotion) return;
    let frame = 0;
    let queued = false;

    const apply = () => {
      queued = false;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const centre = rect.top + rect.height / 2;
      // 0 when centred, 1 when the band has just left the viewport.
      const travel = Math.abs(centre - viewport / 2) / (viewport / 2 + rect.height / 2);
      const opacity = Math.min(1, Math.max(0, 1 - travel * 1.25));
      el.style.setProperty("--cosmos-opacity", opacity.toFixed(3));
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

  useEffect(() => {
    const el = holderRef.current;
    if (!el || noObserver || reduceMotion) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [noObserver, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <div ref={holderRef} className="destination-cosmos" aria-hidden="true">
      {near ? (
        <Suspense fallback={null}>
          <CosmosScene />
        </Suspense>
      ) : null}
    </div>
  );
}
