import { useEffect, useRef, type ReactNode } from "react";

import { SmoothScroll } from "./SmoothScroll";

/**
 * The hotel page's hero, after the "For hotel hero section" reference: a dark
 * wall, one keyhole of warm light, and that light spilling across the floor.
 * Scrolling pushes the camera into the keyhole -- the glow fades, the lobby
 * shows through, and the opening grows until the video behind it is all
 * that's left. Then the headline arrives, the same late reveal the homepage
 * hero uses.
 *
 * One transform drives the whole scene. Wall, floor, light and keyhole share
 * a single SVG group scaled around the keyhole's centre, so it reads as the
 * camera moving in rather than a keyhole growing on a flat wall. It is
 * vector and re-rendered each frame, so the edge stays crisp at 30x.
 *
 * Built to be cheap to redraw, because the first version wasn't: it cut the
 * keyhole with an SVG <mask> and lit it through a Gaussian blur filter, both
 * rasterised on the CPU every frame, and its glow "breathed" on a CSS loop
 * that repainted the whole scene even while nobody was scrolling. Now the
 * keyhole is a hole in the wall's own path (the outline sits inside the
 * rectangle and the path is filled even-odd), the glow is a plain radial
 * gradient, and nothing animates unless the page is moving.
 *
 * SmoothScroll is mounted here, not site-wide: with a mouse wheel, native
 * scrolling moves in notches and the zoom jumped with each one. Its own
 * comment explains why the homepage deliberately goes without.
 */

// Scene geometry, in the SVG's own units (1600 x 1000, sliced to cover).
const VB_W = 1600;
const VB_H = 1000;
/** Centre of the keyhole's round top: the zoom's focal point. */
const CX = 800;
const CY = 420;
const R = 52;
/** The keyhole sits on the floor line, as in the reference. */
const FLOOR_Y = 640;
/** Slot half-width where it meets the circle, and at the floor. */
const JOIN_HALF = 26;
const SLOT_BOTTOM_HALF = 54;
/** Where the slot's edges meet the circle, so the outline is one closed
 *  shape. A circle and a trapezoid overlapping would, filled even-odd, turn
 *  their overlap back into wall. */
const JOIN_Y = CY + Math.sqrt(R * R - JOIN_HALF * JOIN_HALF);
const KEYHOLE =
  `M ${CX - JOIN_HALF} ${JOIN_Y} A ${R} ${R} 0 1 1 ${CX + JOIN_HALF} ${JOIN_Y} ` +
  `L ${CX + SLOT_BOTTOM_HALF} ${FLOOR_Y} L ${CX - SLOT_BOTTOM_HALF} ${FLOOR_Y} Z`;

