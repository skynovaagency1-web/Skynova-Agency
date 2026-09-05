/**
 * One lazy loader for GSAP, shared by everything that needs it.
 *
 * `ssr.noExternal: true` means the SSR pass bundles it regardless of the
 * dynamic import, so this costs ~72KB gzip in the Worker (1.03MB against a
 * 10MB limit). Adding "gsap" to `ssr.external` would leave an unresolvable
 * bare specifier in a workerd bundle, which is a worse trade than the bytes.
 * It is dead weight there, never executed -- GSAP guards its own module body
 * with a window check, and the guard below makes that explicit.
 *
 * Dynamic, and deliberately so: `vite.config.ts` sets `ssr.noExternal`, so a
 * static import would pull ~117KB of GSAP into the Worker bundle (already
 * 4.6MB) whether or not a page uses it. Loaded this way it lands in its own
 * client chunk and only on routes that actually animate.
 *
 * Single promise, so `registerPlugin` runs exactly once no matter how many
 * components ask. Registering ScrollTrigger repeatedly is harmless but the
 * shared promise also means one network fetch and one parse.
 */

type Gsap = typeof import("gsap")["gsap"];
type ScrollTriggerType = typeof import("gsap/ScrollTrigger")["ScrollTrigger"];

let pending: Promise<{ gsap: Gsap; ScrollTrigger: ScrollTriggerType } | null> | null = null;

export function loadGsap() {
  // Belt and braces. Every caller is inside a useEffect already, so this
  // cannot run on the server -- but stating it here means the guarantee lives
  // with the import rather than with each caller's discipline.
  if (typeof window === "undefined") return Promise.resolve(null);
  if (!pending) {
    pending = (async () => {
      try {
        const [core, st] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        core.gsap.registerPlugin(st.ScrollTrigger);
        return { gsap: core.gsap, ScrollTrigger: st.ScrollTrigger };
      } catch {
        // The page must still work without it -- every caller treats null as
        // "no animation", never as an error.
        return null;
      }
    })();
  }
  return pending;
}
