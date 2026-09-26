import { useEffect } from "react";

import { ScrollStage, type ScrollStageSection } from "@/components/ui/landing-page";
import { GOLD_GRADIENTS, GradientCardShowcase } from "@/components/ui/gradient-card-showcase";
import { DayNightToggle } from "@/components/site/DayNightToggle";
import { DESTINATIONS, REGION_ORDER } from "@/data/destinations";
import { POSTS } from "@/data/blog-posts";
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
// Every post in this array has a written article behind it (blog-articles.ts
// holds one for each), so the figure is guides you can actually read.
const GUIDE_COUNT = POSTS.length;

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
    // The resting size in the hero, before any scroll. 1.4 put a 350px globe
    // against a 1440px viewport, which read as an ornament beside the copy
    // rather than the subject of the page.
    { top: "52%", left: "76%", scale: 1.85 },
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
    /* 0.8, and the ceiling here is geometry rather than taste.
     *
     * alignTo pins this globe to the headline's own centre, which is what
     * "the globe and the headline at the same height" means and is why it
     * exists. On a 375px screen that centre sits 17px above the lede. A globe
     * of diameter d therefore reaches d/2 below the headline centre, and
     * anything past 93px crosses into the lede's first line -- so "level with
     * the headline" and "much bigger" cannot both be had here.
     *
     * Measured live at 0.95: a 143px globe, 25px into the lede. The 0.75 this
     * replaced was already 10px in, so some overlap is the accepted state
     * rather than a new fault -- the copy paints over the globe and stays
     * legible either way. 0.8 is 120px and about 13px in: still larger than
     * before, and no worse than what was already shipping.
     *
     * Clearing the lede outright needs the globe off the headline's line,
     * which is a different design decision from this one.
     */
    { top: "38%", left: "80%", scale: 0.8, role: "companion" as const, alignTo: ".scrollstage-title" },
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

/** How much of that stage the globe covers once it lands.
 *
 *  0.699 UNTIL NOW, AND THAT NUMBER IS OBSOLETE. It was derived to match the
 *  WebGL planet that used to fade in underneath -- Globe3D frames a sphere of
 *  radius 2.2 with a 38-deg camera at z = 9.4, so its silhouette covered
 *  tan(asin(2.2 / 9.4)) / tan(19deg) = 0.699 of the box, and arriving at any
 *  other size put a disc over a planet that did not line up with it. That
 *  planet is gone: this globe IS the one that lives on the stage now, so
 *  there is nothing left to match and nothing left holding it small.
 *
 *  1.0 -- the globe fills the stage. The ring was what held it back, and the
 *  ring moved with it: --orbit-r goes up in styles.css so the chips clear the
 *  bigger globe instead of crossing its face. The two have to change
 *  together, which is why this comment names the other one. */
const DOCK_FILL = 1.0;

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
              ...GOLD_GRADIENTS[0],
            },
            {
              title: t("hero.f2Title", { count: DESTINATION_COUNT }),
              description: t("hero.f2Body", { regions: REGION_COUNT }),
              to: "/collections",
              actionLabel: t("hero.cardCollections"),
              ...GOLD_GRADIENTS[1],
            },
            {
              title: t("hero.f3Title"),
              description: t("hero.f3Body"),
              href: "/#how-it-works",
              actionLabel: t("hero.cardHowItWorks"),
              ...GOLD_GRADIENTS[2],
            },
            {
              title: t("hero.f4Title", { count: GUIDE_COUNT }),
              description: t("hero.f4Body"),
              to: "/blog",
              actionLabel: t("hero.cardGuides"),
              ...GOLD_GRADIENTS[3],
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
        // Nothing lives on the target any more -- the Fly-anywhere section
        // has no globe of its own, so there is nothing to hand over to. This
        // globe lands on that stage and stays as the globe that lives there.
        // Left at the default it would fade to exactly zero on arrival,
        // having flown the length of the page to vanish into an empty ring.
        handoffOnDock={false}
      />
      <DayNightToggle className="herostage-daynight" />
    </div>
  );
}
