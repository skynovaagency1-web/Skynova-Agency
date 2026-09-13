/**
 * The one globe, shared between two renderers.
 *
 * Deliberately the same shape as lib/flight-handoff.ts, which already solves
 * this exact problem for the aircraft. One pattern in the codebase for "two
 * renderers, one object", not two.
 *
 * The homepage used to show two unrelated globes: a CSS sphere in the hero and
 * a WebGL planet in "Fly anywhere", four thousand pixels apart. They are one
 * globe now. The hero's travels down the page, recedes to almost nothing
 * across the middle of it, then grows back and docks onto the Fly-anywhere
 * stage -- and at that moment the CSS sphere fades out and the WebGL one fades
 * in at the same place and the same size.
 *
 * They cannot simply be the same element. The hero globe is a flat texture
 * panned behind a border-radius, cheap enough to paint in the hero's critical
 * path; the WebGL globe is a 3.18MB glTF earth with a cloud shell, a normal
 * map and an aircraft orbiting it with real occlusion, and pulling that into
 * the hero would put the whole model in front of the first paint. So the cheap
 * one opens and hands over to the real one on arrival.
 *
 * This module is only the signal between them, and it is deliberately dumb: no
 * React context, because the stage is a homepage hero and the globe is buried
 * in a section several components away, and threading a provider between them
 * would put a re-render on the scroll path for something no component needs to
 * render.
 */

let docked = false;
/** Whether a travelling stage is mounted and driving the signal at all. */
let stagePresent = false;

const listeners = new Set<(docked: boolean) => void>();

function emit() {
  // Nothing is driving the handoff -- a route with the Fly-anywhere section
  // but no hero stage above it, or a stage that never initialised. The WebGL
  // globe must show itself rather than sit there permanently invisible, so
  // absence of a stage reads as "always docked".
  const value = stagePresent ? docked : true;
  for (const listener of listeners) listener(value);
}

/** Called by the stage on mount/unmount so the fallback above stays honest. */
export function setStagePresent(present: boolean) {
  if (stagePresent === present) return;
  stagePresent = present;
  if (!present) docked = false;
  emit();
}

/** Called by the stage as it measures; cheap, and only emits on a real change. */
export function setDocked(next: boolean) {
  if (docked === next) return;
  docked = next;
  emit();
}

/** Subscribe. Fires immediately with the current value, and returns an unsubscribe. */
export function onDockedChange(listener: (docked: boolean) => void) {
  listeners.add(listener);
  listener(stagePresent ? docked : true);
  return () => {
    listeners.delete(listener);
  };
}
