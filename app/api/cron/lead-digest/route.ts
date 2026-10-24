import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { buildLeadDigest, formatLeadDigest, type DigestLeadRow } from "@/lib/funnel/digest"
import { sendTelegramMessage } from "@/lib/funnel/notify"

const DIGEST_COLUMNS =
  "id, created_at, target, need, name, whatsapp, status, priority, pic, first_response_due_at, first_response_at, last_contact_at"

/**
 * Weekday-morning digest of leads past their deadline, sent to the team's
 * Telegram group. Triggered by Vercel Cron (see vercel.json), which sends
 * `Authorization: Bearer $CRON_SECRET` — the route refuses to run without it.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi." }, { status: 503 })
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const [open, recent] = await Promise.all([
    supabase.from("leads").select(DIGEST_COLUMNS).in("status", ["Baru", "Penawaran terkirim", "Tanggal ditahan"]).limit(500),
    supabase.from("leads").select(DIGEST_COLUMNS).gte("created_at", since).limit(500),
  ])

  if (open.error || recent.error) {
    console.warn("Lead digest query failed:", open.error?.message || recent.error?.message)
    return NextResponse.json({ error: "Gagal membaca tabel leads." }, { status: 500 })
  }

  const now = new Date()
  const digest = buildLeadDigest((open.data ?? []) as DigestLeadRow[], (recent.data ?? []) as DigestLeadRow[], now)
  const sent = await sendTelegramMessage(formatLeadDigest(digest, now))

  return NextResponse.json({
    success: true,
    sent,
    overdueFirstReply: digest.overdueFirstReply.length,
    followUpDue: digest.followUpDue.length,
    holdsToCheck: digest.holdsToCheck.length,
    newLast24h: digest.newLast24h,
  })
}
