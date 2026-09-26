import * as React from "react";

import { Globe } from "@/components/ui/globe";
import { cn } from "@/lib/utils";

/**
 * Scroll-driven stage, after the 21st.dev "landing-page" reference: a set of
 * full-height sections with one subject floating between them, moving and
 * rescaling as each section takes the viewport.
 *
 * The reference hard-codes its globe. This takes the subject as a prop, still
 * defaulting to that globe, because the homepage flies an airliner there
 * instead -- and "what travels between the sections" is the caller's decision,
 * not the stage's. Everything below is the same either way: the stage only
 * positions and scales whatever it is given.
 *
 * (It is still exported from "landing-page.tsx", the reference's own filename,
 * and the globe is still in components/ui/globe.tsx as the default subject.)
 *
 * THE ONE STRUCTURAL CHANGE: the reference is the whole page. It reads
 * progress from `document.documentElement.scrollHeight`, and its globe, dot
 * nav and progress bar are `fixed` for the document's entire length. Dropped
 * on top of a homepage that already has a dozen sections under it, that globe
 * would hang over the trip search, the destination slider and the footer, and
 * the progress bar would report the whole page's scroll as if it were this
 * component's.
 *
 * So everything here is measured against the container instead:
 *
 *  - progress is this element's own travel through the viewport, 0 -> 1;
 *  - the fixed layers -- the globe, the dot nav and the progress bar -- are
 *    mounted only while the container is on screen, so they stop existing the
 *    moment the page moves past them: no paint, no compositor layer, nothing
 *    over the content below.
 *
 * That on-screen test comes from the same rect the progress uses, not from an
 * IntersectionObserver. An observer was the obvious tool and the wrong one:
 * it delivers nothing while the document is not being rendered, so a tab
 * restored from the background, or a page whose first paint the browser
 * defers, can hydrate with the hero's whole subject missing and no scroll to
 * bring it back. The rect is already measured on mount, on scroll and on
 * resize -- one pass, no second async API, and it cannot fail closed.
 *
 * That leaves it usable as a page, as the reference intends, and usable as an
 * opening act, which is what the homepage needs.
 *
 * Smaller corrections, each a real failure rather than a preference:
 *
 *  - the section ref callback was `(el) => (sectionRefs.current[i] = el)`,
 *    which returns the element. React 19 reads a ref callback's return value
 *    as a cleanup function and throws on anything else. It needs a body.
 *  - `useRef<number>()` and `useRef<NodeJS.Timeout>()` are both arity errors
 *    under React 19's types, and `NodeJS.Timeout` is the wrong type for a
 *    browser timer besides. The label timeout was never set or read, so it is
 *    gone rather than repaired -- as are `lerp`, `lastScrollTime` and
 *    `showNavLabel`, none of which the reference ever used.
 *  - `updateScrollPosition` listed `activeSection` as a dependency without
 *    reading it, rebuilding the callback and re-binding the scroll listener on
 *    every section change.
 *
 * No "use client": this project has no RSC boundary, and a directive that does
 * nothing invites the next reader to believe there is one.
 */
export interface ScrollStageSection {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  description: string;
  align?: "left" | "center" | "right";
  features?: { title: string; description: string }[];
  actions?: { label: string; href?: string; external?: boolean; variant: "primary" | "secondary" }[];
  /** Rendered in place of `features`, for a section whose body is not a plain
   *  list -- the homepage's reach section hands over its gradient cards. */
  body?: React.ReactNode;
}

export interface StagePosition {
  top: string;
  left: string;
  scale: number;
  /** How much of the subject shows through. "backdrop" is the faint one, for
   *  a position that sits behind copy. Defaults to backdrop at scale >= 1.8,
   *  which is what the reference implies by dropping its globe's opacity
   *  there -- but a narrow viewport needs to say so at any scale, because on a
   *  phone every position is behind the copy. */
  role?: "companion" | "backdrop";
  /** A selector, resolved inside this section, whose vertical centre the
   *  subject should sit level with -- instead of the fixed `top` above.
   *
   *  A percentage of the viewport cannot do this. The copy is centred in a
   *  min-height section, so the headline's position moves with the viewport
   *  height on a curve that is not proportional to it: measured level at
   *  375x560, the same fixed 38% left the globe 93px above the headline at
   *  375x667. Reading the element is exact at every height, and costs one
   *  getBoundingClientRect on a pass that is already measuring three. */
  alignTo?: string;
}

