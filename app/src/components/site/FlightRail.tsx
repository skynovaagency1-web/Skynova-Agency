import { useEffect, useRef } from "react";

/**
 * Page-level flight rail: a fixed route down the left edge with a real 3D
 * aircraft flying it, which levels off and touches down as it reaches each
 * heading, then climbs away again.
 *
 * The landing is the point of the thing. The aircraft does not simply track
 * scroll progress -- it targets the nearest heading and eases onto it, so it
 * appears to stop in front of each headline rather than drift past. Two
 * things move together to sell that: the position eases toward the heading,
 * and the model rolls from an overhead view to a side-on profile, so a plane
 * seen from above becomes a plane seen landing.
 *
 * Orientation, the expensive lesson: this glb's raw accessor bounds report
 * its longest axis as Y, but 109 of its nodes carry `matrix` transforms, so
 * local bounds say nothing about world orientation. The nose is -Z once the
 * scene graph is applied. Both bases below are written explicitly rather than
 * as Euler angles for that reason -- an assumed axis is what put the
 * aircraft 90 degrees out the first time. Scale is taken from a runtime
 * Box3, which respects the transforms, never from the raw bounds.
 */

/** Horizontal centre of the route, as a fraction of the rail's width. */
const ROUTE_X = 0.5;
/** Vertical extent of the route within the viewport, as fractions. */
const ROUTE_TOP = 0.08;
const ROUTE_BOTTOM = 0.92;

/* STRAIGHT, deliberately. A weave needs horizontal room, and horizontal room
   means either a gutter that narrows every section or an aircraft that
   overlaps the copy. Raise this to bring an S back, and re-check the
   aircraft still clears the text if you do. */
const WAVE_AMPLITUDE = 0;
const WAVES = 1.5;

function routeX(t: number) {
  return ROUTE_X + WAVE_AMPLITUDE * Math.sin(t * Math.PI * 2 * WAVES);
}
function routeY(t: number) {
  return ROUTE_TOP + t * (ROUTE_BOTTOM - ROUTE_TOP);
}
/** The route sampled into an SVG path, in the 0..1000 viewBox. */
const SVG_PATH = (() => {
  const pts: string[] = [];
  for (let i = 0; i <= 96; i++) {
    const t = i / 96;
    pts.push(`${(routeX(t) * 1000).toFixed(1)} ${(routeY(t) * 1000).toFixed(1)}`);
  }
  return `M ${pts[0]} L ${pts.slice(1).join(" L ")}`;
})();

/** What the aircraft lands in front of: headlines AND sub-headlines. With
 *  none in range it simply flies the route, which is the fallback below. */
const HEADING_SELECTOR = "main h1, main h2, main h3";
/** How near a heading has to be, in px, before the approach begins. */
const LANDING_RANGE = 130;
/** The last slice of the route, where it settles onto the closing surface. */
const FLARE = 0.04;
/**
 * The trail is two layers, because a real contrail is not one line fading.
 * Fresh vapour is a tight bright core; as it ages it spreads, softens and
 * goes. So:
 *   CORE  -- thin and crisp, opaque at the aircraft, gone quickly behind it.
 *   SMOKE -- wide and blurred, ABSENT at the aircraft, blooming a little way
 *            back and dissolving over a long tail.
 * The smoke being absent at the nose is what sells the spread: the trail
 * looks like it widens with age rather than being drawn wide from the start.
 * Both are fractions of the rail's height.
 */
const CONTRAIL_FADE = 0.16;
const SMOKE_FADE = 0.58;

/**
 * How long the trail survives once the aircraft stops, in ms. The spatial
 * fade alone only thins the trail with DISTANCE, so parking the scroll left
 * it hanging in the air indefinitely -- smoke that never clears. This decays
 * it with time as well, so it always clears shortly after motion stops.
 */
const SMOKE_LIFETIME = 2000;
/** Only the homepage has this; elsewhere the route starts at the top. */
const RAIL_START_SELECTOR = "#how-it-works";
const START_LEAD = 0.5;

/**
 * Two orientations, as explicit basis vectors: columns are where the model's
 * local axes land in world space. Both point the nose (-Z local) DOWN the
 * rail at -Y, which is the direction of travel; what differs is the roll.
 *   PLAN -- dorsal toward the viewer, so we look down on its back.
 *   SIDE -- dorsal to one side, so we see it in profile as it settles.
 * Slerping between them reads as the aircraft banking out of a descent.
 *
 * These used to aim the nose at +X, which left the aircraft flying sideways
 * down a vertical rail. Camera space here is y-up, so travelling down the
 * page is -Y and the nose has to follow it.
 */
