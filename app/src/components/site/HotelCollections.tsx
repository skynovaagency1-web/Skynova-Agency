// Each collection is illustrated with a destination photo we already have
// (see PHOTO_SLUGS in DestinationSlider.tsx) rather than a stock generic --
// themed, not a literal filter, since we don't have per-hotel category data.
const COLLECTIONS = [
  { title: "Beach escapes", detail: "Coastlines and island stays.", slug: "fiji" },
  { title: "City breaks", detail: "Compact itineraries, walkable centers.", slug: "italy" },
  { title: "Romantic getaways", detail: "Quiet stays built for two.", slug: "new-zealand" },
  { title: "Mountain retreats", detail: "Alpine towns and slow mornings.", slug: "switzerland" },
  { title: "Family vacations", detail: "Space to spread out, easy logistics.", slug: "kenya" },
  { title: "Business travel", detail: "Central locations, fast check-in.", slug: "jordan" },
];

export function HotelCollectionsSection({ href }: { href: string }) {
  return (
    <section className="site-section pt-0">
      <div className="site-container">
        <p className="site-eyebrow mb-3">Hotel collections</p>
        <h2 className="site-h2 max-w-md text-3xl md:text-4xl">Stays sorted by the trip you're taking.</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((c) => (
            <a key={c.title} href={href} target="_blank" rel="noopener noreferrer" className="route-card">
              <div className="route-card-media">
                <img src={`/assets/destinations/${c.slug}.webp`} alt={c.title} loading="lazy" />
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
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
