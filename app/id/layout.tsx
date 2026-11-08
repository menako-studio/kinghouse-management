import type { Metadata } from "next"
import { RootDocument, rootMetadata } from "@/components/layout/root-document"
import { IdContentProvider } from "@/components/i18n/id-content-provider"

export const metadata: Metadata = {
  ...rootMetadata,
  openGraph: { ...rootMetadata.openGraph, locale: "id_ID", alternateLocale: ["en_US"] },
}

/**
 * Root layout for Indonesian pages: <html lang="id"> in the server HTML, and
 * client components get the page-copy dictionary (English pages never load it).
 */
export default function IdRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <RootDocument lang="id">
      <IdContentProvider>{children}</IdContentProvider>
    </RootDocument>
  )
}
