/**
 * Which paths the pageview counter will accept.
 *
 * This is an allowlist, not a shape check, and that is deliberate: the
 * endpoint is public and unauthenticated, so a regex like `^/[\w/-]*$` would
 * happily accept ten thousand invented paths and let anything that found the
 * endpoint fill the table with whatever it felt like.
 *
 * IT LIVES IN ITS OWN MODULE so a test can import it. The list used to sit
 * inside page-views.server.ts, which pulls in the Worker bindings and so
 * cannot be imported from a test -- and with nothing able to check it, it
 * drifted. Five real pages (/gear, /reviews, /flight-compensation,
 * /travel-insurance, /yacht-charter) shipped without ever being added, so
 * every visit to them was counted, validated, and thrown away. /gear is the
 * affiliate page; its traffic was the number most worth having.
 *
 * tests/page-view-paths.test.ts now reads src/routes/ and fails if a route
 * exists that is neither counted here nor named in UNCOUNTED_ROUTES below.
 * Adding a page and forgetting this file is no longer a silent loss.
 */

/** Routes with no parameter. The test keeps this in step with src/routes/. */
export const COUNTED_EXACT_PATHS: ReadonlySet<string> = new Set([
  "/",
  "/about",
  "/account",
  "/airport-services",
  "/app",
  "/bike-rentals",
  "/blog",
  "/car-rentals",
  "/collections",
  "/contact",
  "/destinations",
  "/esim",
  "/events",
  "/faq",
  "/flight-compensation",
  "/flights",
  "/gear",
  "/gift",
  "/hotels",
  "/privacy",
  "/reset-password",
  "/reviews",
  "/share",
  "/terms",
  "/tours",
  "/travel-insurance",
  "/wishlist",
  "/yacht-charter",
]);

/**
 * Real routes that are deliberately NOT counted, with the reason.
 *
 * An exclusion has to be written down rather than merely omitted, or the test
 * cannot tell "decided against" from "forgotten" -- which is the exact failure
 * this whole module exists to prevent.
 */
export const UNCOUNTED_ROUTES: Readonly<Record<string, string>> = {
  // noindex, unlinked, and only reachable by typing the URL. Counting it
  // would mix an internal comparison page into the site's own numbers.
  "/hero-preview": "internal preview of the shader hero; noindex and unlinked",
};
