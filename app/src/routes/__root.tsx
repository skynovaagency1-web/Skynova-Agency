import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import appMetaJson from "../app-meta.json";
import { THEME_COLOR } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth-context";
import { Analytics, GoogleAnalytics } from "@/lib/analytics";
import { TravelpayoutsLink } from "@/components/site/TravelpayoutsLink";
import { AuthModal } from "@/components/site/AuthModal";
import { CookieConsent } from "@/components/site/CookieConsent";
import { FlightRail } from "@/components/site/FlightRail";
import { CardTilt } from "@/components/site/CardTilt";
import { OutboundClickTracker } from "@/components/site/OutboundClickTracker";
import { PageViewTracker } from "@/components/site/PageViewTracker";
import { NotFound } from "@/components/site/NotFound";
import { absUrl } from "@/lib/seo";
import { translate } from "@/lib/i18n-strings";
import {
  DEFAULT_LOCALE,
  LOCALE_DIR,
  LOCALE_TAGS,
  PUBLISHED_LOCALES,
  isTranslatedPath,
  localePath,
  type Locale,
} from "@/lib/i18n";


type AppMeta = {
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  favicon_url?: string | null;
  og_video_url?: string | null;
  marketplace_cover_url?: string | null;
};

const appMeta = appMetaJson as AppMeta;

/**
 * The site-wide head: the title every route without one of its own falls back
 * to -- which is the home page -- and the og:/twitter: pair every page
 * inherits unless it overrides them.
 *
 * app-meta.json is the brand override, and it is written in English: it
 * speaks for the default locale only. Every other locale takes its words from
 * the string table, which is the only place a translation of them exists.
 * Reading og_title unconditionally is how the French home page came to be
 * titled "Skynova Agency — Premium Travel Booking", and how every French page
 * shared it to Facebook, LinkedIn and WhatsApp with an English og:title under
 * French body copy.
 */
