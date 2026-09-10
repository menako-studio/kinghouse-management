"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  Briefcase,
  Cake,
  Users,
  ArrowUpRight,
  Star,
  CheckCircle2,
  Calendar,
  Clock,
  Home,
  MessageCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Search,
  SlidersHorizontal,
  Maximize2,
  Download,
  FileText,
} from "lucide-react"
import { VILLA_EVENTS, VERSATILE_HOUSE_EVENT_PRICELIST, CURATED_VILLAS } from "@/lib/data"
import { VillaEvent } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { trackBrochureDownload, trackWhatsAppClick } from "@/lib/analytics"

type SortOption = "recommended" | "price-asc" | "price-desc" | "capacity"

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

      {/* 4. OFFICIAL EVENT PRICE LIST MATRIX (Direct from pricelist-villa.pdf) */}
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
