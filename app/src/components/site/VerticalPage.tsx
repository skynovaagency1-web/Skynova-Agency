import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { FaqSection } from "./FaqSection";
import { Newsletter } from "./Newsletter";
import { CardActions } from "./CardActions";
import { DESTINATIONS } from "@/data/destinations";
import { useReveal } from "@/hooks/use-reveal";

type Bullet = { title: string; body: string };
type Faq = { q: string; a: string };
type HeroVideo = { videoSrc: string; overlaySrc?: string };

export function VerticalPage({
  eyebrow,
  title,
  description,
  heroImage,
  heroAlt,
  heroVideo,
  bullets,
  ctaHref,
  ctaLabel,
  destinationSlugs = [],
  faqHeading,
  faqs,
  children,
  afterDestinations,
}: {
  eyebrow: string;
  title: string;
  description: string;
  heroImage?: string;
  heroAlt: string;
  /** Video hero variant: a looping video fills the hero. With overlaySrc
   * set, a photo with a transparent cutout (real alpha channel) sits on
   * top so the video reads as the view through that opening -- the
   * technique the homepage hero used before it was removed per feedback.
   * Without overlaySrc, the video just plays full-bleed. Opt-in per page,
   * since most verticals still use a plain static heroImage. Takes
   * priority over heroImage when set. */
  heroVideo?: HeroVideo;
  bullets: Bullet[];
  ctaHref: string;
  ctaLabel: string;
  destinationSlugs?: string[];
  faqHeading?: string;
  faqs?: Faq[];
  /** Extra page-specific sections (e.g. flight route cards, hotel
   * collections), rendered between the bullets grid and the popular
   * destinations grid. */
  children?: ReactNode;
  /** Sections rendered after the popular-destinations grid, before the FAQ
   * (e.g. flight travel guides) -- optional, most verticals don't need it. */
  afterDestinations?: ReactNode;
}) {
  const gridRef = useReveal<HTMLDivElement>();
  const destinations = destinationSlugs
    .map((slug) => DESTINATIONS.find((d) => d.slug === slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <>
      <Nav />
      <main>
        <section className="dest-detail-hero">
          {heroVideo ? (
            <>
              <video
                className="dest-detail-media"
                src={heroVideo.videoSrc}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
              />
              {heroVideo.overlaySrc ? (
                <img src={heroVideo.overlaySrc} alt="" aria-hidden="true" className="dest-detail-window-overlay" />
              ) : null}
              <div className="dest-detail-mask-dark" />
            </>
          ) : (
            <>
              <img src={heroImage} alt={heroAlt} className="dest-detail-media" fetchPriority="high" />
              <div className="dest-detail-mask" />
            </>
          )}
          <div className={`dest-detail-copy ${heroVideo ? "dest-detail-copy-light" : ""}`}>
            <div className="site-container">
              <p className="site-eyebrow mb-3">{eyebrow}</p>
              <h1 className="site-h2 max-w-2xl text-4xl md:text-6xl">{title}</h1>
              <p className="site-ink-muted mt-4 max-w-lg text-base leading-relaxed">{description}</p>
              <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="btn-hero-pill mt-7 inline-flex">
                <span className="spark" />
                <span>{ctaLabel}</span>
              </a>
            </div>
          </div>
        </section>

        <section className="site-section">
          <div ref={gridRef} className="site-container grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bullets.map((b) => (
              <div key={b.title} className="site-panel p-7">
                <p className="site-eyebrow mb-3">{b.title}</p>
                <p className="text-base leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </section>

        {children}

        {destinations.length > 0 && (
          <section className="site-section pt-0">
            <div className="site-container">
              <p className="site-eyebrow mb-5">Popular destinations</p>
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                {destinations.map((d) => (
                  <div key={d.slug} className="relative">
                    <Link to="/destinations/$slug" params={{ slug: d.slug }} className="dest-mini-card">
                      <p className="dest-card-flag">{d.flag}</p>
                      <p className="mt-2 font-semibold">{d.name}</p>
                    </Link>
                    <CardActions slug={d.slug} name={d.name} />
                  </div>
                ))}
              </div>
              <Link to="/destinations" className="btn-underline mt-6">
                Browse all destinations <span className="arrow">&rarr;</span>
              </Link>
            </div>
          </section>
        )}

        {afterDestinations}

        {faqs && faqs.length > 0 && <FaqSection heading={faqHeading ?? `${eyebrow} questions, answered.`} faqs={faqs} />}
      </main>
      <Newsletter />
      <Footer />
    </>
  );
}
