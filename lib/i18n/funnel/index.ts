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
import { translatorFor, type Translate } from "./core"

export type { FunnelKey }
export { interpolate, translatorFor, formatDateFor, type Translate, type TranslateVars } from "./core"

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

export function createTranslator(language: LanguageCode = "EN"): Translate {
  return translatorFor(FUNNEL_TRANSLATIONS[language] ?? en)
}
