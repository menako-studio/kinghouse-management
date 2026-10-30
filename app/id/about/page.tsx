import { AboutView } from "@/components/pages/about-view"
import { idPageMetadata } from "@/lib/i18n/site"

export const metadata = idPageMetadata({
  path: "/about",
  title: "Tentang Kinghouse Management | Pengelola Villa & Airbnb",
  description:
    "Kinghouse Management (PT Kreasi Usman Gosse) mengelola villa dan apartemen sewa harian di Jabodetabek dengan standar hotel dan status Airbnb Superhost.",
  keywords: ["tentang kinghouse management", "pengelola villa jakarta", "perusahaan manajemen airbnb"],
})

export default function IdAboutPage() {
  return <AboutView locale="id" />
}
