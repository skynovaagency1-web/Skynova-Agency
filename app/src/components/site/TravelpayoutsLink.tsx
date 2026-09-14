import { useEffect, useSyncExternalStore } from "react";

import { getConsent, getServerConsent, subscribeConsent } from "@/lib/consent";

/**
 * Travelpayouts' link-monetisation script.
 *
 * It rewrites outbound links to partner sites at click time so they carry this
 * account's marker. That matters more here than it would on most sites: five
 * of the eight verticals link straight to a partner's own domain with the
 * Travelpayouts marker dropped into that partner's own id parameter
 * (`getyourguide.com/s/?partner_id=`, `tiqets.com/?partner=`, and so on),
 * which is not a Travelpayouts-tracked click and earns nothing on its own.
 * This script is what can turn those into attributed clicks -- see the note on
 * DISCOVER_CARS_AID in lib/affiliate.ts, which states the same rule and is the
 * reason that one link is left switched off rather than shipped broken.
 *
 * It is NOT a substitute for real deep links. If the dashboard can generate a
 * proper link per programme, that is the fix; this is the safety net under it.
 *
 * GATED ON CONSENT, exactly like GA4 in lib/analytics.tsx and for the same
 * reason. The script hooks click, mousemove, touchstart and scroll and
 * rewrites link targets -- that is tracking under GDPR/ePrivacy however it is
 * labelled, and the cookie banner promises nothing of the kind runs until a
 * visitor accepts. Loading it unconditionally would quietly make the banner a
 * lie, which is worse than the lost attribution it would buy.
 *
 * WHAT IT DOES TO THE PAGE, recorded here so the next reader does not have to
 * deobfuscate it to find out: it replaces `window.open` and the `setAttribute`,
 * `cloneNode` and `replaceChild` prototype methods, and uses
 * `Function.prototype.toString` so the replacements still report as
 * `[native code]`. That is routine for monetisation scripts that expect ad
 * blockers, but it is worth knowing plainly -- this is not an inert tag, it
 * rewrites DOM APIs on every page it runs on.
 *
 * NOTE: emrldco.com is allow-listed in lib/security-headers.server.ts. Without
 * that entry the browser blocks it and the site silently earns nothing, with
 * no error anywhere the owner would see.
 */
const SCRIPT_ID = "tp-monetisation";

/** The snippet Travelpayouts' dashboard issues for this account. The id is in
 *  the filename as well as the query string; both come from them verbatim. */
const SCRIPT_SRC = "https://emrldco.com/NTE5OTU5.js?t=519959";

export function TravelpayoutsLink() {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, getServerConsent);

  useEffect(() => {
    if (consent !== "granted") return;
    // The script patches global prototypes on load, so a second copy would
    // patch the already-patched ones. Same guard, and same reason, as the
    // GA loader's.
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = SCRIPT_SRC;
    document.head.appendChild(script);
  }, [consent]);

  // Renders nothing: the side effect above is the whole component.
  return null;
}
