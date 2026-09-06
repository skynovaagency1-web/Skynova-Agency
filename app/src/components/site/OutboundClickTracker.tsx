import { useEffect } from "react";

/**
 * Counts clicks on affiliate links, site-wide, from one listener.
 *
 * Deliberately a delegated listener on the document rather than an onClick on
 * each link. There are ~52 affiliate anchors across the site today and there
 * will be more; wiring each one means every future link is one forgotten prop
 * away from being invisible in the numbers, and the bug is silent -- a missing
 * count looks exactly like nobody clicking. Delegation covers every affiliate
 * link that exists now and every one added later, with nothing to remember.
 *
 * `sendBeacon`, not fetch: many of these links open in the same tab, and a
 * normal fetch is cancelled as soon as the page starts unloading. The beacon
 * is queued by the browser and delivered regardless. It also never blocks the
 * click -- the visitor leaves at exactly the same speed either way.
 *
 * What leaves the browser is: the partner host, the vertical, the destination
 * slug if we are on a guide, and the path. No identifiers of any kind, and
 * nothing is written to the visitor's device.
 */

/** Must stay in step with PARTNER_VERTICALS in lib/outbound-clicks.server.ts.
 *  The server re-derives the vertical from the host and ignores ours if they
 *  disagree, so a drift here under-counts but can never mis-file. */
const PARTNER_HOSTS: Record<string, string> = {
  "www.aviasales.com": "flights",
  "aviasales.com": "flights",
  "search.hotellook.com": "hotels",
  "hotellook.com": "hotels",
  "www.rentalcars.com": "cars",
  "rentalcars.com": "cars",
  "gettransfer.com": "transfers",
  "www.tiqets.com": "events",
  "tiqets.com": "events",
  "www.airalo.com": "esim",
  "airalo.com": "esim",
  "www.getyourguide.com": "tours",
  "getyourguide.com": "tours",
};

/** /destinations/<slug> -> <slug>; anything else -> null. */
function destinationSlugFromPath(path: string): string | null {
  const m = /^\/destinations\/([a-z0-9-]{1,64})\/?$/.exec(path);
  return m ? m[1] : null;
}

export function OutboundClickTracker() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.sendBeacon) return;

    function onClick(event: MouseEvent) {
      // Only a plain primary click counts. Modifier-clicks and middle-clicks
      // open a background tab, which is a real click -- but the browser fires
      // these for right-click menus too, and counting those would inflate
      // every number on the page.
      if (event.defaultPrevented || event.button !== 0) return;

      const target = event.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      let host: string;
      try {
        host = new URL(anchor.href).host;
      } catch {
        return; // mailto:, tel:, or a malformed href
      }

      const vertical = PARTNER_HOSTS[host];
      if (!vertical) return; // an ordinary internal link

      const path = window.location.pathname;
      try {
        navigator.sendBeacon(
          "/api/click",
          new Blob(
            [
              JSON.stringify({
                partner: host,
                vertical,
                destinationSlug: destinationSlugFromPath(path),
                pagePath: path,
              }),
            ],
            { type: "application/json" },
          ),
        );
      } catch {
        // Counting is never allowed to interfere with the click itself.
      }
    }

    // Capture phase, so a handler that stops propagation further down cannot
    // hide the click from the count.
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
