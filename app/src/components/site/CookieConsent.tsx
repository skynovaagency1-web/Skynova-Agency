import { useSyncExternalStore } from "react";
import { Link } from "@tanstack/react-router";

import { getConsent, getServerConsent, setConsent, subscribeConsent } from "@/lib/consent";
import { useT } from "@/lib/i18n-strings";

/**
 * The one-time choice that gates Google Analytics (see GoogleAnalytics in
 * lib/analytics.tsx). Cloudflare Web Analytics isn't covered by this at
 * all -- it sets no cookies, so it just runs regardless.
 *
 * useSyncExternalStore rather than useState + useEffect: the stored choice
 * is exactly an external store, and this is the primitive React provides
 * for reading one without a hydration mismatch. getServerConsent() reports
 * "denied", so server and first client paint agree on hidden -- see the
 * note there for why that, and not null. The real value arrives on the
 * commit straight after hydration. Re-reads on CONSENT_EVENT too, which is
 * what lets the privacy page's "change your cookie choice" button bring
 * the banner back with no reload.
 */
export function CookieConsent() {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, getServerConsent);
  const t = useT();

  // null means undecided. A recorded "denied" hides this just as firmly as
  // an "accept" does -- asking again after someone said no is the dark
  // pattern the ePrivacy guidance is aimed at.
  if (consent !== null) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label={t("consent.aria")}>
      <p className="cookie-consent-copy">
        {t("consent.copy")}{" "}
        <Link to="/privacy" className="btn-underline">
          {t("consent.readDetails")}
        </Link>
        .
      </p>
      <div className="cookie-consent-actions">
        <button type="button" className="btn-framed" onClick={() => setConsent("denied")}>
          {t("consent.decline")}
        </button>
        <button type="button" className="btn-solid-pill" onClick={() => setConsent("granted")}>
          {t("consent.accept")}
        </button>
      </div>
    </div>
  );
}
