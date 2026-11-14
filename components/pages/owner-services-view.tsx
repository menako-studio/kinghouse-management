import Image from "next/image"
import Script from "next/script"
import { ArrowRight, Sparkles } from "lucide-react"
import { PropertyRevenueCalculator } from "@/components/owner/property-revenue-calculator"
import { TieredPricingTable } from "@/components/owner/tiered-pricing-table"
import { PerformanceMetrics } from "@/components/owner/performance-metrics"
import { OnboardingTimeline } from "@/components/owner/onboarding-timeline"
import { OwnerServiceProvider } from "@/components/owner/owner-service-context"
import { OwnerServiceCards } from "@/components/owner/owner-service-cards"
import { OwnerLeadForm } from "@/components/owner/owner-lead-form"
import { SITE_CONFIG, MANAGEMENT_FEES } from "@/lib/constants"
import { contentTranslator } from "@/lib/i18n/content"
import { type SiteLocale } from "@/lib/i18n/site"
import { serializeJsonLd } from "@/lib/security/json-ld"

const ownerServicesSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Short-Stay Villa & Airbnb Asset Management",
  serviceType: "Property Management & Co-Hosting",
  provider: {
    "@type": "Organization",
    name: "Kinghouse Management",
    legalName: "PT Kreasi Usman Gosse",
    url: SITE_CONFIG.baseUrl,
  },
  areaServed: ["Jakarta Selatan", "Tangerang", "Tangerang Selatan", "Jakarta Barat", "Cikarang"],
  description:
    "End-to-end short-stay and villa management service including editorial photography, algorithmic dynamic pricing, 24/7 guest care, hotel-grade housekeeping, and transparent owner reporting.",
  offers: [
    {
      "@type": "Offer",
      name: "Full Management — Apartments",
      priceCurrency: "IDR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceType: "https://schema.org/Commission",
        unitText: `${MANAGEMENT_FEES.apartmentPercent}% of rental revenue`,
      },
    },
    {
      "@type": "Offer",
      name: `Full Management — Villas & homes with ${MANAGEMENT_FEES.villaMinBedrooms}+ bedrooms`,
      priceCurrency: "IDR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceType: "https://schema.org/Commission",
        unitText: `${MANAGEMENT_FEES.villaMinPercent}–${MANAGEMENT_FEES.villaMaxPercent}% of rental revenue (agreed per property)`,
      },
    },
  ],
}

/** /owner-services and /id/owner-services share this view. */
export function OwnerServicesView({ locale }: { locale: SiteLocale }) {
  const tx = contentTranslator(locale)
  return (
    <main className="min-h-screen bg-white">
      <OwnerServiceProvider>
        {/* Schema.org Service JSON-LD */}
        <Script
          id="owner-services-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(ownerServicesSchema) }}
        />
        {/* 1. Sophisticated Architectural Dark Hero Section */}
        <section className="relative min-h-[75vh] w-full overflow-hidden bg-[#111111] flex items-center select-none">
          {/* Background Architectural Visual - Real Asset from Versatile House Flagship */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg"
              alt={tx("Versatile House Jagakarsa Flagship Villa")}
              fill
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
              className="object-cover brightness-[0.38]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-black/60" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
            <div className="max-w-3xl space-y-6">
              <a
                href="https://www.airbnb.com/users/profile/1470743715397835749"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#DFC58E]/50 bg-black/40 px-4 text-sm font-semibold text-[#DFC58E] backdrop-blur-md transition-colors hover:bg-black/60"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {tx("Official Airbnb Superhost")} · ★ 4.5
              </a>

              <h1 className="font-serif text-[2.6rem] font-normal leading-[1.06] text-white sm:text-6xl lg:text-7xl">
                {tx("Your property, managed.")} <br />
                <span className="italic text-[#E5E2DC]">{tx("You just receive the income.")}</span>
              </h1>

              <p className="max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
                {tx("Housekeeping, co-hosting or full Airbnb management for villas and apartments in Greater Jakarta.")}
              </p>

              {/* Proof points */}
              <dl className="grid max-w-xl grid-cols-2 gap-6 border-t border-white/20 pt-5 text-white">
                <div>
                  <dt className="text-sm text-white/75">{tx("Guest rating on Airbnb")}</dt>
                  <dd className="font-serif text-4xl">4.9★</dd>
                </div>
                <div>
                  <dt className="text-sm text-white/75">{tx("Fee, no fixed costs")}</dt>
                  <dd className="font-serif text-4xl text-[#DFC58E]">15–23%</dd>
                </div>
              </dl>

              {/* CTAs */}
              <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4">
                <a
                  href="#owner-form"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-[#19191B] shadow-xl transition-colors hover:bg-[#F2EFEB]"
                >
                  {tx("Get a free proposal")}
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </a>
                <a
                  href="#calculator"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/40 px-8 text-base font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {tx("Estimate my income")}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Funnel A: three owner services (HK on Demand, Co-Hosting, Full Management) */}
        <OwnerServiceCards />

        {/* 4. AirDNA-Grade Interactive Revenue Simulator */}
        <PropertyRevenueCalculator />

        {/* 5. Tiered Management Models & Pricing Table */}
        <TieredPricingTable />

        {/* 6. Empirical Performance Proof (Before vs After Case Studies) */}
        <PerformanceMetrics />

        {/* 7. 3-Step Rapid Onboarding Timeline */}
        <OnboardingTimeline locale={locale} />

        {/* 8. Owner qualification form (pre-filled with the service chosen above) */}
        <OwnerLeadForm />
      </OwnerServiceProvider>
    </main>
  )
}
