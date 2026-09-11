import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Nav } from "@/components/site/Nav";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Footer } from "@/components/site/Footer";
import { Newsletter } from "@/components/site/Newsletter";
import { StructuredData } from "@/components/StructuredData";
import { itemListJsonLd, jsonLd } from "@/lib/seo";
import { StackedCarousel } from "@/components/site/StackedCarousel";
import { COLLECTIONS, getCollectionBySlug, collectionDestinations } from "@/data/collections";
import { DESTINATION_DETAILS } from "@/data/destination-details";
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
  // Breadcrumbs already emit their own BreadcrumbList; this adds what the
  // page is a list OF -- the same destinations the carousel shows.
  const listLd = jsonLd(
    itemListJsonLd(
      `${collection.name} destinations`,
      destinations.map((d) => ({ name: d.name, path: `/destinations/${d.slug}` })),
    ),
  );

  return (
    <>
      <StructuredData json={listLd} />
      <Nav />
      <main>
        <section className="site-section pb-0">
          <div className="site-container">
            <Breadcrumbs
              trail={[
                { name: "Home", path: "/" },
                { name: "Collections", path: "/collections" },
                { name: collection.name },
              ]}
            />
            <Link to="/collections" className="btn-underline mb-6 mt-4 inline-flex">
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
            {/* The destinations, as a stacked carousel after the "3d photo"
                reference -- it replaced a card grid. Each card's one-line hook
                survives as the caption under the front card. */}
            <StackedCarousel
              items={destinations}
              eyebrow={`${destinations.length} destinations in this collection`}
              intro="Choose one to bring it forward. Each opens its full guide, with season notes and booking links."
              label="Destinations in this collection"
              moreHref="#compare"
              moreLabel="Compare seasons"
              showHook
            />

            {/* Compare at a glance.
                The card grid above is for browsing -- photograph, name, hook.
                It cannot answer the question someone on a themed page is
                actually asking, which is "which of these, and when?". Season
                is the deciding factor for most of these collections and it was
                only reachable by opening each destination in turn.

                Every value here is real data already written per destination;
                nothing is templated or inferred. Wrapped in its own scroll
                container so a long season note never makes the page itself
                scroll sideways. */}
            <div id="compare" className="compare-wrap mt-10 scroll-mt-24">
              <table className="compare-table">
                <caption className="compare-caption">
                  {collection.name}: when to go, at a glance
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Destination</th>
                    <th scope="col">Region</th>
                    <th scope="col">Best time to go</th>
                  </tr>
                </thead>
                <tbody>
                  {destinations.map((d) => (
                    <tr key={d.slug}>
                      <th scope="row" className="compare-dest">
                        <Link to="/destinations/$slug" params={{ slug: d.slug }}>
                          <span aria-hidden="true">{d.flag}</span> {d.name}
                        </Link>
                      </th>
                      <td>{d.region}</td>
                      <td className="compare-season">
                        {DESTINATION_DETAILS[d.slug]?.bestTime ?? "\u2014"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
