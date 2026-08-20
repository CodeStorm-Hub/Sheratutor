import * as React from "react"

const MOBILE_BREAKPOINT = 768

// useSyncExternalStore instead of a useState+useEffect pair — matchMedia is
// exactly the "external store" this hook is for, and subscribing this way
// avoids both a setState-in-effect lint violation and an SSR/hydration
// mismatch (getServerSnapshot renders `false` on the server; the client
// snapshot then takes over on mount without a synchronous corrective render).
function subscribe(callback: () => void) {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

function getSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT
}

function getServerSnapshot() {
  return false
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
