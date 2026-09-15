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
 * NO FRAME SCRUB, deliberately. The reference drives video.currentTime from
 * scroll; that is only smooth on a clip encoded with dense keyframes, and
 * /assets/hero/hotel-lobby.mp4 carries two across 13.28s -- a seek per frame
 * would decode up to 166 frames to draw one, which on a phone reads as a
 * frozen hero. So the clip plays and everything else here is scroll-driven.
 * The `scrub` prop is the one line that changes once a scrub-encoded source
 * exists; the encode command is in that prop's note.
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
      videoSrc="/assets/hero/hotel-lobby.mp4"
      posterSrc="/assets/hero/hotel-lobby-poster.webp"
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
