"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ArrowUpRight, Bed, Bath, Users, Sparkles } from "lucide-react"
import { Villa } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { useLocalization } from "@/lib/context/localization-context"
import { BookingChannelModal } from "./booking-channel-modal"

interface VillaCardProps {
  villa: Villa
  priority?: boolean
}

export function VillaCard({ villa, priority = false }: VillaCardProps) {
  const { formatPrice, currency, t } = useLocalization()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="group flex flex-col space-y-4">
        {/* 4:5 Aspect Ratio Image Card with Hidden Overflow & 1.03x Hover Zoom */}
        <Link
          href={`/locations/${villa.areaSlug}/villas/${villa.slug}`}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#FAFAFA] border border-[#EBEBEB] block"
        >
          <Image
            src={villa.heroImage}
            alt={villa.name}
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Top Badges */}
          <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between pointer-events-none">
            {villa.guestFavorite ? (
              <Badge variant="superhost" className="text-xs font-medium tracking-tight bg-[#8C7F5F] text-white">
                {t("guestFavorite")}
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs font-medium">
                {villa.architecturalStyle}
              </Badge>
            )}

            <div className="flex items-center space-x-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-[#222222] shadow-xs backdrop-blur-xs">
              {villa.rating > 0 ? (
                <>
                  <Star className="h-3 w-3 fill-[#B8934C] text-[#B8934C]" />
                  <span>{villa.rating.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-xs text-[#8C7F5F]">New</span>
              )}
            </div>
          </div>

          {/* Bottom Location Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg bg-black/50 p-2.5 backdrop-blur-sm text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="font-light truncate">{villa.location}</span>
            <span className="shrink-0 flex items-center text-xs font-medium uppercase tracking-wider">
              {t("details")} <ArrowUpRight className="ml-0.5 h-3 w-3" />
            </span>
          </div>
        </Link>

        {/* Meta Content */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <Link
                href={`/locations/${villa.areaSlug}/villas/${villa.slug}`}
                className="text-base font-semibold tracking-tight text-[#222222] hover:text-[#8C7F5F] line-clamp-1 transition-colors"
              >
                {villa.name}
              </Link>
              <p className="text-xs text-[#717171] line-clamp-1">{villa.tagline}</p>
            </div>
          </div>

          {/* Spec Icons */}
          <div className="flex items-center space-x-3 text-xs text-[#717171] pt-0.5">
            <span className="flex items-center space-x-1">
              <Users className="h-3.5 w-3.5 text-[#8C7F5F]" />
              <span>{villa.capacity.guests} {t("guests")}</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center space-x-1">
              <Bed className="h-3.5 w-3.5 text-[#8C7F5F]" />
              <span>{villa.capacity.bedrooms} {t("bedrooms")}</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center space-x-1">
              <Bath className="h-3.5 w-3.5 text-[#8C7F5F]" />
              <span>{villa.capacity.bathrooms} {t("baths")}</span>
            </span>
          </div>

          {/* Pricing & Booking Channel Modal Trigger */}
          <div className="flex items-center justify-between pt-2 border-t border-[#F0ECE1]">
            <div>
              <span className="font-semibold text-base text-[#222222]">
                {formatPrice(villa.price.idr)}
              </span>
              <span className="text-xs text-[#717171]"> {t("perNight")}</span>
              {currency !== "IDR" && (
                <span className="block text-xs text-[#8C7F5F]">
                  ≈ {formatPrice(villa.price.idr, "IDR")} / malam
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#FAF6EE] text-[#6B4B2A] border border-[#E8DFC8] hover:bg-[#6B4B2A] hover:text-white transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Sparkles className="h-3 w-3" />
              <span>Book Options</span>
              <ArrowUpRight className="h-3 w-3 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Channel Booking Popup Modal */}
      <BookingChannelModal
        villa={villa}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

