import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Scroll-scrubbed media hero, after the 21st.dev "sunset skyline" reference:
 * scroll drives a background clip forward, the opening headline dissolves
 * into it, and near the end a display mark composes in behind an optional
 * foreground cutout, with a progress bar tracking the whole run.
 *
 * The composition is kept whole. What changed is how it is DRIVEN, plus the
 * things that would have made it unshippable here.
 *
 * THE LOCK IS GONE, AND THIS IS THE IMPORTANT ONE. The reference pins the
 * page by setting document.body.style.position = "fixed" on mount and
 * driving progress from wheel/touchmove handlers that call preventDefault().
 * It never lets go: releaseLock() is reachable only from the effect's
 * cleanup, and nothing calls it when progress reaches 1. On a page like
 * /hotels -- bullets, collections, category grid, destination picks, guides,
 * FAQ, newsletter, footer -- that is not a hero, it is a dead end. The lock
 * also takes the keyboard, the scrollbar, find-in-page and anchor links with
 * it, none of which send wheel events.
 *
 * So progress comes from the same place KeyholeHero's does, and for the same
 * reasons: a tall track with a position:sticky stage inside it, read off
 * window.scrollY. The page scrolls normally the entire time, every input
 * method still works, and the hero releases because the track ends -- an
 * unlock bug is not expressible in this shape.
 *
 * The track is measured in svh, not dvh. A phone's address bar sliding away
 * mid-scroll changes dvh, which would change the track's length underneath
 * the reader and make progress jump. Same note as .keyhole-hero.
 *
 * THREE THINGS FROM THE REFERENCE ARE NOT HERE:
 *
 *  - Its own <nav>. The reference floats a pill nav with its own links over
 *    the hero. This site has one nav, in components/site/Nav.tsx, and it is
 *    sticky -- a second one would sit on top of it.
 *  - Its signature. The reference defaults to rendering "by <author>" bottom
 *    right, linking off-site. That is a credit on someone's demo, not
 *    something a commercial page carries; the prop stays, the default is off.
 *  - Its CDN. videoSrc and skylineSrc default to files on cdn.21st.dev. This
 *    site has a Content-Security-Policy and serves its own media; a hero on
 *    someone else's demo bucket is a dependency, not an asset.
 *
 * ON `scrub`: see the prop's own note. It is off by default because it is
 * only smooth on a source encoded for it, and asking for it on a source that
 * is not is worse than not asking.
 */

/**
 * A scroll-scrubbed frame sequence, used INSTEAD of the video.
 *
 * This is the fix for the reason `scrub` had to be left off in production.
 * Seeking an MP4 needs HTTP byte ranges, and this Worker's asset handler does
 * not serve them -- a Range request for a file under /assets answers 200 with
 * the whole body and no accept-ranges header, so every currentTime assignment
 * is silently dropped and the hero sits on frame zero for the entire scroll.
 * `vite dev` DOES serve ranges, which is why the bug is invisible locally and
 * only appears once deployed.
 *
 * Still images need no ranges at all: each frame is its own request, already
 * complete when it arrives. The same reason the homepage boarding sequence in
 * components/site/Hero.tsx is a frame sequence rather than a clip, and the
 * loading strategy below is lifted from it because it was earned there.
 */
export type FrameSequence = {
  /** Directory under /assets/hero, e.g. "lobby". */
  dir: string;
  /** Filename prefix before the two-digit index, e.g. "l" -> l01.webp. */
  prefix: string;
  count: number;
};

