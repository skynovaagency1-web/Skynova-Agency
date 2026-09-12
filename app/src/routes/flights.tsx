import { Briefcase, Crown, Plane } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { VerticalPage } from "@/components/site/VerticalPage";
import { FlightRoutesSection } from "@/components/site/FlightRoutes";
import { CategoryGridSection } from "@/components/site/CategoryGrid";
import { WeekendInspirationSection } from "@/components/site/WeekendInspiration";
import { FlightGuidesSection } from "@/components/site/FlightGuides";
import { flightsLink } from "@/lib/affiliate";
import { useT } from "@/lib/i18n-strings";

export const Route = createFileRoute("/flights")({
  head: () => ({
    meta: [
      { title: "Flights | Skynova Agency" },
      { name: "description", content: "Compare fares across airlines and lock in a flight before prices move." },
    ],
  }),
  component: FlightsPage,
});

/**
 * A named component rather than an inline arrow, so it can read the
 * dictionary: hooks need a component body. Same for the other verticals.
 */
function FlightsPage() {
  const t = useT();
  return (
    <VerticalPage
      eyebrow={t("service.flights")}
      title={t("home.flightsHeading")}
      description={t("home.flightsCopy")}
      heroVideo={{ videoSrc: "/assets/hero/flight-resort.mp4" }}
      heroAlt={t("flights.heroAlt")}
      ctaHref={flightsLink()}
      ctaLabel={t("home.compareFlights")}
      bullets={[
        { title: t("flights.b1Title"), body: t("flights.b1Body") },
        { title: t("flights.b2Title"), body: t("flights.b2Body") },
        { title: t("flights.b3Title"), body: t("flights.b3Body") },
      ]}
      destinationSlugs={["portugal", "italy", "vietnam", "new-zealand"]}
      faqHeading={t("flights.faqHeading")}
      faqs={[
        { q: t("flights.q1"), a: t("flights.a1") },
        { q: t("flights.q2"), a: t("flights.a2") },
        { q: t("flights.q3"), a: t("flights.a3") },
        { q: t("flights.q4"), a: t("flights.a4") },
      ]}
      afterDestinations={<FlightGuidesSection />}
    >
      <FlightRoutesSection href={flightsLink()} />
      <CategoryGridSection
        eyebrow={t("flights.categoryEyebrow")}
        heading={t("flights.categoryHeading")}
        href={flightsLink()}
        categories={[
          { icon: Briefcase, title: t("flights.cat1Title"), detail: t("flights.cat1Detail") },
          { icon: Crown, title: t("flights.cat2Title"), detail: t("flights.cat2Detail") },
          { icon: Plane, title: t("flights.cat3Title"), detail: t("flights.cat3Detail") },
        ]}
      />
      <WeekendInspirationSection href={flightsLink()} />
    </VerticalPage>
  );
}
