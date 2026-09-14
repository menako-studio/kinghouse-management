import type { Metadata } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { SiteShell } from "@/components/layout/site-shell"
import { LocalizationProvider } from "@/lib/context/localization-context"
import { GoogleAnalytics } from "@/components/analytics/google-analytics"
import { PageViewTracker } from "@/components/analytics/page-view-tracker"
import { SITE_CONFIG } from "@/lib/constants"

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Kinghouse Management | Luxury Villa & Airbnb Property Management Jakarta",
    template: "%s | Kinghouse Management",
  },
  description:
    "Institutional short-stay villa & Airbnb asset management across Greater Jakarta (Jagakarsa, Tangerang, Palmerah, Cikarang). Maximize net yield with algorithmic dynamic pricing, 5-star operations, and global OTA syndication.",
  keywords: [
    "Kinghouse Management",
    "King House Management",
    "Kinghouse",
    "King House Property Management",
    "kinghousemanagement.com",
    "www.kinghousemanagement.com",

    // High-Intent English Search Queries
    "airbnb property management jakarta",
    "villa management south jakarta",
    "short stay asset management jabodetabek",
    "airbnb co-host jakarta",
    "luxury villa rental jakarta",
    "airbnb management indonesia",
    "vacation rental management jakarta",
    "short term rental asset management",
    "maximize airbnb occupancy",

    // High-Intent Local & Domestic Search Queries (Jabodetabek)
    "jasa kelola airbnb jakarta",
    "manajemen villa jakarta selatan",
    "jasa kelola villa jabodetabek",
    "sewa villa jagakarsa",
    "villa private pool jakarta selatan",
    "sewa villa intimate wedding jakarta",
    "villa family gathering jakarta",
    "manajemen apartemen harian",
    "sewa apartemen harian ikea tangerang",
    "sewa apartemen pinang tangerang",
    "sewa apartemen harian palmerah jakarta barat",
    "sewa apartemen orange county cikarang",
    "serviced apartment cikarang",
    "co-hosting airbnb cikarang",
    "airbnb jagakarsa",
    "airbnb cikarang",
    "airbnb tangerang",
    "airbnb palmerah",
  ],
  authors: [{ name: "Kinghouse Management" }],
  creator: "Kinghouse Management",
  publisher: "Kinghouse Management",
  metadataBase: new URL(SITE_CONFIG.baseUrl),
  other: {
    "geo.region": "ID-JK",
    "geo.placename": "Jakarta Selatan, Tangerang, Jakarta Barat, Cikarang",
    "geo.position": "-6.2843;106.7447",
    "ICBM": "-6.2843, 106.7447",
  },
  icons: {
    icon: [
      { url: "/brand/icon-favicon-simplified.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand/icon-favicon-simplified.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/brand/icon-favicon-simplified.png",
  },
  alternates: {
    canonical: SITE_CONFIG.baseUrl,
    languages: {
      "en": SITE_CONFIG.baseUrl,
      "id": `${SITE_CONFIG.baseUrl}?lang=id`,
      "x-default": SITE_CONFIG.baseUrl,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Kinghouse Management — Luxury Villa & Airbnb Property Management in Greater Jakarta",
    description:
      "Institutional short-stay villa & Airbnb asset management across South Jakarta, Tangerang, and Cikarang. Superior owner EBITDA, algorithmic dynamic pricing, and 24/7 guest concierge.",
    type: "website",
    locale: "en_US",
    alternateLocale: ["id_ID", "ja_JP", "zh_CN", "fr_FR", "es_ES", "de_DE", "ru_RU"],
    siteName: "Kinghouse Management",
    url: SITE_CONFIG.baseUrl,
    images: [
      {
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
        width: 1200,
        height: 630,
        alt: "Kinghouse Management — Curated Short-Stay Hospitality in Greater Jakarta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinghouse Management — Luxury Villa & Airbnb Asset Management",
    description:
      "Institutional short-stay villa & Airbnb asset management in Greater Jakarta. Maximize net yield with algorithmic dynamic pricing and 5-star operations.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
    ],
  },
}

const comprehensiveSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_CONFIG.baseUrl}/#website`,
      name: "Kinghouse Management",
      alternateName: [
        "King House Management",
        "Kinghouse",
        "King House Property Management",
        "kinghousemanagement.com",
        "www.kinghousemanagement.com",
      ],
      url: SITE_CONFIG.baseUrl,
      description:
        "Kinghouse Management is an editorial short-stay villa and property asset management firm in Greater Jakarta (South Jakarta, Tangerang, West Jakarta, Cikarang) operated by PT Kreasi Usman Gosse.",
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_CONFIG.baseUrl}/villas?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_CONFIG.baseUrl}/#organization`,
      name: "Kinghouse Management",
      legalName: "PT Kreasi Usman Gosse",
      alternateName: [
        "King House Management",
        "Kinghouse",
        "King House Property Management",
        "PT Kreasi Usman Gosse",
      ],
      url: SITE_CONFIG.baseUrl,
      logo: `${SITE_CONFIG.baseUrl}/favicon.ico`,
      description:
        "Institutional short-stay property management company under PT Kreasi Usman Gosse. We optimize luxury villas and apartments through editorial photography, algorithmic dynamic pricing, and 5-star operations.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: "+6282123933218",
        availableLanguage: ["English", "Indonesian"],
        areaServed: "ID",
      },
      areaServed: [
        { "@type": "City", name: "Jakarta Selatan" },
        { "@type": "City", name: "Tangerang Selatan" },
        { "@type": "City", name: "Tangerang" },
        { "@type": "City", name: "Jakarta Barat" },
        { "@type": "City", name: "Cikarang" },
      ],
      sameAs: [
        "https://www.tiktok.com/@kinghouse.id",
        "https://instagram.com/kinghouse.id",
        "https://www.airbnb.com/users/profile/1470743715397835749",
        "https://share.google/WHLcKlmJf8zZo27gO",
        "https://glints.com/id/en/companies/pt-kreasi-usman-gosse/351bd7d6-fff5-4a77-a91b-f69918d3b2fe",
      ],
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_CONFIG.baseUrl}/#localbusiness`,
      name: "Kinghouse Management — PT Kreasi Usman Gosse",
      legalName: "PT Kreasi Usman Gosse",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
      telephone: "+6282123933218",
      email: "info@kinghousemanagement.com",
      hasMap: "https://share.google/WHLcKlmJf8zZo27gO",
      knowsAbout: [
        "Sewa Villa Jakarta Selatan",
        "Villa Jagakarsa Private Pool",
        "Villa Intimate Wedding Jakarta",
        "Sewa Apartemen Harian Tangerang",
        "Sewa Apartemen Orange County Cikarang",
        "Sewa Apartemen Palmerah Jakarta Barat",
        "Airbnb Property Management Jakarta",
        "Jasa Kelola Villa Jabodetabek",
        "Co-Hosting Airbnb Indonesia",
        "Dynamic Pricing Hospitality",
      ],
      currenciesAccepted: "IDR, USD, EUR, AUD, SGD, JPY, CNY, GBP",
      paymentAccepted: "Bank Transfer, Credit Card, QRIS, Cash, Airbnb, Agoda, Booking.com",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.90",
        reviewCount: "96",
        bestRating: "5",
        worstRating: "1",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Reni Jaya Blk. K2 No.16, Pd. Ranji, Kec. Ciputat Tim.",
        addressLocality: "Kota Tangerang Selatan",
        addressRegion: "Banten",
        postalCode: "15416",
        addressCountry: "ID",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -6.2843,
        longitude: 106.7447,
      },
      url: SITE_CONFIG.baseUrl,
      priceRange: "Rp 280.000 - Rp 1.900.000 / night",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "00:00",
          closes: "23:59",
        },
      ],
      department: [
        {
          "@type": "LodgingBusiness",
          name: "Versatile House With Beautiful Garden Beyond",
          description: "Spacious 5BR luxury villa with private swimming pool and expansive tropical garden in Jagakarsa, South Jakarta.",
          url: `${SITE_CONFIG.baseUrl}/locations/jagakarsa/villas/versatile-house-jagakarsa`,
          telephone: "+6282123933218",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Jl. RM Kahfi 1, Cipedak, Kec. Jagakarsa",
            addressLocality: "Jakarta Selatan",
            addressRegion: "DKI Jakarta",
            postalCode: "12630",
            addressCountry: "ID",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: -6.3494,
            longitude: 106.8431,
          },
          priceRange: "Rp 1.900.000 / night",
        },
        {
          "@type": "LodgingBusiness",
          name: "Sky House Tangerang • Hotel-Style Bed",
          description: "Modern hotel-grade short stay apartment in Pinang, Tangerang, 5 minutes from IKEA & Mall Alam Sutera.",
          url: `${SITE_CONFIG.baseUrl}/locations/tangerang/villas/sky-house-tangerang`,
          telephone: "+6282123933218",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Jl. MH Thamrin No.KM.2, Kebon Nanas, Kec. Pinang",
            addressLocality: "Kota Tangerang",
            addressRegion: "Banten",
            postalCode: "15143",
            addressCountry: "ID",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: -6.1783,
            longitude: 106.6319,
          },
          priceRange: "Rp 320.000 / night",
        },
        {
          "@type": "LodgingBusiness",
          name: "Bright & Airy Apartment Palmerah",
          description: "Contemporary urban apartment in Palmerah, West Jakarta, 10 min walk to Palmerah KRL Station and close to Senayan.",
          url: `${SITE_CONFIG.baseUrl}/locations/palmerah/villas/bright-airy-apartment-palmerah`,
          telephone: "+6282123933218",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Jl. Palmerah Barat, Gelora, Kec. Tanah Abang",
            addressLocality: "Jakarta Barat",
            addressRegion: "DKI Jakarta",
            postalCode: "10270",
            addressCountry: "ID",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: -6.2002,
            longitude: 106.7977,
          },
          priceRange: "Rp 280.000 / night",
        },
        {
          "@type": "LodgingBusiness",
          name: "Skyline Luxury at Orange County Cikarang",
          description: "Executive high-rise serviced apartment in Orange County Newport Tower, Lippo Cikarang with skyline panorama and pool.",
          url: `${SITE_CONFIG.baseUrl}/locations/cikarang/villas/skyline-luxury-orange-county-cikarang`,
          telephone: "+6282123933218",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Newport Tower, Orange County, Cibatu, Cikarang Selatan",
            addressLocality: "Bekasi",
            addressRegion: "Jawa Barat",
            postalCode: "17530",
            addressCountry: "ID",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: -6.3577,
            longitude: 107.1483,
          },
          priceRange: "Rp 350.000 / night",
        },
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${cormorant.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[var(--bg-main)] font-sans text-[var(--text-primary)] antialiased selection:bg-[#CBBEA0] selection:text-[#231F1A]">
        {/* Google Analytics 4 & Google Tag Manager */}
        <GoogleAnalytics />
        {/* Virtual Page View Route Tracker */}
        <PageViewTracker />
        
        {/* Unified Schema.org Structured Data */}
        <Script
          id="structured-data-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(comprehensiveSchema) }}
        />

        <LocalizationProvider>
          <SiteShell>
            {children}
          </SiteShell>
        </LocalizationProvider>
      </body>
    </html>
  )
}



