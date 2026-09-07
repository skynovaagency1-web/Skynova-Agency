import { bindings } from "./bindings.server";

/**
 * Counts a pageview.
 *
 * Public and unauthenticated, like the click endpoint, so nothing that lands
 * in the table may come from the caller unchecked. The path is validated
 * against the site's ACTUAL routes rather than a shape -- a regex like
 * `^/[\w/-]*$` would happily accept ten thousand invented paths and turn the
 * table into whatever a bot felt like writing. Only paths that correspond to
 * a real page are counted.
 */

/** Routes with no parameter. Kept in step with src/routes/. */
const EXACT_PATHS = new Set([
  "/",
  "/about",
  "/account",
  "/airport-services",
  "/app",
  "/bike-rentals",
  "/blog",
  "/car-rentals",
  "/collections",
  "/contact",
  "/destinations",
  "/esim",
  "/events",
  "/faq",
  "/flights",
  "/gift",
  "/hotels",
  "/privacy",
  "/share",
  "/terms",
  "/tours",
  "/wishlist",
]);

/** The three parameterised routes. The slug shape is bounded so a long or
 *  exotic segment cannot be used to write junk under a valid prefix. */
const SLUG_ROUTES = ["/destinations/", "/collections/", "/blog/"];
const SLUG = /^[a-z0-9-]{1,64}$/;

function isRealPath(path: string): boolean {
  if (EXACT_PATHS.has(path)) return true;
  for (const prefix of SLUG_ROUTES) {
    if (path.startsWith(prefix)) return SLUG.test(path.slice(prefix.length));
  }
  return false;
}

/** Host only, lower-cased, bounded. Never the full referring URL: that can
 *  carry someone else's private path or query string, and the host answers
 *  "where did they come from" without inheriting their leak. */
function refererHost(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  let host: string;
  try {
    host = new URL(value).hostname.toLowerCase();
  } catch {
    return null;
  }
  if (!host || host.length > 100) return null;
  // Our own pages are not a traffic source.
  if (host === "skynovaagency.com" || host === "www.skynovaagency.com") return null;
  return host;
}

export async function handlePageView(request: Request): Promise<Response> {
  const noContent = new Response(null, { status: 204 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return noContent;
  }
  if (!body || typeof body !== "object") return noContent;

  const { path, referrer } = body as Record<string, unknown>;
  if (typeof path !== "string" || !isRealPath(path)) return noContent;

  const { DB } = bindings();
  if (!DB) return noContent;

  // UTC, so a day boundary means the same thing wherever it is read from.
  const day = new Date().toISOString().slice(0, 10);
  const host = refererHost(referrer);

  try {
    const statements = [
      DB.prepare(
        "INSERT INTO page_views_daily (path, day, views) VALUES (?, ?, 1) " +
          "ON CONFLICT(path, day) DO UPDATE SET views = views + 1",
      ).bind(path, day),
    ];
    if (host) {
      statements.push(
        DB.prepare(
          "INSERT INTO referrers_daily (host, day, hits) VALUES (?, ?, 1) " +
            "ON CONFLICT(host, day) DO UPDATE SET hits = hits + 1",
        ).bind(host, day),
      );
    }
    // One round trip for both counters.
    await DB.batch(statements);
  } catch (error) {
    // A failed count is never the visitor's problem.
    console.error("pageview insert failed", error);
  }

  return noContent;
}
