import * as React from "react"

const MOBILE_BREAKPOINT = 768

const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

/**
 * Reads the viewport width from a media query rather than window.innerWidth.
 *
 * Two problems with the previous version:
 *  - it called setState synchronously in the effect body, which
 *    react-hooks/set-state-in-effect rejects: an extra render pass on mount;
 *  - it left the value `undefined` until an effect ran, and setState in the
 *    effect also set it, so the first client render disagreed with the server
 *    render and could flash the wrong layout.
 *
 * useSyncExternalStore is the React-sanctioned way to read an external mutable
 * source: it returns the current value during render (no cascade), and
 * subscribes for updates. getServerSnapshot returns false so SSR and the first
 * client render agree.
 */
function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

function getServerSnapshot() {
  return false
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
