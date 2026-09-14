import type { Metadata } from "next"
import { SITE_CONFIG } from "@/lib/constants"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Property Management Inquiry & Fast-Track Yield Audit | Kinghouse Management",
  description:
    "Partner with Kinghouse Management. Professional co-hosting and short-stay management for luxury villas and apartments in Greater Jakarta with 18–28% annual net yield.",
  keywords: [
    "jasa kelola airbnb jakarta",
    "manajemen villa jakarta selatan",
    "co-hosting airbnb indonesia",
    "kerjasama manajemen properti jabodetabek",
    "titip kelola villa apartemen",
    "audit potensi pendapatan airbnb",
    "kinghouse management inquiry",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.baseUrl}/management-inquiry`,
  },
  openGraph: {
    title: "Property Management Inquiry & Fast-Track Yield Audit | Kinghouse Management",
    description:
      "Submit your property for an institutional yield audit. We maximize Airbnb occupancy, handle 5-star operations, and deliver superior owner returns.",
    url: `${SITE_CONFIG.baseUrl}/management-inquiry`,
    type: "website",
  },
}

const inquirySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${SITE_CONFIG.baseUrl}/management-inquiry#contactpage`,
      name: "Kinghouse Management Property Owner Inquiry",
      description: "Dedicated onboarding and revenue audit portal for property owners in Greater Jakarta.",
      url: `${SITE_CONFIG.baseUrl}/management-inquiry`,
    },
    {
      "@type": "Service",
      name: "Institutional Short-Stay Property Asset Management",
      provider: {
        "@type": "Organization",
        name: "Kinghouse Management",
        url: SITE_CONFIG.baseUrl,
      },
      serviceType: "Airbnb Co-Hosting & Vacation Rental Management",
      areaServed: [
        { "@type": "City", name: "Jakarta Selatan" },
        { "@type": "City", name: "Tangerang" },
        { "@type": "City", name: "Jakarta Barat" },
        { "@type": "City", name: "Cikarang" },
      ],
      offers: {
        "@type": "Offer",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          priceType: "Commission",
          unitText: "Percent of Gross Revenue",
          minPrice: "15",
          maxPrice: "20",
          priceCurrency: "IDR",
        },
      },
    },
  ],
}

export default function ManagementInquiryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Script
        id="management-inquiry-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(inquirySchema) }}
      />
      {children}
    </>
  )
}
