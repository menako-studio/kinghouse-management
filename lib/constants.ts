// Kinghouse — Core Site Configuration & Metadata
// Covers: Jabodetabek region (Jakarta, Tangerang, Bekasi, Cikarang)

const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kinghousemanagement.com"
const sanitizedBaseUrl =
  rawBaseUrl.includes("kinghousemanagemet") || !rawBaseUrl.startsWith("http")
    ? "https://www.kinghousemanagement.com"
    : rawBaseUrl.replace(/\/$/, "")

export const SITE_CONFIG = {
  name: "Kinghouse Management",
  shortName: "Kinghouse",
  domain: "kinghousemanagement.com",
  baseUrl: sanitizedBaseUrl,
  tagline: "Professional Short-Stay Property Management & Villa Concierge in Jabodetabek",
  brandAliases: [
    "Kinghouse Management",
    "King House Management",
    "Kinghouse",
    "King House Property Management",
    "kinghousemanagement.com",
    "www.kinghousemanagement.com",
  ],
  description: {
    en: "Kinghouse Management is a premier editorial short-stay property management agency in Greater Jakarta (Jagakarsa, Tangerang, Palmerah, Cikarang). We maximize owner revenue and Airbnb occupancy through dynamic pricing, 24/7 guest concierge, and professional hospitality operations.",
    id: "Kinghouse Management adalah jasa manajemen properti sewa jangka pendek dan villa profesional di Jabodetabek (Jakarta Selatan, Tangerang, Jakarta Barat, Cikarang). Kami memaksimalkan pendapatan pemilik properti dan okupansi Airbnb dengan dynamic pricing dan layanan concierge 24/7.",
  },

  company: {
    legalName: "PT Kreasi Usman Gosse",
    brandName: "Kinghouse Management",
    cleaningBrandName: "Kinghouse Cleaning",
    googleBusinessProfile: "https://share.google/WHLcKlmJf8zZo27gO",
    careersUrl: "https://glints.com/id/en/companies/pt-kreasi-usman-gosse/351bd7d6-fff5-4a77-a91b-f69918d3b2fe",
    cleaningWebsite: "https://www.kinghousecleaning.id/",
  },
  contact: {
    email: "ptkreasiusmangosse@gmail.com",
    phone: "+62 821-2393-3218",
    whatsapp: "+62 821-2393-3218",
    whatsappMessage: "Hello Kinghouse Management, I am interested in your property management and villa booking services.",
    address: "Jl. Reni Jaya Blk. K2 No.16, Pd. Ranji, Kec. Ciputat Tim., Kota Tangerang Selatan, Banten 15416",
    mapsUrl: "https://www.google.com/search?sca_esv=d3239205b7f4fd26&hl=en&authuser=0&sxsrf=APpeQnukDFQYH45v1JGZCq_i_OhLcXqWIg:1789184395314&q=kinghouse+management+kota+tangerang+selatan+address&ludocid=8424800831686466391&sa=X&ved=2ahUKEwjmvMeij-iWAxXOm-EIHb6pFWsQ6BN6BAgmEAI",
  },
  social: {
    tiktok: "https://www.tiktok.com/@kinghouse.id",
    instagram: "https://instagram.com/kinghouse.id",
    linkedin: "https://www.linkedin.com/in/reizky-syaher/",
  },
  airbnbHostProfile:
    "https://www.airbnb.com/users/profile/1470743715397835749?previous_page_name=PdpHomeMarketplace",
} as const


// Managed areas in Jabodetabek
export const MANAGED_AREAS = [
  {
    name: "Jagakarsa",
    slug: "jagakarsa",
    region: "Jakarta Selatan",
    description:
      "Quiet, tree-lined enclave in South Jakarta. Ideal for families and longer stays with easy Toll access.",
    highlight: "Large family homes with private gardens",
  },
  {
    name: "Tangerang",
    slug: "tangerang",
    region: "Banten",
    description:
      "Rapidly growing satellite city with strong demand from business travelers and IKEA/Alam Sutera expats.",
    highlight: "Hotel-style comfort near business hubs",
  },
  {
    name: "Palmerah",
    slug: "palmerah",
    region: "Jakarta Barat",
    description:
      "Central Jakarta Barat with excellent connectivity — minutes from Palmerah Station and Sudirman.",
    highlight: "Urban convenience in Central Jakarta",
  },
  {
    name: "Cikarang",
    slug: "cikarang",
    region: "Bekasi",
    description:
      "Indonesia's premier industrial zone. High demand from expat professionals and business travelers at Orange County.",
    highlight: "Premium apartments for expat executives",
  },
] as const

export type AreaSlug = (typeof MANAGED_AREAS)[number]["slug"]

// Canonical list of all managed property types
export const PROPERTY_TYPES = [
  "Entire Home",
  "Private Room",
  "Entire Apartment",
  "Villa",
] as const

// Standard amenities offered across managed properties
export const STANDARD_AMENITIES = [
  "High-Speed WiFi",
  "Air Conditioning",
  "Hot Water",
  "Smart TV / Netflix",
  "Fully Equipped Kitchen",
  "Washing Machine",
  "24/7 Guest Support",
  "Self Check-in",
] as const

// Management service tiers for owner-facing pages
export const MANAGEMENT_SERVICES = {
  owners: [
    {
      title: "Listing Optimization & SEO",
      description:
        "Editorial-grade photography, keyword-optimized Airbnb titles & descriptions, and structured data markup to rank higher in search.",
      icon: "Search",
    },
    {
      title: "Dynamic Revenue Management",
      description:
        "AI-powered nightly pricing calibrated against Jabodetabek market demand, competitor rates, and seasonal calendars.",
      icon: "TrendingUp",
    },
    {
      title: "End-to-End Operations",
      description:
        "Housekeeping coordination, linen management, maintenance requests, and restocking — handled without bothering you.",
      icon: "Settings",
    },
    {
      title: "24/7 Guest Communication",
      description:
        "Instant multilingual response to all guest inquiries, check-in coordination, and in-stay support on your behalf.",
      icon: "MessageSquare",
    },
  ],
  guests: [
    {
      title: "Verified Properties",
      description:
        "Every listing is personally inspected, photographed, and approved by the Kinghouse team before going live.",
      icon: "ShieldCheck",
    },
    {
      title: "Seamless Airbnb Booking",
      description:
        "Book securely through Airbnb with instant confirmation, transparent pricing, and buyer protection.",
      icon: "CalendarCheck",
    },
    {
      title: "Hotel-Grade Cleanliness",
      description:
        "Professional turnover cleaning with fresh hotel-grade linens and toiletries before every check-in.",
      icon: "Sparkles",
    },
    {
      title: "24/7 Concierge Support",
      description:
        "Reach our team anytime via WhatsApp for local recommendations, transport, or any in-stay requests.",
      icon: "Headphones",
    },
  ],
} as const

// Blog categories for SEO content strategy
export const BLOG_CATEGORIES = [
  { slug: "owner-tips", label: "Owner Tips" },
  { slug: "airbnb-seo", label: "Airbnb SEO" },
  { slug: "jabodetabek-guide", label: "Jabodetabek Guide" },
  { slug: "revenue-management", label: "Revenue Management" },
  { slug: "guest-experience", label: "Guest Experience" },
] as const