export interface ScrubHeroProps {
  /** Background clip. Served from this origin -- see the CDN note above.
   *  Ignored when `frames` is given. */
  videoSrc: string;
  /** Scrub a frame sequence instead of the clip. Implies scrubbing: the
   *  sequence has no clock of its own, so there is nothing to play. */
  frames?: FrameSequence;
  /** Shown before the video can paint, and in its place when autoplay is
   *  refused (an iPhone in Low Power Mode). */
  posterSrc?: string;
  /**
   * Drive video.currentTime from scroll instead of letting the clip play.
   *
   * OFF BY DEFAULT, AND CHECK THE SOURCE BEFORE TURNING IT ON. Seeking to an
   * arbitrary time makes the decoder start at the previous keyframe and
   * decode forward to it, so a clip with sparse keyframes stalls under a
   * seek-per-frame -- badly on a phone. The ordinary playback encode of the
   * lobby clip carries two keyframes across 13.28s, one every 166 frames,
   * and is unusable here. hotel-lobby-scrub.mp4 beside it is the same footage
   * re-encoded for this, every frame a keyframe:
   *
   *   ffmpeg -i hotel-lobby.mp4 -an -r 15 -vf scale=-2:720 \
   *     -c:v libx264 -g 1 -crf 27 -preset slow -movflags +faststart out.mp4
   *
   * The frame rate and height come down to pay for -g 1, which is what keeps
   * the result at 6.0MB rather than the ~25MB a 1080p25 all-keyframe encode
   * costs. 15fps is not visible when scroll position picks the frame instead
   * of the clock. With scrub off the clip simply plays, and every other layer
   * here is still driven by scroll.
   */
  scrub?: boolean;
  /** Foreground cutout -- transparent but for the subject, pixel-aligned to
   *  the clip beneath it, so the subject appears to stand in front of the
   *  display mark. Omitted, the layer is not rendered at all: a cutout cut
   *  for other footage is worse than none. */
  overlaySrc?: string;
  /** The display mark that composes in as the run ends. */
  brandMark?: string;
  scrollHint?: string;
  /** The hero's own copy -- eyebrow, h1, lede, CTA. Owned by the caller,
   *  because VerticalPage's heroSlot passes none of its copy down and the
   *  page's <h1> has to live somewhere real. Dissolves as the run starts. */
  children?: ReactNode;
  /** Credit line, bottom right. Off unless asked for; see the note above. */
  signature?: { name: string; url: string } | false;
  /** Track length, in svh. The whole run happens inside it -- longer means
   *  the same run takes more scrolling, not that more happens. Defaults
   *  longer when scrubbing, so each frame gets more pixels of scroll and the
   *  clip advances smoothly instead of jumping several frames per gesture. */
  trackVh?: number;
  className?: string;
  style?: CSSProperties;
}

/* Progress breakpoints. The opening copy clears early, the mark composes in
   after it, and the cutout follows a beat later -- that gap is what makes the
   cutout read as standing in front of the mark rather than arriving with it.

   TWO SETS, because what fills the middle of the run depends on the mode.
   Scrubbing, the clip itself carries 0.3 -> 0.78 and the mark arrives after
   it, which is the reference's pacing. Playing, that stretch has nothing
   scroll-driven in it at all -- half the track where the hero stops
   responding to the reader -- so the mark moves into it and the hold at the
   end becomes a beat on the finished frame rather than a hole in the middle
   of one. */
