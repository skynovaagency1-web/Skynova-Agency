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

const ROAD_TRIPS = [
  { name: "Great Ocean Road", slug: "road-great-ocean", detail: "Victoria's coastline, the Twelve Apostles included." },
  { name: "Iceland Ring Road", slug: "road-iceland", detail: "A full loop of the island, glaciers and all." },
  { name: "Pacific Coast Highway", slug: "road-pch", detail: "Big Sur's cliffs, bridges, and turnouts built for stopping." },
  { name: "Route 66", slug: "road-route66", detail: "The original American road trip, still driveable end to end." },
];

export const Route = createFileRoute("/car-rentals")({
  head: () => ({
    meta: [
      { title: "Car Rentals | Skynova Agency" },
      { name: "description", content: "Economy to executive SUVs, picked up at arrivals and dropped off anywhere on the route." },
    ],
  }),
  component: () => (
    <VerticalPage
      eyebrow="Car rentals"
      title="Drive your journey."
      description="Economy to executive SUVs, picked up at arrivals and dropped off anywhere on the route."
      heroVideo={{ videoSrc: "/assets/hero/car-rentals-hero.mp4" }}
      heroAlt="Luxury car parked along a coastal road"
      ctaHref={carRentalLink()}
      ctaLabel="Reserve a car"
      bullets={[
        { title: "Every class of car", body: "Economy through executive SUV, from the major rental networks." },
        { title: "Flexible pickup and drop-off", body: "Collect at arrivals, return it anywhere else on the route." },
        { title: "Transparent pricing", body: "The rate shown is the rental company's own price at checkout." },
      ]}
      destinationSlugs={["namibia", "new-zealand", "united-states", "australia"]}
      faqHeading="Car rental questions, answered."
      faqs={[
        {
          q: "Do I need an international driving license?",
          a: "It depends on the country -- Rentalcars' own listing for each car states what's accepted at pickup.",
        },
        {
          q: "Is insurance included in the price?",
          a: "Basic cover is usually included; excess and upgrade options are shown before you confirm the booking.",
        },
        {
          q: "Can I pick up in one city and drop off in another?",
          a: "Many rental partners allow one-way rentals -- availability and any one-way fee are shown at checkout.",
        },
        {
          q: "What's the minimum age to rent?",
          a: "This varies by country and car class -- it's listed on each rental company's own terms before you book.",
        },
      ]}
      afterDestinations={
        <TravelGuidesSection
          eyebrow="Destination driving guides"
          heading="Know before you drive off."
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
        eyebrow="Every class of car"
        heading="From city runabouts to the open road."
        href={carRentalLink()}
        variant="photo"
        categories={[
          { icon: Gem, title: "Luxury cars", detail: "Executive sedans and premium marques.", imageSrc: "/assets/cars/car-luxury.webp" },
          { icon: Mountain, title: "SUVs", detail: "Ground clearance for coastal roads and mountain passes.", imageSrc: "/assets/cars/car-suv.webp" },
          { icon: Users, title: "Family vehicles", detail: "Room for the whole group and the luggage.", imageSrc: "/assets/cars/car-family.webp" },
          { icon: Sun, title: "Convertibles", detail: "Top down for coastal drives and warm-weather routes.", imageSrc: "/assets/cars/car-convertible.webp" },
          { icon: BatteryCharging, title: "Electric vehicles", detail: "Charging-network coverage checked before you book.", imageSrc: "/assets/cars/car-ev.webp" },
        ]}
      />
      <DestinationPicksSection
        eyebrow="Popular road trips"
        heading="Routes worth renting for."
        items={ROAD_TRIPS}
        href={carRentalLink()}
        altSuffix="road"
      />
      <section className="site-section pt-0">
        <div className="site-container">
          <p className="site-eyebrow mb-3">Popular right now</p>
          <h2 className="site-h2 max-w-md text-3xl md:text-4xl">Cars worth booking today.</h2>
          <div className="site-panel affiliate-widget-frame mt-8">
            <AffiliateWidget src={CAR_WIDGET_RESULTS_SRC} />
          </div>
          <div className="site-panel affiliate-widget-frame mt-6">
            <AffiliateWidget src={CAR_WIDGET_FORM_SRC} />
          </div>
        </div>
      </section>
    </VerticalPage>
  ),
});
