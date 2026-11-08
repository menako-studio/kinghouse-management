import { describe, expect, it } from "vitest"
import { summarizePayouts } from "@/lib/earnings/case-study"
import { CASE_STUDIES } from "@/lib/marketing-data"

describe("data-backed case studies", () => {
  it("averages only paid months from the Airbnb export", () => {
    const s = summarizePayouts("versatile-house-jagakarsa")!
    expect(s.months).toEqual(["2026-07", "2026-08", "2026-09", "2026-10"])
    expect(s.averageIdr).toBe(Math.round((32195597 + 56158426 + 30074031 + 27914475) / 4))
    expect(s.best).toEqual({ month: "2026-08", idr: 56158426 })
  })

  it("converts JPY payouts to rupiah", () => {
    const s = summarizePayouts("sky-house-tangerang")!
    expect(s.best.idr).toBe(62680 * 105)
  })

  it("every case study has earnings data", () => {
    for (const cs of CASE_STUDIES) expect(summarizePayouts(cs.propertySlug)).not.toBeNull()
  })
})
