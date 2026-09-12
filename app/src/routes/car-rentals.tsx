import { Gem, Mountain, Users, Sun, BatteryCharging } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { VerticalPage } from "@/components/site/VerticalPage";
import { CategoryGridSection } from "@/components/site/CategoryGrid";
import { DestinationPicksSection } from "@/components/site/DestinationPicks";
import { TravelGuidesSection } from "@/components/site/TravelGuides";
import { AffiliateWidget } from "@/components/site/AffiliateWidget";
import { carRentalLink } from "@/lib/affiliate";

// Full live results widget (pre-filled search, real listings) -- the
// primary "book now" moment near the bottom of the page. This template
// doesn't expose color params, so it keeps its own default styling.
const CAR_WIDGET_RESULTS_SRC =
  "https://tpscr.com/content?trs=519959&shmarker=720297&locale=en&country=12&city=53741&powered_by=true&campaign_id=87&promo_id=2466";
// A second full search FORM widget was also available (tp.media
// campaign_id=222, red-themed) but it's the same job as the results
// widget above -- two full search widgets back to back is redundant, so
// this styled form replaces it instead of stacking a third variant.
// Recolored to the site's own tokens (white panel, --sky-coral gold
// button, --sky-ink text) rather than its default yellow/green.
const CAR_WIDGET_FORM_SRC =
  "https://tpscr.com/content?trs=519959&shmarker=720297&locale=en&powered_by=true&border_radius=12&plain=true&show_logo=false&color_background=%23ffffff&color_button=%23c9a227&color_text=%231c1a14&color_input_text=%231c1a14&color_button_text=%231c1400&promo_id=4480&campaign_id=10";
// Compact deals banner (brand logos + one search button) -- light enough
// to sit early on the page as a quick-glance teaser, well before the
// heavier search widgets further down. This template's button color is
// fixed (doesn't respond to color_button), so it keeps its own orange.
const CAR_WIDGET_BANNER_SRC =
  "https://tpscr.com/content?trs=519959&shmarker=720297&locale=en&width=100&height=100&powered_by=true&campaign_id=10&promo_id=2082";

import { useT, type TKey } from "@/lib/i18n-strings";

const ROAD_TRIPS: { name: string; slug: string; detailKey: TKey }[] = [
  { name: "Great Ocean Road", slug: "road-great-ocean", detailKey: "cars.road1Detail" },
  { name: "Iceland Ring Road", slug: "road-iceland", detailKey: "cars.road2Detail" },
  { name: "Pacific Coast Highway", slug: "road-pch", detailKey: "cars.road3Detail" },
  { name: "Route 66", slug: "road-route66", detailKey: "cars.road4Detail" },
];

export const Route = createFileRoute("/car-rentals")({
  head: () => ({
    meta: [
      { title: "Car Rentals | Skynova Agency" },
      { name: "description", content: "Economy to executive SUVs, picked up at arrivals and dropped off anywhere on the route." },
    ],
  }),
  component: CarRentalsPage,
});

function CarRentalsPage() {
  const t = useT();
  return (
    <VerticalPage
      eyebrow={t("service.carRentals")}
      title={t("cars.title")}
      description={t("home.carsCopy")}
      heroVideo={{ videoSrc: "/assets/hero/car-rentals-hero.mp4" }}
      heroAlt={t("home.carsAlt")}
      ctaHref={carRentalLink()}
      ctaLabel={t("home.reserveCar")}
      bullets={[
        { title: t("cars.b1Title"), body: t("cars.b1Body") },
        { title: t("cars.b2Title"), body: t("cars.b2Body") },
        { title: t("cars.b3Title"), body: t("cars.b3Body") },
      ]}
      destinationSlugs={["namibia", "new-zealand", "united-states", "australia"]}
      faqHeading={t("cars.faqHeading")}
      faqs={[
        { q: t("cars.q1"), a: t("cars.a1") },
        { q: t("cars.q2"), a: t("cars.a2") },
        { q: t("cars.q3"), a: t("cars.a3") },
        { q: t("cars.q4"), a: t("cars.a4") },
      ]}
      afterDestinations={
        <TravelGuidesSection
          eyebrow={t("cars.guidesEyebrow")}
          heading={t("cars.guidesHeading")}
          slugs={["rental-car-damage-waiver", "driving-on-the-other-side", "one-way-rental-fees"]}
        />
      }
    >
      <section className="site-section pt-0 pb-0">
        <div className="site-container">
          <div className="site-panel affiliate-widget-frame">
            <AffiliateWidget src={CAR_WIDGET_BANNER_SRC} />
          </div>
        </div>
      </section>
      <CategoryGridSection
        eyebrow={t("cars.b1Title")}
        heading={t("cars.categoryHeading")}
        href={carRentalLink()}
        variant="photo"
        categories={[
          { icon: Gem, title: t("cars.cat1Title"), detail: t("cars.cat1Detail"), imageSrc: "/assets/cars/car-luxury.webp" },
          { icon: Mountain, title: t("cars.cat2Title"), detail: t("cars.cat2Detail"), imageSrc: "/assets/cars/car-suv.webp" },
          { icon: Users, title: t("cars.cat3Title"), detail: t("cars.cat3Detail"), imageSrc: "/assets/cars/car-family.webp" },
          { icon: Sun, title: t("cars.cat4Title"), detail: t("cars.cat4Detail"), imageSrc: "/assets/cars/car-convertible.webp" },
          { icon: BatteryCharging, title: t("cars.cat5Title"), detail: t("cars.cat5Detail"), imageSrc: "/assets/cars/car-ev.webp" },
        ]}
      />
      <DestinationPicksSection
        eyebrow={t("cars.roadEyebrow")}
        heading={t("cars.roadHeading")}
        items={ROAD_TRIPS.map((r) => ({ name: r.name, slug: r.slug, detail: t(r.detailKey) }))}
        href={carRentalLink()}
        altSuffix="road"
      />
      <section className="site-section pt-0">
        <div className="site-container">
          <p className="site-eyebrow mb-3">{t("cars.popularNow")}</p>
          <h2 className="site-h2 max-w-md text-3xl md:text-4xl">{t("cars.popularHeading")}</h2>
          <div className="site-panel affiliate-widget-frame mt-8">
            <AffiliateWidget src={CAR_WIDGET_RESULTS_SRC} />
          </div>
          <div className="site-panel affiliate-widget-frame mt-6">
            <AffiliateWidget src={CAR_WIDGET_FORM_SRC} />
          </div>
        </div>
      </section>
    </VerticalPage>
  );
}
