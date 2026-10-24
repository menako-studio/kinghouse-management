import { describe, it, expect, beforeEach, vi } from "vitest"
import { EventLeadSchema, OwnerLeadSchema, StayLeadSchema } from "@/lib/validations"
import {
  buildWhatsAppUrl,
  eventWhatsAppMessage,
  ownerWhatsAppMessage,
  resolvePageWhatsApp,
  stayWhatsAppMessage,
} from "@/lib/funnel/whatsapp"
import { WHATSAPP_LINES, routeOwnerService } from "@/lib/funnel/config"
import { createTranslator } from "@/lib/i18n/funnel"
import { buildLeadRecord, buildLeadWhatsAppUrl, isPriorityLead, summarizeLead } from "@/lib/funnel/lead"
import { parseLeadSource } from "@/lib/funnel/lead-source"
import { findNearestAvailableRanges, isRangeAvailable, nightsBetween } from "@/lib/funnel/availability"
import { trackCheckAvailability, trackLeadFormSubmit } from "@/lib/analytics"
import { POST as postLead } from "@/app/api/leads/route"
import { NextRequest } from "next/server"

const ownerLead = {
  target: "OWNER" as const,
  name: "Rina Wijaya",
  whatsapp: "0812-3456-7890",
  email: "",
  service: "co-hosting" as const,
  propertyType: "villa" as const,
  location: "Jagakarsa",
  units: 4,
  propertyStatus: "ota-live" as const,
}

const eventLead = {
  target: "EVENT" as const,
  name: "Dimas",
  whatsapp: "+62 812 1111 2222",
  eventType: "wedding" as const,
  eventDate: "2026-12-12",
  backupDate: "",
  startTime: "08:00",
  endTime: "15:00",
  guests: 40,
  property: "Versatile House Jagakarsa",
  specialNeeds: ["decoration" as const],
  weddingSession: "akad" as const,
  ownVendor: true,
}

describe("Funnel WhatsApp messages", () => {
  it("builds wa.me links on the target's line with an encoded message", () => {
    const url = buildWhatsAppUrl("OWNER", "Halo & terima kasih?")
    expect(url).toBe(`https://wa.me/${WHATSAPP_LINES.OWNER}?text=Halo%20%26%20terima%20kasih%3F`)
    expect(WHATSAPP_LINES.STAY).toMatch(/^62\d{8,}$/)
  })

  it("fills the owner, stay and event templates in English by default", () => {
    expect(ownerWhatsAppMessage({ service: "co-hosting", propertyType: "villa", location: "Jagakarsa", units: 4 })).toBe(
      "Hello Kinghouse, I own a property and I am interested in Co-Hosting. My property: villa in Jagakarsa, 4 bedrooms/units. Could you share the packages and fees?"
    )
    expect(stayWhatsAppMessage({ propertyName: "Sky House", checkIn: "2026-11-01", checkOut: "2026-11-03", guests: 2 })).toBe(
      "Hello Kinghouse, I would like to stay at Sky House from 1 Nov 2026 to 3 Nov 2026 for 2 guests. Is it available?"
    )
    expect(eventWhatsAppMessage({ eventType: "shooting", propertyName: "Versatile House", date: "2026-12-12", guests: 8 })).toBe(
      "Hello Kinghouse, I would like to ask about a photo & video shoot event at Versatile House on 12 Dec 2026 for about 8 people. Is it available, and what is the price?"
    )
  })

  it("uses the plan's Indonesian wording for Indonesian visitors", () => {
    const id = { t: createTranslator("ID"), language: "ID" as const }
    expect(ownerWhatsAppMessage({ service: "co-hosting", propertyType: "villa", location: "Jagakarsa", units: 4 }, id)).toBe(
      "Halo Kinghouse, saya pemilik properti dan tertarik dengan Co-Hosting. Properti saya: villa di Jagakarsa, 4 kamar/unit. Boleh dijelaskan paket dan biayanya?"
    )
    expect(stayWhatsAppMessage({ propertyName: "Sky House", checkIn: "2026-11-01", checkOut: "2026-11-03", guests: 2 }, id)).toBe(
      "Halo Kinghouse, saya tertarik menginap di Sky House tanggal 1 Nov 2026–3 Nov 2026 untuk 2 tamu. Apakah tersedia?"
    )
  })

  it("routes the floating button to the funnel of the current page", () => {
    expect(resolvePageWhatsApp("/owner-services").funnel).toBe("owner")
    expect(resolvePageWhatsApp("/events/garden-wedding-jagakarsa").target).toBe("EVENT")
    expect(resolvePageWhatsApp("/locations/jagakarsa/villas/versatile-house-jagakarsa").funnel).toBe("stay")
    expect(resolvePageWhatsApp("/blog").funnel).toBe("general")
  })
})

