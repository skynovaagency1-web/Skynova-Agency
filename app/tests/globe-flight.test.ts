import { describe, expect, test } from "bun:test";
import {
  PARIS,
  IDLE_END,
  FLIGHT_END,
  LOCK_END,
  flightAt,
  latLngToVec3,
  CAMERA_FAR,
  CAMERA_NEAR,
} from "../src/lib/globe-flight";

/**
 * The flight is scroll-driven, so every value in it is a function of one
 * number. That makes it testable without a renderer, which matters: the
 * alternative is checking a camera path by eye through a browser pane, and
 * this session has already shown how well that goes.
 */

describe("globe flight", () => {
  test("Paris converts to the same point the globe component would place it at", () => {
    // components/ui/3d-globe.tsx uses this identical convention. If either
    // drifts, a marker drawn there and a rotation computed here stop agreeing
    // about where Paris is, and the city ends up off-centre at the lock.
    const p = latLngToVec3(PARIS.lat, PARIS.lng, 1);
    const length = Math.hypot(p.x, p.y, p.z);
    expect(length).toBeCloseTo(1, 6);

    // Northern hemisphere, and only just east of the meridian: y dominates,
    // z is nearly nothing. These are the numbers, not a shape assertion.
    expect(p.y).toBeCloseTo(0.7528, 3);
    expect(p.x).toBeCloseTo(0.6577, 3);
    expect(Math.abs(p.z)).toBeLessThan(0.05);
  });

  test("the phases run in order and reach their ends", () => {
    expect(IDLE_END).toBeLessThan(FLIGHT_END);
    expect(FLIGHT_END).toBeLessThan(LOCK_END);
    expect(LOCK_END).toBeLessThan(1);

    const start = flightAt(0);
    expect(start.approach).toBe(0);
    expect(start.idle).toBe(1);
    expect(start.distance).toBeCloseTo(CAMERA_FAR, 5);

    const arrived = flightAt(FLIGHT_END);
    expect(arrived.approach).toBeCloseTo(1, 5);
    expect(arrived.idle).toBeCloseTo(0, 5);

    const end = flightAt(1);
    expect(end.lock).toBe(1);
    expect(end.exit).toBe(1);
  });

  test("the camera only ever closes in, and keeps closing after the lock", () => {
    // The approach must be monotonic: a camera that backs off mid-flight
    // reads as a mistake rather than as a move.
    let previous = Infinity;
    for (let i = 0; i <= 100; i++) {
      const { distance } = flightAt(i / 100);
      expect(distance).toBeLessThanOrEqual(previous + 1e-9);
      previous = distance;
    }
    // And the arrival is not where it stops -- that last bit of approach is
    // what makes the lock feel deliberate.
    expect(flightAt(1).distance).toBeLessThan(flightAt(FLIGHT_END).distance);
    expect(flightAt(1).distance).toBeGreaterThan(1);
  });

  test("the copy is gone before Paris arrives", () => {
    // Otherwise the headline sits across the city the whole flight was for.
    expect(flightAt(0).copy).toBeCloseTo(1, 5);
    expect(flightAt(FLIGHT_END).copy).toBe(0);
    expect(flightAt(LOCK_END).copy).toBe(0);
  });

  test("progress outside 0..1 is clamped rather than extrapolated", () => {
    expect(flightAt(-3).approach).toBe(0);
    expect(flightAt(9).exit).toBe(1);
    expect(flightAt(9).distance).toBeGreaterThan(0);
  });
});
