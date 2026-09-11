import { Reservation, ExpenseRecord } from "./types"

/**
 * Clean initial data containers.
 * All dummy records have been removed.
 * Actual data is dynamically fetched from real Airbnb iCal feeds or recorded live in the ERP.
 */
export const INITIAL_RESERVATIONS: Reservation[] = []

export const INITIAL_EXPENSES: ExpenseRecord[] = []
