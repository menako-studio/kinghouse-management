"use client"

import { useState } from "react"
import { ArrowUpRight, MessageSquare, ShieldCheck, Sparkles } from "lucide-react"
import { Villa } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { useLocalization } from "@/lib/context/localization-context"
import { BookingChannelModal } from "./booking-channel-modal"
import {
  trackAirbnbClick,
  trackWhatsAppClick,
  trackEvent,
} from "@/lib/analytics"

interface BookingSidebarProps {

  villa: Villa
}

export function BookingSidebar({ villa }: BookingSidebarProps) {
  const { formatPrice, currency, t } = useLocalization()
  const [checkIn, setCheckIn] = useState("2026-09-10")
  const [checkOut, setCheckOut] = useState("2026-09-15")
  const [guestCount, setGuestCount] = useState("2")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Calculate nights & fees (IDR primary)
  const nights = 5
  const baseTotal = villa.price.idr * nights
  const cleaningFee = villa.price.cleaningFeeIdr
  const serviceFee = Math.round(baseTotal * (villa.price.serviceFeePercent / 100))
  const estimatedTotal = baseTotal + cleaningFee + serviceFee

  const whatsappMessage = encodeURIComponent(
    `Hello Kinghouse! I am interested in booking ${villa.name} in ${villa.area} for ${nights} nights (${checkIn} to ${checkOut}) for ${guestCount} guests. Please share availability and details.`
  )
  const whatsappUrl = `https://wa.me/6282123933218?text=${whatsappMessage}`

  return (
    <div className="sticky top-28 rounded-2xl border border-[#E8E4DC] bg-white p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
      {/* Price Header */}
      <div className="flex items-baseline justify-between pb-6 border-b border-[#F0ECE1]">
        <div>
          <div className="flex items-baseline space-x-1">
            <span className="font-serif text-3xl font-normal text-[#222222]">
              {formatPrice(villa.price.idr)}
            </span>
            <span className="text-sm text-[#717171]"> {t("perNight")}</span>
          </div>
          {currency !== "IDR" && (
            <span className="text-xs text-[#8C7F5F] block">
              ≈ {formatPrice(villa.price.idr, "IDR")} / malam
            </span>
          )}
        </div>

        <div className="text-right">
          <div className="flex items-center space-x-1 text-xs font-semibold text-[#222222]">
            <span>★ {villa.rating.toFixed(2)}</span>
            <span className="text-[#717171] font-normal">({villa.reviewsCount} reviews)</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-[#8C7F5F] font-semibold block">
            Airbnb Superhost
          </span>
        </div>
      </div>

      {/* Date & Guest Selector Box (Airbnb Style) */}
      <div className="my-6 overflow-hidden rounded-xl border border-[#E8E4DC] divide-y divide-[#E8E4DC]">
        <div className="grid grid-cols-2 divide-x divide-[#E8E4DC] bg-[#FAF8F5]">
          <div className="p-3">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#222222]">
              Check-in
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-xs text-[#222222] font-medium focus:outline-none cursor-pointer pt-0.5"
            />
          </div>
          <div className="p-3">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#222222]">
              Check-out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-xs text-[#222222] font-medium focus:outline-none cursor-pointer pt-0.5"
            />
          </div>
        </div>

        <div className="p-3 bg-white">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#222222]">
            Guests
          </label>
          <select
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            className="w-full bg-transparent text-xs text-[#222222] font-medium focus:outline-none cursor-pointer pt-0.5"
          >
            {Array.from({ length: villa.capacity.guests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? t("guests") : t("guests")}
              </option>
            ))}
          </select>
        </div>
      </div>

        {/* Primary & Secondary Conversion CTAs */}
        <div className="space-y-2.5">
          {/* Direct Booking Modal Button */}
          <Button
            size="lg"
            type="button"
            onClick={() => {
              trackEvent("open_booking_modal", {
                property_name: villa.name,
                check_in: checkIn,
                check_out: checkOut,
                guests: Number(guestCount),
              })
              setIsModalOpen(true)
            }}
            className="w-full h-13 bg-[#2D2118] text-white hover:bg-[#3D2E22] font-semibold text-xs uppercase tracking-widest shadow-md transition-all active:scale-[0.99] cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-[#D8B486] mr-2" />
            <span>Book Direct with Perks</span>
            <ArrowUpRight className="h-4 w-4 ml-1 text-[#D8B486]" />
          </Button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={villa.airbnbUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackAirbnbClick({
                  propertyName: villa.name,
                  airbnbUrl: villa.airbnbUrl,
                  nightlyPrice: villa.price.idr,
                  source: "booking_sidebar",
                })
              }}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg border border-[#E51D53]/30 bg-[#FFF5F7] text-[#E51D53] hover:bg-[#FFE8EE] text-xs font-semibold transition-colors text-center"
            >
              <span>Airbnb</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>

            {villa.agodaUrl ? (
              <a
                href={villa.agodaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("agoda_outbound_click", {
                    property_name: villa.name,
                    agoda_url: villa.agodaUrl,
                    source: "booking_sidebar",
                  })
                }}
                className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg border border-[#003580]/30 bg-[#F0F5FD] text-[#003580] hover:bg-[#E1ECFB] text-xs font-semibold transition-colors text-center"
              >
                <span>Agoda</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            ) : (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackWhatsAppClick({
                    source: "villa_detail",
                    propertyName: villa.name,
                    value: estimatedTotal,
                  })
                }}
                className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg border border-[#25D366]/30 bg-[#F0FDF4] text-[#15803D] hover:bg-[#DCFCE7] text-xs font-semibold transition-colors text-center"
              >
                <span>WhatsApp</span>
                <MessageSquare className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>


        <p className="mt-3 text-center text-[11px] text-[#717171]">
          Best Price Guarantee &bull; Verified Airbnb Superhost &bull; 24/7 Concierge
        </p>

        {/* Multi-Channel Modal */}
        <BookingChannelModal
          villa={villa}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

      {/* Pricing Breakdown */}
      <div className="mt-6 pt-6 border-t border-[#F0ECE1] space-y-2.5 text-xs text-[#717171]">
        <div className="flex justify-between">
          <span className="underline decoration-dotted">
            {formatPrice(villa.price.idr)} x {nights} nights
          </span>
          <span className="text-[#222222] font-medium">{formatPrice(baseTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="underline decoration-dotted">Cleaning & Linen Preparation</span>
          <span className="text-[#222222] font-medium">{formatPrice(cleaningFee)}</span>
        </div>
        <div className="flex justify-between">
          <span className="underline decoration-dotted">Airbnb Service Fee (est.)</span>
          <span className="text-[#222222] font-medium">{formatPrice(serviceFee)}</span>
        </div>

        <div className="flex justify-between pt-3 border-t border-[#F0ECE1] text-sm font-semibold text-[#222222]">
          <span>Estimated Total ({currency})</span>
          <span className="text-[#8C7F5F] font-bold">{formatPrice(estimatedTotal)}</span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t border-[#F0ECE1] space-y-2 text-[11px] text-[#717171]">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-[#8C7F5F]" />
          <span>Best Price Guarantee & Verified Airbnb Superhost</span>
        </div>
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-[#B8934C]" />
          <span>Kinghouse dedicated on-site butler & daily housekeeping</span>
        </div>
      </div>
    </div>
  )
}
