import { Building2, BatteryCharging, Mountain, Waves, Compass } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { VerticalPage } from "@/components/site/VerticalPage";
import { CategoryGridSection } from "@/components/site/CategoryGrid";
import { DestinationPicksSection } from "@/components/site/DestinationPicks";
import { TravelGuidesSection } from "@/components/site/TravelGuides";
import { bikeRentalLink } from "@/lib/affiliate";

import { useT, type TKey } from "@/lib/i18n-strings";

const CYCLING_DESTINATIONS: { name: string; slug: string; detailKey: TKey }[] = [
  { name: "Switzerland", slug: "switzerland-cycling", detailKey: "bikes.pick1Detail" },
  { name: "Italy", slug: "italy", detailKey: "bikes.pick2Detail" },
  { name: "Vietnam", slug: "vietnam", detailKey: "bikes.pick3Detail" },
  { name: "New Zealand", slug: "new-zealand", detailKey: "bikes.pick4Detail" },
];

/* BIKESBOOKING IS NOT WIRED HERE, AND bikeRentalLink() STILL EARNS NOTHING.
 *
 * The widget for campaign_id=57 (promo_id=5472) was built and measured on
 * 17 Sep 2026 and then pulled, because what it renders is not shippable:
 *
 *   - its own copy reads "Choose and rent the perfect mode of transportation
 *     on undefined" -- a literal undefined where a location should be;
 *   - it is a generic "transportation rentals" banner illustrated with a CAR,
 *     on the bike-rentals page;
 *   - it fetches http://avsplow.com/a/j over plain HTTP from an HTTPS page,
 *     which every browser blocks as mixed content regardless of our CSP.
 *
 * Two findings worth keeping. It only mounts with async=false on the script
 * tag (it locates itself via document.currentScript); left async it loads,
 * throws nothing, logs nothing and renders nothing. And AffiliateWidget now
 * takes that as a prop.
 *
 * What this page actually needs is a BikesBooking TRACKING LINK, not a
 * widget: bikeRentalLink() below points at a GetYourGuide free-text search
 * carrying partner_id=720297, which is a Travelpayouts marker in
 * GetYourGuide's own id field and is not attributed to anyone.
 */

export const Route = createFileRoute("/bike-rentals")({
  head: () => ({
    meta: [
      { title: "Bike Rentals | Skynova Agency" },
      { name: "description", content: "City bikes, e-bikes and mountain bikes, plus guided rides in the cities you're already visiting." },
    ],
  }),
  component: BikeRentalsPage,
});

function BikeRentalsPage() {
  const t = useT();
  return (
    <VerticalPage
      eyebrow={t("service.bikeRentals")}
      title={t("bikes.title")}
      description={t("bikes.description")}
      heroImage="/assets/sections/bike-rentals.webp"
      heroAlt={t("bikes.heroAlt")}
      ctaHref={bikeRentalLink()}
      ctaLabel={t("bikes.cta")}
      bullets={[
        { title: t("bikes.b1Title"), body: t("bikes.b1Body") },
        { title: t("bikes.b2Title"), body: t("bikes.b2Body") },
        { title: t("bikes.b3Title"), body: t("bikes.b3Body") },
      ]}
      destinationSlugs={["switzerland", "vietnam", "new-zealand", "italy"]}
      faqHeading={t("bikes.faqHeading")}
      faqs={[
        { q: t("bikes.q1"), a: t("bikes.a1") },
        { q: t("bikes.q2"), a: t("bikes.a2") },
        { q: t("bikes.q3"), a: t("bikes.a3") },
        { q: t("bikes.q4"), a: t("bikes.a4") },
      ]}
    >
      <CategoryGridSection
        eyebrow={t("bikes.b1Title")}
        heading={t("bikes.categoryHeading")}
        href={bikeRentalLink()}
        variant="photo"
        categories={[
          { icon: Building2, title: t("bikes.cat1Title"), detail: t("bikes.cat1Detail"), imageSrc: "/assets/bikes/bike-city.webp" },
          { icon: BatteryCharging, title: t("bikes.cat2Title"), detail: t("bikes.cat2Detail"), imageSrc: "/assets/bikes/bike-ebike.webp" },
          { icon: Mountain, title: t("bikes.cat3Title"), detail: t("bikes.cat3Detail"), imageSrc: "/assets/bikes/bike-mtb.webp" },
          { icon: Waves, title: t("bikes.cat4Title"), detail: t("bikes.cat4Detail"), imageSrc: "/assets/bikes/bike-coastal.webp" },
          { icon: Compass, title: t("bikes.cat5Title"), detail: t("bikes.cat5Detail"), imageSrc: "/assets/bikes/bike-guided.webp" },
        ]}
      />
      <DestinationPicksSection
        eyebrow={t("bikes.picksEyebrow")}
        heading={t("bikes.picksHeading")}
        items={CYCLING_DESTINATIONS.map((d) => ({ name: d.name, slug: d.slug, detail: t(d.detailKey) }))}
        href={bikeRentalLink()}
        altSuffix="cycling route"
      />
      <TravelGuidesSection
        eyebrow={t("bikes.guidesEyebrow")}
        heading={t("bikes.guidesHeading")}
        slugs={["ebike-vs-regular-bike-rental", "cycling-city-rules-abroad"]}
      />
    </VerticalPage>
  );
}
