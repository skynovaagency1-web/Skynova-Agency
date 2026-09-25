import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { HeroCards } from "@/components/site/HeroCards";
import { DayNightToggle } from "@/components/site/DayNightToggle";
import { applyThemeMode, getThemeMode, DEFAULT_THEME } from "@/lib/theme-mode";

/**
 * The boarding clip played, not scrubbed.
 *
 * Hero.tsx drives the same footage frame by frame from scroll position: you
 * scroll, the shot advances, and the page cannot move on until you have
 * scrolled the whole 380vh track. This plays it instead. The clip runs on its
 * own clock from the runway to the window, the page holds still while it
 * does, and reaching the window releases the scroll so the sections below
 * behave like an ordinary page.
 *
 * Hero.tsx is untouched and still in the tree. Swapping the import in
 * routes/index.tsx is the whole switch in either direction, which is how
 * ParallaxHero, HeroScroll and HeroStage already sit beside each other.
 *
 * THE CLIP IS THE FIXED BACKDROP, not a second copy of it. .hero-video-fixed
 * is `position: fixed; inset: 0`, and TripSearch and .hero-afterglow are
 * already built to read through it -- so the shot the visitor watched keeps
 * sitting behind the glass as they scroll past, and only one video is ever
 * decoded.
 */

/**
 * The window gate: the cut where the porthole fills the frame, 17.2s into a
 * 26.37s clip.
 *
 * Read off the footage rather than guessed. A scene-change pass over the clip
 * put hard cuts at 12.20s, 14.80s and 17.20s, and the frame at 17.3s is
 * already the window, centred and fully framed -- so 17.2 is the first moment
 * the gate is actually on screen rather than approaching.
 */
const GATE_TIME = 17.2;

/** Where the copy starts composing in, so it arrives with the window rather
 *  than after it. */
const COPY_LEAD = 3.2;

/**
 * Save-Data or reduced motion: no clip at all.
 *
 * Someone who has asked for less motion should not be held on a hero that is
 * nothing but motion, so these visitors skip straight to the gate state --
 * still image, copy up, page scrollable from the first frame.
 */
function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function readLightHero(): boolean {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
  );
}

/**
 * Which cut to play. Decided once per page load: following a resize would
 * swap the src and restart the clip from the runway, which is far worse than
 * a crop that is only wrong for someone who rotated mid-hero. Cached so the
 * snapshot is referentially stable, as useSyncExternalStore requires.
 */
let portraitSnapshot: boolean | null = null;

function readPortrait(): boolean {
  if (portraitSnapshot === null) {
    portraitSnapshot = window.matchMedia("(max-aspect-ratio: 1/1)").matches;
  }
  return portraitSnapshot;
}

const neverChanges = () => () => {};

