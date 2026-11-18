import { describe, it, expect } from "vitest"
import { calculateRevenue } from "@/lib/owner/revenue"

describe("owner revenue calculator", () => {
  it("263 nights x Rp 2,45 juta = Rp 644,35 juta gross (audit example)", () => {
    // 263 / 365 = 72.05% occupancy -> rounds back to exactly 263 nights
    const r = calculateRevenue({
      nightlyRateIdr: 2_450_000,
      selfOccupancyPercent: 50,
      managedOccupancyPercent: (263 / 365) * 100,
      feePercent: 18,
    })
    expect(r.managedNights).toBe(263)
    expect(r.managedGross).toBe(644_350_000)
  })

  it("every row reconciles: gross = nights x rate, net = gross - fee, lift = managed net - self net", () => {
    const r = calculateRevenue({
      nightlyRateIdr: 2_450_000,
      selfOccupancyPercent: 58,
      managedOccupancyPercent: 72,
      feePercent: 18,
    })
    expect(r.selfGross).toBe(r.selfNights * 2_450_000)
    expect(r.managedGross).toBe(r.managedNights * 2_450_000)
    expect(r.managedNet).toBe(r.managedGross - r.managedFee)
    expect(r.netLift).toBe(r.managedNet - r.selfNet)
    expect(r.steps.find((s) => s.key === "lift")?.value).toBe(r.netLift)
  })

  it("reports a negative lift instead of hiding it", () => {
    const r = calculateRevenue({
      nightlyRateIdr: 1_000_000,
      selfOccupancyPercent: 70,
      managedOccupancyPercent: 70,
      feePercent: 23,
    })
    expect(r.netLift).toBeLessThan(0)
  })

  it("is safe with invalid input", () => {
    const r = calculateRevenue({
      nightlyRateIdr: Number.NaN,
      selfOccupancyPercent: 500,
      managedOccupancyPercent: -5,
      feePercent: 18,
    })
    expect(r.managedGross).toBe(0)
    expect(r.selfNights).toBe(365)
  })
})
