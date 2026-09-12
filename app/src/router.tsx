import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { DEFAULT_LOCALE, localeBasepath, localeFromPathname, type Locale } from "./lib/i18n";

/**
 * Which locale this router instance serves.
 *
 * A router is built per request on the server and once per page load in the
 * browser, so reading the URL here is enough -- the locale cannot change
 * without a new document, because every locale is a different path prefix.
 *
 * The server import is dynamic and behind `import.meta.env.SSR`, which Vite
 * replaces with a literal: in the client build the branch is dead code, so
 * the server module never reaches the browser bundle. The catch is a real
 * fallback rather than decoration -- if the request cannot be read for any
 * reason, English is the right answer, not a crash.
 */
async function currentLocale(): Promise<Locale> {
  if (typeof window !== "undefined") {
    return localeFromPathname(window.location.pathname);
  }
  if (import.meta.env.SSR) {
    try {
      const { getRequest } = await import("@tanstack/react-start/server");
      return localeFromPathname(new URL(getRequest().url).pathname);
    } catch {
      return DEFAULT_LOCALE;
    }
  }
  return DEFAULT_LOCALE;
}

/**
 * Async on purpose: Start awaits this (`router = await entries.routerEntry
 * .getRouter()`), and reading the request on the server needs the dynamic
 * import above.
 *
 * `basepath` is what makes a second language cheap. Set to "/fr", the router
 * strips the prefix before matching and re-adds it to every link it renders,
 * so all ~80 `<Link to="/hotels">` in the app keep pointing at the right page
 * in the right language with no change, and no route file has to move.
 */
export const getRouter = async () => {
  const queryClient = new QueryClient();
  const locale = await currentLocale();

  const basepath = localeBasepath(locale);

  const router = createRouter({
    routeTree,
    context: { queryClient, locale },
    basepath,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  // Start overwrites it. Immediately after awaiting getRouter(), its request
  // handler calls router.update({ ..., basepath: ROUTER_BASEPATH }) with a
  // build-time constant -- one value for the whole app, decided at build. That
  // reset the router to "/" before it matched anything, so every /fr URL fell
  // through to the 404 route while still rendering as French: right <html lang>,
  // right canonical, no page.
  //
  // So the locale's basepath is pinned here, on the instance, rather than
  // handed over in options: every later update keeps it, whoever calls. The
  // English router is left completely untouched -- it wants "/" anyway, which
  // is what Start would set.
  if (basepath !== "/") {
    const update = router.update.bind(router);
    router.update = ((options: Parameters<typeof router.update>[0]) =>
      update({ ...options, basepath })) as typeof router.update;
  }

  return router;
};
