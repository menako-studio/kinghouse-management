import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Private Event & Garden Wedding Venues | Kinghouse",
  description:
    "Exclusive private garden wedding venues, corporate offsite retreats, and birthday celebration packages in Greater Jakarta with zero corkage fees.",
  alternates: {
    canonical: "/events",
  },
  openGraph: {
    title: "Private Event & Garden Wedding Venues | Kinghouse",
    description:
      "Exclusive private garden wedding venues, corporate offsite retreats, and birthday celebration packages in Greater Jakarta with zero corkage fees.",
    url: "/events",
    type: "website",
  },
}

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
