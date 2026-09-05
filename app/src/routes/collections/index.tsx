import { createFileRoute, Link } from "@tanstack/react-router";

import { Nav } from "@/components/site/Nav";
import { useReveal } from "@/hooks/use-reveal";
import { Footer } from "@/components/site/Footer";
import { Newsletter } from "@/components/site/Newsletter";
import { COLLECTIONS, collectionDestinations } from "@/data/collections";

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

function CollectionsIndex() {
  const gridRef = useReveal<HTMLDivElement>();
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

            <div ref={gridRef} className="collection-grid mt-10">
              {COLLECTIONS.map((c) => {
                const dests = collectionDestinations(c);
                return (
                  <Link
                    key={c.slug}
                    to="/collections/$slug"
                    params={{ slug: c.slug }}
                    className="collection-card"
                  >
                    <span className="collection-card-icon" aria-hidden="true">
                      {c.icon}
                    </span>
                    <h2 className="collection-card-title">{c.name}</h2>
                    <p className="collection-card-tagline">{c.tagline}</p>
                    <p className="collection-card-meta">
                      {dests.length} destinations
                      <span className="arrow"> &rarr;</span>
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Newsletter />
      <Footer />
    </>
  );
}
