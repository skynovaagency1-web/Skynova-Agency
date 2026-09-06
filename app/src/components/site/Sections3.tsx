import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";

import { getDestinationBySlug, type Destination, DESTINATIONS } from "@/data/destinations";
import { Globe3D } from "@/components/site/Globe3D";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

// Back to a curated 8 -- 25 chips around the globe read as cluttered.
const ORBIT_SLUGS = ["portugal", "italy", "vietnam", "new-zealand", "switzerland", "peru", "kenya", "jordan"];

export function TrustLineSection() {
  return (
    <section className="trust-strip">
      <div className="site-container">
        <p className="trust-strip-text">
          <strong>8</strong> travel verticals · <strong>25</strong> destinations · booked through one
          trusted partner network
        </p>
      </div>
    </section>
  );
}

const ADVANTAGES = [
  {
    title: "Direct partner access",
    detail:
      "Every search routes straight to vetted flight, hotel, car and tour partners -- no reseller markup in between.",
    image: "/assets/sections/flights.webp",
    alt: "Window seat view from a jet cabin at golden hour",
  },
  {
    title: "One search, every vertical",
    detail:
      "Flights, stays, cars, airport help, eSIM and tours, compared in a single flow instead of six open tabs.",
    image: "/assets/sections/tours-landmarks.webp",
    alt: "Aerial view of a coastline landmark",
  },
  {
    title: "Transparent, partner pricing",
    detail:
      "The price shown at checkout is the partner's own -- Skynova earns a commission, you don't pay extra for it.",
    image: "/assets/sections/car-rentals.webp",
    alt: "Luxury car parked along a coastal road",
  },
  {
    title: "Built around your route",
    detail:
      "Destination guides and bundled add-ons matched to where you're actually going, not generic upsells.",
    image: "/assets/sections/hotels.webp",
    alt: "Infinity pool overlooking the coastline at a luxury hotel",
  },
];

