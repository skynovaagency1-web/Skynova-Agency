import { useEffect, useMemo } from "react";

import { ParallaxHeader, type ParallaxLayer } from "@/components/ui/parallax-scrolling";
import { DayNightToggle } from "@/components/site/DayNightToggle";
import { applyThemeMode, getThemeMode, DEFAULT_THEME } from "@/lib/theme-mode";
import { useT } from "@/lib/i18n-strings";

/**
 * The homepage hero: the earth behind, the headline in the middle, cloud in
 * front, each travelling at its own rate as the page scrolls away.
 *
 * It replaces HeroStage, which stays in the tree like Hero.tsx and
 * HeroScroll.tsx before it -- swapping the one import in routes/index.tsx is
 * still the whole switch, in any direction.
 *
 * TWO THINGS CAME ACROSS WITH THE SWAP, because they lived inside the old
 * hero rather than beside it, and nowhere else on the site mounts them:
 *
 *   - the day/night toggle;
 *   - night mode's scoping. The attribute goes on <html> so CSS can reach
 *     .site-body, applied on mount and removed on unmount, so choosing night
 *     here and clicking through to /hotels does not leave a dark ground under
 *     sections that have no dark styles at all.
 *
 * WHAT DID NOT COME ACROSS is the travelling globe. HeroStage's globe flew
 * down the page and landed on the WebGL planet in "Fly anywhere"; there is no
 * equivalent here. That planet is unaffected -- lib/globe-handoff.ts treats
 * the absence of a stage as "already docked", which is exactly this case, so
 * Globe3D shows itself immediately instead of waiting for a handoff that will
 * never come.
 *
 * ON THE ART. earth-day/earth-night are the same textures the WebGL globe
 * uses, so the toggle changes the sky here as well as the planet further
 * down. public/assets/landing/CREDITS.md records that cloud-transparent.webp
 * arrived with the repo and its licence is unrecorded; using it in one more
 * place does not change that, but it is the file to replace first if these
 * ever need to be provably owned.
 */
export function ParallaxHero() {
  const t = useT();

  useEffect(() => {
    applyThemeMode(getThemeMode());
    return () => applyThemeMode(DEFAULT_THEME);
  }, []);

  // Back to front: the earth travels furthest, the cloud in front barely
  // moves. Memoised because the array identity is the effect's dependency --
  // rebuilding it every render would tear the timeline down and up again.
  const layers: ParallaxLayer[] = useMemo(
    () => [
      {
        yPercent: 70,
        className: "parallaxhero-sky",
        content: (
          <>
            <img
              src="/assets/landing/earth-day.webp"
              alt=""
              aria-hidden="true"
              className="parallaxhero-earth parallaxhero-earth-day"
              width={1600}
              height={800}
              fetchPriority="high"
            />
            <img
              src="/assets/landing/earth-night.webp"
              alt=""
              aria-hidden="true"
              className="parallaxhero-earth parallaxhero-earth-night"
              width={1600}
              height={800}
            />
          </>
        ),
      },
      { yPercent: 55, className: "parallaxhero-glow", content: <span aria-hidden="true" /> },
      {
        yPercent: 40,
        className: "parallaxhero-copy",
        content: (
          <div className="site-container">
            <p className="site-eyebrow mb-4">{t("hero.badge")}</p>
            <h1 className="parallaxhero-title">
              {t("hero.title")}
              <span>{t("hero.subtitle")}</span>
            </h1>
            <p className="parallaxhero-lede">{t("hero.lede")}</p>
            <div className="parallaxhero-actions">
              <a href="/#trip-search" className="btn-hero-pill">
                <span className="spark" />
                <span>{t("nav.startTrip")}</span>
              </a>
              <a href="/#how-it-works" className="btn-ghost-link">
                {t("hero.howItWorks")} <span className="arrow">&rarr;</span>
              </a>
            </div>
          </div>
        ),
      },
      {
        yPercent: 10,
        className: "parallaxhero-cloud",
        content: (
          <img
            src="/assets/landing/cloud-transparent.webp"
            alt=""
            aria-hidden="true"
            width={2600}
            height={2600}
            fetchPriority="high"
          />
        ),
      },
    ],
    [t],
  );

  return (
    <div className="parallaxhero">
      <DayNightToggle className="parallaxhero-daynight" />
      <ParallaxHeader layers={layers} className="parallaxhero-stage" />
    </div>
  );
}
