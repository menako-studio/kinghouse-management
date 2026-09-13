import { NextRequest, NextResponse } from "next/server"
import { CURATED_VILLAS } from "@/lib/data"
import { Reservation } from "@/lib/erp/types"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getReservationsStore } from "@/lib/erp/store"
import { generateIcalFeed } from "@/lib/ical/generator"

const PROPERTY_ALIASES: Record<string, string[]> = {
  "villa-1": [
    "versatile-house-jagakarsa",
    "versatile-house-with-beautiful-garden-beyond",
    "villa-jagakarsa",
    "villa-1",
    "45834267",
  ],
  "villa-2": [
    "sky-house-tangerang",
    "sky-house-hotel-style-bed-ikea-5min",
    "sky-house-bsd",
    "villa-2",
    "1325106294978348497",
  ],
  "villa-3": [
    "skyline-luxury-orange-county-cikarang",
    "skyline-luxury-at-orange-county",
    "cikarang-luxury",
    "villa-3",
    "1691723711820833674",
  ],
  "villa-4": [
    "bright-airy-apartment-palmerah",
    "bright-airy-apartment",
    "palmerah-apt",
    "villa-4",
    "1444158185166882045",
  ],
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ villaSlug: string }> }
) {
  const { villaSlug } = await params
  const normalizedSlug = villaSlug.toLowerCase().trim()

  const villa = CURATED_VILLAS.find((v) => {
    if (v.slug === normalizedSlug || v.id === normalizedSlug) return true
    const aliases = PROPERTY_ALIASES[v.id] || []
    return aliases.includes(normalizedSlug)
  })

  if (!villa) {
    return new NextResponse("Property calendar not found", { status: 404 })
  }

  let villaReservations: Reservation[] = []

  const supabase = getSupabaseServerClient()
  if (supabase) {
    // Airbnb (and other OTAs) abandon a calendar sync if the endpoint is slow,
    // so a Supabase host that is unreachable/misconfigured must never be allowed
    // to stall this response — bound the query and fall back to the in-memory
    // store on timeout instead of hanging until the platform's own limit.
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4000)
    try {
      const aliases = PROPERTY_ALIASES[villa.id] || [villa.slug, villa.id]
      const orFilters = [
        ...aliases.map((a) => `property_slug.eq.${a}`),
        ...aliases.map((a) => `property_id.eq.${a}`),
        `property_name.ilike.%${villa.name.slice(0, 15)}%`,
      ].join(",")

      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .or(orFilters)
        .neq("status", "Cancelled")
        .abortSignal(controller.signal)

      if (!error && data && data.length > 0) {
        villaReservations = data.map((row) => ({
          id: row.id,
          propertyId: row.property_id,
          propertySlug: row.property_slug,
          propertyName: row.property_name,
          guestName: row.guest_name,
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
          notes: row.notes,
          createdAt: row.created_at,
        }))
      }
    } catch {
      // Supabase unreachable or timed out — fall back to the in-memory store below.
    } finally {
      clearTimeout(timeoutId)
    }
  }

  if (villaReservations.length === 0) {
    const aliases = PROPERTY_ALIASES[villa.id] || [villa.slug, villa.id]
    villaReservations = getReservationsStore().filter(
      (r) =>
        (aliases.includes(r.propertySlug) ||
          aliases.includes(r.propertyId) ||
          r.propertyName.toLowerCase().includes(villa.name.toLowerCase().slice(0, 15))) &&
        r.status !== "Cancelled"
    )
  }

  const icsBody = generateIcalFeed(villa, villaReservations)

  return new NextResponse(icsBody, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${villa.slug}-calendar.ics"`,
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  })
}
