import { describe, it, expect } from "vitest"
import {
  SUPPORTED_CURRENCIES,
  SUPPORTED_LANGUAGES,
} from "@/lib/context/localization-context"
import { CURATED_VILLAS } from "@/lib/data"

describe("Localization and Multi-Currency System", () => {
  it("defines all 10 supported currencies with positive exchange rates", () => {
    expect(SUPPORTED_CURRENCIES.length).toBe(10)
    const codes = SUPPORTED_CURRENCIES.map((c) => c.code)
    expect(codes).toContain("IDR")
    expect(codes).toContain("USD")
    expect(codes).toContain("EUR")
    expect(codes).toContain("CNY")
    expect(codes).toContain("TWD")
    expect(codes).toContain("RUB")
    expect(codes).toContain("JPY")
    expect(codes).toContain("AUD")
    expect(codes).toContain("SGD")
    expect(codes).toContain("GBP")

    SUPPORTED_CURRENCIES.forEach((c) => {
      expect(c.rateFromIdr).toBeGreaterThan(0)
      expect(c.symbol).toBeTruthy()
    })
  })

  it("defines all 9 supported languages with native labels", () => {
    expect(SUPPORTED_LANGUAGES.length).toBe(9)
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code)
    expect(codes).toEqual(["EN", "ID", "JA", "ZH-CN", "ZH-TW", "FR", "ES", "DE", "RU"])
  })

  it("converts villa prices accurately across currencies", () => {
    const sampleIdrPrice = 2800000 // Versatile house event starting rate

    const usdConfig = SUPPORTED_CURRENCIES.find((c) => c.code === "USD")!
    const convertedUsd = Math.round(sampleIdrPrice * usdConfig.rateFromIdr)
    expect(convertedUsd).toBeGreaterThan(100)
    expect(convertedUsd).toBeLessThan(300)

    const audConfig = SUPPORTED_CURRENCIES.find((c) => c.code === "AUD")!
    const convertedAud = Math.round(sampleIdrPrice * audConfig.rateFromIdr)
    expect(convertedAud).toBeGreaterThan(200)

    const jpyConfig = SUPPORTED_CURRENCIES.find((c) => c.code === "JPY")!
    const convertedJpy = Math.round(sampleIdrPrice * jpyConfig.rateFromIdr)
    expect(convertedJpy).toBeGreaterThan(20000)
  })

  it("ensures all curated villas have valid IDs and IDR rates", () => {
    expect(CURATED_VILLAS.length).toBe(4)
    CURATED_VILLAS.forEach((villa) => {
      expect(villa.price.idr).toBeGreaterThan(0)
      expect(villa.name).toBeTruthy()
      expect(villa.areaSlug).toBeTruthy()
    })
  })
})
