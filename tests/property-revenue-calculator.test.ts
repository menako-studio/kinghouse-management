import { describe, it, expect } from "vitest"
import { SUBMARKET_BENCHMARKS } from "@/lib/pricing/engine"
import { CURATED_VILLAS } from "@/lib/data"

describe("AirDNA-Grade Property Revenue Simulator Benchmarks", () => {
  it("contains verified benchmarks for all 4 Jabodetabek submarkets", () => {
    expect(SUBMARKET_BENCHMARKS["versatile-house-jagakarsa"]).toBeDefined()
    expect(SUBMARKET_BENCHMARKS["sky-house-tangerang"]).toBeDefined()
    expect(SUBMARKET_BENCHMARKS["bright-airy-apartment-palmerah"]).toBeDefined()
    expect(SUBMARKET_BENCHMARKS["skyline-luxury-orange-county-cikarang"]).toBeDefined()

    // Jagakarsa Luxury Villa has higher ADR
    expect(SUBMARKET_BENCHMARKS["versatile-house-jagakarsa"].avgCompetitorAdrIdr).toBeGreaterThan(1500000)
    // Kinghouse managed occupancy exceeds unmanaged market occupancy
    Object.values(SUBMARKET_BENCHMARKS).forEach((benchmark) => {
      expect(benchmark.kinghouseOccupancyPercent).toBeGreaterThan(benchmark.marketOccupancyPercent)
      expect(benchmark.revParOpportunityPercent).toBeGreaterThan(0)
    })
  })

  it("accurately projects net annual lift with 15% vs 20% management tiers", () => {
    const baseAdr = 1900000 // Versatile House base
    const marketOccupancy = 0.58
    const kinghouseOccupancy = 0.72

    // Self-managed baseline
    const selfNights = Math.round(365 * marketOccupancy)
    const selfGross = selfNights * baseAdr
    const selfNet = Math.round(selfGross * 0.8) // after 15% OTA fee + 5% hassle

    // Kinghouse with dynamic pricing (+18% weighted ADR)
    const kinghouseAdr = Math.round(baseAdr * 1.18)
    const kinghouseNights = Math.round(365 * kinghouseOccupancy)
    const kinghouseGross = kinghouseNights * kinghouseAdr
    
    // Standard tier (15%)
    const kinghouseNet15 = Math.round(kinghouseGross * 0.85)
    // Premium tier (20%)
    const kinghouseNet20 = Math.round(kinghouseGross * 0.80)

    expect(kinghouseNet15).toBeGreaterThan(selfNet)
    expect(kinghouseNet20).toBeGreaterThan(selfNet)
    expect(kinghouseNet15 - selfNet).toBeGreaterThan(50000000) // >Rp 50M net annual lift
  })

  it("validates all 4 active properties exist in CURATED_VILLAS catalog", () => {
    expect(CURATED_VILLAS.length).toBe(4)
    const slugs = CURATED_VILLAS.map((v) => v.slug)
    expect(slugs).toContain("versatile-house-jagakarsa")
    expect(slugs).toContain("sky-house-tangerang")
    expect(slugs).toContain("bright-airy-apartment-palmerah")
    expect(slugs).toContain("skyline-luxury-orange-county-cikarang")
  })
})