const BASIS_PLAN = { x: [-1, 0, 0], y: [0, 0, 1], z: [0, 1, 0] } as const;
const BASIS_SIDE = { x: [0, 0, 1], y: [1, 0, 0], z: [0, 1, 0] } as const;

/**
 * Scrolling back up reverses the direction of travel, so the aircraft turns
 * to face it: a half turn about the viewing axis, eased rather than snapped
 * so a flick of the wheel reads as the aircraft coming about. Built from an
 * axis and an angle rather than slerped toward a 180-degree quaternion,
 * because a slerp through exactly half a turn has no defined direction and
 * can pick either way round frame to frame.
 */
const FLIP_AXIS = [0, 0, 1] as const;

/**
 * The rail crosses cream sections and dark ones, so the aircraft carries two
 * liveries and swaps based on what is actually behind it. Keyed by the glb's
 * own material names: shell, panel, glass, metal, accent.
 */
type Livery = Record<string, number>;
const LIVERY_ON_LIGHT: Livery = {
  shell: 0x24211a,
  panel: 0x3a352b,
  glass: 0x14120d,
  metal: 0x6e6555,
  accent: 0xc9a227,
};
/** Contrail colour per backdrop, matching the aircraft's own two liveries. */
const TRAIL_ON_LIGHT = "#c9a227";
const TRAIL_ON_DARK = "#f3efe3";

const LIVERY_ON_DARK: Livery = {
  shell: 0xf3efe3,
  panel: 0xd8d1bd,
  glass: 0x2a2620,
  metal: 0xb9b2a0,
  accent: 0xe8b53f,
};

/** Aircraft length in px for a given rail width. */
function planeSizeFor(width: number) {
  return Math.max(26, Math.min(width * 0.82, 46));
}

function smoothstep(k: number) {
  const c = Math.min(Math.max(k, 0), 1);
  return c * c * (3 - 2 * c);
}

