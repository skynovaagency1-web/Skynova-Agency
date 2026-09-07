import { forwardRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { DESTINATIONS, REGION_ORDER, PHOTO_SLUG_ORDER } from "@/data/destinations";
import { VERTICALS } from "@/data/verticals";

/**
 * The floating cards over the hero, after the "next hero section" reference:
 * dark translucent panels sitting on the photograph, with tag pills, a
 * thumbnail, a stat block and two "learn more" links.
 *
 * WHY THIS IS NOT INSIDE .hero-copy. That element is gated to opacity 0
 * until --hero-grow passes 0.85, and a child can never render more opaque
 * than its parent -- anything placed inside would be invisible for the first
 * ~2400px of scroll, which is measurably most of the hero. These are
 * siblings inside .hero-stage instead, so they are on screen at load.
 *
 * They then fade OUT on the inverse of the copy's curve. The copy is
 * bottom-anchored (justify-content:flex-end, 4.5rem of padding), so the
 * bottom row would sit on top of the headline once it arrives; fading the
 * cards as the copy appears means the two never share the stage.
 *
 * Every figure is counted from data, never typed -- the same rule /about
 * already follows, so none of these numbers can go stale.
 */
const DESTINATION_COUNT = DESTINATIONS.length;
const REGION_COUNT = REGION_ORDER.length;
const VERTICAL_COUNT = VERTICALS.length;
/** First photo-backed destination, reused as the card thumbnail. */
const THUMB_SLUG = PHOTO_SLUG_ORDER[0];
const THUMB = DESTINATIONS.find((d) => d.slug === THUMB_SLUG);

const TAGS = ["Flights", "Stays", "Tours"];

export const HeroCards = forwardRef<HTMLDivElement>(function HeroCards(_props, ref) {
  return (
    <div ref={ref} className="hero-cards" aria-label="What Skynova covers">
      <article className="hero-card hero-card-info">
        <div className="hero-card-info-body">
          <div className="hero-card-tags">
            {TAGS.map((t) => (
              <span key={t} className="hero-card-tag">
                {t}
              </span>
            ))}
          </div>
          <h2 className="hero-card-title">One search, every vertical</h2>
          <p className="hero-card-text">
            {VERTICAL_COUNT} kinds of booking compared in a single flow, routed straight to the partner who
            fulfils them.
          </p>
        </div>
        {THUMB ? (
          <img
            className="hero-card-thumb"
            src={`/assets/destinations/${THUMB.slug}.webp`}
            alt={`${THUMB.name} travel scene`}
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </article>

      <div className="hero-cards-bottom">
        <article className="hero-card hero-card-note">
          <h3 className="hero-card-subtitle">No markup, ever</h3>
          <p className="hero-card-text">
            Checkout happens on the partner&rsquo;s own site, at the partner&rsquo;s own price.
          </p>
          <a href="/#how-it-works" className="hero-card-link">
            How it works <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </article>

        <div className="hero-card-stat">
          <span className="hero-card-stat-figure">{DESTINATION_COUNT}</span>
          <span className="hero-card-stat-label">
            destinations routed
            <br />
            across {REGION_COUNT} regions
          </span>
        </div>

        <article className="hero-card hero-card-note">
          <p className="hero-card-text">
            Guides written for the route you&rsquo;re actually taking, with the booking links that match it.
          </p>
          <Link to="/destinations" className="hero-card-link">
            Browse destinations <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
        </article>
      </div>
    </div>
  );
});
