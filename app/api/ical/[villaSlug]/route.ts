import { NextRequest, NextResponse } from "next/server"
import { CURATED_VILLAS } from "@/lib/data"
import { Reservation } from "@/lib/erp/types"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getReservationsStore } from "@/lib/erp/store"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ villaSlug: string }> }
) {
  const { villaSlug } = await params
  const villa = CURATED_VILLAS.find((v) => v.slug === villaSlug || v.id === villaSlug)

  if (!villa) {
    return new NextResponse("Property calendar not found", { status: 404 })
  }

  let villaReservations: Reservation[] = []

  const supabase = getSupabaseServerClient()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .or(`property_slug.eq.${villa.slug},property_id.eq.${villa.id}`)
        .neq("status", "Cancelled")

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
      // Fallback
    }
  }

  if (villaReservations.length === 0) {
    villaReservations = getReservationsStore().filter(
      (r) => (r.propertySlug === villaSlug || r.propertyId === villa.id) && r.status !== "Cancelled"
    )
  }

  const now = new Date()
  const timestamp = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"

  // Build RFC 5545 iCalendar content
  const icsLines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kinghouse Hospitality//EN",
    `X-WR-CALNAME:Kinghouse - ${villa.name}`,
    "X-WR-CALDESC:Real-time availability calendar feed for OTA synchronization",
    "X-WR-TIMEZONE:Asia/Jakarta",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ]

  villaReservations.forEach((res) => {
    const dtStart = res.checkIn.replace(/-/g, "")
    const dtEnd = res.checkOut.replace(/-/g, "")

    icsLines.push(
      "BEGIN:VEVENT",
      `UID:${res.id}@kinghouse.id`,
      `DTSTAMP:${timestamp}`,
      `DTSTART;VALUE=DATE:${dtStart}`,
      `DTEND;VALUE=DATE:${dtEnd}`,
      `SUMMARY:Reserved - KingHouse (${res.channel})`,
      `DESCRIPTION:Channel: ${res.channel} | Stay for ${res.guests} guests | Booking Ref: ${res.id}`,
      "STATUS:CONFIRMED",
      "TRANSP:OPAQUE",
      "END:VEVENT"
    )
  })

  icsLines.push("END:VCALENDAR")

  const icsBody = icsLines.join("\r\n")

  return new NextResponse(icsBody, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${villaSlug}-calendar.ics"`,
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  })
}
