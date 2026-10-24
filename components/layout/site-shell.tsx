"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FloatingWhatsApp } from "@/components/ui/floating-whatsapp"
import { LeadSourceCapture } from "@/components/funnel/lead-source-capture"

interface SiteShellProps {
  children: React.ReactNode
}

/**
 * SiteShell conditionally renders public Header, Footer, and Floating WhatsApp.
 * Administrative portal routes (/dashboard/*) and security routes (/login)
 * are rendered cleanly without public navigation elements.
 */
export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname()
  
  const isDashboardOrAuth = 
    pathname.startsWith("/dashboard") || 
    pathname === "/login"

  if (isDashboardOrAuth) {
    return <>{children}</>
  }

  // `contents` keeps the layout box-free while the class scopes the larger
  // public-site type scale (see .site-public in globals.css).
  return (
    <div className="site-public contents">
      <LeadSourceCapture />
      <Header />
      {children}
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
