/**
 * Traveller reviews.
 *
 * EMPTY ON PURPOSE, and it must stay that way until real ones exist.
 *
 * The design this page was built from arrived carrying a worked example:
 * "4.8 / 5", "3,412 verified reviews", twelve named travellers with trip
 * stories, and a note that airport transfers score 4.4. None of that is real
 * -- the site has one registered account, no completed bookings and, at the
 * time of writing, no outbound partner click that was not a test. Shipping
 * those numbers would be inventing social proof and labelling it "verified".
 *
 * That is not a stylistic objection. Publishing fabricated consumer reviews
 * is illegal in all three of this site's main markets: the FTC's Rule on
 * Consumer Reviews and Testimonials (US, in force since Oct 2024, civil
 * penalties per violation), the DMCC Act 2024 (UK) and the Unfair Commercial
 * Practices Directive (EU). It would also be grounds for Travelpayouts to
 * close the affiliate account the whole business runs on.
 *
 * So the page is built to render whatever is in this array and nothing else.
 * Every figure on it -- the average, the review count, the per-star
 * breakdown, the category tallies -- is computed from these rows. With none,
 * the page says so plainly. Add real rows and the whole page populates.
 *
 * This mirrors the rule already applied on /about, where the destination
 * count is counted from DESTINATIONS rather than typed: a stale or invented
 * number on the page that exists to prove the business is real is worse than
 * no number at all.
 */

export const REVIEW_CATEGORIES = [
  "Flights",
  "Hotels",
  "Car rentals",
  "Tours",
  "Events",
  "SIM & eSIM",
  "Airport",
  "Bike rentals",
] as const;

export type ReviewCategory = (typeof REVIEW_CATEGORIES)[number];

export type Review = {
  /** Stable id; used as the React key and for a future reply thread. */
  id: string;
  /** Reviewer's display name, as they gave it. */
  name: string;
  /** "Portugal · Flights + Hotel" -- destination and what they booked. */
  meta: string;
  category: ReviewCategory;
  /** Whole stars only, 1-5. */
  stars: 1 | 2 | 3 | 4 | 5;
  /** "Aug 2026" -- month precision is deliberate, it is not a timestamp. */
  date: string;
  title: string;
  body: string;
};

/** Real reviews only. See the note at the top of this file before adding any. */
export const REVIEWS: Review[] = [];

export type ReviewSummary = {
  count: number;
  /** Mean stars to one decimal, or null when there is nothing to average. */
  average: number | null;
  /** Always five rows, 5 stars down to 1, so the chart keeps its shape at zero. */
  breakdown: { star: number; count: number; pct: number }[];
};

export function summarise(reviews: readonly Review[]): ReviewSummary {
  const count = reviews.length;
  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const n = reviews.filter((r) => r.stars === star).length;
    return { star, count: n, pct: count === 0 ? 0 : Math.round((n / count) * 100) };
  });
  const average =
    count === 0 ? null : Math.round((reviews.reduce((sum, r) => sum + r.stars, 0) / count) * 10) / 10;
  return { count, average, breakdown };
}

/** "★★★★☆" for a whole-star rating. */
export function starString(stars: number) {
  return "★".repeat(stars) + "☆".repeat(5 - stars);
}
