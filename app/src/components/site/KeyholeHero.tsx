import { useEffect, useRef, type ReactNode } from "react";

import { SmoothScroll } from "./SmoothScroll";

/**
 * The hotel page's hero: a walk down a lantern-lit hotel corridor to a door at
 * its end, up the steps, and through the keyhole into the lobby. After the
 * owner's "for hotel herosection 2" reference (the arched corridor) and the
 * keyhole-and-steps reference.
 *
 * Built in code, on the owner's call, rather than from the reference photo --
 * whose source is unknown, and which couldn't be walked down anyway: zoomed
 * toward a door 90px wide, a single photo smears long before it arrives.
 *
 * Two acts on one scroll track:
 *   walk  (0 -> WALK_END)   The camera travels down the corridor. Every arch
 *                           is its own layer at its own depth, scaled by
 *                           P / (P + depth), so near arches sweep past while
 *                           far ones barely move -- parallax, not a zoom. The
 *                           door arrives at exactly scale 1, so it fills the
 *                           frame at native resolution, sharp.
 *   enter (WALK_END -> ZOOM_END)  The keyhole's glow fades, the lobby shows
 *                           through, and the camera pushes into the keyhole
 *                           until the opening fills the screen.
 * Then the headline arrives, the homepage hero's late reveal.
 *
 * Built on what made the first keyhole smooth: one SVG, vector throughout,
 * solid fills (depth is a shade layer whose opacity changes, not a
 * recoloured gradient), no masks or filters -- the doorway and keyhole are
 * holes in their own paths, filled even-odd. Every layer faces the camera,
 * so nothing ever passes behind it, the classic failure of CSS 3D corridors.
 */

// Scene, in the SVG's own units (1600 x 1000, sliced to cover).
const VB_W = 1600;
const VB_H = 1000;
/** The vanishing point, the keyhole's centre and the zoom's focus -- all one
 *  point, so the walk and the push-in are a single straight line. */
const CX = 800;
const CY = 500;
/** Perspective distance: an object `depth` units away draws at P / (P + depth). */
const P = 1000;
const FLOOR_Y = 880;
const DOOR_Z = 6000;
/** Geometric spacing near the camera -- each arch ~80% the size of the one
 *  before, so the nested arches overlap into a continuous vault -- then
 *  closer together toward the door. The first preview stopped at 4722 and
 *  the last 40% of the walk slid toward a door on a bare wall; now the
 *  corridor runs right up to it, and the last arch fades as you arrive. */
const ARCH_Z = [200, 500, 875, 1344, 1930, 2662, 3500, 4250, 4900, 5400, 5750];
const BIG = 6000;

// Arch opening: straight sides from the floor, a semicircular head.
const AO_HALF = 360;
const AO_SPRING = 380;
const APEX_Y = AO_SPRING - AO_HALF;
const ARCH_OPENING =
  `M ${CX - AO_HALF} ${FLOOR_Y} L ${CX - AO_HALF} ${AO_SPRING} ` +
  `A ${AO_HALF} ${AO_HALF} 0 0 1 ${CX + AO_HALF} ${AO_SPRING} L ${CX + AO_HALF} ${FLOOR_Y} Z`;
const ARCH_MOLDING =
  `M ${CX - AO_HALF} ${FLOOR_Y} L ${CX - AO_HALF} ${AO_SPRING} ` +
  `A ${AO_HALF} ${AO_HALF} 0 0 1 ${CX + AO_HALF} ${AO_SPRING} L ${CX + AO_HALF} ${FLOOR_Y}`;
/** Wall and vault above the floor line, with the arch as a hole. */
const ARCH_WALL = `M ${-BIG} ${-BIG} H ${VB_W + BIG} V ${FLOOR_Y} H ${-BIG} Z ${ARCH_OPENING}`;
const FLOOR_BAND = `M ${-BIG} ${FLOOR_Y} H ${VB_W + BIG} V ${VB_H + BIG} H ${-BIG} Z`;
/** Depth darkening for a whole arch, holed the same way. */
const ARCH_SHADE = `M ${-BIG} ${-BIG} H ${VB_W + BIG} V ${VB_H + BIG} H ${-BIG} Z ${ARCH_OPENING}`;

