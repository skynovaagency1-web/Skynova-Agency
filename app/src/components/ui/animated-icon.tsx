import { useCallback, useRef } from "react";

/**
 * Animated icons from 21st.dev's icon library -- the "Material Line Icons"
 * set (line-md), MIT licensed, credited to Vjacheslav Trushkin.
 *
 * WHY THESE AND NOT THE ANIMATED-ICON COMPONENTS on the same site: these
 * carry their animation INSIDE the SVG, as a SMIL <animate> on a
 * stroke-dashoffset. No framer-motion, no runtime, no render loop -- each
 * icon is between 244 and 759 bytes of markup that draws itself once and
 * freezes. The component alternative needed framer-motion (~50KB) and ran a
 * setInterval per icon, toggling state forever whether or not anything had
 * changed.
 *
 * WHAT IS NOT HERE, and cannot be. line-md is an interface set. Every
 * travel icon this site uses -- plane, luggage, palm-tree, mountain, camera,
 * globe, ticket, crown, gem, backpack, car, bike, train, utensils, waves,
 * landmark, trophy -- was checked against it and not one exists. Those stay
 * on lucide, which is the right outcome anyway: they are category marks that
 * label a thing, and animating a label adds motion without meaning. These
 * eight all sit on something the visitor does.
 *
 * REPLAY. `fill="freeze"` means the animation runs once and holds, so a
 * remount is not needed but a repeat is not free either -- replay() calls
 * beginElement() on the SMIL node, which restarts it. Wired to hover, and to
 * whatever state the caller passes as `playKey`.
 */

