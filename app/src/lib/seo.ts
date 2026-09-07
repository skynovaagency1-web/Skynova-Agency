/** Canonical origin. Matches CANONICAL_HOST in server.ts and the <link rel="canonical"> in __root.tsx. */
export const SITE_URL = "https://skynovaagency.com";

/** Absolute URL for a site-relative path. Schema.org `url`/`@id` values must be absolute. */
export function absUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Serialises JSON-LD for embedding in a <script> tag.
 *
 * The escape is not optional. A string containing "</script>" anywhere in the
 * graph would close the tag early and drop the remainder of the document into
 * the page as markup. Escaping "<" as < is still valid JSON and still
 * parses to the same string, so nothing downstream notices. Today every value
 * comes from files in data/, but FAQ answers and hotel descriptions are exactly
 * the kind of prose that later gets sourced from a CMS.
 */
export function jsonLd(graph: unknown) {
  return JSON.stringify(graph).replace(/</g, "\\u003c");
}

export type Crumb = { name: string; path?: string };

/**
 * BreadcrumbList for a trail. The LAST crumb is the current page and is
 * emitted without an `item`, which is what Google expects -- a self-link on
 * the final crumb is the most common way these get rejected.
 */
export function breadcrumbJsonLd(trail: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      ...(crumb.path && i < trail.length - 1 ? { item: absUrl(crumb.path) } : {}),
    })),
  };
}

/**
 * The year stamped on guide titles.
 *
 * A literal, not `new Date().getFullYear()`. A title that silently rolls to
 * "2027" on 1 January claims the guide was reviewed when it was not -- the
 * number is a freshness signal to a searcher, so it should only move when
 * someone has actually gone through the guides. One line to bump, once a year.
 */
export const GUIDE_YEAR = 2026;

/**
 * Destination guide title, kept inside Google's ~60-character display limit.
 *
 * The full suffix runs to 64 characters on the longest destination name
 * ("United Arab Emirates"), which truncates mid-phrase in results. Rather
 * than shorten the suffix for all 42, this drops the weakest term only on
 * the names that need it, so short names keep the richer title.
 */
export function destinationTitle(name: string) {
  const full = `${name} Travel Guide ${GUIDE_YEAR} | Flights, Hotels & Tours`;
  return full.length <= 60 ? full : `${name} Travel Guide ${GUIDE_YEAR} | Flights & Hotels`;
}
