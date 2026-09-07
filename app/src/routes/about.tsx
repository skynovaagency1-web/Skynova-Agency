import { createFileRoute } from "@tanstack/react-router";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Newsletter } from "@/components/site/Newsletter";
import { DESTINATIONS, REGION_ORDER } from "@/data/destinations";
import { COLLECTIONS } from "@/data/collections";
import { POSTS } from "@/data/blog-posts";
import { ARTICLE_SLUGS } from "@/data/blog-articles";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | Skynova Agency" },
      {
        name: "description",
        // Built from the data too -- a hardcoded number here goes stale in
        // exactly the same way the page body did.
        content: `Skynova Agency is a booking layer over established travel partners -- flights, stays, cars, connectivity, tickets and tours in one place, across ${DESTINATIONS.length} destinations.`,
      },
    ],
  }),
  component: AboutPage,
});

// Counted from the data, never typed by hand. This page previously claimed
// "25 destinations" long after there were 42 -- a stale number on the page
// that exists to establish the site is real is worse than no number.
const DESTINATION_COUNT = DESTINATIONS.length;
const REGION_COUNT = REGION_ORDER.length;
const GUIDE_COUNT = ARTICLE_SLUGS.length;

const COVERED = [
  "Flights",
  "Hotels",
  "Car rentals",
  "Airport services",
  "Events & tickets",
  "SIM & eSIM",
  "Tours & activities",
  "Bike rentals",
];

function AboutPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="site-section">
          <div className="site-container">
            <p className="site-eyebrow mb-3">About Skynova Agency</p>
            <h1 className="site-h2 max-w-2xl text-4xl md:text-6xl">One place for the whole trip.</h1>
            <p className="site-ink-muted mt-5 max-w-xl text-base leading-relaxed">
              Most trips get planned across six or seven open tabs -- one for flights, another
              for the hotel, another for the rental car, another for tickets. Skynova Agency puts
              all of it behind one search, one route in, one place to come back to before you go.
            </p>
          </div>
        </section>

        <section className="site-section pt-0">
          <div className="site-container grid gap-8 md:grid-cols-2">
            <div className="site-panel p-7">
              <p className="site-eyebrow mb-3">How it works</p>
              <p className="text-base leading-relaxed">
                Skynova Agency does not hold inventory itself. Every flight, room, car, ticket,
                eSIM and tour booked through the site is fulfilled by an established travel
                partner -- we route each search to the right one and get out of the way at
                checkout.
              </p>
            </div>
            <div className="site-panel p-7">
              <p className="site-eyebrow mb-3">How we're paid</p>
              <p className="text-base leading-relaxed">
                We run on the Travelpayouts affiliate network. When a booking completes with one
                of our partners, we earn a commission at no extra cost to the traveler -- the
                price shown at checkout is the partner's own price.
              </p>
            </div>
          </div>
        </section>

        <section className="site-section pt-0">
          <div className="site-container">
            <p className="site-eyebrow mb-5">Where we are today</p>
            <div className="about-stats">
              <div className="about-stat">
                <p className="about-stat-num">{DESTINATION_COUNT}</p>
                <p className="about-stat-label">destination guides</p>
              </div>
              <div className="about-stat">
                <p className="about-stat-num">{REGION_COUNT}</p>
                <p className="about-stat-label">regions covered</p>
              </div>
              <div className="about-stat">
                <p className="about-stat-num">{COLLECTIONS.length}</p>
                <p className="about-stat-label">themed collections</p>
              </div>
              <div className="about-stat">
                <p className="about-stat-num">{GUIDE_COUNT}</p>
                <p className="about-stat-label">written articles</p>
              </div>
            </div>
          </div>
        </section>

        <section className="site-section pt-0">
          <div className="site-container grid gap-8 md:grid-cols-2">
            <div className="site-panel p-7">
              <p className="site-eyebrow mb-3">What we do not do</p>
              <p className="text-base leading-relaxed">
                We do not take your payment, hold your booking, or set the price. That all happens
                with the partner. If something needs changing after you book, they are the ones who
                can do it -- which is why their details are on your confirmation, not ours.
              </p>
            </div>
            <div className="site-panel p-7">
              <p className="site-eyebrow mb-3">Why the guides exist</p>
              <p className="text-base leading-relaxed">
                Every destination here has a written guide rather than a stock paragraph, because
                the useful part of planning a trip is knowing what a place actually costs, when to
                go, and what the guidebook leaves out.
              </p>
            </div>
          </div>
        </section>

        <section className="site-section pt-0">
          <div className="site-container">
            <p className="site-eyebrow mb-5">What&rsquo;s covered</p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {COVERED.map((item) => (
                <div key={item} className="dest-mini-card">
                  <p className="font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://skynovaagency.com/#organization",
              name: "Skynova Agency",
              url: "https://skynovaagency.com",
              logo: "https://skynovaagency.com/assets/brand/icon-512.png",
              description:
                "A booking layer over established travel partners -- flights, stays, cars, connectivity, tickets and tours in one place.",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                url: "https://skynovaagency.com/contact",
              },
            }),
          }}
        />
      </main>
      <Newsletter />
      <Footer />
    </>
  );
}
