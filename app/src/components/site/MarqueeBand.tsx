/**
 * Infinite horizontal marquee band.
 *
 * The seam is the whole problem, and it is solved by construction rather than
 * by picking a duration long enough to hide it:
 *
 *   - The track holds EXACTLY TWO identical copies of the item list.
 *   - The animation translates it from 0 to -50%.
 *   - At -50% the second copy sits precisely where the first started, so the
 *     reset to 0 is invisible. There is no jump because there is nothing to
 *     jump over.
 *
 * The one thing that breaks this is uneven spacing between the copies. The
 * gap is therefore baked into each group as trailing padding rather than set
 * with `gap` on the track -- a track-level gap would add one extra space
 * between the two copies that is not inside the 50%, and the seam would tick
 * on every loop.
 *
 * The second copy is aria-hidden: it is the same content twice, and a screen
 * reader should read it once.
 *
 * Class names are prefixed svc- because the site already ships a .marquee /
 * .marquee-track pair for the partner-logo ticker (Sections2.tsx). Reusing
 * those names silently restyled that component and made this one impossible
 * to measure -- every query matched the other element.
 */

const ITEMS = [
  "Flights",
  "Hotels",
  "Car rentals",
  "Airport transfers",
  "eSIM & data",
  "Tours & activities",
  "Events & tickets",
  "Bike rentals",
];

function MarqueeGroup({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="svc-marquee-group" aria-hidden={hidden || undefined}>
      {ITEMS.map((item) => (
        <li key={item} className="svc-marquee-item">
          <span>{item}</span>
          <span className="svc-marquee-sep" aria-hidden="true">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
}

export function MarqueeBand() {
  return (
    <section className="svc-marquee" aria-label="What Skynova books">
      <div className="svc-marquee-track">
        <MarqueeGroup />
        <MarqueeGroup hidden />
      </div>
    </section>
  );
}
