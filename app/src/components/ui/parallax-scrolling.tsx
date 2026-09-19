import { useEffect, useRef, type ReactNode } from "react";

import { loadGsap } from "@/lib/gsap";

/**
 * Layered parallax header, after the 21st.dev / Osmo "parallax-scrolling"
 * reference: stacked layers that travel at different rates as the header
 * scrolls, so the scene opens out rather than sliding past as one plate.
 *
 * The mechanic is kept exactly -- one ScrollTrigger timeline, every layer
 * tweened to its own yPercent with `ease: "none"` and scrub, all starting
 * together so they move as one scene at different depths. What changed is
 * everything that would have made it a foreign object here:
 *
 * NO `new Lenis()`. The reference constructs its own smooth-scroll instance
 * in the component. This site already has one, in components/site/
 * SmoothScroll.tsx, and that file's own comment explains why it is mounted
 * per-route rather than globally: the homepage drives the flight rail, the
 * marquee and the scrubbed heroes straight off scroll position, and putting
 * an easing layer under all of that is how a hero comes to lag the wheel.
 * A second instance on top of the first would be worse still. Smoothing is
 * the caller's decision, not this component's.
 *
 * NO direct gsap import. lib/gsap.ts loads gsap and ScrollTrigger once,
 * lazily, and hands them back -- so a route that never scrolls one of these
 * never pays for the library. Importing gsap at module scope here would put
 * it in the entry chunk of every page.
 *
 * NO cdn.21st.dev images, and no hard-coded ones at all: layers come in as
 * children so the caller owns the art and can serve it from this origin.
 *
 * NO osmo credit block. That belongs on the reference, not on a commercial
 * page that did not commission it.
 *
 * REDUCED MOTION is a real branch, not a softened one. Parallax IS the
 * motion; there is nothing left to tone down. The layers render in their
 * final position and no timeline is built.
 */

export interface ParallaxLayer {
  /** Depth rate. The reference runs 70 / 55 / 40 / 10 back-to-front: bigger
   *  numbers travel further, so the furthest layer moves most and the nearest
   *  barely at all. */
  yPercent: number;
  content: ReactNode;
  /** Optional per-layer class, for anything the caller wants to position. */
  className?: string;
}

export interface ParallaxHeaderProps {
  layers: ParallaxLayer[];
  className?: string;
  /** Rendered under the layered stack, in normal flow -- the copy block. */
  children?: ReactNode;
}

export function ParallaxHeader({ layers, className, children }: ParallaxHeaderProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    void loadGsap().then((lib) => {
      if (!lib || cancelled || !rootRef.current) return;
      const { gsap, ScrollTrigger } = lib;
      const stack = rootRef.current.querySelector("[data-parallax-layers]");
      if (!stack) return;

      // gsap.context so one revert() undoes the timeline, the trigger and
      // every inline transform they set -- which matters on a client-side
      // route change, where the DOM is reused rather than rebuilt.
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: stack, start: "0% 0%", end: "100% 0%", scrub: 0 },
        });
        layers.forEach((layer, i) => {
          tl.to(
            stack.querySelectorAll(`[data-parallax-layer="${i + 1}"]`),
            { yPercent: layer.yPercent, ease: "none" },
            // Every layer starts at the same moment: "<" means "with the
            // previous tween". Staggered, they would read as a sequence of
            // slides rather than one scene with depth.
            i === 0 ? undefined : "<",
          );
        });
      }, rootRef.current);

      cleanup = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [layers]);

  return (
    <div ref={rootRef} className={className ? `parallax ${className}` : "parallax"}>
      <section className="parallax__header">
        <div className="parallax__visuals">
          <div data-parallax-layers className="parallax__layers">
            {layers.map((layer, i) => (
              <div
                key={i}
                data-parallax-layer={i + 1}
                className={
                  layer.className ? `parallax__layer ${layer.className}` : "parallax__layer"
                }
              >
                {layer.content}
              </div>
            ))}
          </div>
          <div className="parallax__fade" aria-hidden="true" />
        </div>
      </section>
      {children ? <section className="parallax__content">{children}</section> : null}
    </div>
  );
}

export default ParallaxHeader;
