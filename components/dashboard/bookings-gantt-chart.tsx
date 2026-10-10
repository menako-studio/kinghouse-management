"use client"

import { useState, useMemo, useEffect } from "react"
import { createPortal } from "react-dom"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  Info,
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
    bg: "bg-rose-50 hover:bg-rose-100",
    border: "border-rose-300",
    text: "text-rose-900",
    dot: "bg-rose-500",
    label: "Airbnb",
  },
  "Direct WhatsApp": {
    bg: "bg-emerald-50 hover:bg-emerald-100",
    border: "border-emerald-300",
    text: "text-emerald-900",
    dot: "bg-emerald-500",
    label: "Direct WA",
  },
  "Booking.com": {
    bg: "bg-blue-50 hover:bg-blue-100",
    border: "border-blue-300",
    text: "text-blue-900",
    dot: "bg-blue-500",
    label: "Booking.com",
  },
  Agoda: {
    bg: "bg-indigo-50 hover:bg-indigo-100",
    border: "border-indigo-300",
    text: "text-indigo-900",
    dot: "bg-indigo-500",
    label: "Agoda",
  },
  "Walk-in": {
    bg: "bg-amber-50 hover:bg-amber-100",
    border: "border-amber-300",
    text: "text-amber-900",
    dot: "bg-amber-500",
    label: "Walk-in",
  },
}

