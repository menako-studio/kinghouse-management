import { parseIcalString } from "./parser"
import { Reservation, ChannelType } from "@/lib/erp/types"
import { calculateReservationPayout } from "@/lib/erp/calculations"
import { CURATED_VILLAS } from "@/lib/data"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { upsertReservationsToStore } from "@/lib/erp/store"

const ICAL_FETCH_TIMEOUT_MS = 8000

export interface PropertyIcalConfig {
  propertyId: string
  propertySlug: string
  propertyName: string
  inboundIcalUrl?: string
  channel: ChannelType
}

/**
 * Validates external iCal URL against SSRF and local network access attacks
 */
export function validateSafeIcalUrl(urlStr: string): { valid: boolean; reason?: string } {
  try {
    const parsed = new URL(urlStr)
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { valid: false, reason: "Prohibited protocol. Only HTTP and HTTPS are permitted." }
    }

    const host = parsed.hostname.toLowerCase()
    const cleanHost = host.replace(/^\[|\]$/g, "")

    // Block loopback and link-local addresses
    if (
      cleanHost === "localhost" ||
      cleanHost === "127.0.0.1" ||
      cleanHost === "::1" ||
      cleanHost === "0.0.0.0" ||
      cleanHost.endsWith(".local") ||
      cleanHost.endsWith(".internal")
    ) {
      return { valid: false, reason: "Local network addresses are prohibited." }
    }

    // Block AWS / Cloud metadata service IP
    if (host === "169.254.169.254" || host.startsWith("169.254.")) {
      return { valid: false, reason: "Access to cloud metadata services is blocked." }
    }

    // Block private RFC 1918 IPv4 ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
    const ipv4Parts = host.split(".").map(Number)
    if (ipv4Parts.length === 4 && ipv4Parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)) {
      if (
        ipv4Parts[0] === 10 ||
        (ipv4Parts[0] === 172 && ipv4Parts[1] >= 16 && ipv4Parts[1] <= 31) ||
        (ipv4Parts[0] === 192 && ipv4Parts[1] === 168)
      ) {
        return { valid: false, reason: "Private subnet IP addresses are prohibited." }
      }
    }

    return { valid: true }
  } catch {
    return { valid: false, reason: "Malformed URL format." }
  }
}

/**
 * Syncs external iCal feed for a specific property
 */
