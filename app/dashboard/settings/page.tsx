"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Settings,
  ShieldCheck,
  Key,
  Bell,
  Lock,
  User,
  LogOut,
  CheckCircle2,
  Copy,
  Check,
  Layers,
  Sparkles,
  Radio,
} from "lucide-react"
import { useNotifications } from "@/components/dashboard/notification-context"

export default function DashboardSettingsPage() {
  const router = useRouter()
  const { addAlert, showToast } = useNotifications()
  const [copied, setCopied] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleCopyIcal = () => {
    navigator.clipboard.writeText("https://www.kinghousemanagement.com/api/ical/sync/jabodetabek-master.ics")
    setCopied(true)
    showToast("Link iCal Disalin!", "Master calendar feed siap diimpor ke channel OTA.", "success")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveSuccess(true)

    addAlert({
      title: "Pengaturan Profil CMS Disimpan",
      message: "Data profil admin dan kredensial sistem berhasil diperbarui.",
      category: "system",
    })

    showToast("Profil Berhasil Disimpan!", "Perubahan akun admin aktif.", "success")
    setTimeout(() => setSaveSuccess(false), 3000)
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

  return (
    <div className="space-y-8 max-w-5xl animate-sana-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4DC] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-[10px] font-semibold uppercase tracking-wider text-[#222225] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#E8E4DC] mb-3">
            <Settings className="h-3.5 w-3.5 text-[#B8934C]" />
            <span>CONFIGURATION & INFRASTRUCTURE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-[#222225] font-semibold tracking-tight">
            Admin Profile & System Settings
          </h1>
          <p className="text-sm text-[#717171] mt-1 font-light leading-relaxed">
            Manage your administrative credentials, multi-channel distribution API keys, and notification channels.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-all disabled:opacity-50 self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <LogOut className="h-4 w-4" />
          <span>{isLoggingOut ? "Signing Out..." : "Sign Out of CMS"}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-sana-fade-in shadow-xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>Settings successfully saved and synced across CMS infrastructure.</span>
        </div>
      )}

      {/* Admin Profile Details */}
      <div className="rounded-3xl border border-[#E8E4DC] bg-white p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] space-y-6">
        <div className="flex items-center space-x-3.5 pb-4 border-b border-[#FAF8F5]">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#19191B] to-[#25222D] text-[#B8934C] flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-[#B8934C]/20">
            KH
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl text-[#222225] font-semibold">Kinghouse Principal Admin</h3>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                <span>Super Admin</span>
              </span>
            </div>
            <p className="text-xs text-[#717171] font-mono mt-0.5">admin@kinghousemanagement.com</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#555555] uppercase tracking-wider mb-1.5">
                Full Administrative Name
              </label>
              <input
                type="text"
                defaultValue="Kinghouse Principal Admin"
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E8E4DC] text-xs font-medium text-[#222225] focus:outline-none focus:border-[#B8934C] focus:ring-2 focus:ring-[#B8934C]/15 bg-[#FAF8F5]/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#555555] uppercase tracking-wider mb-1.5">
                Administrative Email
              </label>
              <input
                type="email"
                defaultValue="admin@kinghousemanagement.com"
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E8E4DC] text-xs font-mono text-[#222225] focus:outline-none focus:border-[#B8934C] focus:ring-2 focus:ring-[#B8934C]/15 bg-[#FAF8F5]/50 transition-all"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-[#222225] text-white text-xs font-semibold hover:bg-[#2B2A30] transition-all shadow-xs cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Security & Authentication Protocol */}
      <div className="rounded-3xl border border-[#E8E4DC] bg-white p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] space-y-6">
        <div className="flex items-center space-x-2.5">
          <div className="h-7 w-7 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-[#222225] border border-[#E8E4DC]">
            <Lock className="h-3.5 w-3.5 text-[#B8934C]" />
          </div>
          <h3 className="text-xl text-[#222225] font-semibold">Security & Authentication</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#717171]">Session Architecture</span>
            <p className="font-semibold text-[#222225]">HMAC-SHA256 Signed JWT</p>
            <p className="text-[11px] text-[#717171]">HttpOnly, SameSite Lax, 7-Day Expiry</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#717171]">Two-Factor Authorization</span>
            <p className="font-semibold text-emerald-700">Enforced by Role Token</p>
            <p className="text-[11px] text-[#717171]">Required for price adjustments & OTA sync</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#717171]">Edge Protection</span>
            <p className="font-semibold text-[#222225]">Next.js Edge Proxy Verified</p>
            <p className="text-[11px] text-[#717171]">Auto-redirect unauthorized visitors</p>
          </div>
        </div>
      </div>

      {/* Multi-Channel Distribution API & iCal */}
      <div className="rounded-3xl border border-[#E8E4DC] bg-white p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] space-y-6">
        <div className="flex items-center space-x-2.5">
          <div className="h-7 w-7 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-[#222225] border border-[#E8E4DC]">
            <Layers className="h-3.5 w-3.5 text-[#B8934C]" />
          </div>
          <h3 className="text-xl text-[#222225] font-semibold">OTA Multi-Channel Integration</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#555555] uppercase tracking-wider mb-1.5">
              Master Two-Way iCal Calendar Sync Feed
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value="https://kinghouse.id/api/ical/sync/jabodetabek-master.ics"
                className="flex-1 px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs font-mono text-[#555555] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyIcal}
                className="px-4 py-2.5 rounded-2xl border border-[#E8E4DC] hover:border-[#222225] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#222225] transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-[#717171] mt-1.5 font-light">
              Import this URL into Airbnb, Booking.com, and Agoda to synchronize availability in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

