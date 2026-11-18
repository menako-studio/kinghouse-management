"use client"

import { useEffect, useRef, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { isCmsPath, trackPageView } from "@/lib/analytics"

function PageViewTrackerInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastSent = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname || isCmsPath(pathname)) return
    const queryString = searchParams?.toString()
    const fullUrl = queryString ? `${pathname}?${queryString}` : pathname

    // One page_view per URL. React strict mode and re-renders must not double-send.
    if (lastSent.current === fullUrl) return

    // Next.js updates document.title after the route commits. Wait two frames so
    // the page_view carries the NEW page's title, not the previous page's.
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        lastSent.current = fullUrl
        trackPageView(fullUrl, document.title)
      })
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [pathname, searchParams])

  return null
}

/**
 * Sends one GA4 page_view per route change (the initial gtag config has
 * send_page_view disabled, so this component is the only source).
 * Wrapped in Suspense to satisfy Next.js useSearchParams requirements.
 */
export function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <PageViewTrackerInner />
    </Suspense>
  )
}
