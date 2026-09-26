import { useMemo, useRef } from "react";
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

/** Configured by the loader rather than in render: mutating a texture the
 *  component does not own is impure, and the compiler rejects it outright. */
function configureTextures(loaded: THREE.Texture | THREE.Texture[]) {
  const [map, bump] = Array.isArray(loaded) ? loaded : [loaded];
  if (map) {
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
  }
  if (bump) bump.anisotropy = 4;
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

function Flight({ progressRef }: { progressRef: { current: number } }) {
  const globe = useRef<THREE.Group>(null);
  const marker = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  const [map, bump] = useTexture(
    ["/assets/globe/earth-map.jpg", "/assets/globe/earth-bump.png"],
    configureTextures,
  );

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
    void delta;
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 2, 5]} intensity={1.6} />
      <directionalLight position={[-3, 1, -2]} intensity={0.4} color="#8bb8ff" />

      <group ref={globe}>
        <mesh>
          <sphereGeometry args={[RADIUS, 64, 64]} />
          <meshStandardMaterial map={map} bumpMap={bump} bumpScale={0.02} roughness={0.85} metalness={0} />
        </mesh>

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

      <mesh scale={[1.14, 1.14, 1.14]}>
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
  return (
    <Canvas
      /* dpr capped at 1.6 rather than 2: this is a full-bleed hero, and the
         difference between 1.6x and 2x on a phone is invisible where the cost
         of the extra pixels is not. */
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: FOV_FAR, near: 0.01, far: 100, position: [0, 0, CAMERA_FAR] }}
      style={{ background: "transparent" }}
    >
      <Flight progressRef={progressRef} />
    </Canvas>
  );
}
