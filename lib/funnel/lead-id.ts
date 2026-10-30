// Lead id and need tag, kept apart from ./lead so the browser form code does not
// pull in the translators (and every language's dictionary) that ./lead needs.

import type { LeadInput } from "@/lib/validations"
import type { LeadTarget } from "./config"

const TARGET_PREFIX: Record<LeadTarget, string> = { OWNER: "OWN", STAY: "STY", EVENT: "EVT" }

export function generateLeadId(target: LeadTarget, now: Date = new Date()): string {
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, "")
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `KH-${TARGET_PREFIX[target]}-${ymd}-${rand}`
}

/** Need tag: the owner service or the event type. */
export function getLeadNeed(lead: LeadInput): string {
  if (lead.target === "OWNER") return lead.service
  if (lead.target === "EVENT") return lead.eventType
  return lead.need
}
