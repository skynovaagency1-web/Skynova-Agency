import { createFileRoute } from "@tanstack/react-router";

import { SITE_URL } from "@/lib/seo";

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

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls.flatMap(({ path, priority, changefreq }) => [
            "  <url>",
            `    <loc>${origin}${path}</loc>`,
            `    <lastmod>${today}</lastmod>`,
            `    <changefreq>${changefreq}</changefreq>`,
            `    <priority>${priority}</priority>`,
            "  </url>",
          ]),
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
