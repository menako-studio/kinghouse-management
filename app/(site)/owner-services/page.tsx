import type { Metadata } from "next"
import { OwnerServicesView } from "@/components/pages/owner-services-view"
import { localeAlternates } from "@/lib/i18n/site"

export const metadata: Metadata = {
  title: {
    absolute: "Airbnb Property Management Jakarta | Kinghouse",
  },
  description:
    "Airbnb & villa management in Jakarta: HK on Demand cleaning, Co-Hosting or Full Management from 15% (villas) or 23% (apartments), with 24/7 guest care.",
  keywords: [
    "airbnb property management jakarta",
    "jasa kelola airbnb jakarta",
    "villa management jabodetabek",
    "airbnb co-host jakarta",
    "manajemen villa jakarta selatan",
    "short term rental asset management",
  ],
  alternates: localeAlternates("/owner-services", "en"),
}

export default function OwnerServicesPage() {
  return <OwnerServicesView locale="en" />
}
