import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";

import { getDestinationBySlug, type Destination, DESTINATIONS } from "@/data/destinations";
import { VERTICALS } from "@/data/verticals";
import { Globe3D } from "@/components/site/Globe3D";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useT, type TKey } from "@/lib/i18n-strings";

// Back to a curated 8 -- 25 chips around the globe read as cluttered.
const ORBIT_SLUGS = ["portugal", "italy", "vietnam", "new-zealand", "switzerland", "peru", "kenya", "jordan"];

/**
 * Counted from the data, never typed by hand.
 *
 * These four figures were hardcoded as "25" and had gone stale: there are 42
 * destinations. about.tsx already derives its counts and carries a comment
 * warning about precisely this drift -- the homepage was simply missed. A
 * number whose job is to establish the site is real is worse than useless once
 * it disagrees with the page it links to.
 */
const DESTINATION_COUNT = DESTINATIONS.length;
const VERTICAL_COUNT = VERTICALS.length;

export function TrustLineSection() {
  const t = useT();
  return (
    <section className="trust-strip">
      <div className="site-container">
        <p className="trust-strip-text">
          <strong>{VERTICAL_COUNT}</strong> {t("home.trustVerticals")} ·{" "}
          <strong>{DESTINATION_COUNT}</strong> {t("home.trustDestinations")} · {t("home.trustPartner")}
        </p>
      </div>
    </section>
  );
}

const ADVANTAGES: { titleKey: TKey; detailKey: TKey; image: string; altKey: TKey }[] = [
  {
    titleKey: "home.adv1Title",
    detailKey: "home.adv1Detail",
    image: "/assets/sections/flights.webp",
    altKey: "home.flightsAlt",
  },
  {
    titleKey: "home.why1Title",
    detailKey: "home.adv2Detail",
    image: "/assets/sections/tours-landmarks.webp",
    altKey: "home.toursAlt2",
  },
  {
    titleKey: "home.adv3Title",
    detailKey: "home.adv3Detail",
    image: "/assets/sections/car-rentals.webp",
    altKey: "home.carsAlt",
  },
  {
    titleKey: "home.adv4Title",
    detailKey: "home.adv4Detail",
    image: "/assets/sections/hotels.webp",
    altKey: "home.hotelsAlt",
  },
];

