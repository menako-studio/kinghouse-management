import { Metadata } from "next"
import Script from "next/script"
import { SITE_CONFIG } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Contact Concierge & Property Management Desk | Kinghouse Management",
  description:
    "Connect with Kinghouse 24/7 concierge for villa bookings or property management inquiries. WhatsApp and office desk support in Tangerang Selatan.",
  keywords: [
    "contact kinghouse",
    "customer service kinghouse management",
    "booking concierge jakarta",
    "whatsapp villa booking jabodetabek",
    "konsultasi kelola airbnb jakarta",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.baseUrl}/contact`,
  },
  openGraph: {
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
      streetAddress: "Jl. Reni Jaya Blk. K2 No.16, Pd. Ranji, Kec. Ciputat Tim.",
      addressLocality: "Kota Tangerang Selatan",
      addressRegion: "Banten",
      postalCode: "15416",
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

