import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "@/components/ui/localized-link"
import { MapPin, Sparkles, ArrowRight, ShieldCheck, ChevronRight, CheckCircle2 } from "lucide-react"
import { MANAGED_AREAS, SITE_CONFIG, DEFAULT_OG_IMAGES } from "@/lib/constants"
import { CURATED_VILLAS } from "@/lib/data"
import { toVillaCardData } from "@/lib/types"
import { VillaCard } from "@/components/villas/villa-card"
import { whatsappBase } from "@/lib/funnel/whatsapp"
import { contentTranslator } from "@/lib/i18n/content"
import { idPageMetadata, localeAlternates, localizePath, type SiteLocale } from "@/lib/i18n/site"

export function areaMetadata(area: string, locale: SiteLocale): Metadata {
  const areaData = MANAGED_AREAS.find((a) => a.slug === area)
  if (!areaData) return { title: "Area Not Found | Kinghouse Management" }
  const path = `/locations/${areaData.slug}`
  const keywords = [
    `sewa villa ${areaData.slug}`,
    `sewa apartemen harian ${areaData.slug}`,
    `airbnb ${areaData.slug}`,
    `akomodasi ${areaData.name}`,
    `short stay ${areaData.name} ${areaData.region}`,
  ]
  if (locale === "id") {
    return idPageMetadata({
      path,
      title: `Sewa Villa & Apartemen ${areaData.name} | Kinghouse`,
      description: `Pilihan sewa villa & apartemen harian terbaik di ${areaData.name}, ${areaData.region}. Fasilitas lengkap, bersih standar hotel, dan tarif terbaik langsung dari pengelola.`,
      keywords,
    })
  }
  const title = `Villa & Apartment Rentals in ${areaData.name} | Kinghouse`
  const description = `Hand-picked villas and short-stay apartments in ${areaData.name}, ${areaData.region}. Hotel-standard cleaning, full facilities and the best rate direct from the host.`
  return {
    title: { absolute: title },
    description,
    keywords: [`villa rental ${areaData.name}`, `short stay apartment ${areaData.name}`, ...keywords],
    alternates: localeAlternates(path, "en"),
    openGraph: {
      images: DEFAULT_OG_IMAGES,
      title,
      description,
      url: `${SITE_CONFIG.baseUrl}${path}`,
      type: "website",
    },
  }
}

const AREA_FAQS: Record<string, Array<{ question: string; answer: string }>> = {
  jagakarsa: [
    {
      question: "How many guests does the Jagakarsa villa sleep, and what does it cost?",
      answer: "Our flagship Versatile House Jagakarsa sleeps up to 12 guests in 5 spacious bedrooms with 9 beds and a private pool. Rates start from Rp 1,900,000 per night with 5-star hotel facilities.",
    },
    {
      question: "Can the Jagakarsa villa host an intimate wedding or family gathering?",
      answer: "Yes. Versatile House has a large tropical lawn, open terraces and semi-outdoor areas that are ideal for intimate weddings, akad nikah, family gatherings and corporate team retreats.",
    },
    {
      question: "How easy is it to reach the Jagakarsa villa from central Jakarta?",
      answer: "Jagakarsa is well connected via the Desari toll road (Depok–Antasari, Andara/Brigif exit) and the JORR TB Simatupang toll road, making trips from Cilandak, Kemang and the airport easy.",
    },
  ],
  tangerang: [
    {
      question: "How far is Sky House Tangerang from IKEA and Mall Alam Sutera?",
      answer: "Sky House Tangerang is just a 5-minute drive (about 2 km) from IKEA Alam Sutera, Mall @ Alam Sutera and Decathlon.",
    },
    {
      question: "What facilities does the Tangerang short-stay apartment have?",
      answer: "The unit has a hotel-standard queen bed, air conditioning, high-speed WiFi, smart TV, water heater, kitchenette, flexible self check-in, plus pool and gym access.",
    },
    {
      question: "Is Sky House Tangerang suitable for business travelers?",
      answer: "It is ideal for business travelers, expat professionals and ICE BSD conference visitors thanks to quick access to the Jakarta–Merak toll road and the Alam Sutera business district.",
    },
  ],
  palmerah: [
    {
      question: "How far is the Bright & Airy Apartment from Palmerah Station and Senayan?",
      answer: "The apartment is about 800 meters (a 10-minute walk) from Palmerah commuter station and just a 10-minute drive to Senayan City, Plaza Senayan and GBK.",
    },
    {
      question: "Is the Palmerah apartment good for a staycation or working from home?",
      answer: "Very much so. The unit has large windows full of natural light, a comfortable work desk, fast fiber WiFi, air conditioning and a full kitchen for remote work.",
    },
  ],
  cikarang: [
    {
      question: "What makes Skyline Luxury Orange County Cikarang special?",
      answer: "The unit sits in the prestigious Newport tower at Orange County with spectacular city skyline views, a Japanese-style onsen pool, a full gym and direct access to retail.",
    },
    {
      question: "Do you offer daily rentals in Cikarang for expats and executives?",
      answer: "Yes. We offer daily to monthly stays for industrial executives at Jababeka, EJIP and MM2100, with premium cleaning standards and a 24-hour WhatsApp concierge.",
    },
  ],
}

