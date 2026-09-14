import { useEffect } from "react";

/**
 * Tilts every card on the site toward the pointer -- the same effect the
 * attraction cards got from components/ui/3d-card.tsx, applied site-wide.
 *
 * ONE DELEGATED LISTENER, not a component around every card. There are nine
 * card types across the site and `.site-panel` alone appears in seventeen
 * files, so wrapping each one would mean editing every page, changing the DOM
 * inside a dozen grids and carousels, and finding out which of them break.
 * A single pointermove on the document with `closest()` reaches all of them,
 * touches no markup, and cannot disturb a layout.
 *
 * It also sidesteps a hook problem: nearly every one of these cards is
 * rendered inside a `.map()`, and a per-card hook cannot be called in a loop.
 *
 * `perspective()` IS IN THE TRANSFORM rather than on a parent. A parent's
 * `perspective` property gives every child one shared vanishing point, so
 * cards away from its centre shear instead of turning -- in a four-across grid
 * the outer two look wrong. The function form gives each card its own vanishing
 * point through its own middle, which is what makes a grid of them read
 * correctly.
 *
 * This is why the attraction cards keep their own component and are excluded
 * here: they lift their contents apart on the Z axis, which needs a real
 * `perspective` parent and `transform-style: preserve-3d`. These cards have no
 * inner layers to separate, so the cheap form is the right one -- and it means
 * `backdrop-filter` and `container-type`, which flatten 3D and which half these
 * cards use, are harmless.
 *
 * Five of the nine lifted on hover (translateY between -2px and -4px) before
 * this. An inline transform overrides a stylesheet one, so that lift would
 * simply have vanished; it is folded into the tilt instead, and the cards that
 * never had one gain it.
 */

/** Every card on the site, minus the attraction cards -- those are Card3D,
 *  which owns its own pointer handling and real per-layer depth. */
/* `.site-panel` is the broadest of these and picks up several cards that have
 * no root class of their own -- the review cards are `site-panel reviews-card`,
 * for instance -- which is why the list is shorter than the count of card
 * types on the site. `.blog-card` and `.guide-card` are deliberately absent:
 * neither exists as a class. The blog's cards are bare `<article>` elements
 * whose children carry the `blog-card-*` names, so `.blog-card` would have
 * matched nothing at all and quietly looked like it was working. */
const TILT_SELECTOR = [
  ".vcard",
  ".dest-mini-card",
  ".route-card",
  ".site-panel",
  ".benefit-tile",
  ".blog-post-card",
].join(",");

/** Sections the owner asked to leave alone: the Trending now carousel and the
 *  Collections covers. Neither uses a selector above -- they have their own
 *  `trend-card-*` and `cover-card-*` classes -- so this changes nothing today.
 *  It is here so that adding, say, `.cover-card-link` to the list above later
 *  cannot quietly start tilting them, and `[data-no-tilt]` gives any future
 *  card a way to opt out without editing this file.
 *
 *  `.tilt-3d` is here for a different reason and is NOT optional: the
 *  destinations directory already tilts its cards through
 *  components/site/TiltCard.tsx, which drives `--tilt-rx`/`--tilt-ry` custom
 *  properties that the stylesheet turns into a transform. An inline transform
 *  from here would win over that rule and the two would fight over the same
 *  property, so cards that already tilt are left to the component that tilts
 *  them. */
const EXCLUDE_SELECTOR = ".trend-flow,.trend-card-link,.cover-card-link,.tilt-3d,[data-no-tilt]";

const MAX_TILT_DEG = 9;
const LIFT_PX = 4;
const HOVER_SCALE = 1.015;

export function CardTilt() {
  useEffect(() => {
    // A mouse, and someone who wants motion. Touch gets nothing: there is no
    // hover to respond to, and a synthetic pointer event would leave a card
    // stuck mid-turn with no leave event to put it back.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return;

    let active: HTMLElement | null = null;
    let frame = 0;
    let pending: { el: HTMLElement; x: number; y: number } | null = null;

    const clear = () => {
      if (active) active.style.transform = "";
      active = null;
    };

    const paint = () => {
      frame = 0;
      if (!pending) return;
      const { el, x, y } = pending;
      const { left, top, width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const rotateX = ((y - top - height / 2) / height) * MAX_TILT_DEG;
      const rotateY = ((x - left - width / 2) / width) * -MAX_TILT_DEG;
      el.style.transform =
        `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) ` +
        `translateY(-${LIFT_PX}px) scale(${HOVER_SCALE})`;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target = event.target as Element | null;
      const card = target?.closest?.(TILT_SELECTOR) as HTMLElement | null;

      if (card !== active) clear();
      if (!card) return;
      if (card.closest(EXCLUDE_SELECTOR)) {
        active = null;
        return;
      }
      active = card;

      pending = { el: card, x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(paint);
    };

    // Leaving a card needs no handler of its own: the move above clears
    // whenever `closest()` stops finding one. This is only for the pointer
    // leaving the WINDOW, after which no move ever arrives to do that.
    //
    // It must be `pointerleave` on the root element, NOT `pointerout` on the
    // document. pointerout bubbles from descendants, so it fires every time
    // the cursor crosses from a card onto its own image or heading -- which
    // wiped the transform microseconds after it was written. The tilt looked
    // completely dead; instrumenting it showed the paint happening and then
    // two clears landing on top of it.
    const onLeaveWindow = () => clear();

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow, { passive: true });
    window.addEventListener("blur", onLeaveWindow);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      window.removeEventListener("blur", onLeaveWindow);
      if (frame) cancelAnimationFrame(frame);
      clear();
    };
  }, []);

  return null;
}