export interface ScrollStageProps extends React.HTMLAttributes<HTMLDivElement> {
  sections: ScrollStageSection[];
  /** Where the subject sits for each section, in viewport units.
   *  `narrowPositions` is the same list for viewports under 640px, where
   *  "beside the copy" does not exist -- at 375px every anchor point overlaps
   *  the headline, so the subject wants somewhere else entirely rather than
   *  the wide layout shrunk down. Omitted, the wide positions are used at
   *  every width. */
  globeConfig?: { positions: StagePosition[]; narrowPositions?: StagePosition[] };
  /** The thing that travels between the sections. Defaults to the reference's
   *  rotating globe. Anything self-contained works -- the stage only positions
   *  and scales it. */
  subject?: React.ReactNode;
  /** A selector for an element FURTHER DOWN THE PAGE that the subject flies to
   *  and lands on once the sections are done -- the homepage's "Fly anywhere"
   *  stage, which holds the WebGL globe.
   *
   *  Given one, the subject does not stop at the last section. It keeps going:
   *  receding to almost nothing across the page in between, then growing back
   *  to the target's own size and position, where `onDock` fires and the
   *  caller can swap in whatever really lives there. Omitted, the subject
   *  behaves as the reference's does and ends with the last section. */
  dockTo?: string;
  /** Fires true when the subject has arrived on `dockTo`, false when it leaves
   *  again. The caller hands over to the real thing on true. */
  onDock?: (docked: boolean) => void;
  /** Whether the subject fades out as it lands.
   *
   *  True -- the default, and the original behaviour -- assumes something
   *  else lives on the target and fades in underneath, so the traveller
   *  disappears and the two read as one object swapping renderers.
   *
   *  FALSE when nothing lives there. The subject lands and STAYS, becoming
   *  the thing on the target rather than handing over to it. Without this the
   *  fade runs to exactly zero at t >= 1 and the globe flies the length of
   *  the page only to vanish into an empty ring. */
  handoffOnDock?: boolean;
  /** The subject's own rendered width at scale 1, in px. The dock target's
   *  width is divided by this to get the scale at which the two are the same
   *  size. Defaults to the stage's own globe. */
  subjectBasePx?: number;
  /** What fraction of `dockTo`'s width the thing living there actually fills.
   *  1 means it fills the box. The homepage's WebGL globe does not: it is a
   *  perspective canvas, and the planet inside it covers about seven tenths of
   *  the frame, so docking to the full box overshot it by half again. */
  dockFill?: number;
}

const defaultGlobeConfig = {
  positions: [
    { top: "50%", left: "75%", scale: 1.4 },
    { top: "25%", left: "50%", scale: 0.9 },
    { top: "15%", left: "90%", scale: 2 },
    { top: "50%", left: "50%", scale: 1.8 },
  ],
};

const parsePercent = (value: string) => parseFloat(value.replace("%", ""));

const NARROW = "(max-width: 639px)";

interface TransitState {
  left: number;
  top: number;
  scale: number;
  fade: number;
  docked: boolean;
}

/** The subject's own rendered width at scale 1, in px -- the number the dock
 *  target's width is divided by to get the scale that makes the two the same
 *  size. It is the .globe default from styles.css; a caller whose subject is a
 *  different size passes its own via `subjectBasePx`. */
const DEFAULT_SUBJECT_BASE_PX = 250;

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);
const mix = (from: number, to: number, t: number) => from + (to - from) * t;
/** Ease-in-out, so the subject leaves and arrives gently instead of tracking
 *  the scrollbar linearly. */
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/** Matches the stylesheet's own 640px break. Starts false so the server and
 *  the hydration pass agree on the wide layout; the real answer arrives on the
 *  commit straight after, which is the same shape lib/theme-mode.ts uses. */
