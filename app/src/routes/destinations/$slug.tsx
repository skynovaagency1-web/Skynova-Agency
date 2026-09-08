import type { CSSProperties } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Nav } from "@/components/site/Nav";
import { useReveal } from "@/hooks/use-reveal";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Footer } from "@/components/site/Footer";
import { Newsletter } from "@/components/site/Newsletter";
import { WishlistButton } from "@/components/site/WishlistButton";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { absUrl, jsonLd, destinationTitle } from "@/lib/seo";
import {
  getDestinationBySlug,
  relatedDestinations,
  REGION_ORDER,
  PHOTO_SLUGS,
} from "@/data/destinations";
import { collectionsForDestination } from "@/data/collections";
import { DESTINATION_DETAILS } from "@/data/destination-details";
import { POSTS } from "@/data/blog-posts";
import { ARTICLE_SLUGS } from "@/data/blog-articles";
import { ATTRACTION_IMAGES, FOOD_IMAGES } from "@/data/place-images";
import {
  flightsLink,
  hotelsLink,
  carRentalLink,
  discoverCarsLink,
  toursLink,
  eventsLink,
  attractionsLink,
  esimLink,
  airportServicesLink,
  bikeRentalLink,
} from "@/lib/affiliate";

// Placeholder art for attraction/food cards until real per-destination
// photos are generated -- swap for <img> once budget allows (see benefit-tile
// usage in Sections3.tsx for the pattern to follow).
const ATTRACTION_ICONS = ["\u{1F3DB}\u{FE0F}", "\u{1F3D4}\u{FE0F}", "\u{1F30A}", "\u{1F54C}", "\u{1F3F0}", "\u{1F305}"];
const FOOD_ICONS = ["\u{1F37D}\u{FE0F}", "\u{1F958}", "\u{1F35C}", "\u{1F377}"];
/** Know-before-you-go rows, in fixed order so the numbering is stable. */
const TIP_ROWS = [
  { key: "currency", label: "Currency", icon: "\u{1F4B1}" },
  { key: "transport", label: "Getting around", icon: "\u{1F686}" },
  { key: "safety", label: "Safety", icon: "\u{1F6E1}\u{FE0F}" },
  { key: "language", label: "Language", icon: "\u{1F4AC}" },
] as const;

/**
 * How many days the itinerary actually covers.
 *
 * The heading used detail.itinerary.length, which is the number of STEPS, not
 * days -- so Japan's "Day 1-4 / Day 5-8 / Day 9-11 / Day 12-14" rendered as
 * "A 4-day Japan itinerary" when it is a fourteen-day trip. Portugal read
 * 4-day for a seven-day route, Jordan 4 for five. Wrong on all 42 pages.
 *
 * The titles carry the real span, so read it from them and fall back to the
 * step count only if a title ever stops naming days.
 */
