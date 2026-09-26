/**
 * The scroll-driven flight from orbit to Paris.
 *
 * Pure maths, in its own module and with no three.js import, so the phase
 * boundaries and the coordinate conversion can be tested without a renderer
 * and read without opening the scene. The scene imports these; nothing here
 * imports the scene.
 *
 * NO ScrollTrigger, deliberately, even though gsap is already in the bundle.
 * This hero is pinned by a sticky element inside a tall track -- the same
 * device ScrollStage uses -- and ScrollTrigger's own pinning would want to
 * take over that job, against a layout that already has a sticky nav and its
 * own stage. A scroll listener writing one number into a ref, read inside
 * useFrame, is fewer moving parts and is the pattern this codebase settled on
 * after measuring what React state per scroll frame costs.
 */

/** Paris. The whole flight exists to arrive here. */
export const PARIS = { lat: 48.8566, lng: 2.3522 } as const;

/**
 * Where each phase ends, as a fraction of the pinned track.
 *
 *   0    -> IDLE_END     the Earth turning on its own, nobody has scrolled
 *   ->   -> FLIGHT_END   the approach: Paris swings round, the camera closes
 *   ->   -> LOCK_END     arrival. Paris centred, the marker lit
 *   ->   -> 1            the globe drifts up and the page takes over
 *
 * LOCK_END leaves 14% of the track for the exit, which is the "we have
 * arrived" beat: the camera keeps closing a little after the lock rather than
 * stopping dead on it, so the arrival reads as intentional instead of as the
 * animation running out.
 */
export const IDLE_END = 0.12;
export const FLIGHT_END = 0.62;
export const LOCK_END = 0.86;

export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** 0 before `from`, 1 after `to`, eased in between. */
export function phase(value: number, from: number, to: number): number {
  if (to <= from) return value >= to ? 1 : 0;
  return clamp01((value - from) / (to - from));
}

/** Cubic in-out. The approach should leave orbit gently and settle gently. */
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Cubic out, for the exit: quick to move, slow to stop. */
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Latitude and longitude to a point on a sphere.
 *
 * The same convention components/ui/3d-globe.tsx uses, so a marker placed by
 * that component and a rotation computed here agree about where a place is.
 * Verified against it in tests/globe-flight.test.ts rather than assumed.
 */
export function latLngToVec3(
  lat: number,
  lng: number,
  radius: number,
): { x: number; y: number; z: number } {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    z: radius * Math.sin(phi) * Math.sin(theta),
    y: radius * Math.cos(phi),
  };
}

/** How far the camera sits from the centre, in globe radii. */
export const CAMERA_FAR = 3.5;
export const CAMERA_NEAR = 1.62;
/** Field of view at each end. Narrowing it as we close adds the long-lens
 *  compression that makes the approach read as distance rather than scale. */
export const FOV_FAR = 45;
export const FOV_NEAR = 36;

/** One frame of the flight, derived from scroll progress alone. */
export function flightAt(progress: number) {
  const t = clamp01(progress);
  const approach = easeInOut(phase(t, IDLE_END, FLIGHT_END));
  const lock = phase(t, FLIGHT_END, LOCK_END);
  const exit = easeOut(phase(t, LOCK_END, 1));

  return {
    /** 1 while the Earth still turns on its own, 0 once the approach owns it. */
    idle: 1 - approach,
    approach,
    lock,
    exit,
    distance: mix(CAMERA_FAR, CAMERA_NEAR, approach) - lock * 0.14,
    fov: mix(FOV_FAR, FOV_NEAR, approach),
    /** The marker lights during the lock and stays lit through the exit. */
    markerGlow: lock,
    /** Hero copy is gone well before the arrival, so it never sits over Paris. */
    copy: 1 - clamp01(phase(t, 0.04, 0.34)),
    /** The globe drifts up and grows a touch as the page takes over. */
    driftY: exit * 0.55,
    scale: 1 + exit * 0.08,
  };
}
