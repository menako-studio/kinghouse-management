import { describe, it, expect } from "vitest"
import { MANAGEMENT_FEES } from "@/lib/constants"
import { PLAN_COMPARISON_ROWS, hasComparableTerms, visiblePlanRows, type PlanRow } from "@/lib/owner/plan-comparison"

const empty = { "hk-on-demand": null, "co-hosting": null, "full-management": null }

describe("plan comparison", () => {
  it("fee row reads from MANAGEMENT_FEES (single source)", () => {
    const fee = PLAN_COMPARISON_ROWS.find((r) => r.key === "fee")!
    expect(fee.cells["full-management"]!.en).toContain(`${MANAGEMENT_FEES.apartmentPercent}%`)
    expect(fee.cells["full-management"]!.en).toContain(`${MANAGEMENT_FEES.villaMaxPercent}%`)
  })

  it("hides unconfirmed rows and the whole table until terms exist", () => {
    expect(hasComparableTerms()).toBe(false)
    const rows: PlanRow[] = [
      PLAN_COMPARISON_ROWS[0],
      { key: "minContract", label: { en: "x", id: "x" }, cells: { ...empty, "full-management": { en: "12 months", id: "12 bulan" } } },
      { key: "deposit", label: { en: "d", id: "d" }, cells: empty },
    ]
    expect(visiblePlanRows(rows).map((r) => r.key)).toEqual(["fee", "minContract"])
    expect(hasComparableTerms(rows)).toBe(true)
  })
})