export function BookingsGanttChart({ reservations }: BookingsGanttChartProps) {
  const [mounted, setMounted] = useState(false)
  const [viewDate, setViewDate] = useState(() => new Date(2026, 7, 1)) // August 2026
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

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
    <div className="rounded-3xl border border-[#E8E4DC] bg-white p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] overflow-hidden text-[#222225]">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4DC] pb-5 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FAF8F5] px-3 py-1 text-xs font-semibold text-[#8C7F5F] border border-[#E8E4DC] mb-2">
            <Calendar className="h-3.5 w-3.5 text-[#B8934C]" />
            <span>Front-Desk Calendar Timeline</span>
          </div>
          <h3 className="text-xl font-semibold text-[#222225]">
            Visual Room Turnover & Occupancy Gantt
          </h3>
          <p className="text-xs text-[#6B6862] mt-1 font-light">
            Pantau jadwal check-in, turnover kamar, dan ketersediaan unit antar seluruh properti Jabodetabek secara visual.
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E4DC] bg-white text-[#222225] hover:bg-[#FAF8F5] transition-colors active:scale-95 cursor-pointer shadow-xs"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[140px] text-center text-xs font-bold text-[#222225] font-mono">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E4DC] bg-white text-[#222225] hover:bg-[#FAF8F5] transition-colors active:scale-95 cursor-pointer shadow-xs"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleToday}
            className="rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] px-3 py-2 text-xs font-semibold text-[#222225] hover:bg-[#F3EFE6] transition-colors cursor-pointer"
          >
            Bulan Ini
          </button>
        </div>
      </div>

      {/* Gantt Timeline Grid */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[960px]">
          {/* Header Row: Days */}
          <div className="grid grid-cols-[220px_repeat(31,minmax(28px,1fr))] gap-1 border-b border-[#E8E4DC] pb-3 mb-2 text-center text-[11px]">
            <div className="text-left font-semibold text-[#6B6862] pl-2 uppercase tracking-wider text-[10px]">
              Properti / Unit
            </div>
            {daysArray.map((d) => (
              <div
                key={d.dayNumber}
                className={`flex flex-col items-center justify-center rounded-lg py-1 ${
                  d.isWeekend
                    ? "bg-[#FAF8F5] text-[#8C7F5F] font-bold"
                    : "text-[#6B6862]"
                }`}
              >
                <span className="text-[10px] text-[#6B6862]">{d.dayOfWeek}</span>
                <span className="text-xs font-semibold">{d.dayNumber}</span>
              </div>
            ))}
          </div>

          {/* Property Rows */}
          <div className="space-y-3">
            {CURATED_VILLAS.map((villa) => {
              const villaRes = reservations.filter(
                (r) =>
                  (r.propertySlug === villa.slug || r.propertyId === villa.id) &&
                  r.status !== "Cancelled"
              )

              return (
                <div
                  key={villa.id}
                  className="relative grid grid-cols-[220px_repeat(31,minmax(28px,1fr))] gap-1 items-center rounded-2xl border border-[#E8E4DC] bg-[#FAF8F5]/40 p-2 hover:bg-[#FAF8F5]/80 transition-colors"
                >
                  {/* Property Title Column */}
                  <div className="pr-3 pl-1">
                    <div className="text-xs font-semibold text-[#222225] truncate" title={villa.name}>
                      {villa.name}
                    </div>
                    <div className="text-[10px] text-[#8C7F5F] truncate">
                      {villa.location} &bull; {villa.capacity.guests} Tamu
                    </div>
                  </div>

                  {/* Day Cells Background */}
                  {daysArray.map((d) => (
                    <div
                      key={d.dayNumber}
                      className={`h-11 rounded-lg border border-dashed border-[#E8E4DC]/60 ${
                        d.isWeekend ? "bg-[#FAF8F5]" : "bg-transparent"
                      }`}
                    />
                  ))}

                  {/* Absolute Positioned Reservation Bars */}
                  {villaRes.map((res) => {
                    const checkInDate = new Date(res.checkIn)
                    const checkOutDate = new Date(res.checkOut)

                    const startOfMonth = new Date(year, month, 1)
                    const endOfMonth = new Date(year, month, daysInMonth)

                    if (checkOutDate < startOfMonth || checkInDate > endOfMonth) {
                      return null
                    }

                    const startDay = Math.max(1, checkInDate.getMonth() === month ? checkInDate.getDate() : 1)
                    const endDay = Math.min(
                      daysInMonth,
                      checkOutDate.getMonth() === month ? checkOutDate.getDate() : daysInMonth
                    )
                    const spanDays = Math.max(1, endDay - startDay + 1)

                    const style = CHANNEL_STYLES[res.channel] || CHANNEL_STYLES["Airbnb"]
                    const gridColStart = startDay + 1
                    const gridColSpan = spanDays

                    return (
                      <button
                        key={res.id}
                        type="button"
                        onClick={() => setSelectedRes(res)}
                        style={{
                          gridColumn: `${gridColStart} / span ${gridColSpan}`,
                        }}
                        className={`group absolute z-10 mx-0.5 flex h-9 items-center justify-between overflow-hidden rounded-xl border px-2.5 py-1 text-left text-xs font-semibold shadow-xs transition-all hover:z-20 hover:scale-[1.01] active:scale-95 cursor-pointer ${style.bg} ${style.border} ${style.text}`}
                        title={`${res.guestName} (${res.channel}): ${res.checkIn} → ${res.checkOut}`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className={`h-2 w-2 rounded-full ${style.dot} shrink-0`} />
                          <span className="truncate text-[11px] font-semibold">
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
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#E8E4DC] pt-4 text-xs text-[#6B6862]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-[#222225]">Saluran OTA:</span>
          {Object.entries(CHANNEL_STYLES).map(([channel, val]) => (
            <div key={channel} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${val.dot}`} />
              <span className="text-[11px]">{val.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#8C7F5F]">
          <Info className="h-3.5 w-3.5" />
          <span>Klik bar reservasi untuk memeriksa rincian tamu & bagi hasil komisi.</span>
        </div>
      </div>

      {/* Selected Reservation Detail Modal (via Portal) */}
      {mounted && selectedRes && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-[#E8E4DC] bg-white p-6 sm:p-7 shadow-2xl text-[#222225]">
            <button
              type="button"
              onClick={() => setSelectedRes(null)}
              className="absolute right-4 top-4 rounded-full bg-[#FAF8F5] border border-[#E8E4DC] p-1.5 text-[#6B6862] hover:text-[#222225] transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                    CHANNEL_STYLES[selectedRes.channel]?.bg || "bg-stone-100"
                  } ${CHANNEL_STYLES[selectedRes.channel]?.text || "text-stone-800"} ${
                    CHANNEL_STYLES[selectedRes.channel]?.border || "border-stone-300"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      CHANNEL_STYLES[selectedRes.channel]?.dot || "bg-stone-500"
                    }`}
                  />
                  {selectedRes.channel}
                </span>
                <span className="text-xs text-[#6B6862] font-mono">
                  {selectedRes.id}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-[#222225]">
                {selectedRes.guestName}
              </h4>
              <p className="text-xs text-[#6B6862]">{selectedRes.propertyName}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
              <div className="rounded-2xl border border-[#E8E4DC] bg-[#FAF8F5] p-3">
                <div className="text-[10px] uppercase font-semibold text-[#6B6862]">Jadwal Menginap</div>
                <div className="font-semibold text-[#222225] mt-0.5">
                  {selectedRes.checkIn} &rarr; {selectedRes.checkOut}
                </div>
                <div className="text-[11px] text-[#8C7F5F] mt-0.5 font-medium">
                  {selectedRes.nights} Malam &bull; {selectedRes.guests} Tamu
                </div>
              </div>

              <div className="rounded-2xl border border-[#E8E4DC] bg-[#FAF8F5] p-3">
                <div className="text-[10px] uppercase font-semibold text-[#6B6862]">Status Reservasi</div>
                <div className="font-bold text-emerald-700 mt-0.5">
                  {selectedRes.status}
                </div>
                <div className="text-[11px] text-[#6B6862] mt-0.5">
                  Tier: {selectedRes.feeTier === "premium" ? "20% Premium" : "15% Standard"}
                </div>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="rounded-2xl border border-[#E8E4DC] bg-[#FAF8F5]/80 p-4 mb-4 text-xs space-y-2">
              <div className="flex justify-between text-[#222225]">
                <span>Gross Payout (Nilai Sewa)</span>
                <span className="font-semibold font-mono">
                  {formatCurrency(selectedRes.grossPayoutIdr)}
                </span>
              </div>
              <div className="flex justify-between text-[#6B6862]">
                <span>Komisi Kinghouse ({selectedRes.managementFeePercent}%)</span>
                <span className="font-mono text-[#8C7F5F]">
                  - {formatCurrency(selectedRes.managementFeeIdr)}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#E8E4DC] pt-2 text-[#222225] font-bold">
                <span>Bagi Hasil Pemilik (Net Payout)</span>
                <span className="font-mono text-emerald-700 text-sm">
                  {formatCurrency(selectedRes.netOwnerPayoutIdr)}
                </span>
              </div>
            </div>

            {selectedRes.notes && (
              <div className="text-xs text-[#6B6862] mb-4 bg-[#FAF8F5] p-3 rounded-2xl border border-[#E8E4DC]">
                <strong className="text-[#222225]">Catatan: </strong>
                {selectedRes.notes}
              </div>
            )}

            <button
              type="button"
              onClick={() => setSelectedRes(null)}
              className="w-full rounded-2xl bg-[#222225] py-2.5 text-xs font-semibold text-white hover:bg-[#19191B] transition-colors cursor-pointer shadow-xs"
            >
              Tutup Rincian
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

