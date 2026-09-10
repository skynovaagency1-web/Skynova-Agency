import { useEffect, useSyncExternalStore } from "react";

import { getConsent, getServerConsent, subscribeConsent } from "@/lib/consent";

/**
 * Cloudflare Web Analytics.
 *
 * Chosen over Google Analytics originally because it sets no cookies and
 * stores no personal data, so it needs no consent banner under GDPR/
 * ePrivacy. It still runs unconditionally for exactly that reason. Google
 * Analytics has since been added below it, but gated on consent -- the two
 * are complementary, not a replacement of one by the other.
 *
 * ── To switch it on ──────────────────────────────────────────────────────
 * 1. Cloudflare dashboard -> Analytics & Logs -> Web Analytics -> Add a site
 * 2. Enter skynovaagency.com. Leave "automatic setup" OFF -- the beacon is
 *    injected by this file instead, so enabling both double-counts every view.
 * 3. Copy the token out of the snippet it shows you (the value of
 *    data-cf-beacon's "token" field) and paste it below.
 * 4. Rebuild and deploy.
 *
 * Until a token is set this renders nothing at all, so it is safe to ship.
 *
 * NOTE: the beacon host is allow-listed in lib/security-headers.server.ts.
 * Removing it there blocks the script and silently records zero traffic.
 */
const CF_BEACON_TOKEN = "6a88a8ccc31e4bfaa656bbe76ed3dc95";

export function Analytics() {
  if (!CF_BEACON_TOKEN) return null;
  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: CF_BEACON_TOKEN })}
    />
  );
}

/** True when analytics is actually configured -- handy for a build-time or
 * runtime check that the launch step wasn't forgotten. */
export const ANALYTICS_ENABLED = CF_BEACON_TOKEN.length > 0;

/**
 * Google Analytics 4 -- gated on cookie consent (lib/consent.ts and
 * components/site/CookieConsent.tsx). GA sets an identifying cookie (_ga),
 * which under GDPR/ePrivacy needs opt-in consent before it may fire for an
 * EU visitor, so nothing from Google is requested until the banner records
 * an "accept."
 *
 * NOTE: googletagmanager.com is allow-listed in script-src in
 * lib/security-headers.server.ts. GA's own beacon back to
 * google-analytics.com is already covered by the wildcard `https:` on
 * connect-src and img-src, so that one host is all GA needed.
 */
const GA_MEASUREMENT_ID = "G-FWTV0XG4LP";

/** Marks the injected loader so a re-render, or a decline-then-accept, can
 * never append a second copy and double-count every page view. */
const GA_SCRIPT_ID = "ga4-loader";

export function GoogleAnalytics() {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, getServerConsent);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    // Google's official opt-out flag. Once gtag.js is in the page it cannot
    // be unloaded, so a visitor who accepts and later declines needs this
    // rather than a removeChild -- it stops the script sending anything.
    // Set on every run, in both directions, so the current choice always
    // wins over whatever the previous one left behind.
    (window as unknown as Record<string, boolean>)[`ga-disable-${GA_MEASUREMENT_ID}`] =
      consent !== "granted";

    if (consent !== "granted") return;
    if (document.getElementById(GA_SCRIPT_ID)) return;

    // Injected imperatively rather than rendered as JSX. A <script> element
    // built with createElement and appended runs when it enters the
    // document -- unambiguously, by spec -- whereas a React-rendered inline
    // script depends on React's own script handling, which differs between
    // the streamed SSR pass and a client re-render. This component mounts
    // with consent unknown and only ever turns GA on client-side, so it is
    // always the client path that has to work.
    //
    // The bootstrap goes in FIRST and is deliberately the verbatim Google
    // snippet: gtag() and dataLayer have to exist before the loader below
    // finishes fetching, or the queued 'js' and 'config' calls are lost.
    const boot = document.createElement("script");
    boot.textContent =
      "window.dataLayer=window.dataLayer||[];" +
      "function gtag(){dataLayer.push(arguments);}" +
      "gtag('js',new Date());" +
      // anonymize_ip truncates the visitor's IP before Google ever stores
      // it -- one of the concrete conditions EU guidance treats as making
      // analytics lower-risk, so it stays on regardless of what was asked.
      `gtag('config','${GA_MEASUREMENT_ID}',{anonymize_ip:true});`;
    document.head.appendChild(boot);

    const loader = document.createElement("script");
    loader.id = GA_SCRIPT_ID;
    loader.async = true;
    loader.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(loader);
  }, [consent]);

  // Renders nothing: everything above is a side effect on document.head.
  return null;
}
