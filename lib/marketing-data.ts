// Testimonials, management tiers, case studies and trust partners. Kept apart
// from lib/data so client components that show them do not bundle every villa.
import type { Testimonial, ManagementTier, CaseStudy } from "./types"

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    type: "owner",
    author: "Budi Santoso",
    roleOrLocation: "Owner, Versatile House Jagakarsa",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    quote:
      "Kinghouse transformed our family home in Jagakarsa into a steady income stream. From zero bookings to 80%+ occupancy in 3 months — their Airbnb SEO and listing optimization is genuinely impressive.",
    propertyName: "Versatile House With Beautiful Garden Beyond",
    metricLift: "+80% Occupancy in 90 Days",
  },
  {
    id: "test-2",
    type: "guest",
    author: "David Lim",
    roleOrLocation: "Operations Manager, Singapore (Business Travel)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    quote:
      "Stayed at the Orange County apartment for 2 weeks while overseeing our Jababeka plant. The location is perfect, the apartment felt like a hotel suite, and Kinghouse's WhatsApp support was instant. Will rebook.",
    propertyName: "Skyline Luxury at Orange County",
  },
  {
    id: "test-3",
    type: "owner",
    author: "Sari Wijaya",
    roleOrLocation: "Owner, Sky House Tangerang",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    quote:
      "I was skeptical at first, but the team's photography and copywriting completely changed how guests perceive our humble room. Rating jumped from 4.6 to 4.9 and bookings are now fully automated.",
    propertyName: "Sky House • Hotel-Style Bed + IKEA 5min",
    metricLift: "4.6 → 4.9 Rating",
  },
  {
    id: "test-4",
    type: "guest",
    author: "Ayu Pramesti",
    roleOrLocation: "Marketing Director, Jakarta",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    quote:
      "Booked the Jagakarsa house for our team offsite — 10 colleagues, 5 days. The garden was perfect for morning sessions, the kitchen handled our catering, and the house was spotless on arrival. Effortless.",
    propertyName: "Versatile House With Beautiful Garden Beyond",
  },
]

// ─── MANAGEMENT TIERS ─────────────────────────────────────────────────────────

export const MANAGEMENT_TIERS: ManagementTier[] = [
  {
    id: "exclusive-marketing",
    name: "Exclusive Marketing",
    subtitle: "High-yield Airbnb distribution & revenue optimization for self-operating owners",
    feeKind: "on-request",
    description:
      "Designed for property owners who handle their own cleaning and operations, but want Kinghouse's Airbnb SEO expertise, dynamic pricing, and professional listing management to maximize bookings.",
    idealFor: "Owners with existing cleaning support who want maximum Airbnb revenue without full management.",
    popular: false,
    features: [
      { title: "Professional photography & editorial listing copy", included: true, highlight: true },
      { title: "Airbnb SEO optimization (title, description, keywords)", included: true, highlight: true },
      { title: "Real-time dynamic pricing & competitor analysis", included: true },
      { title: "24/7 multilingual guest communication & vetting", included: true },
      { title: "Automated payment processing & damage protection", included: true },
      { title: "Monthly revenue & occupancy reporting dashboard", included: true },
      { title: "Turnkey housekeeping & linen management", included: false },
      { title: "Preventive maintenance coordination", included: false },
      { title: "Dedicated on-site check-in host", included: false },
      { title: "Guest concierge & local recommendations service", included: false },
    ],
  },
  {
    id: "full-management",
    name: "Full Asset Management",
    subtitle: "Completely hands-off, 360° turnkey operations for maximum ROI",
    feeKind: "by-property",
    badge: "Most Popular",
    description:
      "Our complete management model — we handle everything from Airbnb listing to guest checkout, cleaning coordination, maintenance, and monthly financial reporting. You receive passive income without lifting a finger.",
    idealFor: "Busy professionals and investors who want true passive income from their Jabodetabek property.",
    popular: true,
    features: [
      { title: "Professional photography & editorial listing copy", included: true, highlight: true },
      { title: "Airbnb SEO optimization (title, description, keywords)", included: true, highlight: true },
      { title: "Real-time dynamic pricing & competitor analysis", included: true },
      { title: "24/7 multilingual guest communication & vetting", included: true },
      { title: "Automated payment processing & damage protection", included: true },
      { title: "Monthly revenue & occupancy reporting dashboard", included: true },
      { title: "Turnkey housekeeping & fresh linen for every guest", included: true, highlight: true },
      { title: "Preventive maintenance & rapid repair coordination", included: true, highlight: true },
      { title: "Dedicated check-in coordination & key management", included: true, highlight: true },
      { title: "Guest concierge & local recommendations service", included: true, highlight: true },
    ],
  },
]

// ─── CASE STUDIES ─────────────────────────────────────────────────────────────

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "cs-1",
    propertyName: "Versatile House With Beautiful Garden Beyond",
    location: "Jagakarsa, Jakarta Selatan",
    image:
      "/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg",
    period: "90-Day Onboarding Performance",
    beforeMetrics: {
      occupancyRate: 28,
      monthlyRevenueIdr: 12000000,
      guestRating: 4.5,
    },
    afterMetrics: {
      occupancyRate: 82,
      monthlyRevenueIdr: 38000000,
      guestRating: 4.9,
      ebitdaMargin: 44,
    },
    summary:
      "Repositioned from an under-priced family home listing to a sought-after Jagakarsa group stay destination. Editorial photography, keyword-optimized copy, and dynamic weekend pricing tripled monthly revenue in 90 days.",
    quote: {
      text: "I had no idea our house could earn this much. Kinghouse basically turned a burden into a business.",
      author: "Budi Santoso (Owner)",
    },
  },
  {
    id: "cs-2",
    propertyName: "Skyline Luxury at Orange County",
    location: "Cikarang Selatan, Bekasi",
    image:
      "/properties/skyline-luxury/SkylineLuxury_OrangeCounty_KamarUtama.webp",
    period: "6-Month Revenue Review",
    beforeMetrics: {
      occupancyRate: 35,
      monthlyRevenueIdr: 8000000,
      guestRating: 4.6,
    },
    afterMetrics: {
      occupancyRate: 78,
      monthlyRevenueIdr: 22000000,
      guestRating: 4.83,
      ebitdaMargin: 41,
    },
    summary:
      "Targeted the high-demand expat-executive segment working in Cikarang's industrial zones. Premium positioning, Nespresso amenity add, and direct Jababeka/EJIP corporate keyword targeting doubled occupancy.",
    quote: {
      text: "The apartment now pays its own mortgage — and then some. The ROI has been remarkable.",
      author: "Property Owner, Cikarang",
    },
  },
]

// ─── TRUST PARTNERS ───────────────────────────────────────────────────────────

// `live: false` partners are not shown on the site; flip to true once the channel is active.
// Badge copy is translated via the `badgeKey` entries in localization-context.
export const TRUST_PARTNERS = [
  { name: "Airbnb", badgeKey: "partnerBadgeManagedHost", logoText: "Airbnb", live: true },
  { name: "Booking.com", badgeKey: "partnerBadgeComingSoon", logoText: "Booking.com", live: false },
  { name: "Agoda", badgeKey: "partnerBadgeComingSoon", logoText: "Agoda", live: false },
  { name: "Google", badgeKey: "partnerBadgeVerifiedBusiness", logoText: "Google", live: true },
  { name: "WhatsApp Business", badgeKey: "partnerBadgeVerifiedBusiness", logoText: "WhatsApp", live: true },
]
