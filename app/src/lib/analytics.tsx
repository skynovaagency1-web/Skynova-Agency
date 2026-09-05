/**
 * Cloudflare Web Analytics.
 *
 * Chosen over Google Analytics deliberately: it sets no cookies and stores no
 * personal data, so it needs no consent banner under GDPR/ePrivacy. Adding GA
 * to this site would legally require a cookie banner before it may fire, and
 * there isn't one.
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
