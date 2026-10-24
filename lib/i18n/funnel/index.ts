// Funnel translations for every supported language (EN default).
// Shared by client components (via useLocalization().t) and server code
// (lead summaries, first-reply templates) through createTranslator().

import type { LanguageCode } from "@/lib/context/localization-context"
import { en, type FunnelKey } from "./en"
import { id } from "./id"
import { ja } from "./ja"
import { zhCN } from "./zh-cn"
import { zhTW } from "./zh-tw"
import { fr } from "./fr"
import { es } from "./es"
import { de } from "./de"
import { ru } from "./ru"
import type { FunnelDictionary } from "./types"

export type { FunnelKey }

export const FUNNEL_LANGUAGES = ["EN", "ID", "JA", "ZH-CN", "ZH-TW", "FR", "ES", "DE", "RU"] as const

export const FUNNEL_TRANSLATIONS: Record<LanguageCode, FunnelDictionary> = {
  EN: en,
  ID: id,
  JA: ja,
  "ZH-CN": zhCN,
  "ZH-TW": zhTW,
  FR: fr,
  ES: es,
  DE: de,
  RU: ru,
}

export type TranslateVars = Record<string, string | number>
export type Translate = (key: FunnelKey, vars?: TranslateVars) => string

export function interpolate(template: string, vars?: TranslateVars): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match))
}

export function createTranslator(language: LanguageCode = "EN"): Translate {
  const dict = FUNNEL_TRANSLATIONS[language] ?? en
  return (key, vars) => interpolate(dict[key] ?? en[key] ?? key, vars)
}

const DATE_LOCALES: Record<LanguageCode, string> = {
  EN: "en-GB",
  ID: "id-ID",
  JA: "ja-JP",
  "ZH-CN": "zh-CN",
  "ZH-TW": "zh-TW",
  FR: "fr-FR",
  ES: "es-ES",
  DE: "de-DE",
  RU: "ru-RU",
}

/** "2026-11-01" → "1 Nov 2026" / "1 Nov 2026" / "2026年11月1日" … in the given language. */
export function formatDateFor(language: LanguageCode, isoDate: string | undefined): string {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate ?? ""
  const [y, m, d] = isoDate.split("-").map(Number)
  return new Intl.DateTimeFormat(DATE_LOCALES[language] ?? "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)))
}
