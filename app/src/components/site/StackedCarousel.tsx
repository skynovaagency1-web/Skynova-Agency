import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";

import { CardActions } from "@/components/site/CardActions";
import { useReveal } from "@/hooks/use-reveal";
import { DESTINATIONS, PHOTO_SLUGS } from "@/data/destinations";

type Dest = (typeof DESTINATIONS)[number];

/**
 * A stacked carousel of destinations, after the "3d photo" reference: a row
 * of pills that jump to a card, a stack of five cards facing forward, and
 * round prev/next buttons underneath.
 *
 * Read closely, the reference cards all face forward -- depth comes from
 * scale, overlap and stacking order alone, with no Y rotation. That is the
 * difference from the collections coverflow, which turns its side cards.
 * The pill row carries the labels, so the cards stay pure photograph; only
 * the front card gets a small name chip, because it is a link and a link has
 * to say where it goes.
 *
 * Shared by "Trending now" on /destinations and every collection page, where
 * it replaced a card grid. A grid showed each destination's one-line hook;
 * `showHook` keeps that, as a caption for whichever card is in front.
 * Destinations without a photograph (Martinique, today) get their flag on a
 * gradient in their own accent colour rather than a broken image.
 *
 * Every card stays in the DOM at every position -- off-stage ones are faded,
 * not unmounted -- so every destination link remains crawlable.
 */
export function StackedCarousel({
  items,
  eyebrow,
  heading,
  intro,
  label,
  moreHref,
  moreLabel = "View all",
  showHook = false,
}: {
  items: Dest[];
  eyebrow: ReactNode;
  heading?: string;
  intro?: ReactNode;
  /** Names the carousel for assistive tech, e.g. "Trending destinations". */
  label: string;
  /** Target of the last, bolder pill -- the full list this is a taste of. */
  moreHref?: string;
  moreLabel?: string;
  showHook?: boolean;
}) {
  const flowRef = useReveal<HTMLDivElement>();
  const rowRef = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<number | null>(null);
  // Set when a pointer gesture was a swipe, so the click the browser fires
  // straight after it cannot also navigate or recentre.
  const swiped = useRef(false);
  const [active, setActive] = useState(0);
  const n = items.length;
  const go = (i: number) => setActive(((i % n) + n) % n);
  const current = items[active];

  // On narrow screens the pill row scrolls sideways; keep the active pill in
  // view as the carousel moves. Scrolls the row itself, never the window, so
  // it cannot yank the page. A no-op whenever the row fits.
  useEffect(() => {
    const row = rowRef.current;
    if (!row || row.scrollWidth <= row.clientWidth) return;
    const pill = row.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!pill) return;
    row.scrollTo({ left: pill.offsetLeft - (row.clientWidth - pill.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  return (
    <>
      <div className="trend-head">
        <p className="site-eyebrow mb-3">{eyebrow}</p>
        {heading ? <h2 className="site-h2 text-3xl md:text-4xl">{heading}</h2> : null}
        {intro ? (
          <p className="site-ink-muted mx-auto mt-3 max-w-md text-base leading-relaxed">{intro}</p>
        ) : null}
      </div>

      <div ref={rowRef} className="trend-pills" role="group" aria-label={`Choose from ${label.toLowerCase()}`}>
        {items.map((d, i) => (
          <button
            key={d.slug}
            type="button"
            className={`trend-pill${i === active ? " is-active" : ""}`}
            aria-pressed={i === active}
            onClick={() => go(i)}
          >
            {d.name}
          </button>
        ))}
        {moreHref ? (
          <a href={moreHref} className="trend-pill trend-pill-more">
            {moreLabel} <span aria-hidden="true">&rarr;</span>
          </a>
        ) : null}
      </div>

      <div ref={flowRef} className="trend-flow">
        <div
          className="trend-stage"
          role="region"
          aria-roledescription="carousel"
          aria-label={label}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              go(active - 1);
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              go(active + 1);
            }
          }}
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            swipeStart.current = e.clientX;
            swiped.current = false;
          }}
          onPointerUp={(e) => {
            const start = swipeStart.current;
            swipeStart.current = null;
            if (start === null) return;
            const dx = e.clientX - start;
            if (Math.abs(dx) < 40) return;
            swiped.current = true;
            go(active + (dx < 0 ? 1 : -1));
          }}
          onPointerCancel={() => {
            swipeStart.current = null;
          }}
        >
          {items.map((d, i) => {
            // Shortest signed distance around the ring, so there are cards on
            // both sides of the front one at every position.
            let offset = i - active;
            if (offset > n / 2) offset -= n;
            if (offset < -n / 2) offset += n;
            const dist = Math.abs(offset);
            const shown = dist <= 2;
            const front = offset === 0;
            return (
              <div
                key={d.slug}
                className={`trend-card${front ? " is-active" : ""}`}
                style={
                  {
                    "--o": String(offset),
                    "--d": String(Math.min(dist, 3)),
                    zIndex: String(20 - dist),
                    opacity: shown ? 1 : 0,
                  } as CSSProperties
                }
                aria-hidden={shown ? undefined : true}
              >
                <Link
                  to="/destinations/$slug"
                  params={{ slug: d.slug }}
                  className="trend-card-link"
                  tabIndex={front ? undefined : -1}
                  aria-label={front ? `Explore ${d.name}` : `Bring ${d.name} forward`}
                  draggable={false}
                  onClick={(e) => {
                    if (swiped.current) {
                      e.preventDefault();
                      swiped.current = false;
                      return;
                    }
                    // A side card recentres instead of navigating, as in the
                    // reference -- and it stops mis-taps on a moving stack.
                    if (!front) {
                      e.preventDefault();
                      go(i);
                    }
                  }}
                >
                  {PHOTO_SLUGS.has(d.slug) ? (
                    <img
                      src={`/assets/destinations/${d.slug}.webp`}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  ) : (
                    <span className="trend-card-fallback" style={{ "--card-accent": d.accent } as CSSProperties}>
                      <span className="trend-card-fallback-flag" aria-hidden="true">
                        {d.flag}
                      </span>
                    </span>
                  )}
                  {front ? (
                    <span className="trend-card-caption">
                      <span aria-hidden="true">{d.flag}</span> {d.name}
                    </span>
                  ) : null}
                </Link>
                {front ? <CardActions slug={d.slug} name={d.name} /> : null}
              </div>
            );
          })}
        </div>

        {showHook && current ? (
          <p className="trend-detail">
            <strong>
              {current.flag} {current.name}
            </strong>{" "}
            &mdash; {current.hook}
          </p>
        ) : null}

        <div className="trend-controls">
          <button type="button" className="trend-arrow" aria-label="Previous destination" onClick={() => go(active - 1)}>
            &larr;
          </button>
          <button type="button" className="trend-arrow" aria-label="Next destination" onClick={() => go(active + 1)}>
            &rarr;
          </button>
          <span className="sr-only" aria-live="polite">
            {current?.name}, {active + 1} of {n}
          </span>
        </div>
      </div>
    </>
  );
}
