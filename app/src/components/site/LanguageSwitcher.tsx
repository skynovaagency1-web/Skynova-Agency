import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Globe, Check } from "lucide-react";

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
/**
 * `compact` collapses the row into a single button showing the current
 * locale's code, opening the full list on demand.
 *
 * The inline row is fine in the footer, which has the width for it, and in
 * the mobile menu, where it is a list among lists. In the top nav it is two
 * full language names sitting permanently beside everything else -- "English
 * Français" is most of the space the switcher costs, and none of it is doing
 * anything until someone wants to change language.
 */
type Variant = "inline" | "compact";

/** Short code for the trigger. The locale key already is one. */
const shortCode = (loc: string) => loc.toUpperCase();

export function LanguageSwitcher({
  className,
  variant = "inline",
}: {
  className?: string;
  variant?: Variant;
}) {
  const locale = useLocale();
  const t = useT();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click and on Escape. Both, because a menu that only
  // closes one way is a menu someone gets stuck in.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (PUBLISHED_LOCALES.length < 2) return null;

  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  if (variant === "compact") {
    return (
      <div
        ref={rootRef}
        className={`lang-compact${className ? ` ${className}` : ""}`}
      >
        <button
          type="button"
          className="lang-compact-trigger"
          aria-haspopup="true"
          aria-expanded={open}
          aria-label={t("lang.label")}
          onClick={() => setOpen((v) => !v)}
        >
          <Globe size={15} aria-hidden="true" />
          <span>{shortCode(locale)}</span>
        </button>
        {open ? (
          <div className="lang-compact-menu" role="menu">
            {PUBLISHED_LOCALES.map((loc) => (
              <a
                key={loc}
                role="menuitem"
                className={`lang-compact-item${loc === locale ? " is-current" : ""}`}
                href={localePath(clean, loc)}
                hrefLang={LOCALE_TAGS[loc]}
                lang={LOCALE_TAGS[loc]}
                aria-current={loc === locale ? "true" : undefined}
              >
                <span>{LOCALE_LABELS[loc]}</span>
                {loc === locale ? <Check size={14} aria-hidden="true" /> : null}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

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
