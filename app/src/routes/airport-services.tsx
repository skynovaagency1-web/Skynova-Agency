import { Star, Users, Zap, Armchair, Car, Luggage, Briefcase, Heart } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { VerticalPage } from "@/components/site/VerticalPage";
import { CategoryGridSection } from "@/components/site/CategoryGrid";
import { DestinationPicksSection } from "@/components/site/DestinationPicks";
import { airportServicesLink } from "@/lib/affiliate";

import { useT, type TKey } from "@/lib/i18n-strings";

const POPULAR_AIRPORTS: { name: string; slug: string; detailKey: TKey }[] = [
  { name: "Singapore Changi", slug: "airport-singapore", detailKey: "airport.changiDetail" },
  { name: "Dubai International", slug: "airport-dubai", detailKey: "airport.dubaiDetail" },
  { name: "London Heathrow", slug: "airport-heathrow", detailKey: "airport.heathrowDetail" },
  { name: "Doha Hamad", slug: "airport-doha", detailKey: "airport.dohaDetail" },
];

export const Route = createFileRoute("/airport-services")({
  head: () => ({
    meta: [
      { title: "Airport Services | Skynova Agency" },
      { name: "description", content: "Private transfers, shared shuttles, lounge access and baggage help, booked before you land." },
    ],
  }),
  component: AirportServicesPage,
});

function AirportServicesPage() {
  const t = useT();
  return (
    <VerticalPage
      eyebrow={t("service.airportServices")}
      title={t("airport.title")}
      description={t("home.airportCopy")}
      heroVideo={{ videoSrc: "/assets/hero/airport-hero.mp4" }}
      heroAlt={t("home.airportAlt")}
      ctaHref={airportServicesLink()}
      ctaLabel={t("home.addAirportHelp")}
      bullets={[
        { title: t("airport.b1Title"), body: t("airport.b1Body") },
        { title: t("airport.b2Title"), body: t("airport.b2Body") },
        { title: t("airport.b3Title"), body: t("airport.b3Body") },
      ]}
      destinationSlugs={["qatar", "united-states", "egypt", "south-korea"]}
      faqHeading={t("airport.faqHeading")}
      faqs={[
        { q: t("airport.q1"), a: t("airport.a1") },
        { q: t("airport.q2"), a: t("airport.a2") },
        { q: t("airport.q3"), a: t("airport.a3") },
        { q: t("airport.q4"), a: t("airport.a4") },
      ]}
    >
      <CategoryGridSection
        eyebrow={t("airport.categoryEyebrow")}
        heading={t("airport.categoryHeading")}
        href={airportServicesLink()}
        categories={[
          { icon: Star, title: t("airport.cat1Title"), detail: t("airport.cat1Detail") },
          { icon: Users, title: t("airport.cat2Title"), detail: t("airport.cat2Detail") },
          { icon: Zap, title: t("airport.cat3Title"), detail: t("airport.cat3Detail") },
          { icon: Armchair, title: t("airport.cat4Title"), detail: t("airport.cat4Detail") },
          { icon: Car, title: t("airport.cat5Title"), detail: t("airport.cat5Detail") },
          { icon: Luggage, title: t("airport.cat6Title"), detail: t("airport.cat6Detail") },
        ]}
      />
      <DestinationPicksSection
        eyebrow={t("airport.picksEyebrow")}
        heading={t("airport.picksHeading")}
        items={POPULAR_AIRPORTS.map((a) => ({ name: a.name, slug: a.slug, detail: t(a.detailKey) }))}
        href={airportServicesLink()}
        altSuffix="terminal"
      />
      <CategoryGridSection
        eyebrow={t("airport.styleEyebrow")}
        heading={t("airport.styleHeading")}
        href={airportServicesLink()}
        columns={2}
        categories={[
          { icon: Briefcase, title: t("airport.businessTitle"), detail: t("airport.businessDetail") },
          { icon: Heart, title: t("airport.familyTitle"), detail: t("airport.familyDetail") },
        ]}
      />
    </VerticalPage>
  );
}
