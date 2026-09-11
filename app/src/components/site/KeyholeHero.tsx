import { useEffect, useRef, type ReactNode } from "react";

/**
 * The hotel page's hero, after the "For hotel hero section" reference: a dark
 * wall, one keyhole of warm light, and that light spilling across the floor.
 * Scrolling pushes the camera into the keyhole -- the glow fades, the lobby
 * shows through, and the opening grows until the video behind it is all
 * that's left. Then the headline arrives, the same late reveal the homepage
 * hero uses.
 *
 * One transform drives the whole scene. Wall, floor, light and keyhole sit in
 * a single SVG group scaled around the keyhole's centre, so it reads as the
 * camera moving in rather than a keyhole growing on a flat wall -- and the
 * cut-out mask lives in that group's user space, so it scales with it for
 * free. It is vector and re-rendered each frame, so the keyhole's edge stays
 * crisp at 30x where a scaled bitmap would smear.
 *
 * Cheap on purpose: scroll is read once per animation frame, the glow and the
 * whole wall drop out of rendering the moment they're invisible, and
 * prefers-reduced-motion skips all of it in CSS -- the video just plays.
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
/** The slot starts inside the circle so the two read as one opening, and
 *  widens toward the floor. */
const SLOT_TOP = CY + R * 0.6;
const SLOT_TOP_HALF = 26;
const SLOT_BOTTOM_HALF = 54;
const SLOT_POINTS = `${CX - SLOT_TOP_HALF},${SLOT_TOP} ${CX + SLOT_TOP_HALF},${SLOT_TOP} ${CX + SLOT_BOTTOM_HALF},${FLOOR_Y} ${CX - SLOT_BOTTOM_HALF},${FLOOR_Y}`;
/** Farthest point of the scene from the focal point. Once the round part of
 *  the opening is wider than this, no wall can be on screen at any aspect. */
const COVER_RADIUS = Math.hypot(VB_W / 2, VB_H - CY);
const MAX_ZOOM = 34;
/** Share of the scroll track spent zooming; the rest holds on the open video. */
const ZOOM_END = 0.85;
/** The glow is gone by here, so the lobby shows through the keyhole early. */
const GLOW_END = 0.18;

export function KeyholeHero({
  videoSrc,
  posterSrc,
  children,
}: {
  videoSrc: string;
  /** Shown before the video can play -- and instead of it on an iPhone in
   *  Low Power Mode, which blocks autoplay. Without one, the keyhole would
   *  open onto a blank video there rather than the lobby. */
  posterSrc?: string;
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
            {/* White shows the wall, black cuts the keyhole out of it. */}
            <mask id="kh-cut" maskUnits="userSpaceOnUse" x={-VB_W} y={-VB_H} width={VB_W * 3} height={VB_H * 3}>
              <rect className="kh-mask-open" x={-VB_W} y={-VB_H} width={VB_W * 3} height={VB_H * 3} />
              <circle className="kh-mask-hole" cx={CX} cy={CY} r={R} />
              <polygon className="kh-mask-hole" points={SLOT_POINTS} />
            </mask>
            <clipPath id="kh-floor-clip">
              <rect x={-VB_W} y={FLOOR_Y} width={VB_W * 3} height={VB_H * 2} />
            </clipPath>
            <filter id="kh-blur" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="26" />
            </filter>
            <radialGradient id="kh-light" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" className="kh-stop-core" />
              <stop offset="1" className="kh-stop-warm" />
            </radialGradient>
            <linearGradient id="kh-light-slot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" className="kh-stop-core" />
              <stop offset="1" className="kh-stop-warm" />
            </linearGradient>
            <radialGradient id="kh-spill" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" className="kh-stop-spill" />
              <stop offset="1" className="kh-stop-spill-fade" />
            </radialGradient>
            <radialGradient id="kh-aura" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" className="kh-stop-aura" />
              <stop offset="1" className="kh-stop-aura-fade" />
            </radialGradient>
          </defs>

          <g ref={sceneRef}>
            <g mask="url(#kh-cut)">
              <rect className="kh-wall" x={-VB_W} y={-VB_H} width={VB_W * 3} height={VB_H + FLOOR_Y} />
              <rect className="kh-floor" x={-VB_W} y={FLOOR_Y} width={VB_W * 3} height={VB_H * 2} />
              <circle cx={CX} cy={CY + 40} r={300} fill="url(#kh-aura)" />
              <ellipse cx={CX} cy={FLOOR_Y} rx={600} ry={320} fill="url(#kh-spill)" clipPath="url(#kh-floor-clip)" />
            </g>
            <g ref={lightRef}>
              <g className="kh-halo" filter="url(#kh-blur)">
                <circle className="kh-halo-shape" cx={CX} cy={CY} r={R} />
                <polygon className="kh-halo-shape" points={SLOT_POINTS} />
              </g>
              <circle cx={CX} cy={CY} r={R} fill="url(#kh-light)" />
              <polygon points={SLOT_POINTS} fill="url(#kh-light-slot)" />
            </g>
          </g>

          <text className="kh-hint" x={CX} y={FLOOR_Y + 130} textAnchor="middle">
            SCROLL TO STEP INSIDE
          </text>
        </svg>
        {children}
      </div>
    </section>
  );
}
