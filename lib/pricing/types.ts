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

export interface AirbnbMonthPoint {
  month: string // YYYY-MM
  label: string // "Agu"
  paidIdr: number
  upcomingIdr: number
  totalIdr: number
}

/** Exact Airbnb payout figures the 60-day outlook is anchored to. */
export interface AirbnbRunRate {
  currency: "IDR" | "JPY"
  fxRateIdr: number | null // set when the export is not in IDR
  exportedAt: string
  listings: string[]
  months: AirbnbMonthPoint[] // whole export, converted to IDR
  runRateMonths: string[] // labels of the months averaged, e.g. ["Agu", "Sep", "Okt"]
  avgMonthlyIdr: number // average monthly total (paid + upcoming) of those months
  baselineHorizonIdr: number // avgMonthlyIdr scaled to the horizon
  lockedMonths: string[] // labels of future months whose confirmed bookings count
  lockedUpcomingIdr: number // Airbnb "Upcoming" for months after the current one, inside the horizon
  remainingToSellIdr: number // baseline still to be booked: max(0, baseline - locked)
}

export interface YieldOutlook {
  horizonDays: number
  bookedNights: number
  openNights: number
  /** Average dynamic price vs base price on the open nights (can be negative). */
  priceUpliftPercent: number
  /** Share of the price uplift assumed to turn into revenue (higher prices sell fewer nights). */
  realizationFactor: number
  airbnb: AirbnbRunRate | null // null when no Airbnb export exists for the property
  yieldLiftIdr: number | null
  yieldLiftPercent: number | null // yieldLiftIdr vs baselineHorizonIdr
  projectedHorizonIdr: number | null // locked + remaining + lift
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
  /** Sum of every recommended nightly rate in the horizon, as if all nights sold. Not a forecast. */
  projectedRevenueIdr: number
  /** projectedRevenueIdr minus base price x horizon nights. Not a forecast; see yieldOutlook. */
  potentialRevenueLiftIdr: number
  /** 60-day revenue outlook anchored to exact Airbnb payouts. */
  yieldOutlook: YieldOutlook
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
