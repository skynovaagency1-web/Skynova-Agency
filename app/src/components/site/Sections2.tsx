import { Link } from "@tanstack/react-router";
import { airportServicesLink, eventsLink, esimLink, toursLink } from "@/lib/affiliate";
import { useT, type TKey } from "@/lib/i18n-strings";

export function AirportSection() {
  const t = useT();
  return (
    <section id="airport-services" className="site-hairline relative border-t">
      <div className="relative h-[70vh] min-h-[420px] w-full overflow-hidden">
        <img src="/assets/sections/airport.webp" alt={t("home.airportAlt")} className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--sky-bg) 0%, transparent 45%)" }} />
        <div className="site-container absolute inset-x-0 bottom-10">
          <h2 className="site-h2 max-w-md text-3xl md:text-4xl">{t("home.airportHeading")}</h2>
          <p className="site-ink-muted mt-3 max-w-sm text-base leading-relaxed">
            {t("home.airportCopy")}
          </p>
        </div>
      </div>
      <div className="site-container py-6">
        <a href={airportServicesLink()} className="btn-banner-bar">
          <span>{t("home.addAirportHelp")}</span>
          <span aria-hidden="true">&rarr;</span>
        </a>
        <Link to="/airport-services" className="btn-view-all mt-4 inline-flex">
          {t("home.viewAllAirport")} <span className="arrow">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}

export function EventsSection() {
  const t = useT();
  return (
    <section id="events" className="site-section site-hairline border-t">
      <div className="site-container">
        <h2 className="site-h2 max-w-md text-3xl md:text-4xl">{t("home.eventsHeading")}</h2>
        <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">
          {t("home.eventsCopy")}
        </p>
        <div className="masonry-grid mt-8">
          <div className="masonry-item-a site-panel overflow-hidden">
            <img src="/assets/sections/events.webp" alt={t("home.eventsAlt")} className="h-64 w-full object-cover md:h-80" loading="lazy" />
          </div>
          <div className="masonry-item-b site-panel flex flex-col justify-between p-6">
            <p className="site-eyebrow">{t("home.sameDay")}</p>
            <p className="text-sm leading-relaxed">{t("home.eventsTickets")}</p>
            <div className="mt-4 flex flex-wrap items-center gap-5">
              <a href={eventsLink()} className="btn-solid-pill w-fit">{t("home.findEvents")}</a>
              <Link to="/events" className="btn-view-all">
                {t("home.viewAll")} <span className="arrow">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EsimSection() {
  const t = useT();
  const plans: { labelKey: TKey; detailKey: TKey }[] = [
    { labelKey: "home.planLocal", detailKey: "home.planLocalDetail" },
    { labelKey: "home.planRegional", detailKey: "home.planRegionalDetail" },
    { labelKey: "home.planUnlimited", detailKey: "home.planUnlimitedDetail" },
  ];
  return (
    <section id="esim" className="site-section site-hairline border-t">
      <div className="site-container">
        <p className="site-eyebrow mb-3">{t("home.connectivity")}</p>
        <h2 className="site-h2 max-w-md text-3xl md:text-4xl">{t("home.esimHeading")}</h2>
        <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">
          {t("home.esimCopy")}
        </p>
        <Link to="/esim" className="btn-view-all mt-4 inline-flex">
          {t("home.viewAllEsim")} <span className="arrow">&rarr;</span>
        </Link>
        <div className="mt-8 grid gap-8 md:grid-cols-[280px_1fr] md:items-center">
          <div className="site-panel overflow-hidden">
            <img src="/assets/sections/esim.webp" alt={t("home.esimAlt")} className="h-56 w-full object-cover" loading="lazy" />
          </div>
          <div className="hscroll">
            {plans.map((p) => (
              <div key={p.labelKey} className="site-panel w-64 shrink-0 p-5">
                <p className="text-sm font-medium">{t(p.labelKey)}</p>
                <p className="site-ink-muted mt-2 text-sm">{t(p.detailKey)}</p>
                <a href={esimLink()} className="btn-chip mt-4">
                  <span className="bars">
                    <span style={{ height: "4px" }} />
                    <span style={{ height: "7px" }} />
                    <span style={{ height: "10px" }} />
                  </span>
                  {t("home.getConnected")}
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
  const t = useT();
  return (
    <section id="tours" className="site-section site-hairline border-t">
      <div className="site-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="site-h2 max-w-md text-3xl md:text-4xl">{t("home.toursHeading")}</h2>
            <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">
              {t("home.toursCopy")}
            </p>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/tours" className="btn-view-all">
              {t("home.viewAll")} <span className="arrow">&rarr;</span>
            </Link>
            <a href={toursLink()} className="btn-circle" aria-label={t("home.exploreTours")}>&rarr;</a>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="site-panel overflow-hidden">
            <img src="/assets/sections/tours-compass.webp" alt={t("home.toursAlt1")} className="h-64 w-full object-cover" loading="lazy" />
          </div>
          <div className="site-panel overflow-hidden">
            <img src="/assets/sections/tours-landmarks.webp" alt={t("home.toursAlt2")} className="h-64 w-full object-cover" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const t = useT();
  const steps: { titleKey: TKey; detailKey: TKey }[] = [
    { titleKey: "home.step1Title", detailKey: "home.step1Detail" },
    { titleKey: "home.step2Title", detailKey: "home.step2Detail" },
    { titleKey: "home.step3Title", detailKey: "home.step3Detail" },
  ];
  return (
    <section id="how-it-works" className="site-section site-hairline border-t">
      <div className="site-container">
        <h2 className="site-h2 max-w-md text-3xl md:text-4xl">{t("home.howHeading")}</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.titleKey} className="site-hairline border-t pt-5">
              <p className="site-eyebrow mb-2">{t((["home.one", "home.two", "home.three"] as TKey[])[i])}</p>
              <h3 className="text-xl font-semibold">{t(s.titleKey)}</h3>
              <p className="site-ink-muted mt-2 text-sm leading-relaxed">{t(s.detailKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  const t = useT();
  const marks = ["Aviasales", "Hotellook", "Rentalcars", "GetYourGuide", "Airalo", "Tiqets"];
  const track = [...marks, ...marks];
  return (
    <section className="site-section site-hairline border-t overflow-hidden">
      <div className="site-container">
        <p className="site-ink-muted mb-6 text-center text-sm">{t("home.trustLine")}</p>
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
  const t = useT();
  const items: { titleKey: TKey; detailKey: TKey }[] = [
    { titleKey: "home.why1Title", detailKey: "home.why1Detail" },
    { titleKey: "home.why2Title", detailKey: "home.why2Detail" },
    { titleKey: "home.why3Title", detailKey: "home.why3Detail" },
  ];
  return (
    <section className="site-section site-hairline border-t">
      <div className="site-container grid gap-8 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.titleKey} className="site-panel p-6">
            <h3 className="text-lg font-semibold">{t(it.titleKey)}</h3>
            <p className="site-ink-muted mt-2 text-sm leading-relaxed">{t(it.detailKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FinalCtaSection() {
  const t = useT();
  return (
    <section className="site-section site-hairline border-t">
      <div className="site-container text-center">
        <h2 className="site-h2 mx-auto max-w-lg text-3xl md:text-4xl">{t("home.finalHeading")}</h2>
        <p className="site-ink-muted mx-auto mt-3 max-w-sm text-base">{t("home.finalCopy")}</p>
        <Link to="/destinations" className="btn-final-banner mt-7 inline-flex">
          <span className="burst" />
          <span>{t("nav.startTrip")}</span>
        </Link>
      </div>
    </section>
  );
}
