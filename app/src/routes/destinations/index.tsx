import { useEffect, useState } from "react";
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

const TRENDING_SLUGS = ["portugal", "italy", "vietnam", "new-zealand"];
const FEATURED_SLUGS = ["switzerland", "peru", "kenya", "namibia", "jordan", "fiji"];

function findAll(slugs: string[]) {
  return slugs
    .map((slug) => DESTINATIONS.find((d) => d.slug === slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));
}

function DestinationsIndex() {
  const { region } = Route.useSearch();
  const trending = findAll(TRENDING_SLUGS);
  const featured = findAll(FEATURED_SLUGS);
  const trendingRef = useReveal<HTMLDivElement>();
  const featuredRef = useReveal<HTMLDivElement>();
  const [activeRegion, setActiveRegion] = useState<Region | "all">(region ?? "all");
  // With 42 destinations the grouped view is good for browsing and poor for
  // finding a specific country, so the directory offers both.
  const [view, setView] = useState<"region" | "az">("region");
  const alphabetical = [...DESTINATIONS].sort((a, b) => a.name.localeCompare(b.name));
  // Re-sync if the region search param changes on an already-mounted page
  // (e.g. clicking a different homepage region tab without a full reload).
  useEffect(() => {
    setActiveRegion(region ?? "all");
  }, [region]);
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
            <p className="site-eyebrow mb-5">Trending now</p>
            <div ref={trendingRef} className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {trending.map((d) => (
                <div key={d.slug} className="relative h-full">
                  <Link to="/destinations/$slug" params={{ slug: d.slug }} className="block h-full">
                    <TiltCard className="dest-card glass-bezel">
                      <span className="dest-pill-trending">Trending</span>
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

        <section className="site-section pt-0">
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
                onClick={() => setActiveRegion("all")}
              >
                All
              </button>
              {REGION_ORDER.map(({ region }) => (
                <button
                  key={region}
                  type="button"
                  className={`region-filter-btn${activeRegion === region ? " is-active" : ""}`}
                  onClick={() => setActiveRegion(region)}
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
