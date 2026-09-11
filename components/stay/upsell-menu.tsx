"use client"

import { useState, useMemo } from "react"
import {
  Sparkles,
  Clock,
  Flame,
  BedDouble,
  Coffee,
  Sunset,
  Plus,
  Minus,
  MessageCircle,
  ShoppingBag,
  Check,
} from "lucide-react"
import { UpsellService } from "@/lib/guest-guide/types"
import {
  calculateUpsellOrder,
  generateUpsellWhatsAppUrl,
  SelectedUpsellItem,
} from "@/lib/guest-guide/calculations"

interface UpsellMenuProps {
  services: UpsellService[]
  propertySlug: string
  propertyName: string
  whatsappPhone: string
}

const ICON_MAP: Record<string, typeof Clock> = {
  Clock,
  Sunset,
  Flame,
  BedDouble,
  Sparkles,
  Coffee,
}

export function UpsellMenu({
  services,
  propertySlug,
  propertyName,
  whatsappPhone,
}: UpsellMenuProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [guestName, setGuestName] = useState("")
  const [notes, setNotes] = useState("")

  // Filter services applicable to this property
  const availableServices = useMemo(() => {
    return services.filter(
      (s) => !s.applicableSlugs || s.applicableSlugs.includes(propertySlug)
    )
  }, [services, propertySlug])

  const selectedItems: SelectedUpsellItem[] = useMemo(() => {
    return Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([serviceId, quantity]) => ({ serviceId, quantity }))
  }, [quantities])

  const orderSummary = useMemo(() => {
    return calculateUpsellOrder(selectedItems)
  }, [selectedItems])

  const handleIncrement = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }))
  }

  const handleDecrement = (id: string) => {
    setQuantities((prev) => {
      const current = prev[id] || 0
      if (current <= 1) {
        const copy = { ...prev }
        delete copy[id]
        return copy
      }
      return { ...prev, [id]: current - 1 }
    })
  }

  const whatsappUrl = useMemo(() => {
    return generateUpsellWhatsAppUrl(
      whatsappPhone,
      propertyName,
      guestName,
      orderSummary,
      notes
    )
  }, [whatsappPhone, propertyName, guestName, orderSummary, notes])

  const formatIdr = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <div className="rounded-3xl border border-stone-800 bg-stone-950/90 p-6 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between border-b border-stone-800/80 pb-5 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            In-Stay Add-Ons & Enhancements
          </div>
          <h3 className="text-xl font-bold text-stone-100 font-serif">
            Layanan & Fasilitas Tambahan
          </h3>
          <p className="text-sm text-stone-400 mt-1">
            Pesan langsung ke tim operasional Kinghouse via WhatsApp tanpa biaya platform.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {availableServices.map((service) => {
          const IconComponent = ICON_MAP[service.icon] || Sparkles
          const qty = quantities[service.id] || 0
          const isSelected = qty > 0

          return (
            <div
              key={service.id}
              className={`group relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-300 ${
                isSelected
                  ? "border-amber-500/50 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                  : "border-stone-800/80 bg-stone-900/40 hover:border-stone-700 hover:bg-stone-900/70"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                        isSelected
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-stone-800 text-stone-400 border-stone-700/60 group-hover:text-stone-200"
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-stone-100">
                        {service.title}
                      </h4>
                      <span className="text-xs text-amber-400 font-medium">
                        {formatIdr(service.priceIdr)}{" "}
                        <span className="text-stone-400 font-normal">
                          / {service.unit}
                        </span>
                      </span>
                    </div>
                  </div>

                  {service.popular && (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-300 uppercase tracking-wider border border-amber-500/20">
                      Popular
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-4">
                  {service.description}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between border-t border-stone-800/60 pt-3">
                <span className="text-xs text-stone-400 font-medium">
                  {isSelected ? `Subtotal: ${formatIdr(service.priceIdr * qty)}` : "Pilih jumlah"}
                </span>

                <div className="flex items-center gap-2">
                  {isSelected && (
                    <>
                      <button
                        onClick={() => handleDecrement(service.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white transition-all active:scale-95 border border-stone-700/50"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-stone-100">
                        {qty}
                      </span>
                    </>
                  )}

                  <button
                    onClick={() => handleIncrement(service.id)}
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all active:scale-95 ${
                      isSelected
                        ? "bg-amber-500 text-stone-950 hover:bg-amber-400"
                        : "bg-stone-800 text-stone-200 hover:bg-stone-700 border border-stone-700"
                    }`}
                  >
                    <Plus className="h-3 w-3" />
                    {isSelected ? "" : "Tambah"}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Checkout Drawer / Order Box */}
      {orderSummary.items.length > 0 ? (
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-stone-900/90 to-amber-950/20 p-5 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2 text-stone-200 font-semibold text-sm">
              <ShoppingBag className="h-4 w-4 text-amber-400" />
              Pesanan Layanan Anda ({orderSummary.items.length} item)
            </div>
            <div className="text-right">
              <div className="text-xs text-stone-400">Total Biaya</div>
              <div className="text-lg font-bold text-amber-300 font-mono">
                {formatIdr(orderSummary.totalAmountIdr)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Nama Tamu (Opsional)
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full rounded-xl border border-stone-800 bg-stone-950/80 px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:border-amber-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Catatan Waktu / Permintaan
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Tolong siapkan sebelum jam 17:00"
                className="w-full rounded-xl border border-stone-800 bg-stone-950/80 px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:border-amber-500/50 focus:outline-none"
              />
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-950/50 active:scale-[0.99]"
          >
            <MessageCircle className="h-4 w-4" />
            Kirim Permintaan via WhatsApp Concierge
          </a>
        </div>
      ) : (
        <div className="text-center py-4 border-t border-stone-800/60">
          <p className="text-xs text-stone-400">
            Klik tombol <span className="font-semibold text-stone-300">+ Tambah</span> pada layanan di atas untuk menghitung pesanan dan mengirimkannya ke WhatsApp staf villa.
          </p>
        </div>
      )}
    </div>
  )
}