/** /locations/[area] and /id/locations/[area] share this view. */
export function AreaView({ area, locale }: { area: string; locale: SiteLocale }) {
  const tx = contentTranslator(locale)
  const href = (path: string) => `${SITE_CONFIG.baseUrl}${localizePath(path, locale)}`
  const areaData = MANAGED_AREAS.find((a) => a.slug === area)

  if (!areaData) {
    notFound()
  }

  const villasInArea = CURATED_VILLAS.filter((v) => v.areaSlug === area)
  const areaFaqs = AREA_FAQS[area] || []

  // Local TouristDestination Schema
  const areaSchema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: `${areaData.name}, ${areaData.region}`,
    description: tx(areaData.description),
    url: href(`/locations/${areaData.slug}`),
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: areaData.region,
    },
    includesAttraction: villasInArea.map((villa) => ({
      "@type": "VacationRental",
      name: villa.name,
      url: href(`/locations/${villa.areaSlug}/villas/${villa.slug}`),
    })),
  }

  // BreadcrumbList JSON-LD
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tx("Home"), item: href("/") },
      { "@type": "ListItem", position: 2, name: tx("Properties"), item: href("/villas") },
      { "@type": "ListItem", position: 3, name: areaData.name, item: href(`/locations/${areaData.slug}`) },
    ],
  }

  // FAQPage JSON-LD
  const faqSchema = areaFaqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: areaFaqs.map((faq) => ({
      "@type": "Question",
      name: tx(faq.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: tx(faq.answer),
      },
    })),
  } : null

  return (
    <main className="min-h-screen bg-white">
      <script
        id="area-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(areaSchema) }}
      />
      <script
        id="area-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          id="area-faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Hero Header */}
      <section className="bg-[#FAFAFA] border-b border-[#EBEBEB] pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs text-[#717171] mb-8">
            <Link href="/" className="hover:text-[#222222]">{tx("Home")}</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/villas" className="hover:text-[#222222]">{tx("Properties")}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#222222] font-semibold">{areaData.name}</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white border border-[#EBEBEB] rounded-full px-3.5 py-1 text-xs font-semibold text-[#222222]">
              <MapPin className="h-3.5 w-3.5 text-[#A69C8E]" />
              <span>{areaData.region}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#222222] font-normal leading-tight">
              {tx("Curated Properties in")}
              <br />
              <span className="text-[#A69C8E]">{areaData.name}</span>
            </h1>

            <p className="text-base sm:text-lg text-[#717171] font-light leading-relaxed">
              {tx(areaData.description)}
            </p>

            <div className="flex items-center space-x-2 pt-2 text-xs text-[#222222] font-medium">
              <Sparkles className="h-4 w-4 text-[#A69C8E]" />
              <span>{tx("Area Highlight:")} <strong>{tx(areaData.highlight)}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Property Listings in this Area */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#222222]">
                {tx("Accommodations in {area}", { area: areaData.name })}
              </h2>
              <p className="text-xs text-[#717171] mt-1">
                {tx("{count} verified listings managed to Kinghouse Superhost standards", { count: villasInArea.length })}
              </p>
            </div>
            <span className="text-xs text-[#A69C8E] font-medium uppercase tracking-wider">
              {tx("{count} Available", { count: villasInArea.length })}
            </span>
          </div>

          {villasInArea.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {villasInArea.map((villa, index) => (
                <VillaCard key={villa.id} villa={toVillaCardData(villa)} priority={index === 0} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#EBEBEB] p-12 text-center text-sm text-[#717171]">
              {tx("New properties in {area} are currently undergoing curation.", { area: areaData.name })}
            </div>
          )}
        </div>
      </section>

      {/* Area Local SEO Context & Why Stay Here */}
      <section className="bg-[#FAFAFA] border-y border-[#EBEBEB] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A69C8E]">
                {tx("Local Area Guide")}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#222222]">
                {tx("Why Stay in {area}?", { area: areaData.name })}
              </h2>
              <p className="text-sm text-[#717171] leading-relaxed">
                {tx("{area} provides a distinctive stay experience within Greater Jakarta. With strategic connectivity and peaceful neighborhoods, units in this area are prime choices for travelers seeking tranquility, expansive living spaces, or proximity to key commercial hubs.", { area: areaData.name })}
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "5-star hotel hygiene standards with fresh luxury linens for every guest",
                  "Flexible self check-in backed by 24/7 WhatsApp concierge support",
                  "High-speed fiber WiFi and dedicated work desks ideal for remote professionals",
                  "Transparent, secure reservations processed directly through Airbnb",
                ].map((point, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs text-[#222222]">
                    <CheckCircle2 className="h-4 w-4 text-[#A69C8E] mt-0.5 flex-shrink-0" />
                    <span>{tx(point)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-[#EBEBEB] bg-white p-8 space-y-6 shadow-sm">
                <div className="flex items-center space-x-3 pb-4 border-b border-[#F5F4F0]">
                  <ShieldCheck className="h-6 w-6 text-[#A69C8E]" />
                  <div>
                    <h3 className="font-serif text-lg text-[#222222]">
                      {tx("Own a Property in {area}?", { area: areaData.name })}
                    </h3>
                    <p className="text-xs text-[#717171]">
                      {tx("Maximize your occupancy rate and revenue with Kinghouse")}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#717171] leading-relaxed">
                  {tx("We handle the end-to-end asset management: editorial photography, Airbnb SEO listing optimization, dynamic pricing algorithms, turnover housekeeping, and 24/7 guest communications.")}
                </p>

                <div className="p-4 rounded-xl bg-[#FAFAFA] border border-[#EBEBEB] text-xs space-y-1">
                  <p className="font-semibold text-[#222222]">{tx("Estimated Yield in {area}:", { area: areaData.name })}</p>
                  <p className="text-[#717171]">
                    {tx("Average")} <strong>{tx("Rp 15 - 45 Million / month")}</strong> {tx("with >75% occupancy.")}
                  </p>
                </div>

                <a
                  href={`${whatsappBase("OWNER")}?text=Hello%20Kinghouse!%20I%20own%20a%20property%20in%20${areaData.name}%20and%20would%20like%20a%20management%20consultation.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 w-full bg-[#222222] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#333333] transition-colors"
                >
                  <span>{tx("Consult Regarding {area} Property", { area: areaData.name })}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Area FAQ Accordion Section */}
      {areaFaqs.length > 0 && (
        <section className="bg-white border-b border-[#EBEBEB] py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-12">
            <div className="text-center space-y-3 mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A69C8E]">
                {tx("Frequently Asked Questions")}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#222222]">
                {tx("Questions About Staying in {area}", { area: areaData.name })}
              </h2>
              <p className="text-sm text-[#717171]">
                {tx("Key information and booking guidance for short stays in {area}, {region}.", { area: areaData.name, region: areaData.region })}
              </p>
            </div>

            <div className="space-y-4">
              {areaFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#EBEBEB] bg-[#FAFAFA] p-6 space-y-2 hover:border-[#222222]/30 transition-colors"
                >
                  <h3 className="font-serif text-lg text-[#222222] font-medium">
                    {tx(faq.question)}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#717171] leading-relaxed">
                    {tx(faq.answer)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Explore Other Areas */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <h2 className="font-serif text-2xl text-[#222222] mb-8">
            {tx("Explore Other Greater Jakarta Enclaves")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MANAGED_AREAS.filter((a) => a.slug !== area).map((other) => (
              <Link
                key={other.slug}
                href={`/locations/${other.slug}`}
                className="group p-6 rounded-2xl border border-[#EBEBEB] bg-white hover:border-[#222222] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#A69C8E] font-medium">{other.region}</span>
                  <ArrowRight className="h-4 w-4 text-[#A69C8E] group-hover:translate-x-1 group-hover:text-[#222222] transition-all" />
                </div>
                <h3 className="font-serif text-xl text-[#222222] mb-1 group-hover:text-[#A69C8E] transition-colors">
                  {other.name}
                </h3>
                <p className="text-xs text-[#717171] line-clamp-2">{tx(other.description)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

