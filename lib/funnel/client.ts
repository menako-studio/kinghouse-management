// Kinghouse — Browser-side lead submission (client components only)
// Posts the form to /api/leads, fires the funnel analytics events and hands
// the summary to /thanks through sessionStorage (never through the URL, so
// names and phone numbers do not end up in analytics page paths).

import type { EventLeadInput, LeadInput, OwnerLeadInput, StayLeadInput } from "@/lib/validations"
import type { LanguageCode } from "@/lib/context/localization-context"
import { trackLeadFormSubmit } from "@/lib/analytics"
import { getLeadSource } from "./lead-source"
import { generateLeadId, getLeadNeed } from "./lead"

const THANKS_KEY = "kh_last_lead"

/** What /thanks needs to render the summary and WhatsApp link in the visitor's language. */
export interface ThanksPayload {
  leadId: string
  lead: LeadInput
  propertySlug?: string
}

export interface SubmitLeadResult {
  ok: boolean
  leadId: string
  /** i18n key of the message to show when ok is false */
  errorKey?: LeadErrorKey
}

export type LeadDraft =
  | Omit<OwnerLeadInput, "source">
  | Omit<EventLeadInput, "source">
  | Omit<StayLeadInput, "source">

export type LeadErrorKey = "f.errorInvalid" | "f.errorRateLimited" | "f.errorGeneric"

export async function submitLead(
  draft: LeadDraft,
  opts: { language: LanguageCode; propertySlug?: string }
): Promise<SubmitLeadResult> {
  const lead = { ...draft, language: opts.language, source: getLeadSource() } as LeadInput

  let leadId: string | undefined
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    })
    const data = (await res.json().catch(() => ({}))) as { leadId?: string }
    if (res.status === 429) return { ok: false, leadId: "", errorKey: "f.errorRateLimited" }
    if (res.status === 400) return { ok: false, leadId: "", errorKey: "f.errorInvalid" }
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

  // Keep tracking fields out of the stored copy.
  const leadForThanks: Partial<LeadInput> = { ...lead }
  delete leadForThanks.source
  delete leadForThanks.website
  const payload: ThanksPayload = {
    leadId: finalId,
    lead: leadForThanks as LeadInput,
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
