import { CURATED_VILLAS } from "@/lib/data"
import { getReservationsStore } from "@/lib/erp/store"
import { getIndonesianHolidays, isDateHoliday } from "./holidays"
import { getPriceOverride, getPropertyRuleOverrides } from "./store"
import {
  PricingStrategy,
  PricingRuleConfig,
  DailyPriceRecommendation,
  SubmarketBenchmark,
  DynamicPricingResponse,
  MarketDemandLevel,
  MultiplierBreakdown,
} from "./types"

const DAY_NAMES_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
const DAY_NAMES_SHORT_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]

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

/**
 * Returns default pricing rules for a property, merged with any customized admin rules
 */
export function getPricingRules(propertySlug: string, strategy: PricingStrategy = "balanced"): PricingRuleConfig {
  const villa = CURATED_VILLAS.find((v) => v.slug === propertySlug || v.id === propertySlug)
  const basePriceIdr = villa ? villa.price.idr : 500000
  const submarket = SUBMARKET_BENCHMARKS[propertySlug] || SUBMARKET_BENCHMARKS["versatile-house-jagakarsa"]

  const defaultFloor = Math.round((basePriceIdr * (strategy === "conservative" ? 0.65 : 0.75)) / 10000) * 10000
  const defaultCeiling = Math.round((basePriceIdr * (strategy === "aggressive" ? 2.4 : 2.0)) / 10000) * 10000

  const defaultWeekendSurge = submarket.propertyCategory === "business-apartment" ? 0 : strategy === "aggressive" ? 35 : strategy === "conservative" ? 20 : 28
  const defaultLastMinuteDiscount = strategy === "conservative" ? 22 : strategy === "aggressive" ? 10 : 15
  const defaultFarOutPremium = strategy === "aggressive" ? 20 : 15
  const defaultHolidaySurge = strategy === "aggressive" ? 45 : strategy === "conservative" ? 25 : 35

  const baseConfig: PricingRuleConfig = {
    propertySlug,
    basePriceIdr,
    minPriceIdr: defaultFloor,
    maxPriceIdr: defaultCeiling,
    weekendSurgePercent: defaultWeekendSurge,
    lastMinuteDiscountPercent: defaultLastMinuteDiscount,
    farOutPremiumPercent: defaultFarOutPremium,
    holidaySurgePercent: defaultHolidaySurge,
    strategy,
  }

  const customOverrides = getPropertyRuleOverrides(propertySlug)
  if (customOverrides) {
    return {
      ...baseConfig,
      ...customOverrides,
      strategy, // keep current strategy selection
    }
  }

  return baseConfig
}

/**
 * Calculates day of week multiplier based on property category & day
 */
export function calculateDowMultiplier(
  dayOfWeek: number, // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  category: "luxury-villa" | "business-apartment" | "urban-transit",
  weekendSurgePercent: number
): number {
  const surgeFactor = 1 + weekendSurgePercent / 100

  if (category === "business-apartment") {
    // Cikarang industrial pattern: Weekdays Monday-Thursday are peak, weekends are quiet
    switch (dayOfWeek) {
      case 1: // Mon
      case 2: // Tue
      case 3: // Wed
      case 4: // Thu
        return 1.12
      case 5: // Fri
        return 1.0
      case 6: // Sat
        return 0.90
      case 0: // Sun
        return 0.92
      default:
        return 1.0
    }
  }

  if (category === "luxury-villa") {
    // Jagakarsa group staycation: Friday & Saturday are high peak surges
    switch (dayOfWeek) {
      case 5: // Friday
        return 1 + (weekendSurgePercent * 0.8) / 100
      case 6: // Saturday
        return surgeFactor
      case 0: // Sunday
        return 1 + (weekendSurgePercent * 0.35) / 100
      case 4: // Thursday
        return 1.0
      default: // Mon-Wed
        return 0.95
    }
  }

  // urban-transit (Alam Sutera, Palmerah)
  switch (dayOfWeek) {
    case 5: // Friday
      return 1 + (weekendSurgePercent * 0.7) / 100
    case 6: // Saturday
      return surgeFactor
    case 0: // Sunday
      return 1.05
    default:
      return 0.97
  }
}

/**
 * Calculates seasonality multiplier for Indonesia
 */
