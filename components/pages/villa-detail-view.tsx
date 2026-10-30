import { notFound } from "next/navigation"
import Link from "@/components/ui/localized-link"
import type { Metadata } from "next"
import Image from "next/image"
import { Star, ShieldCheck, ChevronRight, Sparkles, MapPin, MessageCircle, ArrowUpRight } from "lucide-react"
import { CURATED_VILLAS } from "@/lib/data"
import { SITE_CONFIG } from "@/lib/constants"
import { BentoGallery } from "@/components/bento/bento-gallery"
import { BookingSidebar } from "@/components/villas/booking-sidebar"
import { AmenitiesGrid } from "@/components/villas/amenities-grid"
import { LocationProximityMap } from "@/components/villas/location-proximity-map"
import { SchemaMarkup } from "@/components/villas/schema-markup"
import { PropertyViewTracker } from "@/components/villas/property-view-tracker"
import { Badge } from "@/components/ui/badge"
import { whatsappBase } from "@/lib/funnel/whatsapp"
import { contentTranslator } from "@/lib/i18n/content"
import { idPageMetadata, localeAlternates, localizePath, type SiteLocale } from "@/lib/i18n/site"

/** Indonesian search titles and descriptions per villa. */
const ID_SEO: Record<string, { title: string; description: string }> = {
  "versatile-house-jagakarsa": {
    title: "Villa Private Pool Jagakarsa, Jakarta Selatan | Kinghouse",
    description:
      "Villa 5 kamar dengan kolam renang pribadi dan taman 500m² di Jagakarsa, Jakarta Selatan. Muat 12 tamu, cocok untuk keluarga besar, gathering, dan acara.",
  },
  "sky-house-tangerang": {
    title: "Apartemen Harian Tangerang Dekat IKEA | Kinghouse",
    description:
      "Kamar bernuansa hotel di Pinang, Tangerang — 5 menit ke IKEA & Mall Alam Sutera. WiFi cepat, self check-in, akses kolam renang & gym. Sewa harian.",
  },
  "skyline-luxury-orange-county-cikarang": {
    title: "Sewa Apartemen Harian Cikarang Orange County | Kinghouse",
    description:
      "Apartemen eksekutif dengan pemandangan kota di Orange County, Cikarang. Dekat Jababeka & EJIP, kolam onsen, gym. Sewa harian hingga bulanan.",
  },
  "bright-airy-apartment-palmerah": {
    title: "Sewa Apartemen Harian Palmerah, Jakarta Barat | Kinghouse",
    description:
      "Apartemen terang di Palmerah, 10 menit jalan kaki ke Stasiun Palmerah dan dekat Senayan. WiFi fiber, meja kerja, dapur lengkap. Sewa harian.",
  },
}

export function villaMetadata(slug: string, locale: SiteLocale): Metadata {
  const villa = CURATED_VILLAS.find((v) => v.slug === slug)
  if (!villa) return { title: "Property Not Found | Kinghouse Management" }
  const path = `/locations/${villa.areaSlug}/villas/${villa.slug}`
  const image = villa.seoMeta?.ogImage ?? villa.heroImage
  const images = [{ url: image, width: 1200, height: 800, alt: villa.name }]
  if (locale === "id" && ID_SEO[villa.slug]) {
    return idPageMetadata({ path, ...ID_SEO[villa.slug], images })
  }
  const rawTitle = villa.seoMeta?.metaTitle ?? `${villa.name} | Kinghouse`
  const rawDescription =
    villa.seoMeta?.metaDescription ?? `${villa.editorialDescription.lead} Managed by Kinghouse on Airbnb.`
  const description = rawDescription.slice(0, 155)
  return {
    title: { absolute: rawTitle },
    description,
    keywords: villa.seoMeta
      ? [villa.seoMeta.focusKeyword, villa.area, "airbnb", "Kinghouse Management", "King House", "short stay villa"]
      : undefined,
    alternates: localeAlternates(path, "en"),
    openGraph: {
      title: rawTitle,
      description,
      url: `${SITE_CONFIG.baseUrl}${path}`,
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: rawTitle,
      description,
      images: [image],
    },
  }
}