describe("Lead validation", () => {
  it("accepts a complete owner lead and rejects bad phone numbers and honeypot spam", () => {
    expect(OwnerLeadSchema.safeParse(ownerLead).success).toBe(true)
    expect(OwnerLeadSchema.safeParse({ ...ownerLead, whatsapp: "abc" }).success).toBe(false)
    expect(OwnerLeadSchema.safeParse({ ...ownerLead, website: "http://spam.example" }).success).toBe(false)
  })

  it("rejects an event that ends before it starts and a stay with check-out before check-in", () => {
    expect(EventLeadSchema.safeParse(eventLead).success).toBe(true)
    expect(EventLeadSchema.safeParse({ ...eventLead, endTime: "07:00" }).success).toBe(false)
    expect(
      StayLeadSchema.safeParse({
        target: "STAY",
        need: "notify",
        name: "Ana",
        whatsapp: "081234567890",
        property: "Sky House",
        checkIn: "2026-11-05",
        checkOut: "2026-11-04",
        guests: 2,
      }).success
    ).toBe(false)
  })
})

describe("Lead records", () => {
  it("tags target, need, routing, priority and the first-reply deadline in office hours", () => {
    const now = new Date("2026-10-24T03:00:00.000Z")
    const record = buildLeadRecord(OwnerLeadSchema.parse(ownerLead), now)
    expect(record.id).toMatch(/^KH-OWN-20261024-[A-Z0-9]{4}$/)
    expect(record).toMatchObject({
      target: "OWNER",
      need: "co-hosting",
      status: "Baru",
      route_to: "owner_relations",
      priority: true,
      guests_or_units: 4,
      // Saturday 10:00 WIB → office reopens Monday 08:00 WIB → +1 working hour
      first_response_due_at: "2026-10-26T02:00:00.000Z",
    })
  })

  it("sends HK on Demand to the cleaning team and flags small unlisted owners as normal priority", () => {
    expect(routeOwnerService("hk-on-demand")).toBe("cleaning")
    const lead = OwnerLeadSchema.parse({ ...ownerLead, service: "hk-on-demand", units: 1, propertyStatus: "not-listed" })
    expect(isPriorityLead(lead)).toBe(false)
    expect(buildLeadRecord(lead).route_to).toBe("cleaning")
  })

  it("summarizes only the questions that were answered (team copy in Indonesian)", () => {
    const lead = EventLeadSchema.parse(eventLead)
    const labels = summarizeLead(lead).map((r) => r.label)
    expect(labels).toContain("Sesi")
    expect(labels).toContain("Vendor sendiri")
    expect(labels).not.toContain("Tanggal cadangan")
    expect(labels).not.toContain("Tujuan shooting")
  })

  it("builds the visitor's WhatsApp follow-up in the language they used", () => {
    const en = decodeURIComponent(buildLeadWhatsAppUrl(EventLeadSchema.parse(eventLead), "KH-EVT-20261024-ABCD"))
    expect(en).toContain("a wedding event at Versatile House Jagakarsa on 12 Dec 2026")
    expect(en).toContain("• Ceremony: Akad / ceremony")
    expect(en).toContain("Ref: KH-EVT-20261024-ABCD")

    const ja = decodeURIComponent(buildLeadWhatsAppUrl(EventLeadSchema.parse({ ...eventLead, language: "JA" }), "KH-1"))
    expect(ja).toContain("ウェディング")
    expect(ja).toContain("受付番号：KH-1")
  })
})

