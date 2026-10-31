// Monthly owner report: the Airbnb payout for one property and month, minus the
// Kinghouse fee, operating costs and fixed costs. Costs are the ERP expense
// records of that month; fixed costs use the "Fixed Cost" category.

import { MANAGEMENT_FEES } from "@/lib/constants"
import type { ExpenseCategory, ExpenseRecord } from "@/lib/erp/types"
import { getAirbnbEarnings, toIdr } from "./airbnb-monthly"

/**
 * Kinghouse fee as a % of the Airbnb payout (owner decision, Oct 2026: fee is
 * taken from what Airbnb pays out). Apartments and rooms use the apartment
 * rate; Versatile House uses the top of the villa range until a rate is agreed.
 */
export const OWNER_FEE_PERCENT: Record<string, number> = {
  "versatile-house-jagakarsa": MANAGEMENT_FEES.villaMaxPercent,
  "sky-house-tangerang": MANAGEMENT_FEES.apartmentPercent,
  "skyline-luxury-orange-county-cikarang": MANAGEMENT_FEES.apartmentPercent,
  "bright-airy-apartment-palmerah": MANAGEMENT_FEES.apartmentPercent,
}

export const FIXED_COST_CATEGORY: ExpenseCategory = "Fixed Cost"

export interface CostTemplateItem {
  name: string
  category: ExpenseCategory
  hint: string
}

/** Recurring monthly bills: entered once, copied forward month to month. */
export const FIXED_COST_TEMPLATE: CostTemplateItem[] = [
  { name: "Internet / WiFi", category: FIXED_COST_CATEGORY, hint: "Tagihan provider internet" },
  { name: "Listrik (PLN)", category: FIXED_COST_CATEGORY, hint: "Token atau tagihan bulanan" },
  { name: "Air (PDAM)", category: FIXED_COST_CATEGORY, hint: "Tagihan air bulanan" },
  { name: "IPL / Service charge", category: FIXED_COST_CATEGORY, hint: "Iuran pengelola gedung / perumahan" },
  { name: "Gaji penjaga / staf", category: FIXED_COST_CATEGORY, hint: "Penjaga villa, staf tetap" },
  { name: "PBB (dibagi 12)", category: FIXED_COST_CATEGORY, hint: "Pajak bumi & bangunan per bulan" },
]

/** Costs that change month to month; the pool line only applies to villas with a pool. */
export function operatingCostTemplate(propertySlug: string): CostTemplateItem[] {
  return [
    { name: "Servis AC", category: "Maintenance & Repairs", hint: "Cuci / isi freon AC" },
    ...(propertySlug === "versatile-house-jagakarsa"
      ? [{ name: "Perawatan kolam renang", category: "Maintenance & Repairs" as ExpenseCategory, hint: "Kaporit, pembersihan rutin" }]
      : []),
    { name: "Laundry & linen", category: "Linen & Laundry", hint: "Cuci sprei, handuk" },
    { name: "Amenities tamu", category: "Guest Amenities", hint: "Sabun, tisu, air minum, kopi" },
    { name: "Kebersihan (housekeeping)", category: "Staff & Housekeeping", hint: "Bersih-bersih antar tamu" },
    { name: "Perbaikan lain", category: "Maintenance & Repairs", hint: "Lampu, keran, kunci, dll." },
  ]
}

export interface ReportCostLine {
  id: string
  name: string
  category: ExpenseCategory
  amountIdr: number
}

export interface OwnerMonthlyReport {
  propertySlug: string
  month: string // YYYY-MM
  hasAirbnbData: boolean
  currency: "IDR" | "JPY"
  fxRateIdr: number | null
  paidIdr: number
  upcomingIdr: number
  payoutIdr: number // paid + upcoming: Airbnb's "Total" for the month
  /** Airbnb's paid breakdown in IDR, when it was copied from Airbnb. */
  airbnbBreakdown: { grossIdr: number; serviceFeeIdr: number; adjustmentsIdr: number; taxesIdr: number } | null
  feePercent: number
  feeIdr: number
  operatingCosts: ReportCostLine[]
  operatingTotalIdr: number
  fixedCosts: ReportCostLine[]
  fixedTotalIdr: number
  netToOwnerIdr: number
}

/** Expense records that belong to a property, matching either its id or its slug. */
export function expensesForProperty(expenses: ExpenseRecord[], propertySlug: string, propertyId?: string): ExpenseRecord[] {
  return expenses.filter(
    (e) => e.propertySlug === propertySlug || e.propertyId === propertySlug || (propertyId && e.propertyId === propertyId)
  )
}

export function buildOwnerMonthlyReport(
  propertySlug: string,
  month: string,
  propertyExpenses: ExpenseRecord[]
): OwnerMonthlyReport {
  const earnings = getAirbnbEarnings(propertySlug)
  const row = earnings?.months.find((r) => r.month === month)
  const currency = earnings?.currency ?? "IDR"
  const conv = (n: number) => toIdr(n, currency)

  const paidIdr = row ? conv(row.paid) : 0
  const upcomingIdr = row ? conv(row.upcoming) : 0
  const payoutIdr = paidIdr + upcomingIdr
  const b = row?.paidBreakdown
  const feePercent = OWNER_FEE_PERCENT[propertySlug] ?? MANAGEMENT_FEES.apartmentPercent
  const feeIdr = Math.round((payoutIdr * feePercent) / 100)

  const inMonth = propertyExpenses
    .filter((e) => e.date.slice(0, 7) === month)
    .map((e) => ({ id: e.id, name: e.description, category: e.category, amountIdr: e.amountIdr }))
  const fixedCosts = inMonth.filter((e) => e.category === FIXED_COST_CATEGORY)
  const operatingCosts = inMonth.filter((e) => e.category !== FIXED_COST_CATEGORY)
  const operatingTotalIdr = operatingCosts.reduce((s, e) => s + e.amountIdr, 0)
  const fixedTotalIdr = fixedCosts.reduce((s, e) => s + e.amountIdr, 0)

  return {
    propertySlug,
    month,
    hasAirbnbData: Boolean(row),
    currency,
    fxRateIdr: currency === "JPY" ? conv(1) : null,
    paidIdr,
    upcomingIdr,
    payoutIdr,
    airbnbBreakdown: b
      ? {
          grossIdr: conv(b.gross),
          serviceFeeIdr: conv(b.serviceFee),
          adjustmentsIdr: conv(b.adjustments),
          taxesIdr: conv(b.taxesWithheld),
        }
      : null,
    feePercent,
    feeIdr,
    operatingCosts,
    operatingTotalIdr,
    fixedCosts,
    fixedTotalIdr,
    netToOwnerIdr: payoutIdr - feeIdr - operatingTotalIdr - fixedTotalIdr,
  }
}

/** Months that have an Airbnb export row, newest first, for the month picker. */
export function reportMonths(propertySlug: string, upTo: string): string[] {
  const earnings = getAirbnbEarnings(propertySlug)
  if (!earnings) return [upTo]
  return earnings.months
    .map((r) => r.month)
    .filter((mm) => mm <= upTo)
    .reverse()
}
