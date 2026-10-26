"use client"

import { 
  Wifi, 
  Waves, 
  Sparkles, 
  UtensilsCrossed, 
  Speaker, 
  Flame, 
  Droplets, 
  Car, 
  Wind, 
  ShieldCheck, 
  Coffee, 
  HeartPulse, 
  Compass, 
  Wine, 
  Zap, 
  Plane, 
  Sun,
  Leaf,
  CheckCircle2
} from "lucide-react"
import { VillaAmenity } from "@/lib/types"
import { useLocalization } from "@/lib/context/localization-context"

interface AmenitiesGridProps {
  amenities: VillaAmenity[]
}

const ICON_MAP: Record<string, React.ElementType> = {
  Wifi,
  Waves,
  Sparkles,
  UtensilsCrossed,
  Speaker,
  Flame,
  Droplets,
  Car,
  Wind,
  ShieldCheck,
  Coffee,
  HeartPulse,
  Compass,
  Wine,
  Zap,
  Plane,
  Sun,
  Leaf,
}

export function AmenitiesGrid({ amenities }: AmenitiesGridProps) {
  const { tc } = useLocalization()
  return (
    <div className="py-8 border-t border-[#EBEBEB]">
      <h3 className="font-serif text-2xl text-[#222222] mb-6">
        {tc("Curated Amenities & In-House Services")}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
        {amenities.map((amenity, index) => {
          const IconComponent = ICON_MAP[amenity.icon] || CheckCircle2

          return (
            <div key={index} className="flex items-center space-x-3 text-sm text-[#222222]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FAFAFA] border border-[#EBEBEB] text-[#222222]">
                <IconComponent className="h-4 w-4" />
              </div>
              <span className="font-normal">{tc(amenity.name)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
