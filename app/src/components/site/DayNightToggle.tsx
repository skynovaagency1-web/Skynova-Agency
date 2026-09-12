import { useSyncExternalStore } from "react";

import { getServerThemeMode, getThemeMode, setThemeMode, subscribeThemeMode } from "@/lib/theme-mode";
import { useT } from "@/lib/i18n-strings";

/**
 * Day / night switch, after the owner's second reference: a pill holding a
 * sun on one side and a moon in a raised knob on the other.
 *
 * Icons rather than a word, which is what makes it work on a phone. The
 * first version spelled out "Day"/"Night" and hid that text below 640px,
 * leaving a bare pill with nothing to say what it did. A sun and a moon
 * read the same at every width, and in every language -- so the label now
 * lives only where assistive tech reads it.
 *
 * The reference is black with a blue moon glow; this keeps the site's gold
 * and ink, because there is no blue anywhere else on the site.
 */
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4.4" fill="currentColor" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <rect
          key={deg}
          x="11.35"
          y="1.4"
          width="1.3"
          height="3.4"
          rx="0.65"
          fill="currentColor"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" focusable="false">
      <path
        d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function DayNightToggle({ className }: { className?: string }) {
  const t = useT();
  const mode = useSyncExternalStore(subscribeThemeMode, getThemeMode, getServerThemeMode);
  const isNight = mode === "night";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isNight}
      aria-label={t("theme.aria")}
      title={isNight ? t("theme.night") : t("theme.day")}
      className={`daynight${isNight ? " is-night" : ""}${className ? ` ${className}` : ""}`}
      onClick={() => setThemeMode(isNight ? "day" : "night")}
    >
      <span className="daynight-track" aria-hidden="true">
        <span className="daynight-face daynight-sun">
          <SunIcon />
        </span>
        <span className="daynight-face daynight-moon">
          <MoonIcon />
        </span>
        <span className="daynight-knob">{isNight ? <MoonIcon /> : <SunIcon />}</span>
      </span>
    </button>
  );
}
