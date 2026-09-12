import { Metadata } from "next"
import Script from "next/script"
import { SITE_CONFIG } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Garden Wedding & Private Event Venues Jakarta Selatan | Kinghouse Management",
  description:
    "Versatile House Jagakarsa features a 500m² lush garden, private pool, and bridal suites for weddings, retreats, and birthdays. Zero vendor corkage fees.",
  keywords: [
    "villa wedding jakarta",
    "garden wedding venue jakarta selatan",
    "intimate wedding jagakarsa",
    "venue corporate retreat jakarta",
    "sewa villa event jakarta",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.baseUrl}/events`,
  },
  openGraph: {
    title: "Garden Wedding & Private Event Venues | Kinghouse Management",
    description:
      "Exclusive private garden wedding venues and intimate celebration spaces in South Jakarta with zero vendor corkage fees.",
    url: `${SITE_CONFIG.baseUrl}/events`,
    type: "website",
    siteName: "Kinghouse Management",
  },
}

const eventVenueSchema = {
  "@context": "https://schema.org",
  "@type": "EventVenue",
  name: "Versatile House With Garden — Event & Wedding Venue",
  description: "Bespoke 500m² private lawn, ceremony pool, crystal chandelier dining hall, and bridal suites for up to 150 guests.",
  url: `${SITE_CONFIG.baseUrl}/events`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jagakarsa",
    addressRegion: "Jakarta Selatan",
    addressCountry: "ID",
  },
  maximumAttendeeCapacity: 150,
}

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Script
        id="events-venue-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventVenueSchema) }}
      />
      {children}
    </>
  )
}

