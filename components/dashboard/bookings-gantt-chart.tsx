"use client"

import { useState, useMemo } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Phone,
  Layers,
  Sparkles,
  Info,
  X,
  Building2,
  DollarSign,
} from "lucide-react"
import { Reservation, ChannelType } from "@/lib/erp/types"
import { CURATED_VILLAS } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"

interface BookingsGanttChartProps {
  reservations: Reservation[]
}

const CHANNEL_STYLES: Record<
  ChannelType | string,
  { bg: string; border: string; text: string; dot: string; label: string }
> = {
  Airbnb: {
    bg: "bg-rose-500/20 hover:bg-rose-500/30",
    border: "border-rose-500/40",
    text: "text-rose-200",
    dot: "bg-rose-400",
    label: "Airbnb",
  },
  "Direct WhatsApp": {
    bg: "bg-emerald-500/20 hover:bg-emerald-500/30",
    border: "border-emerald-500/40",
    text: "text-emerald-200",
    dot: "bg-emerald-400",
    label: "Direct WA",
  },
  "Booking.com": {
    bg: "bg-blue-500/20 hover:bg-blue-500/30",
    border: "border-blue-500/40",
    text: "text-blue-200",
    dot: "bg-blue-400",
    label: "Booking.com",
  },
  Agoda: {
    bg: "bg-indigo-500/20 hover:bg-indigo-500/30",
    border: "border-indigo-500/40",
    text: "text-indigo-200",
    dot: "bg-indigo-400",
    label: "Agoda",
  },
  "Walk-in": {
    bg: "bg-amber-500/20 hover:bg-amber-500/30",
    border: "border-amber-500/40",
    text: "text-amber-200",
    dot: "bg-amber-400",
    label: "Walk-in",
  },
}