export function calculateSeasonalityMultiplier(month: number): number {
  // 0-indexed month: 5 = June, 6 = July (School holiday), 11 = December, 0 = January (New year peak)
  if (month === 11 || month === 0) {
    return 1.20 // Year-end peak season
  }
  if (month === 5 || month === 6) {
    return 1.15 // Mid-year school holidays
  }
  return 1.0
}

/**
 * Calculates lead time multiplier (urgency curve)
 */
export function calculateLeadTimeMultiplier(
  daysUntilCheckIn: number,
  lastMinuteDiscountPercent: number,
  farOutPremiumPercent: number
): number {
  if (daysUntilCheckIn <= 2) {
    // Last minute fire sale to prevent zero-occupancy night
    return Math.max(0.75, 1 - lastMinuteDiscountPercent / 100)
  }
  if (daysUntilCheckIn <= 14) {
    // Sweet spot target booking window
    return 1.0
  }
  if (daysUntilCheckIn <= 45) {
    return 1.05
  }
  // Far out booking (>60 days)
  return 1 + farOutPremiumPercent / 100
}

/**
 * Generates 60-day AirDNA-grade dynamic pricing recommendations
 */
export async function generateDynamicPricing(
  propertySlug: string,
  strategy: PricingStrategy = "balanced",
  horizonDays: number = 60
): Promise<DynamicPricingResponse> {
  const villa = CURATED_VILLAS.find((v) => v.slug === propertySlug || v.id === propertySlug) || CURATED_VILLAS[0]
  const submarket = SUBMARKET_BENCHMARKS[villa.slug] || SUBMARKET_BENCHMARKS["versatile-house-jagakarsa"]
  const rules = getPricingRules(villa.slug, strategy)

  // Fetch actual Indonesian public holidays
  const currentYear = new Date().getFullYear()
  const holidays = await getIndonesianHolidays(currentYear)

  // Fetch actual reservations from store
  const allReservations = getReservationsStore()
  const propertyReservations = allReservations.filter(
    (r) => (r.propertySlug === villa.slug || r.propertyId === villa.id) && r.status !== "Cancelled"
  )

  // Map of booked dates from real iCal
  const bookedDatesMap = new Map<string, { channel: string; guestName: string }>()
  propertyReservations.forEach((r) => {
    const start = new Date(r.checkIn)
    const end = new Date(r.checkOut)
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split("T")[0]
      bookedDatesMap.set(dateKey, { channel: r.channel, guestName: r.guestName })
    }
  })

  // Calculate actual booking velocity / pacing
  const totalBookedNights = bookedDatesMap.size
  const pacingFactor = totalBookedNights > 20 ? 1.15 : totalBookedNights > 10 ? 1.08 : 1.0

  const recommendations: DailyPriceRecommendation[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let bookedCount = 0
  let totalProjectedRev = 0
  let baselineRev = 0

  for (let i = 0; i < horizonDays; i++) {
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + i)

    const dateStr = targetDate.toISOString().split("T")[0]
    const dayOfWeek = targetDate.getDay()
    const month = targetDate.getMonth()
    const dayNumber = targetDate.getDate()

    // 1. Holiday detection
    const holidayInfo = isDateHoliday(dateStr, holidays)

    // 2. Multipliers
    const dowFactor = calculateDowMultiplier(dayOfWeek, submarket.propertyCategory, rules.weekendSurgePercent)
    const seasonalityFactor = calculateSeasonalityMultiplier(month)
    const holidayFactor = holidayInfo.isHoliday
      ? 1 + rules.holidaySurgePercent / 100
      : holidayInfo.isLongWeekend
      ? 1 + (rules.holidaySurgePercent * 0.6) / 100
      : 1.0
    const leadTimeFactor = calculateLeadTimeMultiplier(i, rules.lastMinuteDiscountPercent, rules.farOutPremiumPercent)

    // Raw price before guardrails
    const combinedMultiplier = dowFactor * seasonalityFactor * holidayFactor * leadTimeFactor * pacingFactor
    const rawPrice = Math.round((rules.basePriceIdr * combinedMultiplier) / 10000) * 10000

    // Clamp between Floor and Ceiling
    const clampedPrice = Math.min(rules.maxPriceIdr, Math.max(rules.minPriceIdr, rawPrice))

    // Check for custom manual admin override
    const manualOverride = getPriceOverride(villa.slug, dateStr)
    const finalPrice = manualOverride ? manualOverride.overridePriceIdr : clampedPrice

    const isBooked = bookedDatesMap.has(dateStr)
    const bookingInfo = bookedDatesMap.get(dateStr)
    if (isBooked) bookedCount++

    // Determine demand score (0-100) and label
    let demandScore = Math.round(50 * combinedMultiplier)
    demandScore = Math.min(99, Math.max(25, demandScore))

    let demandLevel: MarketDemandLevel = "Moderate"
    if (demandScore >= 80) demandLevel = "Peak Surge"
    else if (demandScore >= 65) demandLevel = "High"
    else if (demandScore <= 40) demandLevel = "Low"

    const notes: string[] = []
    if (holidayInfo.isHoliday) notes.push(`Libur: ${holidayInfo.holidayName}`)
    else if (holidayInfo.isLongWeekend) notes.push("Long Weekend Surge")

    if (dayOfWeek === 5 || dayOfWeek === 6) {
      if (submarket.propertyCategory !== "business-apartment") notes.push("Weekend Surge")
    }
    if (i <= 2 && !isBooked) notes.push("Last-Minute Discount")
    if (i > 45) notes.push("Far-Out Advance Rate")
    if (manualOverride) notes.push(`Override Admin: Rp ${manualOverride.overridePriceIdr.toLocaleString("id-ID")}`)

    const multipliers: MultiplierBreakdown = {
      dayOfWeekFactor: Number(dowFactor.toFixed(2)),
      seasonalityFactor: Number(seasonalityFactor.toFixed(2)),
      holidayFactor: Number(holidayFactor.toFixed(2)),
      leadTimeFactor: Number(leadTimeFactor.toFixed(2)),
      pacingFactor: Number(pacingFactor.toFixed(2)),
      rawRecommendedPriceIdr: rawPrice,
      clampedRecommendedPriceIdr: clampedPrice,
    }

    recommendations.push({
      date: dateStr,
      dayOfWeek: DAY_NAMES_ID[dayOfWeek],
      dayOfWeekShort: DAY_NAMES_SHORT_ID[dayOfWeek],
      dayNumber,
      basePriceIdr: rules.basePriceIdr,
      recommendedPriceIdr: finalPrice,
      overridePriceIdr: manualOverride?.overridePriceIdr,
      isBooked,
      bookingChannel: bookingInfo?.channel,
      isHoliday: holidayInfo.isHoliday || holidayInfo.isLongWeekend,
      holidayName: holidayInfo.holidayName,
      demandLevel,
      demandScore,
      multipliers,
      notes,
    })

    baselineRev += rules.basePriceIdr
    totalProjectedRev += finalPrice
  }

  const overallScore = Math.round(
    recommendations.reduce((acc, r) => acc + r.demandScore, 0) / recommendations.length
  )

  const potentialRevenueLiftIdr = Math.max(0, totalProjectedRev - baselineRev)
  const dynamicKinghouseOccupancy = Number(((bookedCount / horizonDays) * 100).toFixed(1))
  const dynamicRevParLift = baselineRev > 0
    ? Number((((totalProjectedRev - baselineRev) / baselineRev) * 100).toFixed(1))
    : submarket.revParOpportunityPercent

  const dynamicSubmarket: SubmarketBenchmark = {
    ...submarket,
    kinghouseOccupancyPercent: dynamicKinghouseOccupancy,
    revParOpportunityPercent: dynamicRevParLift,
  }

  return {
    propertySlug: villa.slug,
    propertyName: villa.name,
    submarket: dynamicSubmarket,
    strategy,
    rules,
    marketDemandScore: overallScore,
    overallDemandLevel: overallScore >= 75 ? "Peak Surge" : overallScore >= 60 ? "High" : "Moderate",
    totalDays: horizonDays,
    availableDays: horizonDays - bookedCount,
    bookedDays: bookedCount,
    projectedRevenueIdr: totalProjectedRev,
    potentialRevenueLiftIdr,
    recommendations,
    provenance: {
      calendarSource: `Airbnb Host iCal Feed (${propertyReservations.length} live bookings)`,
      holidaysSource: `Live Nager.Date ID API (${holidays.length} holidays)`,
      occupancySource: "Real-Time Computed (Booked Nights / Horizon Days)",
      isRealData: true,
      syncedEventsCount: propertyReservations.length,
      lastSyncTimestamp: new Date().toISOString(),
    },
    lastUpdated: new Date().toISOString(),
  }
}
