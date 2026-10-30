import { describe, it, expect } from "vitest"
import { AIRBNB_MONTHLY_EARNINGS, getAirbnbEarnings, toIdr, JPY_TO_IDR } from "@/lib/earnings/airbnb-monthly"
import { computeAirbnbRunRate, computeYieldOutlook, YIELD_REALIZATION_FACTOR } from "@/lib/pricing/yield"
import { generateDynamicPricing } from "@/lib/pricing/engine"
import type { DailyPriceRecommendation } from "@/lib/pricing/types"

const AS_OF = new Date(2026, 9, 30) // 30 Oct 2026, the day the CSVs were exported

function rec(basePriceIdr: number, recommendedPriceIdr: number, isBooked = false): DailyPriceRecommendation {
  return {
    date: "2026-11-01",
    dayOfWeek: "Minggu",
    dayOfWeekShort: "Min",
    dayNumber: 1,
    basePriceIdr,
    recommendedPriceIdr,
    isBooked,
    isHoliday: false,
    demandLevel: "Moderate",
    demandScore: 50,
    multipliers: {
      dayOfWeekFactor: 1,
      seasonalityFactor: 1,
      holidayFactor: 1,
      leadTimeFactor: 1,
      pacingFactor: 1,
      rawRecommendedPriceIdr: recommendedPriceIdr,
      clampedRecommendedPriceIdr: recommendedPriceIdr,
    },
    notes: [],
  }
}

describe("Airbnb monthly earnings (exact CSV figures)", () => {
  it("keeps the Airbnb totals the CSV exports report", () => {
    const versatile = getAirbnbEarnings("versatile-house-jagakarsa")!
    const oct = versatile.months.find((r) => r.month === "2026-10")!
    expect(oct.paid).toBe(27914475)
    expect(oct.upcoming).toBe(7621794)
    expect(oct.paid + oct.upcoming).toBe(35536269) // "Total (IDR)" column

    const skyline = getAirbnbEarnings("skyline-luxury-orange-county-cikarang")!
    expect(skyline.months.find((r) => r.month === "2026-08")!.paid).toBe(3891318)

    const skyHouse = getAirbnbEarnings("sky-house-tangerang")!
    expect(skyHouse.currency).toBe("JPY")
    expect(skyHouse.months.find((r) => r.month === "2026-10")!.paid).toBe(48864)
  })

  it("covers twelve months per export and converts JPY at the site rate", () => {
    Object.values(AIRBNB_MONTHLY_EARNINGS).forEach((e) => expect(e.months).toHaveLength(12))
    expect(toIdr(48864, "JPY")).toBe(48864 * JPY_TO_IDR)
    expect(toIdr(1000, "IDR")).toBe(1000)
  })

  it("has no export for a property without Airbnb data", () => {
    expect(getAirbnbEarnings("bright-airy-apartment-palmerah")).toBeNull()
  })
})