export function BookingsGanttChart({ reservations }: BookingsGanttChartProps) {
  // Calendar View Month State (Defaults to August 2026 or Current Month)
  const [viewDate, setViewDate] = useState(() => new Date(2026, 7, 1)) // August 2026 (0-indexed month)
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  // Days in month
  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate()
  }, [year, month])

  const daysArray = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1)
      const dayOfWeek = date.toLocaleDateString("id-ID", { weekday: "narrow" })
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`
      return {
        dayNumber: i + 1,
        dayOfWeek,
        isWeekend,
        dateStr,
      }
    })
  }, [year, month, daysInMonth])

  const monthLabel = useMemo(() => {
    return viewDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })
  }, [viewDate])

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const handleToday = () => {
    setViewDate(new Date(2026, 7, 1))
  }

  return (
    <div className="rounded-3xl border border-stone-800 bg-stone-950/90 p-6 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-5 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20 mb-2">
            <Calendar className="h-3.5 w-3.5" />
            Front-Desk Calendar Timeline (Little Hotelier Style)
          </div>
          <h3 className="text-xl font-bold text-stone-100 font-serif">
            Visual Room Turnover & Occupancy Gantt
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Pantau jadwal check-in, turnover kamar, dan ketersediaan unit antar seluruh properti Jabodetabek secara visual.
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handlePrevMonth}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-800 bg-stone-900 text-stone-300 hover:bg-stone-800 hover:text-white transition-colors active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[140px] text-center text-sm font-bold text-stone-100 font-mono">
            {monthLabel}
          </span>
          <button
            onClick={handleNextMonth}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-800 bg-stone-900 text-stone-300 hover:bg-stone-800 hover:text-white transition-colors active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={handleToday}
            className="rounded-xl border border-stone-800 bg-stone-900 px-3 py-2 text-xs font-semibold text-stone-300 hover:bg-stone-800 hover:text-white transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Gantt Timeline Grid */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[960px]">
          {/* Header Row: Days */}
          <div className="grid grid-cols-[220px_repeat(31,minmax(28px,1fr))] gap-1 border-b border-stone-800 pb-3 mb-2 text-center text-[11px]">
            <div className="text-left font-semibold text-stone-400 pl-2">
              Properti / Unit
            </div>
            {daysArray.map((d) => (
              <div
                key={d.dayNumber}
                className={`flex flex-col items-center justify-center rounded-lg py-1 ${
                  d.isWeekend
                    ? "bg-stone-900/60 text-amber-400/80 font-medium"
                    : "text-stone-400"
                }`}
              >
                <span className="text-[10px] text-stone-400">{d.dayOfWeek}</span>
                <span className="text-xs font-bold text-stone-200">{d.dayNumber}</span>
              </div>
            ))}
          </div>

          {/* Property Rows */}
          <div className="space-y-3">
            {CURATED_VILLAS.map((villa) => {
              // Filter reservations for this villa
              const villaRes = reservations.filter(
                (r) =>
                  (r.propertySlug === villa.slug || r.propertyId === villa.id) &&
                  r.status !== "Cancelled"
              )

              return (
                <div
                  key={villa.id}
                  className="relative grid grid-cols-[220px_repeat(31,minmax(28px,1fr))] gap-1 items-center rounded-2xl border border-stone-800/70 bg-stone-900/30 p-2 hover:border-stone-700 transition-colors"
                >
                  {/* Property Title Column */}
                  <div className="pr-3 pl-1">
                    <div className="text-xs font-bold text-stone-100 truncate" title={villa.name}>
                      {villa.name}
                    </div>
                    <div className="text-[10px] text-stone-400 truncate">
                      {villa.location} • {villa.capacity.guests} Tamu
                    </div>
                  </div>

                  {/* Day Cells Background */}
                  {daysArray.map((d) => (
                    <div
                      key={d.dayNumber}
                      className={`h-12 rounded-lg border border-dashed border-stone-800/40 ${
                        d.isWeekend ? "bg-stone-950/40" : "bg-transparent"
                      }`}
                    />
                  ))}

                  {/* Absolute Positioned Reservation Bars */}
                  {villaRes.map((res) => {
                    const checkInDate = new Date(res.checkIn)
                    const checkOutDate = new Date(res.checkOut)

                    // Check if reservation overlaps with currently viewed month
                    const startOfMonth = new Date(year, month, 1)
                    const endOfMonth = new Date(year, month, daysInMonth)

                    if (checkOutDate < startOfMonth || checkInDate > endOfMonth) {
                      return null
                    }

                    // Calculate start and span within this month
                    const startDay = Math.max(1, checkInDate.getMonth() === month ? checkInDate.getDate() : 1)
                    const endDay = Math.min(
                      daysInMonth,
                      checkOutDate.getMonth() === month ? checkOutDate.getDate() : daysInMonth
                    )
                    const spanDays = Math.max(1, endDay - startDay + 1)

                    const style = CHANNEL_STYLES[res.channel] || CHANNEL_STYLES["Airbnb"]

                    // Compute grid column position:
                    // Column 1 is property title (220px), so Day 1 starts at grid-column 2
                    const gridColStart = startDay + 1
                    const gridColSpan = spanDays

                    return (
                      <button
                        key={res.id}
                        onClick={() => setSelectedRes(res)}
                        style={{
                          gridColumn: `${gridColStart} / span ${gridColSpan}`,
                        }}
                        className={`group absolute z-10 mx-0.5 flex h-9 items-center justify-between overflow-hidden rounded-xl border px-2.5 py-1 text-left text-xs font-semibold shadow-md transition-all hover:z-20 hover:scale-[1.02] active:scale-95 ${style.bg} ${style.border} ${style.text}`}
                        title={`${res.guestName} (${res.channel}): ${res.checkIn} → ${res.checkOut}`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className={`h-2 w-2 rounded-full ${style.dot} shrink-0`} />
                          <span className="truncate text-[11px] font-bold">
                            {res.guestName}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono opacity-80 shrink-0 ml-1">
                          {res.nights}m
                        </span>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend & Summary */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-stone-800/80 pt-4 text-xs text-stone-400">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-stone-300">Channel OTA:</span>
          {Object.entries(CHANNEL_STYLES).map(([channel, val]) => (
            <div key={channel} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${val.dot}`} />
              <span>{val.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-stone-400">
          <Info className="h-3.5 w-3.5 text-amber-400" />
          <span>Klik bar reservasi untuk melihat rincian tamu & pembagian komisi.</span>
        </div>
      </div>

      {/* Selected Reservation Detail Modal */}
      {selectedRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-stone-800 bg-stone-950 p-6 shadow-2xl">
            <button
              onClick={() => setSelectedRes(null)}
              className="absolute right-4 top-4 rounded-full bg-stone-900 p-1.5 text-stone-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                    CHANNEL_STYLES[selectedRes.channel]?.bg || "bg-stone-800"
                  } ${CHANNEL_STYLES[selectedRes.channel]?.text || "text-stone-300"} ${
                    CHANNEL_STYLES[selectedRes.channel]?.border || "border-stone-700"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      CHANNEL_STYLES[selectedRes.channel]?.dot || "bg-stone-400"
                    }`}
                  />
                  {selectedRes.channel}
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  {selectedRes.id}
                </span>
              </div>
              <h4 className="text-lg font-bold text-stone-100 font-serif">
                {selectedRes.guestName}
              </h4>
              <p className="text-xs text-stone-400">{selectedRes.propertyName}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
              <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
                <div className="text-stone-400">Jadwal Menginap</div>
                <div className="font-semibold text-stone-200 mt-0.5">
                  {selectedRes.checkIn} → {selectedRes.checkOut}
                </div>
                <div className="text-[11px] text-amber-400 mt-0.5 font-medium">
                  {selectedRes.nights} Malam • {selectedRes.guests} Tamu
                </div>
              </div>

              <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
                <div className="text-stone-400">Status Reservasi</div>
                <div className="font-bold text-emerald-400 mt-0.5">
                  {selectedRes.status}
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  Tier: {selectedRes.feeTier === "premium" ? "20% Premium" : "15% Standard"}
                </div>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-4 mb-4 text-xs space-y-2">
              <div className="flex justify-between text-stone-300">
                <span>Gross Payout (Nilai Sewa)</span>
                <span className="font-semibold text-stone-100 font-mono">
                  {formatCurrency(selectedRes.grossPayoutIdr)}
                </span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Komisi Kinghouse ({selectedRes.managementFeePercent}%)</span>
                <span className="font-mono text-amber-400">
                  - {formatCurrency(selectedRes.managementFeeIdr)}
                </span>
              </div>
              <div className="flex justify-between border-t border-stone-800 pt-2 text-stone-200 font-bold">
                <span>Bagi Hasil Pemilik (Net Payout)</span>
                <span className="font-mono text-emerald-400 text-sm">
                  {formatCurrency(selectedRes.netOwnerPayoutIdr)}
                </span>
              </div>
            </div>

            {selectedRes.notes && (
              <div className="text-xs text-stone-400 mb-4 bg-stone-900/30 p-2.5 rounded-xl border border-stone-800/60">
                <span className="font-semibold text-stone-300">Catatan: </span>
                {selectedRes.notes}
              </div>
            )}

            <button
              onClick={() => setSelectedRes(null)}
              className="w-full rounded-xl bg-stone-800 py-2.5 text-xs font-semibold text-stone-200 hover:bg-stone-700 transition-colors"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
