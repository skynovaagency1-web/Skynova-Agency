import { useEffect, useSyncExternalStore } from "react";

import { ScrollGlobe, type ScrollGlobeSection } from "@/components/ui/landing-page";
import { DayNightToggle } from "@/components/site/DayNightToggle";
import { DESTINATIONS, REGION_ORDER } from "@/data/destinations";
import { VERTICALS } from "@/data/verticals";
import {
  applyThemeMode,
  getServerThemeMode,
  getThemeMode,
  subscribeThemeMode,
  DEFAULT_THEME,
} from "@/lib/theme-mode";
import { useT } from "@/lib/i18n-strings";

/**
 * The homepage hero: the scroll-globe, carrying Skynova's own opening.
 *
 * It replaces HeroScroll here, which has moved to /flights (FlightHeroScroll)
 * -- the plane fly-in belongs on the page about flying. Hero.tsx and
 * HeroScroll.tsx both stay in the tree as alternates; swapping the import in
 * routes/index.tsx is still the whole switch, in any direction.
 *
 * Two things had to come across with the swap, because they lived inside the
 * hero rather than beside it:
 *
 *  - the day/night toggle, mounted here and nowhere else on the site;
 *  - night mode's scoping. The attribute goes on <html> so CSS can reach
 *    .site-body, applied on mount and removed on unmount, so choosing night
 *    here and clicking through to /hotels does not leave a dark ground under
 *    sections that have no dark styles at all.
 *
 * The toggle earns more here than it did on the fly-in: the globe reads the
 * same flag and swaps its own texture, so night mode turns the earth over to
 * the city-lights map rather than only dimming the page around it.
 *
 * HeroCards did NOT come across, and nothing was lost with it. Every fact it
 * carried -- the vertical count, the destination and region counts, "no
 * markup, ever" -- is the "reach" section's feature list below, read from the
 * same arrays in data/. Keeping both would have stated the same three figures
 * twice inside two screens of scroll. Its one unique element, the "browse
 * destinations" link, is what DestinationSlider and its "browse all" link do
 * further down the same page. The component stays in the tree, still used by
 * HeroScroll.tsx.
 *
 * Every figure below is counted from data, never typed -- the rule HeroCards
 * and /about already follow, so none of them can go stale.
 */
const DESTINATION_COUNT = DESTINATIONS.length;
const REGION_COUNT = REGION_ORDER.length;
const VERTICAL_COUNT = VERTICALS.length;

/** Where the globe sits for each section, in viewport units. Section 0 keeps
 *  it clear of the left-aligned copy; section 1 lifts it out of the way of a
 *  three-item feature list; section 2 puts it behind the closing line as a
 *  backdrop, where ScrollGlobe also drops it to 0.4 opacity so the cards over
 *  it stay readable. */
const GLOBE_POSITIONS = {
  positions: [
    { top: "52%", left: "76%", scale: 1.4 },
    { top: "26%", left: "78%", scale: 0.9 },
    { top: "50%", left: "50%", scale: 1.8 },
  ],
};

export function HeroGlobe() {
  const t = useT();

  useEffect(() => {
    applyThemeMode(getThemeMode());
    return () => applyThemeMode(DEFAULT_THEME);
  }, []);

  // Same store the toggle writes to, read the same way the toggle reads it --
  // so the texture switches on the same commit the page does, with no second
  // source of truth for which mode is on.
  const mode = useSyncExternalStore(subscribeThemeMode, getThemeMode, getServerThemeMode);
  const texture = mode === "night" ? "/assets/landing/earth-night.webp" : "/assets/landing/earth-day.webp";

  const sections: ScrollGlobeSection[] = [
    {
      id: "hero",
      badge: t("hero.badge"),
      title: t("hero.title"),
      subtitle: t("hero.subtitle"),
      description: t("hero.lede"),
      align: "left",
      actions: [
        { label: t("nav.startTrip"), href: "/#trip-search", variant: "primary" },
        { label: t("hero.howItWorks"), href: "/#how-it-works", variant: "secondary" },
      ],
    },
    {
      id: "reach",
      badge: t("hero.reachBadge"),
      title: t("hero.reachTitle"),
      description: t("hero.reachLede", { regions: REGION_COUNT }),
      align: "left",
      features: [
        {
          title: t("hero.f1Title", { count: VERTICAL_COUNT }),
          description: t("hero.f1Body"),
        },
        {
          title: t("hero.f2Title", { count: DESTINATION_COUNT }),
          description: t("hero.f2Body", { regions: REGION_COUNT }),
        },
        { title: t("hero.f3Title"), description: t("hero.f3Body") },
      ],
    },
    {
      id: "begin",
      badge: t("hero.beginBadge"),
      title: t("hero.beginTitle"),
      description: t("hero.beginLede"),
      align: "center",
      actions: [{ label: t("hero.beginCta"), href: "/#trip-search", variant: "primary" }],
    },
  ];

  return (
    <div className="heroglobe">
      <ScrollGlobe sections={sections} globeConfig={GLOBE_POSITIONS} globeTextureUrl={texture} />
      <DayNightToggle className="heroglobe-daynight" />
    </div>
  );
}
