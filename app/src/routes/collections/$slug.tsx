import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Newsletter } from "@/components/site/Newsletter";
import { CardActions } from "@/components/site/CardActions";
import { PHOTO_SLUGS } from "@/data/destinations";
import { COLLECTIONS, getCollectionBySlug, collectionDestinations } from "@/data/collections";
import { hotelsLink, flightsLink } from "@/lib/affiliate";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }) => {
    const collection = getCollectionBySlug(params.slug);
    if (!collection) throw notFound();
    return { collection, destinations: collectionDestinations(collection) };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.collection.name} | Skynova Agency` },
            // The first intro paragraph is written to work as the meta
            // description as well -- one voice, and no duplicate summary to
            // keep in sync.
            { name: "description", content: loaderData.collection.intro[0].slice(0, 180) },
            { property: "og:title", content: loaderData.collection.name },
            { property: "og:description", content: loaderData.collection.intro[0].slice(0, 180) },
          ],
        }
      : {},
  component: CollectionPage,
});

function CollectionPage() {
  const { collection, destinations } = Route.useLoaderData();
  const others = COLLECTIONS.filter((c) => c.slug !== collection.slug);

  return (
    <>
      <Nav />
      <main>
        <section className="site-section pb-0">
          <div className="site-container">
            <Link to="/collections" className="btn-underline mb-6 inline-flex">
              <span className="arrow">&larr;</span> All collections
            </Link>
            <p className="site-eyebrow mb-3">
              <span aria-hidden="true">{collection.icon}</span> {collection.tagline}
            </p>
            <h1 className="site-h2 max-w-2xl text-4xl md:text-5xl">{collection.name}</h1>

            <div className="collection-intro">
              {collection.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <ul className="collection-highlights">
              {collection.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="site-section">
          <div className="site-container">
            <p className="site-eyebrow mb-5">
              {destinations.length} destinations in this collection
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {destinations.map((d) => (
                <div key={d.slug} className="relative">
                  <Link to="/destinations/$slug" params={{ slug: d.slug }} className="collection-dest-card">
                    {PHOTO_SLUGS.has(d.slug) ? (
                      <img
                        src={`/assets/destinations/${d.slug}.webp`}
                        alt={d.name}
                        loading="lazy"
                        className="collection-dest-media"
                      />
                    ) : (
                      <span className="collection-dest-flag" aria-hidden="true">
                        {d.flag}
                      </span>
                    )}
                    <span className="collection-dest-body">
                      <span className="collection-dest-name">
                        {PHOTO_SLUGS.has(d.slug) ? `${d.flag} ` : ""}
                        {d.name}
                      </span>
                      <span className="collection-dest-hook">{d.hook}</span>
                    </span>
                  </Link>
                  <CardActions slug={d.slug} name={d.name} />
                </div>
              ))}
            </div>

            <div className="collection-cta">
              <div>
                <p className="collection-cta-title">Ready to price it up?</p>
                <p className="collection-cta-note">
                  Compare fares and stays across our booking partners -- you check out on their
                  site, at their price.
                </p>
              </div>
              <div className="collection-cta-actions">
                <a
                  href={hotelsLink()}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="btn-hero-pill"
                >
                  <span className="spark" />
                  <span>Best hotels</span>
                </a>
                <a
                  href={flightsLink()}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="btn-framed"
                >
                  Search flights
                </a>
              </div>
            </div>

            <p className="collection-disclosure">
              Skynova Agency runs on the Travelpayouts affiliate network -- booking links may earn a
              commission at no extra cost to you.
            </p>
          </div>
        </section>

        <section className="site-section pt-0">
          <div className="site-container">
            <p className="site-eyebrow mb-5">Other collections</p>
            <div className="collection-more">
              {others.map((c) => (
                <Link
                  key={c.slug}
                  to="/collections/$slug"
                  params={{ slug: c.slug }}
                  className="collection-chip"
                >
                  <span aria-hidden="true">{c.icon}</span> {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Newsletter />
      <Footer />
    </>
  );
}
