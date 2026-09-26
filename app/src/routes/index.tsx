import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { Nav } from "@/components/site/Nav";
// The flight: a pinned track down which the camera falls from orbit to Paris,
// the city centring as it arrives and a marker lighting on it. Scroll-driven
// throughout -- the reader's scroll IS the camera, and the page resumes the
// moment the track ends.
//
// Six alternates stay in the tree, unused: HeroStage.tsx (the scroll stage
// whose globe travelled down the page and docked onto "Fly anywhere"),
// HeroOrbit.tsx (the WebGL planet standing still), HeroPlay.tsx (the boarding
// clip played, the page held until it reached the window), Hero.tsx (that
// same footage scrubbed from scroll), ParallaxHero.tsx, and HeroScroll.tsx
// the plane fly-in (also running on /flights as FlightHeroScroll). Swapping
// this one import is still the whole switch, in any direction --
// tests/landing-contract.test.ts names whichever one is here and fails if it
// is not updated with it.
import { HeroStage } from "@/components/site/HeroStage";
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
        <HeroStage />
        {/* The hero's night ground, carried on.
            The hero is dark and the page under it was cream, so the surface
            changed the instant the globe left the stage. This run keeps the
            same ground from the trip search down to "Popular Right Now",
            where the page returns to daylight.
            It is not just a background: every section in here is written for
            a light ground and uses --sky-ink, so the class also flips the ink
            tokens. Those values are the night theme's own, not a second set
            invented for this -- see .night-run in styles.css. */}
        <div className="night-run">
          <TripSearch />
          <div ref={afterglowRef} className="hero-afterglow">
            <TrustLineSection />
            <AdvantagesSection />
          </div>
          <VerticalExplorerSection />
          <BookingSpecSection />
          <TrustSection />
        </div>
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
