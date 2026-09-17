import { createFileRoute } from "@tanstack/react-router";

import { SITE_URL } from "@/lib/seo";
import { LOCALE_TAGS, PUBLISHED_LOCALES, DEFAULT_LOCALE, localePath } from "@/lib/i18n";

import { DESTINATIONS } from "@/data/destinations";
import { ARTICLE_SLUGS } from "@/data/blog-articles";
import { COLLECTION_SLUGS } from "@/data/collections";

const STATIC_PAGES: { path: string; priority: string; changefreq: string }[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/flights", priority: "0.9", changefreq: "weekly" },
  { path: "/hotels", priority: "0.9", changefreq: "weekly" },
  { path: "/car-rentals", priority: "0.8", changefreq: "weekly" },
  { path: "/airport-services", priority: "0.8", changefreq: "weekly" },
  { path: "/esim", priority: "0.8", changefreq: "weekly" },
  { path: "/tours", priority: "0.8", changefreq: "weekly" },
  { path: "/events", priority: "0.8", changefreq: "weekly" },
  { path: "/bike-rentals", priority: "0.7", changefreq: "weekly" },
  // Travel protection and charter. Not in data/verticals.ts (they are not
  // bookings, and the homepage counts that array), so nothing adds them here
  // automatically -- without these three lines they are real, indexable pages
  // that the sitemap never mentions.
  { path: "/flight-compensation", priority: "0.7", changefreq: "monthly" },
  { path: "/travel-insurance", priority: "0.7", changefreq: "monthly" },
  { path: "/yacht-charter", priority: "0.7", changefreq: "monthly" },
  { path: "/destinations", priority: "0.8", changefreq: "weekly" },
  { path: "/collections", priority: "0.8", changefreq: "weekly" },
  { path: "/blog", priority: "0.6", changefreq: "weekly" },
  { path: "/about", priority: "0.5", changefreq: "monthly" },
  { path: "/reviews", priority: "0.5", changefreq: "monthly" },
  { path: "/contact", priority: "0.5", changefreq: "monthly" },
  // Real, indexable, public pages that were serving 200 with no noindex but
  // were never listed here -- so Google could only find them by crawling a
  // link, never from the sitemap. /faq in particular answers actual search
  // queries and carries FAQ markup.
  { path: "/faq", priority: "0.5", changefreq: "monthly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Canonical origin, never the request's. Served from workers.dev this
        // used to emit a full sitemap of workers.dev URLs -- a second, crawlable
        // copy of all 88 pages. A sitemap lists canonical URLs by definition.
        const origin = SITE_URL;
        const today = new Date().toISOString().split("T")[0];

        const urls = [
          ...STATIC_PAGES,
          ...DESTINATIONS.map((d) => ({
            path: `/destinations/${d.slug}`,
            priority: "0.7",
            changefreq: "monthly",
          })),
          // Themed collection pages -- derived from the data, so a new
          // collection appears in the sitemap without a second edit here.
          ...COLLECTION_SLUGS.map((slug) => ({
            path: `/collections/${slug}`,
            priority: "0.8",
            changefreq: "monthly",
          })),
          // Only posts with a written article -- ARTICLE_SLUGS is derived
          // from the articles themselves, so an unwritten post can never
          // leak into the sitemap as a 404.
          ...ARTICLE_SLUGS.map((slug) => ({
            path: `/blog/${slug}`,
            priority: "0.6",
            changefreq: "monthly",
          })),
        ];

        // Every page, once per PUBLISHED locale, each entry carrying the full
        // alternate set. Listing only the English URLs -- which is what this
        // did until 17 Sep 2026 -- left the French site with no way to be
        // discovered: it was routable, rendered, and 780/780 translated, and
        // Google was never told it existed.
        //
        // PUBLISHED_LOCALES, not LOCALES: es and pt are 109/780 and ar is
        // 0/780, so their pages are English under a foreign prefix. Listing
        // those would be asking for a duplicate-content problem, not a
        // translation signal.
        const alternates = (path: string) =>
          [
            ...PUBLISHED_LOCALES.map(
              (loc) =>
                `    <xhtml:link rel="alternate" hreflang="${LOCALE_TAGS[loc]}" href="${origin}${localePath(path, loc)}"/>`,
            ),
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}${localePath(path, DEFAULT_LOCALE)}"/>`,
          ].join("\n");

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
          ...urls.flatMap(({ path, priority, changefreq }) =>
            PUBLISHED_LOCALES.flatMap((loc) => [
              "  <url>",
              `    <loc>${origin}${localePath(path, loc)}</loc>`,
              alternates(path),
              `    <lastmod>${today}</lastmod>`,
              `    <changefreq>${changefreq}</changefreq>`,
              `    <priority>${priority}</priority>`,
              "  </url>",
            ]),
          ),
          "</urlset>",
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
