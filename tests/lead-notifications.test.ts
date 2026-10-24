import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { NextRequest } from "next/server"
import { EventLeadSchema, OwnerLeadSchema, StayLeadSchema } from "@/lib/validations"
import { addBusinessMinutes, formatWib } from "@/lib/funnel/config"
import { buildLeadRecord, firstReplyMessage, normalizeWhatsAppNumber, summarizeLead } from "@/lib/funnel/lead"
import { buildLeadNotification, notifyTeamOfLead } from "@/lib/funnel/notify"
import { getLiveBookedRanges } from "@/lib/ical/live-calendar"
import { CURATED_VILLAS } from "@/lib/data"
import { GET as availability } from "@/app/api/availability/route"

const owner = OwnerLeadSchema.parse({
  target: "OWNER",
  name: "Rina <b>Wijaya</b>",
  whatsapp: "0812-3456-7890",
  email: "",
  service: "co-hosting",
  propertyType: "villa",
  location: "Jagakarsa",
  units: 4,
  propertyStatus: "ota-live",
  source: { utmSource: "instagram", utmMedium: "bio" },
})

const event = EventLeadSchema.parse({
  target: "EVENT",
  name: "Dimas Pratama",
  whatsapp: "+62 811 222 333",
  eventType: "gathering",
  eventDate: "2026-12-20",
  startTime: "16:00",
  endTime: "22:00",
  guests: 35,
  property: "Versatile House Jagakarsa",
  specialNeeds: [],
})

const wib = (iso: string) => new Date(`${iso}+07:00`)

describe("Business-hours deadlines (Mon–Fri 08–18 WIB)", () => {
  it("counts only office minutes", () => {
    expect(addBusinessMinutes(wib("2026-10-21T10:00:00"), 60)).toEqual(wib("2026-10-21T11:00:00")) // Wed
    expect(addBusinessMinutes(wib("2026-10-21T17:50:00"), 30)).toEqual(wib("2026-10-22T08:20:00")) // spills to Thu
    expect(addBusinessMinutes(wib("2026-10-23T17:50:00"), 60)).toEqual(wib("2026-10-26T08:50:00")) // Fri → Mon
    expect(addBusinessMinutes(wib("2026-10-21T06:30:00"), 15)).toEqual(wib("2026-10-21T08:15:00")) // before open
    expect(addBusinessMinutes(wib("2026-10-25T13:00:00"), 15)).toEqual(wib("2026-10-26T08:15:00")) // Sunday
  })

  it("formats deadlines in WIB", () => {
    expect(formatWib(wib("2026-10-26T08:50:00"))).toMatch(/26 Okt.*08\.50 WIB/)
  })
})

describe("First admin reply (response guide)", () => {
  it("normalizes Indonesian numbers for wa.me", () => {
    expect(normalizeWhatsAppNumber("0812-3456-7890")).toBe("6281234567890")
    expect(normalizeWhatsAppNumber("+62 811 222 333")).toBe("62811222333")
    expect(normalizeWhatsAppNumber("812345678")).toBe("62812345678")
  })

  it("replies in the lead's language: the plan's Indonesian template for Indonesian leads", () => {
    const idOwner = { ...owner, language: "ID" as const }
    expect(firstReplyMessage(idOwner)).toContain("Untuk villa Kakak di Jagakarsa, layanan Co-Hosting cocok jika Kakak ingin tetap memegang properti")
    expect(firstReplyMessage(idOwner)).toContain("[hari/jam 1]")
    expect(firstReplyMessage(owner)).toContain("For your villa in Jagakarsa, Co-Hosting suits you")
    expect(firstReplyMessage({ ...owner, language: "DE" })).toContain("Hallo Rina")
  })

  it("does not ask event clients again what the form already answered", () => {
    const idEvent = { ...event, language: "ID" as const }
    expect(firstReplyMessage(idEvent)).toContain("tanggal 20 Des 2026 (16:00–22:00, 35 tamu)")
    expect(firstReplyMessage(idEvent)).toContain("apakah ada vendor atau dekorasi sendiri")
    expect(firstReplyMessage({ ...idEvent, ownVendor: true })).not.toContain("vendor atau dekorasi sendiri")
  })

  it("uses a waiting-list reply for stay notify leads", () => {
    const stay = StayLeadSchema.parse({
      target: "STAY", need: "notify", name: "Ana", whatsapp: "081200000002",
      property: "Sky House", checkIn: "2026-11-10", checkOut: "2026-11-12", guests: 2,
    })
    expect(firstReplyMessage(stay)).toContain("will let you know as soon as the dates open up")
    expect(firstReplyMessage({ ...stay, language: "ID" })).toContain("akan kabari begitu tanggalnya kosong")
  })
})

