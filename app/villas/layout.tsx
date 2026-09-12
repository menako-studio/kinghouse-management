import { Metadata } from "next"
import Script from "next/script"
import { SITE_CONFIG } from "@/lib/constants"
import { CURATED_VILLAS } from "@/lib/data"

export const metadata: Metadata = {
  title: "Curated Luxury Villas & Short-Stay Apartments Jabodetabek | Kinghouse Management",
  description:
    "Browse curated private villas with pool in Jagakarsa, transit apartments in Tangerang & Palmerah, and business suites in Cikarang. Best rate guarantee.",
  keywords: [
    "luxury villa rental jakarta",
    "short stay apartments jabodetabek",
    "villa with private pool south jakarta",
    "sewa villa jagakarsa",
    "apartemen harian tangerang",
    "apartemen cikarang orange county",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.baseUrl}/villas`,
  },
  openGraph: {
    title: "Curated Luxury Villas & Short-Stay Apartments | Kinghouse Management",
    description:
      "Browse curated standalone villas with private pool in Jagakarsa, transit apartments in Tangerang & Palmerah, and executive suites in Cikarang.",
    url: `${SITE_CONFIG.baseUrl}/villas`,
    type: "website",
    siteName: "Kinghouse Management",
  },
}

const villasItemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Kinghouse Curated Short-Stay Residences",
  description: "Curated collection of hotel-standard luxury villas and executive apartments in Greater Jakarta.",
  numberOfItems: CURATED_VILLAS.length,
  itemListElement: CURATED_VILLAS.map((villa, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    url: `${SITE_CONFIG.baseUrl}/villas/${villa.slug}`,
    name: villa.name,
    description: villa.tagline,
  })),
}

export default function VillasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Script
        id="villas-itemlist-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(villasItemListSchema) }}
      />
      {children}
    </>
  )
}

