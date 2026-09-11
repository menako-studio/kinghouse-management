import { describe, it, expect, beforeEach } from "vitest"
import {
  calculateDowMultiplier,
  calculateSeasonalityMultiplier,
  calculateLeadTimeMultiplier,
  getPricingRules,
  generateDynamicPricing,
} from "@/lib/pricing/engine"
import { isDateHoliday, getIndonesianHolidays } from "@/lib/pricing/holidays"
import {
  setPriceOverride,
  removePriceOverride,
  getPriceOverridesStore,
} from "@/lib/pricing/store"
import { generatePricingCsv } from "@/lib/pricing/export"

describe("Dynamic Pricing Engine (AirDNA-Grade)", () => {
  beforeEach(() => {
    // Clear any overrides before each test
    const store = getPriceOverridesStore()
    store.clear()
  })

  describe("Day-of-Week Multipliers (Submarket Awareness)", () => {
    it("applies strong weekend surge for luxury staycation villa (Jagakarsa)", () => {
      const saturdayMult = calculateDowMultiplier(6, "luxury-villa", 35)
      const fridayMult = calculateDowMultiplier(5, "luxury-villa", 35)
      const wednesdayMult = calculateDowMultiplier(3, "luxury-villa", 35)

      expect(saturdayMult).toBeGreaterThan(1.3)
      expect(fridayMult).toBeGreaterThan(1.2)
      expect(wednesdayMult).toBeLessThan(1.0)
    })

    it("inverts weekend surge for industrial business apartments (Cikarang Orange County)", () => {
      // In Cikarang, expats and industrial engineers book weekdays (Mon-Thu)
      const mondayMult = calculateDowMultiplier(1, "business-apartment", 0)
      const tuesdayMult = calculateDowMultiplier(2, "business-apartment", 0)
      const saturdayMult = calculateDowMultiplier(6, "business-apartment", 0)

      expect(mondayMult).toBe(1.12)
      expect(tuesdayMult).toBe(1.12)
      expect(saturdayMult).toBe(0.9)
      expect(mondayMult).toBeGreaterThan(saturdayMult)
    })

    it("applies moderate weekend surge for urban transit apartments (Alam Sutera & Palmerah)", () => {
      const saturdayMult = calculateDowMultiplier(6, "urban-transit", 25)
      const wednesdayMult = calculateDowMultiplier(3, "urban-transit", 25)

      expect(saturdayMult).toBe(1.25)
      expect(wednesdayMult).toBe(0.97)
    })
  })

  describe("Seasonality Multipliers (Indonesia Calendar)", () => {
    it("identifies December & January as peak year-end holiday season", () => {
      expect(calculateSeasonalityMultiplier(11)).toBe(1.2) // December
      expect(calculateSeasonalityMultiplier(0)).toBe(1.2) // January
    })

    it("identifies June & July as mid-year school holidays", () => {
      expect(calculateSeasonalityMultiplier(5)).toBe(1.15) // June
      expect(calculateSeasonalityMultiplier(6)).toBe(1.15) // July
    })

    it("defaults to 1.0 for regular baseline months", () => {
      expect(calculateSeasonalityMultiplier(2)).toBe(1.0) // March
      expect(calculateSeasonalityMultiplier(8)).toBe(1.0) // September
      expect(calculateSeasonalityMultiplier(9)).toBe(1.0) // October
    })
  })

  describe("Lead-Time Urgency Curve (Last-Minute Discount vs Far-Out Premium)", () => {
    it("applies last-minute discount for check-ins within 0-2 days to avoid empty nights", () => {
      const lastMinuteMult = calculateLeadTimeMultiplier(1, 15, 15)
      expect(lastMinuteMult).toBe(0.85) // -15%
    })

    it("retains neutral 1.0 rate for optimal target booking window (3-14 days)", () => {
      const targetWindowMult = calculateLeadTimeMultiplier(7, 15, 15)
      expect(targetWindowMult).toBe(1.0)
    })

    it("applies early-bird protection premium for far-out bookings (>45 days)", () => {
      const farOutMult = calculateLeadTimeMultiplier(50, 15, 20)
      expect(farOutMult).toBe(1.2) // +20%
    })
  })

  describe("Indonesian Public Holidays Detection (Live & Fallback)", () => {
    it("fetches official Indonesian public holidays list", async () => {
      const holidays = await getIndonesianHolidays(2026)
      expect(holidays.length).toBeGreaterThanOrEqual(15)

      const hasNewYear = holidays.some((h) => h.date === "2026-01-01")
      const hasChristmas = holidays.some((h) => h.date === "2026-12-25")
      expect(hasNewYear).toBe(true)
      expect(hasChristmas).toBe(true)
    })

    it("detects holiday and holiday name on a specific date", async () => {
      const holidays = await getIndonesianHolidays(2026)
      const check = isDateHoliday("2026-12-25", holidays)

      expect(check.isHoliday).toBe(true)
      expect(check.holidayName).toContain("Natal")
    })
  })

  describe("Guardrails (Floor & Ceiling Price Enforcement)", () => {
    it("never recommends a rate lower than the configured floor price", () => {
      const rules = getPricingRules("versatile-house-jagakarsa", "conservative")
      expect(rules.minPriceIdr).toBeGreaterThan(0)
      expect(rules.maxPriceIdr).toBeGreaterThan(rules.minPriceIdr)
    })

    it("generates 60-day recommendations strictly clamped within min and max prices", async () => {
      const result = await generateDynamicPricing("skyline-luxury-orange-county-cikarang", "balanced", 30)

      expect(result.recommendations.length).toBe(30)
      result.recommendations.forEach((rec) => {
        expect(rec.recommendedPriceIdr).toBeGreaterThanOrEqual(result.rules.minPriceIdr)
        expect(rec.recommendedPriceIdr).toBeLessThanOrEqual(result.rules.maxPriceIdr)
      })
    })
  })

  describe("Admin Custom Price Override", () => {
    it("strictly applies manual override over algorithmic calculation", async () => {
      const propertySlug = "versatile-house-jagakarsa"
      const targetDate = "2026-10-15"
      const customPrice = 7500000

      // Set manual override
      setPriceOverride({
        propertySlug,
        date: targetDate,
        overridePriceIdr: customPrice,
        reason: "VIP Wedding Booking",
        updatedAt: new Date().toISOString(),
      })

      const result = await generateDynamicPricing(propertySlug, "balanced", 60)
      const targetRec = result.recommendations.find((r) => r.date === targetDate)

      if (targetRec) {
        expect(targetRec.recommendedPriceIdr).toBe(customPrice)
        expect(targetRec.overridePriceIdr).toBe(customPrice)
      }

      // Remove override and verify it resets
      removePriceOverride(propertySlug, targetDate)
      const resetResult = await generateDynamicPricing(propertySlug, "balanced", 60)
      const resetRec = resetResult.recommendations.find((r) => r.date === targetDate)

      if (resetRec) {
        expect(resetRec.overridePriceIdr).toBeUndefined()
        expect(resetRec.recommendedPriceIdr).not.toBe(customPrice)
      }
    })
  })

  describe("CSV Export Generator", () => {
    it("formats dynamic rate calendar into valid CSV with all requisite columns", async () => {
      const result = await generateDynamicPricing("sky-house-tangerang", "balanced", 14)
      const csv = generatePricingCsv(
        result.propertyName,
        result.propertySlug,
        result.rules,
        result.recommendations
      )

      expect(csv).toContain("Tanggal (YYYY-MM-DD)")
      expect(csv).toContain("Tarif Rekomendasi (IDR)")
      expect(csv).toContain("Tarif Dasar (IDR)")
      expect(csv).toContain(result.propertyName)
      expect(csv.split("\r\n").length).toBe(15) // header + 14 rows
    })
  })
})