/** Villa detail page in both languages. */
export function VillaDetailView({ slug, locale }: { slug: string; locale: SiteLocale }) {
  const tx = contentTranslator(locale)
  const href = (path: string) => `${SITE_CONFIG.baseUrl}${localizePath(path, locale)}`
  const villa = CURATED_VILLAS.find((v) => v.slug === slug)

  if (!villa) {
    notFound()
  }

  // BreadcrumbList JSON-LD
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tx("Home"), item: href("/") },
      { "@type": "ListItem", position: 2, name: tx("Properties"), item: href("/villas") },
      { "@type": "ListItem", position: 3, name: villa.area, item: href(`/locations/${villa.areaSlug}`) },
      { "@type": "ListItem", position: 4, name: villa.name, item: href(`/locations/${villa.areaSlug}/villas/${villa.slug}`) },
    ],
  }


  // FAQ JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: tx("What is the maximum guest capacity at {name}?", { name: villa.name }),
        acceptedAnswer: {
          "@type": "Answer",
          text: tx("This property comfortably accommodates up to {guests} guests with {bedrooms} bedrooms, {beds} beds, and {bathrooms} bathrooms.", villa.capacity),
        },
      },
      {
        "@type": "Question",
        name: tx("How do I reserve this property?"),
        acceptedAnswer: {
          "@type": "Answer",
          text: tx("This property is available for instant booking via Airbnb at {url}. You can also connect with the Kinghouse WhatsApp concierge for direct assistance.", { url: villa.airbnbUrl }),
        },
      },
      {
        "@type": "Question",
        name: tx("Where is {name} located?", { name: villa.name }),
        acceptedAnswer: {
          "@type": "Answer",
          text: [
            tx("The property is situated in {location}.", { location: villa.location }),
            villa.nearbySpots[0]
              ? tx("Distance to {name} is approximately {distance} ({time}).", {
                  name: villa.nearbySpots[0].name,
                  distance: villa.nearbySpots[0].distance,
                  time: tx(villa.nearbySpots[0].travelTime),
                })
              : "",
          ].join(" ").trim(),
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
      {/* GA4 View Item Tracker */}
      <PropertyViewTracker
        propertyId={villa.id}
        propertyName={villa.name}
        area={villa.area}
        price={villa.price.idr}
      />

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
          <Link href="/" className="hover:text-[#222222] transition-colors">{tx("Home")}</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/villas" className="hover:text-[#222222] transition-colors">{tx("Properties")}</Link>
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
              {tx(villa.architecturalStyle)}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-[#222222]">
            {/* Rating & Reviews */}
            {villa.rating > 0 && (
              <div className="flex items-center space-x-1 font-semibold">
                <Star className="h-4 w-4 fill-[#222222] text-[#222222]" />
                <span>{villa.rating.toFixed(2)}</span>
                <span className="text-[#717171] font-normal">({tx("{count} reviews", { count: villa.reviewsCount })})</span>
              </div>
            )}
            {villa.rating === 0 && (
              <div className="flex items-center space-x-1 text-[#A69C8E]">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-xs">{tx("New Listing")}</span>
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
              <span>{tx(villa.location)}</span>
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
                  {tx(PROPERTY_TYPE_LABELS[villa.propertyType] ?? "Property")} — {tx("Managed by Kinghouse")}
                </h2>
                <div className="flex items-center space-x-4 text-xs sm:text-sm text-[#717171]">
                  <span>{villa.capacity.guests} {tx("Guests")}</span>
                  <span>&bull;</span>
                  <span>{villa.capacity.bedrooms} {tx("Bedrooms")}</span>
                  <span>&bull;</span>
                  <span>{villa.capacity.beds} {tx("Beds")}</span>
                  <span>&bull;</span>
                  <span>{villa.capacity.bathrooms} {tx("Bathrooms")}</span>
                </div>
              </div>
            </div>

            {/* Editorial Overview & Lead */}
            <div className="space-y-6">
              <p className="text-base sm:text-lg text-[#222222] font-light leading-relaxed">
                {tx(villa.editorialDescription.lead)}
              </p>

              <div className="space-y-3 pt-2">
                <h3 className="font-serif text-xl text-[#222222]">{tx("Architectural Highlights")}</h3>
                <p className="text-sm text-[#717171] leading-relaxed">
                  {tx(villa.editorialDescription.architecturalHighlights)}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-serif text-xl text-[#222222]">{tx("The Space & Materials")}</h3>
                <p className="text-sm text-[#717171] leading-relaxed">
                  {tx(villa.editorialDescription.theSpace)}
                </p>
              </div>
            </div>

            {/* In-House Hospitality Commitment Badge */}
            <div className="rounded-2xl border border-[#EBEBEB] bg-[#FAFAFA] p-6 flex items-start space-x-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#222222] text-white">
                <ShieldCheck className="h-5 w-5 text-[#A69C8E]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-[#222222]">{tx("Kinghouse Superhost Standard")}</h4>
                <p className="text-xs text-[#717171] leading-relaxed">
                  {tx("Every stay includes daily housekeeping, linen changes, private butler service on demand, and 24/7 WhatsApp concierge backing.")}
                </p>
              </div>
            </div>

            {/* Wedding & Private Event Spotlight (Exclusive to Versatile House) */}
            {villa.slug === "versatile-house-jagakarsa" && (
              <div className="relative overflow-hidden rounded-3xl border border-[#DFC58E]/40 bg-gradient-to-br from-[#222225] via-[#1E1E22] to-[#141416] p-6 sm:p-8 text-white shadow-lg space-y-6">
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 shadow-md">
                  <Image
                    src="/properties/versatile-house/events/portfolio/ceremony-lawn-altar.jpg"
                    alt={tx("Intimate Wedding Ceremony Altar at Versatile House Jagakarsa")}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#DFC58E] text-[#19191B] shadow-sm">
                      {tx("Wedding & Event Venue")}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-xs text-[#DFC58E] uppercase tracking-wider font-semibold block">
                      {tx("500m² Tropical Garden • Up to 50 Guests Seated")}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-normal drop-shadow-sm">
                      {tx("Host Your Intimate Wedding or Private Event Here")}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
                    {tx("Planning a private garden wedding, Akad Nikah, or twilight banquet? Versatile House Jagakarsa offers 100% vendor freedom with")}{" "}
                    <strong>{tx("0% vendor corkage fees")}</strong>
                    {tx(", overnight accommodation for 15 family members, and weather backup spaces.")}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-white/70">
                    <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10">{tx("0% Corkage Fee")}</span>
                    <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10">{tx("Foreigner-Friendly Desk")}</span>
                    <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10">{tx("Bridal Master Suite")}</span>
                    <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10">{tx("Rain Backup Hall")}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
                  <span className="text-xs text-white/60">
                    {tx("Starting from Rp 2,800,000 / event session")}
                  </span>
                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <Link
                      href="/events/garden-wedding-jagakarsa"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white text-[#222225] text-xs font-semibold hover:bg-[#FAF8F5] transition-all"
                    >
                      <span>{tx("View Wedding Packages & Lookbook")}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                    <a
                      href={`${whatsappBase("EVENT")}?text=Halo%20Kinghouse!%20Saya%20tertarik%20untuk%20menanyakan%20event%20/%20wedding%20di%20Versatile%20House%20Jagakarsa.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-2.5 rounded-xl bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors"
                      title={tx("Wedding consultation via WhatsApp")}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* 2-Column Amenities Grid */}
            <AmenitiesGrid amenities={villa.amenities} locale={locale} />

            {/* House Rules & Stay Policies */}
            {villa.houseRules && villa.houseRules.length > 0 && (
              <div className="rounded-2xl border border-[#EBEBEB] bg-[#FAFAFA] p-6 sm:p-8 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBEBEB] pb-4">
                  <div className="space-y-1">
                    <h3 className="font-serif text-2xl text-[#222222]">{tx("House Rules & Policies")}</h3>
                    <p className="text-xs text-[#717171]">
                      {tx("Stay rules and policies at {name}", { name: villa.name })}
                    </p>
                  </div>
                  <Link
                    href={`/stay/${villa.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B8934C] hover:text-[#8C7F5F] transition-colors self-start sm:self-auto"
                  >
                    <span>{tx("Open the Digital Stay Guide")}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {villa.houseRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-xl border border-[#EBEBEB] bg-white p-3.5 text-xs text-[#444444] shadow-xs"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#222222] text-xs font-bold text-white mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{tx(rule)}</span>
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
              locale={locale}
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
