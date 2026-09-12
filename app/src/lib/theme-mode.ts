/**
 * Day / night mode.
 *
 * Deliberately the same shape as lib/consent.ts: a localStorage flag, a
 * custom event for same-tab listeners, the "storage" event for other tabs,
 * and a server snapshot that matches the pre-hydration paint. One pattern in
 * the codebase for "a choice the browser remembers", not two.
 *
 * The stored value drives a data-theme attribute on <html>, so CSS switches
 * on [data-theme="night"] rather than on a React prop -- which keeps every
 * styled element out of the re-render when the mode changes.
 */
const STORAGE_KEY = "skynova_theme";

export const THEME_EVENT = "skynova:theme-change";

export type ThemeMode = "day" | "night";

/** Day is the default: it is what the server renders, and what someone who
 *  has never touched the toggle sees. */
export const DEFAULT_THEME: ThemeMode = "day";

export function getThemeMode(): ThemeMode {
  if (typeof window === "undefined") return DEFAULT_THEME;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Private mode, or site data blocked -- same failure shape as consent.
    return DEFAULT_THEME;
  }
  return raw === "night" ? "night" : DEFAULT_THEME;
}

/** The snapshot SSR renders and the hydration pass must agree with. Day,
 *  because that is what the HTML is painted as; the stored answer arrives on
 *  the commit straight after hydration. */
export function getServerThemeMode(): ThemeMode {
  return DEFAULT_THEME;
}

export function subscribeThemeMode(onChange: () => void): () => void {
  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function setThemeMode(value: ThemeMode) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Cannot be remembered past this page view, but must still take effect.
  }
  applyThemeMode(value);
  window.dispatchEvent(new CustomEvent(THEME_EVENT));
}

/** Writes the attribute CSS keys off. Separated from setThemeMode so the
 *  pre-paint script in the document shell can call the same logic. */
export function applyThemeMode(value: ThemeMode) {
  if (typeof document === "undefined") return;
  if (value === DEFAULT_THEME) document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", value);
}
