import { Reservation, ExpenseRecord, OwnerStatement, FeeTier } from "./types"

/** Calendar blocks and cancelled bookings never count toward revenue, nights or guests. */
export function isCountedBooking(r: { status: string }): boolean {
  return r.status !== "Blocked" && r.status !== "Cancelled"
}

/**
 * Calculates management fee and net owner payout for a single reservation.
 * Standard tier = 15%, Premium tier = 20%
 * Cleaning fee is credited 100% to operations (exempt from owner commission split)
 */
export function calculateReservationPayout(
  grossPayoutIdr: number,
  cleaningFeeIdr: number = 0,
  feeTier: FeeTier = "standard"
): {
  managementFeePercent: number
  managementFeeIdr: number
  netOwnerPayoutIdr: number
} {
  const managementFeePercent = feeTier === "premium" ? 20 : 15
  
  // Accommodation revenue excluding cleaning fee
  const accommodationRevenue = Math.max(0, grossPayoutIdr - cleaningFeeIdr)
  const managementFeeIdr = Math.round((accommodationRevenue * managementFeePercent) / 100)
  const netOwnerPayoutIdr = Math.max(0, grossPayoutIdr - managementFeeIdr - cleaningFeeIdr)

  return {
    managementFeePercent,
    managementFeeIdr,
    netOwnerPayoutIdr,
  }
}

/**
 * Generates an aggregated Owner Statement for a specific property over a billing period.
 */
export function generateOwnerStatement(
  propertyId: string,
  propertyName: string,
  propertyArea: string,
  ownerName: string,
  periodMonthYear: string,
  reservations: Reservation[],
  expenses: ExpenseRecord[],
  feeTier: FeeTier = "standard",
  daysInMonth: number = 31
): OwnerStatement {
  const propertyReservations = reservations.filter(
    (r) => r.propertyId === propertyId && r.status !== "Cancelled"
  )
  const propertyExpenses = expenses.filter((e) => e.propertyId === propertyId)

  const grossRevenueIdr = propertyReservations.reduce((sum, r) => sum + r.grossPayoutIdr, 0)
  const totalCleaningFeeIdr = propertyReservations.reduce((sum, r) => sum + r.cleaningFeeIdr, 0)
  const totalManagementFeeIdr = propertyReservations.reduce((sum, r) => sum + r.managementFeeIdr, 0)
  const totalExpensesIdr = propertyExpenses.reduce((sum, e) => sum + e.amountIdr, 0)
  
  const totalNightsBooked = propertyReservations.reduce((sum, r) => sum + r.nights, 0)
  const occupancyRatePercent = Math.min(100, Number(((totalNightsBooked / daysInMonth) * 100).toFixed(1)))

  // Net Remittance = (Gross - Cleaning - Management Fee) - Property Specific Expenses
  const netRemittanceToOwnerIdr = Math.max(
    0,
    grossRevenueIdr - totalCleaningFeeIdr - totalManagementFeeIdr - totalExpensesIdr
  )

  return {
    statementId: `STMT-${propertyId.toUpperCase()}-${periodMonthYear.replace(/\s+/g, "-").toUpperCase()}`,
    periodMonthYear,
    propertyId,
    propertyName,
    propertyArea,
    ownerName,
    grossRevenueIdr,
    totalCleaningFeeIdr,
    managementFeePercent: feeTier === "premium" ? 20 : 15,
    totalManagementFeeIdr,
    totalExpensesIdr,
    netRemittanceToOwnerIdr,
    totalNightsBooked,
    occupancyRatePercent,
    reservationsCount: propertyReservations.length,
    generatedAt: new Date().toISOString(),
  }
}

/**
 * Calculates Average Daily Rate (ADR)
 */
export function calculateADR(grossRevenueIdr: number, totalNightsBooked: number): number {
  if (totalNightsBooked <= 0) return 0
  return Math.round(grossRevenueIdr / totalNightsBooked)
}

/**
 * Calculates Revenue Per Available Room (RevPAR)
 */
export function calculateRevPAR(grossRevenueIdr: number, totalAvailableNights: number): number {
  if (totalAvailableNights <= 0) return 0
  return Math.round(grossRevenueIdr / totalAvailableNights)
}
