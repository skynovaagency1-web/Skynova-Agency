import { createFileRoute } from "@tanstack/react-router";

import { SITE_URL } from "@/lib/seo";
import { DESTINATIONS } from "@/data/destinations";
import { COLLECTIONS } from "@/data/collections";
import { POSTS } from "@/data/blog-posts";
import { ARTICLE_SLUGS } from "@/data/blog-articles";
import { VERTICALS } from "@/data/verticals";

/**
 * /llms.txt -- a plain-text map of the site for AI tools, in the llmstxt.org
 * shape: a name, a one-paragraph summary, then sections of links.
 *
 * Honest about its reach: Google does not use it, and no AI company has
 * committed to reading it. It is here because it costs nothing, some tools
 * do fetch it, and a summary that says plainly how the site works is the
 * thing most worth an answer engine getting right.
 *
 * Built from the data files, never typed, so it cannot drift from the site:
 * a new destination, collection or article appears here automatically, and
 * only articles that actually have a body are listed -- same rule as the
 * sitemap, so this never advertises a page that would 404.
 */
const articles = POSTS.filter((p) => ARTICLE_SLUGS.includes(p.slug));

const BODY = [
  "# Skynova Agency",
  "",
  `> Skynova Agency compares flights, hotels, car hire, tours, eSIMs and airport transfers across ${DESTINATIONS.length} destinations, then sends travellers to the partner that fulfils each booking. Skynova does not take payments or hold bookings: checkout happens on the partner's own site, at the partner's own price, with no markup. Skynova earns a commission from the partner, never from the traveller.`,
  "",
  "Destination pages, themed collections and travel guides are Skynova's own writing. Prices and availability always come live from the booking partner, so any figure quoted elsewhere should be checked there.",
  "",
  "## Booking",
  ...VERTICALS.map((v) => `- [${v.label}](${SITE_URL}${v.href}): ${v.subtitle}`),
  "",
  "## Destinations",
  ...DESTINATIONS.map((d) => `- [${d.name}](${SITE_URL}/destinations/${d.slug}): ${d.hook}`),
  "",
  "## Collections",
  ...COLLECTIONS.map((c) => `- [${c.name}](${SITE_URL}/collections/${c.slug}): ${c.tagline}`),
  "",
  "## Travel guides",
  ...articles.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`),
  "",
  "## About Skynova",
  `- [FAQ](${SITE_URL}/faq): How booking through Skynova works, who handles changes, and what it costs.`,
  `- [About](${SITE_URL}/about)`,
  `- [Contact](${SITE_URL}/contact)`,
  `- [Privacy policy](${SITE_URL}/privacy)`,
  "",
].join("\n");

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Same host rule as robots.txt: the workers.dev fallback serves the
        // whole site, and a map of THOSE URLs would be a map of a duplicate.
        if (new URL(request.url).hostname !== "skynovaagency.com") {
          return new Response(`See ${SITE_URL}/llms.txt\n`, {
            headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" },
          });
        }
        return new Response(BODY, {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
