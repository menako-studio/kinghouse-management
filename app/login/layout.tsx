import { Metadata } from "next"

export const metadata: Metadata = {
  title: "CMS Portal Login | Kinghouse Management",
  description: "Secure administrative login portal for Kinghouse Hospitality Suite.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
