import { describe, it, expect } from "vitest"
import { parseIcalString, formatIcalDate } from "@/lib/ical/parser"

const SAMPLE_AIRBNB_ICS = `BEGIN:VCALENDAR
PRODID;X-RICAL-TZOFFSET=+0700:-//Airbnb Inc//Hosting Calendar 0.8.8//EN
CALSCALE:GREGORIAN
VERSION:2.0
BEGIN:VEVENT
DTEND;VALUE=DATE:20260910
DTSTART;VALUE=DATE:20260905
UID:45834267-reservation-1@airbnb.com
SUMMARY:Reserved - Airbnb Guest
DESCRIPTION:Reservation URL: https://www.airbnb.com/hosting/reservations/details/HM12345
STATUS:CONFIRMED
END:VEVENT
BEGIN:VEVENT
DTEND;VALUE=DATE:20260920
DTSTART;VALUE=DATE:20260915
UID:45834267-reservation-2@airbnb.com
SUMMARY:Reserved - International Traveler
DESCRIPTION:Reservation URL: https://www.airbnb.com/hosting/reservations/details/HM67890
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`

describe("2-Way Inbound iCal Synchronization Engine", () => {
  it("normalizes RFC 5545 date formats to YYYY-MM-DD", () => {
    expect(formatIcalDate("20260905")).toBe("2026-09-05")
    expect(formatIcalDate("20261231T150000Z")).toBe("2026-12-31")
    expect(formatIcalDate("")).toBe("")
  })

  it("parses multi-event Airbnb iCal string into structured event objects", () => {
    const events = parseIcalString(SAMPLE_AIRBNB_ICS)
    expect(events).toHaveLength(2)

    expect(events[0].uid).toBe("45834267-reservation-1@airbnb.com")
    expect(events[0].dtStart).toBe("2026-09-05")
    expect(events[0].dtEnd).toBe("2026-09-10")
    expect(events[0].summary).toBe("Reserved - Airbnb Guest")
    expect(events[0].status).toBe("CONFIRMED")

    expect(events[1].uid).toBe("45834267-reservation-2@airbnb.com")
    expect(events[1].dtStart).toBe("2026-09-15")
    expect(events[1].dtEnd).toBe("2026-09-20")
  })

  it("handles malformed or empty iCal feeds gracefully", () => {
    expect(parseIcalString("")).toEqual([])
    expect(parseIcalString("NOT_VALID_ICS")).toEqual([])
  })

  it("extracts Airbnb reservation confirmation URL and details accurately", () => {
    const events = parseIcalString(SAMPLE_AIRBNB_ICS)
    const event = events[0]
    expect(event.description).toContain("details/HM12345")
    const codeMatch = event.description?.match(/details\/([A-Z0-9]+)/i)
    expect(codeMatch?.[1]).toBe("HM12345")
  })
})
