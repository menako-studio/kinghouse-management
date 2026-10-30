"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { trackCurrencyChange, trackLanguageChange } from "@/lib/analytics"
import { interpolate, type TranslateVars } from "@/lib/i18n/funnel/core"
import { en as funnelEn } from "@/lib/i18n/funnel/en"
import { id as funnelId } from "@/lib/i18n/funnel/id"
import type { FunnelDictionary } from "@/lib/i18n/funnel/types"
import { en as uiEn } from "@/lib/i18n/ui/en"
import { id as uiId } from "@/lib/i18n/ui/id"
import { loadLanguageBundle, type LanguageBundle } from "@/lib/i18n/ui/load"
import { hasIdVersion, localeFromPath, localizePath, type SiteLocale } from "@/lib/i18n/site"



export type CurrencyCode = "IDR" | "USD" | "EUR" | "CNY" | "TWD" | "RUB" | "JPY" | "AUD" | "SGD" | "GBP"
export type LanguageCode = "EN" | "ID" | "JA" | "ZH-CN" | "ZH-TW" | "FR" | "ES" | "DE" | "RU"

export interface CurrencyConfig {
  code: CurrencyCode
  symbol: string
  label: string
  short: string
  rateFromIdr: number
  prefix: boolean
}

export interface LanguageConfig {
  code: LanguageCode
  label: string
  nativeName: string
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: "IDR", symbol: "Rp", label: "IDR (Rp)", short: "RP", rateFromIdr: 1, prefix: true },
  { code: "USD", symbol: "$", label: "USD ($)", short: "$", rateFromIdr: 1 / 15800, prefix: true },
  { code: "EUR", symbol: "€", label: "EUR (€)", short: "€", rateFromIdr: 1 / 17200, prefix: true },
  { code: "CNY", symbol: "¥", label: "CNY (¥)", short: "¥", rateFromIdr: 1 / 2180, prefix: true },
  { code: "TWD", symbol: "NT$", label: "TWD (NT$)", short: "NT$", rateFromIdr: 1 / 490, prefix: true },
  { code: "RUB", symbol: "₽", label: "RUB (₽)", short: "₽", rateFromIdr: 1 / 170, prefix: true },
  { code: "JPY", symbol: "¥", label: "JPY (¥)", short: "¥", rateFromIdr: 1 / 105, prefix: true },
  { code: "AUD", symbol: "A$", label: "AUD (A$)", short: "A$", rateFromIdr: 1 / 10300, prefix: true },
  { code: "SGD", symbol: "S$", label: "SGD (S$)", short: "S$", rateFromIdr: 1 / 11700, prefix: true },
  { code: "GBP", symbol: "£", label: "GBP (£)", short: "£", rateFromIdr: 1 / 20100, prefix: true },
]

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: "EN", label: "English", nativeName: "English" },
  { code: "ID", label: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "JA", label: "Japanese", nativeName: "日本語" },
  { code: "ZH-CN", label: "Simplified Chinese", nativeName: "中文 (简体)" },
  { code: "ZH-TW", label: "Traditional Chinese", nativeName: "中文 (繁體)" },
  { code: "FR", label: "French", nativeName: "Français" },
  { code: "ES", label: "Spanish", nativeName: "Español" },
  { code: "DE", label: "German", nativeName: "Deutsch" },
  { code: "RU", label: "Russian", nativeName: "Русский" },
]

// UI strings live in lib/i18n/ui: EN and ID are bundled, the other languages load on demand.
const BUNDLED_UI: Partial<Record<LanguageCode, Record<string, string>>> = { EN: uiEn, ID: uiId }
const BUNDLED_FUNNEL: Partial<Record<LanguageCode, FunnelDictionary>> = { EN: funnelEn, ID: funnelId }

interface LocalizationContextType {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
  currentCurrencyConfig: CurrencyConfig
  language: LanguageCode
  setLanguage: (language: LanguageCode) => void
  currentLanguageConfig: LanguageConfig
  formatPrice: (amountInIdr: number, customCurrency?: CurrencyCode) => string
  t: (key: string, vars?: TranslateVars) => string
  /** Translate English-authored page copy (see lib/i18n/content). */
  tc: (text: string, vars?: TranslateVars) => string
  /** Locale of the current URL: "id" under /id/…, otherwise "en". */
  routeLocale: SiteLocale
  /** Internal link in the current URL locale (/villas → /id/villas on Indonesian pages). */
  localizeHref: (href: string) => string
}

