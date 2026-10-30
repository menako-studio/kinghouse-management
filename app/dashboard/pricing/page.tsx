"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { createPortal } from "react-dom"
import {
  Coins,
  TrendingUp,
  Download,
  RefreshCw,
  SlidersHorizontal,
  X,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  Tag,
  Building,
} from "lucide-react"
import { CURATED_VILLAS } from "@/lib/data"
import { useNotifications } from "@/components/dashboard/notification-context"
import {
  DynamicPricingResponse,
  PricingStrategy,
  DailyPriceRecommendation,
} from "@/lib/pricing/types"
import { downloadPricingCsv } from "@/lib/pricing/export"
import { formatCurrency } from "@/lib/utils"
import { YieldSummary } from "@/components/dashboard/pricing/yield-summary"
import { AirbnbEarningsChart } from "@/components/dashboard/pricing/airbnb-earnings-chart"

const STRATEGY_HINTS: Record<PricingStrategy, string> = {
  conservative: "Harga lebih hati-hati: prioritas villa tetap terisi, diskon mendadak lebih besar.",
  balanced: "Rekomendasi standar: naik di akhir pekan & libur, wajar di hari biasa.",
  aggressive: "Harga lebih berani saat ramai: untung per malam lebih besar, risiko kosong lebih tinggi.",
}

const DEMAND_LABELS_ID = { Low: "Sepi", Moderate: "Normal", High: "Ramai", "Peak Surge": "Sangat ramai" } as const

