import { describe, it, expect, afterEach, vi } from "vitest"
import { NextRequest } from "next/server"
import { GET as getDynamicPricing } from "@/app/api/erp/dynamic-pricing/route"
import { GET as icalSync } from "@/app/api/erp/ical-sync/route"
import { DELETE as deleteBlog } from "@/app/api/blog/route"
import { GET as getReservations } from "@/app/api/erp/reservations/route"
import { SESSION_COOKIE_NAME, signAdminSessionToken } from "@/lib/auth"
import { isCronRequest, isSameOriginRequest } from "@/lib/auth-server"
import { formatInlineMarkdown, safeHref } from "@/lib/blog/inline-markdown"
import { serializeJsonLd } from "@/lib/security/json-ld"
import { generateIcalFeed } from "@/lib/ical/generator"
import { isSafeIdentifier } from "@/lib/validations"
import { CURATED_VILLAS } from "@/lib/data"
import type { Reservation } from "@/lib/erp/types"

type Init = { method?: string; headers?: Record<string, string> }
const req = (url: string, init: Init = {}) =>
  new NextRequest(`http://localhost${url}`, { method: init.method, headers: init.headers })

async function adminCookie(): Promise<string> {
  const token = await signAdminSessionToken({
    id: "admin-test",
    email: "info@kinghousemanagement.com",
    name: "Test",
    role: "admin",
  })
  return `${SESSION_COOKIE_NAME}=${token}`
}

describe("Admin-only endpoints that used to be public", () => {
  afterEach(() => vi.unstubAllEnvs())

  it("dynamic pricing (owner revenue, yield, occupancy) needs an admin session", async () => {
    expect((await getDynamicPricing(req("/api/erp/dynamic-pricing"))).status).toBe(401)
    expect((await getDynamicPricing(req("/api/erp/dynamic-pricing?sync=true"))).status).toBe(401)
  })

  it("iCal sync-all fails closed when CRON_SECRET is not set", async () => {
    vi.stubEnv("CRON_SECRET", "")
    expect((await icalSync(req("/api/erp/ical-sync?action=sync-all"))).status).toBe(401)
  })

  it("iCal feed configuration listing needs admin or cron", async () => {
    expect((await icalSync(req("/api/erp/ical-sync"))).status).toBe(401)
  })

  it("accepts the cron only with the exact secret, compared in constant time", () => {
    vi.stubEnv("CRON_SECRET", "a-long-cron-secret-value")
    expect(isCronRequest(req("/x", { headers: { authorization: "Bearer a-long-cron-secret-value" } }))).toBe(true)
    expect(isCronRequest(req("/x", { headers: { authorization: "Bearer a-long-cron-secret-valuX" } }))).toBe(false)
    expect(isCronRequest(req("/x"))).toBe(false)
    vi.stubEnv("CRON_SECRET", "short")
    expect(isCronRequest(req("/x", { headers: { authorization: "Bearer short" } }))).toBe(false)
  })
})

describe("CSRF: cookie-authenticated writes must come from this site", () => {
  it("rejects a cross-site DELETE that carries a valid admin cookie", async () => {
    const cookie = await adminCookie()
    const res = await deleteBlog(
      req("/api/blog?id=post-1", { method: "DELETE", headers: { cookie, origin: "https://evil.example", host: "localhost" } })
    )
    expect(res.status).toBe(401)
  })

  it("allows same-origin writes and safe methods", () => {
    expect(isSameOriginRequest(req("/x", { method: "POST", headers: { origin: "http://localhost", host: "localhost" } }))).toBe(true)
    expect(isSameOriginRequest(req("/x", { method: "GET", headers: { origin: "https://evil.example" } }))).toBe(true)
    expect(isSameOriginRequest(req("/x", { method: "POST", headers: { origin: "https://evil.example", host: "localhost" } }))).toBe(false)
  })
})

describe("PostgREST filter injection", () => {
  it("only accepts plain identifiers", () => {
    expect(isSafeIdentifier("RES-1234")).toBe(true)
    expect(isSafeIdentifier("versatile-house_01")).toBe(true)
    expect(isSafeIdentifier("x,status.eq.Draft")).toBe(false)
    expect(isSafeIdentifier("a)or(id.neq.0")).toBe(false)
    expect(isSafeIdentifier("")).toBe(false)
  })

  it("rejects a crafted propertyId on reservations even for an admin", async () => {
    const cookie = await adminCookie()
    const res = await getReservations(req("/api/erp/reservations?propertyId=x,guest_name.neq.null", { headers: { cookie } }))
    expect(res.status).toBe(400)
  })
})

describe("Stored XSS in blog content", () => {
  it("escapes raw HTML in paragraphs", () => {
    const html = formatInlineMarkdown(`Hello <img src=x onerror=alert(1)> <script>alert(1)</script>`)
    expect(html).not.toContain("<img")
    expect(html).not.toContain("<script")
    expect(html).toContain("&lt;script&gt;")
  })

  it("drops javascript: and data: links but keeps safe ones", () => {
    expect(formatInlineMarkdown("[click](javascript:alert(1))")).not.toContain("href")
    expect(formatInlineMarkdown("[x](data:text/html,hi)")).not.toContain("href")
    expect(formatInlineMarkdown("[x](//evil.example)")).not.toContain("href")
    expect(formatInlineMarkdown("[Villas](/villas)")).toContain("href='/villas'")
    expect(formatInlineMarkdown("[Airbnb](https://airbnb.com)")).toContain("rel='noopener noreferrer nofollow'")
    expect(formatInlineMarkdown("**bold**")).toContain("<strong")
  })

  it("cannot break out of the href attribute", () => {
    const html = formatInlineMarkdown("[x](https://a.com/'onmouseover='alert(1))")
    expect(html).not.toMatch(/'onmouseover='/)
    expect(safeHref("  ")).toBeNull()
  })

  it("JSON-LD cannot close its <script> tag", () => {
    const out = serializeJsonLd({ headline: "</script><script>alert(1)</script>" })
    expect(out).not.toContain("</script>")
    expect(JSON.parse(out).headline).toBe("</script><script>alert(1)</script>")
  })
})

describe("Public OTA iCal feed", () => {
  it("publishes blocked dates only, not booking refs or guest counts", () => {
    const res = {
      id: "RES-SECRET-42",
      checkIn: "2026-10-01",
      checkOut: "2026-10-04",
      channel: "Airbnb",
      guests: 5,
      guestName: "Private Person",
    } as unknown as Reservation
    const ics = generateIcalFeed(CURATED_VILLAS[0], [res])
    expect(ics).not.toContain("Private Person")
    expect(ics).not.toContain("5 guests")
    expect(ics).not.toContain("Booking Ref")
    expect(ics).toContain("DTSTART;VALUE=DATE:20261001")
  })
})
