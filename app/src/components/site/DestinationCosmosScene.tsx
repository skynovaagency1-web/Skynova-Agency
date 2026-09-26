import { useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { ParticleSphere } from "@/components/ui/cosmos-3d-orbit-gallery";

/**
 * The canvas half of DestinationCosmos, in its own module so the lazy import
 * boundary sits above @react-three/fiber rather than inside it -- importing
 * Canvas at the top of the wrapper would pull the whole renderer into
 * whatever chunk the wrapper lands in, which is the bundling mistake the
 * Fly-anywhere globe already made once.
 */

/**
 * Module constant, deliberately. useTexture caches on the array it is given,
 * so an array rebuilt on every render reloads twelve textures on every
 * render.
 *
 * Square 256px crops of destination heroes this site already owns -- not
 * stock photography from someone else's CDN, which is the line the gear page
 * holds about product shots and the marker globe holds about its pins.
 */
const COSMOS_IMAGES = [
  "/assets/cosmos/portugal.jpg",
  "/assets/cosmos/switzerland.jpg",
  "/assets/cosmos/italy.jpg",
  "/assets/cosmos/japan.jpg",
  "/assets/cosmos/vietnam.jpg",
  "/assets/cosmos/peru.jpg",
  "/assets/cosmos/kenya.jpg",
  "/assets/cosmos/namibia.jpg",
  "/assets/cosmos/jordan.jpg",
  "/assets/cosmos/new-zealand.jpg",
  "/assets/cosmos/fiji.jpg",
  "/assets/cosmos/united-arab-emirates.jpg",
];

/**
 * How the ring is framed, which cannot be one setting for both shapes.
 *
 * The images sit on a ring of radius 9 and the demo's camera is 14 units out
 * at fov 50 -- framed for a wide desktop canvas. In a phone-width box the
 * horizontal field is far narrower, so that same camera cuts the ring off at
 * both sides and the photos at the edges leave the frame entirely.
 *
 * Pulling back and widening the field fits the whole ring; the images are
 * scaled up to compensate, so they end up roughly the same size on screen
 * rather than shrinking to nothing.
 */
const DESKTOP = { position: [-10, 1.5, 10] as const, fov: 50, imageSize: 1.5 };
const PHONE = { position: [-13.5, 2, 13.5] as const, fov: 62, imageSize: 2.3 };

function readNarrow() {
  return window.matchMedia("(max-width: 720px)").matches;
}

export default function DestinationCosmosScene() {
  /**
   * Decided once. Following a resize would remount the Canvas and reload
   * twelve textures mid-scroll, which is far worse than a framing that is
   * slightly off for someone who rotated their phone while looking at it.
   */
  const narrow = useSyncExternalStore(
    () => () => {},
    readNarrow,
    () => false,
  );
  const framing = narrow ? PHONE : DESKTOP;

  return (
    <Canvas
      camera={{ position: [...framing.position], fov: framing.fov }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <ParticleSphere images={COSMOS_IMAGES} imageSize={framing.imageSize} />
      {/* No zoom and no pan: this is a band across a page people are scrolling
          through, and a drag that zooms a galaxy instead of scrolling the
          page is a trap on a phone. Rotation stays, because turning it to
          look at another photo is the one interaction worth having. */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.35}
      />
    </Canvas>
  );
}
