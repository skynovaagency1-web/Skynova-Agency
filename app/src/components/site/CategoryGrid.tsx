import type { LucideIcon } from "lucide-react";

export type Category = { icon: LucideIcon; title: string; detail: string; imageSrc?: string };

// Reusable icon-led category breakdown (Business Class / First Class /
// Luxury Airlines on the flights page, Luxury Cars / SUVs / EVs on car
// rentals, Adventure / Culture / Food on tours, etc.) -- one component fed
// different data per vertical instead of a bespoke grid on every page.
// variant="photo" (every category needs an imageSrc) swaps the icon panel
// for a route-card-style photo card -- used on car rentals, where real
// per-category car photos read much better than an icon.
export function CategoryGridSection({
  eyebrow,
  heading,
  categories,
  href,
  columns = 3,
  variant = "icon",
}: {
  eyebrow: string;
  heading: string;
  categories: Category[];
  href: string;
  columns?: 2 | 3;
  variant?: "icon" | "photo";
}) {
  return (
    <section className="site-section pt-0">
      <div className="site-container">
        <p className="site-eyebrow mb-3">{eyebrow}</p>
        <h2 className="site-h2 max-w-md text-3xl md:text-4xl">{heading}</h2>
        <div className={`mt-8 grid grid-cols-2 gap-3 sm:gap-5 ${columns === 3 ? "lg:grid-cols-3" : ""}`}>
          {categories.map((c) =>
            variant === "photo" && c.imageSrc ? (
              <a key={c.title} href={href} target="_blank" rel="noopener noreferrer" className="route-card">
                <div className="route-card-media">
                  <img src={c.imageSrc} alt={c.title} loading="lazy" />
                </div>
                <div className="route-card-copy">
                  <span className="route-card-path route-card-path-stack">
                    {c.title}
                    <span className="site-ink-muted mt-1 block text-xs font-normal normal-case">{c.detail}</span>
                  </span>
                </div>
              </a>
            ) : (
              <a
                key={c.title}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="site-panel why-book-card category-card p-6"
              >
                <div className="why-book-icon">
                  <c.icon size={20} aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-semibold leading-snug">{c.title}</h3>
                <p className="site-ink-muted mt-2 text-sm leading-relaxed">{c.detail}</p>
              </a>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
