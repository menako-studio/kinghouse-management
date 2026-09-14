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

  const title = `Sewa Villa & Apartemen Harian ${areaData.name}, ${areaData.region} | Kinghouse Management`
  const description = `${areaData.description} Jelajahi akomodasi terkurasi dan terverifikasi di ${areaData.name} dengan standar kebersihan hotel dan manajemen Airbnb Superhost Kinghouse.`
  const canonicalUrl = `${SITE_CONFIG.baseUrl}/locations/${areaData.slug}`

  return {
    title,
    description,
    keywords: [
      `sewa villa ${areaData.slug}`,
      `sewa apartemen harian ${areaData.slug}`,
      `airbnb ${areaData.slug}`,
      `akomodasi ${areaData.name}`,
      `short stay ${areaData.name} ${areaData.region}`,
      "Kinghouse Management",
      "King House",
      "kinghousemanagement.com",
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    },
  }
}

const AREA_FAQS: Record<string, Array<{ question: string; answer: string }>> = {
  jagakarsa: [
    {
      question: "Berapa kapasitas dan tarif sewa villa di Jagakarsa Jakarta Selatan?",
      answer: "Akomodasi unggulan kami, Versatile House Jagakarsa, dapat menampung hingga 12 tamu dengan 5 kamar tidur luas, 9 tempat tidur, dan private pool. Tarif sewa mulai dari Rp 1.900.000 per malam dengan fasilitas hotel bintang 5.",
    },
    {
      question: "Apakah villa di Jagakarsa bisa digunakan untuk intimate wedding atau family gathering?",
      answer: "Bisa. Versatile House memiliki halaman rumput tropis luas, teras terbuka, dan area semi-outdoor yang sangat ideal untuk intimate wedding, akad nikah, arisan keluarga, serta corporate team retreat.",
    },
    {
      question: "Bagaimana aksesibilitas lokasi villa Jagakarsa dari pusat Jakarta?",
      answer: "Jagakarsa memiliki akses strategis via Tol Desari (Depok-Antasari) exit Andara/Brigif dan Tol JORR TB Simatupang, sehingga memudahkan perjalanan dari Cilandak, Kemang, maupun bandara.",
    },
  ],
  tangerang: [
    {
      question: "Berapa jarak akomodasi Sky House Tangerang ke IKEA & Mall Alam Sutera?",
      answer: "Sky House Tangerang berjarak hanya 5 menit berkendara (sekitar 2 km) dari IKEA Alam Sutera, Mall @ Alam Sutera, dan Decathlon.",
    },
    {
      question: "Apa saja fasilitas yang tersedia di apartemen short-stay Tangerang?",
      answer: "Unit dilengkapi queen bed standar hotel, AC dingin, high-speed WiFi, smart TV, water heater, kitchenette, self check-in fleksibel, serta akses kolam renang dan gym.",
    },
    {
      question: "Apakah Sky House Tangerang cocok untuk business traveler?",
      answer: "Sangat ideal bagi pebisnis, profesional ekspatriat, dan pengunjung konferensi di ICE BSD karena dekat dengan akses Tol Jakarta-Merak dan kawasan bisnis Alam Sutera.",
    },
  ],
  palmerah: [
    {
      question: "Berapa jarak Bright & Airy Apartment ke Stasiun Palmerah dan Senayan?",
      answer: "Apartemen berjarak sekitar 800 meter (10 menit jalan kaki) dari Stasiun KRL Palmerah dan hanya 10 menit berkendara menuju Senayan City, Plaza Senayan, dan GBK.",
    },
    {
      question: "Apakah apartemen di Palmerah cocok untuk staycation atau work-from-home?",
      answer: "Sangat cocok. Unit dirancang dengan jendela besar penuh cahaya alami, meja kerja nyaman, WiFi fiber berkecepatan tinggi, AC, dan dapur lengkap untuk kenyamanan kerja jarak jauh.",
    },
  ],
  cikarang: [
    {
      question: "Apa keunggulan menginap di Skyline Luxury Orange County Cikarang?",
      answer: "Unit berada di tower prestisius Newport Orange County dengan pemandangan skyline kota yang spektakuler, kolam renang onsen ala Jepang, pusat kebugaran lengkap, dan akses langsung ke ritel.",
    },
    {
      question: "Apakah apartemen di Cikarang melayani sewa harian untuk ekspatriat dan eksekutif?",
      answer: "Ya, kami melayani sewa harian hingga bulanan untuk eksekutif industri di Jababeka, EJIP, dan MM2100 dengan standar kebersihan premium dan WhatsApp concierge 24 jam.",
    },
  ],
}

export default async function AreaLandingPage({ params }: PageProps) {
  const { area } = await params
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

  // BreadcrumbList JSON-LD
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_CONFIG.baseUrl },
      { "@type": "ListItem", position: 2, name: "Properties", item: `${SITE_CONFIG.baseUrl}/villas` },
      { "@type": "ListItem", position: 3, name: areaData.name, item: `${SITE_CONFIG.baseUrl}/locations/${areaData.slug}` },
    ],
  }

  // FAQPage JSON-LD
  const faqSchema = areaFaqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: areaFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
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

      {/* Local Area FAQ Accordion Section */}
      {areaFaqs.length > 0 && (
        <section className="bg-white border-b border-[#EBEBEB] py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-12">
            <div className="text-center space-y-3 mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A69C8E]">
                Frequently Asked Questions
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#222222]">
                Tanya Jawab Seputar Akomodasi di {areaData.name}
              </h2>
              <p className="text-sm text-[#717171]">
                Informasi penting dan panduan reservasi properti short-stay di {areaData.name}, {areaData.region}.
              </p>
            </div>

            <div className="space-y-4">
              {areaFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#EBEBEB] bg-[#FAFAFA] p-6 space-y-2 hover:border-[#222222]/30 transition-colors"
                >
                  <h3 className="font-serif text-lg text-[#222222] font-medium">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#717171] leading-relaxed">
                    {faq.answer}
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

