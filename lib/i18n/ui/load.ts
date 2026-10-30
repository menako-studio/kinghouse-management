import type { LanguageCode } from "@/lib/context/localization-context"
import type { FunnelDictionary } from "@/lib/i18n/funnel/types"

export interface LanguageBundle {
  ui: Record<string, string>
  funnel: FunnelDictionary
}

/**
 * UI + funnel strings for the languages that are not bundled with every page.
 * Each language is its own chunk, fetched only when a visitor picks it, so
 * English and Indonesian pages never download the other seven dictionaries.
 */
const LOADERS: Partial<Record<LanguageCode, () => Promise<LanguageBundle>>> = {
  JA: async () => ({ ui: (await import("./ja")).ja, funnel: (await import("../funnel/ja")).ja }),
  "ZH-CN": async () => ({ ui: (await import("./zh-cn")).zhCN, funnel: (await import("../funnel/zh-cn")).zhCN }),
  "ZH-TW": async () => ({ ui: (await import("./zh-tw")).zhTW, funnel: (await import("../funnel/zh-tw")).zhTW }),
  FR: async () => ({ ui: (await import("./fr")).fr, funnel: (await import("../funnel/fr")).fr }),
  ES: async () => ({ ui: (await import("./es")).es, funnel: (await import("../funnel/es")).es }),
  DE: async () => ({ ui: (await import("./de")).de, funnel: (await import("../funnel/de")).de }),
  RU: async () => ({ ui: (await import("./ru")).ru, funnel: (await import("../funnel/ru")).ru }),
}

export function loadLanguageBundle(language: LanguageCode): Promise<LanguageBundle> | null {
  return LOADERS[language]?.() ?? null
}
