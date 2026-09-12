/**
 * Locales.
 *
 * English stays at the root (`/hotels`); every other locale lives under its
 * own prefix (`/fr/hotels`). The prefix is applied by the router's `basepath`
 * rather than by the route tree, which is what makes this cheap: the ~80
 * `<Link to="/...">` across 48 components keep their English-looking paths
 * and are prefixed automatically, and no route file moves.
 *
 * One domain, path prefixes -- not fr.skynovaagency.com and not a .fr domain.
 * A single host keeps every page's authority pooled, and Google reads the
 * prefix plus the hreflang tags in __root.tsx as the language signal.
 */

export const LOCALES = ["en", "es", "pt", "ar", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

/** Served at the root, with no prefix. */
export const DEFAULT_LOCALE: Locale = "en";

/**
 * Locales with pages a visitor should actually be sent to.
 *
 * The plumbing ships before the translations do, so `fr` is routable (you can
 * open /fr/hotels and it renders) while staying out of the sitemap, the
 * hreflang set and the language switcher until its content exists. Add "fr"
 * here in the same commit that publishes the French pages -- never before, as
 * hreflang pointing at an untranslated copy is a duplicate-content signal.
 */
export const PUBLISHED_LOCALES: readonly Locale[] = ["en"];

/** Shown in the language switcher, in the language itself -- never "French". */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
  ar: "العربية",
  fr: "Français",
};

/** BCP 47 tags for <html lang> and hreflang. Kept separate from the locale
 *  key so a future "pt-BR" needs no change to the routing code. */
export const LOCALE_TAGS: Record<Locale, string> = {
  en: "en",
  es: "es",
  /** Brazilian Portuguese: the larger market, and the one the site's own
   *  Brazil guide is written for. Switch to "pt-PT" here if the audience
   *  turns out to be European -- it changes vocabulary, not structure. */
  pt: "pt-BR",
  ar: "ar",
  fr: "fr",
};

/**
 * Writing direction.
 *
 * Arabic runs right to left, which is a layout concern rather than a
 * translation one: <html dir> flips text and inline flow, but physical CSS
 * (margin-left, left:, translateX) stays put and has to be migrated to
 * logical properties separately. Nothing is published in Arabic until that
 * pass is done.
 */
export const LOCALE_DIR: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  es: "ltr",
  pt: "ltr",
  ar: "rtl",
  fr: "ltr",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** The locale a pathname belongs to. `/fr`, `/fr/` and `/fr/hotels` are all
 *  French; `/french-polynesia-on-a-budget` is not -- the segment has to match
 *  a locale exactly, or every slug starting with two matching letters would
 *  be swallowed. */
export function localeFromPathname(pathname: string): Locale {
  const first = pathname.split("/")[1] ?? "";
  return isLocale(first) && first !== DEFAULT_LOCALE ? first : DEFAULT_LOCALE;
}

/** The router's `basepath` for a locale: "/" for English, "/fr" otherwise. */
export function localeBasepath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "/" : `/${locale}`;
}

/** Drops a locale prefix, giving the path as the route tree knows it:
 *  "/fr/hotels" -> "/hotels", "/fr" -> "/", "/hotels" -> "/hotels". */
export function stripLocale(pathname: string): string {
  const first = pathname.split("/")[1] ?? "";
  if (!isLocale(first) || first === DEFAULT_LOCALE) return pathname;
  const rest = pathname.slice(first.length + 1);
  return rest === "" ? "/" : rest;
}

/** The public path for a route path in a given locale:
 *  ("/hotels", "fr") -> "/fr/hotels", ("/", "fr") -> "/fr". */
export function localePath(path: string, locale: Locale): string {
  const clean = stripLocale(path.startsWith("/") ? path : `/${path}`);
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}
