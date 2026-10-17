import { Metadata } from "next"
import { SITE_CONFIG } from "@/lib/constants"

export const metadata: Metadata = {
  title: {
    absolute: "About Us | Kinghouse Property Management Jakarta",
  },
  description:
    "Discover Kinghouse Management (PT Kreasi Usman Gosse): institutional-grade Airbnb co-hosting and luxury property management across Greater Jakarta.",
  alternates: {
    canonical: `${SITE_CONFIG.baseUrl}/about`,
  },
  openGraph: {
    title: "About Us | Kinghouse Property Management Jakarta",
    description:
      "Discover Kinghouse Management (PT Kreasi Usman Gosse): institutional-grade Airbnb co-hosting and luxury property management across Greater Jakarta.",
    url: `${SITE_CONFIG.baseUrl}/about`,
    type: "website",
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
