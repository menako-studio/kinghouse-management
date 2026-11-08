import { Metadata } from "next"
import { SITE_CONFIG, DEFAULT_OG_IMAGES } from "@/lib/constants"
import { VillasSchema } from "@/components/pages/villas-schema"
import { localeAlternates } from "@/lib/i18n/site"

export const metadata: Metadata = {
  title: {
    absolute: "Luxury Villas & Short-Stay Rentals Jakarta | Kinghouse",
  },
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
  alternates: localeAlternates("/villas", "en"),
  openGraph: {
    images: DEFAULT_OG_IMAGES,
    title: "Curated Luxury Villas & Short-Stay Apartments | Kinghouse Management",
    description:
      "Browse curated standalone villas with private pool in Jagakarsa, transit apartments in Tangerang & Palmerah, and executive suites in Cikarang.",
    url: `${SITE_CONFIG.baseUrl}/villas`,
    type: "website",
    siteName: "Kinghouse Management",
  },
}

export default function VillasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <VillasSchema locale="en" />
      {children}
    </>
  )
}
