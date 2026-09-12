import { Mountain, Landmark, UtensilsCrossed, Users, Heart, Sparkles } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { VerticalPage } from "@/components/site/VerticalPage";
import { CategoryGridSection } from "@/components/site/CategoryGrid";
import { AffiliateWidget } from "@/components/site/AffiliateWidget";
import { toursLink } from "@/lib/affiliate";

const TOUR_WIDGET_SRC =
  "https://tpscr.com/content?currency=USD&trs=519959&shmarker=720297&locale=en&city_id=107&category=2&amount=3&powered_by=true&campaign_id=137&promo_id=4497";

import { useT } from "@/lib/i18n-strings";

export const Route = createFileRoute("/tours")({
  head: () => ({
    meta: [
      { title: "Tours & Activities | Skynova Agency" },
      { name: "description", content: "Skip-the-line tours, day trips and local guides, bookable the moment you land." },
    ],
  }),
  component: ToursPage,
});

function ToursPage() {
  const t = useT();
  return (
    <VerticalPage
      eyebrow={t("service.tours")}
      title={t("home.toursHeading")}
      description={t("home.toursCopy")}
      heroImage="/assets/sections/tours-landmarks.webp"
      heroAlt={t("home.toursAlt2")}
      ctaHref={toursLink()}
      ctaLabel={t("home.exploreTours")}
      bullets={[
        { title: t("tours.b1Title"), body: t("tours.b1Body") },
        { title: t("tours.b2Title"), body: t("tours.b2Body") },
        { title: t("tours.b3Title"), body: t("tours.b3Body") },
      ]}
      destinationSlugs={["peru", "jordan", "namibia", "fiji"]}
      faqHeading={t("tours.faqHeading")}
      faqs={[
        { q: t("tours.q1"), a: t("tours.a1") },
        { q: t("tours.q2"), a: t("tours.a2") },
        { q: t("tours.q3"), a: t("tours.a3") },
        { q: t("tours.q4"), a: t("tours.a4") },
      ]}
    >
      {/* Photo cards, like every other vertical. Tours was the one page still
          showing icon panels here, so it was the only vertical whose "ways to
          experience it" section did not look like the rest of the site. The
          photographs are generic to the category rather than to a destination
          -- these six are Adventure, Culture, Food, Family, Romantic and
          Luxury, not six places. */}
      <CategoryGridSection
        eyebrow={t("tours.categoryEyebrow")}
        heading={t("tours.categoryHeading")}
        href={toursLink()}
        variant="photo"
        categories={[
          { icon: Mountain, title: t("tours.cat1Title"), detail: t("tours.cat1Detail"), imageSrc: "/assets/tours/tour-adventure.webp" },
          { icon: Landmark, title: t("tours.cat2Title"), detail: t("tours.cat2Detail"), imageSrc: "/assets/tours/tour-culture.webp" },
          { icon: UtensilsCrossed, title: t("tours.cat3Title"), detail: t("tours.cat3Detail"), imageSrc: "/assets/tours/tour-food.webp" },
          { icon: Users, title: t("tours.cat4Title"), detail: t("tours.cat4Detail"), imageSrc: "/assets/tours/tour-family.webp" },
          { icon: Heart, title: t("tours.cat5Title"), detail: t("tours.cat5Detail"), imageSrc: "/assets/tours/tour-romantic.webp" },
          { icon: Sparkles, title: t("tours.cat6Title"), detail: t("tours.cat6Detail"), imageSrc: "/assets/tours/tour-luxury.webp" },
        ]}
      />
      <section className="site-section pt-0">
        <div className="site-container">
          <p className="site-eyebrow mb-3">{t("cars.popularNow")}</p>
          <h2 className="site-h2 max-w-md text-3xl md:text-4xl">{t("tours.popularHeading")}</h2>
          <div className="site-panel affiliate-widget-frame mt-8">
            <AffiliateWidget src={TOUR_WIDGET_SRC} />
          </div>
        </div>
      </section>
    </VerticalPage>
  );
}
