/**
 * Cookie consent for the one cookie-setting analytics tool we *optionally*
 * load: Google Analytics (see the GoogleAnalytics component in
 * lib/analytics.tsx). Cloudflare Web Analytics sets no cookies and needs no
 * consent, so it isn't gated by any of this -- it just always runs.
 *
 * The choice itself is stored as a plain localStorage flag rather than a
 * cookie: it never needs to reach the server, and a cookie whose only job
 * is answering "may we set a cookie" is its own small absurdity.
 */
const STORAGE_KEY = "skynova_consent";

/** Fired on every change (grant, decline, or reset) so any mounted
 * component -- the banner, the GA loader -- can react without a reload. */
export const CONSENT_EVENT = "skynova:consent-change";

export type ConsentValue = "granted" | "denied";

/** null means "hasn't decided yet" (including: we're on the server, where
 * there's no localStorage to read). */
export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Safari in private mode, and any browser set to block site data, throw
    // on access rather than returning null. Treat that as "no choice
    // recorded," which fails closed: GA stays off.
    return null;
  }
  return raw === "granted" || raw === "denied" ? raw : null;
}

/** Server snapshot for useSyncExternalStore. Always null -- there is no
 * stored choice to read during SSR, so the first paint is identical on
 * both sides and hydration has nothing to mismatch on. */
export function getServerConsent(): ConsentValue | null {
  return null;
}

/**
 * Subscribe to consent changes. Listens for two separate things:
 *   - CONSENT_EVENT, dispatched by this module, for changes in THIS tab
 *   - "storage", fired by the browser only in OTHER tabs, so declining in
 *     one tab also stops GA in the others without a reload
 */
export function subscribeConsent(onChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function setConsent(value: ConsentValue) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage blocked. The choice can't be remembered past this page view,
    // but it must still take effect now, so fall through to the event.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT));
}

/** Clears the stored choice so the banner reappears. Used by the "change
 * your cookie choice" control on the privacy page. */
export function resetConsent() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing stored to clear */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT));
}
