import Image from "next/image"
import Script from "next/script"
import { Sparkles, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ValuePropsGrid } from "@/components/owner/value-props-grid"
import { PropertyRevenueCalculator } from "@/components/owner/property-revenue-calculator"
import { TieredPricingTable } from "@/components/owner/tiered-pricing-table"
import { PerformanceMetrics } from "@/components/owner/performance-metrics"
import { OnboardingTimeline } from "@/components/owner/onboarding-timeline"
import { LeadAuditForm } from "@/components/owner/lead-audit-form"
import { SITE_CONFIG } from "@/lib/constants"

export const metadata = {
  title: "Airbnb Property Management & Co-Hosting Jabodetabek | Kinghouse Management",
  description:
    "Partner with Kinghouse Management for 15%–20% transparent co-hosting. Algorithmic dynamic pricing, Kinghouse Cleaning hotel standards, and +48% EBITDA lift.",
  keywords: [
    "airbnb property management jakarta",
    "jasa kelola airbnb jakarta",
    "villa management jabodetabek",
    "airbnb co-host jakarta",
    "manajemen villa jakarta selatan",
    "short term rental asset management",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.baseUrl}/owner-services`,
  },
}

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
      name: "15% Standard Full-Service Management",
      priceCurrency: "IDR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceType: "https://schema.org/Commission",
        unitText: "15% of Accommodation Revenue",
      },
    },
    {
      "@type": "Offer",
      name: "20% Multi-Channel Premium Management",
      priceCurrency: "IDR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceType: "https://schema.org/Commission",
        unitText: "20% of Accommodation Revenue",
      },
    },
  ],
}

export default function OwnerServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Schema.org Service JSON-LD */}
      <Script
        id="owner-services-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ownerServicesSchema) }}
      />
      {/* 1. Sophisticated Architectural Dark Hero Section */}
      <section className="relative min-h-[75vh] w-full overflow-hidden bg-[#111111] flex items-center select-none">
        {/* Background Architectural Visual */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2200&q=85"
            alt="Architectural Villa Exterior"
            fill
            priority
            className="object-cover brightness-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-black/50" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center rounded-full bg-[#A69C8E]/25 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#EAE8E4] backdrop-blur-md border border-[#A69C8E]/40">
                <TrendingUp className="mr-1.5 h-3.5 w-3.5 text-[#A69C8E]" />
                Institutional Villa Asset Management
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] text-white">
              Elevate Your Asset. <br />
              <span className="italic text-[#E5E2DC]">Effortless Management, Maximum Returns.</span>
            </h1>

            <p className="text-base sm:text-lg text-white/80 font-light leading-relaxed max-w-2xl">
              We engineer luxury private villas into high-performing hospitality assets. Transparent performance-based fee structures, algorithmic dynamic pricing, 5-star operations, and comprehensive owner reporting.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/15 max-w-xl text-white">
              <div>
                <span className="font-serif text-2xl sm:text-3xl text-white font-normal block">91%</span>
                <span className="text-[11px] text-[#A0A0A0] uppercase tracking-wider">Avg Occupancy</span>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl text-[#A69C8E] font-normal block">+48%</span>
                <span className="text-[11px] text-[#A0A0A0] uppercase tracking-wider">EBITDA Lift</span>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl text-white font-normal block">4.98</span>
                <span className="text-[11px] text-[#A0A0A0] uppercase tracking-wider">Superhost Rating</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Button
                size="lg"
                asChild
                className="bg-white text-[#222222] hover:bg-[#F2EFEB] hover:text-black border-none font-semibold text-xs uppercase tracking-widest px-8 shadow-xl"
              >
                <a href="#calculator">
                  <Sparkles className="mr-2 h-4 w-4 text-[#B8934C]" />
                  Simulasi Potensi Cuan (AirDNA)
                </a>
              </Button>

              <Button
                size="lg"
                variant="outlineLight"
                asChild
                className="font-semibold text-xs uppercase tracking-widest px-8"
              >
                <a href="#pricing">
                  Compare Models (15% vs 20%)
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Kinghouse Advantage (4-Column Value Props Grid) */}
      <ValuePropsGrid />

      {/* 3. AirDNA-Grade Interactive Revenue Simulator */}
      <PropertyRevenueCalculator />

      {/* 4. Tiered Management Models & Pricing Table */}
      <TieredPricingTable />

      {/* 5. Empirical Performance Proof (Before vs After Case Studies) */}
      <PerformanceMetrics />

      {/* 6. 3-Step Rapid Onboarding Timeline */}
      <OnboardingTimeline />

      {/* 7. High-Converting Property Audit Lead Capture Form */}
      <LeadAuditForm />
    </main>
  )
}
