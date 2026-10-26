import { HousekeepingContent } from "@/components/owner/housekeeping-content"
import { HK_FAQ } from "@/lib/funnel/config"
import { MANAGED_AREAS, SITE_CONFIG } from "@/lib/constants"
import { createTranslator } from "@/lib/i18n/funnel"
import { localizePath, type SiteLocale } from "@/lib/i18n/site"

const PATH = "/airbnb-cleaning-jakarta"

function buildJsonLd(locale: SiteLocale) {
  // Structured data mirrors the language the page renders in.
  const t = createTranslator(locale === "id" ? "ID" : "EN")
  const url = `${SITE_CONFIG.baseUrl}${localizePath(PATH, locale)}`
  return [
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
      url,
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
        { "@type": "ListItem", position: 1, name: locale === "id" ? "Beranda" : "Home", item: `${SITE_CONFIG.baseUrl}${localizePath("/", locale)}` },
        { "@type": "ListItem", position: 2, name: locale === "id" ? "Layanan Pemilik" : "Owner Services", item: `${SITE_CONFIG.baseUrl}${localizePath("/owner-services", locale)}` },
        { "@type": "ListItem", position: 3, name: "HK on Demand", item: url },
      ],
    },
  ]
}

/** /airbnb-cleaning-jakarta and /id/airbnb-cleaning-jakarta share this view. */
export function HousekeepingView({ locale }: { locale: SiteLocale }) {
  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(locale)) }} />
      <HousekeepingContent />
    </main>
  )
}
