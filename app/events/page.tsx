"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "@/components/ui/localized-link"
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
  Globe,
  ShieldCheck,
  Plane,
  CloudSun,
  UtensilsCrossed,
  FileText,
  CheckCircle2,
} from "lucide-react"
import { VILLA_EVENTS, VERSATILE_HOUSE_EVENT_PRICELIST, CURATED_VILLAS } from "@/lib/data"
import { VillaEvent } from "@/lib/types"
import { trackBrochureDownload, trackWhatsAppClick } from "@/lib/analytics"
import { useLocalization } from "@/lib/context/localization-context"
import { EventTypeCards } from "@/components/events/event-type-cards"
import { EventLeadForm } from "@/components/events/event-lead-form"
import { whatsappBase } from "@/lib/funnel/whatsapp"
import type { EventTypeId } from "@/lib/funnel/config"

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
    title: "Lush Lawn Floral Moon Gate & Poolside Altar",
    category: "wedding",
    categoryLabel: "Wedding Ceremony",
    image: "/properties/versatile-house/events/portfolio/ceremony-lawn-altar.jpg",
    caption: "Exchange vows in front of a breathtaking circular floral moon gate arch set on manicured grass, with white cross-back chairs and turquoise pool reflections.",
    area: "500m² Tropical Garden & Pool",
    capacity: "Up to 50 Guests Seated",
  },
  {
    id: "photo-2",
    title: "Intimate Twilight Banquet & Canopy Fairy Lights",
    category: "banquet",
    categoryLabel: "Evening Garden Banquet",
    image: "/properties/versatile-house/events/portfolio/twilight-dinner-reception.jpg",
    caption: "Magical evening dinner under a canopy of glowing fairy lights, rustic long banquet tables, white linen runners, candlelight lanterns, and floating pool candles.",
    area: "Poolside Lawn & Banquet Deck",
    capacity: "30–50 Guests Seated Dinner",
  },
  {
    id: "photo-3",
    title: "Bridal Master Suite Sanctuary & Garden Deck",
    category: "bridal",
    categoryLabel: "Bridal Suite",
    image: "/properties/versatile-house/events/portfolio/bridal-suite-prep.jpg",
    caption: "Serene master bedroom suite dedicated for bridal dress changes, hair & makeup artists, and intimate morning photos with floor-to-ceiling garden views.",
    area: "Master Bridal Wing",
    capacity: "Private Bridal Suite",
  },
  {
    id: "photo-4",
    title: "Covered Patio Blessing & Akad Nikah Altar",
    category: "wedding",
    categoryLabel: "Akad / Blessing Ceremony",
    image: "/properties/versatile-house/events/portfolio/blessing-ceremony-terrace.jpg",
    caption: "Intimate ceremonial table adorned with fresh white orchids and sheer drapes on the sheltered stone terrace overlooking the lawn and swimming pool.",
    area: "Sheltered Garden Terrace",
    capacity: "20–40 Guests",
  },
  {
    id: "photo-5",
    title: "Poolside Altar Reflection & Manicured Lawn",
    category: "wedding",
    categoryLabel: "Wedding Ceremony",
    image: "/properties/versatile-house/events/wedding-ceremony-lawn-pool.jpg",
    caption: "Classic daytime garden ceremony setup overlooking the crystalline pool, tropical palm backdrop, and white crossback guest seating.",
    area: "Lawn & Pool Enclave",
    capacity: "Up to 50 Guests Seated",
  },
  {
    id: "photo-6",
    title: "Romantic Twilight Garden Banquet with Fairy Lights",
    category: "banquet",
    categoryLabel: "Evening Garden Banquet",
    image: "/properties/versatile-house/events/evening-garden-party-banquet.jpg",
    caption: "Magical night dinner under canopy festoon fairy lights, long wooden banquet tables, glowing pool lanterns, and fresh floral runners.",
    area: "Poolside Lawn & Banquet Deck",
    capacity: "30–50 Guests Seated Dinner",
  },
  {
    id: "photo-7",
    title: "Covered Patio Cocktail Bar & Garden Lounge",
    category: "cocktail",
    categoryLabel: "Cocktail & Reception",
    image: "/properties/versatile-house/events/cocktail-reception-terrace-lounge.jpg",
    caption: "Pop-up champagne bar and high cocktail tables with seamless indoor-outdoor flow opening to the garden and pool.",
    area: "Outdoor Sheltered Terrace",
    capacity: "40 Guests Standing Cocktail",
  },
  {
    id: "photo-8",
    title: "Grand Dining Hall & Chandelier Banquet",
    category: "banquet",
    categoryLabel: "Intimate Banquet",
    image: "/properties/versatile-house/new/VersatileHouse_06_Dining_Chandelier.jpg",
    caption: "Family dining tables under an artistic branch chandelier with floor-to-ceiling garden vistas, serving as an air-conditioned rain backup.",
    area: "Formal Dining Salon",
    capacity: "16-24 Pax Dining",
  },
  {
    id: "photo-9",
    title: "Tranquil Zen Courtyard for Editorial Photos",
    category: "wedding",
    categoryLabel: "Wedding Photo Corner",
    image: "/properties/versatile-house/new/VersatileHouse_09_Zen_Courtyard.jpg",
    caption: "An architectural stone courtyard offering natural diffused light for bridal portraits and pre-wedding captures.",
    area: "Zen Botanical Courtyard",
    capacity: "Private Photo Zone",
  },
]

