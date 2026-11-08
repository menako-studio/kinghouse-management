import type { Metadata } from "next"
import { HousekeepingView } from "@/components/pages/housekeeping-view"
import { DEFAULT_OG_IMAGES, SITE_CONFIG } from "@/lib/constants"
import { localeAlternates } from "@/lib/i18n/site"

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
  alternates: localeAlternates(PATH, "en"),
  openGraph: {
    images: DEFAULT_OG_IMAGES,
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.baseUrl}${PATH}`,
    type: "website",
  },
}

export default function AirbnbCleaningPage() {
  return <HousekeepingView locale="en" />
}
