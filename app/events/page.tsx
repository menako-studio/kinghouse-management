"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Users,
  ArrowUpRight,
  Star,
  MessageCircle,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Search,
  SlidersHorizontal,
  Maximize2,
  Download,
  Camera,
  X,
  Eye,
} from "lucide-react"
import { VILLA_EVENTS, VERSATILE_HOUSE_EVENT_PRICELIST, CURATED_VILLAS } from "@/lib/data"
import { VillaEvent } from "@/lib/types"
import { trackBrochureDownload, trackWhatsAppClick } from "@/lib/analytics"

type SortOption = "recommended" | "price-asc" | "price-desc" | "capacity"

interface EventShowcasePhoto {
  id: string
  title: string
  category: "all" | "wedding" | "cocktail" | "banquet" | "bridal"
  categoryLabel: string
  image: string
  caption: string
  area: string
  capacity: string
}

const EVENT_SHOWCASE_PHOTOS: EventShowcasePhoto[] = [
  {
    id: "photo-1",
    title: "Lush Lawn Altar & Ceremonial Pool Reflection",
    category: "wedding",
    categoryLabel: "Wedding Ceremony",
    image: "/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg",
    caption: "Exchange vows beside manicured tropical lawns and an azure pool, flanked by towering palm canopies.",
    area: "500m² Tropical Garden",
    capacity: "Up to 50 Guests Seated",
  },
  {
    id: "photo-2",
    title: "Grand Dining Hall & Chandelier Banquet",
    category: "banquet",
    categoryLabel: "Intimate Banquet",
    image: "/properties/versatile-house/new/VersatileHouse_06_Dining_Chandelier.jpg",
    caption: "Family dining tables under an artistic branch chandelier with floor-to-ceiling garden vistas.",
    area: "Formal Dining Salon",
    capacity: "16-24 Pax Dining",
  },
  {
    id: "photo-3",
    title: "Covered Garden Patio & Cocktail Lounge",
    category: "cocktail",
    categoryLabel: "Cocktail & Reception",
    image: "/properties/versatile-house/new/VersatileHouse_04_Patio_Terrace.jpg",
    caption: "All-weather sheltered terrace connecting the pool deck with breezy conversation seating.",
    area: "Outdoor Covered Terrace",
    capacity: "35 Guests Standing Cocktail",
  },
  {
    id: "photo-4",
    title: "Tranquil Zen Courtyard for Editorial Photos",
    category: "wedding",
    categoryLabel: "Wedding Photo Corner",
    image: "/properties/versatile-house/new/VersatileHouse_09_Zen_Courtyard.jpg",
    caption: "An architectural stone courtyard offering natural diffused light for bridal portraits and pre-wedding captures.",
    area: "Zen Botanical Courtyard",
    capacity: "Private Photo Zone",
  },
  {
    id: "photo-5",
    title: "Expansive Air-Conditioned Plenary Hall",
    category: "cocktail",
    categoryLabel: "Indoor Reception",
    image: "/properties/versatile-house/new/VersatileHouse_02_Living_Hall.jpg",
    caption: "High-ceiling central hall equipped with climate control, ideal for indoor ceremony backup or reception mingle.",
    area: "Grand Living Hall",
    capacity: "45 Guests Gathering",
  },
  {
    id: "photo-6",
    title: "Bridal Master Suite & Powder Sanctuary",
    category: "bridal",
    categoryLabel: "Bridal Suite",
    image: "/properties/versatile-house/new/VersatileHouse_03_Master_Bedroom.jpg",
    caption: "Spacious private master wing dedicated for bridal dress changes, hair & makeup artists, and moments of calm.",
    area: "Master Bridal Wing",
    capacity: "Private Bridal Suite",
  },
]

const versatileHouse = CURATED_VILLAS.find((v) => v.id === "villa-1")

