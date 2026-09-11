import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Nav } from "@/components/site/Nav";
import { useReveal } from "@/hooks/use-reveal";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Footer } from "@/components/site/Footer";
import { Newsletter } from "@/components/site/Newsletter";
import { TiltCard } from "@/components/site/TiltCard";
import { CardActions } from "@/components/site/CardActions";
import { GlassToggle } from "@/components/site/GlassToggle";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { absUrl, jsonLd } from "@/lib/seo";
import { REGION_ORDER, getDestinationsByRegion, DESTINATIONS, type Region } from "@/data/destinations";

// An ItemList of every destination, so the index is understood as a
// collection page rather than 25 unrelated links. Built once at module
// scope -- the list is static, so rebuilding it per render is waste.
const INDEX_JSON_LD = jsonLd({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Skynova destinations",
  numberOfItems: DESTINATIONS.length,
  itemListElement: DESTINATIONS.map((d, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: d.name,
    url: absUrl(`/destinations/${d.slug}`),
  })),
});

interface DestinationsSearch {
  region?: Region;
}

// Lets other pages (the homepage's region tabs) deep-link straight into a
// pre-filtered region, e.g. /destinations?region=Asia -- an unknown or
// missing value just falls through to the unfiltered "All" view.
export const Route = createFileRoute("/destinations/")({
  validateSearch: (search: Record<string, unknown>): DestinationsSearch => ({
    region: REGION_ORDER.some((r) => r.region === search.region) ? (search.region as Region) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Destinations | Skynova Agency" },
      {
        name: "description",
        content:
          `${DESTINATIONS.length} destinations across ${REGION_ORDER.length} regions, each routing straight into flights, stays, cars and tours.`,
      },
    ],
  }),
  component: DestinationsIndex,
});

// Eight, not four: the stacked carousel shows five cards at once, and a ring
// needs more cards than it shows or the same one appears on both sides. The
// original four stay first. Every slug here must be in PHOTO_SLUGS -- the
// cards are pure photograph, so a missing image would be a blank tile.
const TRENDING_SLUGS = ["portugal", "italy", "japan", "vietnam", "new-zealand", "thailand", "croatia", "morocco"];
const FEATURED_SLUGS = ["switzerland", "peru", "kenya", "namibia", "jordan", "fiji"];

function findAll(slugs: string[]) {
  return slugs
    .map((slug) => DESTINATIONS.find((d) => d.slug === slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));
}

type Dest = (typeof DESTINATIONS)[number];

/**
 * Trending now, as a stacked carousel after the "3d photo" reference.
 *
 * Read closely, the reference cards all face forward -- depth comes from
 * scale, overlap and stacking order alone, with no Y rotation. That is the
 * difference from the collections coverflow, which turns its side cards.
 * The pill row carries the labels, so the cards stay pure photograph; only
 * the front card gets a small name chip, because it is a link and a link has
 * to say where it goes.
 *
 * Every card stays in the DOM at every position -- off-stage ones are faded,
 * not unmounted -- so all eight destination links remain crawlable.
 */
function TrendingCarousel({ items }: { items: Dest[] }) {
  const flowRef = useReveal<HTMLDivElement>();
  const rowRef = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<number | null>(null);
  // Set when a pointer gesture was a swipe, so the click the browser fires
  // straight after it cannot also navigate or recentre.
  const swiped = useRef(false);
  const [active, setActive] = useState(0);
  const n = items.length;
  const go = (i: number) => setActive(((i % n) + n) % n);

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
        <p className="site-eyebrow mb-3">Trending now</p>
        <h2 className="site-h2 text-3xl md:text-4xl">Where to go next</h2>
        <p className="site-ink-muted mx-auto mt-3 max-w-md text-base leading-relaxed">
          Our pick of {n} places worth a look this season &mdash; choose one to bring it forward, or
          open the full directory.
        </p>
      </div>

      <div ref={rowRef} className="trend-pills" role="group" aria-label="Choose a trending destination">
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
        <a href="#directory" className="trend-pill trend-pill-more">
          View all <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div ref={flowRef} className="trend-flow">
        <div
          className="trend-stage"
          role="region"
          aria-roledescription="carousel"
          aria-label="Trending destinations"
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
                  <img
                    src={`/assets/destinations/${d.slug}.webp`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
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

        <div className="trend-controls">
          <button type="button" className="trend-arrow" aria-label="Previous destination" onClick={() => go(active - 1)}>
            &larr;
          </button>
          <button type="button" className="trend-arrow" aria-label="Next destination" onClick={() => go(active + 1)}>
            &rarr;
          </button>
          <span className="sr-only" aria-live="polite">
            {items[active]?.name}, {active + 1} of {n}
          </span>
        </div>
      </div>
    </>
  );
}

