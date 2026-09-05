export type Pick = { name: string; slug: string; detail: string };

// Generic destination-card grid, reused across verticals for any "here are
// N places worth it" section (weekend flight inspiration, featured luxury
// hotels, travel inspiration, etc.) -- same route-card shell as the route
// and hotel-collection cards, just fed different data and copy per page.
export function DestinationPicksSection({
  eyebrow,
  heading,
  items,
  href,
  columns = 4,
  altSuffix = "skyline",
}: {
  eyebrow: string;
  heading: string;
  items: Pick[];
  href: string;
  columns?: 3 | 4;
  altSuffix?: string;
}) {
  return (
    <section className="site-section pt-0">
      <div className="site-container">
        <p className="site-eyebrow mb-3">{eyebrow}</p>
        <h2 className="site-h2 max-w-md text-3xl md:text-4xl">{heading}</h2>
        <div className={`mt-8 grid grid-cols-2 gap-3 sm:gap-5 ${columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
          {items.map((p) => (
            <a key={p.slug} href={href} target="_blank" rel="noopener noreferrer" className="route-card">
              <div className="route-card-media">
                <img src={`/assets/destinations/${p.slug}.webp`} alt={`${p.name} ${altSuffix}`} loading="lazy" />
              </div>
              <div className="route-card-copy">
                <span className="route-card-path route-card-path-stack">
                  {p.name}
                  <span className="site-ink-muted mt-1 block text-xs font-normal normal-case">{p.detail}</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
