import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type CSSProperties } from "react";

import { Nav } from "@/components/site/Nav";
import { useReveal } from "@/hooks/use-reveal";
import { Footer } from "@/components/site/Footer";
import { Newsletter } from "@/components/site/Newsletter";
import { COLLECTIONS, collectionDestinations } from "@/data/collections";
import { PHOTO_SLUGS } from "@/data/destinations";

/** Written out, as the headline always was. */
function numberWords(n: number): string {
  const ones = [
    "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
  ];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? `-${ones[n % 10]}` : "");
  return String(n);
}
const capitalise = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** Counted, never typed. The headline read "Ten ways into thirty-six
 *  countries" long after both numbers had stopped being true -- every one of
 *  the 42 destinations sits in a collection -- and "destinations", because
 *  Martinique, Guadeloupe and the Pacific territories are not countries. */
const DESTINATION_COUNT = new Set(COLLECTIONS.flatMap((c) => c.destinationSlugs)).size;
const HEADLINE = `${capitalise(numberWords(COLLECTIONS.length))} ways into ${numberWords(DESTINATION_COUNT)} destinations.`;
const COLLECTIONS_DESCRIPTION = `${capitalise(numberWords(COLLECTIONS.length))} themed ways into our ${DESTINATION_COUNT} destinations -- from ${COLLECTIONS[0].name.toLowerCase()} and ${COLLECTIONS[1].name.toLowerCase()} to ${COLLECTIONS[COLLECTIONS.length - 1].name.toLowerCase()}, each with seasons and booking links.`;

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Travel collections | Skynova Agency" },
      {
        name: "description",
        content:
          COLLECTIONS_DESCRIPTION,
      },
    ],
  }),
  component: CollectionsIndex,
});

/** Collections carry no image of their own -- only an emoji. Each one's lead
 *  photograph is the first of its destinations that actually has one, which
 *  gives each collection a distinct image with nothing to maintain by hand. */
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
              {HEADLINE}
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
