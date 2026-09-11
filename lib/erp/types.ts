export type ChannelType = "Airbnb" | "Direct WhatsApp" | "Booking.com" | "Agoda" | "Walk-in"

export type ReservationStatus = "Confirmed" | "Checked-in Ready" | "Active Stay" | "Completed" | "Cancelled" | "Blocked"

export type FeeTier = "standard" | "premium" // standard: 15%, premium: 20%

export interface Reservation {
  id: string
  propertyId: string
  propertySlug: string
  propertyName: string
  guestName: string
  guestPhone?: string
  guestEmail?: string
  channel: ChannelType
  checkIn: string // YYYY-MM-DD
  checkOut: string // YYYY-MM-DD
  nights: number
  guests: number
  grossPayoutIdr: number
  cleaningFeeIdr: number
  feeTier: FeeTier
  managementFeePercent: number // 15 or 20
  managementFeeIdr: number
  netOwnerPayoutIdr: number
  status: ReservationStatus
  notes?: string
  createdAt: string
}

export type ExpenseCategory = 
  | "PLN & Utilities"
  | "Linen & Laundry"
  | "Guest Amenities"
  | "Maintenance & Repairs"
  | "Staff & Housekeeping"
  | "Marketing & OTAs"

export interface ExpenseRecord {
  id: string
  propertyId: string
  propertySlug: string
  propertyName: string
  category: ExpenseCategory
  description: string
  amountIdr: number
  date: string // YYYY-MM-DD
  recordedBy: string
  receiptUrl?: string
  vendorName?: string
}

export interface OwnerStatement {
  statementId: string
  periodMonthYear: string // e.g., "August 2026"
  propertyId: string
  propertyName: string
  propertyArea: string
  ownerName: string
  grossRevenueIdr: number
  totalCleaningFeeIdr: number
  managementFeePercent: number
  totalManagementFeeIdr: number
  totalExpensesIdr: number
  netRemittanceToOwnerIdr: number
  totalNightsBooked: number
  occupancyRatePercent: number
  reservationsCount: number
  generatedAt: string
}
