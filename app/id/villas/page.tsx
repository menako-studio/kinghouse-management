import VillasCatalogPage from "@/app/villas/page"
import { VillasSchema } from "@/components/pages/villas-schema"
import { idPageMetadata } from "@/lib/i18n/site"

export const metadata = idPageMetadata({
  path: "/villas",
  title: "Sewa Villa Private Pool & Apartemen Harian | Kinghouse",
  description:
    "Sewa villa pribadi dengan kolam renang di Jagakarsa, apartemen harian di Tangerang & Palmerah, dan suite bisnis di Cikarang. Cocok untuk keluarga & acara.",
  keywords: [
    "sewa villa jakarta selatan",
    "villa private pool jakarta",
    "sewa villa jagakarsa",
    "apartemen harian tangerang",
    "apartemen harian cikarang",
    "villa untuk acara keluarga",
  ],
})

export default function IdVillasPage() {
  return (
    <>
      <VillasSchema locale="id" />
      <VillasCatalogPage />
    </>
  )
}
