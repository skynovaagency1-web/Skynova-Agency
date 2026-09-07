import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Newsletter } from "@/components/site/Newsletter";
import { DESTINATIONS } from "@/data/destinations";
import { REVIEWS, REVIEW_CATEGORIES, summarise, starString } from "@/data/reviews";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews | Skynova Agency" },
      {
        name: "description",
        content:
          "Reviews from travellers who booked through Skynova Agency, collected after the trip from completed partner bookings and published unedited.",
      },
    ],
  }),
  component: ReviewsPage,
});

/** Layout ported from the Claude Design mockup; palette swapped to the site's
 *  own tokens (the mockup shipped in navy/red, the site is ink/gold).
 *
 *  Every figure is computed from data/reviews.ts. There is deliberately no
 *  path by which a number can appear here that is not backed by a real row --
 *  see the note at the top of that file. */
const BOOKING_TYPE_COUNT = REVIEW_CATEGORIES.length;

function ReviewsPage() {
  const [category, setCategory] = useState<string>("All");
  const [shown, setShown] = useState(6);

  const summary = useMemo(() => summarise(REVIEWS), []);
  const filtered = useMemo(
    () => (category === "All" ? REVIEWS : REVIEWS.filter((r) => r.category === category)),
    [category],
  );
  const visible = filtered.slice(0, shown);
  const hasMore = filtered.length > visible.length;
  const isEmpty = summary.count === 0;

  return (
    <>
      <Nav />
      <main className="reviews-page">
        <div className="site-container">
          <section className="reviews-hero">
            <p className="site-eyebrow">Reviews</p>
            <h1 className="site-h2 reviews-title">What travellers say after they land.</h1>
            <p className="reviews-lede">
              Every review is collected after the trip is over, from a completed partner booking. We publish
              them unedited, including the ones that sting.
            </p>
          </section>

          <section className="reviews-summary">
            <div className="site-panel reviews-score">
              {isEmpty ? (
                <>
                  <div className="reviews-score-figure">
                    <span className="reviews-score-number reviews-score-empty">&mdash;</span>
                    <span className="reviews-score-of">/ 5</span>
                  </div>
                  <p className="reviews-stars reviews-stars-empty" aria-hidden="true">
                    {starString(0)}
                  </p>
                  <p className="reviews-score-note">
                    No verified reviews yet. Reviews open here as soon as the first trips booked through
                    Skynova are completed &mdash; nothing is published before then.
                  </p>
                </>
              ) : (
                <>
                  <div className="reviews-score-figure">
                    <span className="reviews-score-number">{summary.average?.toFixed(1)}</span>
                    <span className="reviews-score-of">/ 5</span>
                  </div>
                  <p className="reviews-stars" aria-hidden="true">
                    {starString(Math.round(summary.average ?? 0))}
                  </p>
                  <p className="reviews-score-note">
                    From{" "}
                    <strong>
                      {summary.count} verified review{summary.count === 1 ? "" : "s"}
                    </strong>{" "}
                    across {DESTINATIONS.length} destinations and {BOOKING_TYPE_COUNT} booking types.
                  </p>
                </>
              )}
            </div>

            <div className="site-panel reviews-breakdown">
              <p className="reviews-breakdown-label">Rating breakdown</p>
              <div className="reviews-breakdown-rows">
                {summary.breakdown.map((row) => (
                  <div key={row.star} className="reviews-breakdown-row">
                    <span className="reviews-breakdown-star">{row.star}★</span>
                    <span className="reviews-breakdown-track">
                      <span
                        className="reviews-breakdown-fill"
                        style={{ width: `${row.pct}%`, opacity: 0.35 + (row.star / 5) * 0.65 }}
                      />
                    </span>
                    <span className="reviews-breakdown-pct">{row.pct}%</span>
                  </div>
                ))}
              </div>
              <p className="reviews-breakdown-note">
                {isEmpty
                  ? "The breakdown fills in from published reviews. Nothing is estimated or carried over from anywhere else."
                  : "Every star shown is counted from a published review — no weighting, no editing."}
              </p>
            </div>
          </section>

          <section className="reviews-filters">
            <div className="reviews-filter-chips">
              {["All", ...REVIEW_CATEGORIES].map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`reviews-chip${c === category ? " is-active" : ""}`}
                  onClick={() => {
                    setCategory(c);
                    setShown(6);
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            <span className="reviews-result-count">
              {filtered.length} review{filtered.length === 1 ? "" : "s"}
            </span>
          </section>

          {isEmpty ? (
            <section className="reviews-empty site-panel">
              <h2 className="reviews-empty-title">Nothing published yet.</h2>
              <p className="reviews-empty-body">
                Skynova does not hold your booking &mdash; the partner does. That means a review can only be
                requested once a partner confirms the trip actually happened, which is what makes the
                &ldquo;verified&rdquo; label on this page mean anything. The first ones will appear here.
              </p>
            </section>
          ) : (
            <section className="reviews-grid">
              {visible.map((r) => (
                <article key={r.id} className="site-panel reviews-card">
                  <div className="reviews-card-top">
                    <span className="reviews-card-stars" aria-label={`${r.stars} out of 5 stars`}>
                      {starString(r.stars)}
                    </span>
                    <span className="reviews-card-date">{r.date}</span>
                  </div>
                  <h3 className="reviews-card-title">{r.title}</h3>
                  <p className="reviews-card-body">{r.body}</p>
                  <div className="reviews-card-foot">
                    <span className="reviews-card-avatar" aria-hidden="true">
                      {r.name.trim().charAt(0).toUpperCase()}
                    </span>
                    <span className="reviews-card-who">
                      <span className="reviews-card-name">{r.name}</span>
                      <span className="reviews-card-meta">{r.meta}</span>
                    </span>
                    <span className="reviews-card-verified">Verified</span>
                  </div>
                </article>
              ))}
            </section>
          )}

          <section className="reviews-more">
            {hasMore ? (
              <button type="button" className="reviews-more-btn" onClick={() => setShown((n) => n + 6)}>
                Show more reviews <span className="reviews-more-arrow">&darr;</span>
              </button>
            ) : null}
            <p className="reviews-policy">
              Reviews are requested 48 hours after the last leg of a trip. We can&rsquo;t edit or remove a
              verified review &mdash; only reply to it.
            </p>
          </section>
        </div>
      </main>
      <Newsletter />
      <Footer />
    </>
  );
}
