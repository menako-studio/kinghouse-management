// Submarket benchmarks, separate from ./engine so the client revenue calculator
// does not bundle the villa catalogue and reservation store the engine needs.
import type { SubmarketBenchmark } from "./types"

export const SUBMARKET_BENCHMARKS: Record<string, SubmarketBenchmark> = {
  "versatile-house-jagakarsa": {
    submarketName: "Jagakarsa & Cilandak Luxury Group Stay",
    areaSlug: "jagakarsa",
    propertyCategory: "luxury-villa",
    avgCompetitorAdrIdr: 2450000,
    marketOccupancyPercent: 58,
    kinghouseOccupancyPercent: 72,
    revParOpportunityPercent: 28.4,
    activeCompetitorsCount: 14,
    marketPaceDescription: "Tinggi di akhir pekan & event keluarga (Jumat-Minggu surge +35%)",
  },
  "sky-house-tangerang": {
    submarketName: "Alam Sutera & Pinang Urban Transit",
    areaSlug: "pinang",
    propertyCategory: "urban-transit",
    avgCompetitorAdrIdr: 320000,
    marketOccupancyPercent: 64,
    kinghouseOccupancyPercent: 78,
    revParOpportunityPercent: 19.6,
    activeCompetitorsCount: 38,
    marketPaceDescription: "Stabil dengan lonjakan last-minute transit shoppers IKEA / BINUS",
  },
  "bright-airy-apartment-palmerah": {
    submarketName: "Palmerah & Slipi Central Jakarta West",
    areaSlug: "palmerah",
    propertyCategory: "urban-transit",
    avgCompetitorAdrIdr: 310000,
    marketOccupancyPercent: 61,
    kinghouseOccupancyPercent: 74,
    revParOpportunityPercent: 22.0,
    activeCompetitorsCount: 26,
    marketPaceDescription: "Permintaan konsisten mid-week & weekend urban staycation",
  },
  "skyline-luxury-orange-county-cikarang": {
    submarketName: "Cikarang Expat & Industrial Township",
    areaSlug: "cikarang",
    propertyCategory: "business-apartment",
    avgCompetitorAdrIdr: 480000,
    marketOccupancyPercent: 69,
    kinghouseOccupancyPercent: 82,
    revParOpportunityPercent: 24.8,
    activeCompetitorsCount: 22,
    marketPaceDescription: "Permintaan dominan Senin-Kamis (Expat & Industrial Engineers MM2100/EJIP)",
  },
}
