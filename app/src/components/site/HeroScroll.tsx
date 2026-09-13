import { useEffect } from "react";

import { ScrollFlyIn } from "@/components/ui/hero-section-3";
import { HeroCards } from "@/components/site/HeroCards";
import { DayNightToggle } from "@/components/site/DayNightToggle";
import { applyThemeMode, getThemeMode, DEFAULT_THEME } from "@/lib/theme-mode";

/**
 * The homepage hero, rebuilt on the scroll-fly-in reference.
 *
 * Hero.tsx is deliberately left in the tree, untouched and unused: it holds
 * the 102-frame scrubbed boarding sequence, and that is not the sort of thing
 * to delete while a replacement is still being judged. Swapping the import in
 * routes/index.tsx is the whole switch, in both directions.
 *
 * Three things had to come ACROSS with the swap, because they lived inside
 * the old hero rather than beside it:
 *
 *  - the day/night toggle, which is mounted here and nowhere else;
 *  - night mode's scoping. The attribute goes on <html> so CSS can reach
 *    .site-body, and it is applied on mount and removed on unmount so that
 *    choosing night here and clicking through to /hotels does not leave a
 *    dark ground under sections that have no dark styles at all;
 *  - the floating cards, which are the same HeroCards component, re-laid-out
 *    rather than re-written.
 *
 * The plane is the site's own cutout, not the reference's CDN image -- the
 * asset was already in the repo, unused, and a local file is one less
 * third-party dependency in the hero's critical path. (The site's CSP would
 * have allowed the remote one: img-src includes https:.)
 */
export function HeroScroll() {
  useEffect(() => {
    applyThemeMode(getThemeMode());
    return () => applyThemeMode(DEFAULT_THEME);
  }, []);

  return (
    <ScrollFlyIn
      className="heroflyin"
      imageUrl="/assets/landing/plane-cutout.webp"
      imageAlt=""
    >
      <div className="heroflyin-copy site-container">
        <p className="site-eyebrow mb-4">Skynova Agency</p>
        <h1 className="site-h2 text-4xl md:text-6xl">Every trip. One place.</h1>
        <p className="site-ink-muted heroflyin-lede mt-4 text-base leading-relaxed">
          Flights, stays, cars, connectivity, tickets and tours &mdash; compared in one place, booked with
          trusted travel partners at no extra cost.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-5">
          <a href="/#trip-search" className="btn-hero-pill">
            <span className="spark" />
            <span>Start your trip</span>
          </a>
          <a href="/#how-it-works" className="btn-ghost-link">
            See how it works <span className="arrow">&rarr;</span>
          </a>
        </div>
      </div>
      <DayNightToggle className="heroflyin-daynight" />
      <div className="heroflyin-cards">
        <HeroCards />
      </div>
    </ScrollFlyIn>
  );
}
