import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Counts a pageview on first load and on every client-side route change.
 *
 * The route change half matters more than it looks: this is a single-page app,
 * so after the first load the server never sees another navigation. Anything
 * that counts only server requests would report the homepage and nothing else,
 * however far someone browsed.
 *
 * `sendBeacon` for consistency with the click tracker, and because it cannot
 * delay a navigation even in principle.
 *
 * The referrer is sent only on the FIRST view of a session's page load. On a
 * client-side route change document.referrer still holds whatever brought the
 * visitor to the site, so counting it again on every hop would multiply one
 * arrival into a dozen -- Google would look like it sent ten times the traffic
 * it did, purely as a function of how much someone read.
 *
 * Nothing identifying leaves the browser and nothing is stored on the device.
 * The counters are aggregate, so this measures views, not visitors -- see the
 * migration for why that limit is deliberate.
 */
export function PageViewTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // StrictMode runs effects twice in development, and a route can re-render
  // for reasons that are not navigation. Counting the same path twice in a row
  // would quietly inflate every number.
  const lastSent = useRef<string | null>(null);
  const isFirst = useRef(true);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.sendBeacon) return;
    if (lastSent.current === pathname) return;
    lastSent.current = pathname;

    const referrer = isFirst.current ? document.referrer || null : null;
    isFirst.current = false;

    try {
      navigator.sendBeacon(
        "/api/view",
        new Blob([JSON.stringify({ path: pathname, referrer })], {
          type: "application/json",
        }),
      );
    } catch {
      // Counting never interferes with the page.
    }
  }, [pathname]);

  return null;
}
