import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Scroll-driven fly-across, after the 21st.dev "hero-section-3" reference:
 * static copy held on a sticky stage while an image flies past it, fading in
 * as it arrives and out as it leaves.
 *
 * Two deliberate departures from the reference implementation.
 *
 * It does not use framer-motion. The library cannot currently be installed
 * here at all -- package.json pins an `overrides` entry for @types/react that
 * conflicts with the direct devDependency, so npm refuses every install --
 * and the lockfile is bun's while bun is not on this machine. Adding it would
 * mean rewriting the dependency setup and shipping another ~120KB to the
 * client for one animation. The motion is instead driven the way the rest of
 * this site drives scroll: one rAF-throttled listener writing a single custom
 * property to a LEAF node, never to :root. Hero.tsx documents why that
 * matters -- the same writes against :root measured 33ms per frame against
 * 0.06ms here, because a custom property on :root invalidates style for every
 * node that could inherit it.
 *
 * It also never reads window during render. The reference computes
 * `window.innerWidth` in the component body, which throws on the server, and
 * this site renders on a Cloudflare Worker. The travel is expressed in vw in
 * CSS instead, which is both SSR-safe and inherently responsive -- no
 * measurement, no resize listener, correct at every width.
 */
interface ScrollFlyInProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  imageUrl: string;
  imageAlt?: string;
}

const ScrollFlyIn = React.forwardRef<HTMLDivElement, ScrollFlyInProps>(
  ({ children, imageUrl, imageAlt = "", className, ...props }, forwardedRef) => {
    const targetRef = React.useRef<HTMLDivElement | null>(null);
    const planeRef = React.useRef<HTMLDivElement | null>(null);
    const rafRef = React.useRef<number | null>(null);

    // The caller may want the node too (the homepage does not, but the
    // component is in components/ui and should behave like the rest of the
    // kit), so the forwarded ref is kept alongside the internal one.
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        targetRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    React.useEffect(() => {
      if (typeof window === "undefined") return;
      const el = targetRef.current;
      const plane = planeRef.current;
      if (!el || !plane) return;

      // Reduced motion parks the image mid-flight rather than hiding it: the
      // hero should still have its subject, it just must not move.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        plane.style.setProperty("--fly", "0.5");
        return;
      }

      function update() {
        if (rafRef.current) return;
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          const rect = el!.getBoundingClientRect();
          const vh = window.innerHeight;
          // Progress across the STAGE'S OWN travel: 0 when the sticky stage
          // takes hold, 1 when it releases.
          //
          // Not the reference's ["start end", "end start"], which measures
          // entry into the viewport. That model only works for a section
          // further down the page. This hero is the first thing in the
          // document, so it can never enter from below: measured that way it
          // began life at 0.32 on desktop and 0.38 on a phone, which put the
          // plane already half on screen and fully opaque before a single
          // pixel had been scrolled. Hero.tsx uses this same travel-relative
          // form for the same reason.
          const total = el!.offsetHeight - vh;
          const raw = total > 0 ? -rect.top / total : 0;
          plane!.style.setProperty("--fly", Math.min(Math.max(raw, 0), 1).toFixed(4));
        });
      }

      update();
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      return () => {
        window.removeEventListener("scroll", update);
        window.removeEventListener("resize", update);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, []);

    return (
      <div ref={setRefs} className={cn("flyin", className)} {...props}>
        <div className="flyin-sticky">
          <div className="flyin-content">{children}</div>
          <div ref={planeRef} className="flyin-plane" aria-hidden="true">
            <img src={imageUrl} alt={imageAlt} className="flyin-plane-img" decoding="async" />
          </div>
        </div>
      </div>
    );
  },
);

ScrollFlyIn.displayName = "ScrollFlyIn";

export { ScrollFlyIn };
