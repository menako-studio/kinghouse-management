import { Reservation } from "./types"
import { getReservationsStore } from "./store"
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { syncAllConfiguredProperties, getLastIcalSyncSummary, IcalSyncSummary } from "@/lib/ical/sync"

const SUPABASE_TIMEOUT_MS = 5000
const DAY_MS = 24 * 60 * 60 * 1000

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapReservationRow(row: any): Reservation {
  return {
    id: row.id,
    propertyId: row.property_id,
    propertySlug: row.property_slug,
    propertyName: row.property_name,
    guestName: row.guest_name,
    guestPhone: row.guest_phone || undefined,
    guestEmail: row.guest_email || undefined,
    channel: row.channel,
    checkIn: typeof row.check_in === "string" ? row.check_in.split("T")[0] : row.check_in,
    checkOut: typeof row.check_out === "string" ? row.check_out.split("T")[0] : row.check_out,
    nights: Number(row.nights),
    guests: Number(row.guests),
    grossPayoutIdr: Number(row.gross_payout_idr),
    cleaningFeeIdr: Number(row.cleaning_fee_idr),
    feeTier: row.fee_tier,
    managementFeePercent: Number(row.management_fee_percent),
    managementFeeIdr: Number(row.management_fee_idr),
    netOwnerPayoutIdr: Number(row.net_owner_payout_idr),
    status: row.status,
    notes: row.notes || undefined,
    createdAt: row.created_at,
  }
}

export type ReservationSource = "supabase" | "ical-sync" | "memory" | "none"

export interface DashboardDataResult {
  reservations: Reservation[]
  source: ReservationSource
  supabaseConfigured: boolean
  supabaseError?: string
  sync?: IcalSyncSummary
}

/**
 * Loads reservations for the CMS dashboard: Supabase first, then the in-memory
 * store, and finally a live pull of the Airbnb/Agoda iCal feeds. Every failure
 * is captured (not swallowed) so the dashboard can explain an empty state.
 */
export async function loadDashboardReservations(): Promise<DashboardDataResult> {
  let supabaseError: string | undefined
  const supabase = getSupabaseServerClient()

  if (supabase) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), SUPABASE_TIMEOUT_MS)
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .abortSignal(controller.signal)
      if (error) {
        supabaseError = error.message
      } else if (data && data.length > 0) {
        return {
          reservations: data.map(mapReservationRow),
          source: "supabase",
          supabaseConfigured: true,
          sync: getLastIcalSyncSummary(),
        }
      }
    } catch (err) {
      supabaseError =
        err instanceof Error && err.name === "AbortError"
          ? `Supabase tidak merespons dalam ${SUPABASE_TIMEOUT_MS / 1000} detik`
          : err instanceof Error
          ? err.message
          : "unknown error"
    } finally {
      clearTimeout(timeoutId)
    }
  }

  const stored = getReservationsStore()
  if (stored.length > 0) {
    return {
      reservations: stored,
      source: "memory",
      supabaseConfigured: isSupabaseConfigured,
      supabaseError,
      sync: getLastIcalSyncSummary(),
    }
  }

  let sync: IcalSyncSummary | undefined
  try {
    sync = await syncAllConfiguredProperties()
  } catch (err) {
    console.warn("[dashboard] iCal sync failed:", err)
  }
  const synced = getReservationsStore()

  return {
    reservations: synced,
    source: synced.length > 0 ? "ical-sync" : "none",
    supabaseConfigured: isSupabaseConfigured,
    supabaseError,
    sync,
  }
}

function toUtcDay(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number)
  return Date.UTC(y, (m || 1) - 1, d || 1)
}

/** Number of nights of [checkIn, checkOut) that fall inside [windowStart, windowEnd). */
export function nightsInWindow(checkIn: string, checkOut: string, windowStart: number, windowEnd: number): number {
  const start = Math.max(toUtcDay(checkIn), windowStart)
  const end = Math.min(toUtcDay(checkOut), windowEnd)
  return end > start ? Math.round((end - start) / DAY_MS) : 0
}

export interface DashboardMetrics {
  confirmedCount: number
  grossRevenueIdr: number
  totalGuests: number
  /** Booked nights in the 30-day window starting today. */
  windowNightsBooked: number
  windowAvailableNights: number
  occupancyPercent: number
  upcomingCount: number
}

const EXCLUDED_STATUSES = new Set(["Blocked", "Cancelled"])

export function computeDashboardMetrics(
  reservations: Reservation[],
  unitCount: number,
  today: Date = new Date(),
  windowDays = 30
): DashboardMetrics {
  const bookings = reservations.filter((r) => !EXCLUDED_STATUSES.has(r.status))
  const windowStart = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  const windowEnd = windowStart + windowDays * DAY_MS

  const windowNightsBooked = bookings.reduce(
    (sum, r) => sum + nightsInWindow(r.checkIn, r.checkOut, windowStart, windowEnd),
    0
  )
  const windowAvailableNights = unitCount * windowDays

  return {
    confirmedCount: bookings.length,
    grossRevenueIdr: bookings.reduce((sum, r) => sum + (r.grossPayoutIdr || 0), 0),
    totalGuests: bookings.reduce((sum, r) => sum + (r.guests || 0), 0),
    windowNightsBooked,
    windowAvailableNights,
    occupancyPercent:
      windowAvailableNights > 0
        ? Math.min(100, Math.round((windowNightsBooked / windowAvailableNights) * 100))
        : 0,
    upcomingCount: bookings.filter((r) => toUtcDay(r.checkOut) > windowStart).length,
  }
}
