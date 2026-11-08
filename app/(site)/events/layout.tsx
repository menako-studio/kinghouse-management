import { Metadata } from "next"
import { EventsVenueSchema } from "@/components/pages/events-schema"
import { localeAlternates } from "@/lib/i18n/site"
import { SITE_CONFIG, DEFAULT_OG_IMAGES } from "@/lib/constants"

export const metadata: Metadata = {
  title: {
    absolute: "Garden Wedding & Private Event Venues Jakarta | Kinghouse",
  },
  description:
    "Versatile House Jagakarsa features a 500m² lush garden, private pool, and bridal suites for weddings, retreats, and birthdays. Zero vendor corkage fees.",
  keywords: [
    "villa wedding jakarta",
    "garden wedding venue jakarta selatan",
    "intimate wedding jagakarsa",
    "venue corporate retreat jakarta",
    "sewa villa event jakarta",
  ],
  alternates: localeAlternates("/events", "en"),
  openGraph: {
    images: DEFAULT_OG_IMAGES,
    title: "Garden Wedding & Private Event Venues | Kinghouse Management",
    description:
      "Exclusive private garden wedding venues and intimate celebration spaces in South Jakarta with zero vendor corkage fees.",
    url: `${SITE_CONFIG.baseUrl}/events`,
    type: "website",
    siteName: "Kinghouse Management",
  },
}

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <EventsVenueSchema locale="en" />
      {children}
    </>
  )
}
