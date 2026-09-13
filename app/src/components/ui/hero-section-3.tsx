import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Scroll-driven fly-across, after the 21st.dev "hero-section-3" reference:
 * static copy held on a sticky stage while an image flies past it, fading in
 * as it arrives and out as it leaves.
 *
 * Three deliberate departures from the reference implementation, all of which
 * survived the switch back to framer-motion because they are not about the
 * animation library.
 *
 * The travel is expressed in vw, not pixels. The reference computes
 * `window.innerWidth` in the component body, which throws on the server, and
 * this site renders on a Cloudflare Worker. Unit strings interpolate just as
 * happily and are correct at every width with no measurement and no resize
 * listener.
 *
 * The offsets are ["start start", "end end"], not ["start end", "end start"].
 * The reference measures the section entering the viewport, which only suits
 * a section further down the page. This hero is the first thing in the
 * document, so it can never enter from below: measured that way it began life
 * at 0.32 on desktop and 0.38 on a phone, putting the plane already half on
 * screen and fully opaque before a pixel had been scrolled. These offsets run
 * 0 -> 1 across the sticky stage's own travel instead.
 *
 * The stage clips (see .flyin-sticky). The reference drops overflow:hidden to
 * avoid clipping the image; without it, translating an element a screen and a
 * bit sideways gives the whole document a horizontal scrollbar.
 *
 * No "use client" directive: this project has no RSC boundary, and a
 * directive that does nothing invites the next reader to believe there is one.
 */
interface ScrollFlyInProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  imageUrl: string;
  imageAlt?: string;
}

const ScrollFlyIn = React.forwardRef<HTMLDivElement, ScrollFlyInProps>(
  ({ children, imageUrl, imageAlt = "", className, ...props }, forwardedRef) => {
    const targetRef = React.useRef<HTMLDivElement | null>(null);
    const reduceMotion = useReducedMotion();

    // The caller may want the node too (the homepage does not, but this lives
    // in components/ui and should behave like the rest of the kit).
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        targetRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    const { scrollYProgress } = useScroll({
      target: targetRef,
      offset: ["start start", "end end"],
    });

    // The throw has to clear the aircraft's own width, not just the screen's.
    // At 165vw wide, starting at -105vw left its nose already on screen before
    // a pixel had been scrolled.
    const x = useTransform(scrollYProgress, [0, 1], ["-185vw", "120vw"]);
    // Full opacity: the plane crosses in front of the copy, as the reference
    // has it, rather than sitting behind it as atmosphere.
    const opacity = useTransform(scrollYProgress, [0.02, 0.12, 0.88, 0.98], [0, 1, 1, 0]);

    // Reduced motion parks the image mid-flight rather than hiding it: the
    // hero should still have its subject, it just must not move.
    const style = reduceMotion ? { x: 0, opacity: 1 } : { x, opacity };

    return (
      <div ref={setRefs} className={cn("flyin", className)} {...props}>
        <div className="flyin-sticky">
          <div className="flyin-content">{children}</div>
          <motion.div style={style} className="flyin-plane" aria-hidden="true">
            <img src={imageUrl} alt={imageAlt} className="flyin-plane-img" decoding="async" />
          </motion.div>
        </div>
      </div>
    );
  },
);

ScrollFlyIn.displayName = "ScrollFlyIn";

export { ScrollFlyIn };