// The door at the end: arched double door on four steps.
const DOOR_HALF = 200;
const DOOR_SPRING = 300;
const DOOR_BOTTOM = 780;
const DOORWAY =
  `M ${CX - DOOR_HALF} ${DOOR_BOTTOM} L ${CX - DOOR_HALF} ${DOOR_SPRING} ` +
  `A ${DOOR_HALF} ${DOOR_HALF} 0 0 1 ${CX + DOOR_HALF} ${DOOR_SPRING} L ${CX + DOOR_HALF} ${DOOR_BOTTOM} Z`;
const DOOR_MOLDING =
  `M ${CX - 222} ${DOOR_BOTTOM} L ${CX - 222} ${DOOR_SPRING} A 222 222 0 0 1 ${CX + 222} ${DOOR_SPRING} L ${CX + 222} ${DOOR_BOTTOM}`;
const FANLIGHT = `M ${CX - 178} ${DOOR_SPRING} A 178 178 0 0 1 ${CX + 178} ${DOOR_SPRING} Z`;
const PANELS: [number, number, number, number][] = [
  [625, 320, 150, 120],
  [825, 320, 150, 120],
  [625, 620, 150, 140],
  [825, 620, 150, 140],
];
/** The meeting stile, broken where the keyhole sits. */
const SEAM = `M ${CX} ${DOOR_SPRING - 178} L ${CX} 455 M ${CX} 610 L ${CX} ${DOOR_BOTTOM}`;
const STEPS = [0, 1, 2, 3].map((k) => ({ top: DOOR_BOTTOM + k * 25, half: 230 + k * 22 }));

// Keyhole on the door. The slot starts inside the circle so the two read as
// one opening -- overlapping shapes, filled even-odd, would turn their
// overlap back into door.
const KR = 38;
const JOIN_HALF = 19;
const JOIN_Y = CY + Math.sqrt(KR * KR - JOIN_HALF * JOIN_HALF);
const KEYHOLE =
  `M ${CX - JOIN_HALF} ${JOIN_Y} A ${KR} ${KR} 0 1 1 ${CX + JOIN_HALF} ${JOIN_Y} ` +
  `L ${CX + 40} 600 L ${CX - 40} 600 Z`;
const END_WALL = `M ${-BIG} ${-BIG} H ${VB_W + BIG} V ${FLOOR_Y} H ${-BIG} Z ${DOORWAY}`;
const DOOR_LEAVES = `${DOORWAY} ${KEYHOLE}`;
const DOOR_SHADE = `M ${-BIG} ${-BIG} H ${VB_W + BIG} V ${VB_H + BIG} H ${-BIG} Z ${KEYHOLE}`;
/** The keyhole's light falling down the steps, as in the reference. */
const STEP_SPILL = `M ${CX - 60} ${DOOR_BOTTOM} L ${CX + 60} ${DOOR_BOTTOM} L ${CX + 240} ${FLOOR_Y} L ${CX - 240} ${FLOOR_Y} Z`;

/** Past this radius no wall can be on screen at any aspect ratio. */
const COVER_RADIUS = Math.hypot(VB_W / 2, VB_H / 2);
const MAX_ZOOM = 40;
const WALK_END = 0.55;
const ZOOM_END = 0.9;
/** The glow is gone this far into the push-in, so the lobby shows early. */
const GLOW_FADE = 0.07;
const INTRO_END = 0.08;

