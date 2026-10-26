import { describe, it, expect } from "vitest"
import { MANAGEMENT_FEES } from "@/lib/constants"
import { MANAGEMENT_TIERS } from "@/lib/data"
import { HK_FAQ, WHATSAPP_LINES } from "@/lib/funnel/config"
import { FUNNEL_LANGUAGES, createTranslator } from "@/lib/i18n/funnel"

describe("Owner decisions (Oct 2026)", () => {
  it("uses one guest WhatsApp line for stays and events, separate from the owner line", () => {
    expect(WHATSAPP_LINES.STAY).toBe(WHATSAPP_LINES.EVENT)
    expect(WHATSAPP_LINES.OWNER).toMatch(/^\d{8,}$/)
  })

  it("shows the Full Management fee by property type in every language", () => {
    expect(MANAGEMENT_FEES).toMatchObject({ apartmentPercent: 23, villaMinPercent: 15, villaMaxPercent: 18 })
    for (const lang of FUNNEL_LANGUAGES) {
      const line = createTranslator(lang)("f.svc.full.f4", { apt: 23, min: 15, max: 18 })
      expect(line, lang).toContain("23")
      expect(line, lang).toMatch(/15\s?[–〜]\s?18/)
      expect(line, lang).not.toContain("20")
    }
  })

  it("prices Full Management by property and quotes Co-Hosting on request", () => {
    expect(MANAGEMENT_TIERS.map((t) => [t.id, t.feeKind])).toEqual([
      ["exclusive-marketing", "on-request"],
      ["full-management", "by-property"],
    ])
  })

  it("has a complete HK on Demand FAQ for structured data", () => {
    const t = createTranslator("EN")
    for (const [q, a] of HK_FAQ) {
      expect(t(q).endsWith("?")).toBe(true)
      expect(t(a).length).toBeGreaterThan(20)
    }
  })
})
