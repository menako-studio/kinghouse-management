import { describe, it, expect } from "vitest"
import {
  buildOwnerMonthlyReport,
  expensesForProperty,
  operatingCostTemplate,
  FIXED_COST_TEMPLATE,
  OWNER_FEE_PERCENT,
  reportMonths,
} from "@/lib/earnings/owner-report"
import { JPY_TO_IDR } from "@/lib/earnings/airbnb-monthly"
import type { ExpenseRecord } from "@/lib/erp/types"

function exp(partial: Partial<ExpenseRecord>): ExpenseRecord {
  return {
    id: "EXP-test",
    propertyId: "villa-1",
    propertySlug: "versatile-house-jagakarsa",
    propertyName: "Versatile House",
    category: "Maintenance & Repairs",
    description: "Servis AC",
    amountIdr: 0,
    date: "2026-10-01",
    recordedBy: "Admin",
    ...partial,
  }
}

describe("Owner monthly report", () => {
  it("uses Airbnb's exact October payout and its paid breakdown (Versatile House)", () => {
    const r = buildOwnerMonthlyReport("versatile-house-jagakarsa", "2026-10", [])
    expect(r.paidIdr).toBe(27914475)
    expect(r.upcomingIdr).toBe(7621794)
    expect(r.payoutIdr).toBe(35536269) // Airbnb "Total (IDR)"
    expect(r.airbnbBreakdown).toEqual({ grossIdr: 32785107, serviceFeeIdr: 4870632, adjustmentsIdr: 0, taxesIdr: 0 })
    expect(r.airbnbBreakdown!.grossIdr - r.airbnbBreakdown!.serviceFeeIdr).toBe(r.paidIdr)
  })

  it("takes the Kinghouse fee from the Airbnb payout at the website rate", () => {
    const villa = buildOwnerMonthlyReport("versatile-house-jagakarsa", "2026-10", [])
    expect(villa.feePercent).toBe(18)
    expect(villa.feeIdr).toBe(Math.round(35536269 * 0.18))

    const apt = buildOwnerMonthlyReport("skyline-luxury-orange-county-cikarang", "2026-10", [])
    expect(apt.feePercent).toBe(23)
    expect(apt.payoutIdr).toBe(2166587)
    expect(apt.feeIdr).toBe(Math.round(2166587 * 0.23))
    expect(OWNER_FEE_PERCENT["sky-house-tangerang"]).toBe(23)
  })

  it("splits operating and fixed costs of the month and nets them out", () => {
    const expenses = [
      exp({ id: "a", description: "Servis AC", amountIdr: 350000 }),
      exp({ id: "b", description: "Perawatan kolam renang", amountIdr: 600000, date: "2026-10-15" }),
      exp({ id: "c", description: "Internet / WiFi", category: "Fixed Cost", amountIdr: 400000 }),
      exp({ id: "d", description: "Servis AC", amountIdr: 999999, date: "2026-09-20" }), // other month
    ]
    const r = buildOwnerMonthlyReport("versatile-house-jagakarsa", "2026-10", expenses)
    expect(r.operatingTotalIdr).toBe(950000)
    expect(r.fixedTotalIdr).toBe(400000)
    expect(r.operatingCosts.map((c) => c.name)).toEqual(["Servis AC", "Perawatan kolam renang"])
    expect(r.netToOwnerIdr).toBe(35536269 - Math.round(35536269 * 0.18) - 950000 - 400000)
  })

  it("converts the JPY Sky House account to rupiah", () => {
    const r = buildOwnerMonthlyReport("sky-house-tangerang", "2026-10", [])
    expect(r.paidIdr).toBe(48864 * JPY_TO_IDR)
    expect(r.airbnbBreakdown!.serviceFeeIdr).toBe(1511 * JPY_TO_IDR)
    expect(r.fxRateIdr).toBe(JPY_TO_IDR)
  })

  it("reports no Airbnb data for a property without an export", () => {
    const r = buildOwnerMonthlyReport("bright-airy-apartment-palmerah", "2026-10", [])
    expect(r.hasAirbnbData).toBe(false)
    expect(r.payoutIdr).toBe(0)
    expect(r.netToOwnerIdr).toBe(0)
  })

  it("matches expenses by property id or slug", () => {
    const list = [exp({ id: "1" }), exp({ id: "2", propertySlug: "x", propertyId: "versatile-house-jagakarsa" }), exp({ id: "3", propertySlug: "sky-house-tangerang", propertyId: "villa-2" })]
    expect(expensesForProperty(list, "versatile-house-jagakarsa", "villa-1").map((e) => e.id)).toEqual(["1", "2"])
  })

  it("offers a pool line only for the villa with a pool, and fixed-cost templates", () => {
    expect(operatingCostTemplate("versatile-house-jagakarsa").some((t) => t.name === "Perawatan kolam renang")).toBe(true)
    expect(operatingCostTemplate("sky-house-tangerang").some((t) => t.name === "Perawatan kolam renang")).toBe(false)
    expect(FIXED_COST_TEMPLATE.every((t) => t.category === "Fixed Cost")).toBe(true)
  })

  it("lists report months newest first up to the given month", () => {
    expect(reportMonths("versatile-house-jagakarsa", "2026-10").slice(0, 3)).toEqual(["2026-10", "2026-09", "2026-08"])
  })
})
