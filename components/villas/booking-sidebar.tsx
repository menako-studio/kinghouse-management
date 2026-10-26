"use client"

import { useState } from "react"
import { ArrowUpRight, BellRing, CalendarCheck, CalendarX, MessageSquare, ShieldCheck, Sparkles } from "lucide-react"
import { Villa } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLocalization } from "@/lib/context/localization-context"
import { BookingChannelModal } from "./booking-channel-modal"
import {
  trackAirbnbClick,
  trackCheckAvailability,
  trackWhatsAppClick,
  trackEvent,
} from "@/lib/analytics"
import { addDays, nightsBetween, type DateRange } from "@/lib/funnel/availability"
import { buildWhatsAppUrl, stayWhatsAppMessage } from "@/lib/funnel/whatsapp"
import { formatDateFor } from "@/lib/i18n/funnel"
import { submitLead } from "@/lib/funnel/client"
import { HoneypotField } from "@/components/funnel/form-fields"

type AvailabilityState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "available"; verified: boolean }
  | { status: "unavailable"; alternatives: DateRange[] }
  | { status: "error" }

/** Local (WIB on visitors' devices) YYYY-MM-DD, `offsetDays` from today. */
function localIsoDate(offsetDays: number): string {
  const d = new Date()
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  return addDays(today, offsetDays)
}

interface BookingSidebarProps {

  villa: Villa
}

