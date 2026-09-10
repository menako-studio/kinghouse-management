"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  Star,
  Users,
  Bed,
  Bath,
  Maximize2,
  Sparkles,
  Check,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react"
import { MANAGED_AREAS } from "@/lib/constants"
import { CURATED_VILLAS } from "@/lib/data"
import { Villa } from "@/lib/types"
import { useLocalization } from "@/lib/context/localization-context"
import { BookingChannelModal } from "@/components/villas/booking-channel-modal"
import { trackSearchFilter, trackWhatsAppClick, trackEvent } from "@/lib/analytics"

type SortOption = "recommended" | "price-asc" | "price-desc" | "rating"


// Nakula Editorial Card matching properties.png
function NakulaVillaCard({ villa }: { villa: Villa }) {
  const { formatPrice } = useLocalization()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Specs & pills computation
  const isEventCapable = villa.id === "villa-1" || villa.capacity.bedrooms >= 4
  const areaSqm = villa.id === "villa-1" ? 500 : villa.id === "villa-4" ? 65 : villa.id === "villa-3" ? 48 : 38

  const pillTags = useMemo(() => {
    const tags = []
    if (villa.id === "villa-1") {
      tags.push("Private Pool", "Suitable for Event", "Chef Available*", "Daily Cleaning", "Large Garden")
    } else if (villa.id === "villa-2") {
      tags.push("IKEA 5min", "High-Speed WiFi", "Work Desk", "Daily Cleaning")
    } else if (villa.id === "villa-3") {
      tags.push("Central Jakarta", "Modern Kitchen", "City Skyline", "Self Check-in")
    } else {
      tags.push("Executive Suite", "Gym & Pool Access", "Japanese Mall 2min", "Smart Lock")
    }
    return tags
  }, [villa.id])

  return (
    <>
      <article className="group flex flex-col space-y-4">
        {/* Landscape Image with Bottom Overlays */}
        <Link
          href={`/locations/${villa.areaSlug}/villas/${villa.slug}`}
          className="relative aspect-[16/10] sm:aspect-[16/10.5] w-full overflow-hidden rounded-2xl bg-[#F3EFE6] border border-[#E8E4DC] block"
        >
          <Image
            src={villa.heroImage}
            alt={villa.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
          />

          {/* Dark gradient base for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

          {/* Bottom Left: Start From IDR Price Overlay */}
          <div className="absolute bottom-3.5 left-4 text-white">
            <span className="text-[10px] uppercase font-medium tracking-wider text-white/80 block">
              Start From
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-semibold text-base sm:text-lg tracking-tight text-white">
                {formatPrice(villa.price.idr)}
              </span>
              <span className="text-[11px] text-white/80 font-light">/ Night</span>
            </div>
          </div>

          {/* Bottom Right: Circular Arrow Action Button */}
          <div className="absolute bottom-3.5 right-4 h-9 w-9 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-sm">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </Link>

        {/* Card Body Information */}
        <div className="space-y-2.5">
          {/* Location & Reviews Row */}
          <div className="flex items-center space-x-2 text-xs text-[#6B6862]">
            <span className="font-medium text-[#222225]">{villa.location}</span>
            <span>&bull;</span>
            <div className="flex items-center space-x-1">
              <Star className="h-3.5 w-3.5 fill-[#B8934C] text-[#B8934C]" />
              <span className="font-semibold text-[#222225]">
                {villa.rating > 0 ? villa.rating.toFixed(1) : "5.0"}
              </span>
              <span className="text-[#6B6862]">({villa.reviewsCount || 10} Reviews)</span>
            </div>
          </div>

          {/* Villa Name */}
          <Link href={`/locations/${villa.areaSlug}/villas/${villa.slug}`}>
            <h2 className="font-serif text-xl sm:text-2xl text-[#222225] font-normal leading-snug group-hover:text-[#8C7F5F] transition-colors line-clamp-1">
              {villa.name}
            </h2>
          </Link>

          {/* Specs Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#6B6862] pt-0.5">
            <span className="flex items-center space-x-1.5">
              <Users className="h-3.5 w-3.5 text-[#8C7F5F]" />
              <span>{villa.capacity.guests} Guests</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Bed className="h-3.5 w-3.5 text-[#8C7F5F]" />
              <span>{villa.capacity.bedrooms} Bedroom{villa.capacity.bedrooms > 1 ? "s" : ""}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Bath className="h-3.5 w-3.5 text-[#8C7F5F]" />
              <span>{villa.capacity.bathrooms} Bathroom{villa.capacity.bathrooms > 1 ? "s" : ""}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Maximize2 className="h-3.5 w-3.5 text-[#8C7F5F]" />
              <span>{areaSqm} m²</span>
            </span>
          </div>

          {/* Suitable for Event Flag */}
          {isEventCapable && (
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#8C7F5F]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Suitable for Event</span>
            </div>
          )}

          {/* Feature Tags / Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {pillTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FAF8F5] text-[#6B6862] border border-[#E8E4DC]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Direct Booking Modal Quick Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-xs text-[#8C7F5F] hover:text-[#222225] font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <span>View Multi-Channel Booking Options</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </article>

      <BookingChannelModal
        villa={villa}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

function VillasCatalogContent() {
  const searchParams = useSearchParams()
  const initialArea = searchParams.get("area") || "all"

  // Filter State
  const [propertyTypes, setPropertyTypes] = useState<string[]>([])
  const [selectedArea, setSelectedArea] = useState<string>(initialArea)
  const [selectedRooms, setSelectedRooms] = useState<string>("all")
  const [availabilityDate, setAvailabilityDate] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [gridSearchQuery, setGridSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState<SortOption>("recommended")
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)

  // Accordion state for FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Property Type Checkbox Toggle
  const togglePropertyType = (type: string) => {
    trackSearchFilter({
      filterType: "property_type",
      filterValue: type,
    })
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  // Clear / Reset All Filters
  const handleClear = () => {
    trackSearchFilter({
      filterType: "clear_all",
      filterValue: "reset",
    })
    setPropertyTypes([])
    setSelectedArea("all")
    setSelectedRooms("all")
    setAvailabilityDate("")
    setSearchQuery("")
    setGridSearchQuery("")
    setSortBy("recommended")
  }


  // Check if any filter is active
  const isFilterActive = useMemo(() => {
    return (
      propertyTypes.length > 0 ||
      selectedArea !== "all" ||
      selectedRooms !== "all" ||
      availabilityDate !== "" ||
      searchQuery.trim() !== "" ||
      gridSearchQuery.trim() !== ""
    )
  }, [propertyTypes, selectedArea, selectedRooms, availabilityDate, searchQuery, gridSearchQuery])

  // Filtered Villas
  const filteredVillas = useMemo(() => {
    return CURATED_VILLAS.filter((villa) => {
      // Sidebar Search & Grid Search
      const query = (searchQuery || gridSearchQuery).trim().toLowerCase()
      if (query) {
        const matchName = villa.name.toLowerCase().includes(query)
        const matchLocation = villa.location.toLowerCase().includes(query)
        const matchArea = villa.area.toLowerCase().includes(query)
        if (!matchName && !matchLocation && !matchArea) return false
      }

      // Area Filter
      if (selectedArea !== "all" && villa.areaSlug !== selectedArea) return false

      // Rooms Filter
      if (selectedRooms === "1" && villa.capacity.bedrooms !== 1) return false
      if (selectedRooms === "2-4" && (villa.capacity.bedrooms < 2 || villa.capacity.bedrooms > 4)) return false
      if (selectedRooms === "5+" && villa.capacity.bedrooms < 5) return false

      // Property Type Checkboxes
      if (propertyTypes.length > 0) {
        let matchAnyType = false
        if (propertyTypes.includes("events") && (villa.id === "villa-1" || villa.capacity.bedrooms >= 4)) {
          matchAnyType = true
        }
        if (propertyTypes.includes("up-to-4") && villa.capacity.bedrooms <= 4) {
          matchAnyType = true
        }
        if (propertyTypes.includes("5-plus") && villa.capacity.bedrooms >= 5) {
          matchAnyType = true
        }
        if (propertyTypes.includes("apartment") && villa.propertyType === "entire-apartment") {
          matchAnyType = true
        }
        if (!matchAnyType) return false
      }

      return true
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price.idr - b.price.idr
      if (sortBy === "price-desc") return b.price.idr - a.price.idr
      if (sortBy === "rating") return b.rating - a.rating
      return 0
    })
  }, [searchQuery, gridSearchQuery, selectedArea, selectedRooms, propertyTypes, sortBy])

  const faqs = [
    {
      q: "Why choose a large private villa in Jabodetabek for group or family stays?",
      a: "Our private villas like Versatile House in Jagakarsa offer 500m² of private garden, swimming pool, and bespoke luxury amenities designed specifically for multi-generational families and intimate gatherings with zero intrusion.",
    },
    {
      q: "What facilities are included in KingHouse standalone residences?",
      a: "Every KingHouse residence includes high-speed Wi-Fi, fully equipped kitchenettes, air conditioning in all rooms, daily housekeeping, premium linens, parking spaces, and dedicated guest concierge support.",
    },
    {
      q: "Are the villas suitable for private events and celebrations?",
      a: "Yes! Versatile House Jagakarsa is fully equipped for garden weddings, corporate offsites, and birthdays with up to 50 guests, zero vendor corkage fees, and flexible room configuration options.",
    },
    {
      q: "How do KingHouse private residences compare to hotel accommodations?",
      a: "KingHouse offers expansive square footage, dedicated living and dining areas, total privacy, and multi-bedroom setups that provide far better value and communal warmth for families compared to booking multiple hotel rooms.",
    },
    {
      q: "What should you consider before booking a standalone villa?",
      a: "Check your required guest headcount, parking accessibility, and whether you require event hosting permissions. Our WhatsApp concierge is available 24/7 to assist with date verification and personalized requests.",
    },
  ]

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#222225]">
      {/* 1. Hero Banner Matching properties.png */}
      <section className="relative h-[48vh] sm:h-[58vh] flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg"
          alt="Large private villas with over 5 bedrooms"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/35" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-3">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal uppercase tracking-wide leading-tight">
            LARGE PRIVATE VILLAS
            <br />
            WITH OVER 5 BEDROOMS
            <br />
            <span className="text-[#DFC58E] tracking-widest text-2xl sm:text-4xl">KINGHOUSE</span>
          </h1>
        </div>
      </section>

      {/* 2. Breadcrumbs & Subtitle Introduction */}
      <section className="border-b border-[#E8E4DC] bg-[#FAF8F5] py-6 text-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-2.5">
          <nav className="text-[11px] uppercase tracking-widest text-[#6B6862] flex items-center justify-center space-x-2">
            <Link href="/" className="hover:text-[#222225] transition-colors">
              HOME
            </Link>
            <span>/</span>
            <Link href="/villas" className="text-[#8C7F5F] font-semibold">
              PROPERTIES
            </Link>
            <span>/</span>
            <span>PROPERTY TYPE</span>
            <span>/</span>
            <span>STANDALONE VILLAS 5BR PLUS</span>
          </nav>
          <p className="text-xs sm:text-sm text-[#6B6862] max-w-3xl mx-auto font-light leading-relaxed">
            Expansive private estates designed for large groups, multi-family travel, and celebrations that require scale, dedicated staff, and room for everyone across Jabodetabek.
          </p>
        </div>
      </section>

      {/* 3. Main Catalog Section with LEFT SIDEBAR FILTER & 2-COLUMN GRID */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 py-12">
        {/* Mobile Filter Trigger Button */}
        <div className="lg:hidden mb-6">
          <button
            type="button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full py-3 px-4 rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] flex items-center justify-between text-xs font-semibold text-[#222225] shadow-xs cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="h-4 w-4 text-[#8C7F5F]" />
              <span>{showMobileFilters ? "Hide Filter Options" : "Show Filter Options"}</span>
            </div>
            {isFilterActive && (
              <span className="bg-[#8C7F5F] text-white px-2 py-0.5 rounded-full text-[10px]">
                Active Filters
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
          {/* ================= LEFT SIDEBAR FILTER ================= */}
          <aside
            className={`w-full lg:w-72 shrink-0 space-y-6 lg:sticky lg:top-24 bg-white ${
              showMobileFilters ? "block" : "hidden lg:block"
            }`}
          >
            {/* Sidebar Title */}
            <div className="pb-3 border-b border-[#222225]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#222225]">
                FILTERS
              </h2>
            </div>

            {/* 1. Property Type Checkboxes */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6862] block">
                PROPERTY TYPE
              </span>
              <div className="space-y-2.5">
                {[
                  { id: "events", label: "Villa for Events" },
                  { id: "up-to-4", label: "Villa up to 4 Bedrooms" },
                  { id: "5-plus", label: "Villa 5 Bedroom and Above" },
                  { id: "apartment", label: "Entire Apartment / Suite" },
                ].map((item) => {
                  const checked = propertyTypes.includes(item.id)
                  return (
                    <label
                      key={item.id}
                      className="flex items-center space-x-2.5 text-xs text-[#222225] hover:text-[#8C7F5F] cursor-pointer select-none transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePropertyType(item.id)}
                        className="h-4 w-4 rounded border-[#D5CFC3] text-[#8C7F5F] focus:ring-0 focus:ring-offset-0 accent-[#8C7F5F]"
                      />
                      <span>{item.label}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* 2. Availability Date Selector */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6862] block">
                AVAILABILITY
              </span>
              <div className="relative">
                <input
                  type="date"
                  value={availabilityDate}
                  onChange={(e) => setAvailabilityDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E8E4DC] rounded-md bg-[#FAF8F5] text-[#222225] focus:outline-none focus:border-[#8C7F5F]"
                />
              </div>
            </div>

            {/* 3. Destination Dropdown */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6862] block">
                DESTINATION
              </span>
              <div className="relative">
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full appearance-none px-3 py-2 pr-8 text-xs border border-[#E8E4DC] rounded-md bg-[#FAF8F5] text-[#222225] focus:outline-none focus:border-[#8C7F5F] cursor-pointer"
                >
                  <option value="all">All Destinations</option>
                  {MANAGED_AREAS.map((area) => (
                    <option key={area.slug} value={area.slug}>
                      {area.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6B6862] pointer-events-none" />
              </div>
            </div>

            {/* 4. No of Rooms Dropdown */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6862] block">
                NO OF ROOMS
              </span>
              <div className="relative">
                <select
                  value={selectedRooms}
                  onChange={(e) => setSelectedRooms(e.target.value)}
                  className="w-full appearance-none px-3 py-2 pr-8 text-xs border border-[#E8E4DC] rounded-md bg-[#FAF8F5] text-[#222225] focus:outline-none focus:border-[#8C7F5F] cursor-pointer"
                >
                  <option value="all">Select Rooms</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2-4">2 - 4 Bedrooms</option>
                  <option value="5+">5+ Bedrooms</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6B6862] pointer-events-none" />
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-[#E8E4DC]" />
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#6B6862]">
                OR
              </span>
              <div className="flex-1 border-t border-[#E8E4DC]" />
            </div>

            {/* 5. Have a Villa in Mind Search */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6862] block">
                HAVE A VILLA IN MIND?
              </span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 text-xs border border-[#E8E4DC] rounded-md bg-[#FAF8F5] text-[#222225] placeholder-[#A59877] focus:outline-none focus:border-[#8C7F5F]"
                />
                <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6B6862]" />
              </div>
            </div>

            {/* Action Buttons: APPLY & CLEAR */}
            <div className="pt-3 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-2.5 px-3 bg-[#8C7F5F] hover:bg-[#776B4E] text-white text-xs font-semibold uppercase tracking-widest rounded-md transition-colors text-center cursor-pointer shadow-xs"
              >
                APPLY
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="w-full py-2.5 px-3 bg-white hover:bg-[#FAF8F5] border border-[#D5CFC3] text-[#222225] text-xs font-semibold uppercase tracking-widest rounded-md transition-colors text-center cursor-pointer"
              >
                CLEAR
              </button>
            </div>
          </aside>

          {/* ================= RIGHT CONTENT AREA ================= */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Top Bar above grid matching properties.png */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E4DC]">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#222225] uppercase tracking-wide">
                FIND A STAY IN JABODETABEK
              </h2>

              <div className="flex items-center space-x-3 text-xs shrink-0">
                {/* Search Property Name input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="PROPERTY NAME"
                    value={gridSearchQuery}
                    onChange={(e) => setGridSearchQuery(e.target.value)}
                    className="w-36 sm:w-44 pl-3 pr-7 py-1.5 text-[11px] font-medium uppercase tracking-wider border border-[#E8E4DC] rounded-full bg-[#FAF8F5] text-[#222225] placeholder-[#6B6862] focus:outline-none focus:border-[#8C7F5F]"
                  />
                  <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[#6B6862]" />
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none pl-3 pr-7 py-1.5 text-[11px] font-semibold uppercase tracking-wider border border-[#E8E4DC] rounded-full bg-[#FAF8F5] text-[#222225] focus:outline-none focus:border-[#8C7F5F] cursor-pointer"
                  >
                    <option value="recommended">SORT BY</option>
                    <option value="price-asc">PRICE: LOW TO HIGH</option>
                    <option value="price-desc">PRICE: HIGH TO LOW</option>
                    <option value="rating">HIGHEST RATED</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[#6B6862] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 2-COLUMN CARDS GRID MATCHING properties.png */}
            {filteredVillas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                {filteredVillas.map((villa) => (
                  <NakulaVillaCard key={villa.id} villa={villa} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-[#E8E4DC] bg-[#FAF8F5] py-16 px-6 text-center space-y-4">
                <p className="font-serif text-2xl text-[#222225]">No Properties Found</p>
                <p className="text-xs text-[#6B6862] max-w-sm mx-auto">
                  Try clearing your filters or selecting a different destination to browse our full collection.
                </p>
                <button
                  onClick={handleClear}
                  className="px-5 py-2 bg-[#8C7F5F] text-white text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-[#776B4E] transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Bottom View More Properties Button */}
            <div className="pt-6 text-center">
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center px-8 py-3 bg-[#8C7F5F] hover:bg-[#776B4E] text-white text-xs font-bold uppercase tracking-widest rounded-md transition-colors shadow-sm cursor-pointer"
              >
                VIEW ALL PROPERTIES
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ABOUT & SUMMARY FOR YOU (Matching properties.png) */}
      <section className="border-t border-[#E8E4DC] bg-[#FAF8F5] py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: About Column */}
            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C7F5F]">
                ABOUT
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#222225] font-normal uppercase tracking-wide">
                MORE THAN 5 BEDROOMS
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6862] leading-relaxed font-light">
                When the group is large, the estate needs to match. KingHouse&apos;s large residences in Jabodetabek (with up to 6 bedrooms and 500m² private grounds) are selected specifically for their ability to accommodate extended families, multi-generational groups, and private celebrations without sacrificing the intimacy of a private home.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="text-xs uppercase font-bold tracking-widest text-[#222225] border-b border-[#222225] pb-0.5 hover:text-[#8C7F5F] hover:border-[#8C7F5F] transition-colors"
                >
                  READ MORE
                </Link>
              </div>
            </div>

            {/* Right: Summary for You Table */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl sm:text-3xl text-[#222225] font-normal uppercase tracking-wide">
                SUMMARY FOR YOU
              </h3>
              <div className="rounded-xl border border-[#E8E4DC] bg-white overflow-hidden text-xs">
                <div className="divide-y divide-[#E8E4DC]">
                  <div className="grid grid-cols-3 p-3.5 bg-[#FAF8F5]">
                    <span className="font-medium text-[#6B6862]">Accommodation</span>
                    <span className="col-span-2 font-semibold text-[#222225]">
                      5+ Bedroom Standalone Villas & Urban Suites
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-3.5">
                    <span className="font-medium text-[#6B6862]">Popular Areas</span>
                    <span className="col-span-2 text-[#222225]">
                      Jagakarsa (South Jakarta), Tangerang, Palmerah, Cikarang
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-3.5 bg-[#FAF8F5]">
                    <span className="font-medium text-[#6B6862]">Ideal For</span>
                    <span className="col-span-2 text-[#222225]">
                      Large Families, Weddings, Corporate Offsites & Retreats
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-3.5">
                    <span className="font-medium text-[#6B6862]">Price Range</span>
                    <span className="col-span-2 font-semibold text-[#8C7F5F]">
                      Start from IDR 390,000 to IDR 3,500,000 / night
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-3.5 bg-[#FAF8F5]">
                    <span className="font-medium text-[#6B6862]">Facilities</span>
                    <span className="col-span-2 text-[#222225]">
                      Private Pool, Garden, Full Kitchen, Fast WiFi, Event Support
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-3.5">
                    <span className="font-medium text-[#6B6862]">Best Experience</span>
                    <span className="col-span-2 text-[#222225]">
                      Bespoke Hospitality & Total Privacy in Greater Jakarta
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROPERTY TYPE PHOTO STRIP (Matching properties.png) */}
      <section className="py-16 text-center border-t border-[#E8E4DC]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-8">
          <h3 className="font-serif text-2xl sm:text-3xl text-[#222225] uppercase tracking-wider font-normal">
            PROPERTY TYPE
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                title: "Versatile House Jagakarsa",
                image: "/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg",
                type: "5BR Sanctuary Villa",
              },
              {
                title: "Sky House Tangerang",
                image: "/properties/sky-house/SkyHouse_IKEA_Dapur.webp",
                type: "Hotel-Style Suite",
              },
              {
                title: "Bright & Airy Palmerah",
                image: "/properties/bright-airy/BrightAiry_Apartment_Kamar_Wide.webp",
                type: "Modern Urban Apartment",
              },
              {
                title: "Skyline Luxury Cikarang",
                image: "/properties/skyline-luxury/SkylineLuxury_OrangeCounty_KamarUtama.webp",
                type: "Executive Residence",
              },
            ].map((prop) => (
              <div
                key={prop.title}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-[#F3EFE6] border border-[#E8E4DC]"
              >
                <Image
                  src={prop.image}
                  alt={prop.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-3 inset-x-3 text-left text-white">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#DFC58E]">
                    {prop.type}
                  </p>
                  <p className="text-xs font-semibold line-clamp-1">{prop.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION (Matching properties.png) */}
      <section className="py-16 border-t border-[#E8E4DC] bg-[#FAF8F5]">
        <div className="mx-auto max-w-4xl px-6 lg:px-12 space-y-8">
          <div className="text-center space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl text-[#222225] uppercase tracking-wide font-normal">
              WHY STAY IN STANDALONE VILLAS 5BR PLUS?
            </h3>
            <div className="w-12 h-0.5 bg-[#8C7F5F] mx-auto" />
          </div>

          <div className="divide-y divide-[#E8E4DC] border-y border-[#E8E4DC]">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div key={faq.q} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-medium text-[#222225] hover:text-[#8C7F5F] transition-colors py-1 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="ml-4 shrink-0 text-[#8C7F5F]">
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="pt-3 pr-8 text-xs text-[#6B6862] leading-relaxed font-light animate-sana-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}

export default function VillasCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-serif text-[#8C7F5F]">
          Loading KingHouse Portfolio...
        </div>
      }
    >
      <VillasCatalogContent />
    </Suspense>
  )
}
