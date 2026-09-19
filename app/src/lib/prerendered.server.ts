/**
 * Prerendered HTML, served instead of rendering React per request.
 *
 * WHY THIS EXISTS. On 19 Sep 2026 the site was returning HTTP 503 (Cloudflare
 * error 1102, `exceededCpu`) on its most important pages. Measured from
 * production, eight plain requests each:
 *
 *     /                  0/8 ok        /about      3/8 ok
 *     /fr/destinations   0/8 ok        /contact    8/8 ok
 *     /destinations      1/8 ok        /hotels     1/8 ok
 *     /flights           1/8 ok        /blog       1/8 ok
 *
 * The Workers Free plan allows roughly 10ms of CPU per request. React SSR of
 * the homepage -- thirteen sections, plus Nav, Newsletter and Footer -- costs
 * 60-100ms. That is not a margin to be tuned; it is six to ten times over, and
 * no amount of trimming sections reaches it while Nav and Footer alone spend
 * most of the budget. `/contact` survives because it is nearly empty.
 *
 * Edge-caching the HTML cannot fix this on its own, which is the part that is
 * easy to get wrong: a cache is only ever populated by a successful render,
 * and the homepage does not have one. 0/8 means there is nothing to cache.
 *
 * So the render moves to build time. scripts/prerender.mjs runs the real
 * production Worker bundle locally -- where there is no CPU limit -- once per
 * indexable URL, and writes the HTML into dist/client/__prerender/. At runtime
 * this module hands that file back and React never renders.
 *
 * WHY NOT dist/client/about/index.html, which Cloudflare would serve on its
 * own with no code at all: because static assets are matched BEFORE the Worker
 * runs, so every one of those files would shadow its route and the Worker
 * would stop seeing the request. It would lose the www -> apex 301, the 34
 * legacy WordPress redirects and the locale-prefix normalisation in
 * server.ts -- all of which exist to keep one URL per page. Parking the HTML
 * under a path that is not a route keeps the Worker in front of every request;
 * all it does differently is answer from a file instead of from React. That
 * costs a binding fetch, which is I/O rather than CPU, and I/O is not what the
 * 10ms limit counts.
 *
 * NO MANIFEST. Which URLs got prerendered is whatever scripts/prerender.mjs
 * found in the sitemap at build time, and asking the asset store is cheaper
 * and more honest than shipping a list that can disagree with the files: a
 * miss is a 404 from the binding, and a 404 falls through to SSR exactly as
 * before. Nothing has to be kept in sync.
 *
 * THE COST OF THIS is that prerendered pages are as fresh as the last deploy.
 * Every page here is editorial content that only changes when the repo does,
 * so a deploy is already the moment it changes. Anything genuinely per-request
 * must stay out of the sitemap -- /account, /wishlist and /reset-password
 * already are, because they were never meant to be indexed either.
 */

type AssetsBinding = { fetch: (request: Request) => Promise<Response> };

/**
 * `/destinations/italy` -> `destinations__italy`, `/` -> `__root`.
 *
 * Flattened rather than nested so the generated directory stays one level
 * deep and readable, and so no key can ever contain a `..` segment: the
 * pathname is rejected outright below if it is not made of plain segments.
 */
export function prerenderKey(pathname: string): string | null {
  const trimmed = pathname.replace(/\/+$/, "");
  if (trimmed === "") return "__root";
  if (!/^(\/[A-Za-z0-9._-]+)+$/.test(trimmed)) return null;
  if (trimmed.split("/").includes("..")) return null;
  return trimmed.slice(1).replace(/\//g, "__");
}

/**
 * The prerendered document for this request, or null to render normally.
 *
 * Null covers every case worth being careful about:
 *
 *   - no ASSETS binding. This is also how scripts/prerender.mjs avoids
 *     serving itself its own previous output: the prerender run has no
 *     bindings at all, so it always falls through to a real render. There is
 *     deliberately no bypass header -- a public one would let anyone force
 *     SSR, which is the expensive path this file exists to avoid.
 *   - anything but GET. A POST to a page must reach the handler.
 *   - a request carrying a session cookie or Authorization. Those responses
 *     are not user-specific today (Nav resolves the signed-in state client
 *     side, through react-query, so the SSR document is identical for
 *     everyone) but that is a property of the current Nav, not a guarantee,
 *     and a shared document is the wrong thing to hand a signed-in visitor if
 *     it ever stops being true.
 *   - a miss in the asset store, which is every URL that was not in the
 *     sitemap when the build ran.
 */
export async function servePrerendered(
  request: Request,
  env: unknown,
): Promise<Response | null> {
  if (request.method !== "GET") return null;

  const assets = (env as { ASSETS?: AssetsBinding } | null | undefined)?.ASSETS;
  if (!assets || typeof assets.fetch !== "function") return null;

  if (request.headers.has("authorization")) return null;
  if (request.headers.get("cookie")?.includes("skynova_session")) return null;

  const url = new URL(request.url);
  const key = prerenderKey(url.pathname);
  if (!key) return null;

  const hit = await assets.fetch(
    new Request(new URL(`/__prerender/${key}.html`, url.origin), { method: "GET" }),
  );
  if (!hit.ok) return null;

  // Rebuilt rather than returned as-is so the document carries this URL's own
  // content type and nothing the asset store attaches about the file it came
  // from -- an etag for /__prerender/about.html is not an etag for /about, and
  // a conditional request quoting it back would get a 304 for the wrong URL.
  // server.ts wraps the result in applySecurityHeaders(), which sets the CSP
  // and the HTML Cache-Control, so both are identical to a rendered response.
  return new Response(hit.body, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