export function AdvantagesSection() {
  const revealRef = useScrollReveal<HTMLDivElement>();
  const t = useT();
  return (
    <section className="site-section site-hairline border-t">
      <div className="site-container">
        <p className="site-eyebrow mb-3">{t("home.whySkynova")}</p>
        <h2 className="site-h2 max-w-lg text-3xl md:text-4xl">{t("home.advHeading")}</h2>
        <div ref={revealRef} className="scroll-reveal mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {ADVANTAGES.map((a) => (
            <div key={a.titleKey} className="benefit-tile">
              <div className="benefit-tile-media">
                <img src={a.image} alt={t(a.altKey)} loading="lazy" />
              </div>
              <p className="mt-4 font-semibold">{t(a.titleKey)}</p>
              <p className="site-ink-muted mt-2 text-sm leading-relaxed">{t(a.detailKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SPECS: { labelKey: TKey; value: string }[] = [
  { labelKey: "home.specVerticals", value: String(VERTICAL_COUNT) },
  { labelKey: "home.specDestinations", value: String(DESTINATION_COUNT) },
  { labelKey: "home.specMarkup", value: "$0" },
  { labelKey: "home.specSupport", value: "< 24h" },
];

const FLOW_STEPS: { n: string; titleKey: TKey; detailKey: TKey }[] = [
  { n: "01", titleKey: "home.step1Title", detailKey: "home.step1Detail" },
  { n: "02", titleKey: "home.step2Title", detailKey: "home.step2Detail" },
  { n: "03", titleKey: "home.step3AltTitle", detailKey: "home.step3AltDetail" },
  { n: "04", titleKey: "home.step4Title", detailKey: "home.step4Detail" },
];

// A still frame from the hero's own cloud loop, not the video itself --
// dissolves in from the section above and back out at the bottom using
// the same mask-image technique as .hero-afterglow, rather than a
// playing video pinned behind the content.
export function BookingSpecSection() {
  const t = useT();
  return (
    <section data-rail-dark="" id="how-it-works" className="site-section cloud-photo-section">
      <div className="site-container grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <p className="site-eyebrow mb-3">{t("home.howBookingWorks")}</p>
          <h2 className="site-h2 max-w-md text-3xl md:text-4xl">{t("home.insideHeading")}</h2>
          <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">
            {t("home.insideCopy")}
          </p>
          <div className="spec-sheet mt-8">
            {SPECS.map((s) => (
              <div key={s.labelKey} className="spec-row">
                <span className="site-ink-muted text-sm">{t(s.labelKey)}</span>
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
                <p className="font-semibold">{t(s.titleKey)}</p>
                <p className="site-ink-muted mt-1 text-sm leading-relaxed">{t(s.detailKey)}</p>
              </div>
              {i < FLOW_STEPS.length - 1 ? <span className="flow-step-line" aria-hidden="true" /> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const BENEFITS: { titleKey: TKey; detailKey: TKey; image: string; altKey: TKey }[] = [
  {
    titleKey: "home.ben1Title",
    detailKey: "home.ben1Detail",
    image: "/assets/sections/esim.webp",
    altKey: "home.esimAlt",
  },
  {
    titleKey: "home.ben2Title",
    detailKey: "home.ben2Detail",
    image: "/assets/sections/airport.webp",
    altKey: "home.airportAlt",
  },
  {
    titleKey: "home.ben3Title",
    detailKey: "home.ben3Detail",
    image: "/assets/sections/tours-compass.webp",
    altKey: "home.toursAlt1",
  },
  {
    titleKey: "home.ben4Title",
    detailKey: "home.ben4Detail",
    image: "/assets/sections/plate-cool.webp",
    altKey: "home.introAlt",
  },
];

export function BenefitsStripSection() {
  const revealRef = useScrollReveal<HTMLDivElement>();
  const t = useT();
  return (
    <section className="site-section site-hairline border-t">
      <div className="site-container">
        <p className="site-eyebrow mb-3">{t("home.beyondBooking")}</p>
        <h2 className="site-h2 max-w-md text-3xl md:text-4xl">{t("home.benefitsHeading")}</h2>
        <div ref={revealRef} className="scroll-reveal mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.titleKey} className="benefit-tile">
              <div className="benefit-tile-media">
                <img src={b.image} alt={t(b.altKey)} loading="lazy" />
              </div>
              <p className="mt-4 font-semibold">{t(b.titleKey)}</p>
              <p className="site-ink-muted mt-2 text-sm leading-relaxed">{t(b.detailKey)}</p>
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
  const t = useT();
  return (
    <section className="stats-bar site-hairline border-y">
      <div className="site-container stats-bar-grid">
        <div className="stats-bar-item">
          <p className="stats-bar-value">{DESTINATION_COUNT}</p>
          <p className="site-ink-muted text-xs uppercase tracking-wide">{t("home.countriesServed")}</p>
        </div>
        <div className="stats-bar-item">
          <p className="stats-bar-value">{VERTICAL_COUNT}</p>
          <p className="site-ink-muted text-xs uppercase tracking-wide">{t("home.travelVerticals")}</p>
        </div>
        <div className="stats-bar-item">
          <p className="stats-bar-value">24/7</p>
          <p className="site-ink-muted text-xs uppercase tracking-wide">{t("home.bookingOpen")}</p>
        </div>
        <div className="stats-bar-item">
          <p className="stats-bar-value"><LiveClock /></p>
          <p className="site-ink-muted text-xs uppercase tracking-wide">{t("home.yourLocalTime")}</p>
        </div>
      </div>
    </section>
  );
}

const ORBIT_DESTINATIONS = ORBIT_SLUGS.map(getDestinationBySlug).filter((d): d is Destination => Boolean(d));

export function FlyAnywhereSection() {
  const t = useT();
  return (
    <section className="site-section site-hairline border-t">
      <div className="site-container grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="site-eyebrow mb-3">{t("home.flyAnywhere")}</p>
          <h2 className="site-h2 max-w-md text-3xl md:text-4xl">{t("home.flyHeading", { count: DESTINATIONS.length })}</h2>
          <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">
            {t("home.flyCopy")}
          </p>
          <Link to="/destinations" className="btn-view-all mt-8">
            {t("home.viewAllDestinationsCount", { count: DESTINATIONS.length })} <span className="arrow" aria-hidden="true">&rarr;</span>
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
  const t = useT();
  return (
    <section className="site-section site-hairline border-t closing-cta">
      <div className="site-container text-center">
        <p className="closing-cta-figure">{DESTINATION_COUNT}</p>
        <h2 className="site-h2 mx-auto max-w-lg text-3xl md:text-4xl">
          {t("home.closingHeading")}
        </h2>
        <p className="site-ink-muted mx-auto mt-3 max-w-sm text-base">
          {t("home.closingCopy")}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-5">
          <Link to="/destinations" className="btn-final-banner">
            <span className="burst" />
            <span>{t("nav.startTrip")}</span>
          </Link>
          <Link to="/contact" className="btn-ghost-link">
            {t("home.talkToUs")} <span className="arrow">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
