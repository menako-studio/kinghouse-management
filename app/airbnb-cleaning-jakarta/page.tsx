import type { Metadata } from "next"
import { HousekeepingContent } from "@/components/owner/housekeeping-content"
import { HK_FAQ } from "@/lib/funnel/config"
import { DEFAULT_OG_IMAGES, MANAGED_AREAS, SITE_CONFIG } from "@/lib/constants"
import { createTranslator } from "@/lib/i18n/funnel"

const PATH = "/airbnb-cleaning-jakarta"
const TITLE = "Airbnb & Villa Cleaning Jakarta | HK on Demand"
const DESCRIPTION =
  "On-demand turnover and deep cleaning for Airbnb apartments and villas in Jakarta, Tangerang and Cikarang. Jasa cleaning Airbnb with a quote in 1 business hour."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "airbnb cleaning jakarta",
    "jasa cleaning airbnb",
    "jasa cleaning airbnb jakarta",
    "jasa housekeeping villa",
    "cleaning service apartemen jakarta",
    "turnover cleaning airbnb",
    "kinghouse cleaning",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    images: DEFAULT_OG_IMAGES,
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.baseUrl}${PATH}`,
    type: "website",
  },
}

// Structured data uses the same English copy the page renders by default.
const t = createTranslator("EN")

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "HK on Demand — Airbnb & Villa Cleaning",
    serviceType: "Short-stay turnover and deep cleaning",
    description: t("f.hk.intro"),
    provider: {
      "@type": "Organization",
      name: SITE_CONFIG.company.brandName,
      url: SITE_CONFIG.baseUrl,
      sameAs: [SITE_CONFIG.company.cleaningWebsite],
    },
    areaServed: MANAGED_AREAS.map((a) => `${a.name}, ${a.region}`),
    url: `${SITE_CONFIG.baseUrl}${PATH}`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HK_FAQ.map(([q, a]) => ({
      "@type": "Question",
      name: t(q),
      acceptedAnswer: { "@type": "Answer", text: t(a) },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_CONFIG.baseUrl },
      { "@type": "ListItem", position: 2, name: "Owner Services", item: `${SITE_CONFIG.baseUrl}/owner-services` },
      { "@type": "ListItem", position: 3, name: "HK on Demand", item: `${SITE_CONFIG.baseUrl}${PATH}` },
    ],
  },
]

export default function AirbnbCleaningPage() {
  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HousekeepingContent />
    </main>
  )
}
