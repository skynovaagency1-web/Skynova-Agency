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
 * SCRUB IS ON, AS A FRAME SEQUENCE. It was off for a long time, and the
 * reason was the server rather than the file: seeking an MP4 needs HTTP byte
 * ranges, and this Worker's asset handler does not serve them. A
 * `Range: bytes=1000000-1000100` for hotel-lobby-scrub.mp4 answered 200 with
 * the whole 6,335,664 bytes and no accept-ranges header, so every
 * currentTime assignment was dropped and the hero sat on frame zero for the
 * entire scroll -- measured on the deployed site, currentTime reading 0 at
 * 0/20/40/60/78% of the track while the progress bar advanced normally.
 * `vite dev` serves ranges, which is exactly why this never showed locally.
 *
 * Stills need no ranges: each frame is its own request, complete on arrival.
 * public/assets/hero/lobby holds 56 of them, cut from the 4096x2160 master
 * (`For hotel page.mp4`, 13.28s) rather than from either deployed encode --
 * the scrub encode had already been reduced to 1366x720 to pay for its
 * all-keyframe GOP, and re-encoding a reduced file only loses more. They ship
 * at 1500x791 webp q74, 3.79MB for the run, which is the same order as the
 * homepage sequence's 3.7MB.
 *
 * hotel-lobby.mp4 stays as videoSrc: dropping the `frames` prop falls
 * straight back to the playing clip, and hotel-lobby-scrub.mp4 stays beside
 * it as the record of what byte ranges would have bought.
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
      frames={{ dir: "lobby", prefix: "l", count: 56 }}
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
