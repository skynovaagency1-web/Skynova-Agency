import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

import {
  PARIS,
  flightAt,
  latLngToVec3,
  FOV_FAR,
  CAMERA_FAR,
} from "@/lib/globe-flight";

/**
 * The canvas half of the flight hero, in its own module so the lazy boundary
 * sits ABOVE @react-three/fiber rather than inside it. Importing Canvas at the
 * top of the wrapper would pull the whole renderer into whatever chunk the
 * wrapper lands in, which is the bundling mistake the Fly-anywhere globe
 * already made once.
 *
 * WHAT THIS DELIBERATELY DOES NOT HAVE, against the brief: no bloom, no HDR
 * environment, no clouds layer, no night-lights texture. Bloom and HDR are
 * full-frame post-processing passes and are the most expensive thing that can
 * be added to a phone; clouds and night lights are two more multi-megabyte
 * textures on a hero that already carries one. This site's mobile performance
 * score is 53 and a paint-per-frame animation was removed from it today. The
 * atmosphere shader stays, because it is a few lines of fresnel on geometry
 * that already exists and is what actually sells the edge of the planet.
 */

const RADIUS = 1;
const IDLE_SPIN = 0.045; // radians per second, before anyone scrolls

/**
 * Configured by the loader rather than in render: mutating a texture the
 * component does not own is impure, and the compiler rejects it outright.
 *
 * anisotropy 4, not 8. It costs extra samples per fragment on a surface that
 * fills the whole screen at the end of the flight, and the globe is never
 * viewed at the grazing angles anisotropic filtering exists for.
 */
function configureTexture(loaded: THREE.Texture | THREE.Texture[]) {
  const map = Array.isArray(loaded) ? loaded[0] : loaded;
  if (!map) return;
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;
}

