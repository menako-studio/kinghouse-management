"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { captureLeadSource } from "@/lib/funnel/lead-source"

/**
 * Records the UTM source / referrer of the visit so every lead submitted later
 * in the session is tagged with where it came from.
 */
export function LeadSourceCapture() {
  const pathname = usePathname()

  useEffect(() => {
    captureLeadSource()
  }, [pathname])

  return null
}
