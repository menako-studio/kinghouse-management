import { IdContentProvider } from "@/components/i18n/id-content-provider"

/**
 * Indonesian pages: client components get the page-copy dictionary (English pages never load it).
 * The root <html lang> is static ("en"), so the page body declares its own language for
 * search engines and screen readers; LocalizationProvider also updates <html lang> on the client.
 */
export default function IdLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="id" className="contents">
      <IdContentProvider>{children}</IdContentProvider>
    </div>
  )
}
