import { describe, it, expect, vi, afterEach } from "vitest"

describe("supabase schema fallback", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it("retries on public when the configured schema is not exposed", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_SCHEMA", "kinghouse")
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('{"message":"Invalid schema: kinghouse"}', { status: 406 }))
      .mockResolvedValueOnce(new Response("[]", { status: 200 }))
    vi.stubGlobal("fetch", fetchMock)
    const { fetchWithSchemaFallback } = await import("@/lib/supabase/server")

    const res = await fetchWithSchemaFallback("https://x.supabase.co/rest/v1/reservations", {
      headers: { "Accept-Profile": "kinghouse" },
    })

    expect(res.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(new Headers(fetchMock.mock.calls[1][1].headers).get("Accept-Profile")).toBe("public")
  })

  it("does not retry unrelated errors", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_SCHEMA", "kinghouse")
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"message":"boom"}', { status: 406 }))
    vi.stubGlobal("fetch", fetchMock)
    const { fetchWithSchemaFallback } = await import("@/lib/supabase/server")

    await fetchWithSchemaFallback("https://x.supabase.co/rest/v1/reservations", {})
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
