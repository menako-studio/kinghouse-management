import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { NextRequest } from "next/server"
import { EventLeadSchema, OwnerLeadSchema, StayLeadSchema } from "@/lib/validations"
import { addBusinessMinutes, formatWib } from "@/lib/funnel/config"
import { buildLeadRecord, firstReplyMessage, normalizeWhatsAppNumber, summarizeLead } from "@/lib/funnel/lead"
import { buildLeadNotification, notifyTeamOfLead } from "@/lib/funnel/notify"
import { buildLeadDigest, formatLeadDigest, type DigestLeadRow } from "@/lib/funnel/digest"
import { getLiveBookedRanges } from "@/lib/ical/live-calendar"
import { CURATED_VILLAS } from "@/lib/data"
import { GET as leadDigest } from "@/app/api/cron/lead-digest/route"
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

  it("fills the owner template from the form", () => {
    expect(firstReplyMessage(owner)).toContain("Untuk villa Kakak di Jagakarsa, layanan Co-Hosting cocok jika Kakak ingin tetap memegang properti")
    expect(firstReplyMessage(owner)).toContain("[hari/jam 1]")
  })

  it("does not ask event clients again what the form already answered", () => {
    expect(firstReplyMessage(event)).toContain("tanggal 20 Des 2026 (16:00–22:00, 35 tamu)")
    expect(firstReplyMessage(event)).toContain("apakah ada vendor atau dekorasi sendiri")
    expect(firstReplyMessage({ ...event, ownVendor: true })).not.toContain("vendor atau dekorasi sendiri")
  })

  it("uses a waiting-list reply for stay notify leads", () => {
    const stay = StayLeadSchema.parse({
      target: "STAY", need: "notify", name: "Ana", whatsapp: "081200000002",
      property: "Sky House", checkIn: "2026-11-10", checkOut: "2026-11-12", guests: 2,
    })
    expect(firstReplyMessage(stay)).toContain("akan kabari begitu tanggalnya kosong")
  })
})

describe("Team notification", () => {
  const now = wib("2026-10-21T10:00:00")
  const record = buildLeadRecord(owner, now)

  it("builds an escaped Telegram message with deadline, team, source and a reply link", () => {
    const n = buildLeadNotification(record, summarizeLead(owner), owner)
    expect(n.html).toContain("PRIORITAS")
    expect(n.html).toContain("Rina &lt;b&gt;Wijaya&lt;/b&gt;")
    expect(n.html).toContain("11.00 WIB")
    expect(n.html).toContain("Owner relations")
    expect(n.html).toContain("instagram / bio")
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

    it("posts to Telegram with an inline WhatsApp button and to the webhook", async () => {
      vi.stubEnv("TELEGRAM_BOT_TOKEN", "123:abc")
      vi.stubEnv("TELEGRAM_CHAT_ID", "-100200")
      vi.stubEnv("LEAD_WEBHOOK_URL", "https://hooks.example/lead")
      const result = await notifyTeamOfLead(record, summarizeLead(owner), owner)
      expect(result).toEqual({ telegram: true, webhook: true })

      const [tgUrl, tgInit] = fetchMock.mock.calls.find(([u]) => String(u).includes("api.telegram.org"))!
      expect(tgUrl).toBe("https://api.telegram.org/bot123:abc/sendMessage")
      const tg = JSON.parse(tgInit.body)
      expect(tg).toMatchObject({ chat_id: "-100200", parse_mode: "HTML" })
      expect(tg.reply_markup.inline_keyboard[0][0].url).toContain("https://wa.me/6281234567890")

      const hook = JSON.parse(fetchMock.mock.calls.find(([u]) => u === "https://hooks.example/lead")![1].body)
      expect(hook.reply_whatsapp_url).toContain("wa.me/6281234567890")
    })

    it("skips channels that are not configured", async () => {
      expect(await notifyTeamOfLead(record, summarizeLead(owner), owner)).toEqual({ telegram: false, webhook: false })
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })
})

describe("Daily lead digest", () => {
  const now = wib("2026-10-22T08:05:00")
  const row = (over: Partial<DigestLeadRow>): DigestLeadRow => ({
    id: "KH-1", created_at: "2026-10-21T03:00:00.000Z", target: "OWNER", need: "co-hosting", name: "A",
    whatsapp: "08120000", status: "Baru", priority: false, pic: null,
    first_response_due_at: "2026-10-21T04:00:00.000Z", first_response_at: null, last_contact_at: null, ...over,
  })

  it("lists overdue first replies, due follow-ups and stale date holds", () => {
    const open = [
      row({ id: "late", priority: true }),
      row({ id: "answered", first_response_at: "2026-10-21T03:30:00.000Z" }),
      row({ id: "not-yet", first_response_due_at: "2026-10-22T05:00:00.000Z" }),
      row({ id: "fu", status: "Penawaran terkirim", last_contact_at: "2026-10-20T09:00:00.000Z" }),
      row({ id: "fu-fresh", status: "Penawaran terkirim", last_contact_at: "2026-10-21T22:00:00.000Z" }),
      row({ id: "hold", status: "Tanggal ditahan", target: "EVENT", last_contact_at: "2026-10-20T09:00:00.000Z" }),
    ]
    const digest = buildLeadDigest(open, [row({ target: "STAY" }), row({ target: "EVENT" })], now)
    expect(digest.overdueFirstReply.map((r) => r.id)).toEqual(["late"])
    expect(digest.followUpDue.map((r) => r.id)).toEqual(["fu"])
    expect(digest.holdsToCheck.map((r) => r.id)).toEqual(["hold"])
    expect(digest.newLast24h).toEqual({ OWNER: 0, STAY: 1, EVENT: 1 })

    const text = formatLeadDigest(digest, now)
    expect(text).toContain("Belum dibalas, lewat batas (1)")
    expect(text).toContain('href="https://wa.me/628120000"')
  })

  it("says so when nothing is pending", () => {
    expect(formatLeadDigest(buildLeadDigest([], [], now), now)).toContain("Tidak ada lead tertunda")
  })

  it("refuses to run without the cron secret", async () => {
    vi.stubEnv("CRON_SECRET", "s3cret")
    const req = (auth?: string) =>
      new NextRequest("http://localhost/api/cron/lead-digest", { headers: auth ? { authorization: auth } : {} })
    expect((await leadDigest(req())).status).toBe(401)
    expect((await leadDigest(req("Bearer wrong"))).status).toBe(401)
    vi.unstubAllEnvs()
    expect((await leadDigest(req("Bearer undefined"))).status).toBe(401)
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
