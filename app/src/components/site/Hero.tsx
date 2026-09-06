import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

// Beats sourced from video are shipped as frame sequences and scrubbed by
// scroll rather than played. A looping <video> runs on its own clock, so it
// keeps moving while the page is still -- it reads as a background loop
// behind the page instead of part of the sequence. Frames also come out
// LIGHTER here: 36 runway stills at 1200w WebP are ~870KB against 1.8MB for
// the same shot as H.264.
//
// Each entry scrubs across its own slice of scroll progress. `range` must
// stay inside the matching STAGES row below, or a shot would still be
// scrubbing after it has faded out.
type Scrub = {
  key: string;
  count: number;
  dir: string;
  prefix: string;
  range: [number, number];
};

// Frame provenance. All three beats are the site owner's own Dola AI clips,
// re-cut on 5 Sep 2026 after they supplied watermark-free exports. The
// previous exports burned a "Dola AI" mark into the bottom-right of every
// frame; it shipped live on all 36 runway and all 30 window frames. It was
// never edited out here -- the clips were replaced at source.
//
// These frames are the full 1248x704 of the source, not the old 1200x676:
// that crop existed only to hide the watermark, so it could go. Quality is
// webp q=80 (the old frames were 13-35KB, visibly over-compressed). 1248 is
// the hard ceiling of the footage, so on a wide desktop the hero is upscaled
// ~20%; a sharper hero needs a higher-resolution export, not a re-encode.
//
// If a beat is ever re-cut, check the bottom-right corner of EVERY frame
// before shipping, not just one: the watermark survived review the first
// time because only a single frame was spot-checked.
const SCRUBS: Scrub[] = [
  // Exterior runway, pushing forward into the cabin.
  { key: "runway", count: 36, dir: "runway", prefix: "r", range: [0, 0.26] },
  // The cabin reveal: wide interior travelling down to a single seat at the
  // window. This replaced two static photographs that used to sit here --
  // scrubbed frames carry the camera move the stills could only imply.
  { key: "interior", count: 36, dir: "interior", prefix: "i", range: [0.26, 0.56] },
  // The window itself, camera easing toward the glass with the sky moving
  // outside. Ends before the portal opening takes over at 0.74.
  { key: "window", count: 30, dir: "window", prefix: "w", range: [0.52, 0.78] },
];

const frameSrc = (s: Scrub, i: number) =>
  `/assets/hero/${s.dir}/${s.prefix}${String(i + 1).padStart(2, "0")}.webp`;

