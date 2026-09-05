import { useEffect, useRef } from "react";

import { loadGsap } from "@/lib/gsap";

/**
 * Staggered entrance for a grid's cards, driven by ScrollTrigger.batch.
 *
 * Point the ref at a container; its direct children are the cards. As each
 * row crosses into view the cards in it rise and fade together, a beat apart.
 *
 * Why the library earns its place here specifically: `batch` gathers every
 * card in the grid into ONE ScrollTrigger and groups whatever enters in the
 * same frame into a single tween, so a four-column grid animates as rows
 * rather than as sixteen unrelated elements. Doing that by hand means an
 * observer per card plus a scheduler to coalesce them. ScrollTrigger also
 * runs every trigger on the site off one scroll listener and one ticker,
 * where the older hand-rolled hooks each attach their own.
 *
 * NO-FLASH CONTRACT, which is the fiddly part. Cards are authored visible,
 * so a page with no JS -- or with GSAP still in flight -- renders finished
 * content. The hook therefore only ever hides cards that are still BELOW the
 * fold when it initialises. Anything already on screen is left exactly as
 * the server drew it, so a slow chunk can never make settled content blink
 * out and animate back in.
 */

type Options = {
  /** Seconds between cards in the same batch. */
  stagger?: number;
  /** How far each card rises, in px. */
  y?: number;
  /** Viewport position the batch fires at, in ScrollTrigger's syntax. */
  start?: string;
};

export function useReveal<T extends HTMLElement>({
  stagger = 0.07,
  y = 26,
  start = "top 88%",
}: Options = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    void loadGsap().then((lib) => {
      if (!lib || cancelled || !ref.current) return;
      const { gsap, ScrollTrigger } = lib;

      const cards = Array.from(ref.current.children) as HTMLElement[];
      // Only what is still below the fold -- see the no-flash contract above.
      const below = cards.filter((c) => c.getBoundingClientRect().top > window.innerHeight * 0.94);
      if (below.length === 0) return;

      const ctx = gsap.context(() => {
        gsap.set(below, { opacity: 0, y });
        ScrollTrigger.batch(below, {
          start,
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.62,
              stagger,
              ease: "power2.out",
              overwrite: true,
            }),
        });
      }, ref.current);

      // gsap.context tracks every tween and trigger created inside it, so one
      // revert() undoes the whole thing -- including the inline opacity/y it
      // set, which matters on a client-side route change where the DOM is
      // reused rather than rebuilt.
      cleanup = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [stagger, y, start]);

  return ref;
}
