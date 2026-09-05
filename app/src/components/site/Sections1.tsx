import { Link } from "@tanstack/react-router";
import { flightsLink, hotelsLink, carRentalLink } from "@/lib/affiliate";

export function IntroSection() {
  return (
    <section className="site-section">
      <div className="site-container grid items-center gap-10 md:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="site-h2 text-3xl md:text-4xl">Book the whole trip, not six tabs.</h2>
          <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">
            Search flights, hotels, cars, airport transfers, SIM cards and tours from one dashboard, then check out with our travel partners.
          </p>
        </div>
        <div className="site-panel overflow-hidden">
          <img src="/assets/sections/plate-cool.webp" alt="Atmospheric night sky plate" className="h-full w-full object-cover" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

export function FlightsSection() {
  return (
    <section id="flights" className="site-section site-hairline border-t">
      <div className="site-container grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="site-eyebrow mb-3">Flights</p>
          <h2 className="site-h2 text-3xl md:text-4xl">Real fares, ranked honestly.</h2>
          <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">
            Compare airlines on Aviasales-powered search and lock in a fare before prices move.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <a href={flightsLink()} className="btn-underline">
              Compare flights <span className="arrow">&rarr;</span>
            </a>
            <Link to="/flights" className="btn-view-all">
              View all flights <span className="arrow">&rarr;</span>
            </Link>
          </div>
        </div>
        <div className="site-panel overflow-hidden">
          <img src="/assets/sections/flights.webp" alt="Window seat view from a jet cabin at golden hour" className="h-full w-full object-cover" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

export function HotelsSection() {
  return (
    <section id="hotels" className="site-section site-hairline border-t">
      <div className="site-container grid items-center gap-10 md:grid-cols-2">
        <div className="site-panel overflow-hidden md:order-1">
          <img src="/assets/sections/hotels.webp" alt="Infinity pool overlooking the coastline at a luxury hotel" className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="md:order-2">
          <h2 className="site-h2 text-3xl md:text-4xl">Stays that fit the trip.</h2>
          <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">
            From boutique stays to full resorts, filtered by neighborhood first and star rating second.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <a href={hotelsLink()} className="btn-framed">Browse stays</a>
            <Link to="/hotels" className="btn-view-all">
              View all hotels <span className="arrow">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CarRentalsSection() {
  return (
    <section id="car-rentals" className="site-section site-hairline border-t">
      <div className="site-container grid gap-4 md:grid-cols-6">
        <div className="site-panel col-span-6 flex flex-col justify-between overflow-hidden p-8 md:col-span-4">
          <div>
            <h2 className="site-h2 text-3xl md:text-4xl">Wheels, wherever you land.</h2>
            <p className="site-ink-muted mt-4 max-w-sm text-base leading-relaxed">
              Economy to executive SUVs, picked up at arrivals and dropped off anywhere on the route.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <a href={carRentalLink()} className="btn-headline w-fit">
              <span className="badge">&rarr;</span>
              <span className="font-medium">Reserve a car</span>
            </a>
            <Link to="/car-rentals" className="btn-view-all">
              View all cars <span className="arrow">&rarr;</span>
            </Link>
          </div>
        </div>
        <div className="site-panel col-span-6 overflow-hidden md:col-span-2">
          <img src="/assets/sections/car-rentals.webp" alt="Luxury car parked along a coastal road" className="h-full w-full object-cover" loading="lazy" />
        </div>
      </div>
    </section>
  );
}