export function Hero() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  // One canvas per scrubbed beat, keyed so a beat can be added or reordered
  // without rewiring refs.
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});
  const imagesRef = useRef<Record<string, HTMLImageElement[]>>({});
  const lastFrameRef = useRef<Record<string, number>>({});
  // Scroll-driven custom properties are written to these elements directly,
  // never to :root -- see the comment on writeVar in the effect below.
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLParagraphElement | null>(null);
  // The fixed video backdrop is only meant to show behind the hero and the
  // glass section right after it -- once that section has scrolled past,
  // unmount it entirely (not just hide it) so it stops decoding/rendering
  // and every section below behaves like a normal page.
  const [showFixedBg, setShowFixedBg] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const afterglow = document.querySelector<HTMLElement>(".hero-afterglow");

    // These custom properties used to be set on document.documentElement.
    // That is the single most expensive thing this component can do: a
    // custom property on :root invalidates style for every node that could
    // inherit it -- the whole document, ~1300 nodes -- on every scroll
    // frame. Measured on the live site, the eight writes plus the forced
    // flush cost 33ms per frame (22fps, 45% of frames janky); the identical
    // writes against a leaf node cost 0.06ms. Only seven rules read these
    // variables, so each value now goes straight to the element that
    // consumes it and invalidation stays inside that element.
    //
    // If you add a rule that reads --hero-*/--seq-*, give its element a ref
    // and write to it here too. Do NOT reintroduce a :root write.
    // Keyed by the element itself, not by class name: the fixed layers
    // unmount and remount with showFixedBg, and a remounted node starts with
    // no inline style. A WeakMap gives the fresh node fresh memo state, so
    // its first write always lands instead of being skipped as "unchanged".
    const lastVars = new WeakMap<HTMLElement, Map<string, string>>();
    function writeVar(el: HTMLElement | null, name: string, value: string) {
      if (!el) return;
      // Skip the DOM write when the value is unchanged -- common for the seq
      // opacities, which sit pinned at 0 or 1 for long stretches of scroll.
      let seen = lastVars.get(el);
      if (!seen) {
        seen = new Map();
        lastVars.set(el, seen);
      }
      if (seen.get(name) === value) return;
      seen.set(name, value);
      el.style.setProperty(name, value);
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Canvas has no object-fit, so the cover crop is computed by hand:
    // scale by whichever axis needs more, then centre the overflow.
    function drawFrame(scrub: Scrub, index: number) {
      const canvas = canvasRefs.current[scrub.key];
      const img = imagesRef.current[scrub.key]?.[index];
      if (!canvas || !img || !img.complete || !img.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      if (!cssW || !cssH) return;
      const w = Math.round(cssW * dpr);
      const h = Math.round(cssH * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      lastFrameRef.current[scrub.key] = index;
    }

    // Frame 1 of each beat is drawn the moment it decodes, so no canvas is
    // ever blank while the rest of its frames stream in behind it.
    for (const scrub of SCRUBS) {
      if (imagesRef.current[scrub.key]) continue;
      imagesRef.current[scrub.key] = Array.from({ length: scrub.count }, (_, i) => {
        const img = new Image();
        img.src = frameSrc(scrub, i);
        return img;
      });
      lastFrameRef.current[scrub.key] = -1;
      const first = imagesRef.current[scrub.key][0];
      if (first.complete) drawFrame(scrub, 0);
      else first.addEventListener("load", () => drawFrame(scrub, 0), { once: true });
    }

    function drawFrameForProgress(progress: number) {
      for (const scrub of SCRUBS) {
        const [from, to] = scrub.range;
        const t = Math.min(Math.max((progress - from) / (to - from), 0), 1);
        const index = Math.round(t * (scrub.count - 1));
        if (index === lastFrameRef.current[scrub.key]) continue;
        // A frame still in flight leaves the previous one up rather than
        // flashing a gap; the next scroll tick picks it up once decoded.
        if (imagesRef.current[scrub.key][index]?.complete) drawFrame(scrub, index);
      }
    }

    if (reduceMotion) {
      return;
    }

    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    function easeInOutCubic(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Milder than a full cubic ease-in -- t^3 stays almost flat until very
    // late (a real problem once it's stacked on top of the GROW_START
    // delay below: the frame would barely move for most of the scroll,
    // then snap open in the last few percent). t^1.6 still gathers speed
    // like a launch, but stays visibly in motion the whole way through.
    function easeGrow(t: number) {
      return Math.pow(t, 1.6);
    }

    // The window's grow no longer starts near the top of the scroll: the
    // boarding sequence below plays first, and the window only opens once
    // we've arrived at it.
    const GROW_START = 0.74;

    // The dolly-in on the seat shot. Ends at 0.56, which is where STAGES has
    // the interior layer finish fading out -- so the push completes exactly
    // as the window beat takes over, and neither move interrupts the other.
    const PUSH_START = 0.4;
    const PUSH_END = 0.56;

    // The boarding sequence -- runway, cabin, seat, window -- as crossfading
    // full-bleed layers. Each stage is [fadeInStart, fadeInEnd, fadeOutStart,
    // fadeOutEnd] against raw scroll progress, with each stage's fade-in
    // overlapping the previous one's fade-out so there's never a blank frame
    // between them. The last stage holds to 1 and is instead uncovered by
    // the window opening, so it doesn't fade out on its own.
    // Crossfades hold the OUTGOING layer at full opacity and fade the
    // incoming one in over the top, rather than fading both. Two layers at
    // 0.5 don't compose to opaque -- coverage is 1-(0.5*0.5), so a quarter
    // of the cloud video behind them showed straight through mid-transition.
    // Holding the outgoing layer means something is always fully opaque, so
    // nothing behind can bleed. Each layer then snaps off once the next has
    // fully covered it, which is invisible precisely because it's covered.
    // Three beats now, not four: the two still photographs in the middle
    // were replaced by one scrubbed sequence that travels between them.
    // Each stage's fade-IN overlaps the previous stage's fade-OUT, and the
    // outgoing layer is held fully opaque until the incoming one has covered
    // it -- two layers at 0.5 compose to 0.75, not 1, which would let the
    // cloud video behind show through mid-transition.
    const STAGES: Array<[number, number, number, number]> = [
      [0.0, 0.0, 0.26, 0.27], // runway (scrubbed)
      [0.18, 0.26, 0.56, 0.57], // interior reveal (scrubbed)
      [0.5, 0.56, 0.74, 0.9], // window (scrubbed) -- clears as the portal opens
    ];

    function stageOpacity(p: number, [inA, inB, outA, outB]: [number, number, number, number]) {
      if (p < inA) return 0;
      if (inB > inA && p < inB) return (p - inA) / (inB - inA);
      if (p < outA) return 1;
      if (outB > outA && p < outB) return 1 - (p - outA) / (outB - outA);
      return p >= outB && outB > outA ? 0 : 1;
    }

    function update() {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const rect = wrapper!.getBoundingClientRect();
        const total = wrapper!.offsetHeight - window.innerHeight;
        const progress = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
        const eased = easeInOutCubic(progress);
        writeVar(hintRef.current, "--hero-progress", eased.toFixed(4));

        // Camera push: while still on the seat shot, dolly toward the window
        // so arriving at the window beat reads as continuous movement rather
        // than a crossfade between two separate shots. Runs across the tail
        // of the interior beat and finishes exactly as that layer clears.
        const pushRaw = Math.min(Math.max((progress - PUSH_START) / (PUSH_END - PUSH_START), 0), 1);
        // Smoothstep, so the move eases in and settles instead of ramping
        // linearly and stopping dead.
        const push = pushRaw * pushRaw * (3 - 2 * pushRaw);
        writeVar(canvasRefs.current.interior, "--seq-2-push", push.toFixed(4));

        const growRaw = Math.min(Math.max((progress - GROW_START) / (1 - GROW_START), 0), 1);
        const grow = easeGrow(growRaw).toFixed(4);
        // --hero-grow has two consumers: the window layer that scales open,
        // and the hero copy that pulls back as it does.
        writeVar(canvasRefs.current.window, "--hero-grow", grow);
        writeVar(copyRef.current, "--hero-grow", grow);

        // Crossfade the boarding sequence. Opacities are computed here rather
        // than as CSS calc() chains so the timings above stay readable and
        // tunable in one place.
        // Each layer owns its own opacity variable, in stage order:
        // 1 runway, 2 interior reveal, 3 window -- all scrubbed canvases.
        const seqTargets: Array<HTMLElement | null> = [
          canvasRefs.current.runway,
          canvasRefs.current.interior,
          canvasRefs.current.window,
        ];
        for (let i = 0; i < STAGES.length; i++) {
          writeVar(seqTargets[i], `--seq-${i + 1}`, stageOpacity(progress, STAGES[i]).toFixed(4));
        }

        drawFrameForProgress(progress);
        // Once the afterglow section has fully scrolled past (its bottom
        // edge is above the viewport), unmount the fixed backdrop so it
        // stops covering every section below it.
        if (afterglow) {
          const ar = afterglow.getBoundingClientRect(); // one layout read, used twice
          setShowFixedBg(ar.bottom > 0);
          // Descent: once the portal is open and you're out in the cloud,
          // keep scrolling and the camera sinks through the deck rather than
          // the shot sitting still behind the sections. Runs 0 -> 1 across
          // the afterglow, which is exactly the stretch the cloud video is
          // still visible behind, so it finishes right as the video unmounts.
          const descent = ar.height > 0 ? Math.min(Math.max(-ar.top / ar.height, 0), 1) : 0;
          writeVar(videoRef.current, "--hero-descent", descent.toFixed(4));
        }

        mouseX += (targetMouseX - mouseX) * 0.12;
        mouseY += (targetMouseY - mouseY) * 0.12;
        writeVar(copyRef.current, "--hero-mx", mouseX.toFixed(4));
        writeVar(copyRef.current, "--hero-my", mouseY.toFixed(4));

        // Keep animating while the cursor lerp hasn't settled yet, even with
        // no new scroll/pointer events -- otherwise it would freeze mid-drift.
        if (Math.abs(mouseX - targetMouseX) > 0.001 || Math.abs(mouseY - targetMouseY) > 0.001) {
          update();
        }
      });
    }

    function onPointerMove(e: PointerEvent) {
      targetMouseX = e.clientX / window.innerWidth - 0.5;
      targetMouseY = e.clientY / window.innerHeight - 0.5;
      update();
    }

    // A resize doesn't change the frame INDEX, so drawFrameForProgress would
    // early-out and leave the canvas at its old backing-store size. Clearing
    // the memo forces the redraw that re-fits the cover crop.
    function onResize() {
      for (const scrub of SCRUBS) lastFrameRef.current[scrub.key] = -1;
      update();
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Fixed backdrop, split into two independent fixed layers so the
          text can sit stacked BETWEEN them: the video sits lowest and stays
          static, the hero copy paints above it (fading/pulling back as the
          window grows, see .hero-copy), and the window photo paints highest
          of all -- it's a real alpha-transparent cutout (opaque cabin,
          transparent glass), so the cloud video is visible through the
          glass from the very first frame, before any scroll happens. As
          --hero-grow increases it scales up (see .hero-video-window-overlay)
          and pushes its own opaque cabin edges off-screen, revealing more
          of the same video underneath -- a smooth CSS scale, not a video
          cut, so there's no jarring transition to tune. All of it unmounts
          (see showFixedBg above) once scrolled past the glass afterglow
          section so it doesn't paint over the page below. */}
      {showFixedBg ? (
        <div className="hero-video-fixed" aria-hidden="true">
          <video
            ref={videoRef}
            className="hero-video-fixed-el"
            src="/assets/hero/cloud-video.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      ) : null}
      {/* The boarding sequence: runway, cabin, seat, window -- four opaque
          full-bleed layers stacked over the cloud video and crossfaded by
          scroll (--seq-1..4, set in the effect above). They cover the cloud
          video entirely until the window opens at the end and reveals it,
          which is what makes the reveal land: you never see where you're
          going until the portal is open. */}
      {showFixedBg ? (
        <div className="hero-seq" aria-hidden="true">
          {/* Scroll-scrubbed, not autoplaying: the runway beat is a canvas
              driven by scroll position (see drawFrame below), so the shot
              advances only as you scroll. As a looping <video> it ran on its
              own clock, which read as a background loop playing behind the
              page rather than as part of the sequence. */}
          <canvas
            ref={(el) => {
              canvasRefs.current.runway = el;
            }}
            className="hero-seq-layer hero-seq-1"
          />
          {/* The cabin reveal, scrubbed like the beats either side of it.
              Two stills used to sit here; a scrubbed sequence moves with the
              scroll instead of cutting between fixed frames. */}
          <canvas
            ref={(el) => {
              canvasRefs.current.interior = el;
            }}
            className="hero-seq-layer hero-seq-2"
          />
          {/* The window beat, also scrubbed: the camera eases toward the glass
              while the sky moves outside it. This replaced the alpha-cutout
              still -- that cutout existed to get live sky into a static
              photograph's dead pane, and a moving shot solves the same
              problem at the source, without the per-frame masking that
              approach would now need. */}
          <canvas
            ref={(el) => {
              canvasRefs.current.window = el;
            }}
            className="hero-seq-layer hero-seq-3"
          />
        </div>
      ) : null}
      <div ref={wrapperRef} className="hero-scroll-wrapper">
        <section id="hero" className="hero-stage hero-stage-portal">
          <div ref={copyRef} className="hero-copy">
            <div className="site-container">
              <p className="site-eyebrow mb-4">Skynova Agency</p>
              <h1 className="site-h2 max-w-2xl text-4xl md:text-6xl">Every trip. One place.</h1>
              <p className="site-ink-muted mt-4 max-w-lg text-base leading-relaxed">
                Flights, stays, cars, connectivity, tickets and tours &mdash; compared in one place, booked with trusted travel partners.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <Link to="/destinations" className="btn-hero-pill">
                  <span className="spark" />
                  <span>Start your trip</span>
                </Link>
                <a href="/#how-it-works" className="btn-ghost-link">
                  See how it works <span className="arrow">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
          <p ref={hintRef} className="hero-scroll-hint">
            Scroll
          </p>
        </section>
      </div>
      {/* The old alpha-cutout window overlay used to live here and scale open.
          It's gone: it sat above the boarding sequence and was visible from
          the first frame, so stages 1-3 played *inside* a porthole -- a cabin
          viewed through a plane window, which read as a mistake. The window
          beat of the sequence (seq-portal) is itself a window photo, so it
          does the opening now, scaling toward the viewer as it fades. */}
    </>
  );
}
