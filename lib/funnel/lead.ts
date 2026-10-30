// Kinghouse — Lead records shared by the form, /api/leads and /thanks
// Every lead carries the same tags from the start: target (OWNER/STAY/EVENT),
// need (service or event type), source (UTM) and the follow-up team.

import type { EventLeadInput, LeadInput, OwnerLeadInput, StayLeadInput } from "@/lib/validations"
import type { LanguageCode } from "@/lib/context/localization-context"
import { createTranslator, formatDateFor, type FunnelKey } from "@/lib/i18n/funnel"
import {
  EVENT_VENUE_UNDECIDED,
  RESPONSE_TARGETS,
  addBusinessMinutes,
  eventTypeLabelKey,
  ownerServiceLabelKey,
  routeOwnerService,
  type LeadRoute,
  type LeadTarget,
} from "./config"
import {
  buildWhatsAppUrl,
  eventWhatsAppMessage,
  ownerWhatsAppMessage,
  stayWhatsAppMessage,
  type MessageLocale,
} from "./whatsapp"
import { generateLeadId, getLeadNeed } from "./lead-id"

export { generateLeadId, getLeadNeed }

/** The Kinghouse team works in Indonesian: internal records and notifications use it. */
export const TEAM_LOCALE: MessageLocale = { t: createTranslator("ID"), language: "ID" }

export function localeFor(language: LanguageCode | undefined): MessageLocale {
  const lang = language ?? "EN"
  return { t: createTranslator(lang), language: lang }
}

/** Pipeline statuses, in order. New leads always start at "Baru". */
export const LEAD_STATUSES = [
  "Baru",
  "Dikualifikasi",
  "Penawaran terkirim",
  "Tanggal ditahan",
  "Booking / Kontrak",
  "Batal",
] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

/** Row shape of the `leads` table / Sheet (see supabase/schema.sql). */
export interface LeadRecord {
  id: string
  created_at: string
  target: LeadTarget
  need: string
  name: string
  whatsapp: string
  email: string | null
  event_date: string | null
  check_out: string | null
  guests_or_units: number | null
  property: string | null
  status: LeadStatus
  priority: boolean
  route_to: LeadRoute
  pic: string | null
  first_response_due_at: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  referrer: string | null
  landing_page: string | null
  details: Record<string, unknown>
  notes: string | null
}


/** Venue shown to people: the "undecided" token becomes readable text. */
function venueName(property: string, { t }: MessageLocale): string {
  return property === EVENT_VENUE_UNDECIDED ? t("f.ef.venueUndecided") : property
}


/**
 * High-value owner leads (several units, or a property already earning on an
 * OTA) are flagged priority so they jump the PIC's daily list.
 */
export function isPriorityLead(lead: LeadInput): boolean {
  if (lead.target === "OWNER") return lead.units >= 3 || lead.propertyStatus === "ota-live"
  if (lead.target === "EVENT") return lead.eventType === "wedding" || lead.guests >= 30
  return false
}

export function getLeadRoute(lead: LeadInput): LeadRoute {
  if (lead.target === "OWNER") return routeOwnerService(lead.service)
  if (lead.target === "EVENT") return "event_sales"
  return "reservations"
}

function ownerDetails(lead: OwnerLeadInput) {
  return {
    service: lead.service,
    property_type: lead.propertyType,
    location: lead.location,
    property_status: lead.propertyStatus,
    language: lead.language ?? "EN",
  }
}

function eventDetails(lead: EventLeadInput) {
  return {
    event_type: lead.eventType,
    backup_date: lead.backupDate || null,
    start_time: lead.startTime,
    end_time: lead.endTime,
    special_needs: lead.specialNeeds,
    wedding_session: lead.weddingSession ?? null,
    own_vendor: lead.ownVendor ?? null,
    early_decoration: lead.earlyDecoration ?? null,
    shoot_purpose: lead.shootPurpose ?? null,
    heavy_equipment: lead.heavyEquipment ?? null,
    language: lead.language ?? "EN",
  }
}

function stayDetails(lead: StayLeadInput) {
  return { need: lead.need, language: lead.language ?? "EN" }
}

