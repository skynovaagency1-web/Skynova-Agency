/**
 * A hero made of type and the site's own gold, with no photograph in it.
 *
 * The three travel-protection and charter pages have no imagery: there is no
 * honest stock shot of "flight compensation", and the alternative -- a
 * generated one, or a borrowed beach -- would be decoration pretending to be
 * documentation. Every other vertical has a real photograph behind its hero
 * because a real photograph exists for it. These get something designed
 * instead, which reads as deliberate rather than as a missing asset.
 *
 * It goes through VerticalPage's `heroSlot`, the same escape hatch /flights
 * uses for its scroll fly-in.
 */
export function PlainHero({
  eyebrow,
  title,
  description,
  ctaHref,
  ctaLabel,
  note,
}: {
  eyebrow: string;
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
  /** The honest small print -- who takes a cut, what is not covered. Sits
   *  under the button rather than at the foot of the page, because it is the
   *  kind of thing a visitor should read before they click, not after. */
  note?: string;
}) {
  return (
    <section className="plainhero">
      <div className="site-container plainhero-inner">
        <p className="site-eyebrow mb-4">{eyebrow}</p>
        <h1 className="site-h2 plainhero-title">{title}</h1>
        <p className="plainhero-lede">{description}</p>
        <div className="plainhero-actions">
          <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="btn-hero-pill">
            <span className="spark" />
            <span>{ctaLabel}</span>
          </a>
        </div>
        {note ? <p className="plainhero-note">{note}</p> : null}
      </div>
    </section>
  );
}
