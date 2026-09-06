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

const TRENDING_EVENTS = [
  { name: "Festival season", slug: "event-festival", detail: "Headline stages and the crowd that comes for them." },
  { name: "Fireworks & celebrations", slug: "event-fireworks", detail: "New Year's, national days, and the nights built around a sky show." },
  { name: "Opera & theatre", slug: "event-opera", detail: "A seat at the kind of venue that's part of the show." },
  { name: "Big-match sport", slug: "event-stadium", detail: "The fixtures worth planning a trip around." },
];

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events & Tickets | Skynova Agency" },
      { name: "description", content: "Concerts, museums, attractions and skip-the-line passes in the cities you are already visiting." },
    ],
  }),
  component: () => (
    <VerticalPage
      eyebrow="Events & tickets"
      title="Your next unforgettable experience starts here."
      description="Concerts, museums, attractions and skip-the-line passes in the cities you are already visiting."
      heroImage="/assets/sections/events.webp"
      heroAlt="Event ticket stub resting on a dark surface"
      ctaHref={eventsLink()}
      ctaLabel="Find events"
      bullets={[
        { title: "Skip-the-line passes", body: "Museums and landmark attractions without the wait." },
        { title: "Mobile tickets", body: "Delivered to your inbox the moment you book." },
        { title: "Local shows and concerts", body: "Booked in the same flow as the rest of the trip." },
      ]}
      destinationSlugs={["italy", "spain", "south-korea", "united-states"]}
      faqHeading="Event & ticket questions, answered."
      faqs={[
        {
          q: "Are tickets delivered instantly?",
          a: "Most are -- mobile tickets land in your inbox right after checkout, ready to show at the door.",
        },
        {
          q: "Can I get a refund if plans change?",
          a: "Refund and exchange terms are set per event and shown before you pay.",
        },
        {
          q: "Do skip-the-line passes guarantee entry?",
          a: "They guarantee a faster queue, not a specific time slot -- some attractions also offer timed entry.",
        },
        {
          q: "Are these official tickets?",
          a: "Yes -- bookings go through the venue's or a licensed partner's own ticketing system.",
        },
      ]}
    >
      <CategoryGridSection
        eyebrow="What's on"
        heading="Whatever the city's known for, tonight."
        href={eventsLink()}
        categories={[
          { icon: Music, title: "Concerts", detail: "Touring acts and local venues, booked ahead." },
          { icon: Trophy, title: "Sports", detail: "Matches and races in the cities hosting them." },
          { icon: Drama, title: "Theatre", detail: "West End, Broadway, and local stages alike." },
          { icon: FerrisWheel, title: "Theme parks", detail: "Skip-the-line entry to the big ones." },
          { icon: Landmark, title: "Museums", detail: "Timed entry to the exhibits worth planning around." },
          { icon: Camera, title: "Attractions", detail: "Landmarks, viewpoints, and the photo-op stops." },
          { icon: Users, title: "Family events", detail: "Paced and timed for kids, without the adult-only fine print." },
          { icon: PartyPopper, title: "Seasonal events", detail: "Holiday markets, festivals, and the dates that only happen once a year." },
        ]}
      />
      <section className="site-section pt-0">
        <div className="site-container">
          <p className="site-eyebrow mb-3">Book now</p>
          <h2 className="site-h2 max-w-md text-3xl md:text-4xl">Tickets, live from Tiqets.</h2>
          <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">
            Real availability and prices. You check out with Tiqets &mdash; Skynova doesn&rsquo;t
            handle the payment or set the price.
          </p>
          <AffiliateWidget src={EVENTS_WIDGET_SRC} className="mt-8" />
        </div>
      </section>
      <DestinationPicksSection
        eyebrow="Trending events"
        heading="What's worth booking around right now."
        items={TRENDING_EVENTS}
        href={eventsLink()}
        altSuffix="event"
      />
    </VerticalPage>
  ),
});
