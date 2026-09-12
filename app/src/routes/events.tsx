import { Music, Trophy, Drama, FerrisWheel, Landmark, Camera, Users, PartyPopper } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { VerticalPage } from "@/components/site/VerticalPage";
import { CategoryGridSection } from "@/components/site/CategoryGrid";
import { DestinationPicksSection } from "@/components/site/DestinationPicks";
import { AffiliateWidget } from "@/components/site/AffiliateWidget";
import { eventsLink } from "@/lib/affiliate";

/**
 * Tiqets attraction cards (campaign 89 / promo 3947), horizontal, four wide.
 *
 * This one is worth a note because it arrived labelled as a car-rental search
 * form and is nothing of the kind -- reading the loader payload shows it
 * pulling widgets.tiqets.com. Identify these by what they load, not by what
 * the dashboard called them.
 *
 * It also needs three origins the CSP did not allow (widgets.tiqets.com,
 * tpo.gg, tpemb.com); tpscr.com only serves a loader that fetches them. They
 * are added in lib/security-headers.server.ts. Take them away and this
 * renders nothing, silently.
 *
 * Unlike the eSIM and car-rental forms, this template exposes no colour
 * parameters -- only color_raw -- so it keeps its own styling rather than the
 * site's tokens. Left as generated for that reason, not by oversight.
 *
 * currency=USD is as supplied. Worth a second look: it is the only place on
 * the site that pins a currency, and it quotes American dollars to a French
 * operator's visitors.
 */
const EVENTS_WIDGET_SRC =
  "https://tpscr.com/content?currency=USD&trs=519959&shmarker=720297&language=en" +
  "&layout=horizontal&cards=4&powered_by=true&campaign_id=89&promo_id=3947";

import { useT, type TKey } from "@/lib/i18n-strings";

const TRENDING_EVENTS: { name: string; slug: string; detailKey: TKey }[] = [
  { name: "Festival season", slug: "event-festival", detailKey: "events.pick1Detail" },
  { name: "Fireworks & celebrations", slug: "event-fireworks", detailKey: "events.pick2Detail" },
  { name: "Opera & theatre", slug: "event-opera", detailKey: "events.pick3Detail" },
  { name: "Big-match sport", slug: "event-stadium", detailKey: "events.pick4Detail" },
];

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events & Tickets | Skynova Agency" },
      { name: "description", content: "Concerts, museums, attractions and skip-the-line passes in the cities you are already visiting." },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const t = useT();
  return (
    <VerticalPage
      eyebrow={t("service.events")}
      title={t("events.title")}
      description={t("home.eventsCopy")}
      heroImage="/assets/sections/events.webp"
      heroAlt={t("home.eventsAlt")}
      ctaHref={eventsLink()}
      ctaLabel={t("home.findEvents")}
      bullets={[
        { title: t("events.b1Title"), body: t("events.b1Body") },
        { title: t("events.b2Title"), body: t("events.b2Body") },
        { title: t("events.b3Title"), body: t("events.b3Body") },
      ]}
      destinationSlugs={["italy", "spain", "south-korea", "united-states"]}
      faqHeading={t("events.faqHeading")}
      faqs={[
        { q: t("events.q1"), a: t("events.a1") },
        { q: t("events.q2"), a: t("events.a2") },
        { q: t("events.q3"), a: t("events.a3") },
        { q: t("events.q4"), a: t("events.a4") },
      ]}
    >
      <CategoryGridSection
        eyebrow={t("events.categoryEyebrow")}
        heading={t("events.categoryHeading")}
        href={eventsLink()}
        categories={[
          { icon: Music, title: t("events.cat1Title"), detail: t("events.cat1Detail") },
          { icon: Trophy, title: t("events.cat2Title"), detail: t("events.cat2Detail") },
          { icon: Drama, title: t("events.cat3Title"), detail: t("events.cat3Detail") },
          { icon: FerrisWheel, title: t("events.cat4Title"), detail: t("events.cat4Detail") },
          { icon: Landmark, title: t("events.cat5Title"), detail: t("events.cat5Detail") },
          { icon: Camera, title: t("events.cat6Title"), detail: t("events.cat6Detail") },
          { icon: Users, title: t("events.cat7Title"), detail: t("events.cat7Detail") },
          { icon: PartyPopper, title: t("events.cat8Title"), detail: t("events.cat8Detail") },
        ]}
      />
      <section className="site-section pt-0">
        <div className="site-container">
          <p className="site-eyebrow mb-3">{t("events.bookNow")}</p>
          <h2 className="site-h2 max-w-md text-3xl md:text-4xl">{t("events.widgetHeading")}</h2>
          <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">{t("events.widgetCopy")}</p>
          <AffiliateWidget src={EVENTS_WIDGET_SRC} className="mt-8" />
        </div>
      </section>
      <DestinationPicksSection
        eyebrow={t("events.picksEyebrow")}
        heading={t("events.picksHeading")}
        items={TRENDING_EVENTS.map((e) => ({ name: e.name, slug: e.slug, detail: t(e.detailKey) }))}
        href={eventsLink()}
        altSuffix="event"
      />
    </VerticalPage>
  );
}
