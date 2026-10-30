import Image from "next/image"
import Script from "next/script"
import { Sparkles, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ValuePropsGrid } from "@/components/owner/value-props-grid"
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ownerServicesSchema) }}
        />
        {/* 1. Sophisticated Architectural Dark Hero Section */}
        <section className="relative min-h-[75vh] w-full overflow-hidden bg-[#111111] flex items-center select-none">
          {/* Background Architectural Visual - Real Asset from Versatile House Flagship */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg"
              alt={tx("Versatile House Jagakarsa Flagship Villa")}
              fill
              loading="eager"
              fetchPriority="high"
              className="object-cover brightness-[0.38]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-black/60" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
            <div className="max-w-3xl space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-[#A69C8E]/25 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#EAE8E4] backdrop-blur-md border border-[#A69C8E]/40">
                  <TrendingUp className="mr-1.5 h-3.5 w-3.5 text-[#DFC58E]" />
                  {tx("Institutional Villa Asset Management")}
                </span>

                {/* Verified Airbnb Superhost Trust Badge */}
                <a
                  href="https://www.airbnb.com/users/profile/1470743715397835749?previous_page_name=PdpHomeMarketplace"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-[#DFC58E]/20 hover:bg-[#DFC58E]/30 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#DFC58E] backdrop-blur-md border border-[#DFC58E]/50 transition-all hover:scale-105"
                  title="Kinghouse Management — Airbnb Superhost"
                >
                  <Sparkles className="mr-1.5 h-3.5 w-3.5 text-[#DFC58E]" />
                  <span>{tx("Official Airbnb Superhost • 4.5★ (10 reviews) ↗")}</span>
                </a>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] text-white">
                {tx("Elevate Your Asset.")} <br />
                <span className="italic text-[#E5E2DC]">{tx("Effortless Management, Maximum Returns.")}</span>
              </h1>

              <p className="text-base sm:text-lg text-white/80 font-light leading-relaxed max-w-2xl">
                {tx("We turn private villas and apartments across Greater Jakarta into high-performing hospitality assets — backed by official Airbnb Superhost status, daily dynamic pricing, 5-star hotel cleaning standards and transparent revenue-share reports.")}
              </p>

              {/* Quick Metrics Bar with Verified Superhost Status */}
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/15 max-w-xl text-white">
                <div>
                  <span className="font-serif text-2xl sm:text-3xl text-white font-normal block">91%</span>
                  <span className="text-xs text-[#A0A0A0] uppercase tracking-wider">{tx("Avg Occupancy")}</span>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl text-[#DFC58E] font-normal block">+48%</span>
                  <span className="text-xs text-[#A0A0A0] uppercase tracking-wider">{tx("EBITDA Lift")}</span>
                </div>
                <div>
                  <a
                    href="https://www.airbnb.com/users/profile/1470743715397835749?previous_page_name=PdpHomeMarketplace"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <span className="font-serif text-2xl sm:text-3xl text-white font-normal group-hover:text-[#DFC58E] transition-colors flex items-center">
                      Superhost <span className="text-xs ml-1 opacity-70">↗</span>
                    </span>
                    <span className="text-xs text-[#DFC58E] uppercase tracking-wider group-hover:underline">
                      {tx("Verified by Airbnb")}
                    </span>
                  </a>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-white text-[#222222] hover:bg-[#F2EFEB] hover:text-black border-none font-semibold text-xs uppercase tracking-widest px-8 shadow-xl"
                >
                  <a href="#layanan">
                    <Sparkles className="mr-2 h-4 w-4 text-[#B8934C]" />
                    {tx("Choose a Service & Get Advice")}
                  </a>
                </Button>

                <Button
                  size="lg"
                  variant="outlineLight"
                  asChild
                  className="font-semibold text-xs uppercase tracking-widest px-8"
                >
                  <a href="#calculator">
                    {tx("Simulate Your Revenue")}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Funnel A: three owner services (HK on Demand, Co-Hosting, Full Management) */}
        <OwnerServiceCards />

        {/* 3. The Kinghouse Advantage (4-Column Value Props Grid) */}
        <ValuePropsGrid locale={locale} />

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
