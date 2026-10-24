// Kinghouse — Browser-side lead submission (client components only)
// Posts the form to /api/leads, fires the funnel analytics events and hands
// the summary to /thanks through sessionStorage (never through the URL, so
// names and phone numbers do not end up in analytics page paths).

import type { EventLeadInput, LeadInput, OwnerLeadInput, StayLeadInput } from "@/lib/validations"
import { trackLeadFormSubmit } from "@/lib/analytics"
import { getLeadSource } from "./lead-source"
import { buildLeadWhatsAppUrl, generateLeadId, getLeadNeed, summarizeLead } from "./lead"
import type { LeadTarget } from "./config"

const THANKS_KEY = "kh_last_lead"

export interface ThanksPayload {
  leadId: string
  target: LeadTarget
  name: string
  summary: { label: string; value: string }[]
  whatsappUrl: string
  propertySlug?: string
}

export interface SubmitLeadResult {
  ok: boolean
  leadId: string
  error?: string
}

export type LeadDraft =
  | Omit<OwnerLeadInput, "source">
  | Omit<EventLeadInput, "source">
  | Omit<StayLeadInput, "source">

export async function submitLead(draft: LeadDraft, opts: { propertySlug?: string } = {}): Promise<SubmitLeadResult> {
  const lead = { ...draft, source: getLeadSource() } as LeadInput

  let leadId: string | undefined
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    })
    const data = (await res.json().catch(() => ({}))) as { leadId?: string; error?: string }
    if (res.status === 400 || res.status === 429) {
      return { ok: false, leadId: "", error: data.error || "Data belum valid, mohon periksa kembali." }
    }
    leadId = data.leadId
  } catch {
    // Network failure — the WhatsApp button on /thanks still carries the full summary.
  }

  const finalId = leadId || generateLeadId(lead.target)

  trackLeadFormSubmit({
    target: lead.target,
    need: getLeadNeed(lead),
    leadId: finalId,
    propertyName: "property" in lead ? lead.property : undefined,
  })

  const payload: ThanksPayload = {
    leadId: finalId,
    target: lead.target,
    name: lead.name,
    summary: summarizeLead(lead),
    whatsappUrl: buildLeadWhatsAppUrl(lead, finalId),
    propertySlug: opts.propertySlug,
  }
  try {
    window.sessionStorage.setItem(THANKS_KEY, JSON.stringify(payload))
  } catch {
    // Storage blocked — /thanks falls back to its generic confirmation.
  }

  return { ok: true, leadId: finalId }
}

export function readThanksPayload(): ThanksPayload | null {
  try {
    const raw = window.sessionStorage.getItem(THANKS_KEY)
    return raw ? (JSON.parse(raw) as ThanksPayload) : null
  } catch {
    return null
  }
}
