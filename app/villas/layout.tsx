import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Curated Luxury Villas & Urban Suites | Kinghouse",
  description:
    "Browse curated standalone villas, family estates with private pools, and executive apartments across Jabodetabek managed by Kinghouse.",
  alternates: {
    canonical: "/villas",
  },
  openGraph: {
    title: "Curated Luxury Villas & Urban Suites | Kinghouse",
    description:
      "Browse curated standalone villas, family estates with private pools, and executive apartments across Jabodetabek managed by Kinghouse.",
    url: "/villas",
    type: "website",
  },
}

export default function VillasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
