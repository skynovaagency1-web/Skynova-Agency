import * as React from "react";

import { Globe } from "@/components/ui/globe";
import { cn } from "@/lib/utils";

/**
 * Scroll-driven globe, after the 21st.dev "landing-page" reference: a set of
 * full-height sections with one globe floating between them, moving and
 * rescaling as each section takes the viewport.
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
export interface ScrollGlobeSection {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  description: string;
  align?: "left" | "center" | "right";
  features?: { title: string; description: string }[];
  actions?: { label: string; href?: string; external?: boolean; variant: "primary" | "secondary" }[];
}

export interface ScrollGlobeProps extends React.HTMLAttributes<HTMLDivElement> {
  sections: ScrollGlobeSection[];
  globeConfig?: { positions: { top: string; left: string; scale: number }[] };
  /** Passed through to the globe -- the homepage swaps it at night. */
  globeTextureUrl?: string;
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

export function ScrollGlobe({
  sections,
  globeConfig = defaultGlobeConfig,
  globeTextureUrl,
  className,
  ...props
}: ScrollGlobeProps) {
  const [activeSection, setActiveSection] = React.useState(0);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  // Starts true: this renders at the top of the page, so the honest first
  // paint has the globe in it -- and SSR has no viewport to measure against.
  const [inView, setInView] = React.useState(true);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const sectionRefs = React.useRef<(HTMLElement | null)[]>([]);
  const frame = React.useRef<number | null>(null);

  const positions = React.useMemo(
    () =>
      globeConfig.positions.map((p) => ({
        top: parsePercent(p.top),
        left: parsePercent(p.left),
        scale: p.scale,
      })),
    [globeConfig.positions],
  );

  // Guards a caller who hands over more sections than globe positions: the
  // reference indexes straight into the array and reads `undefined.left`.
  const positionFor = React.useCallback(
    (index: number) => positions[Math.min(index, positions.length - 1)] ?? positions[0],
    [positions],
  );

  const update = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Progress across this element's own travel, not the document's.
    const rect = container.getBoundingClientRect();
    const travel = rect.height - window.innerHeight;
    const progress = travel > 0 ? Math.min(Math.max(-rect.top / travel, 0), 1) : 0;
    setScrollProgress(progress);
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
  }, []);

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
  const globeTransform =
    `translate3d(${current.left}vw, ${current.top}vh, 0) translate3d(-50%, -50%, 0) ` +
    `scale3d(${current.scale}, ${current.scale}, 1)`;

  return (
    <div ref={containerRef} className={cn("scrollglobe", className)} {...props}>
      {/* One gate for all three fixed layers. The dot nav is in here with the
          rest for a reason: absolutely positioned in a three-section column it
          would centre itself in the middle section, so it would only appear
          during the third of the scroll it is least useful in. */}
      {inView && (
        <>
          <div className="scrollglobe-progress" aria-hidden="true">
            <div className="scrollglobe-progress-bar" style={{ transform: `scaleX(${scrollProgress})` }} />
          </div>

          <nav className="scrollglobe-nav" aria-label="Hero sections">
            {sections.map((section, index) => (
              <div key={section.id} className="scrollglobe-nav-item">
                <span
                  className={cn("scrollglobe-nav-label", activeSection === index && "is-active")}
                  aria-hidden="true"
                >
                  <span className="scrollglobe-nav-pip" />
                  {section.badge ?? section.title}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" })
                  }
                  className={cn("scrollglobe-nav-dot", activeSection === index && "is-active")}
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
          <div
            className="scrollglobe-globe"
            data-role={current.scale >= 1.8 ? "backdrop" : "companion"}
            style={{ transform: globeTransform }}
          >
            <Globe textureUrl={globeTextureUrl} />
          </div>
        </>
      )}


      {sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          ref={(node) => {
            sectionRefs.current[index] = node;
          }}
          className={cn(
            "scrollglobe-section",
            section.align === "center" && "is-center",
            section.align === "right" && "is-right",
          )}
        >
          <div className="scrollglobe-copy">
            <p className="site-eyebrow mb-4">{section.badge}</p>

            <h1 className={cn("site-h2", index === 0 ? "scrollglobe-title" : "scrollglobe-title-sm")}>
              {section.title}
              {section.subtitle ? <span className="scrollglobe-subtitle">{section.subtitle}</span> : null}
            </h1>

            <p className="scrollglobe-lede">{section.description}</p>

            {section.features && (
              <div className="scrollglobe-features">
                {section.features.map((feature) => (
                  <div key={feature.title} className="scrollglobe-feature">
                    <span className="scrollglobe-feature-pip" />
                    <div>
                      <h3 className="scrollglobe-feature-title">{feature.title}</h3>
                      <p className="scrollglobe-feature-body">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.actions && (
              <div className="scrollglobe-actions">
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

export default ScrollGlobe;