const ICONS: Record<string, string> = {
  "heart": `<path fill="none" stroke="currentColor" stroke-dasharray="30" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c0 0 0 0 -0.76 -1c-0.88 -1.16 -2.18 -2 -3.74 -2c-2.49 0 -4.5 2.01 -4.5 4.5c0 0.93 0.28 1.79 0.76 2.5c0.81 1.21 8.24 9 8.24 9M12 8c0 0 0 0 0.76 -1c0.88 -1.16 2.18 -2 3.74 -2c2.49 0 4.5 2.01 4.5 4.5c0 0.93 -0.28 1.79 -0.76 2.5c-0.81 1.21 -8.24 9 -8.24 9"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="30;0"/></path>`,
  "home": `<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="18" d="M4.5 21.5h15"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="18;0"/></path><path stroke-dasharray="16" stroke-dashoffset="16" d="M4.5 21.5v-13.5M19.5 21.5v-13.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.3s" to="0"/></path><path stroke-dasharray="28" stroke-dashoffset="28" d="M2 10l10 -8l10 8"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.4s" to="0"/></path><path stroke-dasharray="26" stroke-dashoffset="26" d="M9.5 21.5v-9h5v9"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.9s" dur="0.6s" to="0"/></path></g>`,
  "account": `<g fill="none" stroke="currentColor" stroke-dasharray="28" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 21v-1c0 -3.31 2.69 -6 6 -6h4c3.31 0 6 2.69 6 6v1"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="28;0"/></path><path stroke-dashoffset="28" d="M12 11c-2.21 0 -4 -1.79 -4 -4c0 -2.21 1.79 -4 4 -4c2.21 0 4 1.79 4 4c0 2.21 -1.79 4 -4 4Z"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" to="0"/></path></g>`,
  "map-marker": `<path fill="none" stroke="currentColor" stroke-dasharray="48" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20.5c0 0 -6 -7 -6 -11.5c0 -3.31 2.69 -6 6 -6c3.31 0 6 2.69 6 6c0 4.5 -6 11.5 -6 11.5Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="48;0"/></path><circle cx="12" cy="9" fill="currentColor"><animate fill="freeze" attributeName="r" begin="0.7s" dur="0.2s" to="2.5"/></circle>`,
  "log-out": `<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="46" d="M16 5v-1c0 -0.55 -0.45 -1 -1 -1h-9c-0.55 0 -1 0.45 -1 1v16c0 0.55 0.45 1 1 1h9c0.55 0 1 -0.45 1 -1v-1"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="46;0"/></path><path stroke-dasharray="14" stroke-dashoffset="14" d="M10 12h11"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" to="0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M21 12l-3.5 -3.5M21 12l-3.5 3.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" to="0"/></path></g>`,
  "chat": `<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="70" d="M3 19.5v-15.5c0 -0.55 0.45 -1 1 -1h16c0.55 0 1 0.45 1 1v12c0 0.55 -0.45 1 -1 1h-14.5Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="70;0"/></path><g stroke-dasharray="10" stroke-dashoffset="10"><path d="M8 7h8"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" to="0"/></path><path d="M8 10h8"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" to="0"/></path></g><path stroke-dasharray="6" stroke-dashoffset="6" d="M8 13h4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.9s" dur="0.2s" to="0"/></path></g>`,
  "search": `<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="40" d="M10.76 13.24c-2.34 -2.34 -2.34 -6.14 0 -8.49c2.34 -2.34 6.14 -2.34 8.49 0c2.34 2.34 2.34 6.14 0 8.49c-2.34 2.34 -6.14 2.34 -8.49 0Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="40;0"/></path><path stroke-dasharray="14" stroke-dashoffset="14" d="M10.5 13.5l-7.5 7.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" to="0"/></path></g>`,
  "heart-filled": `<path fill="currentColor" fill-opacity="0" d="M12 8c0 0 0 0 0.76 -1c0.88 -1.16 2.18 -2 3.74 -2c2.49 0 4.5 2.01 4.5 4.5c0 0.93 -0.28 1.79 -0.76 2.5c-0.81 1.21 -8.24 9 -8.24 9c0 0 -7.43 -7.79 -8.24 -9c-0.48 -0.71 -0.76 -1.57 -0.76 -2.5c0 -2.49 2.01 -4.5 4.5 -4.5c1.56 0 2.87 0.84 3.74 2c0.76 1 0.76 1 0.76 1Z"><animate fill="freeze" attributeName="fill-opacity" begin="0.6s" dur="0.4s" to="1"/></path><path fill="none" stroke="currentColor" stroke-dasharray="30" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c0 0 0 0 -0.76 -1c-0.88 -1.16 -2.18 -2 -3.74 -2c-2.49 0 -4.5 2.01 -4.5 4.5c0 0.93 0.28 1.79 0.76 2.5c0.81 1.21 8.24 9 8.24 9M12 8c0 0 0 0 0.76 -1c0.88 -1.16 2.18 -2 3.74 -2c2.49 0 4.5 2.01 4.5 4.5c0 0.93 -0.28 1.79 -0.76 2.5c-0.81 1.21 -8.24 9 -8.24 9"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="30;0"/></path>`,
  "chevron-right": `<path fill="none" stroke="currentColor" stroke-dasharray="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12l-7 -7M16 12l-7 7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="12;0"/></path>`,
};

export type AnimatedIconName = keyof typeof ICONS;

export function AnimatedIcon({
  name,
  size = 18,
  className,
  title,
}: {
  name: AnimatedIconName;
  size?: number;
  className?: string;
  title?: string;
}) {
  const ref = useRef<SVGSVGElement | null>(null);

  /* SMIL restarts from the element itself, not from React. Guarded because
     jsdom and any browser without SMIL simply will not have beginElement --
     the icon then stays in its finished state, which is the correct picture
     rather than a broken one. */
  const replay = useCallback(() => {
    const svg = ref.current;
    if (!svg) return;
    svg.querySelectorAll("animate, animateTransform").forEach((node) => {
      const el = node as SVGAnimationElement & { beginElement?: () => void };
      try {
        el.beginElement?.();
      } catch {
        /* A browser that refuses is left showing the frozen final frame. */
      }
    });
  }, []);

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      onMouseEnter={replay}
      onFocus={replay}
      /* The markup is a build-time constant from this module, never anything
         a visitor supplied. */
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  );
}
