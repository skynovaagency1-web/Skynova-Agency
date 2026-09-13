import { ScrollFlyIn } from "@/components/ui/hero-section-3";

/**
 * The flights hero: the scroll fly-in that opened the homepage until the
 * globe took that slot. A jet crossing the stage says "flights" more plainly
 * on the page about flying than it ever did over "every trip, one place", and
 * the video hero it replaces (/assets/hero/flight-resort.mp4) was a resort
 * lagoon -- a stays picture on the flights page.
 *
 * Deliberately NOT the whole of HeroScroll. Three of that component's parts
 * are homepage furniture and stayed there: the day/night toggle (mounted once,
 * on the homepage), the night-mode scoping it owns, and HeroCards, whose
 * counts and links are the homepage's own summary of the site. What moved is
 * the hero itself -- the sticky stage, the plane, and the copy layout -- now
 * taking the page's own strings so /flights reads as /flights.
 *
 * It shares .heroflyin with the old homepage hero rather than forking the CSS:
 * the stage, the copy treatment and the breakpoints are the same, and only the
 * cards (which are not here) ever needed page-specific layout.
 */
export function FlightHeroScroll({
  eyebrow,
  title,
  description,
  ctaHref,
  ctaLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <ScrollFlyIn className="heroflyin heroflyin-vertical" imageUrl="/assets/landing/plane-jet-top.webp" imageAlt="">
      <div className="heroflyin-copy site-container">
        <p className="site-eyebrow mb-4">{eyebrow}</p>
        <h1 className="site-h2 text-4xl md:text-6xl">{title}</h1>
        <p className="site-ink-muted heroflyin-lede mt-4 text-base leading-relaxed">{description}</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-5">
          <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="btn-hero-pill">
            <span className="spark" />
            <span>{ctaLabel}</span>
          </a>
        </div>
      </div>
    </ScrollFlyIn>
  );
}
