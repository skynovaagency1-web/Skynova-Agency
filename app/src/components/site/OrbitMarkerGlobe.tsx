import { Suspense, lazy, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { onDockedChange } from "@/lib/globe-handoff";

import type { GlobeMarker } from "@/components/ui/3d-globe";

/**
 * Loads the marker globe only when the section is close to the viewport.
 *
 * components/ui/3d-globe.tsx imports three, @react-three/fiber and
 * @react-three/drei at the top of the module. Importing it statically from
 * Sections3 put all of that into the homepage's main chunk -- measured, the
 * entry went to 765KB -- which every visitor downloads before the page is
 * interactive, for a section most of them never scroll to.
 *
 * components/site/Globe3D.tsx already had this right and says why: three and
 * the model are fetched only when their section is near, so the render loop
 * and the bytes both stay off the critical path. This is the same rule
 * applied to the same problem, with React.lazy doing the deferring because
 * the dependency here is the component rather than a model file.
 *
 * 300px of rootMargin: far enough that the globe is loading while the
 * previous section is still passing, close enough that a visitor who stops
 * above it never pays.
 */
const MarkerGlobe = lazy(async () => {
  const mod = await import("@/components/ui/3d-globe");
  return { default: mod.Globe3D };
});

export function OrbitMarkerGlobe({
  className,
  markers,
}: {
  className?: string;
  markers: GlobeMarker[];
}) {
  const holderRef = useRef<HTMLDivElement | null>(null);
  const [seen, setSeen] = useState(false);

  /**
   * Hidden until the hero's travelling globe lands here.
   *
   * The same contract components/site/Globe3D.tsx follows, and it matters
   * again now that HeroStage is the homepage hero: that hero flies a cheap CSS
   * globe down the page and docks it onto this stage. With this globe simply
   * always visible, the reader would watch one globe fly toward another globe
   * already sitting in the target -- which is exactly the "two unrelated
   * globes four thousand pixels apart" that lib/globe-handoff.ts was written
   * to get rid of.
   *
   * On any page with no travelling stage the signal reports docked
   * immediately, so this can never end up permanently invisible waiting for a
   * handoff that is not coming.
   */
  const [docked, setDocked] = useState(true);
  useEffect(() => onDockedChange(setDocked), []);

  /**
   * No IntersectionObserver (a very old browser): load the globe rather than
   * leave an empty hole where it should be.
   *
   * Derived rather than written from the effect. It is a capability check --
   * it cannot change while the page is open and it needs no render to settle
   * -- so mirroring it into state from an effect body is the cascade the lint
   * rule is about, and it was my own code doing it two commits after I fixed
   * six others for the same thing.
   */
  const noObserver = useSyncExternalStore(
    () => () => {},
    () => typeof IntersectionObserver === "undefined",
    () => false,
  );
  const near = noObserver || seen;

  useEffect(() => {
    const el = holderRef.current;
    if (!el || noObserver) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          // From the observer's callback, not the effect body: reacting to
          // something that happened is exactly what an effect is for.
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [noObserver]);

  return (
    <div ref={holderRef} className={className} data-docked={docked ? "true" : "false"}>
      {near ? (
        <Suspense fallback={null}>
          <MarkerGlobe
            className="h-full w-full"
            markers={markers}
            config={{
              radius: 2,
              // The ring of destination links sits on top of this and is what
              // gets clicked; letting the globe swallow drags would fight it.
              enableZoom: false,
              enablePan: false,
              autoRotateSpeed: 0.3,
              showAtmosphere: true,
              atmosphereColor: "#4da6ff",
              atmosphereIntensity: 0.9,
              bumpScale: 4,
            }}
          />
        </Suspense>
      ) : null}
    </div>
  );
}
