import { MapPin, Navigation, Coffee, Compass, Plane, Utensils, Waves } from "lucide-react"
import { NearbySpot } from "@/lib/types"
import { contentTranslator } from "@/lib/i18n/content"
import type { SiteLocale } from "@/lib/i18n/site"

interface LocationProximityMapProps {
  location: string
  area: string
  nearbySpots: NearbySpot[]
}

const SPOT_ICONS: Record<string, React.ElementType> = {
  beach: Waves,
  cafe: Coffee,
  dining: Utensils,
  airport: Plane,
  landmark: Compass,
}

export function LocationProximityMap({ location, area, nearbySpots, locale }: LocationProximityMapProps & { locale: SiteLocale }) {
  const tc = contentTranslator(locale)
  return (
    <div className="py-8 border-t border-[#EBEBEB] space-y-6">
      <div>
        <h3 className="font-serif text-2xl text-[#222222] mb-2">
          {tc("Location & Proximity")}
        </h3>
        <p className="text-sm text-[#717171]">
          {tc("Situated in {location}. Exact address provided immediately upon confirmed Airbnb booking for guest privacy.", { location: tc(location) })}
        </p>
      </div>

      {/* Stylized Minimalist Map Graphic Card */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl border border-[#EBEBEB] bg-[#F7F6F2] flex items-center justify-center p-6 text-center">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(#D5D0C7 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Circular Radar / Area Marker */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#A69C8E]/20 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-[#A69C8E]/30" />
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#222222] text-white shadow-lg">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          <span className="mt-3 font-serif text-base font-medium text-[#222222]">
            {tc("{area} Sanctuary Zone", { area })}
          </span>
          <span className="text-xs text-[#717171] uppercase tracking-wider">
            {tc("Protected Privacy Radius")}
          </span>
        </div>
      </div>

      {/* Proximity Distance Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {nearbySpots.map((spot, idx) => {
          const SpotIcon = SPOT_ICONS[spot.category] || Navigation

          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 rounded-xl border border-[#EBEBEB] bg-[#FAFAFA]"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-[#EBEBEB] text-[#222222]">
                  <SpotIcon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#222222]">{tc(spot.name)}</h4>
                  <p className="text-xs text-[#717171] capitalize">{tc(spot.category)}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-[#222222]">{spot.distance}</span>
                <span className="block text-xs text-[#A69C8E]">{tc(spot.travelTime)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
