import { IdContentProvider } from "@/components/i18n/id-content-provider"

/** Indonesian pages: client components get the page-copy dictionary (English pages never load it). */
export default function IdLayout({ children }: { children: React.ReactNode }) {
  return <IdContentProvider>{children}</IdContentProvider>
}
