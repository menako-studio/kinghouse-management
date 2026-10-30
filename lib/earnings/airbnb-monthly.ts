// Monthly host earnings exported from Airbnb (Earnings → Performance → Monthly
// earnings CSV), copied exactly as Airbnb reports them. "Paid" is the payout
// already sent (gross minus Airbnb's host service fee); "Upcoming" is confirmed
// bookings not paid out yet. Update this file when a new export is pulled.

export type AirbnbPayoutCurrency = "IDR" | "JPY"

export interface AirbnbMonthlyEarning {
  month: string // YYYY-MM
  paid: number // in the export currency
  upcoming: number // in the export currency
}

export interface AirbnbEarningsExport {
  propertySlug: string
  currency: AirbnbPayoutCurrency
  exportedAt: string // YYYY-MM-DD
  /** Airbnb listings whose payouts this export sums (one host account). */
  listings: string[]
  months: AirbnbMonthlyEarning[]
}

/**
 * The Sky House host account is paid out in JPY. Converted with the same rate
 * the site's currency switcher uses (lib/context/localization-context: JPY
 * rateFromIdr = 1/105), so every rupiah figure on the dashboard agrees.
 */
export const JPY_TO_IDR = 105

const m = (month: string, paid: number, upcoming = 0): AirbnbMonthlyEarning => ({ month, paid, upcoming })

export const AIRBNB_MONTHLY_EARNINGS: Record<string, AirbnbEarningsExport> = {
  "versatile-house-jagakarsa": {
    propertySlug: "versatile-house-jagakarsa",
    currency: "IDR",
    exportedAt: "2026-10-30",
    listings: ["Versatile House With Beautiful Garden Beyond", "Villa Event"],
    months: [
      m("2026-01", 0),
      m("2026-02", 16549907),
      m("2026-03", 0),
      m("2026-04", 0),
      m("2026-05", 0),
      m("2026-06", 21095216),
      m("2026-07", 32195597),
      m("2026-08", 56158426),
      m("2026-09", 30074031),
      m("2026-10", 27914475, 7621794),
      m("2026-11", 0, 14511973),
      m("2026-12", 0),
    ],
  },
  "skyline-luxury-orange-county-cikarang": {
    propertySlug: "skyline-luxury-orange-county-cikarang",
    currency: "IDR",
    exportedAt: "2026-10-30",
    listings: ["Skyline Luxury at Orange County"],
    months: [
      m("2026-01", 0),
      m("2026-02", 0),
      m("2026-03", 0),
      m("2026-04", 0),
      m("2026-05", 0),
      m("2026-06", 2609357),
      m("2026-07", 2355171),
      m("2026-08", 3891318),
      m("2026-09", 3347398),
      m("2026-10", 2166587),
      m("2026-11", 0, 466459),
      m("2026-12", 0, 579521),
    ],
  },
  "sky-house-tangerang": {
    propertySlug: "sky-house-tangerang",
    currency: "JPY",
    exportedAt: "2026-10-30",
    listings: ["Sky House • Hotel-Style Bed + IKEA 5min"],
    months: [
      m("2026-01", 18246),
      m("2026-02", 24401),
      m("2026-03", 44054),
      m("2026-04", 49844),
      m("2026-05", 12488),
      m("2026-06", 23177),
      m("2026-07", 21256),
      m("2026-08", 62680),
      m("2026-09", 46885),
      m("2026-10", 48864),
      m("2026-11", 0, 46699),
      m("2026-12", 0, 47268),
    ],
  },
}

export function getAirbnbEarnings(propertySlug: string): AirbnbEarningsExport | null {
  return AIRBNB_MONTHLY_EARNINGS[propertySlug] ?? null
}

/** Rupiah value of an amount in the export's currency. */
export function toIdr(amount: number, currency: AirbnbPayoutCurrency): number {
  return currency === "JPY" ? Math.round(amount * JPY_TO_IDR) : amount
}
