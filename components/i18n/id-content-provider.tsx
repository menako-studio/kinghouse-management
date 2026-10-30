"use client"

import { ContentDictionaryProvider } from "@/lib/context/localization-context"
import { ID_CONTENT } from "@/lib/i18n/content/id"

/**
 * Imports the Indonesian page-copy dictionary on the client instead of taking it
 * as a prop: a prop is serialized into the HTML of every /id page, while this
 * ships once as a cached /id-only chunk.
 */
export function IdContentProvider({ children }: { children: React.ReactNode }) {
  return <ContentDictionaryProvider dictionary={ID_CONTENT}>{children}</ContentDictionaryProvider>
}
