import { Building2, BatteryCharging, Mountain, Waves, Compass } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { VerticalPage } from "@/components/site/VerticalPage";
import { CategoryGridSection } from "@/components/site/CategoryGrid";
import { DestinationPicksSection } from "@/components/site/DestinationPicks";
import { TravelGuidesSection } from "@/components/site/TravelGuides";
import { bikeRentalLink } from "@/lib/affiliate";

const CYCLING_DESTINATIONS = [
  { name: "Switzerland", slug: "switzerland-cycling", detail: "Lake paths and alpine passes for every fitness level." },
  { name: "Italy", slug: "italy", detail: "Tuscan backroads and coastal towns built for slow riding." },
  { name: "Vietnam", slug: "vietnam", detail: "Rice-paddy tracks and old-quarter streets, best seen at bike speed." },
  { name: "New Zealand", slug: "new-zealand", detail: "Purpose-built trails through some of the country's best scenery." },
];

export const Route = createFileRoute("/bike-rentals")({
  head: () => ({
    meta: [
      { title: "Bike Rentals | Skynova Agency" },
      { name: "description", content: "City bikes, e-bikes and mountain bikes, plus guided rides in the cities you're already visiting." },
    ],
  }),
  component: () => (
    <VerticalPage
      eyebrow="Bike rentals"
      title="See the destination differently."
      description="City bikes, e-bikes and mountain bikes, plus guided rides in the cities you're already visiting."
      heroImage="/assets/sections/bike-rentals.webp"
      heroAlt="A cyclist riding along a palm-lined promenade at sunset"
      ctaHref={bikeRentalLink()}
      ctaLabel="Find a bike"
      bullets={[
        { title: "Every kind of ride", body: "City cruisers through e-bikes and mountain bikes, from local shops." },
        { title: "Guided or self-guided", body: "Ride with a local, or pick up a bike and go on your own route." },
        { title: "Helmet and lock included", body: "Standard with most rentals -- confirmed before you book." },
      ]}
      destinationSlugs={["switzerland", "vietnam", "new-zealand", "italy"]}
      faqHeading="Bike rental questions, answered."
      faqs={[
        {
          q: "Is a helmet included with the rental?",
          a: "Most listings include one -- it's shown on the rental's own details before you book.",
        },
        {
          q: "Can I rent for more than one day?",
          a: "Yes -- multi-day and weekly rates are usually cheaper per day than booking single days back to back.",
        },
        {
          q: "What's the difference between a guided ride and a rental?",
          a: "A rental is just the bike, on your own route. A guided ride includes a local leading a planned route.",
        },
        {
          q: "How far can an e-bike go on one charge?",
          a: "This varies by model and terrain -- estimated range is listed on each e-bike's own rental page.",
        },
      ]}
    >
      <CategoryGridSection
        eyebrow="Every kind of ride"
        heading="Pick the bike for the route."
        href={bikeRentalLink()}
        variant="photo"
        categories={[
          { icon: Building2, title: "City cycling", detail: "Cruisers and hybrids built for flat streets and short hops.", imageSrc: "/assets/bikes/bike-city.webp" },
          { icon: BatteryCharging, title: "E-bikes", detail: "Pedal assist for longer rides and hillier routes.", imageSrc: "/assets/bikes/bike-ebike.webp" },
          { icon: Mountain, title: "Mountain bikes", detail: "Trail-ready bikes for terrain a city bike can't handle.", imageSrc: "/assets/bikes/bike-mtb.webp" },
          { icon: Waves, title: "Coastal routes", detail: "Flat, scenic paths built for riding along the water.", imageSrc: "/assets/bikes/bike-coastal.webp" },
          { icon: Compass, title: "Guided tours", detail: "A local leading the route, so you don't have to plan it.", imageSrc: "/assets/bikes/bike-guided.webp" },
        ]}
      />
      <DestinationPicksSection
        eyebrow="Cycling destinations"
        heading="Places that reward two wheels."
        items={CYCLING_DESTINATIONS}
        href={bikeRentalLink()}
        altSuffix="cycling route"
      />
      <TravelGuidesSection
        eyebrow="Cycling guides"
        heading="Ride like you've done this before."
        slugs={["ebike-vs-regular-bike-rental", "cycling-city-rules-abroad"]}
      />
    </VerticalPage>
  ),
});
