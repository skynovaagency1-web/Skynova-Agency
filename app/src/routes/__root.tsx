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
import { Analytics } from "@/lib/analytics";
import { AuthModal } from "@/components/site/AuthModal";
import { FlightRail } from "@/components/site/FlightRail";
import { OutboundClickTracker } from "@/components/site/OutboundClickTracker";
import { PageViewTracker } from "@/components/site/PageViewTracker";
import { NotFound } from "@/components/site/NotFound";
import { absUrl } from "@/lib/seo";

const DEFAULT_TITLE = "Skynova Agency — Premium Travel Booking";
const DEFAULT_DESCRIPTION =
  "Flights, hotels, car rentals, airport services, events, eSIM and tours — booked with a premium, white-glove touch, all in one place.";

type AppMeta = {
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  favicon_url?: string | null;
  og_video_url?: string | null;
  marketplace_cover_url?: string | null;
};

const appMeta = appMetaJson as AppMeta;

function buildHead(meta: AppMeta) {
  const title = meta.og_title ?? DEFAULT_TITLE;
  const description = meta.og_description ?? DEFAULT_DESCRIPTION;
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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => buildHead(appMeta),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <head>
        <HeadContent />
      </head>
      <body className="site-body">
        {children}
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}

/** Absolute canonical URL for the current route.
 *
 * Search engines need one address per page. The site answers on both the
 * apex and www (server.ts 301s www away), and can also be reached on
 * *.workers.dev, so without this a page has several valid-looking URLs.
 *
 * React 19 hoists <link> out of the tree into <head>, so this can live in a
 * component and read router state -- which the route-level `head()` option
 * cannot do. Search params are deliberately dropped: ?ref= referral links
 * and filter params must not each register as a separate page. */
function CanonicalLink() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Collapse any trailing slash so /blog and /blog/ never disagree.
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return <link rel="canonical" href={`https://skynovaagency.com${clean}`} />;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CanonicalLink />
        {/* Site-wide, not just the homepage. It anchors to #how-it-works
            where that exists and otherwise starts at the top of the page. */}
        <FlightRail />
        <OutboundClickTracker />
        <PageViewTracker />
        <Outlet />
        <AuthModal />
      </AuthProvider>
    </QueryClientProvider>
  );
}
