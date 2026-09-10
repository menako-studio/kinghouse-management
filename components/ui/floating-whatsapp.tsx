"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { trackWhatsAppClick } from "@/lib/analytics"

export function FloatingWhatsApp() {
  const [isTooltipDismissed, setIsTooltipDismissed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const phoneNumber = "6282123933218"
  const defaultMessage = encodeURIComponent(
    "Hello KingHouse Hospitality! I would like to inquire about villa booking and property management services."
  )
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`

  const handleClick = () => {
    trackWhatsAppClick({
      source: "floating",
      context: "sticky_concierge",
    })
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center flex-col sm:flex-row-reverse gap-3 select-none print:hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label="Direct WhatsApp Concierge"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition-all duration-300 hover:scale-108 hover:shadow-[0_12px_36px_rgba(37,211,102,0.5)] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 active:scale-95"
      >
        {/* Subtle Ambient Pulse Ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping group-hover:hidden" />

        {/* WhatsApp Vector Icon */}
        <MessageCircle className="h-7 w-7 fill-white text-white transition-transform group-hover:scale-110" />

        {/* Online Status Dot */}
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
        </span>
      </a>

      {/* Floating Concierge Badge / Tooltip */}
      {!isTooltipDismissed && (
        <div
          className={`hidden sm:flex items-center space-x-3 rounded-2xl bg-white/95 px-4 py-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.1)] border border-[#E8E4DC] backdrop-blur-md transition-all duration-300 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-90 -translate-x-1"
          }`}
        >
          <div className="flex flex-col text-left">
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-semibold tracking-wider text-[#222222] uppercase">
                KingHouse Concierge
              </span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[10px] text-[#666666] font-light">
              Need assistance? WhatsApp us directly
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsTooltipDismissed(true)
            }}
            className="text-[#999999] hover:text-[#333333] transition-colors p-0.5 rounded-full hover:bg-black/5"
            aria-label="Dismiss tooltip"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
