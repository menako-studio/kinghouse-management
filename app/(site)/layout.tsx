import { RootDocument, rootMetadata } from "@/components/layout/root-document"

export const metadata = rootMetadata

/** Root layout for every English page (and the admin dashboard). */
export default function SiteRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument lang="en">{children}</RootDocument>
}
