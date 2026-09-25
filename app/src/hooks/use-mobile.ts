import * as React from "react"

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

/**
 * Subscribes React directly to the media query rather than mirroring it into
 * state.
 *
 * The generated version held a useState and wrote to it from inside an effect
 * -- once on mount to seed it, then again on every change. That is a render,
 * an effect, and a second render before the first correct value is on screen,
 * which is what `setState synchronously within an effect` is warning about.
 * useSyncExternalStore reads the query during render instead, so the value is
 * right on the first paint after hydration.
 *
 * The server snapshot is `false` -- there is no viewport to measure during
 * prerender, and desktop is the safer assumption for a layout that only
 * collapses below 768px.
 */
function subscribe(onChange: () => void) {
  const mql = window.matchMedia(MOBILE_QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  )
}