function useNarrow() {
  const [narrow, setNarrow] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia(NARROW);
    const onChange = () => setNarrow(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return narrow;
}

export function ScrollStage({
  sections,
  globeConfig = defaultGlobeConfig,
  subject = <Globe />,
  dockTo,
  onDock,
  handoffOnDock = true,
  subjectBasePx = DEFAULT_SUBJECT_BASE_PX,
  dockFill = 1,
  className,
  ...props
}: ScrollStageProps) {
  const [activeSection, setActiveSection] = React.useState(0);

  /**
   * THE PER-FRAME VALUES ARE WRITTEN TO THE DOM, NOT HELD IN STATE.
   *
   * This component used to call setTransit(), setScrollProgress() and
   * setAlignedTop() from inside its scroll rAF. setTransit built a fresh
   * object every frame, so React could never bail out: the whole stage --
   * four sections, their features, their buttons and the dot nav -- re-rendered
   * sixty times a second, and the globe it was trying to move smoothly was the
   * thing that paid for it.
   *
   * Measured on the live page, scrolling through the dock: 26.8ms median
   * frame, 40.1ms at p90, 70.2ms worst, and 23 of 70 frames over 32ms. A
   * third of the journey was dropping frames, which is exactly the "moves a
   * lot, not smooth" this was reported as.
   *
   * Hero.tsx already learned this and says so: the same writes against a leaf
   * node cost 0.06ms where going through React cost 33ms. So the transform,
   * the opacity and the progress bar go straight to their own nodes, and
   * React state now only carries what changes rarely -- which section is
   * active, and whether the subject is mounted at all.
   */
  const subjectRef = React.useRef<HTMLDivElement | null>(null);
  const progressRef = React.useRef<HTMLDivElement | null>(null);
  const transitRef = React.useRef<TransitState | null>(null);
  const alignedTopRef = React.useRef<number | null>(null);
  // Starts true: this renders at the top of the page, so the honest first
  // paint has the globe in it -- and SSR has no viewport to measure against.
  const [inView, setInView] = React.useState(true);
  /** Whether the subject is between the last section and the dock target.
   *  A boolean, so it only re-renders on the two frames it actually flips --
   *  the values themselves live in transitRef above. */
  const [inTransit, setInTransit] = React.useState(false);
  const docked = React.useRef(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const sectionRefs = React.useRef<(HTMLElement | null)[]>([]);
  const frame = React.useRef<number | null>(null);

  const narrow = useNarrow();
  const source = (narrow && globeConfig.narrowPositions) || globeConfig.positions;
  const positions = React.useMemo(
    () =>
      source.map((p) => ({
        top: parsePercent(p.top),
        left: parsePercent(p.left),
        scale: p.scale,
        role: p.role ?? (p.scale >= 1.8 ? "backdrop" : "companion"),
        alignTo: p.alignTo,
      })),
    [source],
  );

  // Guards a caller who hands over more sections than globe positions: the
  // reference indexes straight into the array and reads `undefined.left`.
  const positionFor = React.useCallback(
    (index: number) => positions[Math.min(index, positions.length - 1)] ?? positions[0],
    [positions],
  );

  /**
   * Put a frame on the subject.
   *
   * Everything the scroll loop produces lands here and goes straight to the
   * node. `fade` is null while the sections own the subject -- the inline
   * opacity and transition are cleared so the CSS role rules take back over --
   * and a number in transit, where the 1400ms section easing must not apply or
   * the globe lags the scrollbar by most of a second.
   */
  const writeSubject = React.useCallback(
    (place: { left: number; top: number; scale: number }, fade: number | null) => {
      const el = subjectRef.current;
      if (!el) return;
      el.style.transform =
        `translate3d(${place.left}vw, ${place.top}vh, 0) translate3d(-50%, -50%, 0) ` +
        `scale3d(${place.scale}, ${place.scale}, 1)`;
      if (fade === null) {
        el.style.removeProperty("opacity");
        el.style.removeProperty("transition");
      } else {
        el.style.opacity = String(fade);
        el.style.transition = "none";
      }
    },
    [],
  );

  const update = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Progress across this element's own travel, not the document's.
    const rect = container.getBoundingClientRect();
    const travel = rect.height - window.innerHeight;
    const progress = travel > 0 ? Math.min(Math.max(-rect.top / travel, 0), 1) : 0;
    // Straight to the bar. A state update here re-rendered the stage on every
    // frame of the entire page, for one scaleX.
    if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
    setInView(rect.bottom > 0 && rect.top < window.innerHeight);

    const viewportCenter = window.innerHeight / 2;
    let nearest = 0;
    let shortest = Infinity;
    sectionRefs.current.forEach((node, index) => {
      if (!node) return;
      const box = node.getBoundingClientRect();
      const distance = Math.abs(box.top + box.height / 2 - viewportCenter);
      if (distance < shortest) {
        shortest = distance;
        nearest = index;
      }
    });
    setActiveSection(nearest);

    // Level with an element, when the position asks for it.
    const wanted = positionFor(nearest).alignTo;
    const host = sectionRefs.current[nearest];
    const anchor = wanted && host ? host.querySelector<HTMLElement>(wanted) : null;
    if (anchor) {
      const box = anchor.getBoundingClientRect();
      alignedTopRef.current = ((box.top + box.height / 2) / window.innerHeight) * 100;
    } else {
      alignedTopRef.current = null;
    }

    /** The subject's resting place when the sections own it. */
    const onStage = () => {
      const base = positionFor(nearest);
      return alignedTopRef.current !== null ? { ...base, top: alignedTopRef.current } : base;
    };

    // ---- The journey past the last section, to the dock target ----
    if (!dockTo) {
      transitRef.current = null;
      setInTransit(false);
      writeSubject(onStage(), null);
      return;
    }
    const target = document.querySelector<HTMLElement>(dockTo);
    if (!target) {
      transitRef.current = null;
      setInTransit(false);
      writeSubject(onStage(), null);
      return;
    }
    const targetRect = target.getBoundingClientRect();

    if (rect.bottom > 0) {
      // Still on the stage: the sections own the subject.
      transitRef.current = null;
      setInTransit(false);
      writeSubject(onStage(), null);
      if (docked.current) {
        docked.current = false;
        onDock?.(false);
      }
      return;
    }

    // Document coordinates, not viewport ones. The two ends of this journey
    // are thousands of pixels apart and only one of them is ever on screen, so
    // expressing them as scroll positions is the only way the fractions stay
    // meaningful at both ends.
    const scrolled = window.scrollY;
    const leavesAt = rect.bottom + scrolled; // stage bottom reaches viewport top
    const arrivesAt =
      targetRect.top + targetRect.height / 2 + scrolled - window.innerHeight / 2;
    const span = arrivesAt - leavesAt;
    const t = span > 0 ? clamp01((scrolled - leavesAt) / span) : 1;

    // Position converges LATE -- nothing for the first 72% of the journey,
    // then all of it. Interpolating position evenly instead was the obvious
    // way and the wrong one: the target is four thousand pixels down, so an
    // even mix sends the subject straight through the floor and it spends the
    // middle three screens below the fold, invisible. Which makes the recede
    // pointless and turns the whole journey into a disappearance.
    // Parked at the last section's anchor instead, it stays on screen the
    // whole way and the shrink is the thing you actually see.
    const converge = ease(clamp01((t - 0.72) / 0.28));

    // How much of the subject is present at all. One value drives both the
    // size and the opacity, so they can never disagree: full as it leaves the
    // stage, gone within the first tenth of the journey, and brought back by
    // the same convergence that carries it onto the target.
    //
    // The exit is deliberately fast and measured on t, not on the eased value.
    // Easing is quadratic at the start, so an eased ramp left the subject
    // still 85% opaque and larger than it was in the hero a whole screen below
    // it -- sitting on top of the trip search, which is the one thing this
    // journey must not do.
    const exit = clamp01(t / 0.1);
    const presence = Math.max(1 - exit, converge);

    // The last few percent: the travelling subject fades out as whatever
    // really lives on the target fades in, both at the same place and the same
    // size, so the swap is not a pop.
    const handoff = clamp01((t - 0.92) / 0.08);
    const arrived = t >= 0.94;

    const last = positionFor(sectionRefs.current.length - 1);
    const next: TransitState = {
      left: mix(last.left, ((targetRect.left + targetRect.width / 2) / window.innerWidth) * 100, converge),
      top: mix(last.top, ((targetRect.top + targetRect.height / 2) / window.innerHeight) * 100, converge),
      // Ends at the target's own size: the dock element's width against the
      // subject's natural width is the scale that makes them one object.
      // Never all the way to nothing -- a subject that reaches zero has to be
      // re-created on the way back, and the floor keeps it one continuous
      // object the whole way down.
      scale:
        mix(last.scale, (targetRect.width * dockFill) / subjectBasePx, converge) *
        (0.22 + 0.78 * presence),
      fade: (0.08 + 0.92 * presence) * (handoffOnDock ? 1 - handoff : 1),
      docked: arrived,
    };
    transitRef.current = next;
    setInTransit(true);
    writeSubject(next, next.fade);

    if (arrived !== docked.current) {
      docked.current = arrived;
      onDock?.(arrived);
    }
  }, [dockTo, dockFill, onDock, handoffOnDock, positionFor, subjectBasePx, writeSubject]);

  React.useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      frame.current = requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [update]);

  const current = positionFor(activeSection);
  /* The FIRST PAINT only. Every frame after this is written straight to the
     node by writeSubject, so this exists for the prerendered document and for
     the moment before the first scroll tick -- section zero's own anchor,
     which is where the subject belongs before anyone has scrolled. */
  const initialTransform =
    `translate3d(${current.left}vw, ${current.top}vh, 0) translate3d(-50%, -50%, 0) ` +
    `scale3d(${current.scale}, ${current.scale}, 1)`;
  // The fixed layer must survive past the stage, or the subject would unmount
  // the instant it set off on the longest part of its journey.
  const subjectMounted = inView || inTransit;

  return (
    <div ref={containerRef} className={cn("scrollstage", className)} {...props}>
      {/* One gate for all three fixed layers. The dot nav is in here with the
          rest for a reason: absolutely positioned in a three-section column it
          would centre itself in the middle section, so it would only appear
          during the third of the scroll it is least useful in. */}
      {inView && (
        <>
          <div className="scrollstage-progress" aria-hidden="true">
            <div
              ref={progressRef}
              className="scrollstage-progress-bar"
              style={{ transform: "scaleX(0)" }}
            />
          </div>

          <nav className="scrollstage-nav" aria-label="Hero sections">
            {sections.map((section, index) => (
              <div key={section.id} className="scrollstage-nav-item">
                <span
                  className={cn("scrollstage-nav-label", activeSection === index && "is-active")}
                  aria-hidden="true"
                >
                  <span className="scrollstage-nav-pip" />
                  {section.badge ?? section.title}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" })
                  }
                  className={cn("scrollstage-nav-dot", activeSection === index && "is-active")}
                  aria-current={activeSection === index ? "true" : undefined}
                  aria-label={`Go to ${section.badge ?? section.title}`}
                />
              </div>
            ))}
          </nav>

          {/* The transform is inline because it is data -- a position the
              caller supplied. How visible the globe is at that position is a
              design decision, so it travels as a role the stylesheet reads:
              an inline opacity here would outrank every media query, and a
              phone needs the globe fainter than a desktop does at the same
              scale. */}
        </>
      )}

      {subjectMounted && (
        <div
          className="scrollstage-subject"
          ref={subjectRef}
          data-role={inTransit ? "transit" : current.role}
          style={{
            /* First paint only -- writeSubject owns this node from the first
               scroll tick, including the opacity and the transition, which is
               why neither is set here any more. */
            transform: initialTransform,
          }}
        >
          {subject}
        </div>
      )}


      {sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          ref={(node) => {
            sectionRefs.current[index] = node;
          }}
          className={cn(
            "scrollstage-section",
            section.align === "center" && "is-center",
            section.align === "right" && "is-right",
          )}
        >
          <div className="scrollstage-copy">
            <p className="site-eyebrow mb-4">{section.badge}</p>

            <h1 className={cn("site-h2", index === 0 ? "scrollstage-title" : "scrollstage-title-sm")}>
              {section.title}
              {section.subtitle ? <span className="scrollstage-subtitle">{section.subtitle}</span> : null}
            </h1>

            <p className="scrollstage-lede">{section.description}</p>

            {section.body}

            {section.features && (
              <div className="scrollstage-features">
                {section.features.map((feature) => (
                  <div key={feature.title} className="scrollstage-feature">
                    <span className="scrollstage-feature-pip" />
                    <div>
                      <h3 className="scrollstage-feature-title">{feature.title}</h3>
                      <p className="scrollstage-feature-body">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.actions && (
              <div className="scrollstage-actions">
                {section.actions.map((action) =>
                  action.variant === "primary" ? (
                    <a
                      key={action.label}
                      href={action.href}
                      {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="btn-hero-pill"
                    >
                      <span className="spark" />
                      <span>{action.label}</span>
                    </a>
                  ) : (
                    <a
                      key={action.label}
                      href={action.href}
                      {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="btn-ghost-link"
                    >
                      {action.label} <span className="arrow">&rarr;</span>
                    </a>
                  ),
                )}
              </div>
            )}

          </div>
        </section>
      ))}
    </div>
  );
}

export default ScrollStage;
