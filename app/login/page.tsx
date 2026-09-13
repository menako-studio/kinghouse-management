"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Fingerprint,
} from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both administrative email and password.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || "Authentication failed. Invalid administrative credentials.")
        setIsLoading(false)
        return
      }

      setSuccessMessage("Identity verified. Initializing Kinghouse CMS Suite...")

      setTimeout(() => {
        router.push(callbackUrl)
        router.refresh()
      }, 600)
    } catch {
      setErrorMessage("Network error during authorization. Please verify connection and retry.")
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#19191B] text-white flex flex-col justify-between overflow-hidden selection:bg-[#B8934C] selection:text-[#19191B]">
      {/* Brand Ambient Glow Lighting Orbs (Kinghouse Gold & Khaki Palette) */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#B8934C]/15 via-[#8C7F5F]/15 to-transparent blur-[120px] pointer-events-none animate-sana-glow" />
      <div className="absolute bottom-[-15%] right-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-[#DFC58E]/10 via-[#28282B]/30 to-transparent blur-[140px] pointer-events-none animate-sana-float" />
      <div className="absolute top-[40%] right-[-5%] w-[350px] h-[350px] rounded-full bg-[#8C7F5F]/10 blur-[100px] pointer-events-none" />

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50" />

      {/* Top Bar Navigation */}
      <header className="relative z-10 px-6 py-6 sm:px-12 flex items-center justify-between border-b border-white/[0.08] backdrop-blur-md">
        <Link href="/" className="group flex items-center space-x-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#B8934C]/40 bg-gradient-to-br from-[#B8934C] to-[#8C7F5F] text-[#19191B] font-bold text-lg transition-all duration-300 group-hover:scale-105 shadow-[0_0_20px_rgba(184,147,76,0.2)]">
            <span>K</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight text-white group-hover:text-[#DFC58E] transition-colors">
              Kinghouse
            </span>
            <span className="text-[8px] uppercase tracking-[0.25em] text-[#DFC58E] -mt-1 font-medium">
              Hospitality Portal
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs uppercase tracking-widest text-white/70 hover:text-white transition-all flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-white/10 hover:border-[#B8934C]/40 bg-white/[0.03] hover:bg-white/[0.08]"
        >
          <span>Exit to Public Site</span>
          <ArrowRight className="h-3 w-3 text-[#DFC58E]" />
        </Link>
      </header>

      {/* Main Authentication Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6 sm:p-10 my-4">
        <div className="w-full max-w-md animate-sana-fade-in">
          {/* Card Container */}
          <div className="rounded-3xl p-8 sm:p-10 relative overflow-hidden bg-[#222225]/85 backdrop-blur-xl border border-white/[0.12] shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
            {/* Top Gold Shimmer Border */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#B8934C]/60 to-transparent" />

            {/* Protocol Badge Header */}
            <div className="flex items-center justify-between mb-7">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#B8934C]/15 border border-[#B8934C]/30 text-[10px] font-semibold tracking-wider text-white/90">
                <span className="h-1.5 w-1.5 rounded-full bg-[#DFC58E] animate-pulse" />
                <span className="text-[#DFC58E] uppercase">
                  MANAGEMENT CMS 2026
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] uppercase font-mono tracking-widest text-white/50">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>256-Bit SSL</span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="mb-8 space-y-2">
              <h1 className="text-3xl sm:text-4xl text-white font-semibold tracking-tight">
                CMS Portal Access
              </h1>
              <p className="text-xs text-white/70 leading-relaxed font-sans font-light">
                Secure administrative console for Jabodetabek property distribution, dynamic revenue calibration, and SEO algorithms.
              </p>
            </div>

            {/* Alerts */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-start space-x-3 text-red-200 text-xs backdrop-blur-md animate-sana-fade-in">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start space-x-3 text-emerald-200 text-xs backdrop-blur-md animate-sana-fade-in">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-white/80 mb-2">
                  Administrative Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40 group-focus-within:text-[#DFC58E] transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="info@kinghousemanagement.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/10 rounded-2xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#B8934C] focus:ring-2 focus:ring-[#B8934C]/20 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-white/80">
                    Master Password
                  </label>
                  <span className="text-[10px] text-white/40 font-mono">Encrypted Token</span>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40 group-focus-within:text-[#DFC58E] transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full pl-10 pr-11 py-3 bg-white/[0.05] border border-white/10 rounded-2xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#B8934C] focus:ring-2 focus:ring-[#B8934C]/20 transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-white/70 hover:text-white transition-colors select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded-md border-white/20 bg-white/5 text-[#B8934C] focus:ring-0 focus:ring-offset-0 accent-[#B8934C]"
                  />
                  <span>Persist session for 7 days</span>
                </label>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative group w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#B8934C] via-[#DFC58E] to-[#B8934C] text-[#19191B] font-semibold text-sm hover:brightness-110 active:scale-[0.99] transition-all duration-200 flex items-center justify-center space-x-2 shadow-[0_10px_30px_rgba(184,147,76,0.25)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-[#19191B]" />
                    <span>Verifying Session...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate to Dashboard</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Security Badge */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-[11px] text-white/50 text-center">
            <Fingerprint className="h-3.5 w-3.5 text-[#DFC58E]" />
            <span>Kinghouse Hospitality Group &bull; Secure HMAC-SHA256 Token Auth</span>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="relative z-10 px-6 py-4 text-center text-xs text-white/50 border-t border-white/[0.08] backdrop-blur-md">
        <span>Kinghouse Asset Management Suite &bull; Greater Jakarta Region (Jabodetabek)</span>
      </footer>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#19191B] flex items-center justify-center text-white">
          <div className="flex items-center space-x-3 text-[#DFC58E]">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-sm font-medium">Loading Kinghouse Portal...</span>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
