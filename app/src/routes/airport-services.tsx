import { Star, Users, Zap, Armchair, Car, Luggage, Briefcase, Heart } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { VerticalPage } from "@/components/site/VerticalPage";
import { CategoryGridSection } from "@/components/site/CategoryGrid";
import { DestinationPicksSection } from "@/components/site/DestinationPicks";
import { airportServicesLink } from "@/lib/affiliate";

const POPULAR_AIRPORTS = [
  { name: "Singapore Changi", slug: "airport-singapore", detail: "A waterfall and gardens between your gates, not just seats." },
  { name: "Dubai International", slug: "airport-dubai", detail: "One of the world's busiest hubs, built to move fast anyway." },
  { name: "London Heathrow", slug: "airport-heathrow", detail: "Six terminals -- transfer help matters more here than most." },
  { name: "Doha Hamad", slug: "airport-doha", detail: "Consistently rated among the best layovers in the world." },
];

export const Route = createFileRoute("/airport-services")({
  head: () => ({
    meta: [
      { title: "Airport Services | Skynova Agency" },
      { name: "description", content: "Private transfers, shared shuttles, lounge access and baggage help, booked before you land." },
    ],
  }),
  component: () => (
    <VerticalPage
      eyebrow="Airport services"
      title="Arrive relaxed. Leave effortlessly."
      description="Private transfers, shared shuttles, lounge access and baggage help, booked before you land."
      heroVideo={{ videoSrc: "/assets/hero/airport-hero.mp4" }}
      heroAlt="Airport lounge seating with departure boards"
      ctaHref={airportServicesLink()}
      ctaLabel="Add airport help"
      bullets={[
        { title: "Private and shared transfers", body: "Pre-booked rides from the terminal to your first stop." },
        { title: "Lounge access", body: "A quieter place to wait, at airports that offer it." },
        { title: "Baggage help", body: "Storage and porter service where it is available." },
      ]}
      destinationSlugs={["qatar", "united-states", "egypt", "south-korea"]}
      faqHeading="Airport service questions, answered."
      faqs={[
        {
          q: "How far in advance should I book a transfer?",
          a: "24 hours ahead is usually enough, though busier airports and peak season fill up faster.",
        },
        {
          q: "Is lounge access available at every airport?",
          a: "Coverage varies by airport -- availability is shown before you book so there are no surprises at the gate.",
        },
        {
          q: "Can I book just a fast-track pass on its own?",
          a: "Yes -- fast track, lounge access, and transfers can each be booked separately or together.",
        },
        {
          q: "Do you offer group transfers?",
          a: "Larger vehicles for groups and families are available where the partner network covers that airport.",
        },
      ]}
    >
      <CategoryGridSection
        eyebrow="Airport help"
        heading="Every part of the terminal, sorted."
        href={airportServicesLink()}
        categories={[
          { icon: Star, title: "VIP services", detail: "A dedicated escort from curb to gate, where offered." },
          { icon: Users, title: "Meet & greet", detail: "Someone waiting with your name at arrivals." },
          { icon: Zap, title: "Fast track", detail: "Skip the security and passport queues." },
          { icon: Armchair, title: "Airport lounges", detail: "A quieter place to wait between flights." },
          { icon: Car, title: "Airport transfers", detail: "Private or shared rides booked before you land." },
          { icon: Luggage, title: "Porter services", detail: "Help with bags where the terminal offers it." },
        ]}
      />
      <DestinationPicksSection
        eyebrow="Popular airports"
        heading="Where the help matters most."
        items={POPULAR_AIRPORTS}
        href={airportServicesLink()}
        altSuffix="terminal"
      />
      <CategoryGridSection
        eyebrow="Built for how you travel"
        heading="Business trip or family trip, sorted differently."
        href={airportServicesLink()}
        columns={2}
        categories={[
          { icon: Briefcase, title: "Business traveler benefits", detail: "Fast track and lounge access booked around a tight connection, not a leisurely one." },
          { icon: Heart, title: "Family traveler benefits", detail: "Group transfers and porter help so nobody's carrying three bags through security alone." },
        ]}
      />
    </VerticalPage>
  ),
});