describe("60-day run-rate from Airbnb payouts", () => {
  it("averages Aug-Oct and locks Nov-Dec confirmed bookings (Versatile House)", () => {
    const r = computeAirbnbRunRate(getAirbnbEarnings("versatile-house-jagakarsa")!, AS_OF, 60)
    expect(r.runRateMonths).toEqual(["Agu", "Sep", "Okt"])
    // (56,158,426 + 30,074,031 + 35,536,269) / 3
    expect(r.avgMonthlyIdr).toBe(40589575)
    expect(r.baselineHorizonIdr).toBe(81179150)
    expect(r.lockedMonths).toEqual(["Nov", "Des"])
    expect(r.lockedUpcomingIdr).toBe(14511973)
    expect(r.remainingToSellIdr).toBe(81179150 - 14511973)
  })

  it("handles Orange County and the JPY Sky House account", () => {
    const skyline = computeAirbnbRunRate(getAirbnbEarnings("skyline-luxury-orange-county-cikarang")!, AS_OF, 60)
    expect(skyline.avgMonthlyIdr).toBe(3135101) // 9,405,303 / 3
    expect(skyline.lockedUpcomingIdr).toBe(466459 + 579521)

    const sky = computeAirbnbRunRate(getAirbnbEarnings("sky-house-tangerang")!, AS_OF, 60)
    expect(sky.fxRateIdr).toBe(JPY_TO_IDR)
    expect(sky.avgMonthlyIdr).toBe(5545015) // (62,680 + 46,885 + 48,864) JPY x 105 / 3
    expect(sky.lockedUpcomingIdr).toBe((46699 + 47268) * JPY_TO_IDR)
  })

  it("never counts the current month's upcoming as locked future revenue", () => {
    const r = computeAirbnbRunRate(getAirbnbEarnings("versatile-house-jagakarsa")!, AS_OF, 60)
    expect(r.lockedMonths).not.toContain("Okt")
  })

  it("does not let locked bookings push the remainder below zero", () => {
    const r = computeAirbnbRunRate(getAirbnbEarnings("sky-house-tangerang")!, AS_OF, 30)
    expect(r.remainingToSellIdr).toBeGreaterThanOrEqual(0)
  })
})

describe("Yield outlook", () => {
  it("lifts only the revenue still to sell, at half the open-night price uplift", () => {
    const earnings = getAirbnbEarnings("versatile-house-jagakarsa")!
    // 60 nights: 10 booked, 50 open priced 20% above base
    const recs = [
      ...Array.from({ length: 10 }, () => rec(1900000, 1900000, true)),
      ...Array.from({ length: 50 }, () => rec(1900000, 2280000)),
    ]
    const o = computeYieldOutlook(recs, earnings, AS_OF)
    expect(o.bookedNights).toBe(10)
    expect(o.openNights).toBe(50)
    expect(o.priceUpliftPercent).toBe(20)

    const remaining = 81179150 - 14511973
    const lift = Math.round(remaining * 0.2 * YIELD_REALIZATION_FACTOR)
    expect(o.yieldLiftIdr).toBe(lift)
    expect(o.projectedHorizonIdr).toBe(14511973 + remaining + lift)
    expect(o.yieldLiftPercent).toBe(Number(((lift / 81179150) * 100).toFixed(1)))
  })

  it("adds no lift when dynamic prices average below the base price", () => {
    const o = computeYieldOutlook([rec(1000000, 900000)], getAirbnbEarnings("versatile-house-jagakarsa")!, AS_OF)
    expect(o.priceUpliftPercent).toBe(-10)
    expect(o.yieldLiftIdr).toBe(0)
  })

  it("returns only the price uplift when there is no Airbnb export", () => {
    const o = computeYieldOutlook([rec(280000, 308000)], null, AS_OF)
    expect(o.airbnb).toBeNull()
    expect(o.yieldLiftIdr).toBeNull()
    expect(o.projectedHorizonIdr).toBeNull()
    expect(o.priceUpliftPercent).toBe(10)
  })

  it("is part of the dynamic pricing response and stays near the Airbnb run-rate", async () => {
    const result = await generateDynamicPricing("versatile-house-jagakarsa", "balanced", 60, AS_OF)
    const o = result.yieldOutlook
    expect(o.airbnb?.avgMonthlyIdr).toBe(40589575)
    // The old figure (all 60 nights sold) was ~Rp 152 juta; the outlook starts from real payouts
    expect(o.projectedHorizonIdr!).toBeLessThan(result.projectedRevenueIdr)
    expect(o.projectedHorizonIdr!).toBeGreaterThanOrEqual(o.airbnb!.baselineHorizonIdr)
    expect(o.projectedHorizonIdr!).toBeLessThanOrEqual(o.airbnb!.baselineHorizonIdr * 1.5)

    const palmerah = await generateDynamicPricing("bright-airy-apartment-palmerah", "balanced", 60, AS_OF)
    expect(palmerah.yieldOutlook.airbnb).toBeNull()
  })
})
