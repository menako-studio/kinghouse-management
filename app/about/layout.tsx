import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | Kinghouse Management — PT Kreasi Usman Gosse",
  description:
    "Discover Kinghouse Management (PT Kreasi Usman Gosse): Rooted in Kinghouse Cleaning (2020) empowering local communities, now delivering institutional-grade co-hosting and short-stay property management in Greater Jakarta.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Kinghouse Management — PT Kreasi Usman Gosse",
    description:
      "Discover Kinghouse Management (PT Kreasi Usman Gosse): Rooted in Kinghouse Cleaning (2020) empowering local communities, now delivering institutional-grade co-hosting and short-stay property management in Greater Jakarta.",
    url: "/about",
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