const VIDEO_END = 0.78;
const TIMING = {
  scrub: { copyEnd: 0.3, markStart: 0.8, markEnd: 0.93, overlayStart: 0.85, overlayEnd: 0.96 },
  play: { copyEnd: 0.3, markStart: 0.46, markEnd: 0.8, overlayStart: 0.58, overlayEnd: 0.9 },
} as const;

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function ScrubHero({
  videoSrc,
  frames,
  posterSrc,
  scrub = false,
  overlaySrc,
  brandMark,
  scrollHint,
  children,
  signature = false,
  trackVh = scrub || frames ? 320 : 240,
  className,
  style,
}: ScrubHeroProps) {
  // A frame sequence IS a scrub -- it has no clock to play against -- so the
  // timing table and track length follow `scrub` without the caller having to
  // pass both and keep them agreeing.
  const scrubbing = scrub || Boolean(frames);
  const trackRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const markRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLImageElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  /**
   * `ready` uncovers the hero once there is something to show.
   *
   * Only the CLIP has a waiting state -- it has to reach
   * HAVE_CURRENT_DATA before a seek paints anything. A frame sequence has no
   * such handshake: the first image is requested on mount and the canvas is
   * already the thing on screen, so that path is ready the moment it renders.
   * It used to say so with a setReady(true) in the effect body, which is a
   * render, an effect and a second render to express something known during
   * the first one.
   */
  const [clipReady, setClipReady] = useState(false);
  const ready = Boolean(frames) || clipReady;

  // The stage sits exactly under the sticky nav, so the hero is never partly
  // behind it. Measured rather than assumed -- the nav's height changes with
  // the viewport. Same device KeyholeHero uses.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const nav = document.querySelector<HTMLElement>(".site-nav");
    const apply = () => {
      const h = nav?.getBoundingClientRect().height ?? 65;
      track.style.setProperty("--scrubhero-top", `${Math.round(h)}px`);
    };
    apply();
    if (!nav || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(apply);
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const video = videoRef.current;
    if (!track) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    let duration = 0;
    let raf = 0;
    let target = 0;
    let current = 0;
    let started = false;
    let seeking = false;
    let queued: number | null = null;

    const onLoadedData = () => {
      duration = video?.duration ?? 0;
      setClipReady(true);
    };
    // A clip restored from the back/forward cache fires nothing; readyState
    // already past HAVE_CURRENT_DATA means the frame is there to show.
    if (video) {
      if (video.readyState >= 2) onLoadedData();
      video.addEventListener("loadeddata", onLoadedData);
    }

    // iOS will not decode a <video> that has never been played, so a scrub on
    // a fresh page can sit on a black frame until something touches it. One
    // muted play()/pause() on the first gesture unlocks the decoder; it is
    // registered `once` and does nothing visible, because the pause lands in
    // the same tick and the seek loop owns currentTime from then on.
    const prime = () => {
      if (!video) return;
      void video.play().then(() => video.pause()).catch(() => {});
    };
    if (video && scrub) {
      window.addEventListener("touchstart", prime, { once: true, passive: true });
      window.addEventListener("pointerdown", prime, { once: true, passive: true });
    }

    // One seek in flight at a time. Stacking them is what turns a scrub into
    // a slideshow: each new currentTime cancels the decode the last one
    // started, so nothing ever finishes.
    const onSeeked = () => {
      seeking = false;
      if (queued !== null && video) {
        const t = queued;
        queued = null;
        seeking = true;
        video.currentTime = t;
      }
    };
    if (video && scrub) video.addEventListener("seeked", onSeeked);

    // ---- Frame sequence -------------------------------------------------
    // Everything below is inert unless `frames` was given.
    //
    // Paired scheduler/canceller at effect scope: the backfill walks the whole
    // sequence one idle callback at a time, and both the reduced-motion early
    // return and the normal cleanup have to be able to stop it.
    const idle: (cb: () => void) => number =
      typeof window.requestIdleCallback === "function"
        ? (cb) => window.requestIdleCallback(cb, { timeout: 2000 })
        : (cb) => window.setTimeout(cb, 200);
    const cancelIdle = (h: number) => {
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(h);
      else window.clearTimeout(h);
    };
    const images: HTMLImageElement[] = frames
      ? Array.from({ length: frames.count }, () => new Image())
      : [];
    const requested = new Set<number>();
    let lastDrawn = -1;
    let backfillHandle: number | null = null;

    const frameSrc = (i: number) =>
      `/assets/hero/${frames!.dir}/${frames!.prefix}${String(i + 1).padStart(2, "0")}.webp`;

    /** The backing store is capped at what the SOURCE can resolve. A cover
     *  crop on a retina phone otherwise asks for two or three times the
     *  pixels the file contains, every tick, for detail that is not there. */
    function drawFrame(i: number) {
      const canvas = canvasRef.current;
      const img = images[i];
      if (!canvas || !img || !img.complete || !img.naturalWidth) return;
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      if (!cssW || !cssH) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const wanted = Math.max((cssW * dpr) / img.naturalWidth, (cssH * dpr) / img.naturalHeight);
      const budget = wanted > 1 ? dpr / wanted : dpr;
      const w = Math.round(cssW * budget);
      const h = Math.round(cssH * budget);
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
      lastDrawn = i;
    }

    /** The loaded frame nearest `i`, or -1. Drawing something slightly stale
     *  reads as a stutter; drawing nothing is a hole in the page. */
    function nearestLoaded(i: number) {
      for (let d = 0; d < images.length; d += 1) {
        const a = i - d;
        const b = i + d;
        if (a >= 0 && images[a]?.complete && images[a].naturalWidth) return a;
        if (b < images.length && images[b]?.complete && images[b].naturalWidth) return b;
      }
      return -1;
    }

    function requestFrame(i: number) {
      if (!frames || i < 0 || i >= frames.count || requested.has(i)) return;
      requested.add(i);
      const img = images[i];
      // decode() first: `complete` only means DOWNLOADED, and leaving the
      // decode to drawImage puts it on the scroll thread mid-gesture.
      img.addEventListener(
        "load",
        () => {
          const paintIt = () => {
            const want = lastWantedFrame;
            const use = images[want]?.complete ? want : nearestLoaded(want);
            if (use >= 0) drawFrame(use);
          };
          if (typeof img.decode === "function") void img.decode().then(paintIt, paintIt);
          else paintIt();
        },
        { once: true },
      );
      img.src = frameSrc(i);
    }

    let lastWantedFrame = 0;

    if (frames) {
      // No setReady here: `ready` is already true for this path, derived at
      // the top from `frames` itself.
      requestFrame(0);
      if (images[0].complete) drawFrame(0);
      // Everything else once the page is idle, one per callback so a slow
      // connection is never handed the whole sequence at once. A flick-scroll
      // crosses the track in one gesture and lands far past any window.
      const queue = Array.from({ length: frames.count }, (_, i) => i);
      const step = (n: number) => {
        if (n >= queue.length) return;
        requestFrame(queue[n]);
        backfillHandle = idle(() => step(n + 1));
      };
      if (!reduceMotion) backfillHandle = idle(() => step(0));
    }

    function seekTo(t: number) {
      if (!video) return;
      if (seeking) {
        queued = t;
        return;
      }
      seeking = true;
      video.currentTime = t;
    }

    function readProgress() {
      const el = trackRef.current;
      const stage = stageRef.current;
      if (!el || !stage) return 0;
      const top = el.getBoundingClientRect().top + window.scrollY;
      // The run is over once the track's foot reaches the stage's foot --
      // i.e. the sticky stage has travelled the whole track.
      const travel = el.offsetHeight - stage.offsetHeight;
      // Not measurable yet (first paint, or the reduced-motion layout where
      // the track collapses to the stage). Read as "at the start", never as
      // "finished" -- returning 1 here flashes the end state before the first
      // scroll event corrects it.
      if (travel <= 0) return 0;
      return clamp01((window.scrollY - top) / travel);
    }

    const timing = scrubbing ? TIMING.scrub : TIMING.play;

    function paint(p: number) {
      if (copyRef.current) {
        const t = 1 - clamp01(p / timing.copyEnd);
        copyRef.current.style.opacity = String(t);
        copyRef.current.style.transform = `translateY(${(1 - t) * -24}px) scale(${0.96 + t * 0.04})`;
        copyRef.current.style.filter = `blur(${(1 - t) * 10}px)`;
        // Once it has faded it must stop swallowing clicks, and its links
        // must leave the tab order -- an invisible CTA is still focusable.
        copyRef.current.style.visibility = t < 0.02 ? "hidden" : "visible";
      }
      if (hintRef.current) hintRef.current.style.opacity = started ? "0" : "1";
      if (markRef.current) {
        const t = clamp01((p - timing.markStart) / (timing.markEnd - timing.markStart));
        markRef.current.style.opacity = String(t);
        markRef.current.style.transform = `translateY(${(1 - t) * 16}px) scale(${0.98 + t * 0.02})`;
        markRef.current.style.filter = `blur(${(1 - t) * 6}px)`;
        markRef.current.style.letterSpacing = `${(1 - t) * 0.25}em`;
      }
      if (overlayRef.current) {
        overlayRef.current.style.opacity = String(
          clamp01((p - timing.overlayStart) / (timing.overlayEnd - timing.overlayStart)),
        );
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    }

    // Reduced motion: the end state, drawn once, with no track to scroll
    // through. The CSS collapses the track to one screen to match.
    if (reduceMotion) {
      if (video) video.removeAttribute("autoplay");
      // Reduced motion gets the finished frame, not the sequence: request the
      // last one only, so the cost is one image rather than fifty-six.
      if (frames) {
        lastWantedFrame = frames.count - 1;
        requestFrame(frames.count - 1);
      }
      paint(1);
      if (copyRef.current) {
        copyRef.current.style.opacity = "1";
        copyRef.current.style.transform = "none";
        copyRef.current.style.filter = "none";
        copyRef.current.style.visibility = "visible";
      }
      if (markRef.current) markRef.current.style.opacity = "0";
      return () => {
        video?.removeEventListener("loadeddata", onLoadedData);
        if (backfillHandle !== null) cancelIdle(backfillHandle);
      };
    }

    function frame() {
      current += (target - current) * 0.18;
      if (frames) {
        // Same slice of the track the clip would have occupied, so the mark
        // and cutout timings below need no separate case.
        const i = Math.min(
          frames.count - 1,
          Math.round(clamp01(current / VIDEO_END) * (frames.count - 1)),
        );
        lastWantedFrame = i;
        // A window around where the scroll actually is, ahead of the idle
        // backfill, so the first pass down the track never outruns loading.
        for (let k = i - 1; k <= i + 6; k += 1) requestFrame(k);
        if (i !== lastDrawn) {
          const use = images[i]?.complete && images[i].naturalWidth ? i : nearestLoaded(i);
          if (use >= 0) drawFrame(use);
        }
      } else if (scrub && duration > 0) {
        seekTo(clamp01(current / VIDEO_END) * duration);
      }
      paint(current);
      raf = requestAnimationFrame(frame);
    }

    const onScroll = () => {
      target = readProgress();
      if (target > 0.001) started = true;
    };
    onScroll();
    current = target;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    raf = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      if (backfillHandle !== null) cancelIdle(backfillHandle);
      // Drop any in-flight frame request so a sequence does not keep
      // downloading after the hero unmounts.
      for (const img of images) img.src = "";
      video?.removeEventListener("loadeddata", onLoadedData);
      video?.removeEventListener("seeked", onSeeked);
      window.removeEventListener("touchstart", prime);
      window.removeEventListener("pointerdown", prime);
    };
    // `scrubbing` is `scrub || Boolean(frames)`, so it cannot change without
    // one of the other two changing -- but the rule cannot see that, and an
    // ignore comment here would also silence a genuinely missing dependency
    // the next time this effect grows.
  }, [scrub, frames, scrubbing]);

  return (
    <section
      ref={trackRef}
      className={className ? `scrubhero ${className}` : "scrubhero"}
      style={{ height: `${trackVh}svh`, ...style }}
    >
      <div ref={stageRef} className="scrubhero-stage">
        {frames ? (
          // The poster sits UNDER the canvas rather than being swapped for
          // it: the canvas is transparent until the first frame decodes, and
          // a hero that flashes empty on load is the thing the poster exists
          // to prevent.
          <>
            {posterSrc ? (
              <img className="scrubhero-media" src={posterSrc} alt="" aria-hidden="true" />
            ) : null}
            <canvas ref={canvasRef} className="scrubhero-media" aria-hidden="true" />
          </>
        ) : (
          <video
            ref={videoRef}
            className="scrubhero-media"
            src={videoSrc}
            poster={posterSrc}
            muted
            playsInline
            preload="auto"
            // Only when the clip is meant to play. Under scrub, autoplay and
            // the seek loop fight each other for currentTime.
            autoPlay={!scrub}
            loop={!scrub}
            aria-hidden="true"
            style={{ opacity: ready || posterSrc ? 1 : 0 }}
          />
        )}

        {/* Below the cutout on purpose, so the cutout's subject reads as
            standing in front of the mark. */}
        {brandMark ? (
          <div ref={markRef} className="scrubhero-mark" aria-hidden="true">
            <span>{brandMark}</span>
          </div>
        ) : null}

        {overlaySrc ? (
          <img ref={overlayRef} className="scrubhero-cutout" src={overlaySrc} alt="" aria-hidden="true" />
        ) : null}

        <div className="scrubhero-scrim" aria-hidden="true" />

        <div ref={copyRef} className="scrubhero-copy">
          {children}
        </div>

        {scrollHint ? (
          <div ref={hintRef} className="scrubhero-hint" aria-hidden="true">
            <span>{scrollHint}</span>
            <svg width="14" height="18" viewBox="0 0 14 18" className="scrubhero-hint-arrow">
              <path
                d="M7 1 L7 17 M2 12 L7 17 L12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ) : null}

        <div className="scrubhero-bar" aria-hidden="true">
          <div ref={barRef} className="scrubhero-bar-fill" />
        </div>

        {signature ? (
          <span className="scrubhero-signature">
            by{" "}
            <a href={signature.url} target="_blank" rel="noopener noreferrer">
              {signature.name}
            </a>
          </span>
        ) : null}
      </div>
    </section>
  );
}

export default ScrubHero;
