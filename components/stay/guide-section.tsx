"use client"

import { useState } from "react"
import {
  KeyRound,
  ShieldAlert,
  Tv,
  Droplet,
  Flame,
  Wind,
  Utensils,
  Sparkles,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { AccessGuide, ApplianceGuide, LocalPlace } from "@/lib/guest-guide/types"

interface GuideSectionProps {
  access: AccessGuide
  houseRules: string[]
  appliances: ApplianceGuide[]
  localGuide: LocalPlace[]
}

const APPLIANCE_ICONS: Record<string, typeof Tv> = {
  Tv,
  Droplet,
  Flame,
  Wind,
  Utensils,
  Sparkles,
}

export function GuideSection({
  access,
  houseRules,
  appliances,
  localGuide,
}: GuideSectionProps) {
  const [activeTab, setActiveTab] = useState<"access" | "appliances" | "rules" | "local">("access")
  const [openAppliance, setOpenAppliance] = useState<number | null>(0)

  return (
    <div className="rounded-3xl border border-stone-800 bg-stone-950/80 p-6 backdrop-blur-xl shadow-xl">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-800 pb-4 mb-6">
        <button
          onClick={() => setActiveTab("access")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === "access"
              ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-950/40"
              : "bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800"
          }`}
        >
          <KeyRound className="h-3.5 w-3.5" />
          Akses & Check-in
        </button>

        <button
          onClick={() => setActiveTab("appliances")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === "appliances"
              ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-950/40"
              : "bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800"
          }`}
        >
          <Tv className="h-3.5 w-3.5" />
          Panduan Elektronik & Fasilitas
        </button>

        <button
          onClick={() => setActiveTab("rules")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === "rules"
              ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-950/40"
              : "bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800"
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          Peraturan Rumah
        </button>

        <button
          onClick={() => setActiveTab("local")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === "local"
              ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-950/40"
              : "bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800"
          }`}
        >
          <MapPin className="h-3.5 w-3.5" />
          Rekomendasi Sekitar
        </button>
      </div>

      {/* Tab 1: Access & Arrival */}
      {activeTab === "access" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4">
              <div className="text-xs text-stone-400">Waktu Check-In</div>
              <div className="text-lg font-bold text-amber-300 font-serif">
                {access.checkInTime}
              </div>
            </div>
            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4">
              <div className="text-xs text-stone-400">Waktu Check-Out</div>
              <div className="text-lg font-bold text-stone-200 font-serif">
                {access.checkOutTime}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              Petunjuk Akses Kunci / Smart Lock
            </div>
            <p className="text-xs text-amber-200/90 font-medium mb-3">
              {access.smartLockCodeOrPin}
            </p>
            <ul className="space-y-2">
              {access.accessInstructions.map((inst, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-stone-300">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-300 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-4 text-xs text-stone-400">
            <span className="font-semibold text-stone-300">Informasi Parkir: </span>
            {access.parkingInfo}
          </div>
        </div>
      )}

      {/* Tab 2: Appliances */}
      {activeTab === "appliances" && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {appliances.map((app, index) => {
            const IconComp = APPLIANCE_ICONS[app.icon] || Tv
            const isOpen = openAppliance === index

            return (
              <div
                key={index}
                className="rounded-2xl border border-stone-800 bg-stone-900/50 overflow-hidden transition-colors hover:border-stone-700"
              >
                <button
                  onClick={() => setOpenAppliance(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-800 text-amber-400 border border-stone-700">
                      <IconComp className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-stone-100">
                      {app.title}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-stone-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-stone-400" />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-stone-800/80 bg-stone-950/40 p-4 pt-3">
                    <ul className="space-y-2">
                      {app.instructions.map((inst, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-stone-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          <span>{inst}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Tab 3: House Rules */}
      {activeTab === "rules" && (
        <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-5 sm:p-6 animate-in fade-in duration-200 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h4 className="text-sm font-bold text-stone-100 flex items-center gap-2 font-serif">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              Peraturan & Ketentuan Menginap (House Rules)
            </h4>
            <span className="text-[11px] font-semibold text-amber-400/90 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              Kinghouse Hospitality Standard
            </span>
          </div>

          <p className="text-xs text-stone-400 leading-relaxed">
            Demi kenyamanan, keamanan bersama, dan menjaga kualitas unit properti, kami mohon seluruh tamu mematuhi panduan berikut:
          </p>

          <ul className="space-y-3 pt-1">
            {houseRules.map((rule, i) => {
              const isWarning =
                rule.toLowerCase().includes("no smoking") ||
                rule.toLowerCase().includes("no pets") ||
                rule.toLowerCase().includes("safety") ||
                rule.toLowerCase().includes("electrical") ||
                rule.toLowerCase().includes("damage") ||
                rule.toLowerCase().includes("stains")

              const isCheckout = rule.toLowerCase().includes("check-out") || rule.toLowerCase().includes("checkout")

              return (
                <li
                  key={i}
                  className={`flex items-start gap-3 text-xs leading-relaxed p-3 rounded-xl border transition-colors ${
                    isWarning
                      ? "border-amber-500/30 bg-amber-500/5 text-amber-100/90"
                      : isCheckout
                      ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-100/90"
                      : "border-stone-800/80 bg-stone-900/60 text-stone-300"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5 ${
                      isWarning
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : isCheckout
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-stone-800 text-stone-400 border border-stone-700"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="font-normal">{rule}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Tab 4: Neighborhood Recommendations */}
      {activeTab === "local" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
          {localGuide.map((place, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-900/50 p-4 transition-colors hover:border-stone-700"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="rounded-md bg-stone-800 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                    {place.category}
                  </span>
                  <span className="text-[11px] text-stone-400 font-medium">
                    {place.distance}
                  </span>
                </div>
                <h5 className="text-sm font-semibold text-stone-100 mb-1">
                  {place.name}
                </h5>
                <p className="text-xs text-stone-400 leading-relaxed mb-3">
                  {place.highlight}
                </p>
              </div>

              <a
                href={place.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors pt-2 border-t border-stone-800/60"
              >
                Buka di Google Maps
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
