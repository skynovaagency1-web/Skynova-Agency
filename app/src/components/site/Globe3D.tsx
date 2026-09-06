import { useEffect, useRef } from "react";

import { onOrbitingChange } from "@/lib/flight-handoff";

// Real WebGL globe for the "Fly anywhere" section, replacing the CSS sphere
// (a flat photo panned behind a border-radius) and the flat photo plane that
// only faked depth. Here the plane genuinely passes BEHIND the globe on the
// far side of its orbit and in front on the near side -- that's the depth
// buffer doing it, not a z-index guess.
//
// The Earth is now a supplied glTF model rather than one texture on a
// SphereGeometry: it carries a normal map, a roughness map and a separate
// cloud shell, so the terminator and the cloud parallax are real geometry
// instead of a painted-on look.
//
// Three deliberate constraints, because this sits on a page whose scroll
// performance we already had to fix once:
//   1. `three` and the model are dynamically imported and only when the
//      section is near the viewport, so they stay out of the main bundle and
//      visitors who never scroll this far never download them at all.
//   2. The render loop runs ONLY while the section is on screen -- same
//      lesson as the footer video, which was decoding site-wide for nothing.
//   3. prefers-reduced-motion renders a single static frame, no loop.
//
// The destination chips stay as real DOM links on top of this canvas: canvas
// text is invisible to search engines, and those links are how destination
// pages get crawled.

/** The model is authored at radius 1; the section was composed around a 2.2
 *  sphere, so everything is scaled to match rather than re-framing the shot. */
const MODEL_RADIUS = 1;
const TARGET_RADIUS = 2.2;

/** Orbit radius: far enough off the surface to clear the cloud shell. */
const ORBIT_RADIUS = 2.72;
/**
 * Seconds for one full circuit. This used to be 26 -- a slow, ambient cruise
 * for an aircraft that was always there. It is now a lap the aircraft flies on
 * arrival, and a visitor scrolling past gives it a few seconds, not half a
 * minute, so a lap has to actually complete in view.
 */
const ORBIT_PERIOD = 11;
/**
 * Where the aircraft joins the ring, in radians of orbit phase.
 *
 * The rail it arrives from runs down the far LEFT of the viewport, so it has
 * to appear on the left of the globe or the handoff reads as a cut rather than
 * a continuation. Rotating (R,0,0) about Y by pi puts it at world -X, which is
 * screen-left under a camera looking down -Z.
 */
const ENTRY_PHASE = Math.PI;
/** How fast the aircraft fades in and out at the handoff, in units/sec. */
const HANDOFF_FADE = 3.2;
/**
 * The orbit is TILTED, not a level ring. A flat circle reads as clip-art:
 * it never crosses the globe's centre line, so nothing about it says three
 * dimensions. Tilting sends the aircraft above the equator on one pass and
 * below it on the other, and the depth buffer hides it behind the globe for
 * half of every circuit -- which is what actually sells the orbit. Two axes
 * rather than one so the ellipse is not symmetric about the screen.
 */
const ORBIT_TILT_X = 0.46;
const ORBIT_TILT_Z = 0.2;
/**
 * Aircraft length in world units, against a 2.2-radius globe.
 *
 * 1.15, not the 0.62 this started at: at 0.62 it rendered about 67px long
 * against a 476px globe and simply could not be read as an aircraft. Going
 * bigger is close to free here -- the nose sticks out TANGENTIALLY along the
 * direction of travel and the wings perpendicular to the orbital plane, so
 * neither adds much to the distance from the globe's centre. Doubling the
 * length moves the widest point of the whole assembly from 310px to 320px,
 * against a 340px canvas edge.
 */
const PLANE_LENGTH = 1.15;

