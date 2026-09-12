import { createFileRoute } from "@tanstack/react-router";

import { VerticalPage } from "@/components/site/VerticalPage";
import { EsimCountriesSection } from "@/components/site/EsimCountries";
import { TravelGuidesSection } from "@/components/site/TravelGuides";
import { AffiliateWidget } from "@/components/site/AffiliateWidget";
import { esimLink } from "@/lib/affiliate";

/**
 * Airalo eSIM search, as a Travelpayouts widget.
 *
 * The deep links elsewhere on the site hand the visitor to Airalo's own
 * country page; this lets them pick a plan without leaving, which is the
 * point of a widget over a link.
 *
 * Recoloured from the defaults the widget builder produced (#0b2033 navy
 * panel, #f2685f salmon button) to the site's own tokens -- white panel,
 * --sky-coral gold button, --sky-ink text -- the same treatment
 * CAR_WIDGET_FORM_SRC already gets. Everything else is left exactly as
 * generated: trs, shmarker, promo_id and campaign_id are the tracking
 * identifiers and changing any of them breaks attribution.
 *
 * show_logo stays on. The visitor should be able to see it is Airalo before
 * they commit, which is the same reason the destination cards now name their
 * partners.
 *
 * tpscr.com is already allow-listed in script-src (lib/security-headers.server.ts).
 * Remove it there and this widget silently renders nothing at all.
 */
const ESIM_WIDGET_SRC =
  "https://tpscr.com/content?trs=519959&shmarker=720297&locale=en&powered_by=true" +
  "&border_radius=12&plain=true&show_logo=true" +
  "&color_background=%23ffffff&color_button=%23c9a227&color_text=%231c1a14" +
  "&color_input_text=%231c1a14&color_button_text=%231c1400" +
  "&promo_id=4362&campaign_id=143";

import { useT, type TKey } from "@/lib/i18n-strings";

const HOW_STEPS: { n: string; titleKey: TKey; detailKey: TKey }[] = [
  { n: "01", titleKey: "esim.step1Title", detailKey: "esim.step1Detail" },
  { n: "02", titleKey: "esim.step2Title", detailKey: "esim.step2Detail" },
  { n: "03", titleKey: "esim.step3Title", detailKey: "esim.step3Detail" },
];

/** Device names are brands, so only the line under each is translated. */
const COMPATIBLE_DEVICES: { title: string; bodyKey: TKey }[] = [
  { title: "iPhone", bodyKey: "esim.device1Body" },
  { title: "Samsung Galaxy", bodyKey: "esim.device2Body" },
  { title: "Google Pixel", bodyKey: "esim.device3Body" },
];

export const Route = createFileRoute("/esim")({
  head: () => ({
    meta: [
      { title: "SIM & eSIM | Skynova Agency" },
      { name: "description", content: "Instant eSIM activation before you land, or a physical SIM waiting at the airport counter." },
    ],
  }),
  component: EsimPage,
});

function EsimPage() {
  const t = useT();
  return (
    <VerticalPage
      eyebrow={t("service.esim")}
      title={t("esim.title")}
      description={t("home.esimCopy")}
      heroVideo={{ videoSrc: "/assets/hero/esim-hero.mp4" }}
      heroAlt={t("home.esimAlt")}
      ctaHref={esimLink()}
      ctaLabel={t("home.getConnected")}
      bullets={[
        { title: t("home.planLocal"), body: t("esim.b1Body") },
        { title: t("home.planRegional"), body: t("home.planRegionalDetail") },
        { title: t("home.planUnlimited"), body: t("esim.b3Body") },
      ]}
      destinationSlugs={["vietnam", "sri-lanka", "brazil", "oman"]}
      faqHeading={t("esim.faqHeading")}
      faqs={[
        { q: t("esim.q1"), a: t("esim.a1") },
        { q: t("esim.q2"), a: t("esim.a2") },
        { q: t("esim.q3"), a: t("esim.a3") },
        { q: t("esim.q4"), a: t("esim.a4") },
      ]}
      afterDestinations={
        <TravelGuidesSection
          eyebrow={t("esim.guidesEyebrow")}
          heading={t("esim.guidesHeading")}
          slugs={["vietnam-esim-vs-sim", "esim-vs-roaming-cost", "esim-multi-country-trip"]}
        />
      }
    >
      <section className="site-section pt-0 sim-float-section">
        <div className="site-container">
          <div>
            <p className="site-eyebrow mb-3">{t("esim.floatEyebrow")}</p>
            <h2 className="site-h2 max-w-md text-3xl md:text-4xl">{t("esim.floatHeading")}</h2>
            <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">{t("esim.floatCopy")}</p>
            <a href={esimLink()} target="_blank" rel="noopener noreferrer" className="btn-underline mt-6">
              {t("home.getConnected")} <span className="arrow">&rarr;</span>
            </a>
          </div>
          <div className="sim-float-stage">
            <img src="/assets/esim/sim-card-float.webp" alt={t("esim.simAlt")} className="sim-float-card" />
          </div>
        </div>
      </section>
      <section className="site-section pt-0">
        <div className="site-container">
          <p className="site-eyebrow mb-3">{t("about.howItWorks")}</p>
          <h2 className="site-h2 max-w-md text-3xl md:text-4xl">{t("esim.howHeading")}</h2>
          <div className="flow-diagram mt-8">
            {HOW_STEPS.map((s, i) => (
              <div key={s.n} className="flow-step">
                <span className="flow-step-index">{s.n}</span>
                <div>
                  <p className="font-semibold">{t(s.titleKey)}</p>
                  <p className="site-ink-muted mt-1 text-sm leading-relaxed">{t(s.detailKey)}</p>
                </div>
                {i < HOW_STEPS.length - 1 ? <span className="flow-step-line" aria-hidden="true" /> : null}
              </div>
            ))}
          </div>
        </div>
      </section>
      <EsimCountriesSection />
      <section className="site-section pt-0">
        <div className="site-container">
          <p className="site-eyebrow mb-3">{t("esim.findEyebrow")}</p>
          <h2 className="site-h2 max-w-md text-3xl md:text-4xl">{t("esim.findHeading")}</h2>
          <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">{t("esim.findCopy")}</p>
          <AffiliateWidget src={ESIM_WIDGET_SRC} className="mt-8" />
        </div>
      </section>
      <section className="site-section pt-0">
        <div className="site-container">
          <p className="site-eyebrow mb-3">{t("esim.devicesEyebrow")}</p>
          <h2 className="site-h2 max-w-md text-3xl md:text-4xl">{t("esim.devicesHeading")}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {COMPATIBLE_DEVICES.map((d) => (
              <div key={d.title} className="site-panel p-7">
                <p className="site-eyebrow mb-3">{d.title}</p>
                <p className="text-base leading-relaxed">{t(d.bodyKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </VerticalPage>
  );
}