export async function syncPropertyIcal(
  propertySlug: string,
  icalUrl: string,
  channel: ChannelType = "Airbnb"
): Promise<{
  success: boolean
  importedCount: number
  reservations: Reservation[]
  error?: string
  warning?: string
}> {
  try {
    const urlValidation = validateSafeIcalUrl(icalUrl)
    if (!urlValidation.valid) {
      return {
        success: false,
        importedCount: 0,
        reservations: [],
        error: `Security SSRF Protection: ${urlValidation.reason}`,
      }
    }

    const villa = CURATED_VILLAS.find((v) => v.slug === propertySlug || v.id === propertySlug)
    if (!villa) {
      return { success: false, importedCount: 0, reservations: [], error: "Property not found." }
    }

    // Bound the request: a slow OTA must never stall the dashboard render or
    // the cron (Vercel kills functions that exceed their time limit).
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), ICAL_FETCH_TIMEOUT_MS)
    let icsText: string
    try {
      const response = await fetch(icalUrl, {
        headers: {
          // Airbnb rejects some unknown bot user agents; identify as a calendar client.
          "User-Agent": "Mozilla/5.0 (compatible; Kinghouse-Hospitality-Sync/1.1; +https://kinghousemanagement.com)",
          Accept: "text/calendar, text/plain;q=0.9, */*;q=0.8",
        },
        cache: "no-store",
        signal: controller.signal,
      })

      if (!response.ok) {
        return {
          success: false,
          importedCount: 0,
          reservations: [],
          error: `Feed iCal ditolak oleh server OTA (HTTP ${response.status})`,
        }
      }
      icsText = await response.text()
    } catch (err) {
      const aborted = err instanceof Error && err.name === "AbortError"
      return {
        success: false,
        importedCount: 0,
        reservations: [],
        error: aborted
          ? `Feed iCal tidak merespons dalam ${ICAL_FETCH_TIMEOUT_MS / 1000} detik`
          : `Gagal menghubungi feed iCal: ${err instanceof Error ? err.message : "unknown error"}`,
      }
    } finally {
      clearTimeout(timeoutId)
    }

    if (!icsText.includes("BEGIN:VCALENDAR")) {
      return {
        success: false,
        importedCount: 0,
        reservations: [],
        error: "Respons bukan kalender iCal (token iCal kedaluwarsa atau permintaan diblokir)",
      }
    }

    const parsedEvents = parseIcalString(icsText).filter(
      (evt) => evt.status?.toUpperCase() !== "CANCELLED"
    )

    const newReservations: Reservation[] = parsedEvents.map((evt, idx) => {
      const checkInDate = new Date(evt.dtStart)
      const checkOutDate = new Date(evt.dtEnd)
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
      const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))

      const estimatedNightlyRate = villa.price.idr
      const grossPayoutIdr = estimatedNightlyRate * nights
      const cleaningFeeIdr = villa.price.cleaningFeeIdr
      const payout = calculateReservationPayout(grossPayoutIdr, cleaningFeeIdr, "standard")

      const isBlocked = evt.summary.toLowerCase().includes("not available")
      const guestName = isBlocked
        ? "Airbnb (Dates Blocked)"
        : evt.summary.replace(/^Reserved\s*-\s*/i, "").trim() || "Airbnb Guest"

      // Extract Airbnb confirmation code if available (e.g. details/HMYYBDR3RF)
      const codeMatch = evt.description?.match(/details\/([A-Z0-9]+)/i)
      const confirmationCode = codeMatch ? codeMatch[1] : undefined

      // Extract phone number digits if available
      const phoneMatch = evt.description?.match(/Phone Number[^:]*:\s*(\d+)/i)
      const phoneSuffix = phoneMatch ? `***${phoneMatch[1]}` : undefined

      // Generate guaranteed unique ID across all parsed events
      const uidClean = evt.uid.replace(/[^a-zA-Z0-9]/g, "")
      const uidSuffix = uidClean.length > 12 ? uidClean.slice(-12) : uidClean
      const reservationId = `SYNC-${uidSuffix}-${idx + 1}`

      const notesArr: string[] = [`Auto-synced via ${channel} iCal.`]
      if (confirmationCode) notesArr.push(`Kode: ${confirmationCode}`)
      if (phoneSuffix) notesArr.push(`Tel: ${phoneSuffix}`)
      notesArr.push(`UID: ${evt.uid}`)

      return {
        id: reservationId,
        propertyId: villa.id,
        propertySlug: villa.slug,
        propertyName: villa.name,
        guestName,
        channel,
        checkIn: evt.dtStart,
        checkOut: evt.dtEnd,
        nights,
        guests: 2,
        grossPayoutIdr,
        cleaningFeeIdr,
        feeTier: "standard",
        managementFeePercent: payout.managementFeePercent,
        managementFeeIdr: payout.managementFeeIdr,
        netOwnerPayoutIdr: payout.netOwnerPayoutIdr,
        status: isBlocked ? "Blocked" : "Confirmed",
        notes: notesArr.join(" | "),
        createdAt: new Date().toISOString(),
      }
    })

    // Keep the runtime in-memory store in sync first, so a Supabase outage or
    // permission error never throws away bookings that were fetched successfully.
    if (newReservations.length > 0) {
      upsertReservationsToStore(newReservations)
    }

    // Persist to Supabase if configured (needs SUPABASE_SERVICE_ROLE_KEY: the
    // anon role has no access to `reservations` since the RLS hardening migration).
    let warning: string | undefined
    const supabase = getSupabaseServerClient()
    if (supabase && newReservations.length > 0) {
      const recordsToUpsert = newReservations.map((r) => ({
        id: r.id,
        property_id: r.propertyId,
        property_slug: r.propertySlug,
        property_name: r.propertyName,
        guest_name: r.guestName,
        guest_phone: null,
        guest_email: null,
        channel: r.channel,
        check_in: r.checkIn,
        check_out: r.checkOut,
        nights: r.nights,
        guests: r.guests,
        gross_payout_idr: r.grossPayoutIdr,
        cleaning_fee_idr: r.cleaningFeeIdr,
        fee_tier: r.feeTier,
        management_fee_percent: r.managementFeePercent,
        management_fee_idr: r.managementFeeIdr,
        net_owner_payout_idr: r.netOwnerPayoutIdr,
        status: r.status,
        notes: r.notes,
        created_at: r.createdAt,
      }))

      try {
        const { error } = await supabase.from("reservations").upsert(recordsToUpsert, { onConflict: "id" })
        if (error) warning = `Gagal menyimpan ke Supabase: ${error.message}`
      } catch (err) {
        warning = `Gagal menyimpan ke Supabase: ${err instanceof Error ? err.message : "unknown error"}`
      }
      if (warning) console.warn(`[ical-sync] ${propertySlug}: ${warning}`)
    }

    return {
      success: true,
      importedCount: newReservations.length,
      reservations: newReservations,
      warning,
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to execute iCal sync"
    return {
      success: false,
      importedCount: 0,
      reservations: [],
      error: errorMessage,
    }
  }
}