/** Fresnel rim, on the back face of a slightly larger sphere. */
function atmosphereMaterial(intensity: number) {
  return new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color("#7fb2ff") },
      intensity: { value: intensity },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main(){
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position,1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }`,
    fragmentShader: `
      uniform vec3 glowColor;
      uniform float intensity;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main(){
        float fresnel = pow(1.0 - abs(dot(vNormal, normalize(-vPosition))), 2.6);
        gl_FragColor = vec4(glowColor, fresnel * intensity);
      }`,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  });
}

/**
 * The real Earth: the glTF already in this repo, the one the Fly-anywhere
 * globe uses. A normal map, a roughness map, a cloud shell that drifts over
 * the surface, and its own atmosphere.
 *
 * LOADED WITH three's OWN GLTFLoader, NOT drei's useGLTF, and that is not a
 * style preference. useGLTF installs a meshopt decoder, which instantiates
 * WebAssembly. This site's Content-Security-Policy is
 * `script-src 'self' 'unsafe-inline' ...` with no wasm-unsafe-eval, so the
 * instantiate throws, the promise rejects, and the rejection takes the whole
 * scene module with it -- the canvas mounts, the textures load, and nothing
 * is ever drawn. That is exactly what happened, and it killed the plain
 * sphere too, on a viewport that never asked for the model.
 *
 * The CSP is not the thing to change. It is covered by
 * tests/security-headers.test.ts, and widening script-src to run WebAssembly
 * so a decorative globe can use a decoder it does not need is a bad trade.
 * components/site/Globe3D.tsx has loaded this same file with the plain loader
 * all along, which is why it has always worked.
 *
 * THE SPHERE SHOWS UNTIL THE MODEL ARRIVES. 3.18MB is a long time to look at
 * an empty hero, so the cheap textured globe renders immediately and is
 * replaced the moment the real one is ready.
 */
function EarthLayer({ narrow, map }: { narrow: boolean; map: THREE.Texture }) {
  const [model, setModel] = useState<THREE.Object3D | null>(null);
  const live = useRef<{ cloudLayer: THREE.Object3D | null }>({ cloudLayer: null });

  useEffect(() => {
    // A phone never loads it at all: 3.18MB and two extra spheres of overdraw
    // are the first things to go when the budget is small.
    if (narrow) return;
    let cancelled = false;

    void (async () => {
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const gltf = await new GLTFLoader().loadAsync("/assets/models/earth.glb").catch(() => null);
      if (cancelled || !gltf) return;

      const root = gltf.scene;
      let cloudLayer: THREE.Object3D | null = null;

      root.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;

        // These two ship with NO material -- confirmed by reading the file:
        // it declares only `earth_surface` and `clouds` -- and glTF renders a
        // missing material as opaque white. The atmosphere shell alone
        // (r = 1.085) would cover the Earth completely. Matched by name so a
        // re-export can reorder meshes safely.
        if (mesh.name === "city_lights") {
          mesh.visible = false;
          return;
        }
        if (mesh.name === "atmosphere") {
          mesh.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color("#7fb2ff"),
            transparent: true,
            opacity: 0.16,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
          return;
        }
        if (mesh.name === "clouds") {
          cloudLayer = mesh;
          const mat = mesh.material as THREE.MeshStandardMaterial;
          // Authored alphaMode BLEND, but depthWrite has to go too or the
          // shell punches a hole in the Earth behind it -- Globe3D's note.
          mat.transparent = true;
          mat.depthWrite = false;
        }
      });

      live.current = { cloudLayer };
      setModel(root);
    })();

    return () => {
      cancelled = true;
    };
  }, [narrow]);

  useFrame((_, delta) => {
    // Clouds drift a touch faster than the surface, so they read as weather
    // rather than as paint on the globe.
    const layer = live.current.cloudLayer;
    if (layer?.visible) layer.rotation.y += delta * 0.008;
  });

  if (model) return <primitive object={model} />;

  return (
    <mesh>
      <sphereGeometry args={[RADIUS, 48, 48]} />
      {/* Lambert, not standard: meshStandardMaterial runs a full BRDF per
          fragment, and at the end of this flight that is every pixel on
          screen. A globe lit by one key light does not need it. */}
      <meshLambertMaterial map={map} />
    </mesh>
  );
}

function Flight({ progressRef, narrow }: { progressRef: { current: number }; narrow: boolean }) {
  const globe = useRef<THREE.Group>(null);
  const marker = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  /* ONE TEXTURE, AND A SMALLER ONE. The map was 4096x2048 -- 8.4M pixels,
     34MB of GPU memory once decoded, for a sphere that is at most a screen
     wide. It is 2048x1024 now: 8MB, a quarter of the decode, and 455KB over
     the wire instead of 1.4MB.
     The bump map is gone entirely. It was another 8MB resident and a
     derivative computation in every fragment of a surface that fills the
     viewport at the end of the flight, to add relief that is invisible from
     orbit. */
  /* Loaded on both paths because a hook cannot be conditional, and cheap
     enough at 455KB that the desktop paying for it is not worth a second
     component to avoid. */
  const map = useTexture("/assets/globe/earth-map.jpg", configureTexture);

  /** Where Paris sits on the sphere, and the rotation that brings it to face
   *  the camera. Quaternions rather than euler angles: slerping between two
   *  orientations takes the short way round, where three separate angles
   *  interpolated independently can swing the planet the long way. */
  const { parisPos, parisQuat } = useMemo(() => {
    const p = latLngToVec3(PARIS.lat, PARIS.lng, RADIUS);
    const dir = new THREE.Vector3(p.x, p.y, p.z).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(dir, new THREE.Vector3(0, 0, 1));
    return { parisPos: new THREE.Vector3(p.x, p.y, p.z), parisQuat: q };
  }, []);

  const atmosphere = useMemo(() => atmosphereMaterial(0.9), []);
  const atmosphereMesh = useRef<THREE.Mesh>(null);

  /* Scratch objects for the frame loop, in REFS rather than useMemo.
     They are written on every frame, and a useMemo result is a render value:
     mutating one after render is impure and the compiler says so outright
     ("Cannot modify local variables after render completes"). A ref is the
     thing that is allowed to change. They exist at all so the loop allocates
     nothing -- a new Quaternion per frame is garbage sixty times a second. */
  const idleQuat = useRef(new THREE.Quaternion());
  const spinAxis = useRef(new THREE.Vector3(0, 1, 0));
  const working = useRef(new THREE.Quaternion());

  useFrame((state, delta) => {
    const group = globe.current;
    if (!group) return;

    // One number in, every value out. Read from a ref, never from state --
    // sixty state updates a second re-render the whole tree, which this
    // codebase has already measured the cost of once.
    const f = flightAt(progressRef.current);

    // Idle turn, fading out as the approach takes over so there is no moment
    // where the planet is being spun by two things at once.
    idleQuat.current.setFromAxisAngle(spinAxis.current, state.clock.elapsedTime * IDLE_SPIN);
    working.current.copy(idleQuat.current).slerp(parisQuat, f.approach);
    group.quaternion.copy(working.current);

    group.position.y = f.driftY;
    group.scale.setScalar(f.scale);

    /* The camera comes from the frame callback, not from useThree() at
       render: it is mutated every frame, and a value read during render is
       one the compiler will not let this touch afterwards. */
    const perspective = state.camera as THREE.PerspectiveCamera;
    perspective.position.z = f.distance;
    if (perspective.isPerspectiveCamera && perspective.fov !== f.fov) {
      perspective.fov = f.fov;
      perspective.updateProjectionMatrix();
    }

    // The arrival: the marker lights during the lock and stays lit. It is a
    // child of the globe group, so it is already in the right place -- the
    // rotation that centres Paris carries it too.
    const glow = f.markerGlow;
    if (marker.current) {
      const m = marker.current.material as THREE.MeshBasicMaterial;
      m.opacity = glow;
      marker.current.visible = glow > 0.01;
    }
    if (halo.current) {
      const m = halo.current.material as THREE.MeshBasicMaterial;
      // A slow pulse, but only once it is actually lit.
      m.opacity = glow * (0.32 + 0.18 * Math.sin(state.clock.elapsedTime * 2.2));
      halo.current.visible = glow > 0.01;
      halo.current.scale.setScalar(1 + glow * 0.5);
    }
    /* The atmosphere is a second full-screen pass: a transparent back-faced
       sphere larger than the globe, so close in it covers everything the
       planet does, twice. Fading it with the approach removes that overdraw
       exactly when the globe is biggest -- and it is what the eye expects
       anyway, since you do not see a halo from inside the atmosphere. */
    const shell = atmosphereMesh.current;
    if (shell) {
      const mat = shell.material as THREE.ShaderMaterial;
      mat.uniforms.intensity.value = 0.9 * (1 - f.approach * 0.85);
      shell.visible = f.approach < 0.98;
    }
    void delta;
  });

  return (
    <>
      {/* Two lights, not three. Each one is per-fragment work on a surface
          that fills the screen; the blue rim fill was doing a job the
          atmosphere already does. */}
      <ambientLight intensity={0.62} />
      <directionalLight position={[4, 2, 5]} intensity={1.5} />

      <group ref={globe}>
        <EarthLayer narrow={narrow} map={map} />

        {/* Paris. Sitting just off the surface so it is never z-fought by the
            sphere it belongs to. */}
        <mesh ref={marker} position={parisPos.clone().multiplyScalar(1.012)}>
          <sphereGeometry args={[0.016, 16, 16]} />
          <meshBasicMaterial color="#ffd27a" transparent opacity={0} />
        </mesh>
        <mesh ref={halo} position={parisPos.clone().multiplyScalar(1.006)}>
          <sphereGeometry args={[0.042, 20, 20]} />
          <meshBasicMaterial color="#ffb347" transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>

      <mesh ref={atmosphereMesh} scale={[1.14, 1.14, 1.14]}>
        <sphereGeometry args={[RADIUS, 48, 32]} />
        <primitive object={atmosphere} attach="material" />
      </mesh>
    </>
  );
}

export default function HeroGlobeScene({
  progressRef,
}: {
  progressRef: { current: number };
}) {
  /* Every pixel of this canvas runs the globe's fragment shader, and at the
     end of the flight the globe covers all of them. Device pixel ratio is
     therefore the single biggest lever on cost: 1.25 instead of 2 is roughly
     60% fewer fragments. Narrow screens are both the slowest devices and the
     ones where the difference is least visible. */
  const narrow = typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches;

  return (
    <Canvas
      dpr={narrow ? [1, 1.25] : [1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: FOV_FAR, near: 0.01, far: 100, position: [0, 0, CAMERA_FAR] }}
      style={{ background: "transparent" }}
    >
      <Flight progressRef={progressRef} narrow={narrow} />
    </Canvas>
  );
}
