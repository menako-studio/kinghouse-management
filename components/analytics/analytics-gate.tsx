"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { GA_MEASUREMENT_ID, isCmsPath } from "@/lib/analytics"

/**
 * Keeps the admin area (CMS dashboard + login) out of GA4 and GTM.
 *
 * - On a direct visit to a CMS route the GA/GTM scripts are never rendered.
 * - When an already-loaded tab navigates into the CMS client-side, the scripts
 *   exist, so GA's documented opt-out flag `window['ga-disable-<ID>']` is set,
 *   and `cms_route: true` is pushed to the dataLayer so GTM can also block
 *   its tags with an exception trigger (see ANALYTICS_SETUP.md).
 */
export function AnalyticsGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const cms = isCmsPath(pathname)

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return
    const flag = `ga-disable-${GA_MEASUREMENT_ID}` as const
    ;(window as unknown as Record<string, unknown>)[flag] = cms
    if (cms) {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ cms_route: true })
    }
  }, [cms])

  if (cms) return null
  return <>{children}</>
}
