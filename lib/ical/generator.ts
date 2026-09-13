import { Villa } from "@/lib/types"
import { Reservation } from "@/lib/erp/types"

/**
 * Generates an RFC 5545 compliant iCalendar (.ics) string for OTA feeds
 * Compatible with Airbnb, Agoda, Booking.com, and Google Calendar
 */
export function generateIcalFeed(villa: Villa, reservations: Reservation[]): string {
  const now = new Date()
  const timestamp = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"

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

  reservations.forEach((res) => {
    const dtStart = res.checkIn.replace(/-/g, "")
    const dtEnd = res.checkOut.replace(/-/g, "")

    icsLines.push(
      "BEGIN:VEVENT",
      `UID:${res.id}@kinghouse.id`,
      `DTSTAMP:${timestamp}`,
      `DTSTART;VALUE=DATE:${dtStart}`,
      `DTEND;VALUE=DATE:${dtEnd}`,
      `SUMMARY:Reserved - Kinghouse (${res.channel})`,
      `DESCRIPTION:Channel: ${res.channel} | Stay for ${res.guests} guests | Booking Ref: ${res.id}`,
      "STATUS:CONFIRMED",
      "TRANSP:OPAQUE",
      "END:VEVENT"
    )
  })

  icsLines.push("END:VCALENDAR")

  return icsLines.join("\r\n")
}
