import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { DESTINATIONS } from "@/data/destinations";

/**
 * Glass cards over the hotel hero's dark wall, in the homepage's card style --
 * the same .hero-card classes as HeroCards.tsx, made for a dark ground. They
 * float around the lit keyhole at the start and fade as the camera pushes in
 * (KeyholeHero's `intro` slot), so they and the headline never share the
 * stage.
 *
 * Same rule as the homepage cards: every figure is counted from data, never
 * typed, so none of them can go stale.
 */
const DESTINATION_COUNT = DESTINATIONS.length;
const TAGS = ["Boutique", "Resorts", "City stays"];

export function HotelHeroCards() {
  return (
    <div className="hero-cards" aria-label="How hotel search works on Skynova">
      <article className="hero-card hero-card-info">
        <div className="hero-card-info-body">
          <div className="hero-card-tags">
            {TAGS.map((t) => (
              <span key={t} className="hero-card-tag">
                {t}
              </span>
            ))}
          </div>
          <h2 className="hero-card-title">Neighbourhood first, then stars</h2>
          <p className="hero-card-text">
            Choose the area you want to wake up in, then compare ratings and live rates from our hotel partner.
          </p>
        </div>
        <img
          className="hero-card-thumb"
          src="/assets/hero/hotel-lobby-poster.webp"
          alt="A hotel lobby with a bellhop wheeling a luggage cart"
          decoding="async"
        />
      </article>

      <div className="hero-cards-bottom">
        <article className="hero-card hero-card-note">
          <h3 className="hero-card-subtitle">No booking fee from us</h3>
          <p className="hero-card-text">The price at checkout is the property&rsquo;s own rate.</p>
          <a href="/#how-it-works" className="hero-card-link">
            How it works <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </article>

        <div className="hero-card-stat">
          <span className="hero-card-stat-figure">{DESTINATION_COUNT}</span>
          <span className="hero-card-stat-label">
            destinations with
            <br />
            stays compared
          </span>
        </div>

        <article className="hero-card hero-card-note">
          <p className="hero-card-text">
            Where-to-stay guides written neighbourhood by neighbourhood, starting with Dubai.
          </p>
          <Link to="/blog/$slug" params={{ slug: "where-to-stay-in-dubai" }} className="hero-card-link">
            Read the Dubai guide <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
        </article>
      </div>
    </div>
  );
}
