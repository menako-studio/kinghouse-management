"use client"

import { CalendarCheck2, CalendarDays, ChevronDown, Info, Sparkles, Wallet } from "lucide-react"
import type { YieldOutlook } from "@/lib/pricing/types"
import { formatCurrency } from "@/lib/utils"

const idr = (n: number) => formatCurrency(n, "IDR")

function SourceBadge({ kind }: { kind: "airbnb" | "calendar" | "estimate" }) {
  const styles = {
    airbnb: "bg-rose-50 text-rose-700 border-rose-200",
    calendar: "bg-emerald-50 text-emerald-700 border-emerald-200",
    estimate: "bg-[#B8934C]/25 text-[#DFC58E] border-[#B8934C]/40",
  }
  const labels = { airbnb: "Data Airbnb", calendar: "Kalender Airbnb", estimate: "Estimasi sistem" }
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${styles[kind]}`}>
      {labels[kind]}
    </span>
  )
}

function Card({
  icon,
  title,
  badge,
  value,
  caption,
}: {
  icon: React.ReactNode
  title: string
  badge: React.ReactNode
  value: React.ReactNode
  caption: React.ReactNode
}) {
  return (
    <div className="p-5 rounded-3xl bg-white border border-[#E8E4DC] shadow-xs flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        {icon}
        {badge}
      </div>
      <span className="text-sm font-semibold text-[#222225]">{title}</span>
      <div className="text-2xl font-bold text-[#222225] tracking-tight">{value}</div>
      <p className="text-xs text-[#5C5347] leading-relaxed">{caption}</p>
    </div>
  )
}

/** The 60-day outlook in plain language: what Airbnb already paid, what is booked, what smart pricing adds. */
export function YieldSummary({ outlook, propertyName }: { outlook: YieldOutlook; propertyName: string }) {
  const a = outlook.airbnb
  const months = (labels: string[]) =>
    labels.length > 1 ? `${labels[0]}–${labels[labels.length - 1]}` : labels[0] ?? "-"

  return (
    <section className="space-y-4" aria-labelledby="yield-summary-title">
      <div>
        <h2 id="yield-summary-title" className="text-xl font-semibold text-[#222225]">
          Ringkasan {outlook.horizonDays} Hari ke Depan
        </h2>
        <p className="text-xs text-[#717171] mt-0.5">
          {propertyName}. Label <strong className="text-rose-700">Data Airbnb</strong> = angka persis dari laporan
          Earnings Airbnb{a ? ` (diekspor ${new Date(a.exportedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })})` : ""}.
          Label <strong className="text-[#8C7F5F]">Estimasi sistem</strong> = hasil perhitungan, bukan uang yang sudah pasti.
        </p>
      </div>

      {!a && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex gap-2">
          <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>
            Belum ada laporan Earnings Airbnb untuk properti ini, jadi pendapatan dan proyeksi rupiah belum bisa dihitung.
            Yang tampil di bawah hanya kalender dan rekomendasi harga.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {a && (
          <Card
            icon={<Wallet className="h-4 w-4 text-rose-600" />}
            title="Rata-rata pendapatan per bulan"
            badge={<SourceBadge kind="airbnb" />}
            value={idr(a.avgMonthlyIdr)}
            caption={
              <>
                Rata-rata {months(a.runRateMonths)} yang diterima pemilik, sudah dipotong biaya layanan Airbnb.
                {a.fxRateIdr ? ` Akun dibayar dalam JPY, dikonversi Rp ${a.fxRateIdr}/¥.` : ""}
              </>
            }
          />
        )}

        {a && (
          <Card
            icon={<CalendarCheck2 className="h-4 w-4 text-rose-600" />}
            title={`Sudah pasti masuk (${months(a.lockedMonths)})`}
            badge={<SourceBadge kind="airbnb" />}
            value={idr(a.lockedUpcomingIdr)}
            caption="Booking yang sudah terkonfirmasi di Airbnb tapi belum dibayarkan."
          />
        )}

        <Card
          icon={<CalendarDays className="h-4 w-4 text-emerald-600" />}
          title="Kalender 60 hari"
          badge={<SourceBadge kind="calendar" />}
          value={
            <>
              {outlook.bookedNights} <span className="text-sm font-medium text-[#717171]">malam terisi</span> ·{" "}
              {outlook.openNights} <span className="text-sm font-medium text-[#717171]">kosong</span>
            </>
          }
          caption="Malam kosong inilah yang dioptimalkan oleh harga pintar. Malam yang sudah terisi tidak diubah harganya."
        />

        <div className="p-5 rounded-3xl bg-[#231F1A] border border-[#352F27] text-white shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <Sparkles className="h-4 w-4 text-[#B8934C]" />
            <SourceBadge kind="estimate" />
          </div>
          <span className="text-sm font-semibold text-[#DFC58E]">Potensi tambahan harga pintar</span>
          {a && outlook.yieldLiftIdr !== null ? (
            <>
              <div className="text-2xl font-bold tracking-tight">
                +{idr(outlook.yieldLiftIdr)}{" "}
                <span className="text-sm font-semibold text-[#DFC58E]">(+{outlook.yieldLiftPercent}%)</span>
              </div>
              <p className="text-xs text-white/75 leading-relaxed">
                Proyeksi {outlook.horizonDays} hari jadi{" "}
                <strong className="text-[#DFC58E]">{idr(outlook.projectedHorizonIdr ?? 0)}</strong>, dibanding{" "}
                {idr(a.baselineHorizonIdr)} kalau tarif tetap.
              </p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold tracking-tight">
                {outlook.priceUpliftPercent >= 0 ? "+" : ""}
                {outlook.priceUpliftPercent}%
              </div>
              <p className="text-xs text-white/75 leading-relaxed">
                Rata-rata harga pintar di malam kosong dibanding tarif dasar. Rupiahnya muncul setelah laporan Airbnb ditambahkan.
              </p>
            </>
          )}
        </div>
      </div>

      {a && outlook.yieldLiftIdr !== null && (
        <details className="group rounded-2xl border border-[#E8E4DC] bg-[#FAF8F5] open:bg-white">
          <summary className="cursor-pointer list-none p-4 flex items-center justify-between text-sm font-semibold text-[#222225]">
            <span className="flex items-center gap-2">
              <Info className="h-4 w-4 text-[#B8934C]" />
              Bagaimana angka ini dihitung?
            </span>
            <ChevronDown className="h-4 w-4 text-[#717171] transition-transform group-open:rotate-180" />
          </summary>
          <ol className="px-4 pb-4 space-y-3 text-xs text-[#5C5347] leading-relaxed list-decimal list-inside">
            <li>
              Rata-rata pendapatan Airbnb {months(a.runRateMonths)} adalah <strong>{idr(a.avgMonthlyIdr)}</strong> per bulan.
              Untuk {outlook.horizonDays} hari, itu sekitar <strong>{idr(a.baselineHorizonIdr)}</strong> kalau tarif dibiarkan tetap.
            </li>
            <li>
              Dari jumlah itu, <strong>{idr(a.lockedUpcomingIdr)}</strong> sudah terkunci lewat booking{" "}
              {months(a.lockedMonths)}. Sisanya <strong>{idr(a.remainingToSellIdr)}</strong> masih harus dijual.
            </li>
            <li>
              Di malam yang masih kosong, harga pintar rata-rata <strong>{outlook.priceUpliftPercent}%</strong> di atas tarif dasar.
              Karena harga lebih tinggi bisa membuat sebagian tamu batal memesan, sistem hanya menghitung{" "}
              <strong>{Math.round(outlook.realizationFactor * 100)}%</strong> dari kenaikan itu:{" "}
              {idr(a.remainingToSellIdr)} × {outlook.priceUpliftPercent}% × {Math.round(outlook.realizationFactor * 100)}% ={" "}
              <strong>+{idr(outlook.yieldLiftIdr)}</strong>.
            </li>
            <li>
              Proyeksi = sudah terkunci + sisa yang dijual + tambahan harga pintar ={" "}
              <strong>{idr(outlook.projectedHorizonIdr ?? 0)}</strong>.
            </li>
          </ol>
        </details>
      )}
    </section>
  )
}
