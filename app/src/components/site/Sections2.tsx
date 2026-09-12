import { useT } from "@/lib/i18n-strings";

/**
 * The partner-logo ticker, and all that is left of this file.
 *
 * Seven other sections lived here (airport, events, eSIM, tours, how it
 * works, why, final CTA) and one file of four more (Sections1: intro,
 * flights, hotels, car rentals). None was rendered by any route -- the
 * homepage uses the Sections3 equivalents -- so they were dead code that
 * still had to be read, typechecked, translated and shipped. Deleted rather
 * than left to rot; git remembers them if a layout is ever wanted back.
 */
export function TrustSection() {
  const t = useT();
  const marks = ["Aviasales", "Hotellook", "Rentalcars", "GetYourGuide", "Airalo", "Tiqets"];
  const track = [...marks, ...marks];
  return (
    <section className="site-section site-hairline border-t overflow-hidden">
      <div className="site-container">
        <p className="site-ink-muted mb-6 text-center text-sm">{t("home.trustLine")}</p>
      </div>
      <div className="marquee-track">
        {track.map((m, i) => (
          <span key={`${m}-${i}`} className="font-mono text-lg tracking-tight opacity-60">{m}</span>
        ))}
      </div>
    </section>
  );
}
