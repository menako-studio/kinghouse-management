"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FloatingWhatsApp } from "@/components/ui/floating-whatsapp"

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

  return (
    <>
      <Header />
      {children}
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
