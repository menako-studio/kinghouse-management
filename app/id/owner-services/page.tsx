import { OwnerServicesView } from "@/components/pages/owner-services-view"
import { idPageMetadata } from "@/lib/i18n/site"

export const metadata = idPageMetadata({
  path: "/owner-services",
  title: "Jasa Kelola Airbnb & Villa Jakarta | Kinghouse",
  description:
    "Jasa kelola Airbnb & villa di Jakarta: HK on Demand, Co-Hosting, atau Full Management mulai 15% (villa) atau 23% (apartemen). Layanan tamu 24/7.",
  keywords: [
    "jasa kelola airbnb jakarta",
    "jasa manajemen villa",
    "co-host airbnb jakarta",
    "manajemen properti airbnb",
    "jasa pengelolaan apartemen sewa harian",
    "titip villa disewakan",
  ],
})

export default function IdOwnerServicesPage() {
  return <OwnerServicesView locale="id" />
}
