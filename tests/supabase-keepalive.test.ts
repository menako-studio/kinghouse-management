import { describe, it, expect, afterEach, vi } from "vitest"
import { readFileSync } from "node:fs"
import { NextRequest } from "next/server"

const req = (headers: Record<string, string> = {}) =>
  new NextRequest("http://localhost/api/cron/supabase-keepalive", { headers })

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
  vi.doUnmock("@/lib/supabase/server")
})

describe("Supabase keep-alive cron", () => {
  it("is registered as a daily Vercel cron (Hobby allows once a day)", () => {
    const config = JSON.parse(readFileSync("vercel.json", "utf8")) as { crons: { path: string; schedule: string }[] }
    const cron = config.crons.find((c) => c.path === "/api/cron/supabase-keepalive")
    expect(cron).toBeDefined()
    // minute hour * * * — runs once per day, well inside Supabase's 7-day pause window
    expect(cron!.schedule).toMatch(/^\d+ \d+ \* \* \*$/)
  })

  it("rejects callers without the cron secret or an admin session", async () => {
    vi.stubEnv("CRON_SECRET", "a-long-cron-secret-value")
    const { GET } = await import("@/app/api/cron/supabase-keepalive/route")
    expect((await GET(req())).status).toBe(401)
    expect((await GET(req({ authorization: "Bearer wrong" }))).status).toBe(401)
  })

  it("pings the database with a row-less query when called by the cron", async () => {
    vi.stubEnv("CRON_SECRET", "a-long-cron-secret-value")
    const select = vi.fn().mockResolvedValue({ error: null, count: 3 })
    const from = vi.fn(() => ({ select }))
    vi.doMock("@/lib/supabase/server", () => ({ getSupabaseServerClient: () => ({ from }) }))
    const { GET } = await import("@/app/api/cron/supabase-keepalive/route")

    const res = await GET(req({ authorization: "Bearer a-long-cron-secret-value" }))
    expect(res.status).toBe(200)
    expect(from).toHaveBeenCalledWith("blog_posts")
    expect(select).toHaveBeenCalledWith("id", { count: "exact", head: true })
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body).not.toHaveProperty("data")
  })

  it("reports a failed ping without leaking the database error", async () => {
    vi.stubEnv("CRON_SECRET", "a-long-cron-secret-value")
    const select = vi.fn().mockResolvedValue({ error: { message: "relation secret_internal does not exist" } })
    vi.doMock("@/lib/supabase/server", () => ({ getSupabaseServerClient: () => ({ from: () => ({ select }) }) }))
    vi.spyOn(console, "error").mockImplementation(() => {})
    const { GET } = await import("@/app/api/cron/supabase-keepalive/route")

    const res = await GET(req({ authorization: "Bearer a-long-cron-secret-value" }))
    expect(res.status).toBe(502)
    expect(JSON.stringify(await res.json())).not.toContain("secret_internal")
  })
})
