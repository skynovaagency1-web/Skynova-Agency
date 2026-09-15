import { ScrubHero } from "@/components/ui/sunset-skyline-hero";
import { hotelsLink } from "@/lib/affiliate";
import { useT } from "@/lib/i18n-strings";

/**
 * The hotels hero: the lobby clip held still while the page scrolls past it,
 * the opening copy dissolving into it, and "Stay." composing in as the run
 * ends.
 *
 * It replaces KeyholeHero here, which stays in the tree untouched --
 * `heroReveal="keyhole"` plus `heroIntro` on routes/hotels.tsx is the whole
 * switch back, the same way Hero.tsx and HeroScroll.tsx remained swappable
 * when the homepage hero changed.
 *
 * IT SCRUBS OFF ITS OWN SOURCE, NOT THE PLAYBACK ONE. hotel-lobby.mp4 is
 * encoded to play: two keyframes across 13.28s, so seeking it per frame would
 * decode up to 166 frames to draw one and the hero would sit frozen on a
 * phone. hotel-lobby-scrub.mp4 is the same footage with every frame a
 * keyframe, at 15fps and 720p tall so that -g 1 costs 6.0MB instead of the
 * ~25MB a 1080p25 all-keyframe encode would. The frame rate drop is invisible
 * because scroll position picks the frame, not the clock. The command is in
 * the `scrub` prop's note.
 *
 * The playback encode stays in the tree: it is what `scrub={false}` wants,
 * and it is 2MB lighter for anything that only needs the clip to run.
 *
 * NO CUTOUT LAYER either: the reference floats a silhouette cut to ITS
 * footage's last frame over the mark. public/assets/hero/window-photo-cutout
 * was cut for the old window hero and is not aligned to this clip, and a
 * cutout aligned to other footage is worse than none, so overlaySrc is left
 * unset and the layer is not rendered.
 */
export function HotelScrubHero() {
  const t = useT();

  return (
    <ScrubHero
      videoSrc="/assets/hero/hotel-lobby-scrub.mp4"
      posterSrc="/assets/hero/hotel-lobby-poster.webp"
      scrub
      brandMark={t("hotels.heroMark")}
      scrollHint={t("hotels.heroHint")}
    >
      <div className="dest-detail-copy dest-detail-copy-light">
        <div className="site-container">
          <p className="site-eyebrow mb-3">{t("service.hotels")}</p>
          <h1 className="site-h2 max-w-2xl text-4xl md:text-6xl">{t("hotels.title")}</h1>
          <p className="site-ink-muted mt-4 max-w-lg text-base leading-relaxed">
            {t("home.hotelsCopy")}
          </p>
          <a
            href={hotelsLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hero-pill mt-7 inline-flex"
          >
            <span className="spark" />
            <span>{t("home.browseStays")}</span>
          </a>
        </div>
      </div>
    </ScrubHero>
  );
}
