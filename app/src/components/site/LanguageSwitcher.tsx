import { useRouterState } from "@tanstack/react-router";

import { LOCALE_LABELS, LOCALE_TAGS, PUBLISHED_LOCALES, localePath } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/i18n-strings";

/**
 * Language switcher.
 *
 * Renders nothing until a second locale is published, so it can be mounted
 * everywhere it belongs now and simply appear the day French content lands
 * -- no second pass through the nav and footer then.
 *
 * Plain <a>, never <Link>. Each locale is a different router basepath, and a
 * client-side navigation cannot cross one: the router would keep the current
 * prefix and resolve /fr/hotels against the English tree. A full document
 * load is also what you want here anyway -- the whole page changes language.
 *
 * The path comes from router state with the prefix already stripped, so
 * localePath() re-applies the target locale's own prefix. Switching language
 * therefore keeps you on the page you were reading rather than dumping you on
 * a translated home page, which is the single most common way these get it
 * wrong.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useT();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (PUBLISHED_LOCALES.length < 2) return null;

  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  return (
    <div className={`lang-switch${className ? ` ${className}` : ""}`} role="group" aria-label={t("lang.label")}>
      {PUBLISHED_LOCALES.map((loc) =>
        loc === locale ? (
          <span key={loc} className="lang-switch-option is-current" aria-current="true">
            {LOCALE_LABELS[loc]}
          </span>
        ) : (
          <a
            key={loc}
            className="lang-switch-option"
            href={localePath(clean, loc)}
            hrefLang={LOCALE_TAGS[loc]}
            lang={LOCALE_TAGS[loc]}
          >
            {LOCALE_LABELS[loc]}
          </a>
        ),
      )}
    </div>
  );
}
