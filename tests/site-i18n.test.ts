import { describe, it, expect } from "vitest"
import { readFileSync, readdirSync, statSync } from "fs"
import path from "path"
import { MANAGED_AREAS } from "@/lib/constants"
import { CASE_STUDIES, CURATED_VILLAS, MANAGEMENT_TIERS, TESTIMONIALS, VERSATILE_HOUSE_EVENT_PRICELIST, VILLA_EVENTS } from "@/lib/data"
import { FAQ_CATEGORIES } from "@/lib/faq"
import { ID_CONTENT } from "@/lib/i18n/content/id"
import { hasIdVersion, localeAlternates, localeFromPath, localizePath, stripLocale } from "@/lib/i18n/site"
import { translateContent } from "@/lib/i18n/content"

const BASE = "https://www.kinghousemanagement.com"

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) return name === "dashboard" ? [] : sourceFiles(full)
    return full.endsWith(".tsx") ? [full] : []
  })
}

describe("Indonesian routing", () => {
  it("maps English paths to /id and back", () => {
    expect(localizePath("/", "id")).toBe("/id")
    expect(localizePath("/owner-services", "id")).toBe("/id/owner-services")
    expect(localizePath("/villas?area=tangerang", "id")).toBe("/id/villas?area=tangerang")
    expect(localizePath("/events/garden-wedding-jagakarsa", "id")).toBe("/id/events/garden-wedding-jagakarsa")
    expect(localizePath("/id/faq", "en")).toBe("/faq")
    expect(stripLocale("/id")).toBe("/")
    expect(localeFromPath("/id/villas")).toBe("id")
    expect(localeFromPath("/identity")).toBe("en")
  })

  it("keeps pages without an Indonesian version in English", () => {
    expect(hasIdVersion("/blog")).toBe(false)
    expect(localizePath("/blog/some-post", "id")).toBe("/blog/some-post")
    expect(localizePath("/privacy", "id")).toBe("/privacy")
    expect(localizePath("https://wa.me/123", "id")).toBe("https://wa.me/123")
  })

  it("emits reciprocal hreflang with a self-referencing canonical", () => {
    const en = localeAlternates("/owner-services", "en")
    const id = localeAlternates("/owner-services", "id")
    expect(en.canonical).toBe(`${BASE}/owner-services`)
    expect(id.canonical).toBe(`${BASE}/id/owner-services`)
    expect(en.languages).toEqual(id.languages)
    expect(id.languages).toEqual({
      en: `${BASE}/owner-services`,
      id: `${BASE}/id/owner-services`,
      "x-default": `${BASE}/owner-services`,
    })
    expect(localeAlternates("/", "id").canonical).toBe(`${BASE}/id`)
  })
})

describe("Indonesian page copy", () => {
  it("translates every literal passed to tc()/tx() in public pages and components", () => {
    const files = [...sourceFiles("app"), ...sourceFiles("components")]
    const missing: string[] = []
    for (const file of files) {
      const src = readFileSync(file, "utf8")
      for (const m of src.matchAll(/\bt[cx]\(\s*"((?:[^"\\]|\\.)*)"/g)) {
        const text = JSON.parse(`"${m[1]}"`) as string
        if (!(text in ID_CONTENT)) missing.push(`${file}: ${text}`)
      }
    }
    expect(missing).toEqual([])
  })

  it("translates the data shown on the Indonesian pages", () => {
    const texts = [
      ...CURATED_VILLAS.flatMap((v) => [
        v.tagline,
        v.architecturalStyle,
        v.editorialDescription.lead,
        v.editorialDescription.architecturalHighlights,
        v.editorialDescription.theSpace,
        ...(v.houseRules ?? []),
        ...v.amenities.map((a) => a.name),
        ...v.nearbySpots.map((s) => s.travelTime),
      ]),
      ...VILLA_EVENTS.flatMap((e) => [
        e.title,
        e.tagline,
        e.description,
        ...e.highlights,
        ...e.packages.flatMap((p) => [p.name, p.description, p.priceNote, ...p.includes]),
      ]),
      ...VERSATILE_HOUSE_EVENT_PRICELIST.flatMap((t) => [t.categoryLabel, t.durationText, t.description, ...t.tiers.map((x) => x.name)]),
      ...MANAGED_AREAS.flatMap((a) => [a.description, a.highlight]),
      ...TESTIMONIALS.flatMap((t) => [t.quote, t.roleOrLocation]),
      ...CASE_STUDIES.flatMap((c) => [c.summary, c.period, c.quote.text]),
      ...MANAGEMENT_TIERS.flatMap((t) => [t.subtitle, t.description, t.idealFor, ...t.features.map((f) => f.title)]),
      ...FAQ_CATEGORIES.flatMap((c) => [c.title, ...c.items.flatMap((i) => [i.question, i.answer])]),
    ].filter((t): t is string => Boolean(t))
    const missing = [...new Set(texts)].filter((t) => translateContent("id", t) === t && !(t in ID_CONTENT))
    expect(missing).toEqual([])
  })

  it("keeps placeholders intact in translations", () => {
    for (const [en, id] of Object.entries(ID_CONTENT)) {
      const vars = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()
      expect(vars(id), en).toEqual(vars(en))
    }
  })
})
