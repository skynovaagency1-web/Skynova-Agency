/**
 * The one aircraft, shared between two renderers.
 *
 * The rail aircraft flies down the page in a fixed 44px strip, drawn by an
 * ORTHOGRAPHIC camera in CSS-pixel space. The globe has its own canvas with a
 * PERSPECTIVE camera and its own depth buffer. They cannot be merged, and the
 * rail canvas sits above the page, so an aircraft that simply flew across from
 * the rail to the globe could never pass BEHIND the planet -- it would ride
 * over it as a sticker, which is exactly the flat, clip-art reading the tilted
 * orbit exists to avoid.
 *
 * So the aircraft is handed off instead. As the rail aircraft reaches the
 * globe's level it fades out, the globe's own aircraft fades in on the near
 * side of the ring and flies a lap with real occlusion, and when the globe
 * scrolls away the rail takes it back. Same model, same silhouette, matched
 * screen position -- one aircraft as far as anyone watching is concerned.
 *
 * This module is only the signal between them. It is deliberately dumb: no
 * React context, because FlightRail lives in __root and the globe is buried
 * in a homepage section, and threading a provider between them would put a
 * re-render on the scroll path for something no component needs to render.
 */

let orbiting = false;
/** Whether a rail is mounted and driving the signal at all. */
let railPresent = false;

const listeners = new Set<(orbiting: boolean) => void>();

function emit() {
  // Nothing is driving the handoff -- a route without the rail, or a rail
  // that never initialised. The globe must fly on its own rather than sit
  // there permanently empty, so absence of a rail reads as "always orbit".
  const value = railPresent ? orbiting : true;
  for (const listener of listeners) listener(value);
}

/** Called by the rail on mount/unmount so the fallback above stays honest. */
export function setRailPresent(present: boolean) {
  if (railPresent === present) return;
  railPresent = present;
  if (!present) orbiting = false;
  emit();
}

/** Called by the rail each frame; cheap, and only emits on a real change. */
export function setOrbiting(next: boolean) {
  if (orbiting === next) return;
  orbiting = next;
  emit();
}

/** Subscribe. Fires immediately with the current value, and returns an unsubscribe. */
export function onOrbitingChange(listener: (orbiting: boolean) => void) {
  listeners.add(listener);
  listener(railPresent ? orbiting : true);
  return () => {
    listeners.delete(listener);
  };
}
