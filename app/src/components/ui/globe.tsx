import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A rotating earth, after the 21st.dev "ruixen.ui/globe" reference: an
 * equirectangular map scrolled behind a circular mask, with inset shadows
 * doing the sphere shading and a handful of dots twinkling around it.
 *
 * Departures from the reference, all deliberate.
 *
 * The texture is served from this repo (public/assets/landing/earth-day.webp
 * -- NASA Blue Marble, already here and unused) rather than hot-linked from
 * cdn.21st.dev. Same reasoning the plane cutout was localised for: a hero's
 * critical path should not depend on someone else's CDN. It also lets the
 * night texture ride the site's day/night toggle, which a fixed remote URL
 * could not.
 *
 * The stars are siblings of the sphere, not children of it. In the reference
 * they sit inside the `overflow-hidden rounded-full` element, so every one of
 * the seven -- at left -40 to 350, top -50 to 290 around a 250px circle -- is
 * either clipped away entirely or buried under the map. Their coordinates say
 * plainly where they were meant to be: scattered around the globe.
 *
 * The keyframes live in styles.css, not in a <style> tag in the render. The
 * reference re-emits the same CSS on every mount, and puts the animation out
 * of reach of the reduced-motion block that covers the rest of the site.
 *
 * The reference also wraps the sphere in `h-screen flex items-center`. That is
 * the demo page's centring, not part of the globe -- inside a transformed,
 * fixed container it forces a viewport-height box around a 250px circle and
 * drags the transform origin off the sphere. The element is the globe here,
 * and the caller places it.
 *
 * Size is a custom property rather than a hard 250px, so a caller can scale it
 * in layout units instead of with a CSS transform, which would blur the
 * texture and the shadow rim together. It is deliberately NOT defaulted here:
 * the stylesheet holds a clamped default, and a default written in this file
 * would arrive as an inline style and beat every media query that default
 * exists to serve. The star offsets follow it as
 * percentages for the same reason: the reference pins them at 250px-relative
 * pixel coordinates, so at the ~150px the globe takes on a phone they would
 * drift a screen-width away from the sphere they belong to.
 */
export interface GlobeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Equirectangular (2:1) map. Defaults to the daytime Blue Marble. */
  textureUrl?: string;
  /** Diameter, any CSS length. Left unset, the stylesheet's own responsive
   *  default applies -- passing one here would be an inline style, which wins
   *  over every media query the CSS could offer. */
  size?: string;
}

/** [left, top] as a percentage of the globe's own diameter, plus the twinkle
 *  duration. Out-of-box values are the point: they scatter around the sphere.
 *  The reference's pixel offsets against its fixed 250px, converted. */
const STARS: Array<[number, number, string]> = [
  [-8, 0, "3s"],
  [-16, 12, "2s"],
  [140, 36, "4s"],
  [80, 116, "3s"],
  [20, 108, "1.5s"],
  [100, -20, "4s"],
  [116, 24, "2s"],
];

export const Globe = React.forwardRef<HTMLDivElement, GlobeProps>(function Globe(
  { textureUrl = "/assets/landing/earth-day.webp", size, className, style, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn("globe", className)}
      style={{ ...(size ? { "--globe-size": size } : {}), ...style } as React.CSSProperties}
      aria-hidden="true"
      {...props}
    >
      {/* The texture is its own element so the ROTATION CAN BE A TRANSFORM.
          It used to be a background-position animation on .globe-sphere
          itself, which is a paint property -- so every frame repainted a
          circle carrying a border-radius, an overflow clip and six inset
          box-shadows with 20-44px blurs, forever, whether or not anything was
          scrolling. That is survivable at 250px and not at the 680px this
          globe now reaches when it docks. Transform animations composite on
          the GPU: the shadows are painted once and the texture just slides. */}
      <div className="globe-sphere">
        <div className="globe-texture" style={{ backgroundImage: `url('${textureUrl}')` }} />
      </div>
      {STARS.map(([left, top, duration]) => (
        <span
          key={`${left}:${top}`}
          className="globe-star"
          style={{ left: `${left}%`, top: `${top}%`, animationDuration: duration }}
        />
      ))}
    </div>
  );
});

export default Globe;
