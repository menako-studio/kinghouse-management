import { parseIcalString } from "./parser"
import { Reservation, ChannelType } from "@/lib/erp/types"
import { calculateReservationPayout } from "@/lib/erp/calculations"
import { CURATED_VILLAS } from "@/lib/data"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { upsertReservationsToStore } from "@/lib/erp/store"

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
): Promise<{ success: boolean; importedCount: number; reservations: Reservation[]; error?: string }> {
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

    const response = await fetch(icalUrl, {
      headers: {
        "User-Agent": "Kinghouse-Hospitality-Sync/1.0",
      },
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      return {
        success: false,
        importedCount: 0,
        reservations: [],
        error: `Failed to fetch iCal feed (Status: ${response.status})`,
      }
    }

    const icsText = await response.text()
    const parsedEvents = parseIcalString(icsText)

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

    // Upsert into Supabase if configured
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

      await supabase.from("reservations").upsert(recordsToUpsert, { onConflict: "id" })
    }

    // Always keep runtime in-memory store synced
    if (newReservations.length > 0) {
      upsertReservationsToStore(newReservations)
    }

    return {
      success: true,
      importedCount: newReservations.length,
      reservations: newReservations,
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

/**
 * Syncs all properties that have configured external iCal feeds
 */
export async function syncAllConfiguredProperties(): Promise<{
  success: boolean
  totalImported: number
  results: Array<{
    propertySlug: string
    propertyName: string
    channel: ChannelType
    importedCount: number
    error?: string
  }>
}> {
  const propertiesWithIcal = CURATED_VILLAS.filter(
    (v) => v.airbnbIcalUrl || v.airbnbEventIcalUrl || v.agodaIcalUrl
  )
  const results = []
  let totalImported = 0

  for (const villa of propertiesWithIcal) {
    if (villa.airbnbIcalUrl) {
      const res = await syncPropertyIcal(villa.slug, villa.airbnbIcalUrl, "Airbnb")
      if (res.success) {
        totalImported += res.importedCount
      }
      results.push({
        propertySlug: villa.slug,
        propertyName: villa.name,
        channel: "Airbnb" as ChannelType,
        importedCount: res.importedCount,
        error: res.error,
      })
    }

    if (villa.airbnbEventIcalUrl) {
      const res = await syncPropertyIcal(villa.slug, villa.airbnbEventIcalUrl, "Airbnb")
      if (res.success) {
        totalImported += res.importedCount
      }
      results.push({
        propertySlug: villa.slug,
        propertyName: `${villa.name} (Event Listing)`,
        channel: "Airbnb" as ChannelType,
        importedCount: res.importedCount,
        error: res.error,
      })
    }

    if (villa.agodaIcalUrl) {
      const res = await syncPropertyIcal(villa.slug, villa.agodaIcalUrl, "Agoda")
      if (res.success) {
        totalImported += res.importedCount
      }
      results.push({
        propertySlug: villa.slug,
        propertyName: villa.name,
        channel: "Agoda" as ChannelType,
        importedCount: res.importedCount,
        error: res.error,
      })
    }
  }

  return {
    success: true,
    totalImported,
    results,
  }
}
