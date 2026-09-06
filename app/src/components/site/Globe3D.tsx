import { useEffect, useRef } from "react";

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
/** Seconds for one full circuit. Slow enough to read as cruising, not spinning. */
const ORBIT_PERIOD = 26;
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
/** Aircraft length in world units, against a 2.2-radius globe. */
const PLANE_LENGTH = 0.62;

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
      camera.position.set(0, 0, 7.4);

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

      const planeGltf = await new GLTFLoader()
        .loadAsync("/assets/models/airliner.glb")
        .catch(() => null);
      if (disposed) return;

      if (planeGltf) {
        const craft = planeGltf.scene;
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
            if (std && std.name in LIVERY) std.color.setHex(LIVERY[std.name]);
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

      function place() {
        // One circuit per ORBIT_PERIOD seconds.
        spinner.rotation.y = (elapsed / ORBIT_PERIOD) * Math.PI * 2;
      }

      let raf = 0;
      let running = false;

      function frame() {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(clock.getDelta(), 0.05); // clamp so a backgrounded tab doesn't jump
        elapsed += dt;
        globe.rotation.y += dt * 0.075;
        if (clouds) clouds.rotation.y += dt * 0.022;
        place();
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

      // One static frame either way, so the globe is there before/without motion.
      place();
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
        // The model owns an unknown number of geometries, materials and
        // textures, so walk it rather than disposing a fixed list.
        globe.traverse((child) => {
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
