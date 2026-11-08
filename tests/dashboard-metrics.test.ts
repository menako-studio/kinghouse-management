import { describe, it, expect, vi, afterEach } from "vitest"
import { computeDashboardMetrics, nightsInWindow } from "@/lib/erp/dashboard-data"
import { syncPropertyIcal } from "@/lib/ical/sync"
import { setReservationsStore, getReservationsStore } from "@/lib/erp/store"
import type { Reservation } from "@/lib/erp/types"

function res(partial: Partial<Reservation>): Reservation {
  return {
    id: "R1",
    propertyId: "villa-1",
    propertySlug: "versatile-house-jagakarsa",
    propertyName: "Versatile House",
    guestName: "Guest",
    channel: "Airbnb",
    checkIn: "2026-11-10",
    checkOut: "2026-11-12",
    nights: 2,
    guests: 2,
    grossPayoutIdr: 2_000_000,
    cleaningFeeIdr: 0,
    feeTier: "standard",
    managementFeePercent: 15,
    managementFeeIdr: 300_000,
    netOwnerPayoutIdr: 1_700_000,
    status: "Confirmed",
    createdAt: "2026-11-01T00:00:00Z",
    ...partial,
  }
}

describe("dashboard metrics", () => {
  const today = new Date("2026-11-08T05:00:00Z")

  it("counts only nights inside the 30-day window", () => {
    const start = Date.UTC(2026, 10, 8)
    const end = start + 30 * 86400000
    expect(nightsInWindow("2026-11-05", "2026-11-10", start, end)).toBe(2)
    expect(nightsInWindow("2026-12-07", "2026-12-12", start, end)).toBe(1)
    expect(nightsInWindow("2026-10-01", "2026-10-05", start, end)).toBe(0)
  })

  it("excludes Airbnb blocks and cancellations from revenue, guests and occupancy", () => {
    const m = computeDashboardMetrics(
      [
        res({ id: "a" }),
        res({ id: "b", status: "Blocked", checkIn: "2026-11-15", checkOut: "2026-11-25", grossPayoutIdr: 9e6 }),
        res({ id: "c", status: "Cancelled", grossPayoutIdr: 5e6 }),
        res({ id: "d", checkIn: "2026-10-01", checkOut: "2026-10-03", guests: 4 }),
      ],
      4,
      today
    )
    expect(m.confirmedCount).toBe(2)
    expect(m.grossRevenueIdr).toBe(4_000_000)
    expect(m.totalGuests).toBe(6)
    expect(m.windowNightsBooked).toBe(2)
    expect(m.windowAvailableNights).toBe(120)
    expect(m.occupancyPercent).toBe(2)
    expect(m.upcomingCount).toBe(1)
  })
})

describe("iCal sync error reporting", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    setReservationsStore([])
  })

  it("reports an HTTP rejection from the OTA instead of silently importing nothing", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("Forbidden", { status: 403 })))
    const r = await syncPropertyIcal("versatile-house-jagakarsa", "https://www.airbnb.com/calendar/ical/1.ics")
    expect(r.success).toBe(false)
    expect(r.error).toContain("403")
  })

  it("rejects a non-iCal body (e.g. an HTML block page)", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("<html>captcha</html>", { status: 200 })))
    const r = await syncPropertyIcal("versatile-house-jagakarsa", "https://www.airbnb.com/calendar/ical/1.ics")
    expect(r.success).toBe(false)
    expect(r.error).toMatch(/bukan kalender iCal/)
  })

  it("imports reservations into the in-memory store and skips cancelled events", async () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "BEGIN:VEVENT",
      "DTSTART;VALUE=DATE:20261110",
      "DTEND;VALUE=DATE:20261113",
      "UID:abc-1@airbnb.com",
      "SUMMARY:Reserved",
      "END:VEVENT",
      "BEGIN:VEVENT",
      "DTSTART;VALUE=DATE:20261120",
      "DTEND;VALUE=DATE:20261122",
      "UID:abc-2@airbnb.com",
      "SUMMARY:Reserved",
      "STATUS:CANCELLED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n")
    vi.stubGlobal("fetch", vi.fn(async () => new Response(ics, { status: 200 })))
    const r = await syncPropertyIcal("versatile-house-jagakarsa", "https://www.airbnb.com/calendar/ical/1.ics")
    expect(r.success).toBe(true)
    expect(r.importedCount).toBe(1)
    expect(r.reservations[0].nights).toBe(3)
    expect(r.reservations[0].grossPayoutIdr).toBeGreaterThan(0)
    expect(getReservationsStore()).toHaveLength(1)
  })
})