export function BookingSidebar({ villa }: BookingSidebarProps) {
  const { formatPrice, currency, t, language, tc } = useLocalization()
  const [checkIn, setCheckIn] = useState(() => localIsoDate(14))
  const [checkOut, setCheckOut] = useState(() => localIsoDate(16))
  const [guestCount, setGuestCount] = useState("2")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [availability, setAvailability] = useState<AvailabilityState>({ status: "idle" })
  const [notify, setNotify] = useState({ name: "", whatsapp: "", website: "" })
  const [notifyState, setNotifyState] = useState<"idle" | "sending" | "sent" | "error">("idle")

  // Calculate nights & fees (IDR primary) from the selected dates
  const nights = Math.max(0, nightsBetween(checkIn, checkOut))
  const hasValidDates = nights >= 1
  const baseTotal = villa.price.idr * nights
  const cleaningFee = villa.price.cleaningFeeIdr
  const serviceFee = Math.round(baseTotal * (villa.price.serviceFeePercent / 100))
  const estimatedTotal = baseTotal + cleaningFee + serviceFee

  const whatsappUrl = buildWhatsAppUrl(
    "STAY",
    stayWhatsAppMessage(
      {
        propertyName: villa.name,
        checkIn: hasValidDates ? checkIn : undefined,
        checkOut: hasValidDates ? checkOut : undefined,
        guests: Number(guestCount),
      },
      { t, language }
    )
  )
  const dateRange = `${formatDateFor(language, checkIn)} – ${formatDateFor(language, checkOut)}`
  const nightsLabel = nights === 1 ? t("f.night") : t("f.nights", { n: nights })

  const changeDates = (nextIn: string, nextOut: string) => {
    setCheckIn(nextIn)
    setCheckOut(nextOut)
    setAvailability({ status: "idle" })
    setNotifyState("idle")
  }

  const checkAvailability = async () => {
    if (!hasValidDates) return
    setAvailability({ status: "checking" })
    let next: AvailabilityState
    try {
      const params = new URLSearchParams({ villa: villa.slug, checkIn, checkOut })
      const res = await fetch(`/api/availability?${params.toString()}`)
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as { available: boolean; verified: boolean; alternatives: DateRange[] }
      next = data.available
        ? { status: "available", verified: data.verified }
        : { status: "unavailable", alternatives: data.alternatives }
    } catch {
      next = { status: "error" }
    }
    setAvailability(next)
    trackCheckAvailability({
      propertyName: villa.name,
      checkIn,
      checkOut,
      guests: Number(guestCount),
      available: next.status === "available" ? true : next.status === "unavailable" ? false : null,
      verified: next.status === "available" ? next.verified : undefined,
    })
  }

  const submitNotify = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotifyState("sending")
    const result = await submitLead(
      {
        target: "STAY",
        need: "notify",
        name: notify.name,
        whatsapp: notify.whatsapp,
        property: villa.name,
        checkIn,
        checkOut,
        guests: Number(guestCount),
        website: notify.website,
      },
      { language, propertySlug: villa.slug }
    )
    setNotifyState(result.ok ? "sent" : "error")
  }

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
              ≈ {formatPrice(villa.price.idr, "IDR")} {t("perNight")}
            </span>
          )}
        </div>

        <div className="text-right">
          <div className="flex items-center space-x-1 text-xs font-semibold text-[#222222]">
            <span>★ {villa.rating.toFixed(2)}</span>
            <span className="text-[#717171] font-normal">({tc("{count} reviews", { count: villa.reviewsCount })})</span>
          </div>
          <span className="text-xs uppercase tracking-wider text-[#8C7F5F] font-semibold block">
            Airbnb Superhost
          </span>
        </div>
      </div>

      {/* Date & Guest Selector Box (Airbnb Style) */}
      <div className="my-6 overflow-hidden rounded-xl border border-[#E8E4DC] divide-y divide-[#E8E4DC]">
        <div className="grid grid-cols-2 divide-x divide-[#E8E4DC] bg-[#FAF8F5]">
          <div className="p-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#222222]">
              {tc("Check-in")}
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => changeDates(e.target.value, checkOut)}
              className="w-full bg-transparent text-xs text-[#222222] font-medium focus:outline-none cursor-pointer pt-0.5"
            />
          </div>
          <div className="p-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#222222]">
              {tc("Check-out")}
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn ? addDays(checkIn, 1) : undefined}
              onChange={(e) => changeDates(checkIn, e.target.value)}
              className="w-full bg-transparent text-xs text-[#222222] font-medium focus:outline-none cursor-pointer pt-0.5"
            />
          </div>
        </div>

        <div className="p-3 bg-white">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#222222]">
            {tc("Guests")}
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

        {/* Funnel B1: availability check before booking, no chat needed */}
        <div className="mb-4 space-y-3">
          {!hasValidDates ? (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">{t("f.stay.datesInvalid")}</p>
          ) : (
            <button
              type="button"
              onClick={checkAvailability}
              disabled={availability.status === "checking"}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#2D2118] bg-white py-3 text-sm font-semibold text-[#2D2118] transition-colors hover:bg-[#FAF8F5] disabled:opacity-60"
            >
              <CalendarCheck className="h-4 w-4" />
              {availability.status === "checking" ? t("f.stay.checking") : t("f.stay.check")}
            </button>
          )}

          {availability.status === "available" && (
            <div
              role="status"
              className={`space-y-1 rounded-xl border p-3 text-sm ${
                availability.verified
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-amber-200 bg-amber-50 text-amber-900"
              }`}
            >
              <p className="font-semibold">{t(availability.verified ? "f.stay.available" : "f.stay.likely")}</p>
              <p>{t("f.stay.summary", { dates: dateRange, nights: nightsLabel, total: formatPrice(estimatedTotal) })}</p>
              {/* No live OTA calendar for this check: don't promise the dates */}
              <p>{t(availability.verified ? "f.stay.continue" : "f.stay.unverified")}</p>
            </div>
          )}

          {availability.status === "error" && (
            <p role="status" className="rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] p-3 text-sm text-[#5C5347]">
              {t("f.stay.error")}
            </p>
          )}

          {availability.status === "unavailable" && (
            <div role="status" className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
              <p className="flex items-center gap-1.5 font-semibold">
                <CalendarX className="h-4 w-4" /> {t("f.stay.taken")}
              </p>
              {availability.alternatives.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[#5C5347]">{t("f.stay.nearest")}</p>
                  <div className="flex flex-wrap gap-2">
                    {availability.alternatives.map((alt) => (
                      <button
                        key={alt.checkIn}
                        type="button"
                        onClick={() => changeDates(alt.checkIn, alt.checkOut)}
                        className="cursor-pointer rounded-full border border-[#8C7F5F] bg-white px-3 py-1.5 text-sm font-semibold text-[#5C5347] hover:bg-[#FAF8F5]"
                      >
                        {formatDateFor(language, alt.checkIn)} – {formatDateFor(language, alt.checkOut)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {notifyState === "sent" ? (
                <p className="rounded-lg bg-white p-2.5 text-[#5C5347]">{t("f.stay.notifySent")}</p>
              ) : (
                <form onSubmit={submitNotify} className="relative space-y-2 rounded-lg bg-white p-3 text-[#222222]">
                  <HoneypotField value={notify.website} onChange={(v) => setNotify((n) => ({ ...n, website: v }))} />
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-[#5C5347]">
                    <BellRing className="h-4 w-4" /> {t("f.stay.notifyTitle")}
                  </p>
                  <Input
                    required
                    minLength={2}
                    autoComplete="name"
                    placeholder={t("f.stay.notifyName")}
                    aria-label={t("f.stay.notifyName")}
                    value={notify.name}
                    onChange={(e) => setNotify((n) => ({ ...n, name: e.target.value }))}
                    className="h-11 text-base"
                  />
                  <Input
                    required
                    type="tel"
                    autoComplete="tel"
                    placeholder={t("f.field.whatsapp")}
                    aria-label={t("f.field.whatsapp")}
                    value={notify.whatsapp}
                    onChange={(e) => setNotify((n) => ({ ...n, whatsapp: e.target.value }))}
                    className="h-11 text-base"
                  />
                  {notifyState === "error" && <p className="text-sm text-red-700">{t("f.stay.notifyError")}</p>}
                  <button
                    type="submit"
                    disabled={notifyState === "sending"}
                    className="w-full cursor-pointer rounded-lg bg-[#2D2118] py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {notifyState === "sending" ? t("f.sending") : t("f.stay.notifySubmit")}
                  </button>
                </form>
              )}
            </div>
          )}
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
            <span>{tc("Book Direct with Perks")}</span>
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
                    funnel: "stay",
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


        <p className="mt-3 text-center text-xs text-[#717171]">
          {tc("Best Price Guarantee • Verified Airbnb Superhost • 24/7 Concierge")}
        </p>

        {/* Help channel — WhatsApp is a fallback, not the booking path */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackWhatsAppClick({
              source: "villa_detail",
              funnel: "stay",
              propertyName: villa.name,
              context: "help_link",
              value: hasValidDates ? estimatedTotal : undefined,
            })
          }
          className="mt-2 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#15803D] hover:underline"
        >
          <MessageSquare className="h-4 w-4" /> {t("f.stay.help")}
        </a>

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
            {formatPrice(villa.price.idr)} × {nightsLabel}
          </span>
          <span className="text-[#222222] font-medium">{formatPrice(baseTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="underline decoration-dotted">{tc("Cleaning & Linen Preparation")}</span>
          <span className="text-[#222222] font-medium">{formatPrice(cleaningFee)}</span>
        </div>
        <div className="flex justify-between">
          <span className="underline decoration-dotted">{tc("Airbnb Service Fee (est.)")}</span>
          <span className="text-[#222222] font-medium">{formatPrice(serviceFee)}</span>
        </div>

        <div className="flex justify-between pt-3 border-t border-[#F0ECE1] text-sm font-semibold text-[#222222]">
          <span>{tc("Estimated Total")} ({currency})</span>
          <span className="text-[#8C7F5F] font-bold">{formatPrice(estimatedTotal)}</span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t border-[#F0ECE1] space-y-2 text-xs text-[#717171]">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-[#8C7F5F]" />
          <span>{tc("Best Price Guarantee & Verified Airbnb Superhost")}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-[#B8934C]" />
          <span>{tc("Kinghouse dedicated on-site butler & daily housekeeping")}</span>
        </div>
      </div>
    </div>
  )
}
