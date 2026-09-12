import { Link } from "@tanstack/react-router";

import { VERTICALS } from "@/data/verticals";
import { useT } from "@/lib/i18n-strings";

/**
 * The eight verticals, as arch-topped glass cards over the cloud section.
 *
 * This replaced a curated six icon tiles plus a hover-preview panel. The
 * panel existed to show a title and subtitle for whichever tile you were
 * pointing at -- one at a time, and nothing at all on a touch screen, where
 * there is no hover. Putting the copy on the card shows all eight at once
 * and works the same way under a finger as under a cursor.
 *
 * After the owner's reference: a photograph behind frosted glass, an arched
 * head, a small chip floating over the image, and the name in display type.
 * The rim is the site's existing two-layer background-clip trick
 * (--sky-glass-edge), not a flat border, so it catches light along the top
 * and bottom edges the way the reference does.
 */
export function VerticalExplorerSection() {
  const t = useT();

  return (
    <section data-rail-dark="" className="site-section cloud-photo-section">
      <div className="site-container">
        <p className="site-eyebrow mb-3">{t("home.exploreVertical")}</p>
        <h2 className="site-h2 max-w-lg text-3xl md:text-4xl">{t("home.everyTripHeading")}</h2>
        <div className="vcard-grid mt-8">
          {VERTICALS.map((v) => (
            <Link key={v.key} to={v.href} className="vcard">
              <span className="vcard-media" aria-hidden="true">
                <img src={v.image} alt="" loading="lazy" decoding="async" />
                <span className="vcard-scrim" />
              </span>
              <span className="vcard-chip">
                <v.icon size={13} aria-hidden="true" />
                {v.label}
              </span>
              <span className="vcard-body">
                <span className="vcard-title">{v.title}</span>
                <span className="vcard-sub">{v.subtitle}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
