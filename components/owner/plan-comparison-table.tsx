"use client"

import { useLocalization } from "@/lib/context/localization-context"
import {
  PLAN_IDS,
  hasComparableTerms,
  visiblePlanRows,
  type PlanId,
} from "@/lib/owner/plan-comparison"

const PLAN_NAMES: Record<PlanId, string> = {
  "hk-on-demand": "HK on Demand",
  "co-hosting": "Co-Hosting",
  "full-management": "Full Management",
}

/**
 * Side-by-side comparison of the three owner packages. Renders nothing until
 * Kinghouse has confirmed at least one term besides the fee (see
 * lib/owner/plan-comparison.ts).
 */
export function PlanComparisonTable() {
  const { language } = useLocalization()
  const isId = language === "ID"
  if (!hasComparableTerms()) return null
  const rows = visiblePlanRows()

  return (
    <section id="plan-comparison" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 lg:px-12">
        <h2 className="text-center font-serif text-3xl text-[#222222] sm:text-4xl">
          {isId ? "Bandingkan paket" : "Compare the packages"}
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-[#EBEBEB]">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm sm:text-base">
            <caption className="sr-only">{isId ? "Perbandingan paket pengelolaan" : "Management package comparison"}</caption>
            <thead className="bg-[#FAFAFA]">
              <tr>
                <th scope="col" className="p-4 font-semibold text-[#5C5347]" />
                {PLAN_IDS.map((id) => (
                  <th key={id} scope="col" className="p-4 font-serif text-lg text-[#222222]">
                    {PLAN_NAMES[id]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key} className="border-t border-[#EBEBEB] align-top">
                  <th scope="row" className="p-4 font-semibold text-[#222222]">
                    {isId ? row.label.id : row.label.en}
                  </th>
                  {PLAN_IDS.map((id) => {
                    const cell = row.cells[id]
                    return (
                      <td key={id} className="p-4 text-[#444444]">
                        {cell ? (isId ? cell.id : cell.en) : isId ? "Disepakati per properti" : "Agreed per property"}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