export default function DynamicPricingPage() {
  const { showToast } = useNotifications()
  const [selectedProperty, setSelectedProperty] = useState<string>("versatile-house-jagakarsa")
  const [strategy, setStrategy] = useState<PricingStrategy>("balanced")
  const [pricingData, setPricingData] = useState<DynamicPricingResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedDateRec, setSelectedDateRec] = useState<DailyPriceRecommendation | null>(null)
  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false)
  const [activeMonthTab, setActiveMonthTab] = useState<number>(0) // 0 = first month, 1 = second month

  // Custom override modal input state
  const [overridePriceInput, setOverridePriceInput] = useState<string>("")
  const [overrideReasonInput, setOverrideReasonInput] = useState<string>("")
  const [isSavingOverride, setIsSavingOverride] = useState<boolean>(false)

  // Guardrails editable state
  const [editableRules, setEditableRules] = useState<{
    minPriceIdr: number
    maxPriceIdr: number
    weekendSurgePercent: number
    lastMinuteDiscountPercent: number
    holidaySurgePercent: number
  }>({
    minPriceIdr: 0,
    maxPriceIdr: 0,
    weekendSurgePercent: 28,
    lastMinuteDiscountPercent: 15,
    holidaySurgePercent: 35,
  })

  // Fetch dynamic pricing from API
  const fetchPricing = async (propertySlug: string, strat: PricingStrategy, forceSync: boolean = false) => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/erp/dynamic-pricing?propertySlug=${propertySlug}&strategy=${strat}&horizon=60${forceSync ? "&sync=true" : ""}`
      )
      const json = await res.json()
      if (json.success && json.data) {
        setPricingData(json.data)
        setEditableRules({
          minPriceIdr: json.data.rules.minPriceIdr,
          maxPriceIdr: json.data.rules.maxPriceIdr,
          weekendSurgePercent: json.data.rules.weekendSurgePercent,
          lastMinuteDiscountPercent: json.data.rules.lastMinuteDiscountPercent,
          holidaySurgePercent: json.data.rules.holidaySurgePercent,
        })
      } else {
        showToast("Gagal Memuat Tarif", json.error || "Terjadi kesalahan saat memproses data", "error")
      }
    } catch {
      showToast("Kesalahan Jaringan", "Tidak dapat menghubungi server dynamic pricing", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loads pricing when the selected property or strategy changes
    fetchPricing(selectedProperty, strategy)
  }, [selectedProperty, strategy])

  // Handle saving date override
  const handleSaveOverride = async () => {
    if (!selectedDateRec || !pricingData) return
    const priceNum = parseInt(overridePriceInput.replace(/\D/g, ""), 10)
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast("Tarif Tidak Valid", "Masukkan nominal tarif yang valid dalam rupiah", "warning")
      return
    }

    setIsSavingOverride(true)
    try {
      const res = await fetch("/api/erp/dynamic-pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "override",
          propertySlug: selectedProperty,
          date: selectedDateRec.date,
          overridePriceIdr: priceNum,
          reason: overrideReasonInput || "Custom Admin Pricing",
        }),
      })
      const json = await res.json()
      if (json.success) {
        showToast("Override Berhasil Diterapkan", json.message, "success")
        setSelectedDateRec(null)
        fetchPricing(selectedProperty, strategy)
      } else {
        showToast("Gagal Menyimpan", json.error, "error")
      }
    } catch {
      showToast("Kesalahan Jaringan", "Gagal menyimpan override tarif", "error")
    } finally {
      setIsSavingOverride(false)
    }
  }

  // Handle clearing date override
  const handleClearOverride = async () => {
    if (!selectedDateRec) return
    setIsSavingOverride(true)
    try {
      const res = await fetch("/api/erp/dynamic-pricing", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertySlug: selectedProperty,
          date: selectedDateRec.date,
        }),
      })
      const json = await res.json()
      if (json.success) {
        showToast("Override Dihapus", json.message, "info")
        setSelectedDateRec(null)
        fetchPricing(selectedProperty, strategy)
      } else {
        showToast("Gagal Menghapus", json.error, "error")
      }
    } catch {
      showToast("Kesalahan Jaringan", "Gagal menghapus override tarif", "error")
    } finally {
      setIsSavingOverride(false)
    }
  }

  // Handle saving guardrails / rule updates
  const handleSaveRules = async () => {
    try {
      const res = await fetch("/api/erp/dynamic-pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-rules",
          propertySlug: selectedProperty,
          rules: editableRules,
        }),
      })
      const json = await res.json()
      if (json.success) {
        showToast("Parameter Disimpan", json.message, "success")
        setShowSettingsDrawer(false)
        fetchPricing(selectedProperty, strategy)
      } else {
        showToast("Gagal Menyimpan", json.error, "error")
      }
    } catch {
      showToast("Kesalahan Jaringan", "Gagal memperbarui parameter strategi", "error")
    }
  }

  // Handle CSV Download
  const handleExportCsv = () => {
    if (!pricingData) return
    const filename = `Kinghouse-SmartRates-${selectedProperty}-${strategy}-${new Date().toISOString().split("T")[0]}.csv`
    downloadPricingCsv(filename, pricingData.propertyName, selectedProperty, pricingData.rules, pricingData.recommendations)
    showToast("File CSV Berhasil Diunduh", `Daftar rekomendasi tarif tersimpan sebagai ${filename}`, "success")
  }

  // Group recommendations by Month
  const monthsMap = new Map<string, DailyPriceRecommendation[]>()
  if (pricingData) {
    pricingData.recommendations.forEach((rec) => {
      const dateObj = new Date(rec.date)
      const monthKey = dateObj.toLocaleString("id-ID", { month: "long", year: "numeric" })
      if (!monthsMap.has(monthKey)) {
        monthsMap.set(monthKey, [])
      }
      monthsMap.get(monthKey)!.push(rec)
    })
  }
  const monthKeys = Array.from(monthsMap.keys())
  const activeMonthName = monthKeys[activeMonthTab] || monthKeys[0]
  const activeMonthRecs = (activeMonthName && monthsMap.get(activeMonthName)) || []

  return (
    <div className="space-y-8 animate-sana-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E8E4DC] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-[10px] font-semibold uppercase tracking-wider text-[#222225] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#E8E4DC] mb-3">
            <Coins className="h-3.5 w-3.5 text-[#B8934C]" />
            <span>PENGATURAN HARGA OTOMATIS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-[#222225] font-semibold tracking-tight">
            Atur Harga Dinamis &amp; Promo Otomatis
          </h1>
          <p className="text-sm text-[#717171] mt-1 font-light leading-relaxed">
            Sistem penyesuaian harga otomatis berdasarkan akhir pekan, hari libur nasional, dan tingkat keterisian villa agar keuntungan Anda maksimal.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchPricing(selectedProperty, strategy, true)}
            disabled={loading}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white border border-[#E8E4DC] text-xs font-semibold text-[#222225] hover:bg-[#FAF8F5] hover:border-[#CBBEA0] shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-[#B8934C] ${loading ? "animate-spin" : ""}`} />
            <span>Perbarui Harga</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSettingsDrawer(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white border border-[#E8E4DC] text-xs font-semibold text-[#222225] hover:bg-[#FAF8F5] hover:border-[#CBBEA0] shadow-xs transition-all cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#8C7F5F]" />
            <span>Batas Harga Min &amp; Max</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!pricingData}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-[#231F1A] text-white hover:bg-[#19191B] text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5 text-[#CBBEA0]" />
            <span>Unduh Tabel Harga (.CSV)</span>
          </button>
        </div>
      </div>

      {/* Live Data Provenance & Real-Time Sync Status */}
      {pricingData && (
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center space-x-1.5 font-semibold text-[#222225] bg-white px-3 py-1 rounded-xl border border-[#E8E4DC] shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sinkronisasi Kalender Aktif</span>
            </span>
            <span className="text-[#717171] flex items-center space-x-1">
              <span>Kalender Airbnb:</span>
              <strong className="text-[#222225] font-medium">{pricingData.provenance.calendarSource}</strong>
            </span>
            <span className="text-[#717171]">&bull;</span>
            <span className="text-[#717171] flex items-center space-x-1">
              <span>Kalender Libur:</span>
              <strong className="text-[#222225] font-medium">{pricingData.provenance.holidaysSource}</strong>
            </span>
          </div>

          <div className="text-[11px] text-[#717171] font-mono self-start md:self-auto flex items-center space-x-2">
            <span className="bg-white text-[#5C5347] px-2.5 py-0.5 rounded-lg border border-[#E8E4DC] font-medium">
              Terakhir Diperbarui: {new Date(pricingData.lastUpdated).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
            </span>
          </div>
        </div>
      )}

      {/* Property Selector Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CURATED_VILLAS.map((villa) => {
          const isSelected = selectedProperty === villa.slug
          return (
            <button
              key={villa.id}
              type="button"
              onClick={() => setSelectedProperty(villa.slug)}
              className={`text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center space-x-3.5 cursor-pointer ${
                isSelected
                  ? "bg-[#FAF8F5] border-[#B8934C] shadow-[0_4px_20px_rgba(184,147,76,0.12)] ring-1 ring-[#B8934C]"
                  : "bg-white border-[#E8E4DC] hover:border-[#CBBEA0] hover:bg-[#FAF8F5]/50"
              }`}
            >
              <div className="relative h-12 w-12 rounded-xl overflow-hidden flex-shrink-0 border border-[#E8E4DC]">
                <Image src={villa.heroImage} alt={villa.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7F5F]">
                    {villa.area}
                  </span>
                  {isSelected && <span className="h-2 w-2 rounded-full bg-[#B8934C]" />}
                </div>
                <h4 className="text-xs font-semibold text-[#222225] truncate mt-0.5">
                  {villa.name}
                </h4>
                <p className="text-[11px] font-mono text-[#717171] mt-0.5">
                  Base: {formatCurrency(villa.price.idr, "IDR")}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Strategy Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-[#E8E4DC] shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-[#B8934C]">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#222225]">Gaya Penetapan Harga</h3>
            <p className="text-xs text-[#717171] font-light">
              {STRATEGY_HINTS[strategy]}
            </p>
          </div>
        </div>

        <div className="inline-flex rounded-2xl p-1 bg-[#FAF8F5] border border-[#E8E4DC]">
          {(
            [
              { id: "conservative", label: "Konservatif", desc: STRATEGY_HINTS.conservative },
              { id: "balanced", label: "Seimbang", desc: STRATEGY_HINTS.balanced },
              { id: "aggressive", label: "Agresif", desc: STRATEGY_HINTS.aggressive },
            ] as const
          ).map((item) => {
            const active = strategy === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setStrategy(item.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-[#231F1A] text-white shadow-xs"
                    : "text-[#717171] hover:text-[#222225] hover:bg-white/80"
                }`}
                title={item.desc}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 60-day outlook anchored to Airbnb payouts */}
      {pricingData && (
        <YieldSummary outlook={pricingData.yieldOutlook} propertyName={pricingData.propertyName} />
      )}

      {pricingData?.yieldOutlook.airbnb && <AirbnbEarningsChart data={pricingData.yieldOutlook.airbnb} />}

      {/* Market context: model figures, kept secondary and labelled as such */}
      {pricingData && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-label="Konteks pasar">
          <div className="p-5 rounded-3xl bg-white border border-[#E8E4DC] shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-semibold text-[#222225]">Indeks keramaian 60 hari</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-[#FAF8F5] text-[#8C7F5F] border-[#E8E4DC]">
                Estimasi sistem
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#222225]">{pricingData.marketDemandScore}</span>
              <span className="text-xs text-[#717171]">/ 100 · {DEMAND_LABELS_ID[pricingData.overallDemandLevel]}</span>
            </div>
            <div className="w-full bg-[#FAF8F5] h-2 rounded-full overflow-hidden border border-[#E8E4DC]">
              <div
                className="h-full bg-gradient-to-r from-[#8C7F5F] via-[#B8934C] to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${pricingData.marketDemandScore}%` }}
              />
            </div>
            <p className="text-xs text-[#5C5347] leading-relaxed">
              Seberapa banyak akhir pekan, libur nasional, dan musim liburan di 60 hari ke depan. 50 = hari biasa; makin tinggi,
              makin banyak hari yang layak dinaikkan harganya. Pola kawasan: {pricingData.submarket.marketPaceDescription}.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#E8E4DC] shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-semibold text-[#222225] flex items-center gap-2">
                <Building className="h-4 w-4 text-[#8C7F5F]" />
                Acuan tarif kawasan
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-[#FAF8F5] text-[#8C7F5F] border-[#E8E4DC]">
                Riset internal
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-[#717171]">Rata-rata kompetitor</div>
                <div className="text-xl font-bold text-[#222225]">
                  {formatCurrency(pricingData.submarket.avgCompetitorAdrIdr, "IDR")}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#717171]">Tarif dasar Anda</div>
                <div className="text-xl font-bold text-[#222225]">
                  {formatCurrency(pricingData.rules.basePriceIdr, "IDR")}
                </div>
              </div>
            </div>
            <p className="text-xs text-[#5C5347] leading-relaxed">
              Perkiraan tim dari {pricingData.submarket.activeCompetitorsCount} listing sejenis di {pricingData.submarket.submarketName},
              per malam. Bukan data Airbnb; pakai sebagai gambaran posisi harga.
            </p>
          </div>
        </section>
      )}

      {/* Dynamic Calendar Header & Month Navigation */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-[#222225] flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-[#B8934C]" />
              <span>Kalender Harga per Malam (60 Hari)</span>
            </h2>
            <p className="text-xs text-[#717171] mt-0.5 font-light">
              Klik tanggal untuk melihat alasan harganya, atau pasang harga manual untuk tanggal itu.
            </p>
          </div>

          {/* Month Tabs */}
          {monthKeys.length > 0 && (
            <div className="inline-flex rounded-2xl p-1 bg-[#FAF8F5] border border-[#E8E4DC] self-start sm:self-auto">
              {monthKeys.map((mKey, idx) => (
                <button
                  key={mKey}
                  type="button"
                  onClick={() => setActiveMonthTab(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeMonthTab === idx
                      ? "bg-white text-[#222225] shadow-xs border border-[#E8E4DC]"
                      : "text-[#717171] hover:text-[#222225]"
                  }`}
                >
                  {mKey}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Legend strip */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-white p-3 rounded-2xl border border-[#E8E4DC] text-[#717171]">
          <span className="font-semibold text-[#222225] text-[11px] uppercase tracking-wider">Keterangan:</span>
          <span className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Sudah dipesan</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>Akhir pekan (harga naik)</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
            <span>Libur nasional</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span>Diskon mendadak (H-2)</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#B8934C]" />
            <span>Harga manual</span>
          </span>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-3xl border border-[#E8E4DC] p-4 sm:p-6 shadow-xs overflow-hidden">
          {/* Weekday Header */}
          <div className="grid grid-cols-7 gap-2 pb-3 mb-2 border-b border-[#FAF8F5] text-center text-xs font-bold uppercase tracking-wider text-[#8C7F5F]">
            <div>Min</div>
            <div>Sen</div>
            <div>Sel</div>
            <div>Rab</div>
            <div>Kam</div>
            <div>Jum</div>
            <div>Sab</div>
          </div>

          {/* Calendar Day Cells */}
          {loading ? (
            <div className="py-24 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-[#B8934C] mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#222225]">Menyiapkan kalender harga...</p>
              <p className="text-xs text-[#717171] mt-1">Mengambil kalender Airbnb dan daftar libur nasional.</p>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {/* Padding offset for first day of active month */}
              {activeMonthRecs.length > 0 &&
                Array.from({ length: new Date(activeMonthRecs[0].date).getDay() }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-28 rounded-2xl bg-[#FAF8F5]/40 border border-dashed border-[#E8E4DC]/40" />
                ))}

              {activeMonthRecs.map((rec) => {
                const isOverridden = Boolean(rec.overridePriceIdr)
                const priceDiff = rec.recommendedPriceIdr - rec.basePriceIdr
                const pctDiff = Math.round((priceDiff / rec.basePriceIdr) * 100)

                return (
                  <button
                    key={rec.date}
                    type="button"
                    onClick={() => {
                      setSelectedDateRec(rec)
                      setOverridePriceInput(rec.overridePriceIdr ? String(rec.overridePriceIdr) : String(rec.recommendedPriceIdr))
                      setOverrideReasonInput("")
                    }}
                    className={`h-28 p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer relative group ${
                      rec.isBooked
                        ? "bg-emerald-50/50 border-emerald-200 hover:border-emerald-300"
                        : isOverridden
                        ? "bg-[#FAF8F5] border-[#B8934C] shadow-xs ring-1 ring-[#B8934C]/40 hover:bg-[#FAF8F5]"
                        : rec.isHoliday
                        ? "bg-purple-50/40 border-purple-200 hover:border-purple-300"
                        : rec.multipliers.dayOfWeekFactor > 1.15
                        ? "bg-amber-50/30 border-amber-200 hover:border-amber-300"
                        : "bg-white border-[#E8E4DC] hover:border-[#CBBEA0] hover:shadow-xs"
                    }`}
                  >
                    {/* Top Row: Date & Status Tag */}
                    <div className="flex items-start justify-between w-full">
                      <span className="text-xs font-bold text-[#222225]">
                        {rec.dayNumber}
                      </span>

                      {/* Small badge */}
                      {rec.isBooked ? (
                        <span className="text-[9px] font-semibold bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">
                          Terisi
                        </span>
                      ) : isOverridden ? (
                        <span className="text-[9px] font-bold bg-[#B8934C] text-white px-1.5 py-0.5 rounded-full flex items-center space-x-0.5">
                          <span>★</span>
                        </span>
                      ) : rec.isHoliday ? (
                        <span className="text-[9px] font-semibold bg-purple-600 text-white px-1.5 py-0.5 rounded-full">
                          Libur
                        </span>
                      ) : rec.multipliers.dayOfWeekFactor > 1.15 ? (
                        <span className="text-[9px] font-semibold bg-amber-600 text-white px-1.5 py-0.5 rounded-full">
                          Ramai
                        </span>
                      ) : null}
                    </div>

                    {/* Middle: Recommended Price */}
                    <div className="my-auto">
                      <div className="text-xs sm:text-sm font-bold text-[#222225] leading-tight tracking-tight">
                        {formatCurrency(rec.recommendedPriceIdr, "IDR")}
                      </div>
                      {priceDiff !== 0 && !rec.isBooked && (
                        <div
                          className={`text-[10px] font-semibold flex items-center mt-0.5 ${
                            priceDiff > 0 ? "text-emerald-700" : "text-blue-700"
                          }`}
                        >
                          {priceDiff > 0 ? (
                            <ArrowUpRight className="h-3 w-3 inline" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 inline" />
                          )}
                          <span>
                            {priceDiff > 0 ? `+${pctDiff}%` : `${pctDiff}%`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom: Note / Channel indicator */}
                    <div className="text-[9px] text-[#717171] truncate font-light">
                      {rec.isBooked ? (
                        <span className="text-emerald-700 font-medium truncate">
                          {rec.bookingChannel || "Airbnb"}
                        </span>
                      ) : rec.holidayName ? (
                        <span className="text-purple-700 truncate font-medium">
                          {rec.holidayName}
                        </span>
                      ) : (
                        <span className="truncate">{rec.notes[0] || "Standar"}</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Date Detail & Price Override Modal */}
      {selectedDateRec &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-sana-fade-in">
            <div className="bg-white rounded-3xl border border-[#E8E4DC] max-w-lg w-full shadow-[0_25px_70px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-6 border-b border-[#E8E4DC] flex items-center justify-between bg-[#FAF8F5]">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8C7F5F]">
                      {selectedDateRec.dayOfWeek}, {selectedDateRec.date}
                    </span>
                    {selectedDateRec.isBooked && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        Terpesan ({selectedDateRec.bookingChannel || "Airbnb"})
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-[#222225] mt-1">
                    Rincian Harga Tanggal Ini
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDateRec(null)}
                  className="h-8 w-8 rounded-full bg-white border border-[#E8E4DC] flex items-center justify-center text-[#717171] hover:text-[#222225] cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#717171] tracking-wider">
                      Harga yang disarankan
                    </span>
                    <div className="text-2xl font-bold text-[#222225] mt-0.5">
                      {formatCurrency(selectedDateRec.recommendedPriceIdr, "IDR")}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#717171] tracking-wider">
                      Tarif Dasar
                    </span>
                    <div className="text-sm font-semibold text-[#717171] mt-0.5">
                      {formatCurrency(selectedDateRec.basePriceIdr, "IDR")}
                    </div>
                  </div>
                </div>

                {/* Multiplier Factor Breakdown Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#222225] mb-2 flex items-center space-x-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-[#B8934C]" />
                    <span>Kenapa harganya segini?</span>
                  </h4>
                  <div className="rounded-2xl border border-[#E8E4DC] divide-y divide-[#E8E4DC] text-xs">
                    <div className="p-2.5 flex items-center justify-between bg-[#FAF8F5]/50">
                      <span className="text-[#717171]">Hari ({selectedDateRec.dayOfWeek}):</span>
                      <span className="font-semibold text-[#222225]">
                        {selectedDateRec.multipliers.dayOfWeekFactor}x
                      </span>
                    </div>
                    <div className="p-2.5 flex items-center justify-between">
                      <span className="text-[#717171]">Musim liburan:</span>
                      <span className="font-semibold text-[#222225]">
                        {selectedDateRec.multipliers.seasonalityFactor}x
                      </span>
                    </div>
                    <div className="p-2.5 flex items-center justify-between bg-[#FAF8F5]/50">
                      <span className="text-[#717171]">Libur nasional / long weekend:</span>
                      <span className="font-semibold text-[#222225]">
                        {selectedDateRec.multipliers.holidayFactor}x
                        {selectedDateRec.holidayName && ` (${selectedDateRec.holidayName})`}
                      </span>
                    </div>
                    <div className="p-2.5 flex items-center justify-between">
                      <span className="text-[#717171]">Jarak ke tanggal menginap:</span>
                      <span className="font-semibold text-[#222225]">
                        {selectedDateRec.multipliers.leadTimeFactor}x
                      </span>
                    </div>
                    <div className="p-2.5 flex items-center justify-between bg-[#FAF8F5]/50">
                      <span className="text-[#717171]">Kecepatan booking saat ini:</span>
                      <span className="font-semibold text-[#222225]">
                        {selectedDateRec.multipliers.pacingFactor}x
                      </span>
                    </div>
                    <div className="p-2.5 flex items-center justify-between bg-[#FAF8F5]">
                      <span className="font-semibold text-[#222225]">Hasil (setelah batas harga min &amp; max):</span>
                      <span className="font-bold text-[#B8934C]">
                        {formatCurrency(selectedDateRec.multipliers.clampedRecommendedPriceIdr, "IDR")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Admin Custom Price Override Input */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center space-x-1.5">
                      <Tag className="h-3.5 w-3.5 text-[#B8934C]" />
                      <span>Atur Harga Manual</span>
                    </span>
                    {selectedDateRec.overridePriceIdr && (
                      <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                        Sedang dipakai
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#717171]">
                    Isi kalau ingin memakai harga sendiri untuk tanggal ini. Harga manual menggantikan saran sistem.
                  </p>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#222225]">
                      Harga per malam (Rp)
                    </label>
                    <input
                      type="number"
                      value={overridePriceInput}
                      onChange={(e) => setOverridePriceInput(e.target.value)}
                      placeholder={`Contoh: ${selectedDateRec.recommendedPriceIdr}`}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] text-sm font-mono text-[#222225] bg-white focus:border-[#B8934C] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#222225]">
                      Catatan (opsional)
                    </label>
                    <input
                      type="text"
                      value={overrideReasonInput}
                      onChange={(e) => setOverrideReasonInput(e.target.value)}
                      placeholder="Contoh: Permintaan khusus tamu VIP / Wedding venue setup"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] text-xs text-[#222225] bg-white focus:border-[#B8934C] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-[#FAF8F5] border-t border-[#E8E4DC] flex items-center justify-between gap-3">
                {selectedDateRec.overridePriceIdr ? (
                  <button
                    type="button"
                    onClick={handleClearOverride}
                    disabled={isSavingOverride}
                    className="px-4 py-2 rounded-xl border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer disabled:opacity-50"
                  >
                    Kembalikan ke harga sistem
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDateRec(null)}
                    className="px-4 py-2 rounded-xl border border-[#E8E4DC] text-xs font-semibold text-[#717171] hover:bg-white cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveOverride}
                    disabled={isSavingOverride}
                    className="px-5 py-2 rounded-xl bg-[#231F1A] text-white text-xs font-semibold hover:bg-[#19191B] cursor-pointer disabled:opacity-50"
                  >
                    {isSavingOverride ? "Menyimpan..." : "Simpan Harga Manual"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Guardrails & Floor/Ceiling Settings Drawer */}
      {showSettingsDrawer &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm animate-sana-fade-in">
            <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between">
              <div>
                <div className="p-6 border-b border-[#E8E4DC] flex items-center justify-between bg-[#FAF8F5]">
                  <div>
                    <h3 className="text-lg font-semibold text-[#222225]">
                      Batas Harga Aman
                    </h3>
                    <p className="text-xs text-[#717171] mt-0.5">
                      Harga pintar tidak akan pernah keluar dari batas ini.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSettingsDrawer(false)}
                    className="h-8 w-8 rounded-full bg-white border border-[#E8E4DC] flex items-center justify-center text-[#717171] hover:text-[#222225] cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Floor Price */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-xs font-semibold text-[#222225]">
                        Harga terendah per malam
                      </label>
                      <span className="text-xs font-mono font-bold text-[#8C7F5F]">
                        {formatCurrency(editableRules.minPriceIdr, "IDR")}
                      </span>
                    </div>
                    <input
                      type="number"
                      step={50000}
                      value={editableRules.minPriceIdr}
                      onChange={(e) =>
                        setEditableRules({ ...editableRules, minPriceIdr: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] text-sm font-mono text-[#222225] bg-white focus:border-[#B8934C] focus:outline-none"
                    />
                    <p className="text-[11px] text-[#717171]">
                      Harga terendah yang diizinkan untuk mencegah kerugian biaya listrik, laundry, dan staf.
                    </p>
                  </div>

                  {/* Ceiling Price */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-xs font-semibold text-[#222225]">
                        Harga tertinggi per malam
                      </label>
                      <span className="text-xs font-mono font-bold text-[#8C7F5F]">
                        {formatCurrency(editableRules.maxPriceIdr, "IDR")}
                      </span>
                    </div>
                    <input
                      type="number"
                      step={100000}
                      value={editableRules.maxPriceIdr}
                      onChange={(e) =>
                        setEditableRules({ ...editableRules, maxPriceIdr: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] text-sm font-mono text-[#222225] bg-white focus:border-[#B8934C] focus:outline-none"
                    />
                    <p className="text-[11px] text-[#717171]">
                      Batas atas saat musim ramai atau libur nasional.
                    </p>
                  </div>

                  {/* Weekend Surge % */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-xs font-semibold text-[#222225]">
                        Kenaikan akhir pekan
                      </label>
                      <span className="text-xs font-mono font-bold text-[#B8934C]">
                        +{editableRules.weekendSurgePercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      value={editableRules.weekendSurgePercent}
                      onChange={(e) =>
                        setEditableRules({
                          ...editableRules,
                          weekendSurgePercent: Number(e.target.value),
                        })
                      }
                      className="w-full accent-[#B8934C]"
                    />
                  </div>

                  {/* Last Minute Discount % */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-xs font-semibold text-[#222225]">
                        Diskon mendadak (H-2 sebelum check-in)
                      </label>
                      <span className="text-xs font-mono font-bold text-blue-600">
                        -{editableRules.lastMinuteDiscountPercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={editableRules.lastMinuteDiscountPercent}
                      onChange={(e) =>
                        setEditableRules({
                          ...editableRules,
                          lastMinuteDiscountPercent: Number(e.target.value),
                        })
                      }
                      className="w-full accent-blue-600"
                    />
                  </div>

                  {/* Holiday Surge % */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-xs font-semibold text-[#222225]">
                        Kenaikan libur nasional &amp; long weekend
                      </label>
                      <span className="text-xs font-mono font-bold text-purple-600">
                        +{editableRules.holidaySurgePercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={80}
                      value={editableRules.holidaySurgePercent}
                      onChange={(e) =>
                        setEditableRules({
                          ...editableRules,
                          holidaySurgePercent: Number(e.target.value),
                        })
                      }
                      className="w-full accent-purple-600"
                    />
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 bg-[#FAF8F5] border-t border-[#E8E4DC] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSettingsDrawer(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E8E4DC] text-xs font-semibold text-[#717171] hover:bg-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveRules}
                  className="px-6 py-2.5 rounded-xl bg-[#231F1A] text-white text-xs font-semibold hover:bg-[#19191B] cursor-pointer"
                >
                  Simpan Batas Harga
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
