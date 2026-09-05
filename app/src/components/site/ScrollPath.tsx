import { useEffect, useRef, useState } from "react";

/**
 * A scroll-driven stroke: a long curved flight path that fills as the reader
 * scrolls through the section, with the aircraft riding its leading tip.
 *
 * This replaces the page-level gutter rail. That rail was the same idea at
 * the wrong scale -- a hairline in a 34-64px margin, where a curve has no
 * room to be a curve. Here the path owns a full-bleed stage behind the
 * headline, which is what makes the drawing read at all.
 *
 * Geometry is a descending helix rather than hand-authored bezier data: the
 * radius eases as it falls, so the coil opens out down the page instead of
 * repeating. Sampling it into a polyline means the same function defines the
 * stroke AND the aircraft's position, so the two can never drift apart -- and
 * the shape stays tunable by numbers instead of by nudging control points.
 *
 * Cost: no library, no WebGL. A frame writes exactly two attributes -- one
 * dashoffset and one transform, both on single elements. Never a custom
 * property on :root, which is what wrecked the hero's frame rate before it
 * was tracked down.
 */

type Shape = {
  /** viewBox extents. */
  w: number;
  h: number;
  /** Turns of the helix across the section. */
  loops: number;
  /** Radius at the top and at the foot. */
  r0: number;
  r1: number;
  /** Coil stretched wide and squashed vertically, so it reads as a path seen
   *  in perspective rather than a circle. */
  ax: number;
  ay: number;
  /** Where the coil starts vertically, and how far it falls, as fractions. */
  top: number;
  drift: number;
  /** Aircraft size in viewBox units. */
  plane: number;
};

/**
 * Two shapes, because the stage is full-bleed and `slice` scales by
 * max(vw/w, vh/h): a landscape viewBox in a portrait viewport shows only
 * ~35% of the artwork's width, which flattens the loops into stripes. The
 * portrait shape is measured to show ~99% of its width on a 375px phone.
 */
const WIDE: Shape = {
  w: 1200,
  h: 900,
  loops: 2.2,
  r0: 300,
  r1: 210,
  ax: 1.45,
  ay: 0.62,
  top: 0.12,
  drift: 0.74,
  plane: 58,
};

const TALL: Shape = {
  w: 560,
  h: 1200,
  loops: 2.4,
  r0: 175,
  r1: 140,
  ax: 1.35,
  ay: 0.7,
  top: 0.14,
  drift: 0.72,
  plane: 34,
};

const SAMPLES = 420;

function pointAt(s: Shape, t: number) {
  const th = Math.PI * 2 * s.loops * t;
  const r = s.r0 + (s.r1 - s.r0) * t;
  return {
    x: s.w * 0.5 + r * Math.cos(th) * s.ax,
    y: s.h * (s.top + s.drift * t) + r * Math.sin(th) * s.ay,
  };
}

function pathFor(s: Shape) {
  const pts: string[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const p = pointAt(s, i / SAMPLES);
    pts.push(`${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
  }
  return `M ${pts[0]} L ${pts.slice(1).join(" L ")}`;
}

const PATHS = new WeakMap<Shape, string>();
function cachedPath(s: Shape) {
  let d = PATHS.get(s);
  if (!d) {
    d = pathFor(s);
    PATHS.set(s, d);
  }
  return d;
}

/** Aircraft seen from above, nose toward -Y, drawn in a 24x24 box. */
const PLANE_D =
  "M12 1.6c.9 0 1.5 1.1 1.5 2.6v4.3l7.6 4.4c.3.2.4.5.4.8v1.4c0 .3-.3.5-.6.4l-7.4-2.4v3.9l2.2 1.7c.2.1.3.3.3.5v1c0 .3-.2.4-.5.4L12 20l-3.5.6c-.3 0-.5-.1-.5-.4v-1c0-.2.1-.4.3-.5l2.2-1.7v-3.9l-7.4 2.4c-.3.1-.6-.1-.6-.4v-1.4c0-.3.1-.6.4-.8l7.6-4.4V4.2c0-1.5.6-2.6 1.5-2.6Z";

export function ScrollPath() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trailRef = useRef<SVGPathElement | null>(null);
  const planeRef = useRef<SVGGElement | null>(null);
  // WIDE on the server: it is the desktop case, and the first client effect
  // corrects it before paint on a phone.
  const [shape, setShape] = useState<Shape>(WIDE);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setShape(mq.matches ? WIDE : TALL);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let progress = 0;
    let lastDrawn = -1;

    function place(t: number) {
      const trail = trailRef.current;
      if (trail) trail.style.strokeDashoffset = ((1 - t) * 1000).toFixed(1);

      const plane = planeRef.current;
      if (!plane) return;
      const here = pointAt(shape, t);
      // A hair further along the same function gives the heading. Sampling
      // the curve twice beats getPointAtLength(): it needs no layout, and it
      // is the identical maths the stroke is built from.
      const ahead = pointAt(shape, Math.min(t + 0.004, 1));
      const dx = ahead.x - here.x;
      const dy = ahead.y - here.y;
      // The glyph is drawn nose-up (toward -Y). Under rotate(a) its nose
      // points (sin a, -cos a); equating that to the heading gives this.
      const angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
      plane.setAttribute(
        "transform",
        `translate(${here.x.toFixed(1)} ${here.y.toFixed(1)}) rotate(${angle.toFixed(1)})`,
      );
    }

    function frame() {
      raf = 0;
      if (Math.abs(progress - lastDrawn) < 0.0002) return;
      lastDrawn = progress;
      place(progress);
    }

    function onScroll() {
      const rect = section!.getBoundingClientRect();
      // The stage is sticky, so the travel available is the section's height
      // minus the one viewport the stage occupies.
      const travel = Math.max(1, rect.height - window.innerHeight);
      progress = Math.min(Math.max(-rect.top / travel, 0), 1);
      if (!raf) raf = requestAnimationFrame(frame);
    }

    if (reduceMotion) {
      // The whole point is the drawing, so with motion off the route is
      // simply shown complete rather than animated more gently.
      place(1);
      return;
    }

    onScroll();
    place(progress);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [shape]);

  const d = cachedPath(shape);

  return (
    <section ref={sectionRef} className="scrollpath-section">
      <div className="scrollpath-stage">
        <svg
          className="scrollpath-svg"
          viewBox={`0 0 ${shape.w} ${shape.h}`}
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {/* The route ahead, then the part already flown drawn over it. */}
          <path className="scrollpath-track" d={d} />
          <path className="scrollpath-trail" d={d} pathLength={1000} ref={trailRef} />
          <g ref={planeRef} className="scrollpath-plane">
            <g transform={`scale(${(shape.plane / 24).toFixed(3)}) translate(-12 -12)`}>
              <path d={PLANE_D} />
            </g>
          </g>
        </svg>

        <div className="scrollpath-copy">
          <p className="site-eyebrow scrollpath-eyebrow">How it connects</p>
          <h2 className="scrollpath-title">
            One line from
            <br /> search to seat.
          </h2>
          <p className="scrollpath-sub">
            Flights, stays, cars, eSIM and tours run through the same flow &mdash; so nothing on your
            trip falls between two open tabs.
          </p>
        </div>
      </div>
    </section>
  );
}
