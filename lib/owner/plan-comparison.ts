// Plan comparison table data — the single place to fill in the commercial terms.
//
// The fee row is derived from MANAGEMENT_FEES. The other rows are commercial
// facts only Kinghouse can state (minimum contract, deposit, who pays for
// damage...). Leave a cell as `null` until the terms are confirmed: a row with
// no filled cell is not shown, and a null cell inside a shown row reads
// "Agreed per property". Never put a guess here.

import { MANAGEMENT_FEES } from "@/lib/constants"

export const PLAN_IDS = ["hk-on-demand", "co-hosting", "full-management"] as const
export type PlanId = (typeof PLAN_IDS)[number]

export interface LocalizedText {
  en: string
  id: string
}

export type PlanCell = LocalizedText | null

export interface PlanRow {
  key: "fee" | "setup" | "minContract" | "exit" | "deposit" | "damage"
  label: LocalizedText
  cells: Record<PlanId, PlanCell>
}

const feeText = (en: string, id: string): LocalizedText => ({ en, id })

export const PLAN_COMPARISON_ROWS: PlanRow[] = [
  {
    key: "fee",
    label: { en: "Fee", id: "Fee" },
    cells: {
      "hk-on-demand": feeText("Quoted per property", "Dihitung per properti"),
      "co-hosting": feeText("On request", "Sesuai permintaan"),
      "full-management": feeText(
        `${MANAGEMENT_FEES.apartmentPercent}% apartments · ${MANAGEMENT_FEES.villaMinPercent}–${MANAGEMENT_FEES.villaMaxPercent}% villas (${MANAGEMENT_FEES.villaMinBedrooms}+ bedrooms)`,
        `${MANAGEMENT_FEES.apartmentPercent}% apartemen · ${MANAGEMENT_FEES.villaMinPercent}–${MANAGEMENT_FEES.villaMaxPercent}% villa (${MANAGEMENT_FEES.villaMinBedrooms}+ kamar)`
      ),
    },
  },
  { key: "setup", label: { en: "Set-up cost", id: "Biaya awal" }, cells: { "hk-on-demand": null, "co-hosting": null, "full-management": null } },
  { key: "minContract", label: { en: "Minimum contract", id: "Durasi kontrak minimum" }, cells: { "hk-on-demand": null, "co-hosting": null, "full-management": null } },
  { key: "exit", label: { en: "How to exit", id: "Cara keluar" }, cells: { "hk-on-demand": null, "co-hosting": null, "full-management": null } },
  { key: "deposit", label: { en: "Deposit", id: "Deposit" }, cells: { "hk-on-demand": null, "co-hosting": null, "full-management": null } },
  { key: "damage", label: { en: "Who covers guest damage", id: "Siapa menanggung kerusakan tamu" }, cells: { "hk-on-demand": null, "co-hosting": null, "full-management": null } },
]

/** Rows to show publicly: the fee row plus any row with at least one confirmed cell. */
export function visiblePlanRows(rows: PlanRow[] = PLAN_COMPARISON_ROWS): PlanRow[] {
  return rows.filter((row) => row.key === "fee" || PLAN_IDS.some((id) => row.cells[id] !== null))
}

/** The table only earns its place once there is more than the fee row. */
export function hasComparableTerms(rows: PlanRow[] = PLAN_COMPARISON_ROWS): boolean {
  return visiblePlanRows(rows).length > 1
}
