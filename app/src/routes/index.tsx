import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
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

export const Route = createFileRoute("/")({
  component: Index,
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
      <Nav />
      <main>
        <Hero />
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
