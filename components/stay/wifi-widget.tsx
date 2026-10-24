"use client"

import { useState } from "react"
import { Wifi, Copy, Check, ShieldCheck, Zap } from "lucide-react"
import { WifiInfo } from "@/lib/guest-guide/types"
import { trackWiFiCopy } from "@/lib/analytics"

interface WifiWidgetProps {
  wifi: WifiInfo
}

export function WifiWidget({ wifi }: WifiWidgetProps) {
  const [copied, setCopied] = useState<"none" | "pass" | "ssid">("none")

  const copyToClipboard = (text: string, type: "pass" | "ssid") => {
    navigator.clipboard.writeText(text)
    trackWiFiCopy({
      propertyName: wifi.networkName,
      ssid: type === "pass" ? "Password copied" : wifi.networkName,
    })
    setCopied(type)
    setTimeout(() => setCopied("none"), 2000)
  }


  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-950/80 p-5 backdrop-blur-xl shadow-xl">
      <div className="absolute top-0 right-0 h-28 w-28 -mr-6 -mt-6 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Wifi className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              High-Speed WiFi
            </div>
            <div className="text-sm font-medium text-stone-300">
              {wifi.speed}
            </div>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="h-3.5 w-3.5" />
          Connected & Tested
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* SSID */}
        <div className="flex items-center justify-between rounded-xl border border-stone-800/80 bg-stone-900/60 p-3.5 transition-colors hover:border-stone-700">
          <div className="min-w-0 pr-2">
            <div className="text-xs font-medium uppercase tracking-wider text-stone-400">
              Network (SSID)
            </div>
            <div className="truncate text-sm font-semibold text-stone-100 font-mono">
              {wifi.networkName}
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(wifi.networkName, "ssid")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white transition-all active:scale-95"
            title="Copy Network Name"
          >
            {copied === "ssid" ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Password */}
        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 transition-colors hover:border-amber-500/50">
          <div className="min-w-0 pr-2">
            <div className="text-xs font-medium uppercase tracking-wider text-amber-400/90">
              Password
            </div>
            <div className="truncate text-sm font-bold text-amber-200 font-mono">
              {wifi.password}
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(wifi.password, "pass")}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500/20 px-2.5 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition-all active:scale-95 border border-amber-500/30"
          >
            {copied === "pass" ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Salin Password</span>
              </>
            )}
          </button>
        </div>
      </div>

      {wifi.notes && (
        <div className="mt-3 flex items-start gap-2 text-xs text-stone-400 border-t border-stone-800/60 pt-3">
          <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>{wifi.notes}</span>
        </div>
      )}
    </div>
  )
}