export interface IcalSyncFeedResult {
  propertySlug: string
  propertyName: string
  channel: ChannelType
  importedCount: number
  error?: string
  warning?: string
}

export interface IcalSyncSummary {
  success: boolean
  totalImported: number
  syncedAt: string
  results: IcalSyncFeedResult[]
}

declare global {
  var __kinghouse_last_ical_sync: IcalSyncSummary | undefined
}

/** Result of the most recent sync-all run in this server instance (if any). */
export function getLastIcalSyncSummary(): IcalSyncSummary | undefined {
  return globalThis.__kinghouse_last_ical_sync
}

/**
 * Syncs all properties that have configured external iCal feeds.
 * Feeds are fetched in parallel so one slow OTA does not add up to a timeout.
 */
export async function syncAllConfiguredProperties(): Promise<IcalSyncSummary> {
  const jobs: Array<{ villaSlug: string; name: string; url: string; channel: ChannelType }> = []
  for (const villa of CURATED_VILLAS) {
    if (villa.airbnbIcalUrl) {
      jobs.push({ villaSlug: villa.slug, name: villa.name, url: villa.airbnbIcalUrl, channel: "Airbnb" })
    }
    if (villa.airbnbEventIcalUrl) {
      jobs.push({
        villaSlug: villa.slug,
        name: `${villa.name} (Event Listing)`,
        url: villa.airbnbEventIcalUrl,
        channel: "Airbnb",
      })
    }
    if (villa.agodaIcalUrl) {
      jobs.push({ villaSlug: villa.slug, name: villa.name, url: villa.agodaIcalUrl, channel: "Agoda" })
    }
  }

  const results: IcalSyncFeedResult[] = await Promise.all(
    jobs.map(async (job) => {
      const res = await syncPropertyIcal(job.villaSlug, job.url, job.channel)
      if (res.error) console.warn(`[ical-sync] ${job.name}: ${res.error}`)
      return {
        propertySlug: job.villaSlug,
        propertyName: job.name,
        channel: job.channel,
        importedCount: res.success ? res.importedCount : 0,
        error: res.error,
        warning: res.warning,
      }
    })
  )

  const summary: IcalSyncSummary = {
    success: results.length > 0 && results.some((r) => !r.error),
    totalImported: results.reduce((sum, r) => sum + r.importedCount, 0),
    syncedAt: new Date().toISOString(),
    results,
  }
  globalThis.__kinghouse_last_ical_sync = summary
  return summary
}
