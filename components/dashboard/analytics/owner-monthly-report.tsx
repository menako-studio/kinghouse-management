"use client"

import { useMemo, useState } from "react"
import { CopyPlus, FileText, Info, Plus, Save } from "lucide-react"
import { CURATED_VILLAS } from "@/lib/data"
import type { ExpenseCategory, ExpenseRecord } from "@/lib/erp/types"
import {
  buildOwnerMonthlyReport,
  expensesForProperty,
  FIXED_COST_CATEGORY,
  FIXED_COST_TEMPLATE,
  operatingCostTemplate,
  reportMonths,
  type CostTemplateItem,
} from "@/lib/earnings/owner-report"
import { formatCurrency } from "@/lib/utils"

const idr = (n: number) => formatCurrency(n, "IDR")
const MONTHS_ID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
const monthName = (m: string) => `${MONTHS_ID[Number(m.slice(5, 7)) - 1]} ${m.slice(0, 4)}`
const prevMonth = (m: string) => {
  const d = new Date(Number(m.slice(0, 4)), Number(m.slice(5, 7)) - 2, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}
const rowKey = (category: ExpenseCategory, name: string) => `${category}|${name}`

function Line({ label, value, minus, strong, muted }: { label: React.ReactNode; value: number; minus?: boolean; strong?: boolean; muted?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-4 py-2 ${strong ? "font-semibold text-[#222225]" : muted ? "text-[#8C8C8C]" : "text-[#5C5347]"}`}>
      <span className="text-sm">{label}</span>
      <span className={`text-sm tabular-nums whitespace-nowrap ${minus ? "text-rose-700" : ""}`}>
        {minus && value > 0 ? "− " : ""}
        {idr(value)}
      </span>
    </div>
  )
}

/**
 * The statement the owner gets at month end: Airbnb's exact payout for the month,
 * minus the Kinghouse fee, operating costs and fixed costs. Costs are entered here
 * from ready-made templates and saved as ERP expense records.
 */
export function OwnerMonthlyReport({ expenses, onSaved }: { expenses: ExpenseRecord[]; onSaved: () => Promise<void> }) {
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const [slug, setSlug] = useState(CURATED_VILLAS[0].slug)
  const villa = CURATED_VILLAS.find((v) => v.slug === slug) ?? CURATED_VILLAS[0]
  const months = reportMonths(slug, currentMonth)
  const [month, setMonth] = useState(months[0])
  const activeMonth = months.includes(month) ? month : months[0]

  const propertyExpenses = useMemo(() => expensesForProperty(expenses, slug, villa.id), [expenses, slug, villa.id])
  const report = buildOwnerMonthlyReport(slug, activeMonth, propertyExpenses)

  const fixedRows = FIXED_COST_TEMPLATE
  const opRows = operatingCostTemplate(slug)
  const savedAmounts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const c of [...report.operatingCosts, ...report.fixedCosts]) map[rowKey(c.category, c.name)] = (map[rowKey(c.category, c.name)] ?? 0) + c.amountIdr
    return map
  }, [report.operatingCosts, report.fixedCosts])

  // Typed values per row; untouched rows show what is saved for the month
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [extraRows, setExtraRows] = useState<CostTemplateItem[]>([])
  const [newName, setNewName] = useState("")
  const [newIsFixed, setNewIsFixed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const savedExtra = [...report.operatingCosts, ...report.fixedCosts]
    .filter((c) => ![...fixedRows, ...opRows].some((t) => t.name === c.name && t.category === c.category))
    .map((c) => ({ name: c.name, category: c.category, hint: "Item tambahan" }))
  const allExtra = [...savedExtra, ...extraRows.filter((r) => !savedExtra.some((s) => s.name === r.name && s.category === r.category))]

  const valueOf = (t: CostTemplateItem) => {
    const k = rowKey(t.category, t.name)
    return k in draft ? draft[k] : savedAmounts[k] ? String(savedAmounts[k]) : ""
  }
  const resetFor = (nextSlug: string, nextMonth: string) => {
    setSlug(nextSlug)
    setMonth(nextMonth)
    setDraft({})
    setExtraRows([])
    setMessage(null)
  }

  const copyFixedFromLastMonth = () => {
    const last = buildOwnerMonthlyReport(slug, prevMonth(activeMonth), propertyExpenses)
    if (last.fixedCosts.length === 0) {
      setMessage(`Belum ada fixed cost di ${monthName(prevMonth(activeMonth))} untuk disalin.`)
      return
    }
    const next = { ...draft }
    const added: CostTemplateItem[] = []
    for (const c of last.fixedCosts) {
      next[rowKey(c.category, c.name)] = String(c.amountIdr)
      if (!fixedRows.some((t) => t.name === c.name)) added.push({ name: c.name, category: c.category, hint: "Item tambahan" })
    }
    setDraft(next)
    setExtraRows([...extraRows, ...added])
    setMessage(`Fixed cost ${monthName(prevMonth(activeMonth))} disalin. Cek lalu klik Simpan.`)
  }

  const save = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const rows = [...fixedRows, ...opRows, ...allExtra]
      for (const t of rows) {
        const k = rowKey(t.category, t.name)
        if (!(k in draft)) continue
        const amount = Number(draft[k].replace(/\D/g, "")) || 0
        if (amount === (savedAmounts[k] ?? 0)) continue
        const existing = [...report.operatingCosts, ...report.fixedCosts].filter((c) => c.name === t.name && c.category === t.category)
        for (const c of existing) await fetch(`/api/erp/expenses?id=${encodeURIComponent(c.id)}`, { method: "DELETE" })
        if (amount > 0) {
          const res = await fetch("/api/erp/expenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              propertyId: villa.id,
              propertyName: villa.name,
              category: t.category,
              description: t.name,
              amountIdr: amount,
              date: `${activeMonth}-01`,
              recordedBy: "Laporan Bulanan",
            }),
          })
          if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Gagal menyimpan")
        }
      }
      await onSaved()
      setDraft({})
      setExtraRows([])
      setMessage("Biaya tersimpan. Laporan sudah diperbarui.")
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Gagal menyimpan biaya.")
    } finally {
      setSaving(false)
    }
  }

  const addRow = () => {
    const name = newName.trim()
    if (name.length < 3) return
    setExtraRows([...extraRows, { name, category: newIsFixed ? FIXED_COST_CATEGORY : "Maintenance & Repairs", hint: "Item tambahan" }])
    setNewName("")
  }

  const costInputs = (title: string, desc: string, rows: CostTemplateItem[]) => (
    <div className="space-y-2">
      <div>
        <h4 className="text-sm font-semibold text-[#222225]">{title}</h4>
        <p className="text-xs text-[#717171]">{desc}</p>
      </div>
      {rows.map((t) => {
        const k = rowKey(t.category, t.name)
        return (
          <label key={k} className="flex items-center gap-3 rounded-xl border border-[#E8E4DC] bg-white px-3 py-2">
            <span className="flex-1 min-w-0">
              <span className="block text-xs font-semibold text-[#222225]">{t.name}</span>
              <span className="block text-[11px] text-[#8C8C8C] truncate">{t.hint}</span>
            </span>
            <span className="text-xs text-[#717171]">Rp</span>
            <input
              inputMode="numeric"
              value={valueOf(t)}
              onChange={(e) => setDraft({ ...draft, [k]: e.target.value.replace(/[^\d]/g, "") })}
              placeholder="0"
              aria-label={`Biaya ${t.name}`}
              className="w-32 px-2.5 py-1.5 rounded-lg border border-[#E8E4DC] text-sm text-right tabular-nums focus:border-[#B8934C] focus:outline-none"
            />
          </label>
        )
      })}
    </div>
  )

  const noCosts = report.operatingCosts.length === 0 && report.fixedCosts.length === 0

  return (
    <section className="space-y-5" aria-labelledby="owner-report-title">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 id="owner-report-title" className="text-xl font-semibold text-[#222225] flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#B8934C]" />
            Laporan Bulanan Pemilik
          </h2>
          <p className="text-xs text-[#717171] mt-1 max-w-2xl">
            Pendapatan bulan ini persis dari Airbnb, lalu dikurangi fee Kinghouse dan biaya-biaya. Inilah yang dilaporkan ke pemilik
            setiap akhir bulan.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={slug}
            onChange={(e) => resetFor(e.target.value, reportMonths(e.target.value, currentMonth)[0])}
            aria-label="Pilih properti"
            className="px-3 py-2 rounded-xl border border-[#E8E4DC] bg-white text-sm text-[#222225]"
          >
            {CURATED_VILLAS.map((v) => (
              <option key={v.slug} value={v.slug}>
                {v.name}
              </option>
            ))}
          </select>
          <select
            value={activeMonth}
            onChange={(e) => resetFor(slug, e.target.value)}
            aria-label="Pilih bulan"
            className="px-3 py-2 rounded-xl border border-[#E8E4DC] bg-white text-sm text-[#222225]"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {monthName(m)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Statement */}
        <div className="xl:col-span-3 p-6 rounded-3xl bg-white border border-[#E8E4DC] shadow-xs">
          <div className="flex items-start justify-between gap-3 border-b border-[#F0ECE4] pb-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#8C7F5F] font-semibold">{monthName(activeMonth)}</div>
              <div className="text-base font-semibold text-[#222225]">{villa.name}</div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-rose-50 text-rose-700 border-rose-200 whitespace-nowrap">
              Pendapatan: Data Airbnb
            </span>
          </div>

          {!report.hasAirbnbData ? (
            <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex gap-2">
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              Belum ada laporan Earnings Airbnb untuk properti ini, jadi pendapatan bulanannya belum bisa ditampilkan.
            </div>
          ) : (
            <div className="divide-y divide-[#F5F2EC]">
              <div className="py-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#8C7F5F] pt-2">1. Pendapatan dari Airbnb</div>
                {report.airbnbBreakdown ? (
                  <>
                    <Line label="Dibayar tamu (sebelum potongan Airbnb)" value={report.airbnbBreakdown.grossIdr} />
                    <Line label="Potongan biaya layanan Airbnb" value={report.airbnbBreakdown.serviceFeeIdr} minus />
                    {report.airbnbBreakdown.adjustmentsIdr !== 0 && <Line label="Penyesuaian Airbnb" value={report.airbnbBreakdown.adjustmentsIdr} />}
                    {report.airbnbBreakdown.taxesIdr !== 0 && <Line label="Pajak dipotong Airbnb" value={report.airbnbBreakdown.taxesIdr} minus />}
                    <Line label="Sudah ditransfer Airbnb" value={report.paidIdr} strong />
                  </>
                ) : (
                  <Line label="Sudah ditransfer Airbnb (sudah dipotong biaya layanan Airbnb)" value={report.paidIdr} />
                )}
                {report.upcomingIdr > 0 && <Line label="Booking bulan ini, belum ditransfer" value={report.upcomingIdr} />}
                <Line label="Total pendapatan bulan ini" value={report.payoutIdr} strong />
                {report.fxRateIdr && (
                  <p className="text-[11px] text-[#8C8C8C] pb-1">Akun ini dibayar dalam JPY, dikonversi Rp {report.fxRateIdr}/¥.</p>
                )}
              </div>

              <div className="py-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#8C7F5F] pt-2">2. Fee Kinghouse</div>
                <Line label={`${report.feePercent}% dari pendapatan Airbnb`} value={report.feeIdr} minus />
              </div>

              <div className="py-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#8C7F5F] pt-2">3. Biaya operasional</div>
                {report.operatingCosts.length === 0 && <Line label="Belum diisi" value={0} muted />}
                {report.operatingCosts.map((c) => (
                  <Line key={c.id} label={c.name} value={c.amountIdr} minus />
                ))}
              </div>

              <div className="py-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#8C7F5F] pt-2">4. Fixed cost bulanan</div>
                {report.fixedCosts.length === 0 && <Line label="Belum diisi" value={0} muted />}
                {report.fixedCosts.map((c) => (
                  <Line key={c.id} label={c.name} value={c.amountIdr} minus />
                ))}
              </div>

              <div className="pt-4">
                <div className="flex items-baseline justify-between gap-4 rounded-2xl bg-[#231F1A] text-white px-5 py-4">
                  <span className="text-sm font-semibold text-[#DFC58E]">Bersih untuk pemilik</span>
                  <span className="text-2xl font-bold tabular-nums">{idr(report.netToOwnerIdr)}</span>
                </div>
                {noCosts && (
                  <p className="text-[11px] text-amber-800 mt-2">Biaya bulan ini belum diisi, jadi angka bersih masih sebelum biaya operasional & fixed cost.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cost entry */}
        <div className="xl:col-span-2 p-5 rounded-3xl bg-[#FAF8F5] border border-[#E8E4DC] space-y-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-[#222225]">Isi biaya {monthName(activeMonth)}</h3>
              <p className="text-xs text-[#717171]">Ketik nominalnya, kosongkan kalau tidak ada. Simpan nota di menu buku pengeluaran.</p>
            </div>
          </div>

          {costInputs("Fixed cost bulanan", "Tagihan rutin. Bulan berikutnya cukup klik salin.", [
            ...fixedRows,
            ...allExtra.filter((r) => r.category === FIXED_COST_CATEGORY),
          ])}
          <button
            type="button"
            onClick={copyFixedFromLastMonth}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C7F5F] hover:text-[#222225] cursor-pointer"
          >
            <CopyPlus className="h-3.5 w-3.5" /> Salin fixed cost dari {monthName(prevMonth(activeMonth))}
          </button>

          {costInputs("Biaya operasional bulan ini", "Biaya yang berubah tiap bulan.", [
            ...opRows,
            ...allExtra.filter((r) => r.category !== FIXED_COST_CATEGORY),
          ])}

          <div className="flex flex-wrap items-center gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Item lain, mis. Servis pompa air"
              aria-label="Nama item biaya tambahan"
              className="flex-1 min-w-[160px] px-3 py-2 rounded-xl border border-[#E8E4DC] bg-white text-xs"
            />
            <label className="flex items-center gap-1.5 text-xs text-[#5C5347]">
              <input type="checkbox" checked={newIsFixed} onChange={(e) => setNewIsFixed(e.target.checked)} /> Fixed cost
            </label>
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#E8E4DC] bg-white text-xs font-semibold text-[#222225] cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Tambah
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            {message ? <p className="text-xs text-[#5C5347]">{message}</p> : <span />}
            <button
              type="button"
              onClick={save}
              disabled={saving || Object.keys(draft).length === 0}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#231F1A] text-white text-xs font-semibold hover:bg-[#19191B] cursor-pointer disabled:opacity-40"
            >
              <Save className="h-3.5 w-3.5" /> {saving ? "Menyimpan..." : "Simpan biaya"}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
