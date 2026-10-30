"use client"

import type { AirbnbRunRate } from "@/lib/pricing/types"
import { formatCurrency } from "@/lib/utils"

/** "Rp 56,2 jt" style label for bar tops. */
function shortIdr(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`
  if (n >= 1_000) return `${Math.round(n / 1_000)} rb`
  return n > 0 ? String(n) : "–"
}

/** Monthly Airbnb payouts: paid (solid) and confirmed-but-not-paid (light), months used for the average outlined. */
export function AirbnbEarningsChart({ data }: { data: AirbnbRunRate }) {
  const max = Math.max(1, ...data.months.map((p) => p.totalIdr))
  const year = data.months[0]?.month.slice(0, 4)

  return (
    <section className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E8E4DC] shadow-xs space-y-4" aria-labelledby="airbnb-chart-title">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 id="airbnb-chart-title" className="text-base font-semibold text-[#222225]">
            Pendapatan Bulanan dari Airbnb ({year})
          </h2>
          <p className="text-xs text-[#717171] mt-0.5">
            Sama persis dengan laporan Earnings Airbnb{data.listings.length > 1 ? ` (gabungan ${data.listings.join(" + ")})` : ""}.
            {data.fxRateIdr ? ` Dikonversi dari JPY dengan kurs Rp ${data.fxRateIdr}/¥.` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#5C5347]">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" /> Sudah dibayar
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-rose-200" /> Booking terkonfirmasi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm border-2 border-[#B8934C]" /> Dipakai untuk rata-rata
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[560px] grid grid-cols-12 gap-2 items-end h-56">
          {data.months.map((p) => {
            const inRunRate = data.runRateMonths.includes(p.label)
            const barPct = (p.totalIdr / max) * 100
            return (
              <div key={p.month} className="flex flex-col items-center h-full justify-end gap-1">
                <span className="text-[10px] font-semibold text-[#222225] whitespace-nowrap">{shortIdr(p.totalIdr)}</span>
                <div
                  className="w-full flex-1 flex flex-col justify-end"
                  title={`${p.label}: dibayar ${formatCurrency(p.paidIdr, "IDR")}, terkonfirmasi ${formatCurrency(p.upcomingIdr, "IDR")}`}
                >
                  {p.totalIdr > 0 && (
                    <div
                      className={`w-full flex flex-col rounded-md overflow-hidden ${inRunRate ? "ring-2 ring-[#B8934C] ring-offset-2" : ""}`}
                      style={{ height: `${barPct}%` }}
                    >
                      {p.upcomingIdr > 0 && <div className="w-full bg-rose-200" style={{ flexGrow: p.upcomingIdr }} />}
                      {p.paidIdr > 0 && <div className="w-full bg-rose-500" style={{ flexGrow: p.paidIdr }} />}
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-[#717171]">{p.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
