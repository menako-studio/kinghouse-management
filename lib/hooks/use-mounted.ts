import { useEffect, useState } from "react"

/**
 * Returns `true` once the component has mounted on the client.
 *
 * Used to guard client-only rendering (e.g. `createPortal`, dates, clipboard,
 * random values) against SSR hydration mismatches. The single mount-flag
 * transition is intentional, so the `set-state-in-effect` rule is disabled
 * here — in one place — rather than at every call site.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-time mount flag
    setMounted(true)
  }, [])
  return mounted
}
