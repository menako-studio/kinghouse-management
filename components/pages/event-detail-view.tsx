import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "@/components/ui/localized-link"
import { CheckCircle2, ArrowLeft, Users, MessageSquare, Globe } from "lucide-react"
import { VILLA_EVENTS, CURATED_VILLAS } from "@/lib/data"
import { SITE_CONFIG } from "@/lib/constants"
import { formatCurrency } from "@/lib/utils"
import { whatsappBase } from "@/lib/funnel/whatsapp"
import { contentTranslator } from "@/lib/i18n/content"
import { idPageMetadata, localeAlternates, localizePath, type SiteLocale } from "@/lib/i18n/site"

/** Indonesian search titles for the event package pages. */
const ID_TITLES: Record<string, string> = {
  "garden-wedding-jagakarsa": "Venue Garden Wedding Jakarta Selatan (Jagakarsa) | Kinghouse",
  "corporate-retreat-jagakarsa": "Venue Offsite & Retreat Kantor Jakarta Selatan | Kinghouse",
  "birthday-celebration-jagakarsa": "Venue Ulang Tahun & Family Gathering Jagakarsa | Kinghouse",
}

export function eventDetailMetadata(slug: string, locale: SiteLocale): Metadata {
  const event = VILLA_EVENTS.find((e) => e.slug === slug)
  if (!event) return { title: "Event Not Found | Kinghouse Management" }
  const tx = contentTranslator(locale)
  const images = [{ url: event.heroImage, width: 1200, height: 630, alt: tx(event.title) }]
  const description = tx(event.description).slice(0, 155)
  if (locale === "id") {
    return idPageMetadata({
      path: `/events/${event.slug}`,
      title: ID_TITLES[event.slug] ?? `${tx(event.title)} | Kinghouse`,
      description,
      images,
    })
  }
  const pageTitle = event.seoTitle ?? `${event.title} | Kinghouse`
  return {
    title: { absolute: pageTitle },
    description,
    alternates: localeAlternates(`/events/${event.slug}`, "en"),
    openGraph: {
      title: pageTitle,
      description: event.tagline,
      url: `${SITE_CONFIG.baseUrl}/events/${event.slug}`,
      type: "website",
      images,
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

/** /events/[slug] and /id/events/[slug] share this view. */
export function EventDetailView({ slug, locale }: { slug: string; locale: SiteLocale }) {
  const tx = contentTranslator(locale)
  const event = VILLA_EVENTS.find((e) => e.slug === slug)

  if (!event) {
    notFound()
  }

  const property = CURATED_VILLAS.find((v) => v.id === event.propertyId)

  // Venue packages have no fixed date, so they are a Service (schema.org Event requires startDate)
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Event venue rental",
    name: tx(event.title),
    description: tx(event.description),
    image: event.heroImage.startsWith("http") ? event.heroImage : `${SITE_CONFIG.baseUrl}${event.heroImage}`,
    url: `${SITE_CONFIG.baseUrl}${localizePath(`/events/${event.slug}`, locale)}`,
    provider: {
      "@type": "Organization",
      name: "Kinghouse Management",
      url: SITE_CONFIG.baseUrl,
    },
    areaServed: {
      "@type": "Place",
      name: event.propertyName,
      address: {
        "@type": "PostalAddress",
        addressLocality: property?.area ?? "Jagakarsa",
        addressRegion: "Jakarta Selatan",
        addressCountry: "ID",
      },
    },
    offers: event.packages.map((pkg) => ({
      "@type": "Offer",
      name: tx(pkg.name),
      description: tx(pkg.description),
      price: pkg.priceIdr,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
      url: `${SITE_CONFIG.baseUrl}${localizePath(`/events/${event.slug}`, locale)}`,
    })),
  }


  const whatsappText = encodeURIComponent(
    `Hello Kinghouse! I am interested in the "${event.title}" package at ${event.propertyName}. Could you please provide date availability and package details?`
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
        <Image src={event.heroImage} alt={tx(event.title)} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
          <div className="mx-auto max-w-7xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 mb-4">
              <span className="text-xs text-white font-medium uppercase tracking-wider">
                {tx(CATEGORY_LABELS[event.category] ?? event.category)}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-tight max-w-2xl mb-3">
              {tx(event.title)}
            </h1>
            <p className="text-white/80 text-sm sm:text-base max-w-xl">{tx(event.tagline)}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-[#717171] py-6 border-b border-[#EBEBEB]">
          <Link href="/" className="hover:text-[#222222]">{tx("Home")}</Link>
          <span>/</span>
          <Link href="/events" className="hover:text-[#222222]">{tx("Events")}</Link>
          <span>/</span>
          <span className="text-[#222222] font-medium">{tx(event.title)}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-12">
          {/* Left: Description & Highlights */}
          <div className="lg:col-span-7 space-y-10">
            {/* Description */}
            <div>
              <h2 className="font-serif text-2xl text-[#222222] mb-4">{tx("About This Event")}</h2>
              <p className="text-[#717171] text-sm leading-relaxed">{tx(event.description)}</p>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="font-serif text-2xl text-[#222222] mb-4">{tx("Venue Highlights")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.highlights.map((h) => (
                  <div key={h} className="flex items-start space-x-2.5 p-3 rounded-xl bg-[#FAFAFA] border border-[#EBEBEB]">
                    <CheckCircle2 className="h-4 w-4 text-[#A69C8E] mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-[#717171] leading-relaxed">{tx(h)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            {event.gallery.length > 1 && (
              <div>
                <h2 className="font-serif text-2xl text-[#222222] mb-4">{tx("Gallery")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.gallery.map((img, i) => (
                    <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                      <Image src={img} alt={`${tx(event.title)} ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Link */}
            {property && (
              <div className="rounded-2xl border border-[#EBEBEB] bg-[#FAFAFA] p-6">
                <h3 className="font-serif text-lg text-[#222222] mb-2">{tx("Venue Property")}</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={property.heroImage} alt={tx(property.name)} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#222222]">{tx(property.name)}</p>
                    <p className="text-xs text-[#717171]">{tx(property.location)}</p>
                    <p className="text-xs text-[#A69C8E] mt-1">
                      {property.capacity.guests} {tx("guests")} &bull; {property.capacity.bedrooms} {tx("bedrooms")} &bull; {property.capacity.bathrooms} {tx("baths")}
                    </p>
                  </div>
                  <Link
                    href={`/locations/${property.areaSlug}/villas/${property.slug}`}
                    className="text-xs font-medium text-[#222225] hover:underline flex-shrink-0"
                  >
                    {tx("View Villa →")}
                  </Link>
                </div>
              </div>
            )}

            {/* International / Expat Couples Concierge Box */}
            {event.category === "wedding" && (
              <div className="rounded-2xl border border-[#DFC58E]/40 bg-[#FAF8F5] p-6 space-y-4">
                <div className="flex items-center space-x-2 text-[#8C7F5F]">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-widest font-bold">
                    {tx("International & Destination Couples Desk")}
                  </span>
                </div>
                <h4 className="font-serif text-lg text-[#222222]">
                  {tx("Planning from Overseas or Hosting International Guests?")}
                </h4>
                <p className="text-xs text-[#6B6862] leading-relaxed">
                  {tx("We specialize in private Jakarta villa celebrations for international and multicultural couples. Enjoy")} <strong>{tx("100% vendor freedom with 0% corkage fees")}</strong>{tx(", 35-min airport highway connectivity, overnight stay for 15 family members, and multi-currency pricing (USD, EUR, AUD, SGD).")}
                </p>
                <div className="pt-2">
                  <a
                    href={`${whatsappBase("EVENT")}?text=${encodeURIComponent(`Hello Kinghouse Concierge! We are an international couple interested in hosting our wedding ceremony at ${event.propertyName}. Could you please share the international lookbook and availability?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#222225] text-white hover:bg-[#333333] text-xs font-semibold transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-[#DFC58E]" />
                    <span>{tx("Inquire with International Concierge")}</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right: Packages Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-[#A69C8E]" />
                <span className="text-xs text-[#717171]">{tx("Max.")} {event.maxCapacity} {tx("guests")}</span>
              </div>
              <h3 className="font-serif text-xl text-[#222222]">{tx("Select Package")}</h3>
              {event.packages.map((pkg, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border p-6 ${i === 1 ? "border-[#222222] bg-[#FAFAFA]" : "border-[#EBEBEB] bg-white"}`}
                >
                  {i === 1 && (
                    <div className="inline-block text-xs font-bold uppercase tracking-widest bg-[#222222] text-white px-3 py-1 rounded-full mb-3">
                      {tx("Most Popular")}
                    </div>
                  )}
                  <h4 className="font-semibold text-[#222222] text-sm mb-1">{tx(pkg.name)}</h4>
                  <p className="text-xs text-[#717171] mb-3">{tx(pkg.description)}</p>
                  <div className="mb-2">
                    <p className="font-serif text-2xl text-[#222222]">
                      {formatCurrency(pkg.priceIdr, "IDR")}
                      <span className="text-xs font-normal text-[#717171]"> ({tx("Weekday")})</span>
                    </p>
                    {pkg.weekendPriceIdr && (
                      <p className="text-xs text-[#8C7F5F] font-semibold mt-0.5">
                        {tx("Weekend Rate:")} {formatCurrency(pkg.weekendPriceIdr, "IDR")}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-[#A69C8E] mb-4">{tx(pkg.priceNote)}</p>
                  <div className="space-y-1.5 mb-5 border-t border-[#EBEBEB] pt-4">
                    {pkg.includes.map((item) => (
                      <div key={item} className="flex items-start space-x-2">
                        <CheckCircle2 className="h-3 w-3 text-[#A69C8E] mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-[#717171] leading-relaxed">{tx(item)}</span>
                      </div>
                    ))}
                  </div>
                  <a
                    href={`${whatsappBase("EVENT")}?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center space-x-2 w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
                      i === 1
                        ? "bg-[#222222] text-white hover:bg-[#333333]"
                        : "bg-[#F5F4F0] text-[#222222] hover:bg-[#EBEBEB]"
                    }`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>{tx("Inquire via WhatsApp")}</span>
                  </a>
                </div>
              ))}
              <p className="text-xs text-[#A69C8E] text-center">
                {tx("* Prices exclude catering, floral decor, and photography. Custom packages available.")}
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
            <span>{tx("Back to All Events")}</span>
          </Link>
        </div>
      </div>
    </main>
  )
}

