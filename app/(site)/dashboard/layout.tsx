import { Metadata } from "next"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { getAdminSession } from "@/lib/auth-server"

export const metadata: Metadata = {
  title: "CMS Dashboard — Kinghouse Property Management",
  description: "Enterprise multi-channel CMS dashboard & SEO management platform for Kinghouse properties.",
  robots: {
    index: false,
    follow: false,
  },
}

import { NotificationProvider } from "@/components/dashboard/notification-context"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const adminUser = await getAdminSession()

  // Defense-in-depth server-side check
  if (!adminUser) {
    redirect("/login?callbackUrl=/dashboard")
  }

  return (
    <NotificationProvider>
      <div className="cms-dashboard-root font-sans flex min-h-screen bg-[#FAF8F5] text-[#222225] relative selection:bg-[#B8934C] selection:text-[#19191B]">
        {/* Subtle Ambient Lighting Accents */}
        <div className="fixed top-0 left-64 right-0 h-96 bg-gradient-to-b from-[#B8934C]/[0.03] to-transparent pointer-events-none z-0" />

        {/* Collapsible Sidebar */}
        <DashboardSidebar adminUser={adminUser} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
          {/* Top Header with Breadcrumb, Notifications & Admin Profile */}
          <DashboardHeader adminUser={adminUser} />

          {/* Scrollable Page Body */}
          <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </NotificationProvider>
  )
}