function DestinationsIndex() {
  const { region } = Route.useSearch();
  const trending = findAll(TRENDING_SLUGS);
  const featured = findAll(FEATURED_SLUGS);
  const featuredRef = useReveal<HTMLDivElement>();
  const navigate = Route.useNavigate();
  // The URL is the single source of truth for this filter. Clicking a tab
  // writes ?region=, so every region view is its own shareable, bookmarkable
  // link, and one arriving from the footer or the homepage lands already
  // filtered. That also retires the useState/useEffect pair this replaced,
  // whose whole job was keeping a local copy in step with the search param.
  const activeRegion: Region | "all" = region ?? "all";
  function selectRegion(next: Region | "all") {
    // replace, not push: clicking through six region tabs shouldn't cost six
    // presses of Back to get off the page. The address bar still updates,
    // which is the part that makes the view shareable.
    void navigate({ search: next === "all" ? {} : { region: next }, replace: true });
  }
  // With 42 destinations the grouped view is good for browsing and poor for
  // finding a specific country, so the directory offers both.
  const [view, setView] = useState<"region" | "az">("region");
  const alphabetical = [...DESTINATIONS].sort((a, b) => a.name.localeCompare(b.name));
  const visibleRegions = activeRegion === "all" ? REGION_ORDER : REGION_ORDER.filter((r) => r.region === activeRegion);

  return (
    <>
      <SmoothScroll />
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: INDEX_JSON_LD }} />
      <main>
        <section className="site-section">
          <div className="site-container">
            <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Destinations" }]} />
            <p className="site-eyebrow mb-3 mt-3">Destinations</p>
            <h1 className="site-h2 max-w-2xl text-3xl md:text-5xl">
              {DESTINATIONS.length} places, {REGION_ORDER.length} regions, one booking flow.
            </h1>
            <p className="site-ink-muted mt-4 max-w-xl text-base leading-relaxed">
              Every destination below routes straight into flights, stays, cars and tours for
              that country -- no separate search each time.
            </p>
          </div>
        </section>

        <section className="site-section pt-0">
          <div className="site-container">
            <TrendingCarousel items={trending} />
          </div>
        </section>

        <section className="site-section pt-0">
          <div className="site-container">
            <p className="site-eyebrow mb-5">Featured destinations</p>
            <div ref={featuredRef} className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {featured.map((d) => (
                <div key={d.slug} className="relative h-full">
                  <Link to="/destinations/$slug" params={{ slug: d.slug }} className="block h-full">
                    <TiltCard className="dest-card glass-bezel">
                      <span className="dest-pill-featured">Featured</span>
                      <div className="dest-card-media">
                        <img
                          src={`/assets/destinations/${d.slug}.webp`}
                          alt={`${d.name} travel scene`}
                          loading="lazy"
                        />
                      </div>
                      <div className="dest-card-copy">
                        <p className="dest-card-flag">{d.flag}</p>
                        <p className="font-semibold">{d.name}</p>
                      </div>
                    </TiltCard>
                  </Link>
                  <CardActions slug={d.slug} name={d.name} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="directory" className="site-section pt-0 scroll-mt-24">
          <div className="site-container">
            <div className="directory-head">
              <p className="site-eyebrow">Full directory</p>
              <GlassToggle
                ariaLabel="Directory view"
                value={view}
                onChange={setView}
                options={[
                  { value: "region", label: "By region" },
                  { value: "az", label: "A–Z" },
                ]}
              />
            </div>
            {view === "region" ? (
            <div className="region-filter-bar" role="group" aria-label="Filter destinations by region">
              <button
                type="button"
                className={`region-filter-btn${activeRegion === "all" ? " is-active" : ""}`}
                onClick={() => selectRegion("all")}
              >
                All
              </button>
              {REGION_ORDER.map(({ region }) => (
                <button
                  key={region}
                  type="button"
                  className={`region-filter-btn${activeRegion === region ? " is-active" : ""}`}
                  onClick={() => selectRegion(region)}
                >
                  {region}
                </button>
              ))}
            </div>
            ) : null}
            {view === "az" ? (
              <div className="dest-directory-grid mt-8">
                {alphabetical.map((d) => (
                  <div key={d.slug} className="relative">
                    <Link to="/destinations/$slug" params={{ slug: d.slug }} className="dest-mini-card">
                      <p className="dest-card-flag">{d.flag}</p>
                      <p className="mt-2 font-semibold">{d.name}</p>
                      <p className="site-ink-muted mt-1 text-xs leading-relaxed">{d.hook}</p>
                    </Link>
                    <CardActions slug={d.slug} name={d.name} />
                  </div>
                ))}
              </div>
            ) : (
            <div className="mt-8 flex flex-col gap-10">
              {visibleRegions.map(({ region, icon }) => (
                <div key={region}>
                  <p className="dest-region-heading site-h2 mb-4 text-xl">
                    <span aria-hidden="true">{icon}</span> {region}
                  </p>
                  <div className="dest-directory-grid">
                    {getDestinationsByRegion(region).map((d) => (
                      <div key={d.slug} className="relative">
                        <Link to="/destinations/$slug" params={{ slug: d.slug }} className="dest-mini-card">
                          <p className="dest-card-flag">{d.flag}</p>
                          <p className="mt-2 font-semibold">{d.name}</p>
                          <p className="site-ink-muted mt-1 text-xs leading-relaxed">{d.hook}</p>
                        </Link>
                        <CardActions slug={d.slug} name={d.name} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </section>
      </main>
      <Newsletter />
      <Footer />
    </>
  );
}
