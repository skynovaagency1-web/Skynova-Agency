import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { applySecurityHeaders } from "./lib/security-headers.server";
import { handleOutboundClick } from "./lib/outbound-clicks.server";
import { handlePageView } from "./lib/page-views.server";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

/** The one hostname the site is meant to be indexed under. Both this and
 * www.skynovaagency.com are attached to the Worker (see
 * wrangler.production.jsonc), so without this redirect every page is
 * reachable at two URLs and search engines split ranking between them. */
const CANONICAL_HOST = "skynovaagency.com";

/** 301 www -> apex, preserving path, query and hash-free URL shape. Returns
 * null when the request is already on the canonical host, or on any host we
 * do not own (workers.dev, previews, localhost) -- those must keep working
 * as-is for testing. */
function redirectToCanonicalHost(request: Request): Response | null {
  const url = new URL(request.url);
  if (url.hostname !== `www.${CANONICAL_HOST}`) return null;
  url.hostname = CANONICAL_HOST;
  return Response.redirect(url.toString(), 301);
}


/**
 * Legacy WordPress URLs.
 *
 * This domain ran a WordPress site before the Worker. Google still has 34 of
 * its URLs on file -- confirmed from a Search Console coverage export:
 * /wp-login.php, /hello-world/, /feed/, ?attachment_id=NNNN and a handful of
 * real content pages. They were all "Excluded by noindex" because WordPress
 * was serving them in maintenance mode.
 *
 * Two separate problems, handled differently.
 *
 * 1. The query-string ones returned HTTP 200 with the HOMEPAGE, because the
 *    router ignores unknown query strings. That is nine crawlable duplicates
 *    of "/" -- almost certainly the source of "Duplicate, Google chose
 *    different canonical than user". Only these specific WordPress params are
 *    matched, never query strings generally: ?token= on the reset page and
 *    the affiliate markers must keep working untouched.
 *
 * 2. A few were real content pages that may still carry links. Those get a
 *    301 to the nearest equivalent so the link equity lands somewhere useful
 *    instead of on a 404. Everything else -- wp-login, feeds, attachments,
 *    /hello-world/ -- is junk and is left to 404, which is the honest answer.
 */
const WP_QUERY_PARAMS = ["attachment_id", "feed", "s", "p", "page_id", "cat", "replytocom"];

const LEGACY_REDIRECTS: Record<string, string> = {
  "/luxury-hotels": "/hotels",
  "/tours-activities": "/tours",
  "/city-tour": "/tours",
  "/activities/city-tour": "/tours",
  "/travel-planning": "/destinations",
  "/trip-types": "/collections",
  "/dubai-page-2": "/destinations/united-arab-emirates",
  "/terms-and-conditions": "/terms",
  "/cookies-policy": "/privacy",
  "/services": "/",
  "/services-5": "/",
};

/** 301s for the legacy set above. Null when the request is not one of them. */
function redirectLegacyUrl(request: Request): Response | null {
  const url = new URL(request.url);

  // Trailing slash normalised for lookup only -- "/luxury-hotels/" and
  // "/luxury-hotels" were both crawled and both need to land in the same place.
  const path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, "") : url.pathname;

  const target = LEGACY_REDIRECTS[path];
  if (target) {
    return Response.redirect(new URL(target, url.origin).toString(), 301);
  }

  // Homepage duplicates: a WordPress param on any path collapses to the path
  // itself, dropping the query entirely.
  if ([...url.searchParams.keys()].some((k) => WP_QUERY_PARAMS.includes(k))) {
    return Response.redirect(new URL(path || "/", url.origin).toString(), 301);
  }

  return null;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const redirect = redirectToCanonicalHost(request);
      if (redirect) return redirect;

      const legacy = redirectLegacyUrl(request);
      if (legacy) return legacy;

      // Affiliate click counter. Handled here, ahead of the SSR handler,
      // because the browser sends these with navigator.sendBeacon -- a plain
      // POST that must be answered as cheaply as possible and never routed
      // through React. See lib/outbound-clicks.server.ts.
      if (request.method === "POST") {
        const path = new URL(request.url).pathname;
        if (path === "/api/click") {
          return applySecurityHeaders(await handleOutboundClick(request));
        }
        // Pageview counter -- same reasoning as above, and the same shape:
        // a cheap beacon answered before React is involved.
        if (path === "/api/view") {
          return applySecurityHeaders(await handlePageView(request));
        }
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return applySecurityHeaders(await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return applySecurityHeaders(
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
    }
  },
};
