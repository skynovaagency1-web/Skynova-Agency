import { useEffect } from "react";

/**
 * Lenis smooth scrolling, scoped to whichever route mounts it.
 *
 * Deliberately NOT mounted in __root.tsx. The homepage drives three scrubbed
 * hero canvases, the flight rail and the marquee straight off scroll
 * position; interposing an easing layer under all of that is how you get a
 * hero that lags the wheel. The destination pages are ordinary long documents
 * with nothing reading scroll, which is exactly where smoothing pays off.
 *
 * Because it lives in a route component, unmounting is the whole scoping
 * mechanism: navigating away calls destroy(), which unbinds the wheel handler
 * and drops the `lenis` classes, so the rest of the site scrolls natively.
 *
 * Two behaviours worth knowing:
 *   - `syncTouch` stays off. Touch devices already have momentum scrolling in
 *     hardware; Lenis re-implementing it on top reads as lag on a phone.
 *   - prefers-reduced-motion skips the library entirely rather than
 *     configuring it to be less lively -- smoothing IS the motion here.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;
    let raf = 0;
    let cancelled = false;

    void (async () => {
      let Lenis: typeof import("lenis").default;
      try {
        // Dynamic, so the library ships in the destinations chunk instead of
        // the main bundle -- the homepage never downloads it.
        ({ default: Lenis } = await import("lenis"));
      } catch {
        return; // no smoothing; the page still scrolls natively
      }
      if (cancelled) return;

      lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false });

      const frame = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
