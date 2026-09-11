import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { MapPin, Sparkles, ArrowRight, ShieldCheck, ChevronRight, CheckCircle2 } from "lucide-react"
import { MANAGED_AREAS, SITE_CONFIG } from "@/lib/constants"
import { CURATED_VILLAS } from "@/lib/data"
import { VillaCard } from "@/components/villas/villa-card"

interface PageProps {
  params: Promise<{
    area: string
  }>
}

export async function generateStaticParams() {
  return MANAGED_AREAS.map((area) => ({
    area: area.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { area } = await params
  const areaData = MANAGED_AREAS.find((a) => a.slug === area)

  if (!areaData) {
    return { title: "Area Not Found | Kinghouse Management" }
  }

  const title = `Short-Stay Rentals & Airbnb in ${areaData.name}, ${areaData.region} | Kinghouse Management`
  const description = `${areaData.description} Explore curated accommodations in ${areaData.name} operated to Kinghouse Management Airbnb Superhost standards.`

  return {
    title,
    description,
    keywords: [
      `short stay ${areaData.slug}`,
      `airbnb ${areaData.slug}`,
      `accommodations ${areaData.name}`,
      `villa rentals ${areaData.name} ${areaData.region}`,
      "Kinghouse Management",
      "King House",
      "kinghousemanagement.com",
    ],

    alternates: { canonical: `/locations/${areaData.slug}` },
    openGraph: {
      title,
      description,
      url: `/locations/${areaData.slug}`,
      type: "website",
    },
  }
}

export default async function AreaLandingPage({ params }: PageProps) {
  const { area } = await params
  const areaData = MANAGED_AREAS.find((a) => a.slug === area)

  if (!areaData) {
    notFound()
  }

  const villasInArea = CURATED_VILLAS.filter((v) => v.areaSlug === area)

  // Local TouristDestination & ItemList Schema
  const areaSchema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: `${areaData.name}, ${areaData.region}`,
    description: areaData.description,
    url: `${SITE_CONFIG.baseUrl}/locations/${areaData.slug}`,
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: areaData.region,
    },
    includesAttraction: villasInArea.map((villa) => ({
      "@type": "VacationRental",
      name: villa.name,
      url: `${SITE_CONFIG.baseUrl}/locations/${villa.areaSlug}/villas/${villa.slug}`,
    })),
  }


  return (
    <main className="min-h-screen bg-white">
      <script
        id="area-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(areaSchema) }}
      />

      {/* Hero Header */}
      <section className="bg-[#FAFAFA] border-b border-[#EBEBEB] pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs text-[#717171] mb-8">
            <Link href="/" className="hover:text-[#222222]">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/villas" className="hover:text-[#222222]">Properties</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#222222] font-semibold">{areaData.name}</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white border border-[#EBEBEB] rounded-full px-3.5 py-1 text-xs font-semibold text-[#222222]">
              <MapPin className="h-3.5 w-3.5 text-[#A69C8E]" />
              <span>{areaData.region}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#222222] font-normal leading-tight">
              Curated Properties in
              <br />
              <span className="text-[#A69C8E]">{areaData.name}</span>
            </h1>

            <p className="text-base sm:text-lg text-[#717171] font-light leading-relaxed">
              {areaData.description}
            </p>

            <div className="flex items-center space-x-2 pt-2 text-xs text-[#222222] font-medium">
              <Sparkles className="h-4 w-4 text-[#A69C8E]" />
              <span>Area Highlight: <strong>{areaData.highlight}</strong></span>
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
                Accommodations in {areaData.name}
              </h2>
              <p className="text-xs text-[#717171] mt-1">
                {villasInArea.length} verified listings managed to Kinghouse Superhost standards
              </p>
            </div>
            <span className="text-xs text-[#A69C8E] font-medium uppercase tracking-wider">
              {villasInArea.length} Available
            </span>
          </div>

          {villasInArea.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {villasInArea.map((villa) => (
                <VillaCard key={villa.id} villa={villa} priority />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#EBEBEB] p-12 text-center text-sm text-[#717171]">
              New properties in {areaData.name} are currently undergoing curation.
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
                Local Area Guide
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#222222]">
                Why Stay in {areaData.name}?
              </h2>
              <p className="text-sm text-[#717171] leading-relaxed">
                {areaData.name} provides a distinctive stay experience within Greater Jakarta. With strategic connectivity and peaceful neighborhoods, units in this area are prime choices for travelers seeking tranquility, expansive living spaces, or proximity to key commercial hubs.
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
                    <span>{point}</span>
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
                      Own a Property in {areaData.name}?
                    </h3>
                    <p className="text-xs text-[#717171]">
                      Maximize your occupancy rate and revenue with Kinghouse
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#717171] leading-relaxed">
                  We handle the end-to-end asset management: editorial photography, Airbnb SEO listing optimization, dynamic pricing algorithms, turnover housekeeping, and 24/7 guest communications.
                </p>

                <div className="p-4 rounded-xl bg-[#FAFAFA] border border-[#EBEBEB] text-xs space-y-1">
                  <p className="font-semibold text-[#222222]">Estimated Yield in {areaData.name}:</p>
                  <p className="text-[#717171]">
                    Average <strong>Rp 15 - 45 Million / month</strong> with &gt;75% occupancy.
                  </p>
                </div>

                <a
                  href={`https://wa.me/6282123933218?text=Hello%20Kinghouse!%20I%20own%20a%20property%20in%20${areaData.name}%20and%20would%20like%20a%20management%20consultation.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 w-full bg-[#222222] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#333333] transition-colors"
                >
                  <span>Consult Regarding {areaData.name} Property</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Other Areas */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <h2 className="font-serif text-2xl text-[#222222] mb-8">
            Explore Other Greater Jakarta Enclaves
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
                <p className="text-xs text-[#717171] line-clamp-2">{other.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

