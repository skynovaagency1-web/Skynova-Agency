import { useSyncExternalStore } from "react";

import { getServerThemeMode, getThemeMode, setThemeMode, subscribeThemeMode } from "@/lib/theme-mode";
import { useT } from "@/lib/i18n-strings";

/**
 * The day / night switch, after the owner's reference: a pill with the mode
 * named beside a track, and a filled knob that slides across.
 *
 * A real <button role="switch">, not a checkbox styled into a slider: it is
 * operated with Space and Enter, and screen readers announce it as on or off
 * with the label attached, which a bare div never does.
 */
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
      className={`daynight${isNight ? " is-night" : ""}${className ? ` ${className}` : ""}`}
      onClick={() => setThemeMode(isNight ? "day" : "night")}
    >
      <span className="daynight-label">{isNight ? t("theme.night") : t("theme.day")}</span>
      <span className="daynight-track" aria-hidden="true">
        <span className="daynight-knob" />
      </span>
    </button>
  );
}
