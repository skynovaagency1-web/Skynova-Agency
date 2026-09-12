import { Gem, Palmtree, UtensilsCrossed } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { VerticalPage } from "@/components/site/VerticalPage";
import { HotelHeroCards } from "@/components/site/HotelHeroCards";
import { HotelCollectionsSection } from "@/components/site/HotelCollections";
import { CategoryGridSection } from "@/components/site/CategoryGrid";
import { DestinationPicksSection } from "@/components/site/DestinationPicks";
import { TravelGuidesSection } from "@/components/site/TravelGuides";
import { hotelsLink } from "@/lib/affiliate";

import { useT, type TKey } from "@/lib/i18n-strings";

/** Place names stay as they are -- they are proper nouns, not copy. Only the
 *  line under each one is translated. */
const FEATURED_LUXURY: { name: string; slug: string; detailKey: TKey }[] = [
  { name: "Maldives", slug: "maldives", detailKey: "hotels.maldivesDetail" },
  { name: "Dubai", slug: "dubai", detailKey: "hotels.dubaiDetail" },
  { name: "Santorini", slug: "santorini", detailKey: "hotels.santoriniDetail" },
  { name: "Seychelles", slug: "seychelles", detailKey: "hotels.seychellesDetail" },
];

const TRAVEL_INSPIRATION: { name: string; slug: string; detailKey: TKey }[] = [
  { name: "Paris", slug: "paris", detailKey: "hotels.parisDetail" },
  { name: "Bali", slug: "bali", detailKey: "hotels.baliDetail" },
  { name: "Tokyo", slug: "tokyo", detailKey: "hotels.tokyoDetail" },
  { name: "New York", slug: "new-york", detailKey: "hotels.newYorkDetail" },
];

export const Route = createFileRoute("/hotels")({
  head: () => ({
    meta: [
      { title: "Hotels | Skynova Agency" },
      { name: "description", content: "Boutique stays to full resorts, filtered by neighborhood and rating." },
    ],
  }),
  component: HotelsPage,
});

function HotelsPage() {
  const t = useT();
  const resolve = (items: { name: string; slug: string; detailKey: TKey }[]) =>
    items.map((i) => ({ name: i.name, slug: i.slug, detail: t(i.detailKey) }));

  return (
    <VerticalPage
      eyebrow={t("service.hotels")}
      title={t("hotels.title")}
      description={t("home.hotelsCopy")}
      heroVideo={{ videoSrc: "/assets/hero/hotel-lobby.mp4", posterSrc: "/assets/hero/hotel-lobby-poster.webp" }}
      heroReveal="keyhole"
      heroIntro={<HotelHeroCards />}
      heroAlt={t("hotels.heroAlt")}
      ctaHref={hotelsLink()}
      ctaLabel={t("home.browseStays")}
      bullets={[
        { title: t("hotels.b1Title"), body: t("hotels.b1Body") },
        { title: t("hotels.b2Title"), body: t("hotels.b2Body") },
        { title: t("hotels.b3Title"), body: t("hotels.b3Body") },
      ]}
      destinationSlugs={["switzerland", "peru", "kenya", "jordan"]}
      faqHeading={t("hotels.faqHeading")}
      faqs={[
        { q: t("hotels.q1"), a: t("hotels.a1") },
        { q: t("hotels.q2"), a: t("hotels.a2") },
        { q: t("hotels.q3"), a: t("hotels.a3") },
        { q: t("hotels.q4"), a: t("hotels.a4") },
      ]}
      afterDestinations={
        <TravelGuidesSection
          eyebrow={t("hotels.guidesEyebrow")}
          heading={t("hotels.guidesHeading")}
          slugs={["hotel-room-upgrade-tips", "boutique-vs-resort", "free-cancellation-fine-print"]}
        />
      }
    >
      <DestinationPicksSection
        eyebrow={t("hotels.luxuryEyebrow")}
        heading={t("hotels.luxuryHeading")}
        items={resolve(FEATURED_LUXURY)}
        href={hotelsLink()}
      />
      <CategoryGridSection
        eyebrow={t("hotels.categoryEyebrow")}
        heading={t("hotels.categoryHeading")}
        href={hotelsLink()}
        categories={[
          { icon: Gem, title: t("hotels.cat1Title"), detail: t("hotels.cat1Detail") },
          { icon: Palmtree, title: t("hotels.cat2Title"), detail: t("hotels.cat2Detail") },
          { icon: UtensilsCrossed, title: t("hotels.cat3Title"), detail: t("hotels.cat3Detail") },
        ]}
      />
      <HotelCollectionsSection />
      <DestinationPicksSection
        eyebrow={t("hotels.inspirationEyebrow")}
        heading={t("hotels.inspirationHeading")}
        items={resolve(TRAVEL_INSPIRATION)}
        href={hotelsLink()}
      />
    </VerticalPage>
  );
}
