// Translation of English-authored page copy into Indonesian.
// Server-side helpers; client components get the dictionary through
// ContentDictionaryProvider (only rendered under /id), so English pages never download it.

import { ID_CONTENT } from "./content/id"
import type { SiteLocale } from "./site"

/**
 * Translates page copy that is authored in English. Indonesian strings are
 * keyed by the English source in ./content/id.ts; anything missing stays English.
 */
export function translateContent(locale: SiteLocale, text: string): string {
  if (locale !== "id") return text
  return ID_CONTENT[text] ?? text
}

/** Translator for server components; `{name}` placeholders are filled from `vars`. */
export const contentTranslator =
  (locale: SiteLocale) =>
  (text: string, vars?: Record<string, string | number>): string => {
    const out = translateContent(locale, text)
    return vars ? out.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : out
  }