describe("Team notification (webhook)", () => {
  const now = wib("2026-10-21T10:00:00")
  const record = buildLeadRecord(owner, now)

  it("builds the team notification with deadline, team, source and a reply link", () => {
    const n = buildLeadNotification(record, summarizeLead(owner), owner)
    expect(n.text).toContain("PRIORITAS")
    expect(n.text).toContain("11.00 WIB")
    expect(n.text).toContain("Owner relations")
    expect(n.text).toContain("instagram / bio")
    expect(n.replyUrl.startsWith("https://wa.me/6281234567890?text=")).toBe(true)
  })

  describe("delivery", () => {
    const fetchMock = vi.fn()
    beforeEach(() => {
      fetchMock.mockReset().mockResolvedValue(new Response("{}", { status: 200 }))
      vi.stubGlobal("fetch", fetchMock)
    })
    afterEach(() => {
      vi.unstubAllGlobals()
      vi.unstubAllEnvs()
    })

    it("posts the lead, summary and reply link to the webhook", async () => {
      vi.stubEnv("LEAD_WEBHOOK_URL", "https://hooks.example/lead")
      expect(await notifyTeamOfLead(record, summarizeLead(owner), owner)).toEqual({ webhook: true })
      const [url, init] = fetchMock.mock.calls[0]
      expect(url).toBe("https://hooks.example/lead")
      const body = JSON.parse(init.body)
      expect(body.lead.id).toBe(record.id)
      expect(body.reply_whatsapp_url).toContain("wa.me/6281234567890")
    })

    it("does nothing when no webhook is configured", async () => {
      expect(await notifyTeamOfLead(record, summarizeLead(owner), owner)).toEqual({ webhook: false })
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })
})

describe("Live OTA calendar for availability", () => {
  const villa = CURATED_VILLAS.find((v) => v.slug === "sky-house-tangerang")!
  const ics = [
    "BEGIN:VCALENDAR",
    "BEGIN:VEVENT",
    "UID:abc@airbnb.com",
    "DTSTART;VALUE=DATE:20261120",
    "DTEND;VALUE=DATE:20261123",
    "SUMMARY:Reserved",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  afterEach(() => vi.unstubAllGlobals())

  it("reads booked ranges from the villa's iCal feed", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(ics, { status: 200 })))
    const live = await getLiveBookedRanges(villa)
    expect(live).toEqual({ ranges: [{ checkIn: "2026-11-20", checkOut: "2026-11-23" }], feedCount: 1, complete: true })
  })

  it("blocks a booking that only exists on Airbnb and marks the answer verified", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(ics, { status: 200 })))
    const res = await availability(
      new NextRequest("http://localhost/api/availability?villa=sky-house-tangerang&checkIn=2026-11-21&checkOut=2026-11-22", {
        headers: { "x-forwarded-for": "10.1.0.1" },
      })
    )
    const data = await res.json()
    expect(data).toMatchObject({ available: false, verified: true })
    expect(data.alternatives).toEqual([
      { checkIn: "2026-11-19", checkOut: "2026-11-20" },
      { checkIn: "2026-11-23", checkOut: "2026-11-24" },
    ])
  })

  it("does not claim verified availability when the feed is down", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")))
    const res = await availability(
      new NextRequest("http://localhost/api/availability?villa=sky-house-tangerang&checkIn=2026-11-21&checkOut=2026-11-22", {
        headers: { "x-forwarded-for": "10.1.0.2" },
      })
    )
    expect(await res.json()).toMatchObject({ available: true, verified: false })
  })

  it("is never verified for a villa without an OTA feed", async () => {
    const palmerah = CURATED_VILLAS.find((v) => v.slug === "bright-airy-apartment-palmerah")!
    expect(await getLiveBookedRanges(palmerah)).toEqual({ ranges: [], feedCount: 0, complete: false })
  })
})
