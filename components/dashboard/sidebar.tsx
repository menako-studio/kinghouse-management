"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Home,
  Search,
  BookOpen,
  CalendarDays,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Globe,
  Sparkles,
  Coins,
} from "lucide-react"
import { AdminUser } from "@/lib/auth"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/properties", label: "Properties", icon: Home },
  { href: "/dashboard/pricing", label: "Dynamic Pricing", icon: Coins, badge: "Smart" },
  { href: "/dashboard/seo", label: "SEO Manager", icon: Search, badge: "Rank" },
  { href: "/dashboard/blog", label: "Blog Posts", icon: BookOpen },
  { href: "/dashboard/bookings", label: "Calendar", icon: CalendarDays },
  { href: "/dashboard/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function DashboardSidebar({ adminUser }: { adminUser?: AdminUser | null }) {
  const [collapsed, setCollapsed] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      router.push("/login")
      router.refresh()
    } catch {
      router.push("/login")
    }
  }

  return (
    <aside
      className={`flex flex-col h-screen sticky top-0 bg-[#19191B] border-r border-white/[0.08] transition-all duration-300 z-40 select-none ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand Monogram & Portal Identifier */}
      <div className="flex items-center justify-between p-4 border-b border-white/[0.08] h-16 relative">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="h-9 w-9 rounded-xl bg-[#231F1A] border border-[#CBBEA0]/30 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(203,190,160,0.15)] transition-transform group-hover:scale-105">
              <Image
                src="/brand/icon-bone.svg"
                alt="Kinghouse Icon"
                width={28}
                height={28}
                className="h-6 w-auto object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white tracking-tight leading-tight group-hover:text-[#CBBEA0] transition-colors">
                Kinghouse
              </span>
              <span className="text-[8px] uppercase tracking-[0.25em] text-[#CBBEA0] font-medium leading-none mt-0.5">
                Hospitality CMS
              </span>
            </div>
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="h-9 w-9 rounded-xl bg-[#231F1A] border border-[#CBBEA0]/30 flex items-center justify-center p-1.5 mx-auto hover:scale-105 transition-transform shadow-[0_0_15px_rgba(203,190,160,0.15)]"
            title="Kinghouse CMS"
          >
            <Image
              src="/brand/icon-bone.svg"
              alt="Kinghouse Icon"
              width={28}
              height={28}
              className="h-6 w-auto object-contain"
            />
          </Link>
        )}
      </div>

      {/* Primary CMS Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] uppercase font-mono tracking-widest text-white/40 px-3 py-1 mb-1 flex items-center justify-between">
          <span>{!collapsed ? "Management Suite" : "•"}</span>
          {!collapsed && (
            <span className="text-[9px] text-[#DFC58E]/90 font-sans tracking-normal font-semibold">2026</span>
          )}
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all group relative overflow-hidden ${
                isActive
                  ? "bg-white/[0.1] text-white font-semibold shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-white/[0.1]"
                  : "text-white/70 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <Icon
                className={`h-4 w-4 flex-shrink-0 transition-colors ${
                  isActive ? "text-[#DFC58E]" : "text-white/50 group-hover:text-white"
                }`}
              />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold bg-[#B8934C] text-[#19191B] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-[#B8934C] to-[#8C7F5F] rounded-r-full" />
              )}
            </Link>
          )
        })}

        {/* Public Website Preview Link */}
        <div className="pt-4 mt-4 border-t border-white/[0.08]">
          <div className="text-[10px] uppercase font-mono tracking-widest text-white/40 px-3 py-1 mb-1">
            {!collapsed ? "Public View" : "•"}
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title={collapsed ? "Public Website" : undefined}
            className="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.05] transition-all group"
          >
            <Globe className="h-4 w-4 flex-shrink-0 group-hover:text-[#DFC58E] transition-colors" />
            {!collapsed && <span className="flex-1">Live Public Site ↗</span>}
          </a>
        </div>
      </nav>

      {/* Account Profile Details & Logout Section */}
      <div className="p-3 border-t border-white/[0.08] space-y-2 bg-[#141416] backdrop-blur-md">
        {adminUser && !collapsed && (
          <Link
            href="/dashboard/settings"
            className="block p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[#B8934C]/40 hover:bg-white/[0.07] transition-all group cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-[#B8934C] to-[#8C7F5F] text-[#19191B] flex items-center justify-center text-xs font-bold flex-shrink-0">
                KH
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate flex items-center space-x-1">
                  <span>{adminUser.name}</span>
                  <ShieldCheck className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                </div>
                <div className="text-[10px] text-white/50 font-mono truncate">
                  {adminUser.email}
                </div>
              </div>
            </div>
          </Link>
        )}

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          title={collapsed ? "Sign Out" : undefined}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-2xl text-xs font-semibold text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10 transition-all group cursor-pointer disabled:opacity-50 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>}
        </button>
      </div>

      {/* Collapse/Expand Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-20 h-7 w-7 rounded-full bg-[#28282B] border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-[#B8934C] hover:scale-105 transition-all shadow-lg z-50 cursor-pointer"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>
    </aside>
  )
}
