// 60-day revenue outlook for the pricing dashboard, anchored to exact Airbnb
// payouts instead of assuming every night sells. Pure functions: the engine
// passes in the calendar and the Airbnb export, tests pass fixed dates.

import { toIdr, JPY_TO_IDR, type AirbnbEarningsExport } from "@/lib/earnings/airbnb-monthly"
import type { AirbnbRunRate, DailyPriceRecommendation, YieldOutlook } from "./types"

const MONTH_LABELS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]

/** Months averaged for the run-rate: the current month and the two before it. */
export const RUN_RATE_MONTHS = 3

/**
 * Dynamic prices also turn some guests away, so only half of the price uplift
 * on open nights is counted as extra revenue.
 */
export const YIELD_REALIZATION_FACTOR = 0.5

const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
const monthLabel = (key: string) => MONTH_LABELS_ID[Number(key.slice(5, 7)) - 1]

export function computeAirbnbRunRate(
  earnings: AirbnbEarningsExport,
  asOf: Date,
  horizonDays: number
): AirbnbRunRate {
  const months = earnings.months.map((row) => {
    const paidIdr = toIdr(row.paid, earnings.currency)
    const upcomingIdr = toIdr(row.upcoming, earnings.currency)
    return { month: row.month, label: monthLabel(row.month), paidIdr, upcomingIdr, totalIdr: paidIdr + upcomingIdr }
  })

  const currentMonth = monthKey(asOf)
  const horizonEnd = new Date(asOf)
  horizonEnd.setDate(horizonEnd.getDate() + horizonDays - 1)
  const horizonEndMonth = monthKey(horizonEnd)

  const runRate = months.filter((p) => p.month <= currentMonth).slice(-RUN_RATE_MONTHS)
  const avgMonthlyIdr = runRate.length
    ? Math.round(runRate.reduce((sum, p) => sum + p.totalIdr, 0) / runRate.length)
    : 0
  const baselineHorizonIdr = Math.round((avgMonthlyIdr * horizonDays) / 30)

  const locked = months.filter((p) => p.month > currentMonth && p.month <= horizonEndMonth)
  const lockedUpcomingIdr = locked.reduce((sum, p) => sum + p.upcomingIdr, 0)

  return {
    currency: earnings.currency,
    fxRateIdr: earnings.currency === "JPY" ? JPY_TO_IDR : null,
    exportedAt: earnings.exportedAt,
    listings: earnings.listings,
    months,
    runRateMonths: runRate.map((p) => p.label),
    avgMonthlyIdr,
    baselineHorizonIdr,
    lockedMonths: locked.map((p) => p.label),
    lockedUpcomingIdr,
    remainingToSellIdr: Math.max(0, baselineHorizonIdr - lockedUpcomingIdr),
  }
}

export function computeYieldOutlook(
  recommendations: DailyPriceRecommendation[],
  earnings: AirbnbEarningsExport | null,
  asOf: Date
): YieldOutlook {
  const horizonDays = recommendations.length
  const open = recommendations.filter((r) => !r.isBooked)
  const upliftFraction = open.length
    ? open.reduce((sum, r) => sum + (r.recommendedPriceIdr / r.basePriceIdr - 1), 0) / open.length
    : 0

  const outlook: YieldOutlook = {
    horizonDays,
    bookedNights: horizonDays - open.length,
    openNights: open.length,
    priceUpliftPercent: Number((upliftFraction * 100).toFixed(1)),
    realizationFactor: YIELD_REALIZATION_FACTOR,
    airbnb: null,
    yieldLiftIdr: null,
    yieldLiftPercent: null,
    projectedHorizonIdr: null,
  }
  if (!earnings) return outlook

  const airbnb = computeAirbnbRunRate(earnings, asOf, horizonDays)
  const yieldLiftIdr = Math.round(airbnb.remainingToSellIdr * Math.max(0, upliftFraction) * YIELD_REALIZATION_FACTOR)

  return {
    ...outlook,
    airbnb,
    yieldLiftIdr,
    yieldLiftPercent:
      airbnb.baselineHorizonIdr > 0 ? Number(((yieldLiftIdr / airbnb.baselineHorizonIdr) * 100).toFixed(1)) : 0,
    projectedHorizonIdr: airbnb.lockedUpcomingIdr + airbnb.remainingToSellIdr + yieldLiftIdr,
  }
}
