import { NextRequest, NextResponse } from "next/server"
import { findVillaBySlug, getVillaReservations } from "@/lib/erp/villa-reservations"
import { findNearestAvailableRanges, isRangeAvailable, nightsBetween } from "@/lib/funnel/availability"
import { checkRateLimit } from "@/lib/security/rate-limiter"

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/**
 * Public stay availability check for a property page.
 * GET /api/availability?villa=<slug>&checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD
 * Returns only free/busy information — never guest details.
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

  const booked = (await getVillaReservations(villa)).map((r) => ({ checkIn: r.checkIn, checkOut: r.checkOut }))
  const requested = { checkIn, checkOut }
  const available = isRangeAvailable(booked, requested)
  const today = new Date().toISOString().slice(0, 10)

  return NextResponse.json(
    {
      villa: villa.slug,
      checkIn,
      checkOut,
      available,
      alternatives: available ? [] : findNearestAvailableRanges(booked, requested, { today }),
    },
    { headers: { "Cache-Control": "no-store" } }
  )
}
