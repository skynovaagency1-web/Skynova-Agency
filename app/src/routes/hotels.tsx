import { Gem, Palmtree, UtensilsCrossed } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { VerticalPage } from "@/components/site/VerticalPage";
import { HotelCollectionsSection } from "@/components/site/HotelCollections";
import { CategoryGridSection } from "@/components/site/CategoryGrid";
import { DestinationPicksSection } from "@/components/site/DestinationPicks";
import { TravelGuidesSection } from "@/components/site/TravelGuides";
import { hotelsLink } from "@/lib/affiliate";

const FEATURED_LUXURY = [
  { name: "Maldives", slug: "maldives", detail: "Overwater villas built around the reef, not just the view." },
  { name: "Dubai", slug: "dubai", detail: "Rooftop pools and a skyline that does the decorating for you." },
  { name: "Santorini", slug: "santorini", detail: "Caldera-view suites carved into the cliffside." },
  { name: "Seychelles", slug: "seychelles", detail: "Granite coves and beach villas with almost no one else around." },
];

const TRAVEL_INSPIRATION = [
  { name: "Paris", slug: "paris", detail: "A balcony, a view of the rooftops, and the Metro at your door." },
  { name: "Bali", slug: "bali", detail: "Rice-terrace retreats and villas built around their own pool." },
  { name: "Tokyo", slug: "tokyo", detail: "Compact, precise rooms in a city built for walking to them." },
  { name: "New York", slug: "new-york", detail: "A skyline view worth the extra floor." },
];

export const Route = createFileRoute("/hotels")({
  head: () => ({
    meta: [
      { title: "Hotels | Skynova Agency" },
      { name: "description", content: "Boutique stays to full resorts, filtered by neighborhood and rating." },
    ],
  }),
  component: () => (
    <VerticalPage
      eyebrow="Hotels"
      title="Stay somewhere unforgettable."
      description="From boutique stays to full resorts, filtered by neighborhood first and star rating second."
      heroVideo={{ videoSrc: "/assets/hero/hotel-lobby.mp4" }}
      heroAlt="A bellhop rolling a luggage cart through a grand hotel lobby"
      ctaHref={hotelsLink()}
      ctaLabel="Browse stays"
      bullets={[
        { title: "Boutique to full resort", body: "Filter by neighborhood, then by star rating and amenities." },
        { title: "Real-time availability", body: "Rates and rooms pulled live from the Hotellook network." },
        { title: "No booking fee from us", body: "The price shown at checkout is the property's own rate." },
      ]}
      destinationSlugs={["switzerland", "peru", "kenya", "jordan"]}
      faqHeading="Hotel questions, answered."
      faqs={[
        {
          q: "Is the price shown the final price?",
          a: "Yes -- it's the property's own rate from the Hotellook network. Skynova earns a commission, you don't pay extra for it.",
        },
        {
          q: "Can I cancel a hotel booking?",
          a: "Cancellation terms are set by the property and shown before you pay -- many listings offer free cancellation.",
        },
        {
          q: "Do you charge a booking fee?",
          a: "No -- Skynova doesn't add a fee on top of the rate you see at checkout.",
        },
        {
          q: "How do I contact the hotel directly?",
          a: "Your confirmation email includes the property's contact details once you've booked through the partner site.",
        },
      ]}
      afterDestinations={
        <TravelGuidesSection
          eyebrow="Latest travel guides"
          heading="Book a better stay."
          slugs={["hotel-room-upgrade-tips", "boutique-vs-resort", "free-cancellation-fine-print"]}
        />
      }
    >
      <DestinationPicksSection
        eyebrow="Featured luxury hotels"
        heading="The stays worth planning a trip around."
        items={FEATURED_LUXURY}
        href={hotelsLink()}
      />
      <CategoryGridSection
        eyebrow="Popular travel categories"
        heading="Every kind of stay, one search."
        href={hotelsLink()}
        categories={[
          { icon: Gem, title: "Boutique hotels", detail: "Small, independent properties with real neighborhood character." },
          { icon: Palmtree, title: "Full resorts", detail: "On-site pools, spas, and everything else you'd have to leave for otherwise." },
          { icon: UtensilsCrossed, title: "All-inclusive stays", detail: "Meals and drinks folded into the rate, no separate tab to track." },
        ]}
      />
      <HotelCollectionsSection href={hotelsLink()} />
      <DestinationPicksSection
        eyebrow="Travel inspiration"
        heading="Wherever the trip is going."
        items={TRAVEL_INSPIRATION}
        href={hotelsLink()}
      />
    </VerticalPage>
  ),
});
