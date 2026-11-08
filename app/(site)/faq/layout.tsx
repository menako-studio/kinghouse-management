import type { Metadata } from "next"
import { FaqSchema } from "@/components/pages/faq-schema"
import { localeAlternates } from "@/lib/i18n/site"
import { SITE_CONFIG, DEFAULT_OG_IMAGES } from "@/lib/constants"

export const metadata: Metadata = {
  title: {
    absolute: "FAQ: Booking, Check-In & Villa Co-Hosting | Kinghouse",
  },
  description:
    "Comprehensive answers for guests and property owners on booking policies, check-in, event hosting, management fees, and monthly payouts.",
  keywords: [
    "kinghouse faq",
    "villa rental faq jakarta",
    "airbnb management questions indonesia",
    "co-hosting fee structure jabodetabek",
    "check-in policy kinghouse",
  ],
  alternates: localeAlternates("/faq", "en"),
  openGraph: {
    images: DEFAULT_OG_IMAGES,
    title: "Frequently Asked Questions | Kinghouse Management",
    description:
      "Find answers to guest stays, booking cancellations, private event hosting, and property owner co-hosting fee structures.",
    url: `${SITE_CONFIG.baseUrl}/faq`,
    siteName: "Kinghouse Management",
    locale: "en_US",
    type: "website",
  },
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FaqSchema locale="en" />
      {children}
    </>
  )
}
