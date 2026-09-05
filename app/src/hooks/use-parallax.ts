import { useEffect, useRef } from "react";

/**
 * Ties a section's --parallax custom property to how far it has scrolled
 * through the viewport, from -1 (just entering from below) to +1 (about to
 * leave off the top). CSS defaults --parallax to 0 (see consumers), so a
 * background driven by it sits at its natural position with no JS at all --
 * this only drifts it for a subtle depth effect while scrolling.
 */
export function useParallax<T extends HTMLElement>() {
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
      // 0 when the section's center is at the viewport's center, ranging
      // to -1/+1 as it enters from the bottom / exits off the top.
      const centerOffset = rect.top + rect.height / 2 - vh / 2;
      const parallax = Math.max(-1, Math.min(1, centerOffset / (vh / 2 + rect.height / 2)));
      el!.style.setProperty("--parallax", parallax.toFixed(4));
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
