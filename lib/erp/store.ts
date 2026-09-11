import { Reservation, ExpenseRecord } from "./types"

// Global in-memory cache across server requests
// Persists in Node.js runtime environment
declare global {
  var __kinghouse_reservations_store: Reservation[] | undefined
  var __kinghouse_expenses_store: ExpenseRecord[] | undefined
}

export function getReservationsStore(): Reservation[] {
  if (!globalThis.__kinghouse_reservations_store) {
    globalThis.__kinghouse_reservations_store = []
  }
  return globalThis.__kinghouse_reservations_store
}

export function setReservationsStore(records: Reservation[]): void {
  globalThis.__kinghouse_reservations_store = [...records]
}

export function upsertReservationsToStore(records: Reservation[]): void {
  const current = getReservationsStore()
  const map = new Map<string, Reservation>()
  current.forEach((r) => map.set(r.id, r))
  records.forEach((r) => map.set(r.id, r))
  globalThis.__kinghouse_reservations_store = Array.from(map.values())
}

export function deleteReservationFromStore(id: string): boolean {
  const current = getReservationsStore()
  const index = current.findIndex((r) => r.id === id)
  if (index !== -1) {
    current.splice(index, 1)
    return true
  }
  return false
}

export function getExpensesStore(): ExpenseRecord[] {
  if (!globalThis.__kinghouse_expenses_store) {
    globalThis.__kinghouse_expenses_store = []
  }
  return globalThis.__kinghouse_expenses_store
}

export function setExpensesStore(records: ExpenseRecord[]): void {
  globalThis.__kinghouse_expenses_store = [...records]
}

export function addExpenseToStore(record: ExpenseRecord): void {
  const current = getExpensesStore()
  current.unshift(record)
}

export function deleteExpenseFromStore(id: string): boolean {
  const current = getExpensesStore()
  const index = current.findIndex((e) => e.id === id)
  if (index !== -1) {
    current.splice(index, 1)
    return true
  }
  return false
}