export function buildLeadRecord(lead: LeadInput, now: Date = new Date()): LeadRecord {
  const due = addBusinessMinutes(now, RESPONSE_TARGETS[lead.target].minutes)

  const base = {
    id: generateLeadId(lead.target, now),
    created_at: now.toISOString(),
    target: lead.target,
    need: getLeadNeed(lead),
    name: lead.name,
    whatsapp: lead.whatsapp,
    status: "Baru" as const,
    priority: isPriorityLead(lead),
    route_to: getLeadRoute(lead),
    pic: null,
    first_response_due_at: due.toISOString(),
    utm_source: lead.source?.utmSource || null,
    utm_medium: lead.source?.utmMedium || null,
    utm_campaign: lead.source?.utmCampaign || null,
    referrer: lead.source?.referrer || null,
    landing_page: lead.source?.landingPage || null,
  }

  if (lead.target === "OWNER") {
    return {
      ...base,
      email: lead.email || null,
      event_date: null,
      check_out: null,
      guests_or_units: lead.units,
      property: `${TEAM_LOCALE.t(`f.owner.type.${lead.propertyType}` as FunnelKey)} — ${lead.location}`,
      details: ownerDetails(lead),
      notes: null,
    }
  }

  if (lead.target === "EVENT") {
    return {
      ...base,
      email: null,
      event_date: lead.eventDate,
      check_out: null,
      guests_or_units: lead.guests,
      property: venueName(lead.property, TEAM_LOCALE),
      details: eventDetails(lead),
      notes: lead.notes || null,
    }
  }

  return {
    ...base,
    email: null,
    event_date: lead.checkIn,
    check_out: lead.checkOut,
    guests_or_units: lead.guests,
    property: lead.property,
    details: stayDetails(lead),
    notes: null,
  }
}

/**
 * Human-readable summary in the given language: shown on /thanks and in the
 * visitor's WhatsApp message (visitor's language) and sent to the team
 * (TEAM_LOCALE).
 */
export function summarizeLead(lead: LeadInput, locale: MessageLocale = TEAM_LOCALE): { label: string; value: string }[] {
  const { t, language } = locale
  const yesNo = (v: boolean | undefined) => (v === undefined ? undefined : t(v ? "f.yes" : "f.no"))
  const date = (iso: string) => formatDateFor(language, iso)
  const rows: { label: string; value: string | undefined }[] = [{ label: t("f.sum.name"), value: lead.name }]

  if (lead.target === "OWNER") {
    rows.push(
      { label: t("f.sum.service"), value: t(ownerServiceLabelKey(lead.service)) },
      { label: t("f.sum.propertyType"), value: t(`f.owner.type.${lead.propertyType}` as FunnelKey) },
      { label: t("f.sum.location"), value: lead.location },
      { label: t("f.sum.units"), value: String(lead.units) },
      { label: t("f.sum.status"), value: t(`f.owner.status.${lead.propertyStatus}` as FunnelKey) }
    )
  } else if (lead.target === "EVENT") {
    rows.push(
      { label: t("f.sum.eventType"), value: t(eventTypeLabelKey(lead.eventType)) },
      { label: t("f.sum.date"), value: date(lead.eventDate) },
      { label: t("f.sum.backupDate"), value: lead.backupDate ? date(lead.backupDate) : undefined },
      { label: t("f.sum.time"), value: `${lead.startTime}–${lead.endTime}` },
      { label: t(lead.eventType === "shooting" ? "f.sum.crew" : "f.sum.guests"), value: String(lead.guests) },
      { label: t("f.sum.venue"), value: venueName(lead.property, locale) },
      {
        label: t("f.sum.session"),
        value: lead.weddingSession ? t(`f.ef.session.${lead.weddingSession}` as FunnelKey) : undefined,
      },
      { label: t("f.sum.ownVendor"), value: yesNo(lead.ownVendor) },
      { label: t("f.sum.earlyDecoration"), value: yesNo(lead.earlyDecoration) },
      {
        label: t("f.sum.purpose"),
        value: lead.shootPurpose ? t(`f.ef.purpose.${lead.shootPurpose}` as FunnelKey) : undefined,
      },
      { label: t("f.sum.equipment"), value: yesNo(lead.heavyEquipment) },
      {
        label: t("f.sum.needs"),
        value: lead.specialNeeds.length
          ? lead.specialNeeds.map((n) => t(`f.ef.need.${n}` as FunnelKey)).join(", ")
          : undefined,
      },
      { label: t("f.sum.notes"), value: lead.notes || undefined }
    )
  } else {
    rows.push(
      { label: t("f.sum.property"), value: lead.property },
      { label: t("f.sum.checkIn"), value: date(lead.checkIn) },
      { label: t("f.sum.checkOut"), value: date(lead.checkOut) },
      { label: t("f.sum.guests"), value: String(lead.guests) }
    )
  }

  return rows.filter((r): r is { label: string; value: string } => Boolean(r.value))
}