export function AdvantagesSection() {
  const revealRef = useScrollReveal<HTMLDivElement>();
  return (
    <section className="site-section site-hairline border-t">
      <div className="site-container">
        <p className="site-eyebrow mb-3">Why Skynova</p>
        <h2 className="site-h2 max-w-lg text-3xl md:text-4xl">Built to book the whole trip, properly.</h2>
        <div ref={revealRef} className="scroll-reveal mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {ADVANTAGES.map((a) => (
            <div key={a.title} className="benefit-tile">
              <div className="benefit-tile-media">
                <img src={a.image} alt={a.alt} loading="lazy" />
              </div>
              <p className="mt-4 font-semibold">{a.title}</p>
              <p className="site-ink-muted mt-2 text-sm leading-relaxed">{a.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SPECS = [
  { label: "Verticals in one flow", value: "8" },
  { label: "Destinations routed", value: "25" },
  { label: "Markup added by Skynova", value: "$0" },
  { label: "Support response window", value: "< 24h" },
];

const FLOW_STEPS = [
  { n: "01", title: "Search once", detail: "One search bar, every vertical, live results from our partner networks." },
  { n: "02", title: "Compare honestly", detail: "Ranked by price and rating -- no pay-to-rank placements." },
  { n: "03", title: "Book with the partner", detail: "Checkout happens on the partner's own site, at their price." },
  { n: "04", title: "Fly, stay, go", detail: "Your booking sits with them; we're just the front door." },
];

// A still frame from the hero's own cloud loop, not the video itself --
// dissolves in from the section above and back out at the bottom using
// the same mask-image technique as .hero-afterglow, rather than a
// playing video pinned behind the content.
export function BookingSpecSection() {
  return (
    <section data-rail-dark="" id="how-it-works" className="site-section cloud-photo-section">
      <div className="site-container grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <p className="site-eyebrow mb-3">How a booking works</p>
          <h2 className="site-h2 max-w-md text-3xl md:text-4xl">Inside every Skynova booking.</h2>
          <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">
            No inventory of our own, no hidden fees -- just a routing layer between you and the travel
            partners who actually fulfill the trip.
          </p>
          <div className="spec-sheet mt-8">
            {SPECS.map((s) => (
              <div key={s.label} className="spec-row">
                <span className="site-ink-muted text-sm">{s.label}</span>
                <span className="font-mono text-sm font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flow-diagram">
          {FLOW_STEPS.map((s, i) => (
            <div key={s.n} className="flow-step">
              <span className="flow-step-index">{s.n}</span>
              <div>
                <p className="font-semibold">{s.title}</p>
                <p className="site-ink-muted mt-1 text-sm leading-relaxed">{s.detail}</p>
              </div>
              {i < FLOW_STEPS.length - 1 ? <span className="flow-step-line" aria-hidden="true" /> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const BENEFITS = [
  {
    title: "Connected from touchdown",
    detail: "eSIM activation before you land, or a physical SIM waiting at the counter.",
    image: "/assets/sections/esim.webp",
    alt: "Smartphone displaying an eSIM QR code",
  },
  {
    title: "Skip the queues",
    detail: "Private transfers, lounge access and baggage help, arranged before you land.",
    image: "/assets/sections/airport.webp",
    alt: "Airport lounge seating with departure boards",
  },
  {
    title: "Local, guided, or solo",
    detail: "Skip-the-line tours and day trips, bookable the moment you land.",
    image: "/assets/sections/tours-compass.webp",
    alt: "Brass compass resting on a map",
  },
  {
    title: "Support, whenever you need it",
    detail: "A route to a real person if a booking needs a human touch.",
    image: "/assets/sections/plate-cool.webp",
    alt: "Atmospheric night sky plate",
  },
];

export function BenefitsStripSection() {
  const revealRef = useScrollReveal<HTMLDivElement>();
  return (
    <section className="site-section site-hairline border-t">
      <div className="site-container">
        <p className="site-eyebrow mb-3">Beyond the booking</p>
        <h2 className="site-h2 max-w-md text-3xl md:text-4xl">The parts people forget to plan.</h2>
        <div ref={revealRef} className="scroll-reveal mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="benefit-tile">
              <div className="benefit-tile-media">
                <img src={b.image} alt={b.alt} loading="lazy" />
              </div>
              <p className="mt-4 font-semibold">{b.title}</p>
              <p className="site-ink-muted mt-2 text-sm leading-relaxed">{b.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    function tick() {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="font-mono tabular-nums">{time ?? "--:--:--"}</span>;
}

export function LiveStatsBarSection() {
  return (
    <section className="stats-bar site-hairline border-y">
      <div className="site-container stats-bar-grid">
        <div className="stats-bar-item">
          <p className="stats-bar-value">25</p>
          <p className="site-ink-muted text-xs uppercase tracking-wide">Countries served</p>
        </div>
        <div className="stats-bar-item">
          <p className="stats-bar-value">8</p>
          <p className="site-ink-muted text-xs uppercase tracking-wide">Travel verticals</p>
        </div>
        <div className="stats-bar-item">
          <p className="stats-bar-value">24/7</p>
          <p className="site-ink-muted text-xs uppercase tracking-wide">Booking open</p>
        </div>
        <div className="stats-bar-item">
          <p className="stats-bar-value"><LiveClock /></p>
          <p className="site-ink-muted text-xs uppercase tracking-wide">Your local time</p>
        </div>
      </div>
    </section>
  );
}

const ORBIT_DESTINATIONS = ORBIT_SLUGS.map(getDestinationBySlug).filter((d): d is Destination => Boolean(d));

export function FlyAnywhereSection() {
  return (
    <section className="site-section site-hairline border-t">
      <div className="site-container grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="site-eyebrow mb-3">Fly anywhere</p>
          <h2 className="site-h2 max-w-md text-3xl md:text-4xl">{DESTINATIONS.length} destinations, one booking flow.</h2>
          <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">
            Every city below routes straight into flights, stays, cars and tours for that country.
          </p>
          <Link to="/destinations" className="btn-view-all mt-8">
            View all {DESTINATIONS.length} destinations <span className="arrow" aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <div className="orbit-stage">
          <Globe3D className="orbit-globe-3d" />
          <div className="orbit-ring">
            {ORBIT_DESTINATIONS.map((d, i) => (
              <div key={d.slug} className="orbit-item" style={{ "--angle": `${(360 / ORBIT_DESTINATIONS.length) * i}deg` } as CSSProperties}>
                <Link
                  to="/destinations/$slug"
                  params={{ slug: d.slug }}
                  className="orbit-item-chip"
                >
                  <span aria-hidden="true">{d.flag}</span> {d.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ClosingStatCtaSection() {
  return (
    <section className="site-section site-hairline border-t closing-cta">
      <div className="site-container text-center">
        <p className="closing-cta-figure">25+</p>
        <h2 className="site-h2 mx-auto max-w-lg text-3xl md:text-4xl">
          Destinations routed through one search, not six tabs.
        </h2>
        <p className="site-ink-muted mx-auto mt-3 max-w-sm text-base">
          Flights, stays, cars, airport help, eSIM and tours -- start with a destination or a vertical,
          we'll route the rest.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-5">
          <Link to="/destinations" className="btn-final-banner">
            <span className="burst" />
            <span>Start your trip</span>
          </Link>
          <Link to="/contact" className="btn-ghost-link">
            Talk to us <span className="arrow">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
