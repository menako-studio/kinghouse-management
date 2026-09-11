"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ShieldCheck,
  User,
  LogOut,
  Settings,
  Bell,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Key,
  Clock,
  CheckCircle2,
  X,
  Lock,
  ChevronRight,
  Activity,
} from "lucide-react"
import { AdminUser } from "@/lib/auth"
import { useNotifications, AlertCategory } from "@/components/dashboard/notification-context"

interface DashboardHeaderProps {
  adminUser: AdminUser
}

export function DashboardHeader({ adminUser }: DashboardHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const { alerts, unreadCount, markAsRead, markAllAsRead, clearAlert, clearAllAlerts } = useNotifications()

  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Derive route breadcrumbs
  const getBreadcrumb = () => {
    if (pathname === "/dashboard") return "Overview"
    if (pathname.startsWith("/dashboard/properties")) return "Property Portfolio"
    if (pathname.startsWith("/dashboard/seo")) return "SEO Manager"
    if (pathname.startsWith("/dashboard/blog")) return "Blog Posts"
    if (pathname.startsWith("/dashboard/bookings")) return "Calendar & Bookings"
    if (pathname.startsWith("/dashboard/analytics")) return "Revenue Analytics"
    if (pathname.startsWith("/dashboard/settings")) return "Settings & Profile"
    return "Dashboard"
  }

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)

    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch {
      router.push("/login")
    }
  }

  const getCategoryBadge = (cat: AlertCategory) => {
    switch (cat) {
      case "blog":
        return <span className="text-[9px] font-bold uppercase bg-[#FAF6EE] text-[#8C7F5F] px-1.5 py-0.5 rounded-md border border-[#E8DFC8]">Blog</span>
      case "booking":
        return <span className="text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-md border border-emerald-200">Booking</span>
      case "expense":
        return <span className="text-[9px] font-bold uppercase bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded-md border border-rose-200">POS</span>
      case "seo":
        return <span className="text-[9px] font-bold uppercase bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-md border border-blue-200">SEO</span>
      case "sync":
        return <span className="text-[9px] font-bold uppercase bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded-md border border-amber-200">iCal</span>
      default:
        return <span className="text-[9px] font-bold uppercase bg-[#FAF8F5] text-[#6B6862] px-1.5 py-0.5 rounded-md border border-[#E8E4DC]">System</span>
    }
  }

  return (
    <>
      <header className="h-16 border-b border-[#E8E4DC] bg-white/90 backdrop-blur-xl px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Left: Breadcrumbs & Suite Context */}
        <div className="flex items-center space-x-2.5 text-xs">
          <Link
            href="/dashboard"
            className="font-medium text-[#6B6862] hover:text-[#222225] transition-colors"
          >
            Kinghouse CMS
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[#B8934C]" />
          <span className="font-semibold text-[#222225] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#E8E4DC] text-[11px] tracking-wide">
            {getBreadcrumb()}
          </span>
        </div>

        {/* Right: Live Sync Badge, Notifications, & Profile Menu */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Environment & Live Sync Status */}
          <div className="hidden lg:flex items-center space-x-2 text-[11px] text-[#6B6862] bg-[#FAF8F5] px-3.5 py-1.5 rounded-full border border-[#E8E4DC]">
            {process.env.NEXT_PUBLIC_ENVIRONMENT === "staging" ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[9px] uppercase tracking-wider">
                🧪 Staging DB
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[9px] uppercase tracking-wider">
                🛡️ Production DB
              </span>
            )}
            <span className="text-[#D5CFC3]">&bull;</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">4 Units Synced</span>
            <span className="text-[#D5CFC3]">&bull;</span>
            <span className="text-emerald-700 font-semibold flex items-center space-x-1">
              <span>Airbnb iCal Live</span>
            </span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen)
                setIsProfileOpen(false)
              }}
              className="relative p-2 rounded-xl text-[#6B6862] hover:text-[#222225] hover:bg-[#FAF8F5] transition-colors focus:outline-none cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#B8934C] animate-pulse" />
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white border border-[#E8E4DC] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-4 z-50 animate-sana-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-[#FAF8F5]">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-[#222225]">
                      System Alerts
                    </span>
                    {unreadCount > 0 ? (
                      <span className="text-[10px] bg-[#B8934C]/15 text-[#B8934C] px-2 py-0.5 rounded-full font-bold">
                        {unreadCount} New
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                        All Read
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="text-[11px] font-semibold text-[#8C7F5F] hover:text-[#222225] cursor-pointer"
                      >
                        Read All
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-xs text-[#6B6862] hover:text-[#222225] cursor-pointer p-1"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-[#FAF8F5] text-xs max-h-72 overflow-y-auto">
                  {alerts.length > 0 ? (
                    alerts.map((alert) => (
                      <div
                        key={alert.id}
                        onClick={() => {
                          markAsRead(alert.id)
                          if (alert.actionUrl) {
                            setIsNotificationsOpen(false)
                            router.push(alert.actionUrl)
                          }
                        }}
                        className={`py-3 rounded-2xl px-2.5 transition-colors cursor-pointer group relative ${
                          alert.isRead ? "hover:bg-[#FAF8F5] opacity-75" : "bg-[#FAF8F5]/80 hover:bg-[#F3EFE6]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center space-x-1.5">
                            {!alert.isRead && (
                              <span className="h-1.5 w-1.5 rounded-full bg-[#B8934C] flex-shrink-0" />
                            )}
                            <span className="font-semibold text-[#222225] line-clamp-1">
                              {alert.title}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1.5 flex-shrink-0">
                            {getCategoryBadge(alert.category)}
                            <span className="text-[10px] text-[#8C7F5F] font-mono">{alert.timeAgo}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                clearAlert(alert.id)
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-[#6B6862] hover:text-rose-600 rounded transition-opacity cursor-pointer"
                              title="Hapus Notifikasi"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] text-[#6B6862] mt-1 leading-relaxed">
                          {alert.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center space-y-1">
                      <p className="text-xs font-semibold text-[#222225]">Tidak Ada Notifikasi</p>
                      <p className="text-[11px] text-[#6B6862]">Semua sistem beroperasi normal tanpa kendala.</p>
                    </div>
                  )}
                </div>

                {alerts.length > 0 && (
                  <div className="pt-2 border-t border-[#FAF8F5] flex items-center justify-between text-[11px]">
                    <span className="text-[#6B6862] font-mono">{alerts.length} Total Alerts</span>
                    <button
                      type="button"
                      onClick={clearAllAlerts}
                      className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                    >
                      Hapus Semua
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Account Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen(!isProfileOpen)
                setIsNotificationsOpen(false)
              }}
              className="flex items-center space-x-2.5 p-1.5 rounded-2xl hover:bg-[#FAF8F5] transition-colors border border-transparent hover:border-[#E8E4DC] focus:outline-none cursor-pointer"
            >
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#19191B] to-[#28282B] text-[#DFC58E] flex items-center justify-center text-xs font-bold ring-2 ring-[#B8934C]/30 shadow-xs">
                KH
              </div>
              <div className="hidden md:flex flex-col text-left">
                <div className="text-xs font-semibold text-[#222225] flex items-center space-x-1">
                  <span>{adminUser.name}</span>
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <span className="text-[10px] text-[#6B6862] font-mono leading-none">
                  Super Admin
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[#6B6862]" />
            </button>

            {/* Profile Dropdown Drawer */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-3xl bg-white border border-[#E8E4DC] shadow-[0_25px_60px_rgba(0,0,0,0.12)] p-2.5 z-50 animate-sana-fade-in">
                {/* Header Card */}
                <div className="p-3.5 bg-[#19191B] text-white rounded-2xl mb-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#B8934C]/15 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center space-x-2.5 relative z-10">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#B8934C] to-[#8C7F5F] text-[#19191B] flex items-center justify-center text-xs font-bold">
                      KH
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate flex items-center space-x-1">
                        <span>{adminUser.name}</span>
                      </p>
                      <p className="text-[10px] text-white/60 font-mono truncate">
                        {adminUser.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                    <span className="text-emerald-400 font-medium flex items-center space-x-1">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Verified Super Admin</span>
                    </span>
                    <span className="text-white/40 font-mono">256-Bit SSL</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-1 text-xs text-[#222225]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false)
                      setIsProfileModalOpen(true)
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-[#FAF8F5] transition-colors text-left cursor-pointer"
                  >
                    <User className="h-4 w-4 text-[#6B6862]" />
                    <span>Account Profile & Security</span>
                  </button>

                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-[#FAF8F5] transition-colors text-left"
                  >
                    <Settings className="h-4 w-4 text-[#6B6862]" />
                    <span>CMS & API Settings</span>
                  </Link>

                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#FAF8F5] transition-colors text-left text-[#6B6862] hover:text-[#222225]"
                  >
                    <span className="flex items-center space-x-2.5">
                      <ExternalLink className="h-4 w-4" />
                      <span>View Public Website</span>
                    </span>
                    <span className="text-[10px] uppercase font-mono text-[#8C7F5F]">Tab</span>
                  </a>
                </div>

                <div className="pt-2 mt-1 border-t border-[#E8E4DC]">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-xs font-semibold disabled:opacity-50 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 flex-shrink-0" />
                    <span>{isLoggingOut ? "Signing Out..." : "Sign Out of CMS"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Account Profile & Security Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#E8E4DC] shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-[#19191B] text-white flex items-center justify-between relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#B8934C]/15 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center space-x-3 relative z-10">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#B8934C] to-[#8C7F5F] text-[#19191B] flex items-center justify-center font-bold text-sm">
                  KH
                </div>
                <div>
                  <h3 className="text-lg text-white font-semibold">
                    Admin Profile & Credentials
                  </h3>
                  <p className="text-xs text-[#DFC58E]">
                    Kinghouse Hospitality Asset Management Suite
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer relative z-10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Identity Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC]">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-[#6B6862] block mb-1">
                      Account Name
                    </span>
                    <span className="font-semibold text-[#222225] text-sm">
                      {adminUser.name}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC]">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-[#6B6862] block mb-1">
                      Role & Permissions
                    </span>
                    <span className="inline-flex items-center space-x-1 font-semibold text-emerald-700 text-sm">
                      <span>Super Admin</span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-[#6B6862] block mb-1">
                    Administrative Email
                  </span>
                  <span className="font-mono text-[#222225] font-semibold text-sm">
                    {adminUser.email}
                  </span>
                </div>
              </div>

              {/* Security Status Box */}
              <div className="p-4 rounded-2xl bg-[#F3EFE6] border border-[#E8E4DC] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-[#8C7F5F]" />
                    <span className="font-semibold text-[#222225]">Session Security</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Active &bull; HMAC-SHA256
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#6B6862]">
                  <div className="flex justify-between">
                    <span>Session Expiry:</span>
                    <span className="font-medium text-[#222225]">7 Days Rolling</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cookie Policy:</span>
                    <span className="font-mono text-[11px] text-[#222225]">HttpOnly, SameSite=Lax</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Multi-Factor Authorization:</span>
                    <span className="font-medium text-emerald-700">Enforced by Token</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-[#222225] text-white text-xs font-semibold hover:bg-[#19191B] transition-colors text-center shadow-xs"
                >
                  Manage Security & API Keys
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="py-3 px-5 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
