import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Nav } from "@/components/site/Nav";
import { useReveal } from "@/hooks/use-reveal";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Footer } from "@/components/site/Footer";
import { Newsletter } from "@/components/site/Newsletter";
import { WishlistButton } from "@/components/site/WishlistButton";
import { getDestinationBySlug, REGION_ORDER, PHOTO_SLUGS } from "@/data/destinations";
import { collectionsForDestination } from "@/data/collections";
import { DESTINATION_DETAILS } from "@/data/destination-details";
import { ATTRACTION_IMAGES, FOOD_IMAGES } from "@/data/place-images";
import {
  flightsLink,
  hotelsLink,
  carRentalLink,
  toursLink,
  eventsLink,
  esimLink,
} from "@/lib/affiliate";

// Placeholder art for attraction/food cards until real per-destination
// photos are generated -- swap for <img> once budget allows (see benefit-tile
// usage in Sections3.tsx for the pattern to follow).
const ATTRACTION_ICONS = ["\u{1F3DB}\u{FE0F}", "\u{1F3D4}\u{FE0F}", "\u{1F30A}", "\u{1F54C}", "\u{1F3F0}", "\u{1F305}"];
const FOOD_ICONS = ["\u{1F37D}\u{FE0F}", "\u{1F958}", "\u{1F35C}", "\u{1F377}"];

