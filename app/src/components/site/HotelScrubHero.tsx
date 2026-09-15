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
 * SCRUB IS OFF, AND THE REASON IS THE SERVER, NOT THE FILE. The encode is
 * ready -- hotel-lobby-scrub.mp4 beside this, every frame a keyframe -- and
 * the scrub runs correctly against `vite dev`. It does not run in production,
 * because seeking an MP4 needs HTTP byte ranges and this Worker's asset
 * handler does not serve them: a `Range: bytes=1000000-1000100` request for
 * that file answers 200 with the whole 6,335,664 bytes and no accept-ranges
 * header. The browser can therefore buffer and play the clip but cannot seek
 * it, so every currentTime assignment is dropped and the hero sits on frame
 * zero for the whole scroll. Measured on the deployed site, not inferred:
 * currentTime read 0 at 0/20/40/60/78% of the track while the progress bar
 * and the mark advanced normally.
 *
 * Turning `scrub` back on needs one of:
 *   - a Worker route for this path that honours Range, or
 *   - a preloaded frame sequence instead of a video, which is what the
 *     technique actually wants and needs no ranges at all.
 * Until then the clip plays and every other layer stays scroll-driven.
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
