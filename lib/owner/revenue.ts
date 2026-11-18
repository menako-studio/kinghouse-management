// Owner revenue projection — one pure function, one nightly rate in every row.
//
// Why a single rate: the old calculator used the base rate for the self-managed
// column and a marked-up rate (+18% dynamic pricing, amenity premiums) for the
// Kinghouse column, so gross, fee and "surplus" did not reconcile against
// nights x rate. Now gross is always nights x rate, and the only thing that
// differs between the two scenarios is the occupancy (and the management fee).

export interface RevenueInput {
  /** Nightly rate in IDR, applied to BOTH scenarios. */
  nightlyRateIdr: number
  /** Occupancy when the owner runs the unit alone, 0-100. */
  selfOccupancyPercent: number
  /** Occupancy with Kinghouse management, 0-100. */
  managedOccupancyPercent: number
  /** Kinghouse management fee as % of gross, 0-100. */
  feePercent: number
  /** Share of self-managed gross lost to OTA fee + own cleaning/linen, 0-100. */
  selfCostPercent?: number
}

export interface RevenueStep {
  /** Stable key, used for i18n labels and tests. */
  key: "selfNights" | "selfGross" | "selfNet" | "managedNights" | "managedGross" | "managedFee" | "managedNet" | "lift"
  value: number
}

export interface RevenueResult {
  nightlyRateIdr: number
  selfNights: number
  selfGross: number
  selfCostPercent: number
  selfNet: number
  managedNights: number
  managedGross: number
  feePercent: number
  managedFee: number
  managedNet: number
  /** managedNet - selfNet; negative when management does not pay for itself. */
  netLift: number
  netLiftPercent: number
  managedNetMonthly: number
  netLiftMonthly: number
  steps: RevenueStep[]
}

const DAYS_PER_YEAR = 365
/** OTA platform fee (~15%) plus own cleaning/linen effort (~5%). */
export const DEFAULT_SELF_COST_PERCENT = 20

const clampPercent = (n: number) => Math.min(100, Math.max(0, Number.isFinite(n) ? n : 0))

export function calculateRevenue(input: RevenueInput): RevenueResult {
  const rate = Math.max(0, Math.round(Number.isFinite(input.nightlyRateIdr) ? input.nightlyRateIdr : 0))
  const selfCostPercent = clampPercent(input.selfCostPercent ?? DEFAULT_SELF_COST_PERCENT)
  const feePercent = clampPercent(input.feePercent)

  const selfNights = Math.round((DAYS_PER_YEAR * clampPercent(input.selfOccupancyPercent)) / 100)
  const selfGross = selfNights * rate
  const selfNet = Math.round(selfGross * (1 - selfCostPercent / 100))

  const managedNights = Math.round((DAYS_PER_YEAR * clampPercent(input.managedOccupancyPercent)) / 100)
  const managedGross = managedNights * rate
  const managedFee = Math.round((managedGross * feePercent) / 100)
  const managedNet = managedGross - managedFee

  const netLift = managedNet - selfNet
  const netLiftPercent = selfNet > 0 ? Math.round((netLift / selfNet) * 100) : 0

  return {
    nightlyRateIdr: rate,
    selfNights,
    selfGross,
    selfCostPercent,
    selfNet,
    managedNights,
    managedGross,
    feePercent,
    managedFee,
    managedNet,
    netLift,
    netLiftPercent,
    managedNetMonthly: Math.round(managedNet / 12),
    netLiftMonthly: Math.round(netLift / 12),
    steps: [
      { key: "selfNights", value: selfNights },
      { key: "selfGross", value: selfGross },
      { key: "selfNet", value: selfNet },
      { key: "managedNights", value: managedNights },
      { key: "managedGross", value: managedGross },
      { key: "managedFee", value: managedFee },
      { key: "managedNet", value: managedNet },
      { key: "lift", value: netLift },
    ],
  }
}
