import Script from "next/script"
import { SITE_CONFIG } from "@/lib/constants"
import { contentTranslator } from "@/lib/i18n/content"
import { localizePath, type SiteLocale } from "@/lib/i18n/site"

/** EventVenue JSON-LD shared by the events pages in both languages. */
export function EventsVenueSchema({ locale }: { locale: SiteLocale }) {
  const tx = contentTranslator(locale)
  const schema = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: "Versatile House With Garden — Event & Wedding Venue",
    description: tx("Bespoke 500m² private lawn, ceremony pool, crystal chandelier dining hall, and bridal suites for up to 150 guests."),
    url: `${SITE_CONFIG.baseUrl}${localizePath("/events", locale)}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jagakarsa",
      addressRegion: "Jakarta Selatan",
      addressCountry: "ID",
    },
    maximumAttendeeCapacity: 150,
  }
  return (
    <Script id="event-venue-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  )
}