/** Pre-filled WhatsApp follow-up (in the visitor's language) built from the submitted form. */
export function buildLeadWhatsAppUrl(lead: LeadInput, leadId?: string, locale: MessageLocale = localeFor(lead.language)): string {
  const { t } = locale
  let opener: string
  if (lead.target === "OWNER") {
    opener = ownerWhatsAppMessage(
      {
        service: lead.service,
        propertyType: t(`f.owner.type.${lead.propertyType}` as FunnelKey).toLowerCase(),
        location: lead.location,
        units: lead.units,
      },
      locale
    )
  } else if (lead.target === "EVENT") {
    opener = eventWhatsAppMessage(
      {
        eventType: lead.eventType,
        propertyName: lead.property === EVENT_VENUE_UNDECIDED ? undefined : lead.property,
        date: lead.eventDate,
        guests: lead.guests,
      },
      locale
    )
  } else {
    opener = stayWhatsAppMessage(
      { propertyName: lead.property, checkIn: lead.checkIn, checkOut: lead.checkOut, guests: lead.guests },
      locale
    )
  }

  const summary = summarizeLead(lead, locale)
    .map((r) => `• ${r.label}: ${r.value}`)
    .join("\n")

  const message = [opener, "", summary, leadId ? `\n${t("f.wa.ref", { id: leadId })}` : ""].join("\n").trim()

  return buildWhatsAppUrl(lead.target, message)
}

/** "0812-3456-7890" / "+62 812…" / "812…" → "62812…" for wa.me links. */
export function normalizeWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, "")
  if (digits.startsWith("62")) return digits
  if (digits.startsWith("0")) return `62${digits.slice(1)}`
  if (digits.startsWith("8")) return `62${digits}`
  return digits
}

/**
 * The first admin reply from the response guide, in the lead's own language,
 * pre-filled with what the form already told us. Brackets mark what the admin
 * still fills in. Questions the form already answered are not asked again.
 */
export function firstReplyMessage(lead: LeadInput): string {
  const { t, language } = localeFor(lead.language)
  const name = lead.name.trim().split(/\s+/)[0]
  const date = (iso: string) => formatDateFor(language, iso)

  if (lead.target === "OWNER") {
    return t("f.r.owner", {
      name,
      type: t(`f.owner.type.${lead.propertyType}` as FunnelKey).toLowerCase(),
      location: lead.location,
      pitch: t(`f.r.pitch.${lead.service}` as FunnelKey),
    })
  }

  if (lead.target === "EVENT") {
    const vendorKnown = lead.ownVendor !== undefined || lead.eventType === "shooting"
    return t("f.r.event", {
      name,
      date: date(lead.eventDate),
      start: lead.startTime,
      end: lead.endTime,
      count: t(lead.eventType === "shooting" ? "f.r.eventCrew" : "f.r.eventGuests", { n: lead.guests }),
      type: t(eventTypeLabelKey(lead.eventType)).toLowerCase(),
      vendorQuestion: vendorKnown ? "" : t("f.r.eventVendorQuestion"),
    })
  }

  return t(lead.need === "notify" ? "f.r.stayNotify" : "f.r.stayInquiry", {
    name,
    property: lead.property,
    checkIn: date(lead.checkIn),
    checkOut: date(lead.checkOut),
    guests: lead.guests,
  })
}

/** wa.me link to the lead's own number with the first reply ready to send. */
export function buildFirstReplyUrl(lead: LeadInput): string {
  return `https://wa.me/${normalizeWhatsAppNumber(lead.whatsapp)}?text=${encodeURIComponent(firstReplyMessage(lead))}`
}
