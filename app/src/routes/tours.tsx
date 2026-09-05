import { Mountain, Landmark, UtensilsCrossed, Users, Heart, Sparkles } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { VerticalPage } from "@/components/site/VerticalPage";
import { CategoryGridSection } from "@/components/site/CategoryGrid";
import { AffiliateWidget } from "@/components/site/AffiliateWidget";
import { toursLink } from "@/lib/affiliate";

const TOUR_WIDGET_SRC =
  "https://tpscr.com/content?currency=USD&trs=519959&shmarker=720297&locale=en&city_id=107&category=2&amount=3&powered_by=true&campaign_id=137&promo_id=4497";

export const Route = createFileRoute("/tours")({
  head: () => ({
    meta: [
      { title: "Tours & Activities | Skynova Agency" },
      { name: "description", content: "Skip-the-line tours, day trips and local guides, bookable the moment you land." },
    ],
  }),
  component: () => (
    <VerticalPage
      eyebrow="Tours & activities"
      title="Go see it, not just land there."
      description="Skip-the-line tours, day trips and local guides, bookable the moment you land."
      heroImage="/assets/sections/tours-landmarks.webp"
      heroAlt="Aerial view of a coastline landmark"
      ctaHref={toursLink()}
      ctaLabel="Explore tours"
      bullets={[
        { title: "Local guides", body: "Small-group and private tours led by people who live there." },
        { title: "Day trips", body: "Out-of-town routes bookable the night before." },
        { title: "Skip-the-line access", body: "Landmark tickets bundled with a guided walkthrough." },
      ]}
      destinationSlugs={["peru", "jordan", "namibia", "fiji"]}
      faqHeading="Tour questions, answered."
      faqs={[
        {
          q: "Can I cancel a tour booking?",
          a: "Most experiences offer free cancellation up to 24 hours before -- terms are shown before you pay.",
        },
        {
          q: "Are tours private or group?",
          a: "Both are usually available -- you can filter by private, small-group, or larger group tours.",
        },
        {
          q: "Do I need to book in advance?",
          a: "Popular experiences and skip-the-line tickets sell out, so booking a day or two ahead is safer.",
        },
        {
          q: "What languages are tours available in?",
          a: "This varies by city and guide -- available languages are listed on each experience before you book.",
        },
      ]}
    >
      <CategoryGridSection
        eyebrow="Ways to experience it"
        heading="Not just a landmark -- a way in."
        href={toursLink()}
        categories={[
          { icon: Mountain, title: "Adventure", detail: "Hikes, dives, and routes that get the heart rate up." },
          { icon: Landmark, title: "Culture", detail: "Museums, heritage sites, and guided history walks." },
          { icon: UtensilsCrossed, title: "Food", detail: "Markets, tastings, and meals with someone who knows the city." },
          { icon: Users, title: "Family", detail: "Paced for kids, without skipping the good parts." },
          { icon: Heart, title: "Romantic", detail: "Quieter experiences built for two." },
          { icon: Sparkles, title: "Luxury", detail: "Private guides and after-hours access." },
        ]}
      />
      <section className="site-section pt-0">
        <div className="site-container">
          <p className="site-eyebrow mb-3">Popular right now</p>
          <h2 className="site-h2 max-w-md text-3xl md:text-4xl">Tours worth booking today.</h2>
          <div className="site-panel affiliate-widget-frame mt-8">
            <AffiliateWidget src={TOUR_WIDGET_SRC} />
          </div>
        </div>
      </section>
    </VerticalPage>
  ),
});
