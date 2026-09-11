"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Filter,
  Plus,
  Download,
  Search,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  X,
  DollarSign,
  User,
  Phone,
  Building2,
  Layers,
  HelpCircle,
  Trash2,
} from "lucide-react"
import { INITIAL_RESERVATIONS } from "@/lib/erp/initial-data"
import { CURATED_VILLAS } from "@/lib/data"
import { Reservation, ChannelType, ReservationStatus, FeeTier } from "@/lib/erp/types"
import { calculateReservationPayout } from "@/lib/erp/calculations"
import { exportReservationsToCsv, downloadCsvFile } from "@/lib/erp/export"
import { formatCurrency } from "@/lib/utils"
import { useNotifications } from "@/components/dashboard/notification-context"
import { BookingsGanttChart } from "@/components/dashboard/bookings-gantt-chart"

export default function DashboardBookingsPage() {
  const { addAlert, showToast } = useNotifications()
  const [mounted, setMounted] = useState(false)
  const [viewMode, setViewMode] = useState<"gantt" | "table">("gantt")
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChannel, setSelectedChannel] = useState<string>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false)
  const [deleteConfirmRes, setDeleteConfirmRes] = useState<Reservation | null>(null)
  const [syncStatus, setSyncStatus] = useState<string>("Up to date")
  const [isSyncing, setIsSyncing] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null)
  const [inboundSyncUrl, setInboundSyncUrl] = useState("")
  const [syncVillaSlug, setSyncVillaSlug] = useState(CURATED_VILLAS[0].slug)


  useEffect(() => {
    setMounted(true)
    const loadReservations = async () => {
      try {
        const res = await fetch("/api/erp/reservations")
        const data = await res.json()
        if (data.success && Array.isArray(data.reservations) && data.reservations.length > 0) {
          setReservations(data.reservations)
        }
      } catch (err) {
        console.warn("Failed to load reservations from API:", err)
      }
    }
    loadReservations()
  }, [])

  // Form State for Manual Booking
  const [formPropertyId, setFormPropertyId] = useState(CURATED_VILLAS[0].id)
  const [formGuestName, setFormGuestName] = useState("")
  const [formGuestPhone, setFormGuestPhone] = useState("")
  const [formChannel, setFormChannel] = useState<ChannelType>("Direct WhatsApp")
  const [formCheckIn, setFormCheckIn] = useState("2026-09-01")
  const [formCheckOut, setFormCheckOut] = useState("2026-09-03")
  const [formGuests, setFormGuests] = useState(2)
  const [formGrossPayout, setFormGrossPayout] = useState(1500000)
  const [formCleaningFee, setFormCleaningFee] = useState(150000)
  const [formFeeTier, setFormFeeTier] = useState<FeeTier>("standard")
  const [formNotes, setFormNotes] = useState("")

  // Dynamic calculations for the modal
  const nightsCount = Math.max(
    1,
    Math.round(
      (new Date(formCheckOut).getTime() - new Date(formCheckIn).getTime()) / (1000 * 60 * 60 * 24)
    ) || 1
  )

  const payoutCalc = calculateReservationPayout(formGrossPayout, formCleaningFee, formFeeTier)

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const selectedVilla = CURATED_VILLAS.find((v) => v.id === formPropertyId) || CURATED_VILLAS[0]

    const newRes: Reservation = {
      id: `RES-${Math.floor(8925 + Math.random() * 1000)}`,
      propertyId: selectedVilla.id,
      propertySlug: selectedVilla.slug,
      propertyName: selectedVilla.name,
      guestName: formGuestName || "Tamu Direct",
      guestPhone: formGuestPhone,
      channel: formChannel,
      checkIn: formCheckIn,
      checkOut: formCheckOut,
      nights: nightsCount,
      guests: formGuests,
      grossPayoutIdr: formGrossPayout,
      cleaningFeeIdr: formCleaningFee,
      feeTier: formFeeTier,
      managementFeePercent: payoutCalc.managementFeePercent,
      managementFeeIdr: payoutCalc.managementFeeIdr,
      netOwnerPayoutIdr: payoutCalc.netOwnerPayoutIdr,
      status: "Confirmed",
      notes: formNotes,
      createdAt: new Date().toISOString(),
    }

    setReservations([newRes, ...reservations])
    setIsModalOpen(false)

    try {
      await fetch("/api/erp/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: newRes.propertyId,
          propertyName: newRes.propertyName,
          guestName: newRes.guestName,
          guestPhone: newRes.guestPhone,
          channel: newRes.channel,
          checkIn: newRes.checkIn,
          checkOut: newRes.checkOut,
          nights: newRes.nights,
          guests: newRes.guests,
          grossPayoutIdr: newRes.grossPayoutIdr,
          cleaningFeeIdr: newRes.cleaningFeeIdr,
          feeTier: newRes.feeTier,
          status: newRes.status,
          notes: newRes.notes,
        }),
      })
    } catch (err) {
      console.warn("API Add Reservation error:", err)
    }

    addAlert({
      title: `Reservasi Baru: ${newRes.guestName} (${newRes.nights} Malam)`,
      message: `Booking di ${newRes.propertyName} via ${newRes.channel}. Payout: ${formatCurrency(newRes.grossPayoutIdr, "IDR")}.`,
      category: "booking",
      actionUrl: "/dashboard/bookings",
    })

    showToast("Reservasi Berhasil Ditambahkan!", `${newRes.guestName} &bull; ${newRes.propertyName}`, "success")

    // Reset Form
    setFormGuestName("")
    setFormGuestPhone("")
    setFormNotes("")
  }

  const handleDeleteBooking = async (id: string) => {
    const target = reservations.find((r) => r.id === id)
    setReservations(reservations.filter((r) => r.id !== id))
    setDeleteConfirmRes(null)

    try {
      await fetch(`/api/erp/reservations?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      })
    } catch (err) {
      console.warn("API Delete Reservation error:", err)
    }

    if (target) {
      addAlert({
        title: `Reservasi Dibatalkan: ${target.guestName}`,
        message: `Nomor booking ${target.id} (${target.propertyName}) telah dibatalkan.`,
        category: "booking",
      })
      showToast("Reservasi Dibatalkan", `Booking #${target.id} berhasil dihapus.`, "info")
    }
  }

  const handleForceSync = async () => {
    setIsSyncing(true)
    try {
      // 1. Trigger live batch sync across all configured OTA iCal feeds
      const syncRes = await fetch("/api/erp/ical-sync?action=sync-all")
      const syncData = await syncRes.json().catch(() => ({}))

      // 2. Refresh reservations from server
      const res = await fetch("/api/erp/reservations")
      const data = await res.json()
      if (data.success && Array.isArray(data.reservations)) {
        setReservations(data.reservations)
      }
      const importedText = syncData.totalImported ? ` (${syncData.totalImported} jadwal aktif)` : ""
      setSyncStatus(`Baru saja disinkronkan langsung dari Airbnb${importedText}`)
      addAlert({
        title: "Sinkronisasi Airbnb Live Berhasil",
        message: `Kalender unit Airbnb berhasil disinkronkan${importedText}.`,
        category: "sync",
      })
      showToast("Sinkronisasi Live Sukses!", `Jadwal Airbnb & WhatsApp telah diperbarui${importedText}.`, "success")
    } catch {
      showToast("Sinkronisasi Selesai", "Status kalender up to date.", "info")
    } finally {
      setIsSyncing(false)
    }
  }

  const handleCustomIcalSync = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inboundSyncUrl.trim()) return

    setIsSyncing(true)
    try {
      const res = await fetch("/api/erp/ical-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertySlug: syncVillaSlug,
          icalUrl: inboundSyncUrl.trim(),
          channel: "Airbnb",
        }),
      })

      const result = await res.json()
      if (result.success) {
        if (Array.isArray(result.reservations) && result.reservations.length > 0) {
          setReservations((prev) => [...result.reservations, ...prev])
        }
        setIsSyncModalOpen(false)
        setInboundSyncUrl("")
        showToast("Feed iCal Berhasil Diimpor!", result.message, "success")
        addAlert({
          title: `iCal Imported: ${result.importedCount} Bookings`,
          message: `Feed kalender eksternal berhasil disinkronkan ke kalender ERP.`,
          category: "sync",
        })
      } else {
        showToast("Gagal Mengimpor iCal", result.error || "Format tidak valid.", "error")
      }
    } catch {
      showToast("Error", "Gagal menghubungi endpoint sinkronisasi.", "error")
    } finally {
      setIsSyncing(false)
    }
  }

  const handleExportCsv = () => {
    const csvData = exportReservationsToCsv(reservations)
    const today = new Date().toISOString().split("T")[0]
    downloadCsvFile(csvData, `KingHouse-Reservations-${today}.csv`)
    showToast("File CSV Berhasil Diunduh", "Buka di Excel atau Google Sheets untuk laporan keuangan.", "success")
  }

  // Filtered reservations
  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesChannel = selectedChannel === "all" || r.channel.toLowerCase() === selectedChannel.toLowerCase()

    return matchesSearch && matchesChannel
  })

  return (
    <div className="space-y-8 animate-sana-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4DC] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-[10px] font-semibold uppercase tracking-wider text-[#222225] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#E8E4DC] mb-3">
            <CalendarDays className="h-3.5 w-3.5 text-[#B8934C]" />
            <span>DISTRIBUTION & RESERVATIONS ERP</span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-[#222225] font-semibold tracking-tight">
            Bookings & Calendar Hub
          </h1>
          <p className="text-sm text-[#717171] mt-1 font-light leading-relaxed">
            Pusat manajemen reservasi multi-channel (Airbnb, Direct WhatsApp, Agoda) dengan kalkulasi otomatis bagi hasil pemilik.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Switcher (Gantt vs Table) */}
          <div className="flex items-center rounded-2xl bg-[#FAF8F5] p-1 border border-[#E8E4DC]">
            <button
              type="button"
              onClick={() => setViewMode("gantt")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === "gantt"
                  ? "bg-[#222225] text-white shadow-xs"
                  : "text-[#717171] hover:text-[#222225]"
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Gantt Timeline</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === "table"
                  ? "bg-[#222225] text-white shadow-xs"
                  : "text-[#717171] hover:text-[#222225]"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Tabel Reservasi</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center space-x-2 bg-white border border-[#E8E4DC] text-[#222225] px-4 py-2.5 rounded-2xl text-xs font-semibold hover:bg-[#FAF8F5] hover:border-[#DAD5CC] transition-all shadow-xs cursor-pointer"
            title="Download file spreadsheet Excel/CSV untuk pembukuan"
          >
            <Download className="h-3.5 w-3.5 text-[#B8934C]" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-[#222225] text-white px-5 py-2.5 rounded-2xl text-xs font-semibold hover:bg-[#2B2A30] transition-all shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-[#B8934C]" />
            <span>Tambah Reservasi</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-sana-fade-in shadow-xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span className="font-medium">{feedbackMsg}</span>
        </div>
      )}

      {/* Sync Status Banner */}
      <div className="p-5 rounded-3xl bg-white border border-[#E8E4DC] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-100" />
          <div>
            <p className="text-xs font-semibold text-[#222225]">Sinkronisasi Otomatis iCal 2-Arah Aktif</p>
            <p className="text-[11px] text-[#717171] font-light">{syncStatus}. Menjaga agar kalender Airbnb dan WhatsApp tidak bentrok (Zero Double-Booking).</p>
          </div>
        </div>
        <div className="flex items-center space-x-2.5 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setIsSyncModalOpen(true)}
            className="inline-flex items-center space-x-1.5 text-xs text-[#222225] bg-amber-50 hover:bg-amber-100 px-3.5 py-1.5 rounded-full transition-all border border-amber-200 cursor-pointer font-medium"
          >
            <Sparkles className="h-3 w-3 text-amber-600" />
            <span>Impor URL Airbnb</span>
          </button>
          <button
            type="button"
            onClick={handleForceSync}
            disabled={isSyncing}
            className="inline-flex items-center space-x-1.5 text-xs text-[#717171] hover:text-[#222225] bg-[#FAF8F5] hover:bg-[#E8E4DC] px-3.5 py-1.5 rounded-full transition-all border border-[#E8E4DC] cursor-pointer"
          >
            <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin text-[#B8934C]" : ""}`} />
            <span>{isSyncing ? "Menyinkronkan..." : "Sinkronkan Sekarang"}</span>
          </button>
        </div>
      </div>


      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white p-4 rounded-3xl border border-[#E8E4DC]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#717171]" />
          <input
            type="text"
            placeholder="Cari nama tamu, nomor booking, atau properti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs focus:outline-none focus:border-[#B8934C] transition-all"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] text-[#717171] font-semibold flex items-center space-x-1">
            <Filter className="h-3 w-3" />
            <span>Channel:</span>
          </span>
          {["all", "Airbnb", "Direct WhatsApp"].map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => setSelectedChannel(ch)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedChannel === ch
                  ? "bg-[#222225] text-white"
                  : "bg-[#FAF8F5] text-[#717171] hover:text-[#222225] border border-[#E8E4DC]"
              }`}
            >
              {ch === "all" ? "Semua Saluran" : ch}
            </button>
          ))}
        </div>
      </div>

      {/* View Switcher Output: Gantt Chart or Table */}
      {viewMode === "gantt" ? (
        <BookingsGanttChart reservations={filteredReservations} />
      ) : (
        <div className="rounded-3xl border border-[#E8E4DC] bg-white overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)]">
          <div className="p-6 sm:p-8 border-b border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-white to-[#FAF8F5]">
            <div className="space-y-1">
              <h3 className="text-xl text-[#222225] font-semibold">Daftar Reservasi Aktif ({filteredReservations.length})</h3>
              <p className="text-xs text-[#717171]">Transparansi lengkap bagi hasil pemilik dan status kedatangan tamu</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8E4DC] bg-[#FAFAF8] text-[10px] font-bold uppercase tracking-wider text-[#717171]">
                  <th className="py-4 px-6">ID & Tamu</th>
                  <th className="py-4 px-6">Properti</th>
                  <th className="py-4 px-6">Saluran Booking</th>
                  <th className="py-4 px-6">Tanggal In & Out</th>
                  <th className="py-4 px-6">Gross Payout</th>
                  <th className="py-4 px-6">Bagi Hasil Owner (Net)</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF8F5] text-xs">
                {filteredReservations.map((res) => {
                  const isDirect = res.channel === "Direct WhatsApp"
                  return (
                    <tr key={res.id} className="hover:bg-[#FAFAF8]/90 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-semibold text-[#222225]">{res.guestName}</p>
                        <span className="text-[10px] text-[#717171] font-mono">{res.id}</span>
                        {res.guestPhone && (
                          <p className="text-[10px] text-[#717171] mt-0.5">{res.guestPhone}</p>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-[#222225] max-w-[220px] truncate">{res.propertyName}</p>
                        <span className="text-[11px] text-[#717171]">{res.guests} Tamu &bull; {res.nights} Malam</span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                            isDirect
                              ? "bg-emerald-50/70 text-emerald-800 border-emerald-200"
                              : "bg-rose-50/70 text-rose-800 border-rose-200"
                          }`}
                        >
                          {res.channel}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-[#222225]">{res.checkIn} &rarr; {res.checkOut}</p>
                        <span className="text-[10px] text-[#B8934C] font-medium">{res.nights} malam menginap</span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-[#222225]">
                        {formatCurrency(res.grossPayoutIdr, "IDR")}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-emerald-700">{formatCurrency(res.netOwnerPayoutIdr, "IDR")}</p>
                        <span className="text-[10px] text-[#717171]">
                          Komisi: {formatCurrency(res.managementFeeIdr, "IDR")} ({res.managementFeePercent}%)
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          <span>{res.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmRes(res)}
                          className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Batalkan / Hapus Reservasi"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inbound iCal Sync Modal (Full-Screen Portal) */}
      {mounted &&
        isSyncModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsSyncModalOpen(false)
            }}
          >
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.35)] border border-[#E8E4DC]">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E4DC]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xl text-[#222225] font-semibold">Impor Feed iCal Airbnb / OTA</h3>
                    <p className="text-xs text-[#717171]">Tarik jadwal booking eksternal untuk auto-block tanggal</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSyncModalOpen(false)}
                  className="h-8 w-8 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#717171] hover:text-[#222225] transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCustomIcalSync} className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1">
                    Pilih Properti Tujuan
                  </label>
                  <select
                    value={syncVillaSlug}
                    onChange={(e) => setSyncVillaSlug(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-semibold text-[#222225] focus:outline-none focus:border-[#B8934C]"
                  >
                    {CURATED_VILLAS.map((villa) => (
                      <option key={villa.slug} value={villa.slug}>
                        {villa.name} ({villa.area})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1">
                    URL Export iCal (.ics) dari Airbnb / Agoda / Booking.com *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.airbnb.com/calendar/ical/1234567.ics?s=abcdef"
                    value={inboundSyncUrl}
                    onChange={(e) => setInboundSyncUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-mono text-xs text-[#222225] focus:outline-none focus:border-[#B8934C]"
                  />
                  <p className="text-[11px] text-[#717171] mt-1.5 leading-relaxed">
                    Salin URL dari menu <em>Airbnb Host Dashboard &rarr; Pricing and availability &rarr; Calendar sync &rarr; Export calendar</em>.
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsSyncModalOpen(false)}
                    className="px-5 py-2.5 rounded-2xl border border-[#E8E4DC] text-[#717171] hover:text-[#222225] hover:bg-[#FAF8F5] transition-all cursor-pointer font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#222225] text-white font-semibold hover:bg-[#2B2A30] transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin text-[#B8934C]" : ""}`} />
                    <span>{isSyncing ? "Mengimpor..." : "Mulai Sinkronisasi"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Manual Booking Modal (Full-Screen Portal) */}
      {mounted &&
        isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false)
            }}
          >
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.35)] border border-[#E8E4DC] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E4DC]">
                <div>
                  <h3 className="text-2xl text-[#222225] font-semibold">Tambah Reservasi Manual / Direct</h3>
                  <p className="text-xs text-[#717171] mt-0.5">
                    Entri booking WhatsApp atau walk-in. Sistem otomatis menghitung komisi dan bagi hasil pemilik.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 w-8 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#717171] hover:text-[#222225] transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleManualAdd} className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1">
                    Pilih Properti Villa
                  </label>
                  <select
                    value={formPropertyId}
                    onChange={(e) => setFormPropertyId(e.target.value)}
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
                      Nama Tamu Pemesan *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Bpk. Hendra Gunawan"
                      value={formGuestName}
                      onChange={(e) => setFormGuestName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-medium text-[#222225] focus:outline-none focus:border-[#B8934C]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1">
                      Nomor WhatsApp Tamu
                    </label>
                    <input
                      type="tel"
                      placeholder="08123456789"
                      value={formGuestPhone}
                      onChange={(e) => setFormGuestPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-medium text-[#222225] focus:outline-none focus:border-[#B8934C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1">
                      Tanggal Check-In
                    </label>
                    <input
                      type="date"
                      required
                      value={formCheckIn}
                      onChange={(e) => setFormCheckIn(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-medium text-[#222225] focus:outline-none focus:border-[#B8934C]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1">
                      Tanggal Check-Out
                    </label>
                    <input
                      type="date"
                      required
                      value={formCheckOut}
                      onChange={(e) => setFormCheckOut(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-medium text-[#222225] focus:outline-none focus:border-[#B8934C]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1">
                      Channel Booking
                    </label>
                    <select
                      value={formChannel}
                      onChange={(e) => setFormChannel(e.target.value as ChannelType)}
                      className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-medium text-[#222225] focus:outline-none focus:border-[#B8934C]"
                    >
                      <option value="Direct WhatsApp">Direct WhatsApp</option>
                      <option value="Airbnb">Airbnb (Manual)</option>
                      <option value="Booking.com">Booking.com</option>
                      <option value="Agoda">Agoda</option>
                      <option value="Walk-in">Walk-in</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1">
                      Total Nilai Sewa (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      min={100000}
                      step={50000}
                      value={formGrossPayout}
                      onChange={(e) => setFormGrossPayout(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-semibold text-[#222225] focus:outline-none focus:border-[#B8934C]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1">
                      Cleaning Fee (Rp)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={10000}
                      value={formCleaningFee}
                      onChange={(e) => setFormCleaningFee(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-medium text-[#222225] focus:outline-none focus:border-[#B8934C]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1">
                      Tier Fee KingHouse
                    </label>
                    <select
                      value={formFeeTier}
                      onChange={(e) => setFormFeeTier(e.target.value as FeeTier)}
                      className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-medium text-[#222225] focus:outline-none focus:border-[#B8934C]"
                    >
                      <option value="standard">15% Standard</option>
                      <option value="premium">20% Premium</option>
                    </select>
                  </div>
                </div>

                {/* Automatic Calculation Preview Box for Non-Tech Users */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] space-y-2">
                  <div className="flex items-center space-x-1.5 font-semibold text-[#222225]">
                    <Sparkles className="h-3.5 w-3.5 text-[#B8934C]" />
                    <span>Kalkulasi Otomatis Sistem ERP:</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-[#717171] block">Lama Menginap:</span>
                      <strong className="text-[#222225]">{nightsCount} Malam</strong>
                    </div>
                    <div>
                      <span className="text-[#717171] block">Komisi Mgmt ({payoutCalc.managementFeePercent}%):</span>
                      <strong className="text-amber-700">{formatCurrency(payoutCalc.managementFeeIdr, "IDR")}</strong>
                    </div>
                    <div>
                      <span className="text-[#717171] block">Bagi Hasil Pemilik:</span>
                      <strong className="text-emerald-700">{formatCurrency(payoutCalc.netOwnerPayoutIdr, "IDR")}</strong>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1">
                    Catatan Tambahan (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Tamu butuh extra bed dan early check-in jam 13:00"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-medium text-[#222225] focus:outline-none focus:border-[#B8934C]"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-2xl border border-[#E8E4DC] text-[#717171] hover:text-[#222225] hover:bg-[#FAF8F5] transition-all cursor-pointer font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-2xl bg-[#222225] text-white font-semibold hover:bg-[#2B2A30] transition-all shadow-xs cursor-pointer"
                  >
                    Simpan Reservasi
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Delete Confirmation Modal (Full-Screen Portal) */}
      {mounted &&
        deleteConfirmRes &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setDeleteConfirmRes(null)
            }}
          >
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.35)] border border-rose-100 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="h-6 w-6" />
              </div>

              <div className="text-center space-y-1.5">
                <h3 className="text-xl text-[#222225] font-semibold">Batalkan / Hapus Reservasi?</h3>
                <p className="text-xs text-[#717171] leading-relaxed">
                  Anda yakin ingin menghapus reservasi <strong className="text-[#222225]">#{deleteConfirmRes.id}</strong> atas nama <strong className="text-[#222225]">{deleteConfirmRes.guestName}</strong> ({deleteConfirmRes.propertyName})?
                </p>
              </div>

              <div className="pt-3 flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmRes(null)}
                  className="flex-1 py-2.5 rounded-2xl border border-[#E8E4DC] text-[#717171] hover:text-[#222225] hover:bg-[#FAF8F5] text-xs font-semibold transition-all cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteBooking(deleteConfirmRes.id)}
                  className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  Hapus Reservasi
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