export function FlightRail() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const trailRef = useRef<SVGPathElement | null>(null);
  const fadeRef = useRef<SVGLinearGradientElement | null>(null);
  const smokeFadeRef = useRef<SVGLinearGradientElement | null>(null);
  const smokeRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let disposed = false;
    let teardown: (() => void) | null = null;

    async function start() {
      let THREE: typeof import("three");
      let GLTFLoader: typeof import("three/examples/jsm/loaders/GLTFLoader.js")["GLTFLoader"];
      let RoomEnvironment: typeof import("three/examples/jsm/environments/RoomEnvironment.js")["RoomEnvironment"];
      try {
        const [three, gltf, env] = await Promise.all([
          import("three"),
          import("three/examples/jsm/loaders/GLTFLoader.js"),
          import("three/examples/jsm/environments/RoomEnvironment.js"),
        ]);
        THREE = three;
        GLTFLoader = gltf.GLTFLoader;
        RoomEnvironment = env.RoomEnvironment;
      } catch {
        return; // route still draws; only the aircraft is missing
      }
      if (disposed || !rail) return;

      let width = rail.clientWidth || 1;
      let height = rail.clientHeight || 1;

      const created = (() => {
        try {
          return new THREE.WebGLRenderer({ alpha: true, antialias: true });
        } catch {
          return null;
        }
      })();
      if (!created) return;
      const renderer = created;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.className = "flight-rail-canvas";
      rail.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      // Orthographic in CSS-pixel space: left/right/top/bottom are the rail's
      // own box, so positions are written in px and never need projecting.
      // y is up here, hence `height - screenY` when placing the aircraft.
      const camera = new THREE.OrthographicCamera(0, width, height, 0, -2000, 2000);
      camera.position.set(0, 0, 600);

      const pmrem = new THREE.PMREMGenerator(renderer);
      const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = envRT.texture;
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const key = new THREE.DirectionalLight(0xffffff, 1.5);
      key.position.set(-1, 2, 3);
      scene.add(key);

      const quat = (b: { x: readonly number[]; y: readonly number[]; z: readonly number[] }) =>
        new THREE.Quaternion().setFromRotationMatrix(
          new THREE.Matrix4().makeBasis(
            new THREE.Vector3(b.x[0], b.x[1], b.x[2]),
            new THREE.Vector3(b.y[0], b.y[1], b.y[2]),
            new THREE.Vector3(b.z[0], b.z[1], b.z[2]),
          ),
        );
      const qPlan = quat(BASIS_PLAN);
      const qSide = quat(BASIS_SIDE);
      const flipAxis = new THREE.Vector3(FLIP_AXIS[0], FLIP_AXIS[1], FLIP_AXIS[2]);
      const flipQuat = new THREE.Quaternion();

      const plane = new THREE.Group(); // position only
      const inner = new THREE.Group(); // orientation only
      plane.add(inner);
      scene.add(plane);

      const gltf = await new GLTFLoader().loadAsync("/assets/models/airliner.glb").catch(() => null);
      if (disposed) return;

      const paintable: import("three").MeshStandardMaterial[] = [];
      let longest = 1;

      if (gltf) {
        const model = gltf.scene;
        // Box3 respects the node transforms; the raw accessor bounds do not.
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        const centre = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(centre);
        longest = Math.max(size.x, size.y, size.z) || 1;
        model.position.sub(centre); // pivot at its own centre, so it rolls in place
        model.traverse((child) => {
          const mesh = child as import("three").Mesh;
          if (!mesh.isMesh) return;
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (const m of mats) {
            const std = m as import("three").MeshStandardMaterial;
            if (std && std.name in LIVERY_ON_LIGHT) paintable.push(std);
          }
        });
        inner.add(model);
      }

      inner.scale.setScalar(planeSizeFor(width) / longest);

      let liveryDark: boolean | null = null;
      function applyLivery(dark: boolean) {
        if (dark === liveryDark) return;
        liveryDark = dark;
        const livery = dark ? LIVERY_ON_DARK : LIVERY_ON_LIGHT;
        for (const m of paintable) m.color.setHex(livery[m.name]);
        // The contrail follows the same rule. A real one is white, which
        // would be invisible on this site's cream sections -- so it is warm
        // gold over light ground and near-white over dark, which is also
        // what an actual vapour trail looks like against a dark sky.
        // Written straight onto the one element, never a :root property.
        const trail = trailRef.current;
        if (trail) trail.style.stroke = dark ? TRAIL_ON_DARK : TRAIL_ON_LIGHT;
        const smoke = smokeRef.current;
        if (smoke) smoke.style.stroke = dark ? TRAIL_ON_DARK : TRAIL_ON_LIGHT;
      }
      applyLivery(false);

      /** What is behind the aircraft right now -- light section or dark one. */
      function sampleBackdrop(screenY: number) {
        // The rail is pointer-events:none, so elementsFromPoint returns what
        // is genuinely underneath rather than the canvas itself.
        const els = document.elementsFromPoint(routeX(0) * width, screenY);
        for (const el of els) {
          if (el === rail || rail!.contains(el)) continue;

          // Sections marked dark win outright. Their darkness comes from
          // video and background-images, which backgroundColor cannot see:
          // over the cinematic footer every element in the chain reports a
          // transparent background, so the colour walk below fell all the way
          // through to <body> (white) and painted a dark aircraft onto dark
          // footage. Tagging the container is the only reading that is
          // actually true rather than inferred.
          if (el.closest("[data-rail-dark]")) return true;

          const bg = getComputedStyle(el).backgroundColor;
          const m = /rgba?\(([^)]+)\)/.exec(bg);
          if (!m) continue;
          const [r, g, b, a = 1] = m[1].split(",").map((v) => parseFloat(v));
          if (a < 0.4) continue; // see-through: keep looking further back
          return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;
        }
        return false;
      }

      let headingYs: number[] = [];
      let headings: HTMLElement[] = [];
      function collectHeadings() {
        headings = Array.from(document.querySelectorAll<HTMLElement>(HEADING_SELECTOR));
      }
      function measureHeadings() {
        const out: number[] = [];
        for (const el of headings) {
          const r = el.getBoundingClientRect();
          if (r.bottom < -200 || r.top > window.innerHeight + 200) continue;
          out.push(r.top + r.height / 2);
        }
        headingYs = out;
      }

      let planeY = routeY(0) * height;
      /** When the aircraft last actually moved, for the time decay above. */
      let lastMoveAt = 0;
      let trailAlpha = 0;
      let levelEased = 0;
      let progress = 0;
      /** 0 = nose down the page, 1 = nose back up it. */
      let flipTarget = 0;
      let flipEased = 0;

      function place(t: number) {
        const rx = routeX(t) * width;
        const onRoute = routeY(t) * height;

        // Nearest heading to where the route would otherwise put us.
        let bestY: number | null = null;
        let bestD = Infinity;
        for (const y of headingYs) {
          const d = Math.abs(y - onRoute);
          if (d < bestD) {
            bestD = d;
            bestY = y;
          }
        }

        let level = 0;
        let targetY = onRoute;
        if (bestY !== null && bestD < LANDING_RANGE) {
          // Closer to the heading means more committed to the approach: the
          // aircraft is pulled onto it AND rolls level by the same amount, so
          // the two read as one manoeuvre instead of two.
          level = smoothstep(1 - bestD / LANDING_RANGE);
          targetY = onRoute + (bestY - onRoute) * level;
        }
        // The final slice of the route settles onto the closing surface.
        const arriving = t > 1 - FLARE ? (t - (1 - FLARE)) / FLARE : 0;
        if (arriving > 0) level = Math.max(level, smoothstep(arriving));

        targetY = Math.min(Math.max(targetY, ROUTE_TOP * height), ROUTE_BOTTOM * height);
        const before = planeY;
        planeY += (targetY - planeY) * 0.12;
        // Any real movement re-charges the trail; otherwise it decays.
        const now = performance.now();
        if (Math.abs(planeY - before) > 0.25) lastMoveAt = now;
        trailAlpha = Math.max(0, 1 - (now - lastMoveAt) / SMOKE_LIFETIME);
        levelEased += (level - levelEased) * 0.12;

        flipEased += (flipTarget - flipEased) * 0.12;

        plane.position.set(rx, height - planeY, 0);
        inner.quaternion.copy(qPlan).slerp(qSide, levelEased);
        // Applied in world space, after the roll, so the half turn happens
        // about the viewer's axis rather than the aircraft's own.
        inner.quaternion.premultiply(flipQuat.setFromAxisAngle(flipAxis, flipEased * Math.PI));
        applyLivery(sampleBackdrop(planeY));

        // The trail is drawn from where the AIRCRAFT actually is, not from raw
        // scroll progress. Those differ whenever it is easing onto a heading,
        // and using progress drew line the aircraft had not reached yet.
        const flown = Math.min(
          Math.max((planeY / height - ROUTE_TOP) / (ROUTE_BOTTOM - ROUTE_TOP), 0),
          1,
        );
        const off = ((1 - flown) * 1000).toFixed(1);
        const alpha = trailAlpha.toFixed(3);
        const trail = trailRef.current;
        if (trail) {
          trail.style.strokeDashoffset = off;
          trail.style.opacity = alpha;
        }
        const smoke = smokeRef.current;
        if (smoke) {
          smoke.style.strokeDashoffset = off;
          smoke.style.opacity = alpha;
        }

        // Dissolve: a gradient in viewBox units, opaque at the aircraft and
        // clear CONTRAIL_FADE above it. spreadMethod pad means everything
        // further back stays fully transparent and everything below stays
        // opaque, so only this moving band has to be updated per frame.
        const head = (planeY / height) * 1000;
        const fade = fadeRef.current;
        if (fade) {
          fade.setAttribute("y1", (head - CONTRAIL_FADE * 1000).toFixed(1));
          fade.setAttribute("y2", head.toFixed(1));
        }
        const smokeFade = smokeFadeRef.current;
        if (smokeFade) {
          smokeFade.setAttribute("y1", (head - SMOKE_FADE * 1000).toFixed(1));
          smokeFade.setAttribute("y2", head.toFixed(1));
        }
      }

      let raf = 0;
      let lastY = -1;
      let lastLevel = -1;
      let lastFlip = -1;
      function frame() {
        raf = 0;
        place(progress);
        // Keep running while either easing is still in flight, so the
        // approach finishes even after the scroll has stopped.
        const settling =
          Math.abs(planeY - lastY) > 0.05 ||
          Math.abs(levelEased - lastLevel) > 0.001 ||
          Math.abs(flipEased - lastFlip) > 0.001 ||
          trailAlpha > 0; // keep running until the smoke has actually gone
        lastY = planeY;
        lastLevel = levelEased;
        lastFlip = flipEased;
        renderer.render(scene, camera);
        if (settling) raf = requestAnimationFrame(frame);
      }
      function kick() {
        if (!raf) raf = requestAnimationFrame(frame);
      }

      let anchorScroll = 0;
      function measureAnchor() {
        const el = document.querySelector(RAIL_START_SELECTOR);
        if (!el) {
          anchorScroll = 0;
          return;
        }
        const r = el.getBoundingClientRect();
        anchorScroll = Math.max(0, r.top + window.scrollY - window.innerHeight * START_LEAD);
      }

      let shown: boolean | null = null;
      function setShown(v: boolean) {
        if (v === shown) return;
        shown = v;
        rail!.style.opacity = v ? "1" : "0";
      }

      function onScroll() {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const span = Math.max(1, max - anchorScroll);
        const next = Math.min(Math.max((window.scrollY - anchorScroll) / span, 0), 1);
        // Threshold ignores sub-pixel jitter, which would otherwise have the
        // aircraft turning back and forth while the page is nearly still.
        const delta = next - progress;
        if (Math.abs(delta) > 0.0004) flipTarget = delta < 0 ? 1 : 0;
        progress = next;
        setShown(window.scrollY >= anchorScroll - window.innerHeight * 0.15);
        measureAnchor();
        measureHeadings();
        kick();
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const ro = new ResizeObserver(() => {
        width = rail!.clientWidth || 1;
        height = rail!.clientHeight || 1;
        renderer.setSize(width, height, false);
        camera.right = width;
        camera.top = height;
        camera.updateProjectionMatrix();
        inner.scale.setScalar(planeSizeFor(width) / longest);
        collectHeadings();
        measureAnchor();
        measureHeadings();
        kick();
      });
      ro.observe(rail);

      collectHeadings();
      measureAnchor();
      measureHeadings();
      onScroll();
      if (!reduceMotion) window.addEventListener("scroll", onScroll, { passive: true });
      place(reduceMotion ? 0.5 : progress);
      renderer.render(scene, camera);

      teardown = () => {
        ro.disconnect();
        window.removeEventListener("scroll", onScroll);
        if (raf) cancelAnimationFrame(raf);
        envRT.dispose();
        pmrem.dispose();
        scene.traverse((o) => {
          const mesh = o as import("three").Mesh;
          if (!mesh.isMesh) return;
          mesh.geometry?.dispose();
          const m = mesh.material;
          if (Array.isArray(m)) m.forEach((x) => x.dispose());
          else m?.dispose();
        });
        renderer.dispose();
        renderer.domElement.remove();
      };

      if (disposed) teardown();
    }

    void start();
    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  // The route's ends sit on the centre line, so the touchdown strips are
  // centred on the rail.
  const x = routeX(0) * 1000;
  const y0 = routeY(0) * 1000;
  const y1 = routeY(1) * 1000;

  return (
    <div ref={railRef} className="flight-rail" aria-hidden="true">
      <svg className="flight-rail-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <defs>
          {/* The dissolve. userSpaceOnUse so the stops are viewBox
              coordinates the component can move directly, and the whole band
              slides with the aircraft each frame. */}
          <linearGradient
            ref={fadeRef}
            id="flight-rail-fade"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2="1000"
          >
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" stopOpacity="1" />
          </linearGradient>
          {/* Masking rather than fading the stroke's own colour, so the
              livery swap stays free to recolour it for dark sections. */}
          <mask id="flight-rail-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
            <rect x="0" y="0" width="1000" height="1000" fill="url(#flight-rail-fade)" />
          </mask>

          {/* The smoke's own ramp. Three stops rather than two: nothing at
              the aircraft (offset 1), thickest a little way back, gone at the
              tail (offset 0). That bell is what makes the trail read as
              spreading with age instead of being drawn wide. */}
          <linearGradient
            ref={smokeFadeRef}
            id="flight-rail-smoke-fade"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2="1000"
          >
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.45" stopColor="#fff" stopOpacity="0.62" />
            <stop offset="0.82" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="flight-rail-smoke-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
            <rect x="0" y="0" width="1000" height="1000" fill="url(#flight-rail-smoke-fade)" />
          </mask>
        </defs>
        {/* The two surfaces the aircraft touches down on, at the extremes of
            the page rather than of any one section. */}
        <line
          className="flight-rail-surface"
          x1={x - 300}
          x2={x + 300}
          y1={y0 + 26}
          y2={y0 + 26}
          vectorEffect="non-scaling-stroke"
        />
        <line
          className="flight-rail-surface"
          x1={x - 300}
          x2={x + 300}
          y1={y1 + 26}
          y2={y1 + 26}
          vectorEffect="non-scaling-stroke"
        />
        {/* Only the flown portion. The dashed "route ahead" this replaces
            contradicted the idea: a contrail is made by the aircraft, so
            nothing exists in front of it. */}
        {/* Smoke first, so the crisp core sits on top of it. */}
        <path
          ref={smokeRef}
          className="flight-rail-smoke"
          d={SVG_PATH}
          pathLength={1000}
          vectorEffect="non-scaling-stroke"
          mask="url(#flight-rail-smoke-mask)"
        />
        <path
          ref={trailRef}
          className="flight-rail-trail"
          d={SVG_PATH}
          pathLength={1000}
          vectorEffect="non-scaling-stroke"
          mask="url(#flight-rail-mask)"
        />
      </svg>
    </div>
  );
}
