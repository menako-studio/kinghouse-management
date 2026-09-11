export interface VillaAmenity {
  name: string
  category: "essentials" | "luxury" | "outdoor" | "services"
  icon: string
}

export interface NearbySpot {
  name: string
  category: "mall" | "transport" | "dining" | "landmark" | "airport" | "beach" | "cafe"
  distance: string
  travelTime: string
}

export interface SeoMeta {
  metaTitle: string
  metaDescription: string
  focusKeyword: string
  ogImage?: string
  canonicalUrl?: string
}

export interface RoomStayConfiguration {
  bedrooms: number
  maxGuests: number
  weekdayPriceIdr: number
  weekendPriceIdr: number
  peakSeasonPriceIdr: number
  extraGuestPriceIdr: number
}

export interface Villa {
  id: string
  name: string
  tagline: string
  slug: string
  area: string
  areaSlug: string
  location: string
  propertyType: "entire-home" | "private-room" | "entire-apartment" | "villa"
  airbnbUrl: string
  airbnbIcalUrl?: string
  airbnbEventUrl?: string
  airbnbEventIcalUrl?: string
  bookingComUrl?: string
  agodaUrl?: string
  agodaIcalUrl?: string
  superhost: boolean
  guestFavorite: boolean
  rating: number
  reviewsCount: number
  price: {
    usd: number
    idr: number
    cleaningFeeIdr: number
    serviceFeePercent: number
  }
  stayConfigurations?: RoomStayConfiguration[]
  capacity: {
    guests: number
    bedrooms: number
    beds: number
    bathrooms: number
  }
  heroImage: string
  gallery: {
    url: string
    caption: string
    category: "exterior" | "living" | "bedroom" | "pool" | "bathroom" | "dining" | "garden" | "kitchen"
  }[]
  editorialDescription: {
    lead: string
    architecturalHighlights: string
    theSpace: string
  }
  amenities: VillaAmenity[]
  nearbySpots: NearbySpot[]
  houseRules?: string[]
  featured: boolean
  architecturalStyle: string
  seoMeta?: SeoMeta
}

export interface PartnerLogo {
  name: string
  logoText: string
  badgeText?: string
}

export interface Testimonial {
  id: string
  type: "guest" | "owner"
  author: string
  roleOrLocation: string
  avatar: string
  rating: number
  quote: string
  propertyName?: string
  metricLift?: string
}

export interface ManagementTier {
  id: string
  name: string
  subtitle: string
  feePercentage: number
  feeNote: string
  badge?: string
  description: string
  popular?: boolean
  features: {
    title: string
    included: boolean
    highlight?: boolean
  }[]
  idealFor: string
}

export interface CaseStudy {
  id: string
  propertyName: string
  location: string
  image: string
  period: string
  beforeMetrics: {
    occupancyRate: number
    monthlyRevenueIdr: number
    guestRating: number
  }
  afterMetrics: {
    occupancyRate: number
    monthlyRevenueIdr: number
    guestRating: number
    ebitdaMargin: number
  }
  summary: string
  quote: {
    text: string
    author: string
  }
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  publishedAt: string
  status?: "Published" | "Draft" | "Archived"
  seoScore?: number
  author: {
    name: string
    role: string
    avatar: string
  }
  heroImage: string
  tags: string[]
  seoKeywords: string[]
  readTime: number
  featured: boolean
}


export interface EventPackage {
  name: string
  description: string
  pax?: number
  durationHours?: number
  packageType?: "half-day" | "full-day" | "full-board"
  priceIdr: number
  weekendPriceIdr?: number
  priceNote: string
  includes: string[]
}

export interface VillaEvent {
  id: string
  propertyId: string
  propertySlug: string
  propertyName: string
  title: string
  slug: string
  category: "wedding" | "corporate" | "birthday" | "intimate-gathering" | "wellness"
  tagline: string
  description: string
  maxCapacity: number
  heroImage: string
  gallery: string[]
  packages: EventPackage[]
  highlights: string[]
}

