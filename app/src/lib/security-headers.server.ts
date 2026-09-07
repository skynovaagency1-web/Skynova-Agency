/**
 * Security headers applied to every Worker response. Import in app/src/server.ts
 * and wrap the final response: `return applySecurityHeaders(response)`.
 */
export function applySecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  // The deployment platform owns `frame-ancestors`; setting it here would add
  // a second, intersecting policy that can block the host preview.
  headers.set(
    "Content-Security-Policy",
    "default-src 'self'; " +
      // Travelpayouts affiliate widgets (AffiliateWidget.tsx, used on the
      // tours and car-rentals pages) load their real content from these --
      // tpscr.com/tp.media serve the initial embed script, which then
      // pulls the actual widget engine from static.localrent.com. Without
      // these, the script load is silently blocked by CSP and the widget
      // never renders (its container just stays empty).
      // static.cloudflareinsights.com serves the Web Analytics beacon (see
      // lib/analytics.tsx). Without it the script is blocked silently and no
      // pageviews are ever recorded -- the dashboard just stays empty, which
      // looks like "no traffic" rather than a broken policy.
      // cdn.klook.com is the TOURS widget on /tours -- which had never once
      // rendered in production. tpscr.com served its loader, the loader asked
      // for Klook, CSP refused, and the page showed a 60px empty box that
      // looked like a widget with no inventory. Found by reading the console,
      // not the page.
      //
      // widgets.tiqets.com / tpo.gg / tpemb.com are the Tiqets card widget:
      // tpscr.com only serves a loader that pulls those three. Without them
      // the widget renders NOTHING, with no error anyone would notice --
      // the same silent failure that hid the missing fonts and the blank
      // globe. Verified by reading the loader payload, not assumed.
      "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://tpscr.com https://tp.media https://static.localrent.com https://widgets.tiqets.com https://tpo.gg https://tpemb.com https://cdn.klook.com https://*.travelpayouts.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      // `data:` is required, not optional. Vite inlines any asset under its
      // 4 KB threshold, and the three IBM Plex Mono subsets (--font-mono)
      // land just under it, so they ship as data: URIs inside our own
      // stylesheet. Without this they are blocked and every eyebrow, label
      // and mono caption on the site silently falls back to the system
      // monospace -- visible everywhere, and only reported in the console.
      "font-src 'self' data: https://fonts.gstatic.com; " +
      // `blob:` is required by Globe3D. A .glb keeps its textures inside the
      // binary chunk, and three's GLTFLoader extracts each one into a Blob and
      // loads it through a blob: URL -- with img-src/connect-src refusing
      // blob:, every texture resolved to null and the Earth rendered as a
      // plain white sphere, with no CSP violation logged for the img itself.
      "img-src 'self' data: blob: https:; media-src 'self' https:; " +
      // Covers the beacon's POST to cloudflareinsights.com as well, plus the
      // blob: URLs GLTFLoader fetches for embedded model textures.
      "connect-src 'self' blob: https:; " +
      // auth.higgsfield.app was removed here: the site left Higgsfield's
      // platform on 4 Sep 2026 and no longer frames their login.
      // Tiqets renders its cards into an IFRAME on www.tiqets.com, so allowing
      // its script was only half of it -- script-src got the loader running and
      // frame-src then blocked what it drew, leaving an empty container that
      // looked exactly like a widget with no inventory. Caught in the console,
      // not by reading the page.
      "frame-src 'self' https://localrent.com https://*.localrent.com https://www.tiqets.com https://*.tiqets.com https://*.klook.com https://*.travelpayouts.com; " +
      "base-uri 'self'; form-action 'self'",
  );
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  headers.set("X-XSS-Protection", "0");

  // SSR documents went out with NO cache directives at all -- no Cache-Control,
  // no ETag, no Last-Modified. With none of the three a browser may apply its
  // own heuristic freshness and keep serving a stale document for as long as
  // it likes, which pins that device to an old content-hashed stylesheet and
  // makes every subsequent deploy invisible on it. Reported as "I still can't
  // see it on my phone" while the same URL was correct everywhere else.
  //
  // `no-cache` still stores the document; it just forces revalidation, so the
  // common case is a 304 and nothing is slower. Only the HTML needs this --
  // /assets/* is content-hashed and immutable, and must keep its long TTL.
  const contentType = headers.get("Content-Type") ?? "";
  if (contentType.includes("text/html")) {
    headers.set("Cache-Control", "no-cache");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