function circlePath(cx: number, cy: number, r: number): string {
  return `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
}

/** The wall down to the floor line, with the keyhole as a hole in it. */
const WALL = `M ${-VB_W} ${-VB_H} H ${VB_W * 2} V ${FLOOR_Y} H ${-VB_W} Z ${KEYHOLE}`;
/** Faint warmth on the wall around the keyhole -- holed the same way, or it
 *  would tint the view through it. */
const AURA_R = 300;
const AURA_CY = CY + 40;
const AURA = `${circlePath(CX, AURA_CY, AURA_R)} ${KEYHOLE}`;
/** The light on the floor: the lower half of an ellipse from the keyhole's base. */
const SPILL = `M ${CX - 600} ${FLOOR_Y} A 600 320 0 0 0 ${CX + 600} ${FLOOR_Y} Z`;

/** Farthest point of the scene from the focal point. Once the round part of
 *  the opening is wider than this, no wall can be on screen at any aspect. */
const COVER_RADIUS = Math.hypot(VB_W / 2, VB_H - CY);
const MAX_ZOOM = 34;
/** Share of the scroll track spent zooming; the rest holds on the open video. */
const ZOOM_END = 0.85;
/** The glow is gone by here, so the lobby shows through the keyhole early. */
const GLOW_END = 0.18;
/** The intro overlay (glass cards) is out of the way by here. */
const INTRO_END = 0.14;

export function KeyholeHero({
  videoSrc,
  posterSrc,
  intro,
  children,
}: {
  videoSrc: string;
  /** Shown before the video can play -- and instead of it on an iPhone in
   *  Low Power Mode, which blocks autoplay. Without one, the keyhole would
   *  open onto a blank video there rather than the lobby. */
  posterSrc?: string;
  /** Floats over the wall at the start (the page's glass cards) and fades
   *  and drifts toward the viewer as the camera pushes in. Not part of the
   *  scene, so it never zooms with it. */
  intro?: ReactNode;
  children: ReactNode;
}) {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<SVGSVGElement>(null);
  const sceneRef = useRef<SVGGElement>(null);
  const lightRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const wall = wallRef.current;
    const scene = sceneRef.current;
    const light = lightRef.current;
    if (!track || !stage || !wall || !scene || !light) return;
    // Reduced motion is handled entirely in CSS: no track, no wall, copy shown.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Stick exactly under the nav at whatever height it renders. The CSS
    // fallback (--kh-top: 65px, measured on 11 Sep 2026) covers the first
    // paint, before this runs; a fixed 4.25rem left a 3px strip under it.
    const nav = document.querySelector<HTMLElement>(".site-nav");
    let stickTop = 0;
    const measure = () => {
      if (nav) stage.style.setProperty("--kh-top", `${nav.getBoundingClientRect().height}px`);
      stickTop = parseFloat(getComputedStyle(stage).top) || 0;
    };
    measure();

    let frame = 0;
    const update = () => {
      frame = 0;
      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      // The stage sticks when its natural top reaches stickTop and releases
      // when the track's bottom reaches its own. Clamping the start at 0
      // covers a track that begins above the sticky line (a fixed nav).
      const start = Math.max(0, trackTop - stickTop);
      const end = trackTop + track.offsetHeight - stickTop - stage.offsetHeight;
      const travel = end - start;
      const p = travel > 0 ? Math.min(1, Math.max(0, (window.scrollY - start) / travel)) : 1;

      // Exponential in scroll, so the push-in keeps a steady feel all the way.
      const k = Math.pow(MAX_ZOOM, Math.min(1, p / ZOOM_END));
      scene.setAttribute("transform", `translate(${CX} ${CY}) scale(${k.toFixed(4)}) translate(${-CX} ${-CY})`);

      const glow = Math.max(0, 1 - p / GLOW_END);
      light.style.opacity = glow.toFixed(3);
      light.style.display = glow > 0.001 ? "" : "none";
      wall.style.visibility = R * k > COVER_RADIUS ? "hidden" : "";

      stage.style.setProperty("--kh-p", p.toFixed(4));
      track.classList.toggle("is-past-intro", p >= INTRO_END);
      track.classList.toggle("is-open", p >= 0.86);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={trackRef} className="keyhole-hero">
      <SmoothScroll />
      <div ref={stageRef} className="keyhole-stage">
        <video
          className="keyhole-video"
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="dest-detail-mask-dark" />
        <svg
          ref={wallRef}
          className="keyhole-wall"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <radialGradient id="kh-light" gradientUnits="userSpaceOnUse" cx={CX} cy={CY} r={230}>
              <stop offset="0" className="kh-stop-core" />
              <stop offset="1" className="kh-stop-warm" />
            </radialGradient>
            <radialGradient id="kh-halo" gradientUnits="userSpaceOnUse" cx={CX} cy={CY + 50} r={210}>
              <stop offset="0" className="kh-stop-halo" />
              <stop offset="1" className="kh-stop-halo-fade" />
            </radialGradient>
            <radialGradient id="kh-aura" gradientUnits="userSpaceOnUse" cx={CX} cy={AURA_CY} r={AURA_R}>
              <stop offset="0" className="kh-stop-aura" />
              <stop offset="1" className="kh-stop-aura-fade" />
            </radialGradient>
            <radialGradient
              id="kh-spill"
              gradientUnits="userSpaceOnUse"
              cx={CX}
              cy={FLOOR_Y}
              r={600}
              gradientTransform={`translate(${CX} ${FLOOR_Y}) scale(1 0.55) translate(${-CX} ${-FLOOR_Y})`}
            >
              <stop offset="0" className="kh-stop-spill" />
              <stop offset="1" className="kh-stop-spill-fade" />
            </radialGradient>
          </defs>

          <g ref={sceneRef}>
            <path className="kh-wall" d={WALL} fillRule="evenodd" />
            <rect className="kh-floor" x={-VB_W} y={FLOOR_Y} width={VB_W * 3} height={VB_H * 2} />
            <path d={AURA} fillRule="evenodd" fill="url(#kh-aura)" />
            <path d={SPILL} fill="url(#kh-spill)" />
            <g ref={lightRef}>
              <circle cx={CX} cy={CY + 50} r={210} fill="url(#kh-halo)" />
              <path d={KEYHOLE} fill="url(#kh-light)" />
            </g>
          </g>

          {/* Two positions for one hint: on the floor on wide screens, above
              the keyhole on phones, where the stacked glass cards sit on the
              floor and would cover it. CSS shows one or the other. */}
          <text className="kh-hint kh-hint-floor" x={CX} y={FLOOR_Y + 130} textAnchor="middle">
            SCROLL TO STEP INSIDE
          </text>
          <text className="kh-hint kh-hint-top" x={CX} y={CY - R - 64} textAnchor="middle">
            SCROLL TO STEP INSIDE
          </text>
        </svg>
        {intro ? <div className="keyhole-intro">{intro}</div> : null}
        {children}
      </div>
    </section>
  );
}
