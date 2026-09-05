import { DestinationPicksSection } from "@/components/site/DestinationPicks";

// Short-haul picks for a two- or three-day trip -- destination-led rather
// than a route pair, since "worth a weekend" depends on where you're
// flying from. Reuses destinations we already have a real photo for.
const PICKS = [
  { name: "Portugal", slug: "portugal", detail: "Lisbon's tiled hillsides fit neatly into two days." },
  { name: "Italy", slug: "italy", detail: "Rome or Florence, without burning a week of leave." },
  { name: "Switzerland", slug: "switzerland", detail: "Alpine air and a lake view, back by Monday." },
  { name: "Paris", slug: "paris", detail: "The Eiffel Tower lit up at night, then home for the week ahead." },
];

export function WeekendInspirationSection({ href }: { href: string }) {
  return (
    <DestinationPicksSection
      eyebrow="Weekend flight inspiration"
      heading="Worth the short trip."
      items={PICKS}
      href={href}
    />
  );
}
