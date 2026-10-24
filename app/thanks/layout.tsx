import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terima Kasih",
  description: "Permintaan Anda sudah kami terima. Tim Kinghouse akan segera menghubungi Anda.",
  robots: { index: false, follow: false },
}

export default function ThanksLayout({ children }: { children: React.ReactNode }) {
  return children
}