export function HeroPlay() {
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const lightHero = useSyncExternalStore(subscribeReducedMotion, readLightHero, () => false);
  const portrait = useSyncExternalStore(neverChanges, readPortrait, () => false);

  /**
   * Whether the window is on screen and the page is free to move.
   *
   * DERIVED, not written from an effect. The three inputs each answer a
   * different question and none of them needs a render to settle:
   *
   *   hydrated    false on the server, true once this component is running.
   *               The prerendered document must be the one that SCROLLS -- a
   *               visitor whose JavaScript never runs, or runs late, has to
   *               get a working page, and "held" is not a state anything but
   *               this component knows how to leave.
   *   lightHero   reduced motion or Save-Data: never held at all.
   *   gateOpened  set once, from the clip or from the visitor asking to skip.
   */
  const hydrated = useSyncExternalStore(neverChanges, () => true, () => false);
  const [gateOpened, setGateOpened] = useState(false);
  const atGate = !hydrated || lightHero || gateOpened;

  // Unmounted once the glass sections have carried it off screen, so it stops
  // painting over everything below.
  const [showBackdrop, setShowBackdrop] = useState(true);

  /**
   * Covers the clip with a frame of the window when someone skips ahead.
   *
   * THE CLIP CANNOT BE SEEKED IN PRODUCTION. The Worker serves /assets with
   * no HTTP byte ranges, so `currentTime = GATE_TIME` does not jump -- it
   * clamps to whatever has downloaded. Measured on the live site: asking for
   * 17.2s landed at 7.1s, which put the skipper in the middle of the cabin
   * instead of at the window they asked for. `vite dev` hides this, because
   * the dev server does serve ranges.
   *
   * So the skip shows the gate as an IMAGE instead of chasing a seek that
   * cannot land. The clip keeps playing underneath and takes over again when
   * it genuinely reaches the window, which is seamless because both are the
   * same shot.
   */
  const [coverWithGate, setCoverWithGate] = useState(false);

  // Night mode is scoped to this page by mounting, exactly as Hero.tsx does
  // it: the attribute goes on <html> so CSS can reach .site-body, and comes
  // off when the hero unmounts. Without it, choosing night here and clicking
  // through to /hotels leaves a dark ground under sections with no dark
  // styles at all.
  useEffect(() => {
    applyThemeMode(getThemeMode());
    return () => applyThemeMode(DEFAULT_THEME);
  }, []);

  /**
   * Run the clip and open the gate.
   *
   * Everything here is time-driven rather than scroll-driven, which is the
   * whole point of this hero -- but the visitor can always leave early. A
   * wheel, a drag, a key or a click jumps to the gate rather than being
   * swallowed: holding someone on a 17-second hero with no way past is the
   * failure mode this kind of hero is known for, and a held page with no exit
   * reads as broken rather than as cinematic.
   */
  useEffect(() => {
    if (lightHero) return;
    const video = videoRef.current;
    if (!video) return;

    let done = false;

    const openGate = () => {
      if (done) return;
      done = true;
      setGateOpened(true);
      // Released, not rewound: the clip carries on through the window beat
      // and holds on its last frame, so the backdrop behind the sections is
      // live sky rather than a freeze.
      void video.play().catch(() => {});
    };

    const skip = () => {
      if (done) return;
      // No seek -- see coverWithGate above for why one cannot land here. The
      // still is what puts the window on screen; the clip is left running so
      // it catches up on its own.
      if (video.currentTime < GATE_TIME) setCoverWithGate(true);
      openGate();
    };

    const onTimeUpdate = () => {
      const t = video.currentTime;

      if (t >= GATE_TIME) {
        openGate();
        // The clip has arrived where the still was standing in. Same shot, so
        // dropping the cover is invisible. Runs even when the gate was
        // already opened by a skip -- that is the whole point of it.
        setCoverWithGate(false);
        return;
      }

      // Once the gate is open the copy is pinned up by the effect above, and
      // this ramp must not argue with it. Measured on the live site before
      // this guard: skipping opened the gate, the pin wrote --hero-grow: 1,
      // and the next timeupdate immediately wrote it back to 0.0000 -- a
      // headline that vanished a frame after it arrived.
      if (done) return;

      // The copy composes in over the last few seconds so it lands with the
      // window instead of appearing after it.
      const grow = Math.min(Math.max((t - (GATE_TIME - COPY_LEAD)) / COPY_LEAD, 0), 1);
      copyRef.current?.style.setProperty("--hero-grow", grow.toFixed(4));
      cardsRef.current?.style.setProperty("--hero-grow", grow.toFixed(4));
    };

    // A clip that will not start must not take the page with it. Autoplay can
    // be refused, the file can fail, the tab can be restored from bfcache
    // mid-clip -- in every one of those the gate opens rather than the
    // visitor being held on a still.
    const onFailure = () => openGate();

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", openGate);
    video.addEventListener("error", onFailure);
    video.addEventListener("stalled", onFailure);

    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchmove", skip, { passive: true });
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);

    // Belt and braces: if nothing has fired by the time the clip should have
    // reached the gate, open it anyway.
    const failsafe = window.setTimeout(openGate, (GATE_TIME + 4) * 1000);

    void video.play().catch(onFailure);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", openGate);
      video.removeEventListener("error", onFailure);
      video.removeEventListener("stalled", onFailure);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      window.clearTimeout(failsafe);
    };
  }, [lightHero]);

  /**
   * Pin --hero-grow to the gate state.
   *
   * .hero-copy computes `opacity: clamp(0, (var(--hero-grow, 0) - .85) * 6.7,
   * 1)`, so 0 means the headline is not dim -- it is GONE. The clip's
   * timeupdate handler ramps this over the last seconds, which covers the
   * visitor who watches to the end and nobody else. Measured on the live
   * site: skipping left --hero-grow at 0.0000 and .hero-copy at opacity 0, a
   * hero with no words on it. Reduced-motion visitors were worse off again --
   * that path never starts the clip, so the ramp never ran at all and the
   * copy could never appear.
   *
   * Driving it from `atGate` covers every route to the gate at once: watched
   * through, skipped, reduced motion, and the pre-hydration render.
   *
   * STRINGS. A number assigned to a custom property does not serialise --
   * the declaration is dropped in silence and the variable falls back to its
   * default, which here is the invisible one.
   */
  useEffect(() => {
    const grow = atGate ? "1" : "0";
    copyRef.current?.style.setProperty("--hero-grow", grow);
    cardsRef.current?.style.setProperty("--hero-grow", grow);
  }, [atGate]);

  /**
   * Hold the page still until the gate.
   *
   * `overflow: hidden` on <html> AND <body>: one alone leaves iOS Safari
   * scrolling the other. The scroll position is pinned to 0 first, because a
   * reload restores the previous offset and locking halfway down a page would
   * strand the visitor there.
   */
  useEffect(() => {
    if (atGate) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    window.scrollTo(0, 0);
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [atGate]);

  /**
   * Sink the backdrop as the glass sections pass over it, and unmount it once
   * they have. Ported unchanged from Hero.tsx, where the reasoning lives: a
   * custom property written to :root invalidates style for the whole document
   * on every scroll frame, so each value goes to the element that reads it.
   */
  useEffect(() => {
    if (!atGate) return;
    const afterglow = document.querySelector<HTMLElement>(".hero-afterglow");
    if (!afterglow) return;
    let frame = 0;
    let queued = false;

    const apply = () => {
      queued = false;
      const rect = afterglow.getBoundingClientRect();
      setShowBackdrop(rect.bottom > 0);
      const descent = rect.height > 0 ? Math.min(Math.max(-rect.top / rect.height, 0), 1) : 0;
      backdropRef.current?.style.setProperty("--hero-descent", descent.toFixed(4));
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(apply);
    };

    // Queued rather than called here: the first read sets state, and doing
    // that synchronously in an effect body is the cascade the lint rule is
    // about. One frame later is imperceptible and correct.
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [atGate]);

  const still = portrait
    ? "/assets/hero/hero-backdrop-portrait-still.jpg"
    : "/assets/hero/hero-backdrop-still.jpg";
  const gateStill = portrait
    ? "/assets/hero/hero-gate-portrait-still.jpg"
    : "/assets/hero/hero-gate-still.jpg";
  const clip = portrait
    ? "/assets/hero/hero-backdrop-portrait.mp4"
    : "/assets/hero/hero-backdrop.mp4";

  return (
    <>
      {showBackdrop ? (
        <div className="hero-video-fixed" aria-hidden="true" ref={backdropRef}>
          {/* Under the clip from the first paint, so there is never a frame
              with nothing behind the glass. */}
          <img className="hero-video-fixed-el" src={still} alt="" aria-hidden="true" />
          {lightHero ? null : (
            <video
              ref={videoRef}
              className="hero-video-fixed-el"
              src={clip}
              poster={still}
              autoPlay
              muted
              playsInline
              // NOT loop: the clip is a journey with an end, and restarting it
              // behind the sections would send the visitor back to the runway
              // they already left.
              preload="auto"
            />
          )}
          {/* Above the clip, not instead of it: the video keeps running
              underneath and this is removed the moment it reaches the same
              frame. */}
          {coverWithGate ? (
            <img className="hero-video-fixed-el" src={gateStill} alt="" aria-hidden="true" />
          ) : null}
        </div>
      ) : null}

      <section
        id="hero"
        className={`hero-stage hero-stage-portal heroplay-stage${atGate ? " is-open" : ""}`}
      >
        <div ref={copyRef} className="hero-copy">
          <div className="site-container">
            <p className="site-eyebrow mb-4">Skynova Agency</p>
            <h1 className="site-h2 max-w-2xl text-4xl md:text-6xl">Every trip. One place.</h1>
            <p className="site-ink-muted mt-4 max-w-lg text-base leading-relaxed">
              Flights, stays, cars, connectivity, tickets and tours &mdash; compared in one place,
              booked with trusted travel partners at no extra cost.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <a href="/#trip-search" className="btn-hero-pill">
                <span className="spark" />
                <span>Start your trip</span>
              </a>
              <a href="/#how-it-works" className="btn-ghost-link">
                See how it works <span className="arrow">&rarr;</span>
              </a>
            </div>
          </div>
        </div>

        <DayNightToggle className="hero-daynight" />
        <HeroCards ref={cardsRef} />

        {/* Says what is happening and how to leave. A held page with no
            explanation is indistinguishable from a broken one. */}
        <p className="heroplay-hint" aria-live="polite">
          {atGate ? "Scroll" : "Boarding… scroll to skip"}
        </p>
      </section>
    </>
  );
}
