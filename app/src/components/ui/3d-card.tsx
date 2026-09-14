import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A card that tilts toward the pointer, after the 21st.dev "3d-card"
 * reference: the container holds the perspective, the card rotates on two
 * axes from the pointer's offset within it, and its contents are pushed
 * forward on the Z axis so they separate as it turns.
 *
 * The reference is one hard-coded demo card in a full-screen centred wrapper.
 * This is the mechanic on its own, so a page can render as many as it needs:
 * the tilt maths and the reset are unchanged, everything around them is the
 * caller's.
 *
 * POINTER EVENTS, NOT MOUSE EVENTS. The reference listens on mousemove and
 * mouseleave. iOS Safari synthesises a mousemove on tap and then no
 * mouseleave, so a tapped card keeps whatever tilt that synthetic event gave
 * it -- permanently, until the next tap somewhere else. Pointer events carry
 * `pointerType`, so a touch can be ignored outright, and pointercancel gives a
 * reset that mouseleave has no equivalent for.
 *
 * The transform is written straight to the node rather than held in state.
 * That is the reference's choice and it is the right one: this fires on every
 * pointer move, and a re-render per frame for a value only CSS consumes would
 * be the most expensive thing on the page.
 *
 * Reduced motion disables the tilt entirely rather than shortening it -- the
 * whole effect IS the motion, so there is nothing to soften.
 */
const MAX_TILT_DEG = 15;
const HOVER_SCALE = 1.02;

export interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Depth of the perspective the card turns inside. */
  perspective?: string;
}

export function Card3D({ perspective = "1000px", className, children, style, ...props }: Card3DProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const reduceMotion = React.useRef(false);

  React.useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const reset = React.useCallback(() => {
    const card = cardRef.current;
    if (card) card.style.transform = "";
  }, []);

  const onPointerMove = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || reduceMotion.current) return;
    const card = cardRef.current;
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;
    const rotateX = ((y - height / 2) / height) * MAX_TILT_DEG;
    const rotateY = ((x - width / 2) / width) * -MAX_TILT_DEG;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${HOVER_SCALE})`;
  }, []);

  return (
    <div className="card3d-stage" style={{ perspective }}>
      <div
        ref={cardRef}
        onPointerMove={onPointerMove}
        onPointerLeave={reset}
        onPointerCancel={reset}
        className={cn("card3d", className)}
        style={style}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Lifts its contents toward the viewer inside a Card3D. Separating the layers
 * on Z is what makes the card read as depth rather than as a picture being
 * rotated.
 */
export function Card3DLayer({
  depth = 40,
  className,
  children,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { depth?: number }) {
  return (
    <div className={className} style={{ transform: `translateZ(${depth}px)`, ...style }} {...props}>
      {children}
    </div>
  );
}

export default Card3D;
