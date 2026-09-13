import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * An airliner holding station in cloud, for the scroll stage in
 * components/ui/landing-page.tsx. It replaced the rotating globe there as the
 * hero's subject.
 *
 * WHY NOT THE 21st.dev JET. plane-jet-top.webp is the image that reference
 * ships and the one the fly-in hero flies, but it cannot be an object that
 * floats: its alpha runs off the canvas on both long edges (165 opaque pixels
 * on the top row, 163 on the bottom), so both wings are cut. The fly-in gets
 * away with it because it throws the plane across at 165vw and only a band is
 * ever on screen. Held still in the middle of a hero it reads as a cropped
 * photograph. plane-cutout.webp is a true cutout -- nothing touches any edge,
 * 784x190 of aircraft inside a 900x420 frame -- and it is nose-on to the
 * camera, which is what was asked for.
 *
 * That cutout is 900px wide, so every size below is capped to keep the
 * rendered plane under its native width: at the stage's largest scale (1.8)
 * the 400px base lands at 720px, inside the 784px of actual aircraft. Growing
 * the base past 400px starts upscaling it on a wide monitor.
 *
 * The motion is four separate loops on deliberately unrelated periods -- 6.5s,
 * 11s, and the clouds at 34/47/26s. Matched periods are what make a "floating"
 * element read as a GIF: everything returns home at the same instant and the
 * loop announces itself. Nothing here shares a factor, so the composition does
 * not repeat for minutes.
 *
 * Every translate is a percentage, never pixels: the stage scales this whole
 * box between sections, and pixel offsets would drift relative to the plane as
 * it grew.
 */
export interface PlaneFloatProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Plane width, any CSS length. Left unset, the stylesheet's responsive
   *  default applies -- passing one here would be an inline style, which beats
   *  every media query that default exists to serve. */
  size?: string;
}

/** Each cloud: [class suffix, width as a % of the plane, left %, top %].
 *  One behind and above the port wing, one in front off the starboard, one
 *  small and low in front -- so the three sit at three distances rather than
 *  in one flat band, and the aircraft stays the biggest thing in the frame.
 *  Kept tight around it: an earlier pass put the back cloud at -26% and it
 *  read as unrelated weather in the corner rather than as the plane's sky. */
const CLOUDS: Array<[string, number, number, number]> = [
  ["back", 56, 17, 27],
  ["fore", 46, 82, 63],
  ["near", 34, 21, 78],
];

export const PlaneFloat = React.forwardRef<HTMLDivElement, PlaneFloatProps>(function PlaneFloat(
  { size, className, style, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn("planefloat", className)}
      style={{ ...(size ? { "--plane-size": size } : {}), ...style } as React.CSSProperties}
      aria-hidden="true"
      {...props}
    >
      <span className="planefloat-glow" />

      {CLOUDS.map(([name, width, left, top]) => (
        <img
          key={name}
          src="/assets/landing/cloud-transparent.webp"
          alt=""
          className={`planefloat-cloud planefloat-cloud-${name}`}
          style={{ width: `${width}%`, left: `${left}%`, top: `${top}%` }}
          decoding="async"
        />
      ))}

      {/* Last in the DOM, but the stylesheet puts it BETWEEN the clouds by
          z-index -- the back one behind, the fore and near ones in front --
          so the aircraft sits in the weather rather than on a picture of it.
          Source order cannot express that; painting order can. */}
      <img
        src="/assets/landing/plane-cutout.webp"
        alt=""
        className="planefloat-plane"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  );
});

export default PlaneFloat;