// Nakula Event Card matching events.png
function NakulaEventCard({ event }: { event: VillaEvent }) {
  const lowestPackage = event.packages[0]
  const startingPriceIdr = lowestPackage ? lowestPackage.priceIdr : 2800000

  // Seating & standing capacity approximations based on category
  const seatingPax = event.category === "wedding" ? 50 : event.category === "corporate" ? 30 : 25
  const standingPax = event.maxCapacity || 50
  const areaSqm = 500

  const whatsappMessage = encodeURIComponent(
    `Hello KingHouse Concierge! I would like to download the brochure and inquire about hosting "${event.title}" at ${event.propertyName} (Jagakarsa, South Jakarta). Please share date availability and official brochure.`
  )

  return (
    <article className="group flex flex-col space-y-4">
      {/* Landscape Hero Image with Bottom Overlays */}
      <Link
        href={`/events/${event.slug}`}
        className="relative aspect-[16/10] sm:aspect-[16/10.5] w-full overflow-hidden rounded-2xl bg-[#F3EFE6] border border-[#E8E4DC] block"
      >
        <Image
          src={event.heroImage}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
        />

        {/* Dark gradient base */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

        {/* Bottom Left: Start From IDR Price Overlay */}
        <div className="absolute bottom-3.5 left-4 text-white">
          <span className="text-[10px] uppercase font-medium tracking-wider text-white/80 block">
            Start From
          </span>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-semibold text-base sm:text-lg tracking-tight text-white">
              IDR {startingPriceIdr.toLocaleString("id-ID")}
            </span>
            <span className="text-[11px] text-white/80 font-light">/ Event</span>
          </div>
        </div>

        {/* Bottom Right: Circular Arrow Action Button */}
        <div className="absolute bottom-3.5 right-4 h-9 w-9 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-sm">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </Link>

      {/* Card Body Information */}
      <div className="space-y-3">
        {/* Meta Row: Location & Reviews + DOWNLOAD BROCHURE button matching events.png */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs text-[#6B6862]">
            <span className="font-medium text-[#222225]">Jagakarsa, Jakarta Selatan</span>
            <span>&bull;</span>
            <div className="flex items-center space-x-1">
              <Star className="h-3.5 w-3.5 fill-[#B8934C] text-[#B8934C]" />
              <span className="font-semibold text-[#222225]">5.0</span>
              <span className="text-[#6B6862]">(10 Reviews)</span>
            </div>
          </div>

          <a
            href={`https://wa.me/6282123933218?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackBrochureDownload({
                brochureType: "event",
                itemName: event.title,
              })
              trackWhatsAppClick({
                source: "event_page",
                propertyName: event.propertyName,
                context: event.title,
                value: startingPriceIdr,
              })
            }}
            className="inline-flex items-center space-x-1 px-3 py-1 bg-[#8C7F5F] hover:bg-[#776B4E] text-white text-[10px] font-bold uppercase tracking-wider rounded-md transition-colors shadow-2xs shrink-0 cursor-pointer"
          >
            <Download className="h-2.5 w-2.5" />
            <span>DOWNLOAD BROCHURE</span>
          </a>
        </div>


        {/* Venue / Event Title */}
        <Link href={`/events/${event.slug}`}>
          <h2 className="font-serif text-xl sm:text-2xl text-[#222225] font-normal leading-snug group-hover:text-[#8C7F5F] transition-colors line-clamp-1">
            {event.title}
          </h2>
        </Link>

        {/* Specs Row with Seating, Standing, Area */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#6B6862] pt-0.5">
          <span className="flex items-center space-x-1.5">
            <Users className="h-3.5 w-3.5 text-[#8C7F5F]" />
            <span>{seatingPax} Seating</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Users className="h-3.5 w-3.5 text-[#8C7F5F]" />
            <span>{standingPax} Standing</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Maximize2 className="h-3.5 w-3.5 text-[#8C7F5F]" />
            <span>{areaSqm} m² Garden</span>
          </span>
        </div>

        {/* Suitable for Event / Features Flag */}
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#8C7F5F]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Suitable for Private Event & Ceremonies</span>
        </div>

        {/* Event Feature Tag Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {event.highlights.slice(0, 4).map((h) => (
            <span
              key={h}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FAF8F5] text-[#6B6862] border border-[#E8E4DC]"
            >
              {h}
            </span>
          ))}
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FAF8F5] text-[#6B6862] border border-[#E8E4DC]">
            0% Vendor Corkage
          </span>
        </div>
      </div>
    </article>
  )
}

export default function EventsPage() {
  const [eventTypes, setEventTypes] = useState<string[]>([])
  const [selectedDestination, setSelectedDestination] = useState<string>("all")
  const [selectedPax, setSelectedPax] = useState<string>("all")
  const [availabilityDate, setAvailabilityDate] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [gridSearchQuery, setGridSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState<SortOption>("recommended")
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)

  // Gallery showcase state
  const [activeGalleryFilter, setActiveGalleryFilter] = useState<string>("all")
  const [lightboxPhoto, setLightboxPhoto] = useState<EventShowcasePhoto | null>(null)

  const filteredGalleryPhotos = useMemo(() => {
    if (activeGalleryFilter === "all") return EVENT_SHOWCASE_PHOTOS
    return EVENT_SHOWCASE_PHOTOS.filter((p) => p.category === activeGalleryFilter)
  }, [activeGalleryFilter])

  // Tab state for pricelist matrix
  const [activePriceTab, setActivePriceTab] = useState<"half-day" | "full-day" | "full-board">("half-day")
  const [activeRateType, setActiveRateType] = useState<"weekday" | "weekend">("weekday")

  const toggleEventType = (type: string) => {
    setEventTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const handleClear = () => {
    setEventTypes([])
    setSelectedDestination("all")
    setSelectedPax("all")
    setAvailabilityDate("")
    setSearchQuery("")
    setGridSearchQuery("")
    setSortBy("recommended")
  }

  const isFilterActive = useMemo(() => {
    return (
      eventTypes.length > 0 ||
      selectedDestination !== "all" ||
      selectedPax !== "all" ||
      availabilityDate !== "" ||
      searchQuery.trim() !== "" ||
      gridSearchQuery.trim() !== ""
    )
  }, [eventTypes, selectedDestination, selectedPax, availabilityDate, searchQuery, gridSearchQuery])

  // Filter events
  const filteredEvents = useMemo(() => {
    return VILLA_EVENTS.filter((event) => {
      // Search Query
      const query = (searchQuery || gridSearchQuery).trim().toLowerCase()
      if (query) {
        const matchTitle = event.title.toLowerCase().includes(query)
        const matchProperty = event.propertyName.toLowerCase().includes(query)
        const matchDesc = event.description.toLowerCase().includes(query)
        if (!matchTitle && !matchProperty && !matchDesc) return false
      }

      // Event Type Checkboxes
      if (eventTypes.length > 0) {
        if (!eventTypes.includes(event.category) && !eventTypes.includes("events")) {
          return false
        }
      }

      // Pax Filter
      if (selectedPax !== "all") {
        const reqPax = parseInt(selectedPax, 10)
        if (event.maxCapacity < reqPax) return false
      }

      return true
    }).sort((a, b) => {
      const priceA = a.packages[0]?.priceIdr || 0
      const priceB = b.packages[0]?.priceIdr || 0
      if (sortBy === "price-asc") return priceA - priceB
      if (sortBy === "price-desc") return priceB - priceA
      if (sortBy === "capacity") return b.maxCapacity - a.maxCapacity
      return 0
    })
  }, [searchQuery, gridSearchQuery, eventTypes, selectedPax, sortBy])

  const currentPricelistTier = VERSATILE_HOUSE_EVENT_PRICELIST.find((t) => t.category === activePriceTab)

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#222225]">
      {/* 1. Hero Banner Matching events.png */}
      <section className="relative h-[48vh] sm:h-[58vh] flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg"
          alt="A Guide to Your Dream Wedding & Events"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/35" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-3">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal uppercase tracking-wide leading-tight">
            A GUIDE TO YOUR DREAM
            <br />
            WEDDING & PRIVATE EVENTS
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
            <span className="text-[#8C7F5F] font-semibold">EVENTS & VENUES</span>
          </nav>
          <p className="text-xs sm:text-sm text-[#6B6862] max-w-3xl mx-auto font-light leading-relaxed">
            At KingHouse, we&apos;ve curated a collection of private villa venues across Greater Jakarta &mdash; each one a beautiful, intimate setting where your celebration can unfold with total privacy, zero vendor markup, and dedicated staff.
          </p>
        </div>
      </section>

      {/* 3. Main Events Catalog with LEFT SIDEBAR FILTER & 2-COLUMN GRID */}
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

            {/* 1. Property / Event Type Checkboxes */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6862] block">
                PROPERTY / EVENT TYPE
              </span>
              <div className="space-y-2.5">
                {[
                  { id: "events", label: "Villa for Events" },
                  { id: "wedding", label: "Weddings & Ceremonies" },
                  { id: "corporate", label: "Corporate Offsites" },
                  { id: "birthday", label: "Birthdays & Parties" },
                  { id: "intimate-gathering", label: "Private Gatherings" },
                  { id: "wellness", label: "Wellness & Yoga Retreat" },
                ].map((item) => {
                  const checked = eventTypes.includes(item.id)
                  return (
                    <label
                      key={item.id}
                      className="flex items-center space-x-2.5 text-xs text-[#222225] hover:text-[#8C7F5F] cursor-pointer select-none transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleEventType(item.id)}
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
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="w-full appearance-none px-3 py-2 pr-8 text-xs border border-[#E8E4DC] rounded-md bg-[#FAF8F5] text-[#222225] focus:outline-none focus:border-[#8C7F5F] cursor-pointer"
                >
                  <option value="all">All Destinations</option>
                  <option value="jagakarsa">Jagakarsa, Jakarta Selatan</option>
                  <option value="tangerang">Pinang, Tangerang</option>
                  <option value="palmerah">Palmerah, Jakarta Barat</option>
                  <option value="cikarang">Cikarang Selatan, Bekasi</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6B6862] pointer-events-none" />
              </div>
            </div>

            {/* 4. Event Capacity (Pax) Dropdown */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6862] block">
                EVENT CAPACITY (PAX)
              </span>
              <div className="relative">
                <select
                  value={selectedPax}
                  onChange={(e) => setSelectedPax(e.target.value)}
                  className="w-full appearance-none px-3 py-2 pr-8 text-xs border border-[#E8E4DC] rounded-md bg-[#FAF8F5] text-[#222225] focus:outline-none focus:border-[#8C7F5F] cursor-pointer"
                >
                  <option value="all">Any Capacity</option>
                  <option value="20">Up to 20 Pax</option>
                  <option value="30">Up to 30 Pax</option>
                  <option value="40">Up to 40 Pax</option>
                  <option value="50">Up to 50+ Pax</option>
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

            {/* 5. Have a Venue in Mind Search */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6862] block">
                HAVE A VENUE IN MIND?
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
            {/* Top Bar above grid matching events.png */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E4DC]">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#222225] uppercase tracking-wide">
                FIND YOUR VENUE
              </h2>

              <div className="flex items-center space-x-3 text-xs shrink-0">
                {/* Search Venue Name input */}
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
                    <option value="capacity">CAPACITY: HIGH TO LOW</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[#6B6862] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 2-COLUMN CARDS GRID MATCHING events.png */}
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                {filteredEvents.map((event) => (
                  <NakulaEventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-[#E8E4DC] bg-[#FAF8F5] py-16 px-6 text-center space-y-4">
                <p className="font-serif text-2xl text-[#222225]">No Events Found</p>
                <p className="text-xs text-[#6B6862] max-w-sm mx-auto">
                  Try clearing your filters or changing your event category to explore our packages.
                </p>
                <button
                  onClick={handleClear}
                  className="px-5 py-2 bg-[#8C7F5F] text-white text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-[#776B4E] transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. REAL CELEBRATIONS & VENUE INSPIRATION GALLERY (Matching Nakula Event Imagery Focus) */}
      <section className="border-t border-[#E8E4DC] bg-[#FAF8F5] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#8C7F5F]">
                <Camera className="h-3.5 w-3.5" />
                <span>REAL OCCASIONS & VENUE INSPIRATION</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#222225] font-normal leading-tight">
                Moments of Celebration at KingHouse
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6862] leading-relaxed">
                Explore real wedding setups, open-air lawn ceremonies, intimate banquets, and bridal sanctuaries across our 500m² private enclave in Jagakarsa.
              </p>
            </div>

            {/* Gallery Category Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Setups" },
                { id: "wedding", label: "Weddings & Ceremonies" },
                { id: "cocktail", label: "Cocktails & Receptions" },
                { id: "banquet", label: "Intimate Banquets" },
                { id: "bridal", label: "Bridal Suites" },
              ].map((tab) => {
                const isActive = activeGalleryFilter === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveGalleryFilter(tab.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#8C7F5F] text-white shadow-xs"
                        : "bg-white text-[#6B6862] hover:text-[#222225] hover:bg-[#F3EFE6] border border-[#E8E4DC]"
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGalleryPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setLightboxPhoto(photo)}
                className="group relative overflow-hidden rounded-2xl bg-white border border-[#E8E4DC] shadow-xs cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Image Container with 4:3 Aspect */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F0ECE1]">
                  <Image
                    src={photo.image}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Subtle Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />

                  {/* Top Badge: Category */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/90 text-[#222225] backdrop-blur-md shadow-xs">
                      {photo.categoryLabel}
                    </span>
                  </div>

                  {/* Top Right: Zoom / Inspect Icon */}
                  <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-transform group-hover:scale-110">
                    <Eye className="h-3.5 w-3.5" />
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] text-white/80 font-medium uppercase tracking-wider block">
                      {photo.area} &bull; {photo.capacity}
                    </span>
                    <h3 className="font-serif text-base font-normal leading-snug line-clamp-1 drop-shadow-sm">
                      {photo.title}
                    </h3>
                  </div>
                </div>

                {/* Card Description */}
                <div className="p-4 space-y-2">
                  <p className="text-xs text-[#6B6862] leading-relaxed line-clamp-2">
                    {photo.caption}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] font-semibold text-[#8C7F5F]">
                    <span>View Setup Details</span>
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Value Props Banner matching Nakula Standard */}
          <div className="mt-12 rounded-2xl border border-[#E8E4DC] bg-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-left">
              <div className="h-12 w-12 rounded-full bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center shrink-0 text-[#8C7F5F]">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-lg text-[#222225]">
                  0% Vendor Corkage & Total Flexibility
                </h4>
                <p className="text-xs text-[#6B6862]">
                  Bring your preferred catering, florist, wedding planner, and MUA with zero surcharge or corkage fees.
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/6282123933218?text=${encodeURIComponent("Hello KingHouse Concierge! I am interested in viewing more wedding & event venue photos and checking date availability.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#8C7F5F] hover:bg-[#776B4E] text-white text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors shadow-sm cursor-pointer shrink-0"
            >
              Request Venue Tour
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Lightbox Modal */}
      {lightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-sm"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full rounded-2xl bg-white overflow-hidden shadow-2xl border border-[#E8E4DC]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close photo preview"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Full Image */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#111]">
              <Image
                src={lightboxPhoto.image}
                alt={lightboxPhoto.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </div>

            {/* Lightbox Details & Inquire Button */}
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0ECE1] pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7F5F]">
                    {lightboxPhoto.categoryLabel} &bull; {lightboxPhoto.area}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#222225] font-normal">
                    {lightboxPhoto.title}
                  </h3>
                </div>
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF8F5] text-[#8C7F5F] border border-[#E8E4DC] self-start sm:self-auto">
                  {lightboxPhoto.capacity}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#6B6862] leading-relaxed">
                {lightboxPhoto.caption}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <span className="text-xs text-[#888888]">
                  KingHouse Curated Residences &bull; Jagakarsa, South Jakarta
                </span>
                <a
                  href={`https://wa.me/6282123933218?text=${encodeURIComponent(`Hello KingHouse! I saw the "${lightboxPhoto.title}" setup in your events gallery and would like to inquire about date availability and package rates.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#8C7F5F] hover:bg-[#776B4E] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Inquire This Setup on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. OFFICIAL EVENT PRICE LIST MATRIX (Direct from pricelist-villa.pdf) */}
      <section id="pricelist" className="mx-auto max-w-7xl px-6 lg:px-12 pt-16 pb-12 border-t border-[#E8E4DC]">
        <div className="rounded-3xl border border-[#E8E4DC] bg-[#FAF8F5] p-6 sm:p-10 shadow-xs">
          <div className="max-w-3xl mb-8">
            <span className="text-[11px] uppercase tracking-widest font-bold text-[#8C7F5F]">
              OFFICIAL PRICE MATRIX 2026
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#222225] mt-1 font-normal">
              Versatile House Event Package Price List
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6862] mt-2 leading-relaxed">
              Transparent rate card for private events at Jagakarsa residence. Choose your session duration and guest capacity.
            </p>
          </div>

          {/* Package Duration Switcher Tabs */}
          <div className="flex flex-wrap gap-2 pb-6 border-b border-[#E8E4DC]">
            {VERSATILE_HOUSE_EVENT_PRICELIST.map((tab) => {
              const isActive = activePriceTab === tab.category
              return (
                <button
                  key={tab.category}
                  onClick={() => setActivePriceTab(tab.category)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#222225] text-white shadow-sm"
                      : "bg-white text-[#6B6862] hover:bg-[#F3EFE6] hover:text-[#222225] border border-[#E8E4DC]"
                  }`}
                >
                  {tab.categoryLabel} ({tab.durationText})
                </button>
              )
            })}
          </div>

          {/* Tab Description & Rate Toggle */}
          {currentPricelistTier && (
            <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-[#222225] max-w-xl">
                {currentPricelistTier.description}
                {currentPricelistTier.overnightStayMax && (
                  <strong className="block text-[#8C7F5F] mt-1">
                    * Includes overnight stay for up to {currentPricelistTier.overnightStayMax} guests in 5–6 bedrooms.
                  </strong>
                )}
              </p>

              {/* Weekday vs Weekend Toggle */}
              <div className="inline-flex rounded-xl bg-white p-1 border border-[#E8E4DC] self-start md:self-auto">
                <button
                  onClick={() => setActiveRateType("weekday")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeRateType === "weekday"
                      ? "bg-[#222225] text-white shadow-xs"
                      : "text-[#6B6862] hover:text-[#222225]"
                  }`}
                >
                  Weekday Rate
                </button>
                <button
                  onClick={() => setActiveRateType("weekend")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeRateType === "weekend"
                      ? "bg-[#222225] text-white shadow-xs"
                      : "text-[#6B6862] hover:text-[#222225]"
                  }`}
                >
                  Weekend Rate
                </button>
              </div>
            </div>
          )}

          {/* Pricing Table Matrix */}
          <div className="overflow-x-auto rounded-2xl border border-[#E8E4DC] bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#222225] font-serif uppercase tracking-wider text-[11px] border-b border-[#E8E4DC]">
                <tr>
                  <th className="px-5 py-4 font-semibold">Package Tier</th>
                  <th className="px-5 py-4 font-semibold">Event Capacity</th>
                  <th className="px-5 py-4 font-semibold">Duration / Stay</th>
                  <th className="px-5 py-4 font-semibold">Weekday Price</th>
                  <th className="px-5 py-4 font-semibold">Weekend Price</th>
                  <th className="px-5 py-4 font-semibold text-right">Inquiry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DC]">
                {currentPricelistTier?.tiers.map((tier) => {
                  const message = encodeURIComponent(
                    `Hello KingHouse! I would like to book the "${tier.name} (${currentPricelistTier.categoryLabel} - ${tier.pax} Pax)" package at Versatile House Jagakarsa.`
                  )
                  return (
                    <tr key={tier.name} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="px-5 py-4 font-semibold text-[#222225]">{tier.name}</td>
                      <td className="px-5 py-4 text-[#6B6862]">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FAF8F5] text-[#8C7F5F] border border-[#E8E4DC]">
                          {tier.pax} Pax
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#6B6862]">{tier.duration}</td>
                      <td className={`px-5 py-4 font-semibold ${activeRateType === "weekday" ? "text-[#222225] text-sm" : "text-[#6B6862]"}`}>
                        IDR {(tier.weekdayPriceIdr / 1000000).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Jt
                      </td>
                      <td className={`px-5 py-4 font-semibold ${activeRateType === "weekend" ? "text-[#222225] text-sm" : "text-[#6B6862]"}`}>
                        IDR {(tier.weekendPriceIdr / 1000000).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Jt
                      </td>
                      <td className="px-5 py-4 text-right">
                        <a
                          href={`https://wa.me/6282123933218?text=${message}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-md bg-[#8C7F5F] hover:bg-[#776B4E] text-white text-[11px] font-semibold transition-colors"
                        >
                          <MessageCircle className="h-3 w-3 text-white" />
                          <span>Reserve</span>
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-[#6B6862] gap-2">
            <span>* Zero vendor corkage fee. Outside catering, florist, & photographer welcome.</span>
            <span>Official commercial invoice & tax receipts provided for corporate bookings.</span>
          </div>
        </div>
      </section>

      {/* 5. Versatile House Room Stay Configuration Table */}
      {versatileHouse?.stayConfigurations && (
        <section className="mx-auto max-w-7xl px-6 lg:px-12 pb-20">
          <div className="rounded-3xl border border-[#E8E4DC] bg-[#FAF8F5] p-6 sm:p-10 shadow-xs">
            <div className="max-w-3xl mb-8">
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#8C7F5F]">
                VILLA OVERNIGHT STAY OPTION
              </span>
              <h2 className="font-serif text-3xl text-[#222225] mt-1 font-normal">
                Room Configuration & Stay Rates (Versatile House)
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6862] mt-2 leading-relaxed">
                Need extra accommodation for bridal families or retreat participants? Versatile House supports flexible room unlocks from 2 to 6 bedrooms.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#E8E4DC] bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-[#222225] font-serif uppercase tracking-wider text-[11px] border-b border-[#E8E4DC]">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Room Configuration</th>
                    <th className="px-5 py-4 font-semibold">Maximum Guests</th>
                    <th className="px-5 py-4 font-semibold">Weekday Price</th>
                    <th className="px-5 py-4 font-semibold">Weekend Price</th>
                    <th className="px-5 py-4 font-semibold">Peak Season Price</th>
                    <th className="px-5 py-4 font-semibold">Extra Guest</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E4DC]">
                  {versatileHouse.stayConfigurations.map((stay) => (
                    <tr key={stay.bedrooms} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="px-5 py-4 font-semibold text-[#222225]">{stay.bedrooms} Bedroom</td>
                      <td className="px-5 py-4 text-[#6B6862]">Max {stay.maxGuests} Guests</td>
                      <td className="px-5 py-4 font-semibold text-[#222225]">
                        Rp {stay.weekdayPriceIdr.toLocaleString("id-ID")}
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#222225]">
                        Rp {stay.weekendPriceIdr.toLocaleString("id-ID")}
                      </td>
                      <td className="px-5 py-4 text-[#6B6862]">
                        Rp {stay.peakSeasonPriceIdr.toLocaleString("id-ID")}
                      </td>
                      <td className="px-5 py-4 text-[#8C7F5F]">
                        Rp {stay.extraGuestPriceIdr.toLocaleString("id-ID")}/pax
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-[#6B6862] border-t border-[#E8E4DC] pt-3">
              <span className="font-semibold text-[#222225]">
                One-time Cleaning Fee: Rp {versatileHouse.price.cleaningFeeIdr.toLocaleString("id-ID")}
              </span>
              <a
                href={`https://wa.me/6282123933218?text=${encodeURIComponent("Hello KingHouse! I would like to inquire about room stay configurations at Versatile House Jagakarsa.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-[#8C7F5F] hover:text-[#222225] font-semibold"
              >
                <span>Inquire Custom Stay via WhatsApp</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