const scaleAbout = (s: number) => `translate(${CX} ${CY}) scale(${s.toFixed(4)}) translate(${-CX} ${-CY})`;
const scaleAt = (depth: number) => P / (P + depth);
/** Farther is darker; the arch you are passing is fully lit. */
const shadeAt = (depth: number) => Math.min(0.82, Math.max(0, depth / 5200) * 0.82);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function KeyholeHero({
  videoSrc,
  posterSrc,
  intro,
  children,
}: {
  videoSrc: string;
  /** Shown before the video can play -- and instead of it on an iPhone in
   *  Low Power Mode, which blocks autoplay. */
  posterSrc?: string;
  /** Floats over the corridor at the start (the page's glass cards) and
   *  fades as the walk begins. Not part of the scene, so it never moves with it. */
  intro?: ReactNode;
  children: ReactNode;
}) {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const doorRef = useRef<SVGGElement>(null);
  const doorShadeRef = useRef<SVGPathElement>(null);
  const lightRef = useRef<SVGGElement>(null);
  const archRefs = useRef<(SVGGElement | null)[]>([]);
  const archShadeRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const svg = svgRef.current;
    const door = doorRef.current;
    const doorShade = doorShadeRef.current;
    const light = lightRef.current;
    if (!track || !stage || !svg || !door || !doorShade || !light) return;
    // Reduced motion is handled entirely in CSS: no track, no scene, copy shown.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Stick exactly under the nav at whatever height it renders; the CSS
    // fallback (65px, measured) covers the first paint.
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
      const start = Math.max(0, trackTop - stickTop);
      const end = trackTop + track.offsetHeight - stickTop - stage.offsetHeight;
      const travel = end - start;
      const p = travel > 0 ? Math.min(1, Math.max(0, (window.scrollY - start) / travel)) : 1;

      // Act one: walk. The camera's distance down the corridor.
      const camZ = DOOR_Z * easeInOut(Math.min(1, p / WALK_END));
      ARCH_Z.forEach((z, i) => {
        const g = archRefs.current[i];
        const shade = archShadeRefs.current[i];
        if (!g) return;
        const depth = z - camZ;
        // Passed: fade it out over a short stretch, then stop drawing it.
        if (depth < -0.3 * P) {
          g.style.display = "none";
          return;
        }
        g.style.display = "";
        g.setAttribute("transform", scaleAbout(scaleAt(depth)));
        g.style.opacity = depth < 0 ? (1 + depth / (0.3 * P)).toFixed(3) : "1";
        if (shade) shade.style.opacity = shadeAt(depth).toFixed(3);
      });

      // Act two: enter. The door has arrived at scale 1; push into the keyhole.
      const doorDepth = DOOR_Z - camZ;
      const zp = Math.min(1, Math.max(0, (p - WALK_END) / (ZOOM_END - WALK_END)));
      const k = Math.pow(MAX_ZOOM, zp);
      const s = scaleAt(doorDepth) * k;
      door.setAttribute("transform", scaleAbout(s));
      doorShade.style.opacity = shadeAt(doorDepth).toFixed(3);

      const glow = 1 - Math.min(1, Math.max(0, (p - WALK_END) / GLOW_FADE));
      light.style.opacity = glow.toFixed(3);
      light.style.display = glow > 0.001 ? "" : "none";
      svg.style.visibility = KR * s > COVER_RADIUS ? "hidden" : "";

      stage.style.setProperty("--kh-p", p.toFixed(4));
      stage.style.setProperty("--kh-z", zp.toFixed(4));
      track.classList.toggle("is-past-intro", p >= INTRO_END);
      track.classList.toggle("is-open", p >= 0.93);
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

  // Rendered at the walk's first frame, so the server's HTML is already the
  // start of the scene -- no flash of every arch stacked at full size.
  const archOrder = ARCH_Z.map((z, i) => ({ z, i })).reverse();

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
          ref={svgRef}
          className="keyhole-wall"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <radialGradient id="kh-light" gradientUnits="userSpaceOnUse" cx={CX} cy={CY} r={110}>
              <stop offset="0" className="kh-stop-core" />
              <stop offset="1" className="kh-stop-warm" />
            </radialGradient>
            <radialGradient id="kh-halo" gradientUnits="userSpaceOnUse" cx={CX} cy={CY + 30} r={170}>
              <stop offset="0" className="kh-stop-halo" />
              <stop offset="1" className="kh-stop-halo-fade" />
            </radialGradient>
            <linearGradient id="kd-spill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" className="kd-stop-spill" />
              <stop offset="1" className="kd-stop-spill-fade" />
            </linearGradient>
            <radialGradient id="cr-lantern-glow">
              <stop offset="0" className="cr-stop-glow" />
              <stop offset="1" className="cr-stop-glow-fade" />
            </radialGradient>
            <radialGradient id="cr-pool">
              <stop offset="0" className="cr-stop-pool" />
              <stop offset="1" className="cr-stop-pool-fade" />
            </radialGradient>
          </defs>

          {/* The end of the corridor: wall, steps, door, keyhole. Farthest,
              so drawn first; the arches paint over it. */}
          <g ref={doorRef} transform={scaleAbout(scaleAt(DOOR_Z))}>
            <path className="kd-wall" d={END_WALL} fillRule="evenodd" />
            <rect className="kd-floor" x={-BIG} y={FLOOR_Y} width={VB_W + 2 * BIG} height={BIG} />
            <path className="kd-molding" d={DOOR_MOLDING} />
            <path className="kd-door" d={DOOR_LEAVES} fillRule="evenodd" />
            <path className="kd-panel" d={FANLIGHT} />
            {PANELS.map(([x, y, w, h]) => (
              <rect key={`${x}-${y}`} className="kd-panel" x={x} y={y} width={w} height={h} rx={6} />
            ))}
            <path className="kd-seam" d={SEAM} />
            {STEPS.map(({ top, half }) => (
              <g key={top}>
                <rect className="kd-tread" x={CX - half} y={top} width={half * 2} height={7} />
                <rect className="kd-riser" x={CX - half} y={top + 7} width={half * 2} height={18} />
              </g>
            ))}
            <path
              ref={doorShadeRef}
              className="cr-shade"
              d={DOOR_SHADE}
              fillRule="evenodd"
              style={{ opacity: shadeAt(DOOR_Z) }}
            />
            <g ref={lightRef}>
              <circle cx={CX} cy={CY + 30} r={170} fill="url(#kh-halo)" />
              <path d={STEP_SPILL} fill="url(#kd-spill)" />
              <path d={KEYHOLE} fill="url(#kh-light)" />
            </g>
          </g>

          {/* The arches, far to near. */}
          {archOrder.map(({ z, i }) => (
            <g
              key={z}
              ref={(el) => {
                archRefs.current[i] = el;
              }}
              transform={scaleAbout(scaleAt(z))}
            >
              <path className="cr-wall" d={ARCH_WALL} fillRule="evenodd" />
              <path className="cr-floor" d={FLOOR_BAND} />
              <ellipse cx={CX} cy={FLOOR_Y + 40} rx={340} ry={70} fill="url(#cr-pool)" />
              <path className="cr-molding" d={ARCH_MOLDING} />
              <line className="cr-chain" x1={CX} y1={APEX_Y} x2={CX} y2={APEX_Y + 62} />
              <rect className="cr-lamp" x={CX - 22} y={APEX_Y + 62} width={44} height={66} rx={10} />
              <path
                ref={(el) => {
                  archShadeRefs.current[i] = el;
                }}
                className="cr-shade"
                d={ARCH_SHADE}
                fillRule="evenodd"
                style={{ opacity: shadeAt(z) }}
              />
              <circle cx={CX} cy={APEX_Y + 96} r={96} fill="url(#cr-lantern-glow)" />
            </g>
          ))}
        </svg>
        <p className="kh-hint-pill" aria-hidden="true">
          Scroll to walk in
        </p>
        {intro ? <div className="keyhole-intro">{intro}</div> : null}
        {children}
      </div>
    </section>
  );
}
