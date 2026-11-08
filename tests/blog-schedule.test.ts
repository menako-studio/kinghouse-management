import { existsSync } from "node:fs"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { formatPublishWib, isLive, isoToWib, isScheduled, publishInstant, wibToIso } from "@/lib/blog/schedule"
import { getBlogPostBySlug, getBlogPosts } from "@/lib/blog/service"
import { SCHEDULED_POSTS } from "@/lib/blog/scheduled"
import { BLOG_POSTS } from "@/lib/blog/posts"
import { CURATED_VILLAS, VILLA_EVENTS } from "@/lib/data"

describe("publish time", () => {
  it("date-only values go live at 07:00 WIB", () => {
    expect(publishInstant("2026-11-16").toISOString()).toBe("2026-11-16T00:00:00.000Z")
  })

  it("round-trips dashboard date + time in Jakarta time", () => {
    const iso = wibToIso("2026-12-06", "19:30")
    expect(iso).toBe("2026-12-06T12:30:00.000Z")
    expect(isoToWib(iso)).toEqual({ date: "2026-12-06", time: "19:30" })
    expect(formatPublishWib(iso)).toBe("6 Des 2026, 19:30 WIB")
  })

  it("is scheduled before, live after, and drafts are never live", () => {
    const post = { publishedAt: "2026-11-16T07:00:00+07:00", status: "Published" }
    expect(isScheduled(post, new Date("2026-11-15T23:59:00Z"))).toBe(true)
    expect(isLive(post, new Date("2026-11-15T23:59:00Z"))).toBe(false)
    expect(isLive(post, new Date("2026-11-16T00:00:00Z"))).toBe(true)
    expect(isLive({ ...post, status: "Draft" }, new Date("2027-01-01"))).toBe(false)
  })
})

describe("editorial calendar visibility", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  const first = SCHEDULED_POSTS.find((p) => p.slug === "persiapan-airbnb-libur-natal-tahun-baru")!

  it("hides scheduled posts from public listings and their URL until publish time", async () => {
    vi.setSystemTime(new Date("2026-11-10T00:00:00Z"))
    const slugs = (await getBlogPosts()).map((p) => p.slug)
    for (const p of SCHEDULED_POSTS) expect(slugs).not.toContain(p.slug)
    expect(await getBlogPostBySlug(first.slug)).toBeNull()
    // The dashboard (admin) still sees them
    expect((await getBlogPosts({ visibility: "admin" })).map((p) => p.slug)).toContain(first.slug)
    expect(await getBlogPostBySlug(first.slug, { visibility: "admin" })).not.toBeNull()
  })

  it("publishes each article on its own date", async () => {
    vi.setSystemTime(new Date("2026-11-16T00:00:01Z")) // 07:00:01 WIB
    const slugs = (await getBlogPosts()).map((p) => p.slug)
    expect(slugs).toContain(first.slug)
    expect(slugs).not.toContain("biaya-jasa-kelola-airbnb-jakarta")
    expect(await getBlogPostBySlug(first.slug)).not.toBeNull()

    vi.setSystemTime(new Date("2026-12-16T00:00:01Z"))
    const all = (await getBlogPosts()).map((p) => p.slug)
    for (const p of SCHEDULED_POSTS) expect(all).toContain(p.slug)
  })

  it("spreads the campaign over 16 Nov – 16 Dec with unique slugs and internal links that exist", () => {
    const dates = SCHEDULED_POSTS.map((p) => publishInstant(p.publishedAt).toISOString().slice(0, 10)).sort()
    expect(dates).toEqual(["2026-11-16", "2026-11-26", "2026-12-06", "2026-12-16"])
    expect(new Set(SCHEDULED_POSTS.map((p) => p.slug)).size).toBe(SCHEDULED_POSTS.length)
    const routes = new Set([
      "/owner-services",
      "/management-inquiry",
      "/events",
      "/villas",
      "/airbnb-cleaning-jakarta",
      ...VILLA_EVENTS.map((e) => `/events/${e.slug}`),
      ...BLOG_POSTS.map((b) => `/blog/${b.slug}`),
      ...CURATED_VILLAS.map((v) => `/locations/${v.areaSlug}/villas/${v.slug}`),
    ])
    for (const p of SCHEDULED_POSTS) {
      const links = [...p.content.matchAll(/\]\((\/[^)#]*)/g)].map((m) => m[1])
      expect(links.length).toBeGreaterThan(1)
      for (const link of links) {
        if (link.startsWith("/properties/")) expect(existsSync(`public${link}`), `${p.slug} → ${link}`).toBe(true)
        else expect(routes, `${p.slug} → ${link}`).toContain(link)
      }
      expect(existsSync(`public${p.heroImage}`)).toBe(true)
      expect(p.seoTitle!.length).toBeLessThanOrEqual(60)
      expect(p.metaDescription!.length).toBeLessThanOrEqual(160)
    }
  })
})
