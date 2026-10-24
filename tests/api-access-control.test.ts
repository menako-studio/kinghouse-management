import { describe, it, expect, afterEach, vi } from "vitest"
import { NextRequest } from "next/server"
import { GET as getReservations } from "@/app/api/erp/reservations/route"
import { GET as getExpenses } from "@/app/api/erp/expenses/route"
import { GET as icalSync } from "@/app/api/erp/ical-sync/route"

const req = (url: string, headers: Record<string, string> = {}) => new NextRequest(`http://localhost${url}`, { headers })

describe("Admin-only ERP data", () => {
  it("does not expose reservations (guest contact details) without an admin session", async () => {
    expect((await getReservations(req("/api/erp/reservations"))).status).toBe(401)
  })

  it("does not expose owner expenses without an admin session", async () => {
    expect((await getExpenses(req("/api/erp/expenses"))).status).toBe(401)
  })
})

describe("iCal sync cron trigger", () => {
  afterEach(() => vi.unstubAllEnvs())

  it("rejects a public sync-all once CRON_SECRET is set", async () => {
    vi.stubEnv("CRON_SECRET", "s3cret")
    expect((await icalSync(req("/api/erp/ical-sync?action=sync-all"))).status).toBe(401)
    expect((await icalSync(req("/api/erp/ical-sync?action=sync-all", { authorization: "Bearer wrong" }))).status).toBe(401)
  })
})
