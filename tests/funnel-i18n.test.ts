import { describe, it, expect } from "vitest"
import { FUNNEL_LANGUAGES, FUNNEL_TRANSLATIONS, createTranslator, formatDateFor } from "@/lib/i18n/funnel"
import { en } from "@/lib/i18n/funnel/en"
import { SUPPORTED_LANGUAGES } from "@/lib/context/localization-context"

const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()

describe("Funnel translations", () => {
  it("covers every language the site offers", () => {
    expect([...FUNNEL_LANGUAGES].sort()).toEqual(SUPPORTED_LANGUAGES.map((l) => l.code).sort())
  })

  for (const lang of FUNNEL_LANGUAGES) {
    it(`${lang}: every key is translated and keeps the English placeholders`, () => {
      const dict = FUNNEL_TRANSLATIONS[lang]
      for (const key of Object.keys(en) as (keyof typeof en)[]) {
        expect(dict[key]?.trim(), `${lang} ${key}`).toBeTruthy()
        expect(placeholders(dict[key]), `${lang} ${key}`).toEqual(placeholders(en[key]))
      }
    })
  }

  it("falls back to English and fills placeholders", () => {
    expect(createTranslator("FR")("f.thanks.title", { name: "Anne" })).toBe("Merci, Anne !")
    expect(createTranslator("EN")("f.nights", { n: 3 })).toBe("3 nights")
  })

  it("formats dates per language", () => {
    expect(formatDateFor("EN", "2026-11-01")).toBe("1 Nov 2026")
    expect(formatDateFor("ID", "2026-11-01")).toBe("1 Nov 2026")
    expect(formatDateFor("JA", "2026-11-01")).toBe("2026年11月1日")
  })
})
