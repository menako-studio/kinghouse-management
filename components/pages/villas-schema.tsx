import Script from "next/script"
import { SITE_CONFIG } from "@/lib/constants"
import { CURATED_VILLAS } from "@/lib/data"
import { contentTranslator } from "@/lib/i18n/content"
import { localizePath, type SiteLocale } from "@/lib/i18n/site"

/** ItemList JSON-LD for the villa catalog in the page's language. */
export function VillasSchema({ locale }: { locale: SiteLocale }) {
  const tx = contentTranslator(locale)
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Kinghouse Curated Short-Stay Residences",
    description: tx("Curated collection of hotel-standard luxury villas and executive apartments in Greater Jakarta."),
    numberOfItems: CURATED_VILLAS.length,
    itemListElement: CURATED_VILLAS.map((villa, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${SITE_CONFIG.baseUrl}${localizePath(`/locations/${villa.areaSlug}/villas/${villa.slug}`, locale)}`,
      name: villa.name,
      description: tx(villa.tagline),
    })),
  }
  return (
    <Script
      id="villas-itemlist-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
