import { Metadata } from "next"
import { localeAlternates } from "@/lib/i18n/site"
import Script from "next/script"
import { SITE_CONFIG, DEFAULT_OG_IMAGES } from "@/lib/constants"

export const metadata: Metadata = {
  title: {
    absolute: "Contact Us & 24/7 Concierge | Kinghouse Management",
  },
  description:
    "Connect with Kinghouse 24/7 concierge for villa bookings or property management inquiries. WhatsApp and office desk support in Tangerang Selatan.",
  keywords: [
    "contact kinghouse",
    "customer service kinghouse management",
    "booking concierge jakarta",
    "whatsapp villa booking jabodetabek",
    "konsultasi kelola airbnb jakarta",
  ],
  alternates: localeAlternates("/contact", "en"),
  openGraph: {
    images: DEFAULT_OG_IMAGES,
    title: "Contact Concierge & Property Advisory | Kinghouse Management",
    description:
      "Connect with Kinghouse hospitality advisors for villa bookings, private event venue hire, or property revenue audits.",
    url: `${SITE_CONFIG.baseUrl}/contact`,
    type: "website",
    siteName: "Kinghouse Management",
  },
}

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Kinghouse Concierge & Management Desk",
  url: `${SITE_CONFIG.baseUrl}/contact`,
  mainEntity: {
    "@type": "LocalBusiness",
    name: "Kinghouse Management — PT Kreasi Usman Gosse",
    telephone: "+6282123933218",
    email: "info@kinghousemanagement.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "18 Office Park Building 21th Floor Unit C. Jl. TB Simatupang Kav. 18",
      addressLocality: "Jakarta Selatan",
      addressRegion: "DKI Jakarta",
      postalCode: "12520",
      addressCountry: "ID",
    },
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Script
        id="contact-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      {children}
    </>
  )
}

