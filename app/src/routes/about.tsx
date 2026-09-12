import { createFileRoute } from "@tanstack/react-router";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Newsletter } from "@/components/site/Newsletter";
import { DESTINATIONS, REGION_ORDER } from "@/data/destinations";
import { COLLECTIONS } from "@/data/collections";
import { POSTS } from "@/data/blog-posts";
import { ARTICLE_SLUGS } from "@/data/blog-articles";
import { useT, type TKey } from "@/lib/i18n-strings";

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

const COVERED: TKey[] = [
  "service.flights",
  "service.hotels",
  "service.carRentals",
  "service.airportServices",
  "service.events",
  "service.esim",
  "service.tours",
  "service.bikeRentals",
];

function AboutPage() {
  const t = useT();
  return (
    <>
      <Nav />
      <main>
        <section className="site-section">
          <div className="site-container">
            <p className="site-eyebrow mb-3">{t("about.eyebrow")}</p>
            <h1 className="site-h2 max-w-2xl text-4xl md:text-6xl">{t("about.heading")}</h1>
            <p className="site-ink-muted mt-5 max-w-xl text-base leading-relaxed">
              {t("about.intro")}
            </p>
          </div>
        </section>

        <section className="site-section pt-0">
          <div className="site-container grid gap-8 md:grid-cols-2">
            <div className="site-panel p-7">
              <p className="site-eyebrow mb-3">{t("about.howItWorks")}</p>
              <p className="text-base leading-relaxed">
                {t("about.howCopy")}
              </p>
            </div>
            <div className="site-panel p-7">
              <p className="site-eyebrow mb-3">{t("about.howPaid")}</p>
              <p className="text-base leading-relaxed">
                {t("about.paidCopy")}
              </p>
            </div>
          </div>
        </section>

        <section className="site-section pt-0">
          <div className="site-container">
            <p className="site-eyebrow mb-5">{t("about.whereToday")}</p>
            <div className="about-stats">
              <div className="about-stat">
                <p className="about-stat-num">{DESTINATION_COUNT}</p>
                <p className="about-stat-label">{t("about.statGuides")}</p>
              </div>
              <div className="about-stat">
                <p className="about-stat-num">{REGION_COUNT}</p>
                <p className="about-stat-label">{t("about.statRegions")}</p>
              </div>
              <div className="about-stat">
                <p className="about-stat-num">{COLLECTIONS.length}</p>
                <p className="about-stat-label">{t("about.statCollections")}</p>
              </div>
              <div className="about-stat">
                <p className="about-stat-num">{GUIDE_COUNT}</p>
                <p className="about-stat-label">{t("about.statArticles")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="site-section pt-0">
          <div className="site-container grid gap-8 md:grid-cols-2">
            <div className="site-panel p-7">
              <p className="site-eyebrow mb-3">{t("about.whatNot")}</p>
              <p className="text-base leading-relaxed">
                {t("about.whatNotCopy")}
              </p>
            </div>
            <div className="site-panel p-7">
              <p className="site-eyebrow mb-3">{t("about.whyGuides")}</p>
              <p className="text-base leading-relaxed">
                {t("about.whyGuidesCopy")}
              </p>
            </div>
          </div>
        </section>

        <section className="site-section pt-0">
          <div className="site-container">
            <p className="site-eyebrow mb-5">{t("about.whatsCovered")}</p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {COVERED.map((key) => (
                <div key={key} className="dest-mini-card">
                  <p className="font-semibold">{t(key)}</p>
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
