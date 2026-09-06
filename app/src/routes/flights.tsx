import { Briefcase, Crown, Plane } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { VerticalPage } from "@/components/site/VerticalPage";
import { FlightRoutesSection } from "@/components/site/FlightRoutes";
import { CategoryGridSection } from "@/components/site/CategoryGrid";
import { WeekendInspirationSection } from "@/components/site/WeekendInspiration";
import { FlightGuidesSection } from "@/components/site/FlightGuides";
import { flightsLink } from "@/lib/affiliate";

export const Route = createFileRoute("/flights")({
  head: () => ({
    meta: [
      { title: "Flights | Skynova Agency" },
      { name: "description", content: "Compare fares across airlines and lock in a flight before prices move." },
    ],
  }),
  component: () => (
    <VerticalPage
      eyebrow="Flights"
      title="Real fares, compared in one search."
      description="Compare airlines on Aviasales-powered search and lock in a fare before prices move."
      heroVideo={{ videoSrc: "/assets/hero/flight-resort.mp4" }}
      heroAlt="Aerial view of an overwater resort with turquoise water"
      ctaHref={flightsLink()}
      ctaLabel="Compare flights"
      bullets={[
        { title: "Scheduled and low-cost, together", body: "One search compares scheduled airlines and low-cost carriers side by side." },
        { title: "No markup, no reordering", body: "Results come from Aviasales' own search. Skynova doesn't reorder them and adds nothing to the fare." },
        { title: "Book direct with the airline", body: "Checkout happens with the carrier; your ticket and confirmation come from them." },
      ]}
      destinationSlugs={["portugal", "italy", "vietnam", "new-zealand"]}
      faqHeading="Flight questions, answered."
      faqs={[
        {
          q: "Can I choose economy, business, or first class?",
          a: "Yes -- Aviasales' search lets you filter by cabin class before you compare fares.",
        },
        {
          q: "Do prices include checked baggage?",
          a: "That depends on the fare and airline -- baggage allowance is shown on the airline's own fare details before you pay.",
        },
        {
          q: "Can I change or cancel my flight?",
          a: "Change and cancellation policies are set by the airline you book with, not by Skynova -- check the fare rules at checkout.",
        },
        {
          q: "Is my ticket issued directly by the airline?",
          a: "Yes -- checkout happens on the airline's or a licensed agent's own site, and your ticket and confirmation come from them.",
        },
      ]}
      afterDestinations={<FlightGuidesSection />}
    >
      <FlightRoutesSection href={flightsLink()} />
      <CategoryGridSection
        eyebrow="Fly your way"
        heading="Business, first, and the airlines worth the upgrade."
        href={flightsLink()}
        categories={[
          { icon: Briefcase, title: "Business class", detail: "Lie-flat seats and lounge access on long-haul routes." },
          { icon: Crown, title: "First class", detail: "The airlines' top cabin, where the route still offers one." },
          { icon: Plane, title: "Luxury airlines", detail: "Carriers rated for service, not just for getting you there." },
        ]}
      />
      <WeekendInspirationSection href={flightsLink()} />
    </VerticalPage>
  ),
});
