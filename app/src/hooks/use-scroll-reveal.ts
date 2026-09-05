import { useEffect, useRef } from "react";

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Ties a section's --reveal custom property to its scroll position, easing
 * from 0 (entering from below the fold) to 1 (settled). CSS defaults
 * --reveal to 1 (see .scroll-reveal in styles.css), so content renders in
 * its final position with no JS at all -- this only pulls it back down
 * transiently as a cinematic entrance, never hides it, and is safe for SSR
 * and screenshots taken before the first frame runs.
 */
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf: number | null = null;

    function update() {
      raf = null;
      const rect = el!.getBoundingClientRect();
      const vh = window.innerHeight;
      const reveal = smoothstep(vh * 0.94, vh * 0.6, rect.top);
      el!.style.setProperty("--reveal", reveal.toFixed(4));
    }

    function requestTick() {
      if (raf == null) raf = requestAnimationFrame(update);
    }

    requestTick();
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);
    return () => {
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}
