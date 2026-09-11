import { notFound } from "next/navigation"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, ArrowLeft, ArrowRight, Users, MessageSquare } from "lucide-react"
import { VILLA_EVENTS, CURATED_VILLAS } from "@/lib/data"
import { SITE_CONFIG } from "@/lib/constants"
import { formatCurrency } from "@/lib/utils"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return VILLA_EVENTS.map((event) => ({ slug: event.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const event = VILLA_EVENTS.find((e) => e.slug === slug)

  if (!event) {
    return { title: "Event Not Found | Kinghouse Management" }
  }

  return {
    title: `${event.title} — ${event.propertyName} | Kinghouse Management`,
    description: event.description.slice(0, 155),
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: {
      title: event.title,
      description: event.tagline,
      url: `/events/${event.slug}`,
      type: "website",
      images: [{ url: event.heroImage, width: 1200, height: 630, alt: event.title }],
    },
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  wedding: "Weddings",
  corporate: "Corporate Retreat",
  birthday: "Birthdays",
  "intimate-gathering": "Gatherings",
  wellness: "Wellness",
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params
  const event = VILLA_EVENTS.find((e) => e.slug === slug)

  if (!event) {
    notFound()
  }

  const property = CURATED_VILLAS.find((v) => v.id === event.propertyId)

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    image: event.heroImage,
    url: `${SITE_CONFIG.baseUrl}/events/${event.slug}`,
    organizer: {
      "@type": "Organization",
      name: "Kinghouse Management",
      url: SITE_CONFIG.baseUrl,
    },
    location: {
      "@type": "Place",
      name: event.propertyName,
      address: {
        "@type": "PostalAddress",
        addressLocality: property?.area ?? "Jagakarsa",
        addressRegion: "Jakarta Selatan",
        addressCountry: "ID",
      },
    },
    maximumAttendeeCapacity: event.maxCapacity,
    offers: event.packages.map((pkg) => ({
      "@type": "Offer",
      name: pkg.name,
      description: pkg.description,
      price: pkg.priceIdr,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
      url: `${SITE_CONFIG.baseUrl}/events/${event.slug}`,
    })),
  }


  const whatsappText = encodeURIComponent(
    `Hello KingHouse! I am interested in the "${event.title}" package at ${event.propertyName}. Could you please provide date availability and package details?`
  )

  return (
    <main className="min-h-screen bg-white">
      <script
        id="event-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      {/* Hero */}
      <div className="relative h-[50vh] sm:h-[65vh]">
        <Image src={event.heroImage} alt={event.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
          <div className="mx-auto max-w-7xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 mb-4">
              <span className="text-[10px] text-white font-medium uppercase tracking-wider">
                {CATEGORY_LABELS[event.category] ?? event.category}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-tight max-w-2xl mb-3">
              {event.title}
            </h1>
            <p className="text-white/80 text-sm sm:text-base max-w-xl">{event.tagline}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-[#717171] py-6 border-b border-[#EBEBEB]">
          <Link href="/" className="hover:text-[#222222]">Home</Link>
          <span>/</span>
          <Link href="/events" className="hover:text-[#222222]">Events</Link>
          <span>/</span>
          <span className="text-[#222222] font-medium">{event.title}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-12">
          {/* Left: Description & Highlights */}
          <div className="lg:col-span-7 space-y-10">
            {/* Description */}
            <div>
              <h2 className="font-serif text-2xl text-[#222222] mb-4">About This Event</h2>
              <p className="text-[#717171] text-sm leading-relaxed">{event.description}</p>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="font-serif text-2xl text-[#222222] mb-4">Venue Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.highlights.map((h) => (
                  <div key={h} className="flex items-start space-x-2.5 p-3 rounded-xl bg-[#FAFAFA] border border-[#EBEBEB]">
                    <CheckCircle2 className="h-4 w-4 text-[#A69C8E] mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-[#717171] leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            {event.gallery.length > 1 && (
              <div>
                <h2 className="font-serif text-2xl text-[#222222] mb-4">Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.gallery.map((img, i) => (
                    <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                      <Image src={img} alt={`${event.title} gallery ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Link */}
            {property && (
              <div className="rounded-2xl border border-[#EBEBEB] bg-[#FAFAFA] p-6">
                <h3 className="font-serif text-lg text-[#222222] mb-2">Venue Property</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={property.heroImage} alt={property.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#222222]">{property.name}</p>
                    <p className="text-xs text-[#717171]">{property.location}</p>
                    <p className="text-xs text-[#A69C8E] mt-1">
                      {property.capacity.guests} guests &bull; {property.capacity.bedrooms} bedrooms &bull; {property.capacity.bathrooms} baths
                    </p>
                  </div>
                  <Link
                    href={`/locations/${property.areaSlug}/villas/${property.slug}`}
                    className="text-xs font-medium text-[#222222] hover:underline flex-shrink-0"
                  >
                    View Villa →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right: Packages Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-[#A69C8E]" />
                <span className="text-xs text-[#717171]">Max. {event.maxCapacity} guests</span>
              </div>
              <h3 className="font-serif text-xl text-[#222222]">Select Package</h3>
              {event.packages.map((pkg, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border p-6 ${i === 1 ? "border-[#222222] bg-[#FAFAFA]" : "border-[#EBEBEB] bg-white"}`}
                >
                  {i === 1 && (
                    <div className="inline-block text-[10px] font-bold uppercase tracking-widest bg-[#222222] text-white px-3 py-1 rounded-full mb-3">
                      Most Popular
                    </div>
                  )}
                  <h4 className="font-semibold text-[#222222] text-sm mb-1">{pkg.name}</h4>
                  <p className="text-xs text-[#717171] mb-3">{pkg.description}</p>
                  <div className="mb-2">
                    <p className="font-serif text-2xl text-[#222222]">
                      {formatCurrency(pkg.priceIdr, "IDR")}
                      <span className="text-xs font-normal text-[#717171]"> (Weekday)</span>
                    </p>
                    {pkg.weekendPriceIdr && (
                      <p className="text-xs text-[#8C7F5F] font-semibold mt-0.5">
                        Weekend Rate: {formatCurrency(pkg.weekendPriceIdr, "IDR")}
                      </p>
                    )}
                  </div>
                  <p className="text-[10px] text-[#A69C8E] mb-4">{pkg.priceNote}</p>
                  <div className="space-y-1.5 mb-5 border-t border-[#EBEBEB] pt-4">
                    {pkg.includes.map((item) => (
                      <div key={item} className="flex items-start space-x-2">
                        <CheckCircle2 className="h-3 w-3 text-[#A69C8E] mt-0.5 flex-shrink-0" />
                        <span className="text-[11px] text-[#717171] leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                  <a
                    href={`https://wa.me/6282123933218?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center space-x-2 w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
                      i === 1
                        ? "bg-[#222222] text-white hover:bg-[#333333]"
                        : "bg-[#F5F4F0] text-[#222222] hover:bg-[#EBEBEB]"
                    }`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Inquire via WhatsApp</span>
                  </a>
                </div>
              ))}
              <p className="text-[10px] text-[#A69C8E] text-center">
                * Prices exclude catering, floral decor, and photography. Custom packages available.
              </p>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="pb-12 border-t border-[#EBEBEB] pt-8">
          <Link
            href="/events"
            className="inline-flex items-center space-x-2 text-sm text-[#717171] hover:text-[#222222] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Events</span>
          </Link>
        </div>
      </div>
    </main>
  )
}

