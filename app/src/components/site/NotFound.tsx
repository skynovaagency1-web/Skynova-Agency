import { Link } from "@tanstack/react-router";

import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { DESTINATIONS } from "@/data/destinations";

/**
 * 404 page.
 *
 * Structure adapted from a reference design: a full-bleed scenic photograph,
 * everything centred, an oversized display "404" tinted to sit inside the
 * photo's own palette, one line of copy and a single call to action.
 *
 * Two deliberate departures from the reference. Its palette was lavender and
 * pale blue, which fights this site's cream and gold -- the tint here is the
 * brand accent instead, over a dawn-toned photograph chosen to match the
 * original's calm. And a slim row of destinations sits below the fold: the
 * reference offers exactly one way out, which is elegant but leaves someone
 * who mistyped a URL with nowhere useful to go.
 *
 * The backdrop is a real destination photo referenced through DESTINATIONS,
 * so it cannot point at a file that is not there.
 */

const BACKDROP = "turkey";
const SUGGESTED = ["japan", "italy", "kenya", "portugal", "thailand", "canada"] as const;

export function NotFound() {
  const picks = SUGGESTED.map((s) => DESTINATIONS.find((d) => d.slug === s)).filter(
    (d): d is NonNullable<typeof d> => Boolean(d),
  );

  return (
    <>
      <Nav />
      <main>
        <section className="nf-hero">
          <img
            src={`/assets/destinations/${BACKDROP}.webp`}
            alt=""
            aria-hidden="true"
            className="nf-hero-media"
          />
          <div className="nf-hero-veil" />
          <div className="nf-hero-copy">
            <p className="nf-code" aria-hidden="true">
              404
            </p>
            <h1 className="nf-title">This route doesn&rsquo;t exist.</h1>
            <p className="nf-sub">
              The page has moved, or the link was mistyped. Everything else is where you left it.
            </p>
            <Link to="/" className="btn-hero-pill nf-cta">
              <span className="spark" />
              <span>Back to the homepage</span>
            </Link>
          </div>
        </section>

        <section className="site-section">
          <div className="site-container nf-onward">
            <p className="site-eyebrow mb-4">Or pick up somewhere else</p>
            <div className="collection-more">
              {picks.map((d) => (
                <Link
                  key={d.slug}
                  to="/destinations/$slug"
                  params={{ slug: d.slug }}
                  className="collection-chip"
                >
                  <span aria-hidden="true">{d.flag}</span> {d.name}
                </Link>
              ))}
              <Link to="/destinations" className="collection-chip">
                All {DESTINATIONS.length} destinations →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