describe("Lead source (UTM)", () => {
  it("reads UTM parameters and keeps only external referrers", () => {
    expect(
      parseLeadSource(
        "https://www.kinghousemanagement.com/events?utm_source=instagram&utm_medium=bio&utm_campaign=wedding_q4",
        "https://l.instagram.com/some/path?x=1"
      )
    ).toEqual({
      utmSource: "instagram",
      utmMedium: "bio",
      utmCampaign: "wedding_q4",
      referrer: "https://l.instagram.com/some/path",
      landingPage: "/events",
    })
    expect(parseLeadSource("https://www.kinghousemanagement.com/villas", "https://www.kinghousemanagement.com/").referrer).toBeUndefined()
  })
})

describe("Stay availability", () => {
  const booked = [
    { checkIn: "2026-11-10", checkOut: "2026-11-12" },
    { checkIn: "2026-11-14", checkOut: "2026-11-15" },
  ]

  it("treats the check-out day as free for the next check-in", () => {
    expect(isRangeAvailable(booked, { checkIn: "2026-11-12", checkOut: "2026-11-14" })).toBe(true)
    expect(isRangeAvailable(booked, { checkIn: "2026-11-11", checkOut: "2026-11-13" })).toBe(false)
    expect(nightsBetween("2026-11-12", "2026-11-14")).toBe(2)
  })

  it("suggests the nearest free ranges with the same length, never in the past", () => {
    const alternatives = findNearestAvailableRanges(booked, { checkIn: "2026-11-10", checkOut: "2026-11-12" }, { today: "2026-11-09" })
    expect(alternatives).toEqual([
      { checkIn: "2026-11-12", checkOut: "2026-11-14" },
      { checkIn: "2026-11-15", checkOut: "2026-11-17" },
    ])
  })
})

describe("Funnel analytics events", () => {
  beforeEach(() => {
    globalThis.window = { dataLayer: [], gtag: vi.fn() } as unknown as Window & typeof globalThis
  })

  it("fires submit_owner_form, owner_lead_submit and generate_lead for an owner form", () => {
    trackLeadFormSubmit({ target: "OWNER", need: "co-hosting", leadId: "KH-OWN-1" })
    expect(window.dataLayer!.map((e) => e.event)).toEqual(["submit_owner_form", "owner_lead_submit", "generate_lead"])
    expect(window.dataLayer![2]).toMatchObject({ lead_type: "owner_co-hosting" })
  })

  it("fires check_availability with the result", () => {
    trackCheckAvailability({ propertyName: "Sky House", checkIn: "2026-11-01", checkOut: "2026-11-03", guests: 2, available: false })
    expect(window.dataLayer![0]).toMatchObject({ event: "check_availability", availability_result: "unavailable" })
  })
})

describe("POST /api/leads", () => {
  const makeRequest = (body: unknown, ip: string) =>
    new NextRequest("http://localhost/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify(body),
    })

  it("returns a lead id for a valid lead even when no sink is configured", async () => {
    const res = await postLead(makeRequest(eventLead, "10.0.0.1"))
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.leadId).toMatch(/^KH-EVT-/)
    expect(data.stored).toBe(false)
  })

  it("rejects unknown targets and invalid payloads with 400", async () => {
    expect((await postLead(makeRequest({ target: "SPAM" }, "10.0.0.2"))).status).toBe(400)
    const res = await postLead(makeRequest({ ...ownerLead, units: 0 }, "10.0.0.2"))
    expect(res.status).toBe(400)
    expect((await res.json()).error).toContain("minimal 1")
  })

  it("rate-limits repeated submissions from one IP", async () => {
    const statuses: number[] = []
    for (let i = 0; i < 6; i++) statuses.push((await postLead(makeRequest(ownerLead, "10.0.0.3"))).status)
    expect(statuses.slice(0, 5).every((s) => s === 201)).toBe(true)
    expect(statuses[5]).toBe(429)
  })
})
