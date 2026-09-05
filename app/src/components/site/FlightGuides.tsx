import { TravelGuidesSection } from "@/components/site/TravelGuides";

const GUIDE_SLUGS = ["best-time-to-book-a-flight", "long-haul-flight-survival", "packing-carry-on-only"];

export function FlightGuidesSection() {
  return <TravelGuidesSection eyebrow="Flight travel guides" heading="Fly a little smarter." slugs={GUIDE_SLUGS} />;
}
