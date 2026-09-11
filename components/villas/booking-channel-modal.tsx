"use client"

import { useState, useEffect } from "react"
import {
  X,
  Star,
  Coffee,
  Car,
  Award,
  ShieldCheck,
  CheckCircle2,
  PlaneTakeoff,
  PlaneLanding,
  ExternalLink,
  MessageCircle,
} from "lucide-react"
import { Villa } from "@/lib/types"
import { useLocalization } from "@/lib/context/localization-context"
import {
  trackBookingInquiry,
  trackWhatsAppClick,
  trackAirbnbClick,
  trackEvent,
} from "@/lib/analytics"

interface BookingChannelModalProps {

  villa: Villa
  isOpen: boolean
  onClose: () => void
}

type AirportTransferOption = "none" | "pickup" | "dropoff" | "roundtrip"

export function BookingChannelModal({ villa, isOpen, onClose }: BookingChannelModalProps) {
  const { formatPrice } = useLocalization()
  const [selectedTransfer, setSelectedTransfer] = useState<AirportTransferOption>("none")

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  // Transfer options metadata
  const transferOptions = [
    {
      id: "none",
      label: "No Airport Transfer",
      sublabel: "Standard stay only",
      price: 0,
    },
    {
      id: "pickup",
      label: "Airport Pick-up",
      sublabel: "Soekarno-Hatta / Halim Airport ➔ Villa",
      price: 350000,
      icon: PlaneLanding,
    },
    {
      id: "dropoff",
      label: "Airport Drop-off",
      sublabel: "Villa ➔ Airport Transfer",
      price: 350000,
      icon: PlaneTakeoff,
    },
    {
      id: "roundtrip",
      label: "Roundtrip Airport VIP Transfer",
      sublabel: "Pick-up + Drop-off (Best Value)",
      price: 600000,
      badge: "Save 15%",
      icon: Car,
    },
  ]

  // Generate WhatsApp message with upselling details
  const generateWhatsAppUrl = () => {
    let transferNote = ""
    if (selectedTransfer === "pickup") {
      transferNote = ` + Airport Pick-up Service (${formatPrice(350000)})`
    } else if (selectedTransfer === "dropoff") {
      transferNote = ` + Airport Drop-off Service (${formatPrice(350000)})`
    } else if (selectedTransfer === "roundtrip") {
      transferNote = ` + Roundtrip VIP Airport Transfer (${formatPrice(600000)})`
    }

    const message = `Hello Kinghouse! I would like to book "${villa.name}" (${villa.area}).\n\nRate: ${formatPrice(villa.price.idr)}/night\nUpselling Add-on:${transferNote ? transferNote : " None (Stay Only)"}\n\nPlease share available dates and direct booking perks!`
    return `https://wa.me/6282123933218?text=${encodeURIComponent(message)}`
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#E8E2D6] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner — Nakula Style Dark Bronze */}
        <div className="relative bg-[#2D2118] px-6 py-5 text-center text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D8B486]">
            BOOK DIRECT — EXCLUSIVE PERKS
          </p>
          <p className="mt-1 text-xs text-white/80 font-light">
            Every perk, only when you book directly with Kinghouse
          </p>
        </div>

        {/* Urgency / Social Proof Banner */}
        <div className="flex items-center justify-between border-b border-[#F0EBE1] bg-[#FDFBF7] px-6 py-2.5 text-[11px] text-[#554D42]">
          <div className="flex items-center space-x-1.5 font-medium">
            <span className="inline-block h-2 w-2 rounded-full bg-[#B8934C] animate-pulse" />
            <span>High demand in this season</span>
          </div>
          <div className="flex items-center space-x-1 text-[#7A7165]">
            <span>👁️ 3 guests viewing right now</span>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-5 scrollbar-thin">
          {/* Villa Summary */}
          <div className="flex items-center justify-between rounded-xl bg-[#FAF8F5] p-3.5 border border-[#EFE9DF]">
            <div>
              <p className="text-xs font-semibold text-[#222222] line-clamp-1">{villa.name}</p>
              <p className="text-[11px] text-[#717171]">{villa.location}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-[#222222]">
                {formatPrice(villa.price.idr)}
              </span>
              <span className="text-[10px] text-[#717171] block">/ malam</span>
            </div>
          </div>

          {/* Perks Grid / Cards */}
          <div className="space-y-2.5">
            {/* Perk 1 */}
            <div className="flex items-start space-x-3 rounded-xl border border-[#EFE9DF] bg-white p-3 shadow-xs">
              <div className="rounded-lg bg-[#FAF6EE] p-2 text-[#8C7F5F] shrink-0">
                <Star className="h-4 w-4 fill-[#8C7F5F]" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-[#222222]">Best rate, guaranteed</h4>
                <p className="text-[11px] text-[#717171]">
                  We match or beat any price you find elsewhere, with zero OTA commission markup.
                </p>
              </div>
            </div>

            {/* Perk 2 */}
            <div className="flex items-start space-x-3 rounded-xl border border-[#EFE9DF] bg-white p-3 shadow-xs">
              <div className="rounded-lg bg-[#FAF6EE] p-2 text-[#8C7F5F] shrink-0">
                <Coffee className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-[#222222]">Welcome Hospitality & Refreshments</h4>
                <p className="text-[11px] text-[#717171]">
                  Complimentary welcome amenities & direct concierge coordination on arrival.
                </p>
              </div>
            </div>

            {/* Perk 3 */}
            <div className="flex items-start space-x-3 rounded-xl border border-[#EFE9DF] bg-white p-3 shadow-xs">
              <div className="rounded-lg bg-[#FAF6EE] p-2 text-[#8C7F5F] shrink-0">
                <Car className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-[#222222]">1x Airport Pick-up Option*</h4>
                <p className="text-[11px] text-[#717171]">
                  Arrive with ease. Complimentary for extended stays (&ge;4 nights) or select as add-on below.
                </p>
              </div>
            </div>

            {/* Perk 4 */}
            <div className="flex items-start space-x-3 rounded-xl border border-[#EFE9DF] bg-white p-3 shadow-xs">
              <div className="rounded-lg bg-[#FAF6EE] p-2 text-[#8C7F5F] shrink-0">
                <Award className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-[#222222]">Kinghouse Member Perks</h4>
                <p className="text-[11px] text-[#717171]">
                  Priority early check-in / late check-out (subject to availability) & 24/7 butler line.
                </p>
              </div>
            </div>
          </div>

          {/* Upselling Section: Airport Transfer Options */}
          <div className="rounded-xl border border-[#E8DFC8] bg-[#FDFCF9] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Car className="h-4 w-4 text-[#8C7F5F]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#222222]">
                  Add Airport Transfer (Upsell Service)
                </h4>
              </div>
              <span className="text-[10px] font-semibold text-[#8C7F5F] uppercase">Optional</span>
            </div>
            <p className="text-[11px] text-[#717171]">
              Private air-conditioned MPV with dedicated Kinghouse chauffeur from Soekarno-Hatta (CGK) or Halim (HLP).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {transferOptions.map((opt) => {
                const isSelected = selectedTransfer === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedTransfer(opt.id as AirportTransferOption)}
                    className={`text-left p-2.5 rounded-lg border text-xs transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "border-[#8C7F5F] bg-[#FAF5EC] ring-1 ring-[#8C7F5F]"
                        : "border-[#EFE9DF] bg-white hover:bg-[#FAF8F5]"
                    }`}
                  >
                    {opt.badge && (
                      <span className="absolute top-2 right-2 text-[9px] font-bold bg-[#8C7F5F] text-white px-1.5 py-0.5 rounded-sm">
                        {opt.badge}
                      </span>
                    )}
                    <div>
                      <div className="flex items-center space-x-1.5 font-semibold text-[#222222]">
                        {opt.id !== "none" && <CheckCircle2 className={`h-3 w-3 ${isSelected ? "text-[#8C7F5F]" : "text-[#CCCCCC]"}`} />}
                        <span>{opt.label}</span>
                      </div>
                      <p className="text-[10px] text-[#717171] mt-0.5">{opt.sublabel}</p>
                    </div>
                    <div className="mt-2 text-right font-semibold text-[#222222]">
                      {opt.price > 0 ? formatPrice(opt.price) : <span className="text-[#8C7F5F]">Included</span>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Primary Action Button: Book Direct WhatsApp */}
          <div className="space-y-2 pt-1">
            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackBookingInquiry({
                  propertyName: villa.name,
                  channel: "direct_whatsapp",
                  estimatedTotal: villa.price.idr,
                })
                trackWhatsAppClick({
                  source: "booking_modal",
                  propertyName: villa.name,
                  value: villa.price.idr,
                })
              }}
              className="flex items-center justify-center space-x-2 w-full py-3.5 px-4 rounded-xl bg-[#2D2118] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#3D2E22] transition-all shadow-md active:scale-[0.99]"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              <span>Book Direct with Perks via WhatsApp →</span>
            </a>

            {/* Other Channel Options */}
            <div className="pt-2">
              <p className="text-center text-[10px] uppercase tracking-wider text-[#A69C8E] font-medium mb-2">
                — Or Book Via Travel Partner Channels —
              </p>
              <div className="grid grid-cols-2 gap-2">
                {/* Airbnb Button */}
                <a
                  href={villa.airbnbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackBookingInquiry({
                      propertyName: villa.name,
                      channel: "airbnb",
                      estimatedTotal: villa.price.idr,
                    })
                    trackAirbnbClick({
                      propertyName: villa.name,
                      airbnbUrl: villa.airbnbUrl,
                      nightlyPrice: villa.price.idr,
                      source: "booking_channel_modal",
                    })
                  }}
                  className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg border border-[#E51D53]/30 bg-[#FFF5F7] text-[#E51D53] hover:bg-[#FFE8EE] text-xs font-semibold transition-colors"
                >
                  <span>Book on Airbnb</span>
                  <ExternalLink className="h-3 w-3" />
                </a>

                {/* Agoda Button */}
                {villa.agodaUrl ? (
                  <a
                    href={villa.agodaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackBookingInquiry({
                        propertyName: villa.name,
                        channel: "agoda",
                        estimatedTotal: villa.price.idr,
                      })
                      trackEvent("agoda_outbound_click", {
                        property_name: villa.name,
                        agoda_url: villa.agodaUrl,
                      })
                    }}
                    className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg border border-[#003580]/30 bg-[#F0F5FD] text-[#003580] hover:bg-[#E1ECFB] text-xs font-semibold transition-colors"
                  >
                    <span>Book on Agoda</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <a
                    href={`https://wa.me/6282123933218?text=${encodeURIComponent(`Hello Kinghouse! I am inquiring about OTA booking for ${villa.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick({ source: "booking_modal", propertyName: villa.name, context: "ota_inquiry" })}
                    className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg border border-[#EBEBEB] bg-[#FAFAFA] text-[#717171] hover:bg-[#F2EFEB] text-xs font-medium transition-colors"
                  >
                    <span>Agoda Inquire</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Footer Guarantee */}
        <div className="flex items-center justify-center space-x-1.5 border-t border-[#F0EBE1] bg-[#FAF8F5] py-2.5 text-[10px] text-[#8C7F5F]">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Secure direct reservation &bull; Best Price Guarantee &bull; Verified Host</span>
        </div>
      </div>
    </div>
  )
}