const LocalizationContext = createContext<LocalizationContextType | null>(null)

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const routeLocale = localeFromPath(pathname)
  const [currency, setCurrencyState] = useState<CurrencyCode>("IDR")
  const [preferredLanguage, setLanguageState] = useState<LanguageCode>("EN")
  // /id/… pages always render Indonesian (also on the server, so Google indexes it)
  const language: LanguageCode = routeLocale === "id" ? "ID" : preferredLanguage
  // Dictionaries for languages that are not bundled (see lib/i18n/ui/load.ts)
  const [loadedBundles, setLoadedBundles] = useState<Partial<Record<LanguageCode, LanguageBundle>>>({})

  useEffect(() => {
    if (BUNDLED_UI[language] || loadedBundles[language]) return
    let cancelled = false
    loadLanguageBundle(language)
      ?.then((bundle) => {
        if (!cancelled) setLoadedBundles((prev) => ({ ...prev, [language]: bundle }))
      })
      .catch(() => {
        // Keep English copy if the chunk fails to load
      })
    return () => {
      cancelled = true
    }
  }, [language, loadedBundles])

  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem("kinghouse_currency") as CurrencyCode
      if (savedCurrency && SUPPORTED_CURRENCIES.some((c) => c.code === savedCurrency)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrencyState(savedCurrency)
      }
      const savedLang = localStorage.getItem("kinghouse_language") as LanguageCode
      if (savedLang && SUPPORTED_LANGUAGES.some((l) => l.code === savedLang)) {
        setLanguageState(savedLang)
      }
    } catch {
      // ignore SSR / storage access restrictions
    }
  }, [])

  // Keep the URL and the chosen language in step: visiting /id/… makes Indonesian the
  // preference; a saved Indonesian preference moves English pages to their /id version.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync preference from the URL
    if (routeLocale === "id") setLanguageState("ID")
  }, [routeLocale, pathname])

  useEffect(() => {
    if (routeLocale === "en" && preferredLanguage === "ID" && hasIdVersion(pathname)) {
      router.replace(localizePath(pathname + window.location.search + window.location.hash, "id"))
    }
  }, [routeLocale, pathname, preferredLanguage, router])

  useEffect(() => {
    document.documentElement.lang = language.toLowerCase()
  }, [language])

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c)
    trackCurrencyChange(c)
    try {
      localStorage.setItem("kinghouse_currency", c)
    } catch {}
  }

  const setLanguage = (l: LanguageCode) => {
    setLanguageState(l)
    trackLanguageChange(l)
    try {
      localStorage.setItem("kinghouse_language", l)
    } catch {}
    if (routeLocale === "id" && l !== "ID") {
      router.push(localizePath(pathname + window.location.search, "en"))
    }
    // Switching to Indonesian on an English page is handled by the sync effect above.
  }


  const currentCurrencyConfig =
    SUPPORTED_CURRENCIES.find((c) => c.code === currency) ?? SUPPORTED_CURRENCIES[0]

  const currentLanguageConfig =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) ?? SUPPORTED_LANGUAGES[0]

  const formatPrice = (amountInIdr: number, customCurrency?: CurrencyCode): string => {
    const activeCurrencyCode = customCurrency ?? currency
    const activeConfig =
      SUPPORTED_CURRENCIES.find((c) => c.code === activeCurrencyCode) ?? SUPPORTED_CURRENCIES[0]

    const converted = amountInIdr * activeConfig.rateFromIdr

    if (activeConfig.code === "IDR") {
      return `Rp ${Math.round(converted).toLocaleString("id-ID")}`
    } else if (activeConfig.code === "USD") {
      return `$${Math.round(converted).toLocaleString("en-US")}`
    } else if (activeConfig.code === "EUR") {
      return `€${Math.round(converted).toLocaleString("de-DE")}`
    } else if (activeConfig.code === "CNY" || activeConfig.code === "JPY") {
      return `¥${Math.round(converted).toLocaleString("zh-CN")}`
    } else if (activeConfig.code === "TWD") {
      return `NT$ ${Math.round(converted).toLocaleString("zh-TW")}`
    } else if (activeConfig.code === "RUB") {
      return `₽ ${Math.round(converted).toLocaleString("ru-RU")}`
    } else if (activeConfig.code === "AUD") {
      return `A$ ${Math.round(converted).toLocaleString("en-AU")}`
    } else if (activeConfig.code === "SGD") {
      return `S$ ${Math.round(converted).toLocaleString("en-SG")}`
    } else if (activeConfig.code === "GBP") {
      return `£${Math.round(converted).toLocaleString("en-GB")}`
    }

    return `${activeConfig.symbol} ${Math.round(converted).toLocaleString()}`
  }

  const t = (key: string, vars?: TranslateVars): string => {
    const uiDict = BUNDLED_UI[language] ?? loadedBundles[language]?.ui
    const funnelDict = (BUNDLED_FUNNEL[language] ?? loadedBundles[language]?.funnel) as Record<string, string> | undefined
    const text =
      uiDict?.[key] ||
      funnelDict?.[key] ||
      // Fallback to English (also while another language's chunk is loading)
      uiEn[key] ||
      (funnelEn as Record<string, string>)[key] ||
      key
    return interpolate(text, vars)
  }

  return (
    <LocalizationContext.Provider
      value={{
        currency,
        setCurrency,
        currentCurrencyConfig,
        language,
        setLanguage,
        currentLanguageConfig,
        formatPrice,
        t,
        // English source copy; /id pages swap in the Indonesian dictionary (see ContentDictionaryProvider)
        tc: (text: string, vars?: TranslateVars) => interpolate(text, vars),
        routeLocale,
        localizeHref: (href: string) => localizePath(href, routeLocale),
      }}
    >
      {children}
    </LocalizationContext.Provider>
  )
}

/** Indonesian page-copy dictionary, provided only under /id so English pages never ship it. */
const ContentDictionaryContext = createContext<Record<string, string> | null>(null)

export function ContentDictionaryProvider({
  dictionary,
  children,
}: {
  dictionary: Record<string, string>
  children: React.ReactNode
}) {
  return <ContentDictionaryContext.Provider value={dictionary}>{children}</ContentDictionaryContext.Provider>
}

export function useLocalization() {
  const context = useContext(LocalizationContext)
  const dictionary = useContext(ContentDictionaryContext)
  if (!context) {
    throw new Error("useLocalization must be used within a LocalizationProvider")
  }
  if (!dictionary || context.language !== "ID") return context
  return {
    ...context,
    tc: (text: string, vars?: TranslateVars) => interpolate(dictionary[text] ?? text, vars),
  }
}
