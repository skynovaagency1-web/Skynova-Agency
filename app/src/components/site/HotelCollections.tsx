import { Link } from "@tanstack/react-router";

// Each card opens the matching collection page on this site -- its
// destinations, season notes and booking links -- rather than dropping the
// visitor onto the booking partner, in a new tab, before they've seen any of
// it. Every card is illustrated with a destination that is actually IN the
// collection it opens: Kenya used to front "Family vacations" and New Zealand
// "Romantic getaways", and neither is on those pages.
const COLLECTIONS = [
  { title: "Beach escapes", detail: "Coastlines and island stays.", photo: "fiji", collection: "beach-destinations" },
  { title: "City breaks", detail: "Compact itineraries, walkable centers.", photo: "italy", collection: "city-breaks" },
  {
    title: "Romantic getaways",
    detail: "Quiet stays built for two.",
    photo: "french-polynesia",
    collection: "honeymoon-destinations",
  },
  {
    title: "Mountain retreats",
    detail: "Alpine towns and slow mornings.",
    photo: "switzerland",
    collection: "mountain-retreats",
  },
  { title: "Family vacations", detail: "Space to spread out, easy logistics.", photo: "canada", collection: "family-travel" },
  {
    title: "Business travel",
    detail: "Central locations, fast check-in.",
    photo: "united-arab-emirates",
    collection: "business-travel",
  },
];

export function HotelCollectionsSection() {
  return (
    <section className="site-section pt-0">
      <div className="site-container">
        <p className="site-eyebrow mb-3">Hotel collections</p>
        <h2 className="site-h2 max-w-md text-3xl md:text-4xl">Stays sorted by the trip you're taking.</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((c) => (
            <Link key={c.title} to="/collections/$slug" params={{ slug: c.collection }} className="route-card">
              <div className="route-card-media">
                <img src={`/assets/destinations/${c.photo}.webp`} alt={c.title} loading="lazy" />
              </div>
              <div className="route-card-copy">
                <span className="route-card-path route-card-path-stack">
                  {c.title}
                  <span className="site-ink-muted mt-1 block text-xs font-normal normal-case">{c.detail}</span>
                </span>
                <span className="route-card-cta">
                  Browse <span className="arrow">&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
