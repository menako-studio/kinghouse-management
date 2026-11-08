import { getAirbnbEarnings, toIdr } from "./airbnb-monthly"

export interface PayoutSummary {
  /** Months counted (YYYY-MM), oldest first: the most recent paid months. */
  months: string[]
  averageIdr: number
  best: { month: string; idr: number }
  exportedAt: string
}

/**
 * Average and best monthly Airbnb payout over the last `window` months that were
 * actually paid out (upcoming payouts are excluded so nothing is projected).
 */
export function summarizePayouts(propertySlug: string, window = 4): PayoutSummary | null {
  const data = getAirbnbEarnings(propertySlug)
  if (!data) return null
  const paid = data.months.filter((m) => m.paid > 0).slice(-window)
  if (!paid.length) return null
  const amounts = paid.map((m) => ({ month: m.month, idr: toIdr(m.paid, data.currency) }))
  const best = amounts.reduce((a, b) => (b.idr > a.idr ? b : a))
  return {
    months: amounts.map((a) => a.month),
    averageIdr: Math.round(amounts.reduce((sum, a) => sum + a.idr, 0) / amounts.length),
    best,
    exportedAt: data.exportedAt,
  }
}