/**
 * The orbit is now DRAWN, not only travelled.
 *
 * Flying the aircraft on a correct tilted orbit was only half of it: the globe
 * writes depth, so the aircraft is genuinely hidden behind the planet for
 * roughly a third of every circuit, and while it is gone there was nothing
 * left on screen to say it had ever followed a curve. It read as a dot that
 * wanders near a sphere and occasionally vanishes.
 *
 * Thin gold rings on the same plane fix both halves: the path stays legible
 * while the aircraft is on the far side, and the rings are themselves occluded
 * by the planet, so they sell the depth even in a still frame.
 *
 * Three rings rather than one, at slightly different radii and each tipped a
 * couple of degrees off the plane, so they cross like a loose coil instead of
 * reading as one mechanical circle. The first is the real path -- its radius
 * is ORBIT_RADIUS exactly, so the aircraft rides ON it rather than near it.
 */
const RINGS = [
  { scale: 1, tiltX: 0, tiltZ: 0, thickness: 0.009, opacity: 0.6 },
  { scale: 1.058, tiltX: 0.052, tiltZ: -0.03, thickness: 0.007, opacity: 0.42 },
  { scale: 0.962, tiltX: -0.04, tiltZ: 0.045, thickness: 0.007, opacity: 0.42 },
] as const;

/**
 * Satellites, built in code rather than loaded.
 *
 * At this scale a satellite is a few dozen pixels, and what makes one legible
 * is the silhouette -- a small bright body with two long panels held off it.
 * That is three boxes. A downloaded model would spend hundreds of KB on
 * greebling nobody can resolve, on a section that already pulls two glTFs.
 *
 * Radii are spread so the orbits visibly nest, and each plane is tilted on
 * both axes so no two share one. Real orbits are not coplanar and not evenly
 * spaced; a fan of parallel rings is the thing that reads as decoration.
 */
const SATELLITES = [
  { radius: 2.42, tiltX: 1.02, tiltZ: 0.18, phase: 0.4, scale: 1 },
  { radius: 2.6, tiltX: -0.62, tiltZ: 0.75, phase: 2.1, scale: 0.85 },
  { radius: 2.86, tiltX: 0.28, tiltZ: -0.95, phase: 4.0, scale: 1.1 },
  { radius: 2.9, tiltX: 0.62, tiltZ: -0.3, phase: 5.4, scale: 0.9 },
] as const;
/** Seconds for one circuit at SAT_BASE_RADIUS; others scale from it (see below). */
const SAT_BASE_PERIOD = 34;
const SAT_BASE_RADIUS = 2.42;
/** Longest dimension of a satellite, panel tip to panel tip, in world units. */
const SAT_SPAN = 0.3;

