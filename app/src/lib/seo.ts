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
