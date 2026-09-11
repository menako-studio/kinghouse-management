export type PricingStrategy = "conservative" | "balanced" | "aggressive"

export type MarketDemandLevel = "Low" | "Moderate" | "High" | "Peak Surge"

export interface PricingRuleConfig {
  propertySlug: string
  basePriceIdr: number
  minPriceIdr: number // Floor price
  maxPriceIdr: number // Ceiling price
  weekendSurgePercent: number // e.g. 25%
  lastMinuteDiscountPercent: number // e.g. 15% (for 0-2 days out)
  farOutPremiumPercent: number // e.g. 15% (for >60 days out)
  holidaySurgePercent: number // e.g. 35%
  strategy: PricingStrategy
}

export interface MultiplierBreakdown {
  dayOfWeekFactor: number // e.g. 1.25 for Saturday
  seasonalityFactor: number // e.g. 1.15 for peak month
  holidayFactor: number // e.g. 1.35 for national holiday
  leadTimeFactor: number // e.g. 0.85 for last-minute or 1.15 for far-out
  pacingFactor: number // e.g. 1.10 if high occupancy velocity
  rawRecommendedPriceIdr: number
  clampedRecommendedPriceIdr: number
}

export interface DailyPriceRecommendation {
  date: string // YYYY-MM-DD
  dayOfWeek: string // e.g. "Jumat", "Sabtu"
  dayOfWeekShort: string // e.g. "Jum", "Sab"
  dayNumber: number // 1-31
  basePriceIdr: number
  recommendedPriceIdr: number
  overridePriceIdr?: number
  isBooked: boolean
  bookingChannel?: string
  isHoliday: boolean
  holidayName?: string
  demandLevel: MarketDemandLevel
  demandScore: number // 0 - 100
  multipliers: MultiplierBreakdown
  notes: string[]
}

export interface SubmarketBenchmark {
  submarketName: string
  areaSlug: string
  propertyCategory: "luxury-villa" | "business-apartment" | "urban-transit"
  avgCompetitorAdrIdr: number
  marketOccupancyPercent: number
  kinghouseOccupancyPercent: number
  revParOpportunityPercent: number // Estimated % revenue lift
  activeCompetitorsCount: number
  marketPaceDescription: string
}

export interface DataSourceProvenance {
  calendarSource: string
  holidaysSource: string
  occupancySource: string
  isRealData: boolean
  syncedEventsCount: number
  lastSyncTimestamp: string
}

export interface DynamicPricingResponse {
  propertySlug: string
  propertyName: string
  submarket: SubmarketBenchmark
  strategy: PricingStrategy
  rules: PricingRuleConfig
  marketDemandScore: number // Overall 0 - 100
  overallDemandLevel: MarketDemandLevel
  totalDays: number
  availableDays: number
  bookedDays: number
  projectedRevenueIdr: number
  potentialRevenueLiftIdr: number
  recommendations: DailyPriceRecommendation[]
  provenance: DataSourceProvenance
  lastUpdated: string
}

export interface DatePriceOverride {
  date: string // YYYY-MM-DD
  propertySlug: string
  overridePriceIdr: number
  reason?: string
  updatedAt: string
}