const versatileHouse = CURATED_VILLAS.find((v) => v.id === "villa-1")

// Nakula Event Card matching events.png
function NakulaEventCard({ event }: { event: VillaEvent }) {
  const { formatPrice, tc } = useLocalization()
  const lowestPackage = event.packages[0]
  const startingPriceIdr = lowestPackage ? lowestPackage.priceIdr : 2800000

  // Seating & standing capacity approximations based on category
  const seatingPax = event.category === "wedding" ? 50 : event.category === "corporate" ? 30 : 25
  const standingPax = event.maxCapacity || 50
  const areaSqm = 500

  const whatsappMessage = encodeURIComponent(
    `Hello Kinghouse Concierge! I would like to download the brochure and inquire about hosting "${event.title}" at ${event.propertyName} (Jagakarsa, South Jakarta). Please share date availability and official brochure.`
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
          alt={tc(event.title)}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
        />

        {/* Dark gradient base */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

        {/* Bottom Left: Start From IDR Price Overlay */}
        <div className="absolute bottom-3.5 left-4 text-white">
          <span className="text-xs uppercase font-medium tracking-wider text-white/80 block">
            {tc("Start From")}
          </span>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-semibold text-base sm:text-lg tracking-tight text-white">
              {formatPrice(startingPriceIdr)}
            </span>
            <span className="text-xs text-white/80 font-light">{tc("/ Event")}</span>
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs text-[#6B6862]">
            <span className="font-medium text-[#222225]">Jagakarsa, Jakarta Selatan</span>
            <span>&bull;</span>
            <div className="flex items-center space-x-1">
              <Star className="h-3.5 w-3.5 fill-[#B8934C] text-[#B8934C]" />
              <span className="font-semibold text-[#222225]">5.0</span>
              <span className="text-[#6B6862]">({tc("{count} Reviews", { count: 10 })})</span>
            </div>
          </div>

          <a
            href={`${whatsappBase("EVENT")}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackBrochureDownload({
                brochureType: "event",
                itemName: event.title,
              })
              trackWhatsAppClick({
                source: "event_page",
                funnel: "event",
                propertyName: event.propertyName,
                context: event.title,
                value: startingPriceIdr,
              })
            }}
            className="inline-flex items-center space-x-1 px-3 py-1 bg-[#8C7F5F] hover:bg-[#776B4E] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors shadow-2xs shrink-0 cursor-pointer"
          >
            <Download className="h-2.5 w-2.5" />
            <span>{tc("DOWNLOAD BROCHURE")}</span>
          </a>
        </div>


        {/* Venue / Event Title */}
        <Link href={`/events/${event.slug}`}>
          <h2 className="font-serif text-xl sm:text-2xl text-[#222225] font-normal leading-snug group-hover:text-[#8C7F5F] transition-colors line-clamp-1">
            {tc(event.title)}
          </h2>
        </Link>

        {/* Specs Row with Seating, Standing, Area */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#6B6862] pt-0.5">
          <span className="flex items-center space-x-1.5">
            <Users className="h-3.5 w-3.5 text-[#8C7F5F]" />
            <span>{seatingPax} {tc("Seating")}</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Users className="h-3.5 w-3.5 text-[#8C7F5F]" />
            <span>{standingPax} {tc("Standing")}</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Maximize2 className="h-3.5 w-3.5 text-[#8C7F5F]" />
            <span>{areaSqm} {tc("m² Garden")}</span>
          </span>
        </div>

        {/* Suitable for Event / Features Flag */}
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#8C7F5F]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{tc("Suitable for Private Event & Ceremonies")}</span>
        </div>

        {/* Event Feature Tag Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {event.highlights.slice(0, 4).map((h) => (
            <span
              key={h}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#FAF8F5] text-[#6B6862] border border-[#E8E4DC]"
            >
              {tc(h)}
            </span>
          ))}
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#FAF8F5] text-[#6B6862] border border-[#E8E4DC]">
            {tc("0% Vendor Corkage")}
          </span>
        </div>
      </div>
    </article>
  )
}

export default function EventsPage() {
  const { formatPrice, t, tc } = useLocalization()
  const [eventTypes, setEventTypes] = useState<string[]>([])
  const [selectedDestination, setSelectedDestination] = useState<string>("all")
  const [selectedPax, setSelectedPax] = useState<string>("all")
  const [availabilityDate, setAvailabilityDate] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [gridSearchQuery, setGridSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState<SortOption>("recommended")
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)

  // Funnel B2: event type picked on the cards drives the qualification form
  const [funnelEventType, setFunnelEventType] = useState<EventTypeId | null>(null)

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
      <section className="relative h-[52vh] sm:h-[62vh] flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/properties/versatile-house/events/wedding-ceremony-lawn-pool.jpg"
          alt={tc("A Guide to Your Dream Wedding & Events at Kinghouse")}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/35" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-3">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal uppercase tracking-wide leading-tight">
            {tc("A GUIDE TO YOUR DREAM")}
            <br />
            {tc("WEDDING & PRIVATE EVENTS")}
            <br />
            <span className="text-[#DFC58E] tracking-widest text-2xl sm:text-4xl">KINGHOUSE</span>
          </h1>
        </div>
      </section>

      {/* 2. Breadcrumbs & Subtitle Introduction */}
      <section className="border-b border-[#E8E4DC] bg-[#FAF8F5] py-6 text-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-2.5">
          <nav className="text-xs uppercase tracking-widest text-[#6B6862] flex items-center justify-center space-x-2">
            <Link href="/" className="hover:text-[#222225] transition-colors">
              {tc("HOME")}
            </Link>
            <span>/</span>
            <span className="text-[#8C7F5F] font-semibold">{tc("EVENTS & VENUES")}</span>
          </nav>
          <p className="text-xs sm:text-sm text-[#6B6862] max-w-3xl mx-auto font-light leading-relaxed">
            {tc("At Kinghouse, we've curated a collection of private villa venues across Greater Jakarta — each one a beautiful, intimate setting where your celebration can unfold with total privacy, zero vendor markup, and dedicated staff.")}
          </p>
        </div>
      </section>

      {/* Funnel B2: pick the event type (Wedding / Gathering / Shooting) */}
      <EventTypeCards selected={funnelEventType} onSelect={setFunnelEventType} />

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
              <span>{tc(showMobileFilters ? "Hide Filter Options" : "Show Filter Options")}</span>
            </div>
            {isFilterActive && (
              <span className="bg-[#8C7F5F] text-white px-2 py-0.5 rounded-full text-xs">
                {tc("Active Filters")}
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
                {tc("FILTERS")}
              </h2>
            </div>

            {/* 1. Property / Event Type Checkboxes */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B6862] block">
                {tc("PROPERTY / EVENT TYPE")}
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
                      <span>{tc(item.label)}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* 2. Availability Date Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B6862] block">
                {tc("AVAILABILITY")}
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
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B6862] block">
                {tc("DESTINATION")}
              </span>
              <div className="relative">
                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="w-full appearance-none px-3 py-2 pr-8 text-xs border border-[#E8E4DC] rounded-md bg-[#FAF8F5] text-[#222225] focus:outline-none focus:border-[#8C7F5F] cursor-pointer"
                >
                  <option value="all">{tc("All Destinations")}</option>
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
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B6862] block">
                {tc("EVENT CAPACITY (PAX)")}
              </span>
              <div className="relative">
                <select
                  value={selectedPax}
                  onChange={(e) => setSelectedPax(e.target.value)}
                  className="w-full appearance-none px-3 py-2 pr-8 text-xs border border-[#E8E4DC] rounded-md bg-[#FAF8F5] text-[#222225] focus:outline-none focus:border-[#8C7F5F] cursor-pointer"
                >
                  <option value="all">{tc("Any Capacity")}</option>
                  <option value="20">{tc("Up to 20 Pax")}</option>
                  <option value="30">{tc("Up to 30 Pax")}</option>
                  <option value="40">{tc("Up to 40 Pax")}</option>
                  <option value="50">{tc("Up to 50+ Pax")}</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6B6862] pointer-events-none" />
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-[#E8E4DC]" />
              <span className="px-3 text-xs font-bold uppercase tracking-wider text-[#6B6862]">
                OR
              </span>
              <div className="flex-1 border-t border-[#E8E4DC]" />
            </div>

            {/* 5. Have a Venue in Mind Search */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B6862] block">
                {tc("HAVE A VENUE IN MIND?")}
              </span>
              <div className="relative">
                <input
                  type="text"
                  placeholder={tc("Search...")}
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
                {tc("APPLY")}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="w-full py-2.5 px-3 bg-white hover:bg-[#FAF8F5] border border-[#D5CFC3] text-[#222225] text-xs font-semibold uppercase tracking-widest rounded-md transition-colors text-center cursor-pointer"
              >
                {tc("CLEAR")}
              </button>
            </div>
          </aside>

          {/* ================= RIGHT CONTENT AREA ================= */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Top Bar above grid matching events.png */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E4DC]">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#222225] uppercase tracking-wide">
                {tc("FIND YOUR VENUE")}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                {/* Search Venue Name input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={tc("PROPERTY NAME")}
                    value={gridSearchQuery}
                    onChange={(e) => setGridSearchQuery(e.target.value)}
                    className="w-36 sm:w-44 pl-3 pr-7 py-1.5 text-xs font-medium uppercase tracking-wider border border-[#E8E4DC] rounded-full bg-[#FAF8F5] text-[#222225] placeholder-[#6B6862] focus:outline-none focus:border-[#8C7F5F]"
                  />
                  <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[#6B6862]" />
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none pl-3 pr-7 py-1.5 text-xs font-semibold uppercase tracking-wider border border-[#E8E4DC] rounded-full bg-[#FAF8F5] text-[#222225] focus:outline-none focus:border-[#8C7F5F] cursor-pointer"
                  >
                    <option value="recommended">{tc("SORT BY")}</option>
                    <option value="price-asc">{tc("PRICE: LOW TO HIGH")}</option>
                    <option value="price-desc">{tc("PRICE: HIGH TO LOW")}</option>
                    <option value="capacity">{tc("CAPACITY: HIGH TO LOW")}</option>
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
                <p className="font-serif text-2xl text-[#222225]">{tc("No Events Found")}</p>
                <p className="text-xs text-[#6B6862] max-w-sm mx-auto">
                  {tc("Try clearing your filters or changing your event category to explore our packages.")}
                </p>
                <button
                  onClick={handleClear}
                  className="px-5 py-2 bg-[#8C7F5F] text-white text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-[#776B4E] transition-colors cursor-pointer"
                >
                  {tc("Clear All Filters")}
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
                <span>{tc("REAL OCCASIONS & VENUE INSPIRATION")}</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#222225] font-normal leading-tight">
                {tc("Moments of Celebration at Kinghouse")}
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6862] leading-relaxed">
                {tc("Explore real wedding setups, open-air lawn ceremonies, intimate banquets, and bridal sanctuaries across our 500m² private enclave in Jagakarsa.")}
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
                    {tc(tab.label)}
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
                    alt={tc(photo.title)}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Subtle Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />

                  {/* Top Badge: Category */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/90 text-[#222225] backdrop-blur-md shadow-xs">
                      {tc(photo.categoryLabel)}
                    </span>
                  </div>

                  {/* Top Right: Zoom / Inspect Icon */}
                  <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-transform group-hover:scale-110">
                    <Eye className="h-3.5 w-3.5" />
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-xs text-white/80 font-medium uppercase tracking-wider block">
                      {tc(photo.area)} &bull; {tc(photo.capacity)}
                    </span>
                    <h3 className="font-serif text-base font-normal leading-snug line-clamp-1 drop-shadow-sm">
                      {tc(photo.title)}
                    </h3>
                  </div>
                </div>

                {/* Card Description */}
                <div className="p-4 space-y-2">
                  <p className="text-xs text-[#6B6862] leading-relaxed line-clamp-2">
                    {tc(photo.caption)}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-xs font-semibold text-[#8C7F5F]">
                    <span>{tc("View Setup Details")}</span>
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
                  {tc("0% Vendor Corkage & Total Flexibility")}
                </h4>
                <p className="text-xs text-[#6B6862]">
                  {tc("Bring your preferred catering, florist, wedding planner, and MUA with zero surcharge or corkage fees.")}
                </p>
              </div>
            </div>

            <a
              href={`${whatsappBase("EVENT")}?text=${encodeURIComponent("Hello Kinghouse Concierge! I am interested in viewing more wedding & event venue photos and checking date availability.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#8C7F5F] hover:bg-[#776B4E] text-white text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors shadow-sm cursor-pointer shrink-0"
            >
              {tc("Request Venue Tour")}
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
                alt={tc(lightboxPhoto.title)}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </div>

            {/* Lightbox Details & Inquire Button */}
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0ECE1] pb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C7F5F]">
                    {tc(lightboxPhoto.categoryLabel)} &bull; {tc(lightboxPhoto.area)}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#222225] font-normal">
                    {tc(lightboxPhoto.title)}
                  </h3>
                </div>
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF8F5] text-[#8C7F5F] border border-[#E8E4DC] self-start sm:self-auto">
                  {tc(lightboxPhoto.capacity)}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#6B6862] leading-relaxed">
                {tc(lightboxPhoto.caption)}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <span className="text-xs text-[#888888]">
                  {tc("Kinghouse Curated Residences • Jagakarsa, South Jakarta")}
                </span>
                <a
                  href={`${whatsappBase("EVENT")}?text=${encodeURIComponent(`Hello Kinghouse! I saw the "${lightboxPhoto.title}" setup in your events gallery and would like to inquire about date availability and package rates.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#8C7F5F] hover:bg-[#776B4E] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{tc("Inquire This Setup on WhatsApp")}</span>
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
            <span className="text-xs uppercase tracking-widest font-bold text-[#8C7F5F]">
              {tc("OFFICIAL PRICE MATRIX 2026")}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#222225] mt-1 font-normal">
              {tc("Versatile House Event Package Price List")}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6862] mt-2 leading-relaxed">
              {tc("Transparent rate card for private events at Jagakarsa residence. Choose your session duration and guest capacity.")}
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
                  {tc(tab.categoryLabel)} ({tc(tab.durationText)})
                </button>
              )
            })}
          </div>

          {/* Tab Description & Rate Toggle */}
          {currentPricelistTier && (
            <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-[#222225] max-w-xl">
                {tc(currentPricelistTier.description)}
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
                  {t("weekdayRateHeader")}
                </button>
                <button
                  onClick={() => setActiveRateType("weekend")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeRateType === "weekend"
                      ? "bg-[#222225] text-white shadow-xs"
                      : "text-[#6B6862] hover:text-[#222225]"
                  }`}
                >
                  {t("weekendRateHeader")}
                </button>
              </div>
            </div>
          )}

          {/* Pricing Table Matrix */}
          <div className="overflow-x-auto rounded-2xl border border-[#E8E4DC] bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#222225] font-serif uppercase tracking-wider text-xs border-b border-[#E8E4DC]">
                <tr>
                  <th className="px-5 py-4 font-semibold">{t("packageTierHeader")}</th>
                  <th className="px-5 py-4 font-semibold">{t("capacityHeader")}</th>
                  <th className="px-5 py-4 font-semibold">{t("durationHeader")}</th>
                  <th className="px-5 py-4 font-semibold">{t("weekdayRateHeader")}</th>
                  <th className="px-5 py-4 font-semibold">{t("weekendRateHeader")}</th>
                  <th className="px-5 py-4 font-semibold text-right">{tc("Inquiry")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DC]">
                {currentPricelistTier?.tiers.map((tier) => {
                  const message = encodeURIComponent(
                    `Hello Kinghouse! I would like to book the "${tier.name} (${currentPricelistTier.categoryLabel} - ${tier.pax} Pax)" package at Versatile House Jagakarsa.`
                  )
                  return (
                    <tr key={tier.name} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="px-5 py-4 font-semibold text-[#222225]">{tc(tier.name)}</td>
                      <td className="px-5 py-4 text-[#6B6862]">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FAF8F5] text-[#8C7F5F] border border-[#E8E4DC]">
                          {tier.pax} Pax
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#6B6862]">{tc(tier.duration)}</td>
                      <td className={`px-5 py-4 font-semibold ${activeRateType === "weekday" ? "text-[#222225] text-sm" : "text-[#6B6862]"}`}>
                        {formatPrice(tier.weekdayPriceIdr)}
                      </td>
                      <td className={`px-5 py-4 font-semibold ${activeRateType === "weekend" ? "text-[#222225] text-sm" : "text-[#6B6862]"}`}>
                        {formatPrice(tier.weekendPriceIdr)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <a
                          href={`${whatsappBase("EVENT")}?text=${message}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-md bg-[#8C7F5F] hover:bg-[#776B4E] text-white text-xs font-semibold transition-colors"
                        >
                          <MessageCircle className="h-3 w-3 text-white" />
                          <span>{t("reserveButton")}</span>
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-[#6B6862] gap-2">
            <span>{tc("* Zero vendor corkage fee. Outside catering, florist, & photographer welcome.")}</span>
            <span>{tc("Official commercial invoice & tax receipts provided for corporate bookings.")}</span>
          </div>
        </div>
      </section>

      {/* Funnel B2: event qualification form + venue rules */}
      <EventLeadForm eventType={funnelEventType ?? "wedding"} onEventTypeChange={setFunnelEventType} />

      {/* 5. INTERNATIONAL & EXPAT WEDDING CONCIERGE (Foreigner-Friendly Direct Desk) */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 pt-8 pb-16">
        <div className="relative overflow-hidden rounded-3xl border border-[#DFC58E]/40 bg-gradient-to-br from-[#222225] via-[#1E1E22] to-[#141416] p-8 sm:p-12 text-white shadow-xl">
          {/* Ambient Gold Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#DFC58E]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mb-10 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#DFC58E]/30 text-xs font-semibold text-[#DFC58E]">
              <Globe className="h-3.5 w-3.5" />
              <span className="uppercase tracking-widest text-xs">{tc("International & Destination Wedding Desk")}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
              {tc("Planning an Expat or Destination Villa Wedding in Jakarta?")}
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed font-light">
              {tc("Versatile House Jagakarsa provides the seclusion and botanical luxury of a Bali private villa without the logistical hurdles of island travel. We welcome international couples, multicultural families, and expat celebrations with 100% vendor freedom and dedicated bilingual concierge support.")}
            </p>
          </div>

          {/* 6 Key Guarantees for Foreign Clients */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 mb-10">
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
              <div className="flex items-center space-x-2.5 text-[#DFC58E]">
                <UtensilsCrossed className="h-5 w-5" />
                <h4 className="font-semibold text-sm text-white">{tc("0% Vendor Corkage")}</h4>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                {tc("Bring your preferred international wedding planner, private chef, local or western caterer, wine collection, and photographer with zero corkage fees or vendor penalties.")}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
              <div className="flex items-center space-x-2.5 text-[#DFC58E]">
                <Plane className="h-5 w-5" />
                <h4 className="font-semibold text-sm text-white">{tc("Airport & Hotel Proximity")}</h4>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                {tc("Convenient 35–45 min direct highway connection from Soekarno-Hatta (CGK) via Desari toll. 4-star and 5-star partner hotels on TB Simatupang are just 10 mins away for overflow guests.")}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
              <div className="flex items-center space-x-2.5 text-[#DFC58E]">
                <CloudSun className="h-5 w-5" />
                <h4 className="font-semibold text-sm text-white">{tc("100% Weather Backup Plan")}</h4>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                {tc("Sudden tropical rain? Seamlessly transition from the 500m² lawn to our Grand Living Hall with 5-meter ceilings and sheltered garden terrace, comfortably seating up to 50 guests.")}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
              <div className="flex items-center space-x-2.5 text-[#DFC58E]">
                <ShieldCheck className="h-5 w-5" />
                <h4 className="font-semibold text-sm text-white">{tc("Any Ceremony Style Welcomed")}</h4>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                {tc("From intimate Christian or secular vow exchanges to traditional Akad Nikah, tea ceremonies, or vow renewals, our private residence offers complete peace and sacred privacy.")}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
              <div className="flex items-center space-x-2.5 text-[#DFC58E]">
                <Users className="h-5 w-5" />
                <h4 className="font-semibold text-sm text-white">{tc("15 Pax Family Accommodation")}</h4>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                {tc("The full 5-bedroom residence is exclusively yours. Close family members can stay together overnight with private pool access, hotel-grade linens, and daily housekeeping.")}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
              <div className="flex items-center space-x-2.5 text-[#DFC58E]">
                <Globe className="h-5 w-5" />
                <h4 className="font-semibold text-sm text-white">{tc("Multi-Currency & Virtual Tours")}</h4>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                {tc("Transparent quotes and contracts in USD, EUR, AUD, SGD, or IDR. We offer live WhatsApp or FaceTime video walkthroughs for overseas couples before signing.")}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-white/10 relative z-10">
            <div className="text-xs text-white/60">
              {tc("English-speaking concierge • Average inquiry response under 15 minutes • Live FaceTime walkthroughs available")}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`${whatsappBase("EVENT")}?text=Hello%20Kinghouse%20Concierge!%20We%20are%20an%20international%20couple%20inquiring%20about%20hosting%20a%20private%20destination%20wedding%20at%20Versatile%20House%20Jagakarsa.%20Could%20you%20please%20share%20the%20international%20wedding%20lookbook,%20available%20dates,%20and%20rates%20in%20USD/IDR%3F`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackWhatsAppClick({
                    source: "event_page",
                    propertyName: "Versatile House Jagakarsa",
                    context: "International Expat Wedding Desk",
                  })
                }}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-[#DFC58E] hover:bg-[#C9A96E] text-[#19191B] text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:scale-[1.02] cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{tc("Chat with International Concierge")}</span>
              </a>

              <a
                href={`${whatsappBase("EVENT")}?text=Hello%20Kinghouse!%20Please%20send%20me%20the%20Official%20Wedding%20Lookbook%202026%20and%20Floorplan%20Deck%20for%20Versatile%20House%20Jagakarsa.`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackBrochureDownload({
                    brochureType: "event",
                    itemName: "Versatile House Wedding Lookbook 2026",
                  })
                }}
                className="inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold tracking-wider transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{tc("Download Wedding Deck (PDF)")}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Versatile House Room Stay Configuration Table */}
      {versatileHouse?.stayConfigurations && (
        <section className="mx-auto max-w-7xl px-6 lg:px-12 pb-20">
          <div className="rounded-3xl border border-[#E8E4DC] bg-[#FAF8F5] p-6 sm:p-10 shadow-xs">
            <div className="max-w-3xl mb-8">
              <span className="text-xs uppercase tracking-widest font-bold text-[#8C7F5F]">
                {t("overnightStayHeader")}
              </span>
              <h2 className="font-serif text-3xl text-[#222225] mt-1 font-normal">
                {t("roomConfigurationHeader")}
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6862] mt-2 leading-relaxed">
                {t("roomConfigurationDesc")}
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#E8E4DC] bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-[#222225] font-serif uppercase tracking-wider text-xs border-b border-[#E8E4DC]">
                  <tr>
                    <th className="px-5 py-4 font-semibold">{tc("Room Configuration")}</th>
                    <th className="px-5 py-4 font-semibold">{tc("Maximum Guests")}</th>
                    <th className="px-5 py-4 font-semibold">{tc("Weekday Price")}</th>
                    <th className="px-5 py-4 font-semibold">{tc("Weekend Price")}</th>
                    <th className="px-5 py-4 font-semibold">{tc("Peak Season Price")}</th>
                    <th className="px-5 py-4 font-semibold">{tc("Extra Guest")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E4DC]">
                  {versatileHouse.stayConfigurations.map((stay) => (
                    <tr key={stay.bedrooms} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="px-5 py-4 font-semibold text-[#222225]">{stay.bedrooms} {tc("Bedroom")}</td>
                      <td className="px-5 py-4 text-[#6B6862]">{tc("Max {count} Guests", { count: stay.maxGuests })}</td>
                      <td className="px-5 py-4 font-semibold text-[#222225]">
                        {formatPrice(stay.weekdayPriceIdr)}
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#222225]">
                        {formatPrice(stay.weekendPriceIdr)}
                      </td>
                      <td className="px-5 py-4 text-[#6B6862]">
                        {formatPrice(stay.peakSeasonPriceIdr)}
                      </td>
                      <td className="px-5 py-4 text-[#8C7F5F]">
                        {formatPrice(stay.extraGuestPriceIdr)}{tc("/pax")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-[#6B6862] border-t border-[#E8E4DC] pt-3">
              <span className="font-semibold text-[#222225]">
                {tc("One-time Cleaning Fee:")} {formatPrice(versatileHouse.price.cleaningFeeIdr)}
              </span>
              <a
                href={`${whatsappBase("EVENT")}?text=${encodeURIComponent("Hello Kinghouse! I would like to inquire about room stay configurations at Versatile House Jagakarsa.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-[#8C7F5F] hover:text-[#222225] font-semibold"
              >
                <span>{tc("Inquire Custom Stay via WhatsApp")}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