function buildHead(meta: AppMeta, locale: Locale) {
  const title = (locale === DEFAULT_LOCALE && meta.og_title) || translate("meta.home.title", locale);
  const description =
    (locale === DEFAULT_LOCALE && meta.og_description) ||
    translate("meta.home.description", locale);
  const ogImageRaw = meta.og_image_url ?? "/assets/cover/og.webp";
  // Absolute, always. Facebook, LinkedIn, WhatsApp and X do not resolve a
  // relative og:image against the page URL -- they drop the image entirely,
  // so every share of this site rendered as a bare text link. The value has
  // to be a full URL for the crawler to fetch anything at all.
  const ogImage = /^https?:\/\//.test(ogImageRaw) ? ogImageRaw : absUrl(ogImageRaw);

  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title },
      { name: "description", content: description },
      { name: "theme-color", content: THEME_COLOR },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: ogImage },
      { name: "twitter:image", content: ogImage },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // Fonts are linked here rather than @import-ed from styles.css: an
      // @import is only valid at the very top of a stylesheet, and after
      // bundling it landed below other rules and was silently dropped, so
      // Outfit never loaded and everything fell back to system-ui. A <link>
      // also avoids the extra round trip an @import costs.
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous" as const,
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&family=Cinzel:wght@400;600&display=swap",
      },
      // ?v=3 busts the cache: these were Higgsfield's logo, then the brand
      // monogram, and now a small-size mark. Browsers hold favicons across
      // hard refreshes. Bump the number if the icon ever changes again.
      //
      // v3 is a legibility fix, not a restyle. The monogram was a hairline
      // didone in cream and gold on near-black, occupying ~40% of the canvas
      // -- so at 16px the glyph was about 6px of thin strokes, and its dark
      // ground merged into a dark tab bar. It is now the brand gold with the
      // monogram in ink at 80% of the canvas, which reads on a light and a
      // dark tab strip alike. Baskerville Bold rather than Didot for the same
      // reason a type family ships an optical size: didone hairlines do not
      // survive 16 pixels.
      { rel: "icon", href: "/assets/brand/favicon.ico?v=3", sizes: "any" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/assets/brand/favicon-32.png?v=3",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/assets/brand/favicon-16.png?v=3",
      },
      { rel: "apple-touch-icon", href: "/assets/brand/apple-touch-icon.png?v=3" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  };
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    console.error("root_error_boundary", error);
  }, [error]);

  return (
    <div className="site-body flex min-h-dvh items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="site-h2 text-2xl">This page did not load.</h1>
        <p className="site-ink-muted mt-2">
          Something went wrong. You can try again or head back home.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-framed"
          >
            Try again
          </button>
          <a href="/" className="btn-ghost-link">
            Go home <span className="arrow">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient; locale: Locale }>()({
  head: ({ match }) => buildHead(appMeta, match.context.locale),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const locale = useCurrentLocale();
  return (
    <html lang={LOCALE_TAGS[locale]} dir={LOCALE_DIR[locale]} style={{ colorScheme: "light" }}>
      <head>
        <HeadContent />
        {/* Rendered HERE, inside <head>, rather than in RootComponent below.
            They used to sit in the body and rely on React 19 hoisting <link>
            and <meta> up into <head> -- which works, until the head has
            already been flushed by the time they render, and then the tag is
            simply not in the document. Not a theory: production was serving
            /blog with no canonical at all, while /about and / had theirs, and
            prerendering the same bundle locally (scripts/prerender.mjs) lost
            them on nearly every page, because the flush lands differently
            under a different runtime. Emitting them in the head element makes
            it ordering-independent -- the tags are part of the head chunk, in
            every runtime, every time. */}
        <CanonicalLink />
        <LocaleRobots />
        <AlternateLinks />
      </head>
      <body className="site-body">
        {children}
        <Analytics />
        <GoogleAnalytics />
        <TravelpayoutsLink />
        <CookieConsent />
        <Scripts />
      </body>
    </html>
  );
}

/** The locale this router was built for. Router context rather than the URL,
 *  because the /fr prefix is the router's `basepath` -- by the time a
 *  component sees `location.pathname`, the prefix has been stripped off. */
function useCurrentLocale(): Locale {
  const router = useRouter();
  const context = router.options.context as { locale?: Locale } | undefined;
  return context?.locale ?? DEFAULT_LOCALE;
}

/** Absolute canonical URL for the current route.
 *
 * Search engines need one address per page. The site answers on both the
 * apex and www (server.ts 301s www away), and can also be reached on
 * *.workers.dev, so without this a page has several valid-looking URLs.
 *
 * A component rather than the route-level `head()` option, because it has to
 * read router state, which `head()` cannot. RootShell renders it directly
 * inside <head> -- see the note there; relying on React to hoist it out of the
 * body is what left pages with no canonical at all.
 *
 * Search params are deliberately dropped: ?ref= referral links and filter
 * params must not each register as a separate page. */
function CanonicalLink() {
  const locale = useCurrentLocale();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Collapse any trailing slash so /blog and /blog/ never disagree.
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  // localePath re-applies the prefix the basepath stripped, so the French copy
  // of a page is canonical to /fr/... and not to the English original.
  return <link rel="canonical" href={absUrl(localePath(clean, locale))} />;
}

/**
 * noindex on any locale whose translations do not exist yet.
 *
 * The prefixes are routable before the strings land -- /ar/hotels renders
 * today -- and what it renders is the ENGLISH page wrapped in lang="ar"
 * dir="rtl". Nothing links to it (the switcher and the sitemap both read
 * PUBLISHED_LOCALES), but "nothing links to it" is not the same as
 * "unreachable": a stray backlink or a guessed URL is enough, and a set of
 * near-identical English pages under foreign prefixes is exactly the shape
 * of a doorway-page problem.
 *
 * Removing the tag is not a separate job -- a locale stops matching this the
 * moment it is added to PUBLISHED_LOCALES, in the commit that translates it.
 */
function LocaleRobots() {
  const locale = useCurrentLocale();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const published = PUBLISHED_LOCALES.includes(locale);
  // Also covers a PUBLISHED locale on a page whose content it does not have:
  // /fr/blog/<slug> renders French chrome around an English article, and
  // asking Google to index 107 of those is how a doorway-page problem starts.
  if (published && isTranslatedPath(pathname, locale)) return null;
  return <meta name="robots" content="noindex, follow" />;
}

/**
 * hreflang alternates.
 *
 * Emitted only once more than one locale is published, and only for locales
 * whose pages actually exist: hreflang pointing at an untranslated copy tells
 * Google the two URLs are the same page in another language when they are the
 * same page in the same language, which is a duplicate-content signal rather
 * than a translation one. x-default goes to English, the version served to
 * anyone whose language we do not have.
 */
function AlternateLinks() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (PUBLISHED_LOCALES.length < 2) return null;
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return (
    <>
      {PUBLISHED_LOCALES.filter((loc) => isTranslatedPath(clean, loc)).map((loc) => (
        <link
          key={loc}
          rel="alternate"
          hrefLang={LOCALE_TAGS[loc]}
          href={absUrl(localePath(clean, loc))}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={absUrl(localePath(clean, DEFAULT_LOCALE))} />
    </>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Site-wide, not just the homepage. It anchors to #how-it-works
            where that exists and otherwise starts at the top of the page. */}
        <FlightRail />
        <CardTilt />
        <OutboundClickTracker />
        <PageViewTracker />
        <Outlet />
        <AuthModal />
      </AuthProvider>
    </QueryClientProvider>
  );
}
