import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import { Star, ShieldCheck, ChevronRight, Bed, Bath, Users, Sparkles, MapPin, ArrowLeft } from "lucide-react"
import { CURATED_VILLAS } from "@/lib/data"
import { SITE_CONFIG } from "@/lib/constants"
import { BentoGallery } from "@/components/bento/bento-gallery"
import { BookingSidebar } from "@/components/villas/booking-sidebar"
import { AmenitiesGrid } from "@/components/villas/amenities-grid"
import { LocationProximityMap } from "@/components/villas/location-proximity-map"
import { SchemaMarkup } from "@/components/villas/schema-markup"
import { Badge } from "@/components/ui/badge"

interface PageProps {
  params: Promise<{
    area: string
    slug: string
  }>
}

export async function generateStaticParams() {
  return CURATED_VILLAS.map((villa) => ({
    area: villa.areaSlug,
    slug: villa.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const villa = CURATED_VILLAS.find((v) => v.slug === resolvedParams.slug)

  if (!villa) {
    return { title: "Property Not Found | Kinghouse Management" }
  }

  const title = villa.seoMeta?.metaTitle ?? `${villa.name} — ${villa.area} | Kinghouse Management`
  const description =
    villa.seoMeta?.metaDescription ??
    `${villa.editorialDescription.lead} Professionally managed by Kinghouse Management on Airbnb.`
  const image = villa.seoMeta?.ogImage ?? villa.heroImage
  const canonicalUrl = `/locations/${villa.areaSlug}/villas/${villa.slug}`

  return {
    title,
    description,
    keywords: villa.seoMeta
      ? [villa.seoMeta.focusKeyword, villa.area, "airbnb", "Kinghouse Management", "King House", "short stay villa"]
      : undefined,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [{ url: image, width: 1200, height: 800, alt: villa.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

export default async function VillaDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const villa = CURATED_VILLAS.find((v) => v.slug === resolvedParams.slug)

  if (!villa) {
    notFound()
  }

  // BreadcrumbList JSON-LD
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_CONFIG.baseUrl },
      { "@type": "ListItem", position: 2, name: "Properties", item: `${SITE_CONFIG.baseUrl}/villas` },
      { "@type": "ListItem", position: 3, name: villa.area, item: `${SITE_CONFIG.baseUrl}/locations/${villa.areaSlug}` },
      { "@type": "ListItem", position: 4, name: villa.name, item: `${SITE_CONFIG.baseUrl}/locations/${villa.areaSlug}/villas/${villa.slug}` },
    ],
  }


  // FAQ JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the maximum guest capacity at ${villa.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `This property comfortably accommodates up to ${villa.capacity.guests} guests with ${villa.capacity.bedrooms} bedrooms, ${villa.capacity.beds} beds, and ${villa.capacity.bathrooms} bathrooms.`,
        },
      },
      {
        "@type": "Question",
        name: "How do I reserve this property?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `This property is available for instant booking via Airbnb at ${villa.airbnbUrl}. You can also connect with the KingHouse WhatsApp concierge for direct assistance.`,
        },
      },
      {
        "@type": "Question",
        name: `Where is ${villa.name} located?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The property is situated in ${villa.location}. ${villa.nearbySpots[0] ? `Distance to ${villa.nearbySpots[0].name} is approximately ${villa.nearbySpots[0].distance} (${villa.nearbySpots[0].travelTime}).` : ""}`,
        },
      },
    ],
  }

  const PROPERTY_TYPE_LABELS: Record<string, string> = {
    "entire-home": "Entire Villa",
    "private-room": "Private Suite",
    "entire-apartment": "Entire Apartment",
    "villa": "Private Villa",
  }

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* SEO Schemas */}
      <SchemaMarkup villa={villa} />
      <script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-12 pt-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-[#717171] mb-6">
          <Link href="/" className="hover:text-[#222222] transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/villas" className="hover:text-[#222222] transition-colors">Properties</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#222222] font-medium">{villa.name}</span>
        </nav>

        {/* Header Info */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#222222] font-normal">
              {villa.name}
            </h1>
            <Badge variant="accent" className="text-xs uppercase tracking-wider self-start sm:self-auto py-1 px-3">
              {villa.architecturalStyle}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-[#222222]">
            {/* Rating & Reviews */}
            {villa.rating > 0 && (
              <div className="flex items-center space-x-1 font-semibold">
                <Star className="h-4 w-4 fill-[#222222] text-[#222222]" />
                <span>{villa.rating.toFixed(2)}</span>
                <span className="text-[#717171] font-normal">({villa.reviewsCount} reviews)</span>
              </div>
            )}
            {villa.rating === 0 && (
              <div className="flex items-center space-x-1 text-[#A69C8E]">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-xs">New Listing</span>
              </div>
            )}

            <span>&bull;</span>

            {/* Superhost Badge */}
            {villa.superhost && (
              <div className="flex items-center space-x-1.5 font-medium">
                <Sparkles className="h-3.5 w-3.5 text-[#A69C8E]" />
                <span>Airbnb Superhost</span>
              </div>
            )}

            <span>&bull;</span>

            {/* Micro Location */}
            <div className="flex items-center space-x-1 text-[#717171]">
              <MapPin className="h-3.5 w-3.5" />
              <span>{villa.location}</span>
            </div>
          </div>
        </div>

        {/* 1. Bento-Box Image Gallery (Airbnb style 1 + 4 Grid) */}
        <div className="mb-12">
          <BentoGallery images={villa.gallery} propertyName={villa.name} />
        </div>

        {/* 2-Column Split: Editorial Content (Left) & Sticky Booking Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-4">
          {/* Left Column (Editorial & Amenities) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Micro-Data Specs Bar */}
            <div className="flex items-center justify-between pb-8 border-b border-[#EBEBEB]">
              <div className="space-y-1">
                <h2 className="font-serif text-2xl text-[#222222]">
                  {PROPERTY_TYPE_LABELS[villa.propertyType] ?? "Property"} — Managed by KingHouse
                </h2>
                <div className="flex items-center space-x-4 text-xs sm:text-sm text-[#717171]">
                  <span>{villa.capacity.guests} Guests</span>
                  <span>&bull;</span>
                  <span>{villa.capacity.bedrooms} Bedrooms</span>
                  <span>&bull;</span>
                  <span>{villa.capacity.beds} Beds</span>
                  <span>&bull;</span>
                  <span>{villa.capacity.bathrooms} Bathrooms</span>
                </div>
              </div>
            </div>

            {/* Editorial Overview & Lead */}
            <div className="space-y-6">
              <p className="text-base sm:text-lg text-[#222222] font-light leading-relaxed">
                {villa.editorialDescription.lead}
              </p>

              <div className="space-y-3 pt-2">
                <h3 className="font-serif text-xl text-[#222222]">Architectural Highlights</h3>
                <p className="text-sm text-[#717171] leading-relaxed">
                  {villa.editorialDescription.architecturalHighlights}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-serif text-xl text-[#222222]">The Space & Materials</h3>
                <p className="text-sm text-[#717171] leading-relaxed">
                  {villa.editorialDescription.theSpace}
                </p>
              </div>
            </div>

            {/* In-House Hospitality Commitment Badge */}
            <div className="rounded-2xl border border-[#EBEBEB] bg-[#FAFAFA] p-6 flex items-start space-x-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#222222] text-white">
                <ShieldCheck className="h-5 w-5 text-[#A69C8E]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-[#222222]">KingHouse Superhost Standard</h4>
                <p className="text-xs text-[#717171] leading-relaxed">
                  Every stay includes daily housekeeping, linen changes, private butler service on demand, and 24/7 WhatsApp concierge backing.
                </p>
              </div>
            </div>

            {/* 2-Column Amenities Grid */}
            <AmenitiesGrid amenities={villa.amenities} />

            {/* House Rules & Stay Policies */}
            {villa.houseRules && villa.houseRules.length > 0 && (
              <div className="rounded-2xl border border-[#EBEBEB] bg-[#FAFAFA] p-6 sm:p-8 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBEBEB] pb-4">
                  <div className="space-y-1">
                    <h3 className="font-serif text-2xl text-[#222222]">House Rules & Policies</h3>
                    <p className="text-xs text-[#717171]">
                      Ketentuan dan peraturan menginap di {villa.name}
                    </p>
                  </div>
                  <Link
                    href={`/stay/${villa.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B8934C] hover:text-[#8C7F5F] transition-colors self-start sm:self-auto"
                  >
                    <span>Buka Panduan Tamu Digital (Stay Guide)</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {villa.houseRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-xl border border-[#EBEBEB] bg-white p-3.5 text-xs text-[#444444] shadow-xs"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#222222] text-[10px] font-bold text-white mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location & Proximity Map */}
            <LocationProximityMap
              location={villa.location}
              area={villa.area}
              nearbySpots={villa.nearbySpots}
            />
          </div>

          {/* Right Column (Sticky Booking Sidebar) */}
          <div className="lg:col-span-5">
            <BookingSidebar villa={villa} />
          </div>
        </div>
      </div>
    </main>
  )
}
