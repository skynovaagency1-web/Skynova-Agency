import * as React from "react";
import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

/**
 * Skewed gradient cards, after the 21st.dev "gradient-card-showcase"
 * reference: a colour panel sitting at an angle behind a glass plate, both
 * straightening and spreading as the card is hovered, with two soft blobs
 * drifting in at the corners.
 *
 * The mechanic is kept whole. What changed is everything that would have made
 * it a foreign object on this site:
 *
 * COLOUR. The reference ships neon -- #ff0058 into #03a9f4, #4dff03 into
 * #00d0ff. This site is gold on warm ink and has no blue anywhere in it by
 * deliberate choice (see the note on DayNightToggle). Three neon cards in the
 * middle of the hero would read as someone else's component pasted in. The
 * gradients here are the site's own palette at three different depths, which
 * keeps the cards distinguishable without introducing a second colour system.
 *
 * SIZE. The reference is 320x400 with 30px side margins, which at 375px wide
 * overflows the viewport before the first card is finished. These are fluid:
 * one column on a phone, three across from 900px.
 *
 * KEYFRAMES. The reference re-emits its @keyframes in a <style> element on
 * every render, and one of the three rules in it is malformed besides (an
 * escaped arbitrary-value selector that matches nothing). They live in
 * styles.css with the rest of the site's animation, where the reduced-motion
 * block can reach them.
 *
 * LINKS. The reference's "Read More" is href="#" three times. A dead link in a
 * hero is worse than no link, so a card renders its action only when given a
 * real destination.
 *
 * The resting state matters more than the hover here: there is no hover on a
 * phone, so the skewed-panel state is the only one a touch visitor will ever
 * see. It is composed to look finished on its own rather than as the "before"
 * of an animation.
 */
export interface GradientCard {
  title: string;
  description: string;
  /** Internal route for the card's action. Omitted, no action is rendered. */
  to?: string;
  /** Same-page anchor, for sections rather than routes. */
  href?: string;
  actionLabel?: string;
  /** Two stops for the panel behind the glass. */
  gradientFrom: string;
  gradientTo: string;
}

export interface GradientCardShowcaseProps extends React.HTMLAttributes<HTMLDivElement> {
  cards: GradientCard[];
}

export function GradientCardShowcase({ cards, className, ...props }: GradientCardShowcaseProps) {
  return (
    <div className={cn("skewcards", className)} {...props}>
      {cards.map((card) => (
        <article key={card.title} className="skewcard">
          <span
            className="skewcard-panel"
            style={{ background: `linear-gradient(315deg, ${card.gradientFrom}, ${card.gradientTo})` }}
            aria-hidden="true"
          />
          <span
            className="skewcard-panel skewcard-panel-glow"
            style={{ background: `linear-gradient(315deg, ${card.gradientFrom}, ${card.gradientTo})` }}
            aria-hidden="true"
          />

          <span className="skewcard-blobs" aria-hidden="true">
            <span className="skewcard-blob skewcard-blob-a" />
            <span className="skewcard-blob skewcard-blob-b" />
          </span>

          <div className="skewcard-body">
            <h3 className="skewcard-title">{card.title}</h3>
            <p className="skewcard-text">{card.description}</p>
            {card.to ? (
              <Link to={card.to} className="skewcard-action">
                {card.actionLabel}
              </Link>
            ) : card.href ? (
              <a href={card.href} className="skewcard-action">
                {card.actionLabel}
              </a>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export default GradientCardShowcase;
