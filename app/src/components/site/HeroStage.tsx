import { useEffect } from "react";

import { ScrollStage, type ScrollStageSection } from "@/components/ui/landing-page";
import { GradientCardShowcase } from "@/components/ui/gradient-card-showcase";
import { DayNightToggle } from "@/components/site/DayNightToggle";
import { DESTINATIONS, REGION_ORDER } from "@/data/destinations";
import { VERTICALS } from "@/data/verticals";
import { setDocked, setStagePresent } from "@/lib/globe-handoff";
import { applyThemeMode, getThemeMode, DEFAULT_THEME } from "@/lib/theme-mode";
import { useT } from "@/lib/i18n-strings";

/**
 * The homepage hero: the 21st.dev scroll stage, carrying Skynova's own opening,
 * with the globe as the thing that travels between the sections.
 *
 * It replaces HeroScroll here, which has moved to /flights (FlightHeroScroll).
 * Hero.tsx and HeroScroll.tsx both stay in the tree as alternates; swapping the
 * import in routes/index.tsx is still the whole switch, in any direction. So
 * does components/ui/plane-float.tsx, the airliner-in-cloud subject this ran
 * with for a while -- one prop below changes what flies.
 *
 * THE GLOBE DOES NOT STOP HERE. The page used to carry two unrelated globes
 * four thousand pixels apart: this one, and the WebGL planet in "Fly
 * anywhere". They are one globe now. This one keeps going past the last
 * section, recedes to almost nothing across the five screens in between
 * (which is what stops it sitting on top of the trip search, the slider and
 * the stats), then grows back to the exact size of the orbit stage and lands
 * on it -- at which point it fades out and the real WebGL globe fades in
 * underneath. See lib/globe-handoff.ts; it is the same handoff the aircraft
 * already makes between the rail and that canvas.
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
 * HeroCards did NOT come across, and nothing was lost with it. Every figure it
 * carried (vertical count, destination and region counts, "no markup, ever")
 * is the "reach" section's feature list below, read from the same arrays in
 * data/. Keeping both would have stated the same three figures twice inside
 * two screens of scroll. Its one unique element, the "browse destinations"
 * link, is what DestinationSlider and its "browse all" link do further down
 * the same page. The component stays in the tree, still used by HeroScroll.
 *
 * Every figure below is counted from data, never typed -- the rule HeroCards
 * and /about already follow, so none of them can go stale.
 */
const DESTINATION_COUNT = DESTINATIONS.length;
const REGION_COUNT = REGION_ORDER.length;
const VERTICAL_COUNT = VERTICALS.length;

/** Where the aircraft sits for each section, in viewport units. Section 0 keeps
 *  it clear of the left-aligned copy; section 1 lifts it out of the way of a
 *  three-item feature list; section 2 puts it behind the closing line as a
 *  backdrop, where the stage also drops it to a low opacity so the copy over it
 *  stays readable.
 *
 *  Sitting lower than the globe's positions did, and further from the edges:
 *  the globe was a 1:1 disc and this is a 4:1 wingspan, so the same anchor
 *  points put a wingtip off screen and the nose behind the headline. */
const GLOBE_POSITIONS = {
  positions: [
    { top: "52%", left: "76%", scale: 1.4 },
    { top: "26%", left: "78%", scale: 0.9 },
    { top: "50%", left: "50%", scale: 1.8 },
  ],
  /* Under 640px the wide layout shrunk down puts the globe straight through
     the headline, so the opening section gets its own anchor. It sits in the
     band between the nav and the eyebrow, to the RIGHT of the copy -- the same
     relationship the desktop has, in the only place a 375px column has room
     for it. An earlier pass parked it below the buttons instead, which read as
     the globe being under the headline rather than beside it.

     112px at 375px wide, level with the headline rather than above it: the
     owner asked for the two at the same height, which is what the desktop
     does. The headline is capped in CSS to leave the column (see the
     max-width note on .scrollstage-title), and 38% rather than a true 50%
     because the globe must bracket the HEADLINE and clear the lede under it
     -- at 44% its lower edge ran across the lede's first line.

     The 38% is only the fallback. alignTo reads the headline's own box each
     pass and sits level with it, because the copy is centred in a min-height
     section and a fixed fraction tracks it at one viewport height and no
     other: 38% was level at 375x560 and 93px high at 375x667.

     The other two stay behind the copy and are marked backdrop, so they drop
     to the faint opacity at a scale that would otherwise read as a
     companion. */
  narrowPositions: [
    { top: "38%", left: "80%", scale: 0.75, role: "companion" as const, alignTo: ".scrollstage-title" },
    { top: "50%", left: "50%", scale: 1.3, role: "backdrop" as const },
    { top: "52%", left: "50%", scale: 1.6, role: "backdrop" as const },
  ],
};

/** The element the globe flies to and lands on: the "Fly anywhere" orbit
 *  stage, which holds the WebGL globe (components/site/Sections3.tsx). A
 *  selector rather than a ref because the two live in different components on
 *  opposite ends of the page, and threading a ref between them would put the
 *  hero and that section into one render tree for no other reason. */
const DOCK_TARGET = ".orbit-stage";

/** How much of that stage the WebGL planet actually covers, so the globe
 *  arrives the same size rather than half again too big.
 *
 *  Derived, not eyeballed. Globe3D frames a sphere of radius 2.2 with a 38-deg
 *  perspective camera at z = 9.4, so the silhouette's half-angle is
 *  asin(2.2 / 9.4) = 13.53deg against a screen half-height of tan(19deg):
 *  tan(13.53deg) / tan(19deg) = 0.699. Docking to the full box instead put a
 *  680px disc over a 476px planet, which is exactly what it looked like. */
const DOCK_FILL = 0.699;

export function HeroStage() {
  const t = useT();

  useEffect(() => {
    applyThemeMode(getThemeMode());
    return () => applyThemeMode(DEFAULT_THEME);
  }, []);

  // Tells the WebGL globe that a handoff is coming, so it stays hidden until
  // this one lands. Without the signal it shows itself immediately, which is
  // what any page without this hero needs.
  useEffect(() => {
    setStagePresent(true);
    return () => setStagePresent(false);
  }, []);

  const sections: ScrollStageSection[] = [
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
      body: (
        <GradientCardShowcase
          cards={[
            {
              title: t("hero.f1Title", { count: VERTICAL_COUNT }),
              description: t("hero.f1Body"),
              to: "/destinations",
              actionLabel: t("hero.cardExplore"),
              gradientFrom: "#ffcf4d",
              gradientTo: "#583714",
            },
            {
              title: t("hero.f2Title", { count: DESTINATION_COUNT }),
              description: t("hero.f2Body", { regions: REGION_COUNT }),
              to: "/collections",
              actionLabel: t("hero.cardCollections"),
              gradientFrom: "#f3e6b8",
              gradientTo: "#c9a227",
            },
            {
              title: t("hero.f3Title"),
              description: t("hero.f3Body"),
              href: "/#how-it-works",
              actionLabel: t("hero.cardHowItWorks"),
              gradientFrom: "#ffd964",
              gradientTo: "#93711d",
            },
          ]}
        />
      ),
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
    <div className="herostage">
      <ScrollStage
        sections={sections}
        globeConfig={GLOBE_POSITIONS}
        dockTo={DOCK_TARGET}
        dockFill={DOCK_FILL}
        onDock={setDocked}
      />
      <DayNightToggle className="herostage-daynight" />
    </div>
  );
}
