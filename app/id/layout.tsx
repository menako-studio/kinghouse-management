import { ContentDictionaryProvider } from "@/lib/context/localization-context"
import { ID_CONTENT } from "@/lib/i18n/content/id"

/** Indonesian pages: hand the page-copy dictionary to client components (English pages never load it). */
export default function IdLayout({ children }: { children: React.ReactNode }) {
  return <ContentDictionaryProvider dictionary={ID_CONTENT}>{children}</ContentDictionaryProvider>
}