function itineraryDays(steps: { title: string }[]): number {
  const days = steps.flatMap((s) => (s.title.match(/\d+/g) ?? []).map(Number));
  return days.length ? Math.max(...days) : steps.length;
}

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
            { title: destinationTitle(loaderData.destination.name) },
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
  const related = relatedDestinations(destination.slug);
  // The other half of the topic cluster. Blog articles already linked TO
  // destination guides, but no guide linked back to a single article -- the
  // dest->blog edge was zero across all 42 guides, so a cluster only ever
  // pointed one way. destinationSlug already exists on every post, so this
  // needs no hand-maintained mapping.
  //
  // Filtered against ARTICLE_SLUGS deliberately: POSTS is the card index and
  // may list a post whose body has not been written yet. Linking to one of
  // those would send a reader to an empty page, which is the exact thing
  // blog-posts.ts already refuses to do on the blog index.
  const guides = POSTS.filter(
    (post) => post.destinationSlug === destination.slug && ARTICLE_SLUGS.includes(post.slug),
  );

  // One list rather than six hand-written cards. Each entry names the partner
  // it sends you to -- previously the card said "Hotels" and you found out on
  // arrival. Naming them is the same transparency the About and Terms pages
  // already commit to, and it is what makes a second partner per vertical
  // legible instead of confusing.
  //
  // A vertical carries two partners where a second programme exists AND is
  // configured. discoverCarsLink() returns null until its affiliate id is
  // set, so the extra link simply does not render rather than shipping an
  // unattributed one.
  const discoverCars = discoverCarsLink(destination.slug);
  // `vertical` is the site's OWN page for this category, not the partner.
  // Before this, /flights, /hotels and the rest had 0-1 in-content inbound
  // links across the whole site -- reachable only from nav and footer, while
  // 42 destination guides discussed those exact topics and linked to none of
  // them. /airport-services and /bike-rentals had literally zero and were not
  // in this list at all.
  const booking: {
    title: string;
    copy: string;
    vertical: "/flights" | "/hotels" | "/car-rentals" | "/airport-services" | "/tours" | "/events" | "/esim" | "/bike-rentals";
    partners: { label: string; href: string }[];
  }[] = [
    {
      title: "Flights",
      vertical: "/flights",
      copy: `Compare fares into ${name}.`,
      partners: [{ label: "Aviasales", href: flightsLink() }],
    },
    {
      title: "Hotels",
      vertical: "/hotels",
      copy: `Stays across ${name}, compared in one search.`,
      partners: [{ label: "Hotellook", href: hotelsLink(name) }],
    },
    {
      title: "Car rentals",
      vertical: "/car-rentals",
      copy: `Collect on arrival and drive ${name} at your own pace.`,
      partners: [
        { label: "Rentalcars", href: carRentalLink() },
        ...(discoverCars ? [{ label: "Discover Cars", href: discoverCars }] : []),
      ],
    },
    {
      title: "Tours & activities",
      vertical: "/tours",
      copy: `Guided trips and day tours across ${name}.`,
      partners: [{ label: "GetYourGuide", href: toursLink(name) }],
    },
    {
      title: "Events & tickets",
      vertical: "/events",
      copy: `Attractions and shows in ${name}, booked ahead.`,
      partners: [
        { label: "Tiqets", href: eventsLink() },
        { label: "GetYourGuide", href: attractionsLink(name) },
      ],
    },
    {
      title: "Airport transfers",
      vertical: "/airport-services",
      copy: `Meet-and-greet and private transfers on arrival in ${name}.`,
      partners: [{ label: "GetTransfer", href: airportServicesLink() }],
    },
    {
      title: "Bike rentals",
      vertical: "/bike-rentals",
      copy: `Rent a bike and cover ${name} at street level.`,
      partners: [{ label: "GetYourGuide", href: bikeRentalLink(name) }],
    },
    {
      title: "eSIM",
      vertical: "/esim",
      copy: `Data the moment you land in ${name}, no roaming fees.`,
      partners: [{ label: "Airalo", href: esimLink(destination.slug) }],
    },
  ];
  const path = `/destinations/${destination.slug}`;
  const trail = [
    { name: "Home", path: "/" },
    { name: "Destinations", path: "/destinations" },
    { name },
  ];

  // One @graph rather than several <script> blocks: the nodes cross-reference
  // each other by @id, and a single graph is what lets the FAQ and the stay
  // list be understood as belonging to THIS destination rather than floating
  // free on the page.
  const graph = jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        // TouristDestination, not "TravelDestination" -- the latter is not a
        // schema.org type and would be ignored outright.
        "@type": "TouristDestination",
        "@id": absUrl(path) + "#destination",
        name,
        description: detail.whyChoose,
        url: absUrl(path),
        ...(hasPhoto ? { image: absUrl(`/assets/destinations/${destination.slug}.webp`) } : {}),
        includesAttraction: detail.attractions.map((a) => ({
          "@type": "TouristAttraction",
          name: a.name,
          description: a.description,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": absUrl(path) + "#faq",
        mainEntity: detail.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        // An ItemList of Hotels, NOT standalone Hotel nodes. We do not operate
        // these properties and carry no address, price or rating for them --
        // publishing them as business listings would be claiming something
        // untrue. As a named recommendation list it says exactly what it is.
        "@type": "ItemList",
        "@id": absUrl(path) + "#stays",
        name: `Where to stay in ${name}`,
        itemListElement: detail.hotels.map((h, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: { "@type": "Hotel", name: h.name, description: h.description },
        })),
      },
    ],
  });

  return (
    <>
      <SmoothScroll />
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph }} />
      <main
        className="dest-detail-page"
        /* One override, whole page. --sky-coral-ink stays white because every
           accent is verified to clear AA under white text; --sky-coral-deep
           and -wash are derived so a new destination only ever needs one hex. */
        style={
          {
            "--sky-coral": destination.accent,
            "--sky-coral-deep": `color-mix(in srgb, ${destination.accent} 78%, var(--sky-ink))`,
            "--sky-coral-wash": `color-mix(in srgb, ${destination.accent} 13%, transparent)`,
            // Hairlines and panel borders too. The page wash itself is capped
            // at 13% -- past that, muted body text drops under WCAG AA against
            // the darker accents (Qatar's plum hits 4.28:1 at 16%). Borders
            // carry no text, so they can take far more colour and are what
            // actually makes the page read as the destination's rather than a
            // white page with tinted buttons.
            "--sky-line": `color-mix(in srgb, ${destination.accent} 34%, var(--sky-bg-raised))`,
            // White, via the token rather than a literal -- text that sits ON the accent.
            "--sky-coral-ink": "var(--sky-bg)",
            // The pill button's fill is hardcoded gold by default; give it an
            // accent-derived gradient of the same shape so it retints too.
            "--btn-pill-fill": `linear-gradient(180deg, color-mix(in srgb, ${destination.accent} 72%, var(--sky-bg)) 0%, color-mix(in srgb, ${destination.accent} 90%, var(--sky-bg)) 52%, ${destination.accent} 100%)`,
          } as CSSProperties
        }
      >
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
          <span
            className="dest-hero-wordmark"
            aria-hidden="true"
            /* Character count drives the size. A fixed vw size fits "EGYPT"
               and blows "United Arab Emirates" 900px past the frame. */
            style={{ "--wm-len": name.length } as CSSProperties}
          >
            {name}
          </span>
          <div className="dest-detail-mask" />
          <div className="dest-detail-copy">
            <div className="site-container">
              <Breadcrumbs trail={trail} />
              <p className="site-eyebrow mb-3 mt-3">
                {regionIcon} {destination.region}
              </p>
              <h1 className="site-h2 max-w-2xl text-4xl md:text-6xl">
                {destination.flag} {name}
              </h1>
              <p className="site-ink-muted mt-4 max-w-lg text-base leading-relaxed">
                {destination.hook}
              </p>
              <dl className="dest-hero-stats">
                <div className="dest-hero-stat">
                  <dt className="dest-hero-stat-figure">{detail.attractions.length}</dt>
                  <dd className="dest-hero-stat-label">things to see</dd>
                </div>
                <div className="dest-hero-stat">
                  <dt className="dest-hero-stat-figure">{detail.itinerary.length}</dt>
                  <dd className="dest-hero-stat-label">day route</dd>
                </div>
                <div className="dest-hero-stat">
                  <dt className="dest-hero-stat-figure">{booking.length}</dt>
                  <dd className="dest-hero-stat-label">ways to book</dd>
                </div>
              </dl>
              <div className="dest-hero-actions">
                <a href="#book" className="btn-hero-pill dest-hero-cta">
                  <span className="spark" />
                  <span>Book {name}</span>
                  <span className="dest-hero-cta-arrow" aria-hidden="true">→</span>
                </a>
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

        {/* 4. Top 6 attractions -- dark "atlas" treatment, after the reference:
               glass cards on a ground tinted by this destination's accent, each
               with an inset photo and a numbered marker. The reference pairs
               these with a pinned map; there are no coordinates in the data for
               ~250 attractions, and inventing them would put confident pins in
               wrong places, so the number stands in for the pin. */}
        <section className="dest-atlas">
          <div className="site-container">
            <p className="site-eyebrow dest-atlas-eyebrow mb-3">See &amp; Do</p>
            <h2 className="site-h2 dest-atlas-title max-w-lg text-3xl md:text-4xl">
              Top attractions in {name}.
            </h2>
            <div className="dest-atlas-grid mt-10">
              {detail.attractions.map((a, i) => {
                const photo = ATTRACTION_IMAGES[`${destination.slug}|${a.name}`];
                return (
                  <article key={a.name} className="dest-atlas-card">
                    {/* Card order follows the reference exactly: crest, then the
                        name in serif, then the photograph, then icon rows. */}
                    <span className="dest-atlas-crest" aria-hidden="true">
                      <svg viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0c.5 4 3.5 7 8 8-4.5 1-7.5 4-8 8-.5-4-3.5-7-8-8 4.5-1 7.5-4 8-8Z" />
                      </svg>
                    </span>
                    <h3 className="dest-atlas-name">{a.name}</h3>
                    <div className="dest-atlas-media">
                      {photo ? (
                        <img src={photo} alt={a.name} loading="lazy" decoding="async" />
                      ) : (
                        <div className="dest-atlas-placeholder" aria-hidden="true">
                          <span>{ATTRACTION_ICONS[i % ATTRACTION_ICONS.length]}</span>
                        </div>
                      )}
                    </div>
                    <div className="dest-atlas-row">
                      <span className="dest-atlas-row-icon" aria-hidden="true">
                        {ATTRACTION_ICONS[i % ATTRACTION_ICONS.length]}
                      </span>
                      <span className="dest-atlas-row-text">{a.description}</span>
                    </div>
                  </article>
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
                A {itineraryDays(detail.itinerary)}-day {name} itinerary.
              </h2>
              <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">
                A realistic pace for a first visit -- stretch it or compress it to fit your trip.
              </p>
            </div>
            <div className="route-steps-flow">
              {detail.itinerary.map((step, i) => (
                <div
                  key={step.title}
                  className={`route-step${i % 2 === 1 ? " is-flipped" : ""}`}
                  style={{ "--route-step": String(i) } as CSSProperties}
                >
                  <span className="route-step-index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="route-step-body">
                    <p className="route-step-title">{step.title}</p>
                    <p className="route-step-copy">{step.description}</p>
                  </div>
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
            {/* Numbered banner rows, after the reference. Its rows are five
                unrelated hues; these are four steps of the destination's own
                accent instead, because a rainbow here would fight the
                per-destination colour the rest of the page now carries. */}
            <div className="kbyg-rows">
              {TIP_ROWS.map((row, i) => (
                <div
                  key={row.key}
                  className="kbyg-row"
                  style={{ "--kbyg-step": String(i) } as CSSProperties}
                >
                  <span className="kbyg-index">{String(i + 1).padStart(2, "0")}</span>
                  <div className="kbyg-band">
                    <p className="kbyg-label">{row.label}</p>
                    <p className="kbyg-text">{detail.tips[row.key]}</p>
                    <span className="kbyg-icon" aria-hidden="true">
                      {row.icon}
                    </span>
                  </div>
                </div>
              ))}
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
        <section id="book" className="site-section site-hairline border-t">
          <div className="site-container">
            <p className="site-eyebrow mb-5">Book {name}</p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {booking.map((b) => (
                <div key={b.title} className="dest-mini-card">
                  <p className="font-semibold">
                    <Link to={b.vertical} className="dest-mini-vertical">
                      {b.title} <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </p>
                  <p className="site-ink-muted mt-1 text-sm">{b.copy}</p>
                  <span className="dest-mini-partners">
                    {b.partners.map((partner) => (
                      <a
                        key={partner.label}
                        href={partner.href}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="dest-mini-partner"
                      >
                        {partner.label} <span aria-hidden="true">&rarr;</span>
                      </a>
                    ))}
                  </span>
                </div>
              ))}
            </div>
            <Link to="/destinations" className="btn-underline mt-8">
              Back to all destinations <span className="arrow" aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </section>

        {/* Guides for this destination -- closes the cluster loop. Renders
            nothing for the 31 destinations with no written article yet,
            rather than showing an empty shell. */}
        {guides.length > 0 && (
          <section className="site-section site-hairline border-t">
            <div className="site-container">
              <p className="site-eyebrow mb-3">Read first</p>
              <h2 className="site-h2 max-w-lg text-3xl md:text-4xl">
                {guides.length === 1 ? "A guide" : `${guides.length} guides`} for {name}.
              </h2>
              <div className="dest-guides-grid mt-8">
                {guides.map((post) => (
                  <Link
                    key={post.slug}
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="dest-guide-card"
                  >
                    <span className="dest-guide-tag">{post.tag}</span>
                    <span className="dest-guide-title">{post.title}</span>
                    <span className="dest-guide-excerpt">{post.excerpt}</span>
                    <span className="dest-guide-meta">
                      {post.readTime} <span aria-hidden="true">&rarr;</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related destinations. The missing half of the internal link graph:
            every guide already linked UP to /destinations and ACROSS to its
            collections, but no destination linked to another destination, so
            crawlers reached each guide through the index and nothing else.
            Same region first -- see relatedDestinations() for why the order is
            deterministic. */}
        {related.length > 0 && (
          <section className="site-section site-hairline border-t">
            <div className="site-container">
              <p className="site-eyebrow mb-3">Where to next</p>
              <h2 className="site-h2 max-w-lg text-3xl md:text-4xl">
                Travellers to {name} also look at these.
              </h2>
              <div className="related-dest-grid mt-8">
                {related.map((d) => (
                  <Link
                    key={d.slug}
                    to="/destinations/$slug"
                    params={{ slug: d.slug }}
                    className="related-dest-card"
                  >
                    <span className="related-dest-flag" aria-hidden="true">
                      {d.flag}
                    </span>
                    <span className="related-dest-body">
                      <span className="related-dest-name">{d.name}</span>
                      <span className="related-dest-hook">{d.hook}</span>
                    </span>
                    <span className="related-dest-arrow" aria-hidden="true">
                      &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Closing CTA banner */}
        <section className="site-section site-hairline border-t closing-cta">
          <div className="site-container text-center">
            <h2 className="site-h2 mx-auto max-w-lg text-3xl md:text-4xl">
              Start planning your {name} trip.
            </h2>
            <p className="site-ink-muted mx-auto mt-3 max-w-sm text-base">
              Flights, stays, cars, and things to do &mdash; compared in one place, booked with trusted travel partners.
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
