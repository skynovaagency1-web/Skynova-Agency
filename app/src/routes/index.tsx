import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { Nav } from "@/components/site/Nav";
// Hero.tsx stays in the tree, unused: it holds the 102-frame scrubbed
// boarding sequence, and swapping this one import is the whole switch in
// either direction.
import { HeroScroll } from "@/components/site/HeroScroll";
import { TripSearch } from "@/components/site/TripSearch";
import { TrustSection } from "@/components/site/Sections2";
import {
  TrustLineSection,
  AdvantagesSection,
  BookingSpecSection,
  BenefitsStripSection,
  LiveStatsBarSection,
  FlyAnywhereSection,
  ClosingStatCtaSection,
} from "@/components/site/Sections3";
import { DestinationSlider } from "@/components/site/DestinationSlider";
import { VerticalExplorerSection } from "@/components/site/VerticalExplorer";
import { MarqueeBand } from "@/components/site/MarqueeBand";
import { TripCycle } from "@/components/site/TripCycle";
import { Footer } from "@/components/site/Footer";
import { Newsletter } from "@/components/site/Newsletter";
import { useParallax } from "@/hooks/use-parallax";
import { jsonLd } from "@/lib/seo";
import { StructuredData } from "@/components/StructuredData";

export const Route = createFileRoute("/")({
  component: Index,
});

/**
 * The homepage was the only page on the site emitting no JSON-LD -- every
 * other route already carries something. Organization here shares the @id
 * used on /about so Google resolves one entity, not two; WebSite is what
 * carries the brand name into a knowledge panel.
 *
 * Deliberately no SearchAction/sitelinks-searchbox: Google retired that
 * result feature in November 2024, so it would be markup for nothing.
 */
const HOME_SCHEMA = jsonLd({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://skynovaagency.com/#organization",
      name: "Skynova Agency",
      url: "https://skynovaagency.com",
      logo: "https://skynovaagency.com/assets/brand/icon-512.png",
      description:
        "A booking layer over established travel partners -- flights, stays, cars, connectivity, tickets and tours in one place.",
    },
    {
      "@type": "WebSite",
      "@id": "https://skynovaagency.com/#website",
      url: "https://skynovaagency.com",
      name: "Skynova Agency",
      publisher: { "@id": "https://skynovaagency.com/#organization" },
    },
  ],
});

function Index() {
  const afterglowRef = useParallax<HTMLDivElement>();

  // A referral link (/?ref=<code>) can land here well before the visitor
  // ever signs up -- stash it so AuthModal's sign-up call can still send
  // it along whenever that happens, rather than requiring signup in the
  // same instant the link is clicked.
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) sessionStorage.setItem("skynova_ref", ref);
  }, []);

  return (
    <>
      <StructuredData json={HOME_SCHEMA} />
      <Nav />
      <main>
        <HeroScroll />
        <TripSearch />
        <div ref={afterglowRef} className="hero-afterglow">
          <TrustLineSection />
          <AdvantagesSection />
        </div>
        <VerticalExplorerSection />
        <BookingSpecSection />
        <TrustSection />
        <DestinationSlider />
        <MarqueeBand />
        <TripCycle />
        <BenefitsStripSection />
        <LiveStatsBarSection />
        <FlyAnywhereSection />
        <ClosingStatCtaSection />
      </main>
      <Newsletter />
      <Footer />
    </>
  );
}
