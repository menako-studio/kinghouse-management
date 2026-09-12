import type { Metadata } from "next"
import Script from "next/script"
import { SITE_CONFIG } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Kinghouse Management",
  description:
    "Comprehensive answers for guests and property owners on booking policies, check-in, event hosting, 15%–20% management fees, and monthly payouts.",
  keywords: [
    "kinghouse faq",
    "villa rental faq jakarta",
    "airbnb management questions indonesia",
    "co-hosting fee structure jabodetabek",
    "check-in policy kinghouse",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.baseUrl}/faq`,
  },
  openGraph: {
    title: "Frequently Asked Questions | Kinghouse Management",
    description:
      "Find answers to guest stays, booking cancellations, private event hosting, and property owner co-hosting fee structures.",
    url: `${SITE_CONFIG.baseUrl}/faq`,
    siteName: "Kinghouse Management",
    locale: "en_US",
    type: "website",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do check-in and check-out work at Kinghouse properties?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Standard check-in is at 14:00 (2:00 PM) and check-out is at 12:00 PM (noon). All Kinghouse properties feature smart keypad self check-in or a dedicated butler meet-and-greet.",
      },
    },
    {
      "@type": "Question",
      name: "Can I host private events or garden weddings?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Selected estates such as Versatile House in Jagakarsa are fully licensed and equipped for private garden weddings, birthdays, and corporate retreats up to 150 guests with zero vendor corkage fees.",
      },
    },
    {
      "@type": "Question",
      name: "What is the cancellation policy for guest bookings?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Direct bookings through Kinghouse qualify for a full 100% refund if cancelled at least 14 days before check-in, and a 50% refund if cancelled up to 7 days before check-in.",
      },
    },
    {
      "@type": "Question",
      name: "How does Kinghouse calculate owner revenue and management fees?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer two transparent models: 15% Standard (full OTA management, dynamic pricing, guest communications, calendar sync) and 20% Premium (adds full linen laundry, amenities replenishment, and dedicated on-site butler operations).",
      },
    },
    {
      "@type": "Question",
      name: "When and how are monthly owner payouts disbursed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Statements and payouts are disbursed automatically on the 5th business day of each calendar month via Indonesian bank transfer (BCA, Mandiri, BNI, BRI) or international wire.",
      },
    },
  ],
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  )
}
