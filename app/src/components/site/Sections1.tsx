import { Link } from "@tanstack/react-router";
import { flightsLink, hotelsLink, carRentalLink } from "@/lib/affiliate";
import { useT } from "@/lib/i18n-strings";

export function IntroSection() {
  const t = useT();
  return (
    <section className="site-section">
      <div className="site-container grid items-center gap-10 md:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="site-h2 text-3xl md:text-4xl">{t("home.introHeading")}</h2>
          <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">
            {t("home.introCopy")}
          </p>
        </div>
        <div className="site-panel overflow-hidden">
          <img src="/assets/sections/plate-cool.webp" alt={t("home.introAlt")} className="h-full w-full object-cover" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

export function FlightsSection() {
  const t = useT();
  return (
    <section id="flights" className="site-section site-hairline border-t">
      <div className="site-container grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="site-eyebrow mb-3">{t("service.flights")}</p>
          <h2 className="site-h2 text-3xl md:text-4xl">{t("home.flightsHeading")}</h2>
          <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">
            {t("home.flightsCopy")}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <a href={flightsLink()} className="btn-underline">
              {t("home.compareFlights")} <span className="arrow">&rarr;</span>
            </a>
            <Link to="/flights" className="btn-view-all">
              {t("home.viewAllFlights")} <span className="arrow">&rarr;</span>
            </Link>
          </div>
        </div>
        <div className="site-panel overflow-hidden">
          <img src="/assets/sections/flights.webp" alt={t("home.flightsAlt")} className="h-full w-full object-cover" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

export function HotelsSection() {
  const t = useT();
  return (
    <section id="hotels" className="site-section site-hairline border-t">
      <div className="site-container grid items-center gap-10 md:grid-cols-2">
        <div className="site-panel overflow-hidden md:order-1">
          <img src="/assets/sections/hotels.webp" alt={t("home.hotelsAlt")} className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="md:order-2">
          <h2 className="site-h2 text-3xl md:text-4xl">{t("home.hotelsHeading")}</h2>
          <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">
            {t("home.hotelsCopy")}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <a href={hotelsLink()} className="btn-framed">{t("home.browseStays")}</a>
            <Link to="/hotels" className="btn-view-all">
              {t("home.viewAllHotels")} <span className="arrow">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CarRentalsSection() {
  const t = useT();
  return (
    <section id="car-rentals" className="site-section site-hairline border-t">
      <div className="site-container grid gap-4 md:grid-cols-6">
        <div className="site-panel col-span-6 flex flex-col justify-between overflow-hidden p-8 md:col-span-4">
          <div>
            <h2 className="site-h2 text-3xl md:text-4xl">{t("home.carsHeading")}</h2>
            <p className="site-ink-muted mt-4 max-w-sm text-base leading-relaxed">
              {t("home.carsCopy")}
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <a href={carRentalLink()} className="btn-headline w-fit">
              <span className="badge">&rarr;</span>
              <span className="font-medium">{t("home.reserveCar")}</span>
            </a>
            <Link to="/car-rentals" className="btn-view-all">
              {t("home.viewAllCars")} <span className="arrow">&rarr;</span>
            </Link>
          </div>
        </div>
        <div className="site-panel col-span-6 overflow-hidden md:col-span-2">
          <img src="/assets/sections/car-rentals.webp" alt={t("home.carsAlt")} className="h-full w-full object-cover" loading="lazy" />
        </div>
      </div>
    </section>
  );
}