export const Route = createFileRoute("/destinations/$slug")({
  loader: ({ params }) => {
    const destination = getDestinationBySlug(params.slug);
    const detail = DESTINATION_DETAILS[params.slug];
    if (!destination || !detail) throw notFound();
    return { destination, detail };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.destination.name} Travel Guide | Skynova Agency` },
            { name: "description", content: loaderData.detail.whyChoose },
          ],
        }
      : {},
  component: DestinationPage,
});

function DestinationPage() {
  const attractionsRef = useReveal<HTMLDivElement>();
  const foodRef = useReveal<HTMLDivElement>();
  const { destination, detail } = Route.useLoaderData();
  // Themed pages this destination appears in -- the return half of the
  // internal linking, so collections are reachable from anywhere.
  const collections = collectionsForDestination(destination.slug);
  const hasPhoto = PHOTO_SLUGS.has(destination.slug);
  const regionIcon = REGION_ORDER.find((r) => r.region === destination.region)?.icon ?? "";
  const name = destination.name;

  return (
    <>
      <SmoothScroll />
      <Nav />
      <main>
        {/* 1. Hero banner */}
        <section className="dest-detail-hero">
          {hasPhoto ? (
            <img
              src={`/assets/destinations/${destination.slug}.webp`}
              alt={`${name} travel scene`}
              className="dest-detail-media"
              fetchPriority="high"
            />
          ) : (
            <div className="dest-detail-media dest-detail-media-fallback" aria-hidden="true">
              <span className="dest-detail-flag-xl">{destination.flag}</span>
            </div>
          )}
          <div className="dest-detail-mask" />
          <div className="dest-detail-copy">
            <div className="site-container">
              <p className="site-eyebrow mb-3">
                <Link to="/destinations" className="site-nav-link">
                  Destinations
                </Link>{" "}
                / {regionIcon} {destination.region}
              </p>
              <h1 className="site-h2 max-w-2xl text-4xl md:text-6xl">
                {destination.flag} {name}
              </h1>
              <p className="site-ink-muted mt-4 max-w-lg text-base leading-relaxed">
                {destination.hook}
              </p>
              <div className="mt-5">
                <WishlistButton itemType="destination" itemSlug={destination.slug} variant="inline" label={`Save ${name}`} />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Why choose {name} */}
        <section className="site-section site-hairline border-t">
          <div className="site-container">
            <p className="site-eyebrow mb-3">Why Choose {name}</p>
            <p className="site-h2 max-w-3xl text-2xl leading-snug md:text-3xl">{detail.whyChoose}</p>
          </div>
        </section>

        {/* 3. Why visit -- 4 feature cards */}
        <section className="site-section site-hairline border-t">
          <div className="site-container">
            <p className="site-eyebrow mb-3">Why Visit {name}</p>
            <h2 className="site-h2 max-w-lg text-3xl md:text-4xl">What makes it worth the trip.</h2>
            <div ref={attractionsRef} className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {detail.whyVisit.map((card) => (
                <div key={card.title} className="site-panel adv-card p-6">
                  <h3 className="text-lg font-semibold leading-snug">{card.title}</h3>
                  <p className="site-ink-muted mt-3 text-sm leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Top 6 attractions */}
        <section className="site-section site-hairline border-t">
          <div className="site-container">
            <p className="site-eyebrow mb-3">See & Do</p>
            <h2 className="site-h2 max-w-lg text-3xl md:text-4xl">Top attractions in {name}.</h2>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {detail.attractions.map((a, i) => {
                const photo = ATTRACTION_IMAGES[`${destination.slug}|${a.name}`];
                return (
                  <div key={a.name} className="benefit-tile">
                    <div className="benefit-tile-media">
                      {photo ? (
                        <img src={photo} alt={a.name} loading="lazy" />
                      ) : (
                        <div className="card-media-placeholder" aria-hidden="true">
                          <span>{ATTRACTION_ICONS[i % ATTRACTION_ICONS.length]}</span>
                        </div>
                      )}
                    </div>
                    <p className="mt-4 font-semibold">{a.name}</p>
                    <p className="site-ink-muted mt-2 text-sm leading-relaxed">{a.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. Local food */}
        <section className="site-section site-hairline border-t">
          <div className="site-container">
            <p className="site-eyebrow mb-3">Eat & Drink</p>
            <h2 className="site-h2 max-w-lg text-3xl md:text-4xl">Local food in {name}.</h2>
            <p className="site-ink-muted mt-4 max-w-lg text-base leading-relaxed">{detail.foodIntro}</p>
            <div ref={foodRef} className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {detail.dishes.map((dish, i) => {
                const photo = FOOD_IMAGES[`${destination.slug}|${dish.name}`];
                return (
                  <div key={dish.name} className="benefit-tile">
                    <div className="benefit-tile-media">
                      {photo ? (
                        <img src={photo} alt={dish.name} loading="lazy" />
                      ) : (
                        <div className="card-media-placeholder" aria-hidden="true">
                          <span>{FOOD_ICONS[i % FOOD_ICONS.length]}</span>
                        </div>
                      )}
                    </div>
                    <p className="mt-4 font-semibold">{dish.name}</p>
                    <p className="site-ink-muted mt-2 text-sm leading-relaxed">{dish.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. Best hotels */}
        <section className="site-section site-hairline border-t">
          <div className="site-container">
            <p className="site-eyebrow mb-3">Where to Stay</p>
            <h2 className="site-h2 max-w-lg text-3xl md:text-4xl">Best hotels in {name}.</h2>
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5">
              {detail.hotels.map((hotel) => (
                <div key={hotel.name} className="site-panel p-6">
                  <span className="tier-badge">{hotel.tier}</span>
                  <h3 className="mt-3 text-lg font-semibold leading-snug">{hotel.name}</h3>
                  <p className="site-ink-muted mt-2 text-sm leading-relaxed">{hotel.description}</p>
                </div>
              ))}
            </div>
            <a
              href={hotelsLink(name)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-underline mt-8"
            >
              Compare all {name} hotels <span className="arrow" aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </section>

        {/* 7. Itinerary */}
        <section className="site-section site-hairline border-t">
          <div className="site-container grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div>
              <p className="site-eyebrow mb-3">Sample Route</p>
              <h2 className="site-h2 max-w-md text-3xl md:text-4xl">
                A {detail.itinerary.length}-day {name} itinerary.
              </h2>
              <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">
                A realistic pace for a first visit -- stretch it or compress it to fit your trip.
              </p>
            </div>
            <div>
              {detail.itinerary.map((step, i) => (
                <div key={step.title} className="flow-step">
                  <span className="flow-step-index">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="site-ink-muted mt-1 text-sm leading-relaxed">{step.description}</p>
                  </div>
                  {i < detail.itinerary.length - 1 ? (
                    <span className="flow-step-line" aria-hidden="true" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Best time to visit */}
        <section className="site-section site-hairline border-t">
          <div className="site-container">
            <div className="site-panel p-6 md:p-8">
              <p className="site-eyebrow mb-3">Best Time to Visit</p>
              <p className="text-lg leading-relaxed md:text-xl">{detail.bestTime}</p>
            </div>
          </div>
        </section>

        {/* 9. Travel tips */}
        <section className="site-section site-hairline border-t">
          <div className="site-container">
            <p className="site-eyebrow mb-5">Know Before You Go</p>
            <div className="spec-sheet">
              <div className="spec-row">
                <span className="site-ink-muted text-sm">Currency</span>
                <span className="max-w-md text-right text-sm font-semibold">{detail.tips.currency}</span>
              </div>
              <div className="spec-row">
                <span className="site-ink-muted text-sm">Getting around</span>
                <span className="max-w-md text-right text-sm font-semibold">{detail.tips.transport}</span>
              </div>
              <div className="spec-row">
                <span className="site-ink-muted text-sm">Safety</span>
                <span className="max-w-md text-right text-sm font-semibold">{detail.tips.safety}</span>
              </div>
              <div className="spec-row">
                <span className="site-ink-muted text-sm">Language</span>
                <span className="max-w-md text-right text-sm font-semibold">{detail.tips.language}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 10. FAQs */}
        <section className="site-section site-hairline border-t">
          <div className="site-container">
            <p className="site-eyebrow mb-3">FAQs</p>
            <h2 className="site-h2 max-w-lg text-3xl md:text-4xl">Common {name} questions.</h2>
            <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
              {detail.faqs.map((faq) => (
                <div key={faq.q} className="site-panel p-6">
                  <p className="font-semibold leading-snug">{faq.q}</p>
                  <p className="site-ink-muted mt-2 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. CTA -- booking links customized for this destination */}
        <section className="site-section site-hairline border-t">
          <div className="site-container">
            <p className="site-eyebrow mb-5">Book {name}</p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              <a href={flightsLink()} target="_blank" rel="noopener noreferrer" className="dest-mini-card">
                <p className="font-semibold">Flights</p>
                <p className="site-ink-muted mt-1 text-sm">Compare fares into {name}.</p>
              </a>
              <a
                href={hotelsLink(name)}
                target="_blank"
                rel="noopener noreferrer"
                className="dest-mini-card"
              >
                <p className="font-semibold">Hotels</p>
                <p className="site-ink-muted mt-1 text-sm">Stays across {name}, ranked by price.</p>
              </a>
              <a href={carRentalLink()} target="_blank" rel="noopener noreferrer" className="dest-mini-card">
                <p className="font-semibold">Car rentals</p>
                <p className="site-ink-muted mt-1 text-sm">Pick up on arrival, drop off anywhere.</p>
              </a>
              <a
                href={toursLink(name)}
                target="_blank"
                rel="noopener noreferrer"
                className="dest-mini-card"
              >
                <p className="font-semibold">Tours & activities</p>
                <p className="site-ink-muted mt-1 text-sm">Guided trips and things to do.</p>
              </a>
              <a href={eventsLink()} target="_blank" rel="noopener noreferrer" className="dest-mini-card">
                <p className="font-semibold">Events & tickets</p>
                <p className="site-ink-muted mt-1 text-sm">Attractions and shows, booked ahead.</p>
              </a>
              <a
                href={esimLink(destination.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="dest-mini-card"
              >
                <p className="font-semibold">eSIM</p>
                <p className="site-ink-muted mt-1 text-sm">Data on arrival, no roaming fees.</p>
              </a>
            </div>
            <Link to="/destinations" className="btn-underline mt-8">
              Back to all destinations <span className="arrow" aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </section>

        {/* Closing CTA banner */}
        <section className="site-section site-hairline border-t closing-cta">
          <div className="site-container text-center">
            <h2 className="site-h2 mx-auto max-w-lg text-3xl md:text-4xl">
              Start planning your {name} trip.
            </h2>
            <p className="site-ink-muted mx-auto mt-3 max-w-sm text-base">
              Flights, stays, cars, and things to do -- compared and booked without switching tabs.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-5">
              <a href={flightsLink()} target="_blank" rel="noopener noreferrer" className="btn-final-banner">
                <span className="burst" />
                <span>Start your trip</span>
              </a>
            </div>
          </div>
        </section>

        {/* Themed collections this destination belongs to. Every destination
            sits in 1-4, so this always renders something and gives the
            collection pages a route in from every guide. */}
        {collections.length > 0 && (
          <section className="site-section site-hairline border-t">
            <div className="site-container">
              <p className="site-eyebrow mb-5">{name} also appears in</p>
              <div className="collection-more">
                {collections.map((c) => (
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
        )}
      </main>
      <Newsletter />
      <Footer />
    </>
  );
}