export function Globe3D({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let started = false;
    let teardown: (() => void) | null = null;
    let setRunning: ((on: boolean) => void) | null = null;

    async function start() {
      if (started || disposed) return;
      started = true;

      let THREE: typeof import("three");
      let GLTFLoader: typeof import("three/examples/jsm/loaders/GLTFLoader.js")["GLTFLoader"];
      try {
        const [three, gltf] = await Promise.all([
          import("three"),
          import("three/examples/jsm/loaders/GLTFLoader.js"),
        ]);
        THREE = three;
        GLTFLoader = gltf.GLTFLoader;
      } catch {
        return; // bundle failed to load -- chips still render, section degrades quietly
      }
      if (disposed || !mount) return;

      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;

      // Built via IIFE rather than try/assign so TS sees it as definitely
      // assigned, and so a device without WebGL degrades to just the chips.
      const createdRenderer = (() => {
        try {
          return new THREE.WebGLRenderer({ alpha: true, antialias: true });
        } catch {
          return null;
        }
      })();
      if (!createdRenderer) return;
      // Rebound so it's non-null by TYPE, not just by narrowing: the render
      // loop below is a hoisted function declaration, and TS drops the
      // narrowing inside those since it can't prove call order.
      const renderer = createdRenderer;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const canvas = renderer.domElement;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      mount.appendChild(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      // 9.4, not the 7.4 this section was originally framed at. The globe
      // used to fill 86% of a square canvas, which was fine when it was the
      // only thing in it -- but the aircraft's orbit projected to 1.147 in
      // NDC, i.e. it flew off the left and right edges of the canvas on every
      // circuit, and the rings and satellites are further out still. Pulling
      // back puts the whole system inside the frame (globe 238px, aircraft
      // 298px, outermost satellite 318px in a 340px half-width) and, as a
      // bonus, opens a real gap before the DOM destination chips at 390px,
      // which the aircraft used to fly straight through.
      camera.position.set(0, 0, 9.4);

      // Everything the model owns hangs off this, so the axial tilt and the
      // spin are applied once rather than per layer.
      const globe = new THREE.Group();
      globe.rotation.z = THREE.MathUtils.degToRad(-14); // so it doesn't spin like a top
      scene.add(globe);

      const gltf = await new GLTFLoader().loadAsync("/assets/models/earth.glb").catch(() => null);
      if (disposed) return;

      // Rotates a touch faster than the surface, so the cloud shell drifts
      // over the continents instead of being welded to them.
      let clouds: import("three").Object3D | null = null;

      if (gltf) {
        const model = gltf.scene;
        model.scale.setScalar(TARGET_RADIUS / MODEL_RADIUS);

        model.traverse((child) => {
          if (!(child as import("three").Mesh).isMesh) return;
          const mesh = child as import("three").Mesh;

          // Two layers ship with NO material assigned, which glTF renders as
          // the default opaque white -- the atmosphere shell alone (r=1.085)
          // would have covered the Earth completely. They are handled by name
          // rather than by index so a re-export can reorder meshes safely.
          if (mesh.name === "city_lights") {
            // A night-lights layer with no texture in the file to drive it;
            // shown as-is it is just a white sphere over the daylight map.
            mesh.visible = false;
            return;
          }

          if (mesh.name === "atmosphere") {
            (mesh.material as import("three").Material)?.dispose?.();
            // The gold rim the section was designed around: --sky-coral
            // (#c9a227) is 0.788/0.635/0.153 in float RGB. BackSide plus
            // additive reads as atmosphere rather than a shell.
            mesh.material = new THREE.MeshBasicMaterial({
              color: new THREE.Color(0.788, 0.635, 0.153),
              transparent: true,
              opacity: 0.14,
              side: THREE.BackSide,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            });
            return;
          }

          if (mesh.name === "clouds") {
            clouds = mesh;
            const mat = mesh.material as import("three").MeshStandardMaterial;
            // Authored alphaMode BLEND, but depthWrite must be off too or the
            // cloud shell punches a hole in the Earth behind it.
            mat.transparent = true;
            mat.depthWrite = false;
            return;
          }
        });

        globe.add(model);
      } else {
        // The model is the whole point of this section, but a failed fetch
        // should not leave an empty box -- fall back to the plain sphere.
        const fallback = new THREE.Mesh(
          new THREE.SphereGeometry(TARGET_RADIUS, 48, 48),
          new THREE.MeshStandardMaterial({ color: 0x2a3a4a, roughness: 1 }),
        );
        globe.add(fallback);
      }

      scene.add(new THREE.AmbientLight(0xffffff, 1.5));
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
      keyLight.position.set(-3.5, 2, 4.5);
      scene.add(keyLight);

      // A real aircraft on a real orbit, replacing the flat cutout sprite that
      // used to hover in front. The old comment called a loop "a fake
      // carousel", and it was right ABOUT A SPRITE: a 2D cutout cannot bank
      // or turn away from you, so it slides across like a sticker. A model
      // can, and the globe already writes depth -- so it is genuinely hidden
      // behind the planet for half of every circuit, with no z-index tricks.
      // Two nested groups, not one with three Euler angles. With a single
      // group the default XYZ order applies the tilt to the aircraft's
      // starting POSITION before the spin, which traces a small circle -- a
      // latitude ring sitting in the upper hemisphere -- instead of an orbit
      // through the planet's centre. Separating them makes the spin innermost
      // and the tilt outermost, so the path is a great circle whatever the
      // tilt is set to.
      const orbit = new THREE.Group(); // fixed tilt of the orbital plane
      orbit.rotation.x = ORBIT_TILT_X;
      orbit.rotation.z = ORBIT_TILT_Z;
      scene.add(orbit);
      const spinner = new THREE.Group(); // travel around that plane
      orbit.add(spinner);

      // Children of `orbit` and not of `spinner`: the rings mark the plane, so
      // they hold still while the aircraft travels along them.
      for (const spec of RINGS) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(ORBIT_RADIUS * spec.scale, spec.thickness, 8, 192),
          new THREE.MeshStandardMaterial({
            color: 0xc9a227, // --sky-coral, the same gold as the atmosphere rim
            metalness: 0.55,
            roughness: 0.28,
            // A floor on the unlit side. There is no environment map in this
            // scene, so a metallic hairline curving away from the key light
            // would break into what looks like a dashed line; the emissive
            // keeps the far half a dim gold instead of nothing.
            emissive: 0xc9a227,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: spec.opacity,
            // Off so three overlapping hairlines don't sort against each
            // other. depth TESTING stays on -- being hidden behind the planet
            // is the entire point of drawing them.
            depthWrite: false,
          }),
        );
        // TorusGeometry is authored in XY with its axis down Z; the orbit runs
        // in XZ about Y, so the ring is laid flat first. The tilt then has to
        // happen in a PARENT: applied on the ring itself it would be a spin
        // about the torus's own axis of symmetry, which is a no-op -- the same
        // trap as the single-group orbit above, one level down.
        ring.rotation.x = -Math.PI / 2;
        const tilt = new THREE.Group();
        tilt.rotation.x = spec.tiltX;
        tilt.rotation.z = spec.tiltZ;
        tilt.add(ring);
        orbit.add(tilt);
      }

      // Satellites. Each gets its own tilt group holding its own spinner, for
      // the same reason the aircraft's orbit does: a tilt applied in the same
      // group as the travel rotation is applied to the STARTING POSITION and
      // degenerates into a small latitude circle rather than a great circle.
      const satBody = new THREE.MeshStandardMaterial({
        color: 0xf2eee4, // the aircraft's shell white, so they read as a set
        metalness: 0.5,
        roughness: 0.42,
      });
      const satPanel = new THREE.MeshStandardMaterial({
        // Real arrays are near-black and only show as panels when the light
        // catches them; against a cream page a flat dark rectangle disappears,
        // so this is lifted to a deep slate with a little sheen.
        color: 0x2f3542,
        metalness: 0.72,
        roughness: 0.34,
      });
      const satAccent = new THREE.MeshStandardMaterial({
        color: 0xc9a227,
        metalness: 0.6,
        roughness: 0.3,
      });
      // One geometry each, shared across all four -- four satellites are not
      // worth four copies of three boxes.
      const bodyGeo = new THREE.BoxGeometry(0.075, 0.075, 0.1);
      const panelGeo = new THREE.BoxGeometry(0.105, 0.005, 0.062);
      const mastGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.055, 6);
      const dishGeo = new THREE.SphereGeometry(0.028, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);

      const satSpinners: import("three").Group[] = [];
      for (const spec of SATELLITES) {
        const sat = new THREE.Group();
        const body = new THREE.Mesh(bodyGeo, satBody);
        sat.add(body);
        // Panels out along local X on both sides, on short masts, so there is
        // a gap between body and array -- that gap is most of what makes the
        // silhouette read as a satellite rather than a brick.
        for (const side of [-1, 1]) {
          const panel = new THREE.Mesh(panelGeo, satPanel);
          panel.position.set(side * 0.108, 0, 0);
          sat.add(panel);
          const mast = new THREE.Mesh(mastGeo, satAccent);
          mast.rotation.z = Math.PI / 2; // cylinders are authored up +Y
          mast.position.set(side * 0.05, 0, 0);
          sat.add(mast);
        }
        // Dish on the underside, pointed at the planet it is meant to be
        // talking to.
        const dish = new THREE.Mesh(dishGeo, satAccent);
        dish.rotation.z = Math.PI / 2;
        dish.position.set(-0.05, 0, 0);
        sat.add(dish);

        sat.scale.setScalar(spec.scale);
        // Sitting at +X, so -X is down toward the planet: that is where the
        // dish and the body's "underside" already point.
        sat.position.set(spec.radius, 0, 0);

        const spinner2 = new THREE.Group();
        spinner2.add(sat);
        spinner2.rotation.y = spec.phase;
        const satTilt = new THREE.Group();
        satTilt.rotation.x = spec.tiltX;
        satTilt.rotation.z = spec.tiltZ;
        satTilt.add(spinner2);
        scene.add(satTilt);
        satSpinners.push(spinner2);
      }

      const planeGltf = await new GLTFLoader()
        .loadAsync("/assets/models/airliner.glb")
        .catch(() => null);
      if (disposed) return;

      // Held outside the block so the handoff below can fade them; null when
      // the model failed to load, which the fade tolerates.
      let craftRoot: import("three").Object3D | null = null;
      const craftMaterials: import("three").MeshStandardMaterial[] = [];

      if (planeGltf) {
        const craft = planeGltf.scene;
        craftRoot = craft;
        const pb = new THREE.Box3().setFromObject(craft);
        const psize = new THREE.Vector3();
        const pcentre = new THREE.Vector3();
        pb.getSize(psize);
        pb.getCenter(pcentre);
        craft.position.sub(pcentre);
        craft.scale.setScalar(PLANE_LENGTH / (Math.max(psize.x, psize.y, psize.z) || 1));

        // Silver rather than the model's near-black default: it has to read
        // both against the cream page AND against the dark half of the globe
        // it crosses, and a dark aircraft disappears over the ocean.
        const LIVERY: Record<string, number> = {
          shell: 0xf2eee4,
          panel: 0xd7d0c1,
          glass: 0x2b2721,
          metal: 0xb8b2a3,
          accent: 0xc9a227,
        };
        craft.traverse((child) => {
          const mesh = child as import("three").Mesh;
          if (!mesh.isMesh) return;
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (const m of mats) {
            const std = m as import("three").MeshStandardMaterial;
            if (!std) continue;
            if (std.name in LIVERY) std.color.setHex(LIVERY[std.name]);
            // Opt every material into transparency once, here, rather than
            // flipping the flag during the fade: toggling `transparent` at
            // runtime forces a shader recompile, which is a frame hitch at
            // exactly the moment the handoff needs to look seamless.
            std.transparent = true;
            std.opacity = 0;
            craftMaterials.push(std);
          }
        });

        // Sitting at +X and spun about the group's Y, the direction of travel
        // is -Z -- which is exactly where this model's nose already points, so
        // no correction is needed for heading. The roll is: turning -90deg
        // about the nose puts the dorsal (+Y) outward at +X, so the belly
        // faces the planet the way an aircraft in flight actually sits.
        const holder = new THREE.Group();
        holder.position.set(ORBIT_RADIUS, 0, 0);
        holder.rotation.z = -Math.PI / 2;
        holder.add(craft);
        spinner.add(holder);
      }

      let elapsed = 0;
      const clock = new THREE.Clock();

      // Handoff state. The aircraft is NOT permanently in orbit any more: it
      // arrives off the page rail, flies a lap, and leaves. Starting hidden is
      // deliberate -- if the signal never comes the module's own fallback
      // reports "always orbiting", so an empty ring means a wiring fault
      // rather than a silently plausible still.
      let orbiting = false;
      let orbitPhase = ENTRY_PHASE;
      let craftOpacity = 0;

      const stopListening = onOrbitingChange((next) => {
        // Rising edge only: re-entering the section should put the aircraft
        // back on the near side of the ring rather than resuming wherever it
        // happened to be when it left.
        if (next && !orbiting) orbitPhase = ENTRY_PHASE;
        orbiting = next;
      });

      function place(dt: number) {
        if (orbiting) orbitPhase += (dt / ORBIT_PERIOD) * Math.PI * 2;
        spinner.rotation.y = orbitPhase;

        const target = orbiting ? 1 : 0;
        // Framerate-independent approach, so the fade takes the same wall time
        // on a 60Hz and a 120Hz display.
        craftOpacity += (target - craftOpacity) * Math.min(1, dt * HANDOFF_FADE);
        if (craftRoot) craftRoot.visible = craftOpacity > 0.004;
        for (const m of craftMaterials) m.opacity = craftOpacity;

        // Kepler's third law: period grows with the 3/2 power of the radius,
        // so the low satellites genuinely outrun the high ones instead of the
        // whole set turning in lockstep. It costs one exponent and it is the
        // single detail that stops this reading as a decorative carousel.
        for (let i = 0; i < satSpinners.length; i++) {
          const spec = SATELLITES[i];
          const period = SAT_BASE_PERIOD * Math.pow(spec.radius / SAT_BASE_RADIUS, 1.5);
          satSpinners[i].rotation.y = spec.phase + (elapsed / period) * Math.PI * 2;
        }
      }

      let raf = 0;
      let running = false;

      function frame() {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(clock.getDelta(), 0.05); // clamp so a backgrounded tab doesn't jump
        elapsed += dt;
        globe.rotation.y += dt * 0.075;
        if (clouds) clouds.rotation.y += dt * 0.022;
        place(dt);
        renderer.render(scene, camera);
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      setRunning = (on: boolean) => {
        if (reduceMotion || disposed) return;
        if (on && !running) {
          running = true;
          clock.getDelta(); // drop the idle gap so it resumes smoothly
          frame();
        } else if (!on && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      };

      // One static frame either way, so the globe is there before/without
      // motion. dt of 0 leaves the aircraft at opacity 0 and the satellites at
      // their authored phases, which is the correct still.
      place(0);
      renderer.render(scene, camera);
      if (!reduceMotion) setRunning(true);

      const resizeObserver = new ResizeObserver(() => {
        if (!mount) return;
        const w = mount.clientWidth || 1;
        const h = mount.clientHeight || 1;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        renderer.render(scene, camera);
      });
      resizeObserver.observe(mount);

      teardown = () => {
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        stopListening();
        // The whole scene, not just `globe`: the aircraft and now the rings
        // hang off `orbit`, and disposing only the globe leaked both of them
        // on every unmount. Walked rather than disposed from a fixed list
        // because the models own an unknown number of geometries, materials
        // and textures.
        scene.traverse((child) => {
          const mesh = child as import("three").Mesh;
          if (!mesh.isMesh) return;
          mesh.geometry?.dispose();
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (const mat of mats) {
            if (!mat) continue;
            for (const value of Object.values(mat)) {
              if (value && (value as import("three").Texture).isTexture) {
                (value as import("three").Texture).dispose();
              }
            }
            mat.dispose();
          }
        });
        renderer.dispose();
        canvas.remove();
      };

      // The effect's cleanup may already have run while we were awaiting the
      // dynamic import -- in that case nothing will call teardown for us.
      if (disposed) teardown();
    }

    // Gate both the download and the render loop on visibility.
    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!started) void start();
          else setRunning?.(true);
        } else {
          setRunning?.(false);
        }
      },
      { rootMargin: "200px" },
    );
    visibility.observe(mount);

    return () => {
      disposed = true;
      visibility.disconnect();
      teardown?.();
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
