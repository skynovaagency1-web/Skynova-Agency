import { Link } from "@tanstack/react-router";
import { airportServicesLink, eventsLink, esimLink, toursLink } from "@/lib/affiliate";

export function AirportSection() {
  return (
    <section id="airport-services" className="site-hairline relative border-t">
      <div className="relative h-[70vh] min-h-[420px] w-full overflow-hidden">
        <img src="/assets/sections/airport.webp" alt="Airport lounge seating with departure boards" className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--sky-bg) 0%, transparent 45%)" }} />
        <div className="site-container absolute inset-x-0 bottom-10">
          <h2 className="site-h2 max-w-md text-3xl md:text-4xl">Skip the queues.</h2>
          <p className="site-ink-muted mt-3 max-w-sm text-base leading-relaxed">
            Private transfers, shared shuttles, lounge access and baggage help, booked before you land.
          </p>
        </div>
      </div>
      <div className="site-container py-6">
        <a href={airportServicesLink()} className="btn-banner-bar">
          <span>Add airport help</span>
          <span aria-hidden="true">&rarr;</span>
        </a>
        <Link to="/airport-services" className="btn-view-all mt-4 inline-flex">
          View all airport services <span className="arrow">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}

export function EventsSection() {
  return (
    <section id="events" className="site-section site-hairline border-t">
      <div className="site-container">
        <h2 className="site-h2 max-w-md text-3xl md:text-4xl">Tickets to the good stuff.</h2>
        <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">
          Concerts, museums, attractions and skip-the-line passes in the cities you are already visiting.
        </p>
        <div className="masonry-grid mt-8">
          <div className="masonry-item-a site-panel overflow-hidden">
            <img src="/assets/sections/events.webp" alt="Event ticket stub resting on a dark surface" className="h-64 w-full object-cover md:h-80" loading="lazy" />
          </div>
          <div className="masonry-item-b site-panel flex flex-col justify-between p-6">
            <p className="site-eyebrow">Same day</p>
            <p className="text-sm leading-relaxed">Mobile tickets land in your inbox the moment you book.</p>
            <div className="mt-4 flex flex-wrap items-center gap-5">
              <a href={eventsLink()} className="btn-solid-pill w-fit">Find events</a>
              <Link to="/events" className="btn-view-all">
                View all <span className="arrow">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EsimSection() {
  const plans = [
    { label: "Local data plans", detail: "One country, ready on arrival." },
    { label: "Regional passes", detail: "Cross borders without swapping SIMs." },
    { label: "Unlimited talk & data", detail: "For longer stays and remote work." },
  ];
  return (
    <section id="esim" className="site-section site-hairline border-t">
      <div className="site-container">
        <p className="site-eyebrow mb-3">Connectivity</p>
        <h2 className="site-h2 max-w-md text-3xl md:text-4xl">Stay connected on arrival.</h2>
        <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">
          Instant eSIM activation before you land, or a physical SIM waiting at the airport counter.
        </p>
        <Link to="/esim" className="btn-view-all mt-4 inline-flex">
          View all eSIM plans <span className="arrow">&rarr;</span>
        </Link>
        <div className="mt-8 grid gap-8 md:grid-cols-[280px_1fr] md:items-center">
          <div className="site-panel overflow-hidden">
            <img src="/assets/sections/esim.webp" alt="Smartphone displaying an eSIM QR code" className="h-56 w-full object-cover" loading="lazy" />
          </div>
          <div className="hscroll">
            {plans.map((p) => (
              <div key={p.label} className="site-panel w-64 shrink-0 p-5">
                <p className="text-sm font-medium">{p.label}</p>
                <p className="site-ink-muted mt-2 text-sm">{p.detail}</p>
                <a href={esimLink()} className="btn-chip mt-4">
                  <span className="bars">
                    <span style={{ height: "4px" }} />
                    <span style={{ height: "7px" }} />
                    <span style={{ height: "10px" }} />
                  </span>
                  Get connected
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ToursSection() {
  return (
    <section id="tours" className="site-section site-hairline border-t">
      <div className="site-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="site-h2 max-w-md text-3xl md:text-4xl">Go see it, not just land there.</h2>
            <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">
              Skip-the-line tours, day trips and local guides, bookable the moment you land.
            </p>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/tours" className="btn-view-all">
              View all <span className="arrow">&rarr;</span>
            </Link>
            <a href={toursLink()} className="btn-circle" aria-label="Explore tours">&rarr;</a>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="site-panel overflow-hidden">
            <img src="/assets/sections/tours-compass.webp" alt="Brass compass resting on a map" className="h-64 w-full object-cover" loading="lazy" />
          </div>
          <div className="site-panel overflow-hidden">
            <img src="/assets/sections/tours-landmarks.webp" alt="Aerial view of a coastline landmark" className="h-64 w-full object-cover" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const steps = [
    { title: "Search once", detail: "One search bar, every vertical, live results from our partner networks." },
    { title: "Compare honestly", detail: "Skynova adds no markup and sells no placement -- you see the partner's own results." },
    { title: "Book everything", detail: "Check out with each partner directly; your booking sits with them, not us." },
  ];
  return (
    <section id="how-it-works" className="site-section site-hairline border-t">
      <div className="site-container">
        <h2 className="site-h2 max-w-md text-3xl md:text-4xl">How Skynova works.</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="site-hairline border-t pt-5">
              <p className="site-eyebrow mb-2">{["One", "Two", "Three"][i]}</p>
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="site-ink-muted mt-2 text-sm leading-relaxed">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  const marks = ["Aviasales", "Hotellook", "Rentalcars", "GetYourGuide", "Airalo", "Tiqets"];
  const track = [...marks, ...marks];
  return (
    <section className="site-section site-hairline border-t overflow-hidden">
      <div className="site-container">
        <p className="site-ink-muted mb-6 text-center text-sm">Booking runs through our travel-network partners</p>
      </div>
      <div className="marquee-track">
        {track.map((m, i) => (
          <span key={`${m}-${i}`} className="font-mono text-lg tracking-tight opacity-60">{m}</span>
        ))}
      </div>
    </section>
  );
}

export function WhySection() {
  const items = [
    { title: "One search, every vertical", detail: "Flights through tours, compared side by side." },
    { title: "Partner pricing, not markup", detail: "You check out directly with the airline, hotel or operator." },
    { title: "Built for the whole trip", detail: "From the first flight search to the last day tour." },
  ];
  return (
    <section className="site-section site-hairline border-t">
      <div className="site-container grid gap-8 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="site-panel p-6">
            <h3 className="text-lg font-semibold">{it.title}</h3>
            <p className="site-ink-muted mt-2 text-sm leading-relaxed">{it.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FinalCtaSection() {
  return (
    <section className="site-section site-hairline border-t">
      <div className="site-container text-center">
        <h2 className="site-h2 mx-auto max-w-lg text-3xl md:text-4xl">Start your trip.</h2>
        <p className="site-ink-muted mx-auto mt-3 max-w-sm text-base">Pick a vertical above, or browse by destination.</p>
        <Link to="/destinations" className="btn-final-banner mt-7 inline-flex">
          <span className="burst" />
          <span>Start your trip</span>
        </Link>
      </div>
    </section>
  );
}
