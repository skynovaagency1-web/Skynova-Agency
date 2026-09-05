import { useId } from "react";

/**
 * Two-option glass toggle.
 *
 * Adapted from a reference design: a frosted pill track with both labels
 * visible, and a glowing gold thumb that slides between them. The thumb is a
 * separate absolutely-positioned layer so it can carry its own glow without
 * bleeding onto the label text.
 *
 * Built as a real radio group rather than two buttons or a checkbox: a
 * two-state choice where both options are named is exactly what radios are
 * for, so it arrives keyboard-navigable and announced correctly without any
 * ARIA of its own. The visible labels double as the accessible names.
 */

export type GlassToggleOption<T extends string> = {
  value: T;
  label: string;
};

export function GlassToggle<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  /** Exactly two -- the sliding thumb assumes a 50% track. */
  options: readonly [GlassToggleOption<T>, GlassToggleOption<T>];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  const name = useId();
  const index = options.findIndex((o) => o.value === value);

  return (
    <div className="glass-toggle" role="radiogroup" aria-label={ariaLabel}>
      {/* Positioned by index rather than by matching on value, so the thumb
          animates even if two options ever shared a label. */}
      <span
        className="glass-toggle-thumb"
        aria-hidden="true"
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {options.map((o) => (
        <label
          key={o.value}
          className={`glass-toggle-option${o.value === value ? " is-active" : ""}`}
        >
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={o.value === value}
            onChange={() => onChange(o.value)}
          />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}
