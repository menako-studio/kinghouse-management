import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isCronRequest, verifyAdminRequest } from "@/lib/auth-server"

/**
 * Keeps the Supabase free-tier project from being paused.
 *
 * Supabase pauses free projects after 7 days without activity. Vercel Cron
 * (vercel.json) calls this once a day with `Authorization: Bearer $CRON_SECRET`;
 * it runs one tiny read against the database, which counts as activity.
 * Only the cron or a signed-in admin may call it, and the response carries no data.
 */
export async function GET(request: NextRequest) {
  if (!isCronRequest(request) && !(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ ok: false, reason: "supabase-not-configured" }, { status: 503 })
  }

  const startedAt = Date.now()
  try {
    // HEAD + count: touches the database without returning any rows.
    const { error } = await supabase.from("blog_posts").select("id", { count: "exact", head: true })
    if (error) {
      console.error("[supabase-keepalive] query failed:", error.message)
      return NextResponse.json({ ok: false, reason: "query-failed" }, { status: 502 })
    }
  } catch (err) {
    console.error("[supabase-keepalive] request failed:", err)
    return NextResponse.json({ ok: false, reason: "request-failed" }, { status: 502 })
  }

  return NextResponse.json({ ok: true, latencyMs: Date.now() - startedAt, at: new Date().toISOString() })
}
