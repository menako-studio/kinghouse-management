import FaqPage from "@/app/faq/page"
import { FaqSchema } from "@/components/pages/faq-schema"
import { idPageMetadata } from "@/lib/i18n/site"

export const metadata = idPageMetadata({
  path: "/faq",
  title: "FAQ: Booking, Check-In & Jasa Kelola Villa | Kinghouse",
  description:
    "Jawaban lengkap untuk tamu dan pemilik properti: pemesanan, check-in, acara di villa, biaya pengelolaan, dan pembayaran bulanan.",
  keywords: ["faq kinghouse", "pertanyaan sewa villa", "biaya jasa kelola airbnb"],
})

export default function IdFaqPage() {
  return (
    <>
      <FaqSchema locale="id" />
      <FaqPage />
    </>
  )
}
