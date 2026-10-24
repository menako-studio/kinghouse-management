import { NextRequest, NextResponse } from "next/server"
import { findVillaBySlug, getVillaReservations } from "@/lib/erp/villa-reservations"
import { findNearestAvailableRanges, isRangeAvailable, nightsBetween } from "@/lib/funnel/availability"
import { getLiveBookedRanges } from "@/lib/ical/live-calendar"
import { checkRateLimit } from "@/lib/security/rate-limiter"

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/**
 * Public stay availability check for a property page.
 * GET /api/availability?villa=<slug>&checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD
 * Returns only free/busy information — never guest details.
 *
 * Booked dates = reservations already synced into the ERP (Supabase / store)
 * + the villa's OTA iCal feeds read live (cached 5 min), so a booking made
 * after the daily sync cron is still caught. `verified` is false when the
 * villa has no OTA feed or a feed did not answer — the page then asks the
 * guest to confirm via WhatsApp instead of promising the dates.
 */
export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  if (!checkRateLimit(`availability:${ip}`, 30, 60 * 1000).success) {
    return NextResponse.json({ error: "Terlalu banyak permintaan, coba lagi sebentar." }, { status: 429 })
  }

  const { searchParams } = new URL(request.url)
  const villaSlug = searchParams.get("villa") || ""
  const checkIn = searchParams.get("checkIn") || ""
  const checkOut = searchParams.get("checkOut") || ""

  if (!ISO_DATE.test(checkIn) || !ISO_DATE.test(checkOut) || checkOut <= checkIn) {
    return NextResponse.json({ error: "Tanggal check-in/check-out tidak valid." }, { status: 400 })
  }
  if (nightsBetween(checkIn, checkOut) > 60) {
    return NextResponse.json({ error: "Untuk menginap lebih dari 60 malam, hubungi kami via WhatsApp." }, { status: 400 })
  }

  const villa = findVillaBySlug(villaSlug)
  if (!villa) {
    return NextResponse.json({ error: "Properti tidak ditemukan." }, { status: 404 })
  }

  const [reservations, live] = await Promise.all([getVillaReservations(villa), getLiveBookedRanges(villa)])
  const booked = [...reservations.map((r) => ({ checkIn: r.checkIn, checkOut: r.checkOut })), ...live.ranges]
  const requested = { checkIn, checkOut }
  const available = isRangeAvailable(booked, requested)
  const today = new Date().toISOString().slice(0, 10)

  return NextResponse.json(
    {
      villa: villa.slug,
      checkIn,
      checkOut,
      available,
      verified: live.complete,
      alternatives: available ? [] : findNearestAvailableRanges(booked, requested, { today }),
    },
    { headers: { "Cache-Control": "no-store" } }
  )
}
