import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type CSSProperties } from "react";

import { Nav } from "@/components/site/Nav";
import { useReveal } from "@/hooks/use-reveal";
import { Footer } from "@/components/site/Footer";
import { Newsletter } from "@/components/site/Newsletter";
import { COLLECTIONS, collectionDestinations } from "@/data/collections";
import { PHOTO_SLUGS } from "@/data/destinations";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Travel collections | Skynova Agency" },
      {
        name: "description",
        content:
          "Ten themed ways into our destination catalogue -- city breaks, beaches, luxury, family, honeymoon, food, history, nature, nightlife and best value.",
      },
    ],
  }),
  component: CollectionsIndex,
});

/** Collections carry no image of their own -- only an emoji. Each one's lead
 *  photograph is the first of its destinations that actually has one, which
 *  gives all ten a distinct image (Portugal, Fiji, Qatar, Australia, French
 *  Polynesia, Italy, Egypt, New Zealand, Spain, Vietnam) with nothing to
 *  maintain by hand. */
function leadPhoto(slug: string): string | null {
  const first = collectionDestinations(COLLECTIONS.find((c) => c.slug === slug)!).find((d) =>
    PHOTO_SLUGS.has(d.slug),
  );
  return first ? `/assets/destinations/${first.slug}.webp` : null;
}

function CollectionsIndex() {
  const gridRef = useReveal<HTMLDivElement>();
  // Coverflow position. Every card stays in the DOM at every position -- the
  // ones off to the sides are transformed away, not unmounted, so all ten
  // links remain in the HTML for crawlers.
  const [active, setActive] = useState(0);
  const last = COLLECTIONS.length - 1;
  return (
    <>
      <Nav />
      <main>
        <section className="site-section">
          <div className="site-container">
            <p className="site-eyebrow mb-3">Collections</p>
            <h1 className="site-h2 max-w-2xl text-4xl md:text-5xl">
              Ten ways into thirty-six countries.
            </h1>
            <p className="site-ink-muted mt-4 max-w-xl text-base leading-relaxed">
              Most people do not start with a country -- they start with a kind of trip. These are
              the themes our destinations group into, and every one of them links straight through
              to booking.
            </p>

            <div ref={gridRef} className="cover-flow mt-10">
              <div className="cover-flow-stage">
                {COLLECTIONS.map((c, i) => {
                  const dests = collectionDestinations(c);
                  const photo = leadPhoto(c.slug);
                  // Shortest signed distance around the ring, not i - active.
                  // Linear offsets fan every card to one side when the front
                  // card is first or last; wrapping keeps cards on both sides
                  // at every position, which is what the reference shows.
                  const n = COLLECTIONS.length;
                  let offset = i - active;
                  if (offset > n / 2) offset -= n;
                  if (offset < -n / 2) offset += n;
                  const dist = Math.abs(offset);
                  const shown = dist <= 2;
                  return (
                    <div
                      key={c.slug}
                      className={`cover-card${offset === 0 ? " is-active" : ""}`}
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
                        to="/collections/$slug"
                        params={{ slug: c.slug }}
                        className="cover-card-link"
                        tabIndex={shown ? undefined : -1}
                        onClick={(e) => {
                          // A side card recentres instead of navigating; only
                          // the front card is a live link, which is how the
                          // reference behaves and stops mis-taps.
                          if (offset !== 0) {
                            e.preventDefault();
                            setActive(i);
                          }
                        }}
                      >
                        {photo ? (
                          <img src={photo} alt="" loading="lazy" decoding="async" />
                        ) : (
                          <span className="cover-card-fallback" aria-hidden="true">
                            {c.icon}
                          </span>
                        )}
                        <span className="cover-card-scrim" aria-hidden="true" />
                        <span className="cover-card-copy">
                          <span className="cover-card-icon" aria-hidden="true">
                            {c.icon}
                          </span>
                          <span className="cover-card-title">{c.name}</span>
                          <span className="cover-card-tagline">{c.tagline}</span>
                          <span className="cover-card-meta">{dests.length} destinations &rarr;</span>
                        </span>
                      </Link>
                    </div>
                  );
                })}
              </div>
              <div className="cover-flow-controls">
                <button
                  type="button"
                  className="cover-flow-btn"
                  aria-label="Previous collection"
                  onClick={() => setActive((n) => (n === 0 ? last : n - 1))}
                >
                  &larr;
                </button>
                <span className="cover-flow-count" aria-live="polite">
                  {active + 1} / {COLLECTIONS.length}
                </span>
                <button
                  type="button"
                  className="cover-flow-btn"
                  aria-label="Next collection"
                  onClick={() => setActive((n) => (n === last ? 0 : n + 1))}
                >
                  &rarr;
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Newsletter />
      <Footer />
    </>
  );
}
