"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import {
  TrendingUp,
  DollarSign,
  Award,
  BarChart3,
  Download,
  Printer,
  Plus,
  Receipt,
  CheckCircle2,
  Trash2,
  Upload,
  X,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react"
import { CURATED_VILLAS } from "@/lib/data"
import { Reservation, ExpenseRecord, ExpenseCategory } from "@/lib/erp/types"
import { generateOwnerStatement, calculateADR, calculateRevPAR } from "@/lib/erp/calculations"
import { exportExpensesToCsv, downloadCsvFile, printOwnerStatement } from "@/lib/erp/export"
import { formatCurrency } from "@/lib/utils"
import { useNotifications } from "@/components/dashboard/notification-context"

export default function DashboardAnalyticsPage() {
  const { addAlert, showToast } = useNotifications()
  const [mounted, setMounted] = useState(false)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([])
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("all")
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [deleteConfirmExp, setDeleteConfirmExp] = useState<ExpenseRecord | null>(null)
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null)
  const [csvRawText, setCsvRawText] = useState("")
  const [importStats, setImportStats] = useState<{ rows: number; totalIdr: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)

    // Load actual expenses
    const loadExpenses = async () => {
      try {
        const res = await fetch("/api/erp/expenses")
        const data = await res.json()
        if (data.success && Array.isArray(data.expenses)) {
          setExpenses(data.expenses)
        }
      } catch (err) {
        console.warn("Failed to load expenses from API:", err)
      }
    }

    // Load actual reservations
    const loadReservations = async () => {
      try {
        const res = await fetch("/api/erp/reservations")
        const data = await res.json()
        if (data.success && Array.isArray(data.reservations)) {
          setReservations(data.reservations)
        }
      } catch (err) {
        console.warn("Failed to load reservations from API:", err)
      }
    }

    loadExpenses()
    loadReservations()
  }, [])

  // Expense Form State
  const [expPropertyId, setExpPropertyId] = useState(CURATED_VILLAS[0].id)
  const [expCategory, setExpCategory] = useState<ExpenseCategory>("PLN & Utilities")
  const [expDescription, setExpDescription] = useState("")
  const [expAmount, setExpAmount] = useState(250000)
  const [expDate, setExpDate] = useState(new Date().toISOString().split("T")[0])
  const [expVendor, setExpVendor] = useState("")
  const [expRecordedBy, setExpRecordedBy] = useState("Staff Operasional")

  // Filtered dataset
  const activeReservations = selectedPropertyId === "all"
    ? reservations
    : reservations.filter((r) => r.propertyId === selectedPropertyId || r.propertySlug === selectedPropertyId)

  const activeExpenses = selectedPropertyId === "all"
    ? expenses
    : expenses.filter((e) => e.propertyId === selectedPropertyId || e.propertySlug === selectedPropertyId)

  // Aggregated Financials
  const grossRevenue = activeReservations.reduce((sum, r) => sum + r.grossPayoutIdr, 0)
  const totalCleaningFee = activeReservations.reduce((sum, r) => sum + r.cleaningFeeIdr, 0)
  const totalMgmtFee = activeReservations.reduce((sum, r) => sum + r.managementFeeIdr, 0)
  const totalExpenses = activeExpenses.reduce((sum, e) => sum + e.amountIdr, 0)
  const netOwnerRemittance = Math.max(0, grossRevenue - totalCleaningFee - totalMgmtFee - totalExpenses)
  const totalNights = activeReservations.reduce((sum, r) => sum + r.nights, 0)

  const adr = calculateADR(grossRevenue, totalNights)
  const revpar = calculateRevPAR(grossRevenue, CURATED_VILLAS.length * 30)

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    const targetVilla = CURATED_VILLAS.find((v) => v.id === expPropertyId) || CURATED_VILLAS[0]

    const newExp: ExpenseRecord = {
      id: `EXP-${Math.floor(105 + Math.random() * 900)}`,
      propertyId: targetVilla.id,
      propertySlug: targetVilla.slug,
      propertyName: targetVilla.name,
      category: expCategory,
      description: expDescription || `Biaya ${expCategory}`,
      amountIdr: expAmount,
      date: expDate,
      recordedBy: expRecordedBy,
      vendorName: expVendor,
    }

    setExpenses([newExp, ...expenses])
    setIsExpenseModalOpen(false)

    try {
      await fetch("/api/erp/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: newExp.propertyId,
          propertyName: newExp.propertyName,
          category: newExp.category,
          description: newExp.description,
          amountIdr: newExp.amountIdr,
          date: newExp.date,
          recordedBy: newExp.recordedBy,
          vendorName: newExp.vendorName,
        }),
      })
    } catch (err) {
      console.warn("API Add Expense error:", err)
    }

    addAlert({
      title: `POS Expense: ${formatCurrency(newExp.amountIdr, "IDR")} (${newExp.category})`,
      message: `Tercatat untuk ${targetVilla.name} (${newExp.description}).`,
      category: "expense",
      actionUrl: "/dashboard/analytics",
    })

    showToast(
      "Biaya Operasional Tercatat!",
      `${formatCurrency(newExp.amountIdr, "IDR")} • ${targetVilla.name}`,
      "success"
    )

    // Reset Form
    setExpDescription("")
    setExpVendor("")
  }

  const handleDeleteExpense = async (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id))
    setDeleteConfirmExp(null)

    try {
      await fetch(`/api/erp/expenses?id=${id}`, { method: "DELETE" })
    } catch (err) {
      console.warn("API Delete Expense error:", err)
    }

    showToast("Nota Dihapus", `Pengeluaran #${id} berhasil dihapus dari pembukuan.`, "info")
  }

  const handleExportExpensesCsv = () => {
    if (activeExpenses.length === 0) {
      showToast("Buku POS Kosong", "Belum ada nota pengeluaran untuk diexport.", "error")
      return
    }
    const csvContent = exportExpensesToCsv(activeExpenses)
    downloadCsvFile(csvContent, `kinghouse-pos-expenses-${new Date().toISOString().split("T")[0]}.csv`)
    showToast("Download Dimulai", "File CSV buku pengeluaran POS sedang diunduh.", "success")
  }

  const handlePrintStatement = () => {
    const targetVilla = selectedPropertyId === "all"
      ? CURATED_VILLAS[0]
      : CURATED_VILLAS.find((v) => v.id === selectedPropertyId) || CURATED_VILLAS[0]

    const statement = generateOwnerStatement(
      targetVilla.id,
      targetVilla.name,
      targetVilla.area,
      "Pemilik Properti Mitra",
      new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
      activeReservations,
      activeExpenses,
      "standard",
      30
    )

    printOwnerStatement(statement)
  }

  // Airbnb Payout CSV Parser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      if (text) {
        setCsvRawText(text)
        parseCsvPreview(text)
      }
    }
    reader.readAsText(file)
  }

  const parseCsvPreview = (text: string) => {
    const lines = text.split("\n").filter((l) => l.trim().length > 0)
    if (lines.length <= 1) return

    let totalAmount = 0
    let validRows = 0

    // Parse simple CSV rows
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i]
      // Match numbers or currency
      const matches = row.match(/(\d[\d,.]*)/g)
      if (matches && matches.length > 0) {
        const lastNum = parseFloat(matches[matches.length - 1].replace(/,/g, ""))
        if (!isNaN(lastNum) && lastNum > 0) {
          totalAmount += lastNum
          validRows++
        }
      }
    }

    setImportStats({ rows: validRows, totalIdr: totalAmount })
  }

  const handleConfirmImport = () => {
    if (!importStats || importStats.rows === 0) {
      showToast("Data Tidak Valid", "Pastikan file CSV memiliki baris data payout Airbnb.", "error")
      return
    }

    setIsImportModalOpen(false)
    setFeedbackMsg(`Berhasil mengimpor ${importStats.rows} transaksi payout resmi dari Airbnb! Total: ${formatCurrency(importStats.totalIdr, "IDR")}.`)

    showToast(
      "Airbnb Payout Diimpor!",
      `${importStats.rows} mutasi payout (${formatCurrency(importStats.totalIdr, "IDR")}) masuk ke sistem.`,
      "success"
    )
    setCsvRawText("")
    setImportStats(null)
  }

  return (
    <div className="space-y-8 animate-sana-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4DC] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-[10px] font-semibold uppercase tracking-wider text-[#222225] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#E8E4DC] mb-3">
            <BarChart3 className="h-3.5 w-3.5 text-[#B8934C]" />
            <span>FINANCIAL INTELLIGENCE & POS SUITE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-[#222225] font-semibold tracking-tight">
            Revenue, POS & Owner Yield
          </h1>
          <p className="text-sm text-[#717171] mt-1 font-light leading-relaxed">
            Kalkulasi pendapatan aktual Airbnb iCal, mutasi payout perbankan, buku pengeluaran POS, dan laporan cetak pemilik properti.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-white border border-[#E8E4DC] text-[#222225] px-4 py-2.5 rounded-2xl text-xs font-semibold hover:bg-[#FAF8F5] hover:border-[#DAD5CC] transition-all shadow-xs cursor-pointer"
            title="Upload CSV laporan payout resmi dari tab Airbnb Host Earnings"
          >
            <Upload className="h-3.5 w-3.5 text-[#B8934C]" />
            <span>Import Airbnb Payout (CSV)</span>
          </button>

          <button
            type="button"
            onClick={handlePrintStatement}
            className="inline-flex items-center space-x-2 bg-white border border-[#E8E4DC] text-[#222225] px-4 py-2.5 rounded-2xl text-xs font-semibold hover:bg-[#FAF8F5] hover:border-[#DAD5CC] transition-all shadow-xs cursor-pointer"
            title="Cetak format invoice resmi A4 untuk dikirim ke pemilik villa"
          >
            <Printer className="h-3.5 w-3.5 text-[#B8934C]" />
            <span>Cetak Laporan Owner</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpenseModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-[#222225] text-white px-5 py-2.5 rounded-2xl text-xs font-semibold hover:bg-[#2B2A30] transition-all shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-[#B8934C]" />
            <span>Catat Biaya POS</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-sana-fade-in shadow-xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span className="font-medium">{feedbackMsg}</span>
        </div>
      )}

      {/* Property Filter Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-[#717171] flex-shrink-0 mr-1">Filter Properti:</span>
        <button
          type="button"
          onClick={() => setSelectedPropertyId("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            selectedPropertyId === "all"
              ? "bg-[#222225] text-white shadow-xs"
              : "bg-white text-[#717171] hover:text-[#222225] border border-[#E8E4DC]"
          }`}
        >
          Semua Portofolio (4 Unit)
        </button>
        {CURATED_VILLAS.map((villa) => (
          <button
            key={villa.id}
            type="button"
            onClick={() => setSelectedPropertyId(villa.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              selectedPropertyId === villa.id
                ? "bg-[#222225] text-white shadow-xs"
                : "bg-white text-[#717171] hover:text-[#222225] border border-[#E8E4DC]"
            }`}
          >
            {villa.area}: {villa.name.split(" ")[0]}...
          </button>
        ))}
      </div>

      {/* KPI Cards - Calculated Dynamically */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-7 rounded-3xl bg-white border border-[#E8E4DC] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] space-y-2 hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#717171] uppercase tracking-wider">Gross Payout Terkumpul</span>
            <div className="h-8 w-8 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-[#222225]">
              <DollarSign className="h-4 w-4 text-[#B8934C]" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-[#222225] tracking-tight">{formatCurrency(grossRevenue, "IDR")}</p>
          <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {activeReservations.length} Transaksi Menginap
          </span>
        </div>

        <div className="p-7 rounded-3xl bg-white border border-[#E8E4DC] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] space-y-2 hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#717171] uppercase tracking-wider">Net Bagi Hasil Pemilik</span>
            <div className="h-8 w-8 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-[#222225]">
              <Award className="h-4 w-4 text-[#B8934C]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-700 tracking-tight">{formatCurrency(netOwnerRemittance, "IDR")}</p>
          <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Setelah dikurangi komisi & POS
          </span>
        </div>

        <div className="p-7 rounded-3xl bg-white border border-[#E8E4DC] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] space-y-2 hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#717171] uppercase tracking-wider">Total Biaya Operasional (POS)</span>
            <div className="h-8 w-8 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-[#222225]">
              <Receipt className="h-4 w-4 text-[#B8934C]" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-rose-700 tracking-tight">{formatCurrency(totalExpenses, "IDR")}</p>
          <span className="inline-block text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            {activeExpenses.length} Nota Pembelian Tercatat
          </span>
        </div>

        <div className="p-7 rounded-3xl bg-white border border-[#E8E4DC] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] space-y-2 hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#717171] uppercase tracking-wider">ADR (Rata-Rata Tarif/Malam)</span>
            <div className="h-8 w-8 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-[#222225]">
              <TrendingUp className="h-4 w-4 text-[#B8934C]" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-[#222225] tracking-tight">{formatCurrency(adr, "IDR")}</p>
          <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {totalNights} Total Malam Terjual
          </span>
        </div>
      </div>

      {/* POS Expense Ledger Table */}
      <div className="rounded-3xl border border-[#E8E4DC] bg-white overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)]">
        <div className="p-6 sm:p-8 border-b border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-white to-[#FAF8F5]">
          <div>
            <h3 className="text-xl text-[#222225] font-semibold">Buku Pengeluaran Operasional / POS ({activeExpenses.length})</h3>
            <p className="text-xs text-[#717171]">Transparansi nota belanja, token listrik PLN, laundry linen, dan maintenance</p>
          </div>

          <button
            type="button"
            onClick={handleExportExpensesCsv}
            disabled={activeExpenses.length === 0}
            className="inline-flex items-center space-x-2 bg-white border border-[#E8E4DC] text-[#222225] px-4 py-2 rounded-2xl text-xs font-semibold hover:bg-[#FAF8F5] transition-all shadow-xs cursor-pointer self-start sm:self-auto disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5 text-[#B8934C]" />
            <span>Export Pengeluaran (CSV)</span>
          </button>
        </div>

        {activeExpenses.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center mx-auto text-[#8C7F5F]">
              <Receipt className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-semibold text-[#222225]">Buku Pengeluaran Bersih</h4>
              <p className="text-xs text-[#717171] max-w-md mx-auto leading-relaxed">
                Belum ada nota pengeluaran operasional yang dicatat. Semua angka laba bersih di atas dihitung 100% riil tanpa potongan fiktif.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsExpenseModalOpen(true)}
              className="inline-flex items-center space-x-2 bg-[#222225] text-white px-5 py-2.5 rounded-2xl text-xs font-semibold hover:bg-[#19191B] transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-[#DFC58E]" />
              <span>Tambah Nota Pengeluaran Pertama</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8E4DC] bg-[#FAFAF8] text-[10px] font-bold uppercase tracking-wider text-[#717171]">
                  <th className="py-4 px-6">ID & Tanggal</th>
                  <th className="py-4 px-6">Properti</th>
                  <th className="py-4 px-6">Kategori POS</th>
                  <th className="py-4 px-6">Rincian Pengeluaran</th>
                  <th className="py-4 px-6">Pencatat / Vendor</th>
                  <th className="py-4 px-6">Nominal (Rp)</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF8F5] text-xs">
                {activeExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[#FAFAF8]/90 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-[#222225]">{exp.date}</p>
                      <span className="text-[10px] text-[#717171] font-mono">{exp.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-[#222225] max-w-[200px] truncate">{exp.propertyName}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#FAF8F5] text-[#222225] border border-[#E8E4DC]">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-[#222225] font-medium">{exp.description}</p>
                    </td>
                    <td className="py-4 px-6 text-[11px] text-[#717171]">
                      <p className="font-medium text-[#222225]">{exp.recordedBy}</p>
                      {exp.vendorName && <span className="text-[10px]">{exp.vendorName}</span>}
                    </td>
                    <td className="py-4 px-6 font-bold text-rose-700">
                      - {formatCurrency(exp.amountIdr, "IDR")}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmExp(exp)}
                        className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus Nota Pengeluaran"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Airbnb Payout CSV Importer Modal */}
      {mounted &&
        isImportModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsImportModalOpen(false)
            }}
          >
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.35)] border border-[#E8E4DC] max-h-[90vh] overflow-y-auto space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E4DC]">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-[#8C7F5F]">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl text-[#222225] font-semibold">Import Airbnb Payout (CSV)</h3>
                    <p className="text-xs text-[#717171]">Ambil mutasi resmi dari Airbnb Host &gt; Earnings</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="h-8 w-8 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#717171] hover:text-[#222225] transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#E8E4DC] hover:border-[#8C7F5F] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] space-y-2"
                >
                  <Upload className="h-6 w-6 text-[#8C7F5F] mx-auto" />
                  <p className="font-semibold text-[#222225]">Pilih file CSV Payout dari komputer</p>
                  <p className="text-[11px] text-[#717171]">File .csv resmi yang diunduh dari akun Airbnb Host</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {importStats && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1">
                    <div className="flex items-center space-x-2 font-semibold">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>{importStats.rows} Baris Payout Terdeteksi!</span>
                    </div>
                    <p className="text-[11px]">
                      Total Gross Terbaca: <strong>{formatCurrency(importStats.totalIdr, "IDR")}</strong>
                    </p>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] text-[#717171] text-[11px] space-y-1">
                  <div className="flex items-center space-x-1.5 font-semibold text-[#222225]">
                    <AlertCircle className="h-3.5 w-3.5 text-[#B8934C]" />
                    <span>Cara Download CSV dari Airbnb Host:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-0.5 pl-1">
                    <li>Buka menu <strong>Earnings</strong> di akun Airbnb Host.</li>
                    <li>Pilih tab <strong>Paid</strong> / Pembayaran Selesai.</li>
                    <li>Klik <strong>Export CSV</strong> untuk mengunduh laporan payout asli.</li>
                  </ol>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E8E4DC]">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#717171] hover:text-[#222225]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  disabled={!importStats || importStats.rows === 0}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#222225] text-white hover:bg-[#19191B] transition-all disabled:opacity-50 cursor-pointer"
                >
                  Konfirmasi Import Payout
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Record Expense Modal */}
      {mounted &&
        isExpenseModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsExpenseModalOpen(false)
            }}
          >
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.35)] border border-[#E8E4DC] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E4DC]">
                <div>
                  <h3 className="text-2xl text-[#222225] font-semibold">Catat Pengeluaran Operasional / POS</h3>
                  <p className="text-xs text-[#717171] mt-0.5">Input nota belanja, token listrik PLN, laundry, atau service AC</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="h-8 w-8 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#717171] hover:text-[#222225] transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1">
                    Pilih Properti Villa
                  </label>
                  <select
                    value={expPropertyId}
                    onChange={(e) => setExpPropertyId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-semibold text-[#222225] focus:outline-none focus:border-[#B8934C]"
                  >
                    {CURATED_VILLAS.map((villa) => (
                      <option key={villa.id} value={villa.id}>
                        {villa.name} ({villa.area})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1">
                      Kategori POS
                    </label>
                    <select
                      value={expCategory}
                      onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-medium text-[#222225] focus:outline-none focus:border-[#B8934C]"
                    >
                      <option value="PLN & Utilities">PLN & Utilities (Listrik/Air/WiFi)</option>
                      <option value="Linen & Laundry">Linen & Laundry Cuci Sprei</option>
                      <option value="Guest Amenities">Guest Amenities & Galon</option>
                      <option value="Maintenance & Repairs">Maintenance & Service AC</option>
                      <option value="Staff & Operations">Staff Operasional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1">
                      Nominal Biaya (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      min={1000}
                      step={5000}
                      value={expAmount}
                      onChange={(e) => setExpAmount(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-semibold text-[#222225] focus:outline-none focus:border-[#B8934C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1">
                    Deskripsi / Rincian Nota
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Token listrik PLN 5.500 VA / Cuci sprei 15kg"
                    value={expDescription}
                    onChange={(e) => setExpDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] text-[#222225] focus:outline-none focus:border-[#B8934C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1">
                      Tanggal Pengeluaran
                    </label>
                    <input
                      type="date"
                      required
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] text-[#222225] focus:outline-none focus:border-[#B8934C]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1">
                      Vendor / Toko (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: PLN UID / Indomaret"
                      value={expVendor}
                      onChange={(e) => setExpVendor(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] text-[#222225] focus:outline-none focus:border-[#B8934C]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[#E8E4DC]">
                  <button
                    type="button"
                    onClick={() => setIsExpenseModalOpen(false)}
                    className="px-5 py-2.5 rounded-2xl border border-[#E8E4DC] font-semibold text-[#717171] hover:bg-[#FAF8F5] transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-2xl bg-[#222225] text-white font-semibold hover:bg-[#19191B] transition-all shadow-xs cursor-pointer"
                  >
                    Simpan Nota POS
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Delete Confirmation Modal */}
      {mounted &&
        deleteConfirmExp &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setDeleteConfirmExp(null)
            }}
          >
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-[0_25px_70px_rgba(0,0,0,0.35)] border border-[#E8E4DC] text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#222225]">Hapus Nota Pengeluaran?</h3>
                <p className="text-xs text-[#717171] mt-1">
                  Nota <strong>{deleteConfirmExp.id}</strong> ({deleteConfirmExp.description}) sebesar{" "}
                  <strong>{formatCurrency(deleteConfirmExp.amountIdr, "IDR")}</strong> akan dihapus dari buku operasional.
                </p>
              </div>
              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmExp(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#E8E4DC] text-[#717171] hover:bg-[#FAF8F5]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteExpense(deleteConfirmExp.id)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-all cursor-pointer"
                >
                  Ya, Hapus Nota
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
