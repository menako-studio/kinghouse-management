import { NextRequest, NextResponse } from "next/server"
import { findVillaBySlug, getVillaReservations } from "@/lib/erp/villa-reservations"
import { generateIcalFeed } from "@/lib/ical/generator"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ villaSlug: string }> }
) {
  const { villaSlug } = await params
  const villa = findVillaBySlug(villaSlug)

  if (!villa) {
    return new NextResponse("Property calendar not found", { status: 404 })
  }

  const villaReservations = await getVillaReservations(villa)

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
