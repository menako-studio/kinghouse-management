import { describe, it, expect } from "vitest"
import { exportReservationsToCsv, exportExpensesToCsv } from "@/lib/erp/export"
import { Reservation, ExpenseRecord } from "@/lib/erp/types"

describe("Distribution Feed & Export Engine", () => {
  it("generates well-formatted CSV for reservations", () => {
    const fixtureReservations: Reservation[] = [
      {
        id: "RES-8921",
        propertyId: "villa-1",
        propertySlug: "versatile-house-jagakarsa",
        propertyName: "Versatile House With Beautiful Garden Beyond",
        guestName: "Airbnb Guest",
        channel: "Airbnb",
        checkIn: "2026-08-22",
        checkOut: "2026-08-25",
        nights: 3,
        guests: 4,
        grossPayoutIdr: 5400000,
        cleaningFeeIdr: 300000,
        feeTier: "standard",
        managementFeePercent: 15,
        managementFeeIdr: 765000,
        netOwnerPayoutIdr: 4335000,
        status: "Confirmed",
        createdAt: "2026-08-18T10:30:00Z",
      },
    ]

    const csv = exportReservationsToCsv(fixtureReservations)

    expect(csv).toContain("Reservation ID,Property,Guest Name,Channel")
    expect(csv).toContain("RES-8921")
    expect(csv).toContain("Versatile House With Beautiful Garden Beyond")
    expect(csv).toContain("Airbnb Guest")
    expect(csv).toContain("Airbnb")
  })

  it("generates well-formatted CSV for expenses", () => {
    const fixtureExpenses: ExpenseRecord[] = [
      {
        id: "EXP-101",
        propertyId: "villa-1",
        propertySlug: "versatile-house-jagakarsa",
        propertyName: "Versatile House With Beautiful Garden Beyond",
        category: "PLN & Utilities",
        description: "Token Listrik PLN",
        amountIdr: 500000,
        date: "2026-08-05",
        recordedBy: "Staff",
      },
    ]

    const csv = exportExpensesToCsv(fixtureExpenses)

    expect(csv).toContain("Expense ID,Property,Category,Description,Amount (IDR)")
    expect(csv).toContain("EXP-101")
    expect(csv).toContain("PLN & Utilities")
    expect(csv).toContain("Token Listrik PLN")
  })

  it("generates valid RFC 5545 iCalendar feed for OTA sync", async () => {
    const { generateIcalFeed } = await import("@/lib/ical/generator")
    const { CURATED_VILLAS } = await import("@/lib/data")

    const villa = CURATED_VILLAS[0]
    const reservations: Reservation[] = [
      {
        id: "RES-TEST-1",
        propertyId: villa.id,
        propertySlug: villa.slug,
        propertyName: villa.name,
        guestName: "Budi Santoso",
        channel: "Direct WhatsApp",
        checkIn: "2026-10-01",
        checkOut: "2026-10-04",
        nights: 3,
        guests: 6,
        grossPayoutIdr: 7500000,
        cleaningFeeIdr: 350000,
        feeTier: "standard",
        managementFeePercent: 15,
        managementFeeIdr: 1072500,
        netOwnerPayoutIdr: 6077500,
        status: "Confirmed",
        createdAt: "2026-09-01T00:00:00Z",
      },
    ]

    const ics = generateIcalFeed(villa, reservations)

    expect(ics).toContain("BEGIN:VCALENDAR")
    expect(ics).toContain("VERSION:2.0")
    expect(ics).toContain("PRODID:-//Kinghouse Hospitality//EN")
    expect(ics).toContain("METHOD:PUBLISH")
    expect(ics).toContain("BEGIN:VEVENT")
    expect(ics).toContain("UID:RES-TEST-1@kinghouse.id")
    expect(ics).toContain("DTSTART;VALUE=DATE:20261001")
    expect(ics).toContain("DTEND;VALUE=DATE:20261004")
    expect(ics).toContain("SUMMARY:Reserved - Kinghouse (Direct WhatsApp)")
    expect(ics).toContain("END:VEVENT")
    expect(ics).toContain("END:VCALENDAR")
  })
})

