import { createFileRoute } from "@tanstack/react-router";

import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        // The Worker is reachable on more than the canonical host --
        // skynova-agency.skynovaagency.workers.dev serves the whole site at
        // 200, deliberately, so it stays usable for testing. But it was also
        // serving "Allow: /" plus a sitemap of its OWN hostnames, which is an
        // open invitation to crawl and index a complete duplicate of the
        // site. Canonical tags already point every page at the apex, so
        // Google was unlikely to pick the wrong one -- but the crawl budget
        // spent on it is real, and it is the sort of thing that ends up in
        // "Duplicate, Google chose different canonical than user".
        //
        // Kept reachable, told not to be indexed. Redirecting instead would
        // remove the emergency fallback documented in MIGRATION.md.
        const isCanonicalHost = url.hostname === "skynovaagency.com";
        if (!isCanonicalHost) {
          const body = ["User-agent: *", "Disallow: /"].join("\n");
          return new Response(body, {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Cache-Control": "public, max-age=86400",
            },
          });
        }
        const body = ["User-agent: *", "Allow: /", "", `Sitemap: ${SITE_URL}/sitemap.xml`].join("\n");
        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
