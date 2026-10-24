import { NextRequest, NextResponse } from "next/server"
import { EventLeadSchema, OwnerLeadSchema, StayLeadSchema } from "@/lib/validations"
import { buildLeadRecord, summarizeLead, type LeadRecord } from "@/lib/funnel/lead"
import { notifyTeamOfLead } from "@/lib/funnel/notify"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { checkRateLimit } from "@/lib/security/rate-limiter"

const SCHEMAS = {
  OWNER: OwnerLeadSchema,
  EVENT: EventLeadSchema,
  STAY: StayLeadSchema,
} as const

async function saveToSupabase(record: LeadRecord): Promise<boolean> {
  const supabase = getSupabaseServerClient()
  if (!supabase) return false
  try {
    const { error } = await supabase.from("leads").insert(record)
    if (error) {
      console.warn("Supabase lead insert error:", error.message)
      return false
    }
    return true
  } catch (err) {
    console.warn("Supabase lead insert failed:", err)
    return false
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  const limit = checkRateLimit(`lead:${ip}`, 5, 10 * 60 * 1000)
  if (!limit.success) {
    return NextResponse.json(
      { error: `Terlalu banyak pengiriman. Coba lagi dalam ${limit.resetInSeconds} detik atau hubungi kami via WhatsApp.` },
      { status: 429 }
    )
  }

  const body = (await request.json().catch(() => null)) as { target?: string } | null
  const target = body?.target
  if (!body || (target !== "OWNER" && target !== "EVENT" && target !== "STAY")) {
    return NextResponse.json({ error: "Jenis permintaan tidak dikenal." }, { status: 400 })
  }

  const parsed = SCHEMAS[target].safeParse(body)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Data form tidak valid."
    return NextResponse.json({ error: firstError, issues: parsed.error.issues }, { status: 400 })
  }

  const lead = parsed.data
  const record = buildLeadRecord(lead)
  const summary = summarizeLead(lead)

  const [savedToDb, notified] = await Promise.all([saveToSupabase(record), notifyTeamOfLead(record, summary, lead)])

  if (!savedToDb && !notified.webhook) {
    // Nothing configured or both sinks down: the visitor still reaches us through
    // the pre-filled WhatsApp button on /thanks, so keep a server-side trace.
    console.warn(`[lead] ${record.id} not persisted — configure the leads table or LEAD_WEBHOOK_URL.`)
  }

  return NextResponse.json(
    {
      success: true,
      leadId: record.id,
      stored: savedToDb || notified.webhook,
      notified: notified.webhook,
    },
    { status: 201 }
  )
}
