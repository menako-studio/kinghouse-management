import { HousekeepingView } from "@/components/pages/housekeeping-view"
import { idPageMetadata } from "@/lib/i18n/site"

export const metadata = idPageMetadata({
  path: "/airbnb-cleaning-jakarta",
  title: "Jasa Cleaning Airbnb & Villa Jakarta | HK on Demand",
  description:
    "Jasa cleaning Airbnb, apartemen, dan villa di Jakarta, Tangerang, dan Cikarang: bersih-bersih antar tamu dan deep cleaning. Penawaran harga dalam 1 jam kerja.",
  keywords: [
    "jasa cleaning airbnb",
    "jasa cleaning airbnb jakarta",
    "jasa bersih villa",
    "jasa housekeeping apartemen",
    "cleaning service apartemen jakarta",
    "kinghouse cleaning",
  ],
})

export default function IdAirbnbCleaningPage() {
  return <HousekeepingView locale="id" />
}
