import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

/**
 * Vendored from 21st.dev. Three changes from the supplied source:
 *
 * 1. NO "use client". A Next.js server-component marker, and this is TanStack
 *    Start, where every component is already a client one.
 *
 * 2. THE PARTICLES ARE ONE <points>, NOT 1500 MESHES. The supplied version
 *    maps 1500 particles to 1500 <mesh> elements, each with its own
 *    sphereGeometry and its own material -- 1500 draw calls and 1500 three.js
 *    objects for dots drawn at roughly one pixel. A single points cloud with
 *    a position buffer and a colour buffer is one draw call and looks the
 *    same at this size. This site's mobile performance score is already 53;
 *    shipping 1500 draw calls onto a page for decoration is not a trade worth
 *    making. The cost is per-particle size variation, which at a radius of
 *    0.005-0.01 world units nobody can see.
 *
 * 3. The random per-image `color` is gone. It was computed for every orbiting
 *    image and then never referenced -- the plane's material takes `map`, not
 *    `color` -- so it generated work and an impression of configurability
 *    that did nothing.
 *
 * `images` must be a stable array. useTexture keys its cache on it, so a
 * caller that rebuilds the array every render reloads every texture; pass a
 * module constant or a useMemo.
 */

interface ParticleSphereProps {
  images: string[];
  /** Radius of the sphere the particles sit on and the images orbit. */
  radius?: number;
  /** Edge length of each orbiting image plane, in world units. */
  imageSize?: number;
  /** Y rotation per frame. 0 stops the orbit. */
  rotationSpeed?: number;
}

/**
 * Deterministic noise, replacing Math.random() in the cloud.
 *
 * The supplied component calls Math.random() inside a useMemo, which the
 * compiler rejects -- "Cannot call impure function during render" -- and it is
 * right to: a memo may re-run, and the whole star field would silently
 * rearrange when it did. Seeded, the field is the same every time it is
 * built, which is both pure and the behaviour anyone would expect.
 *
 * mulberry32: small, fast, and good enough for scattering dots.
 */
function seededRandom(seed: number) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const PARTICLE_COUNT = 1500;
const POSITION_RANDOMNESS = 4;
/** World-unit diameter of a particle, with attenuation so far ones shrink. */
const PARTICLE_SIZE = 0.05;

export function ParticleSphere({
  images,
  radius = 9,
  imageSize = 1.5,
  rotationSpeed = 0.0005,
}: ParticleSphereProps) {
  const groupRef = useRef<THREE.Group>(null);

  const textures = useTexture(images);

  /**
   * Positions and colours for the whole cloud, as two flat Float32Arrays.
   *
   * The distribution is the supplied one: an even spread over the sphere by
   * arccos, with the radius jittered so it reads as a cloud rather than a
   * shell.
   */
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const color = new THREE.Color();
    const random = seededRandom(0x5c1f0a);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
      const r = radius + (random() - 0.5) * POSITION_RANDOMNESS;

      pos[i * 3] = r * Math.cos(theta) * Math.sin(phi);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi);

      // Yellow-orange, as supplied.
      color.setHSL(random() * 0.1 + 0.05, 0.8, 0.6 + random() * 0.3);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return [pos, col] as const;
  }, [radius]);

  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, [positions, colors]);

  /** One plane per image, evenly spaced around the equator, facing outward. */
  const orbitingImages = useMemo(() => {
    const count = images.length;
    const up = new THREE.Vector3(0, 1, 0);
    const centre = new THREE.Vector3(0, 0, 0);

    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const position = new THREE.Vector3(
        radius * Math.cos(angle),
        0,
        radius * Math.sin(angle),
      );

      const outward = position.clone().sub(centre).normalize();
      const matrix = new THREE.Matrix4().lookAt(
        position,
        position.clone().add(outward),
        up,
      );
      const euler = new THREE.Euler().setFromRotationMatrix(matrix);

      return {
        position: [position.x, position.y, position.z] as [number, number, number],
        rotation: [euler.x, euler.y, euler.z] as [number, number, number],
        textureIndex: i % Math.max(textures.length, 1),
      };
    });
  }, [images.length, radius, textures.length]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      <points geometry={particleGeometry}>
        <pointsMaterial
          size={PARTICLE_SIZE}
          vertexColors
          sizeAttenuation
          transparent
          depthWrite={false}
        />
      </points>

      {orbitingImages.map((image, index) => (
        <mesh key={`image-${index}`} position={image.position} rotation={image.rotation}>
          <planeGeometry args={[imageSize, imageSize]} />
          <meshBasicMaterial
            map={textures[image.textureIndex]}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default ParticleSphere;
