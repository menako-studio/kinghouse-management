// Kinghouse — Lead records shared by the form, /api/leads and /thanks
// Every lead carries the same tags from the start: target (OWNER/STAY/EVENT),
// need (service or event type), source (UTM) and the follow-up team.

import type { EventLeadInput, LeadInput, OwnerLeadInput, StayLeadInput } from "@/lib/validations"
import {
  EVENT_SPECIAL_NEEDS,
  OWNER_PROPERTY_STATUSES,
  OWNER_PROPERTY_TYPES,
  RESPONSE_TARGETS,
  addBusinessMinutes,
  getEventTypeLabel,
  getOwnerServiceLabel,
  routeOwnerService,
  type LeadRoute,
  type LeadTarget,
} from "./config"
import {
  buildWhatsAppUrl,
  eventWhatsAppMessage,
  formatDateId,
  ownerWhatsAppMessage,
  stayWhatsAppMessage,
} from "./whatsapp"

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

const TARGET_PREFIX: Record<LeadTarget, string> = { OWNER: "OWN", STAY: "STY", EVENT: "EVT" }

export function generateLeadId(target: LeadTarget, now: Date = new Date()): string {
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, "")
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `KH-${TARGET_PREFIX[target]}-${ymd}-${rand}`
}

function labelOf<T extends { id: string; label: string }>(list: readonly T[], id: string): string {
  return list.find((i) => i.id === id)?.label ?? id
}

/** Need tag: the owner service or the event type. */
export function getLeadNeed(lead: LeadInput): string {
  if (lead.target === "OWNER") return lead.service
  if (lead.target === "EVENT") return lead.eventType
  return lead.need
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
  }
}

function stayDetails(lead: StayLeadInput) {
  return { need: lead.need }
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
      property: `${labelOf(OWNER_PROPERTY_TYPES, lead.propertyType)} — ${lead.location}`,
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
      property: lead.property,
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

const yesNo = (v: boolean | undefined) => (v === undefined ? undefined : v ? "Ya" : "Tidak")

/** Human-readable summary, shown on /thanks and sent in the WhatsApp follow-up. */
export function summarizeLead(lead: LeadInput): { label: string; value: string }[] {
  const rows: { label: string; value: string | undefined }[] = [{ label: "Nama", value: lead.name }]

  if (lead.target === "OWNER") {
    rows.push(
      { label: "Layanan", value: getOwnerServiceLabel(lead.service) },
      { label: "Jenis properti", value: labelOf(OWNER_PROPERTY_TYPES, lead.propertyType) },
      { label: "Lokasi", value: lead.location },
      { label: "Kamar/unit", value: String(lead.units) },
      { label: "Status", value: labelOf(OWNER_PROPERTY_STATUSES, lead.propertyStatus) }
    )
  } else if (lead.target === "EVENT") {
    rows.push(
      { label: "Jenis acara", value: getEventTypeLabel(lead.eventType) },
      { label: "Tanggal", value: formatDateId(lead.eventDate) },
      { label: "Tanggal cadangan", value: lead.backupDate ? formatDateId(lead.backupDate) : undefined },
      { label: "Jam", value: `${lead.startTime}–${lead.endTime}` },
      { label: lead.eventType === "shooting" ? "Jumlah kru" : "Jumlah tamu", value: String(lead.guests) },
      { label: "Properti", value: lead.property },
      { label: "Sesi", value: lead.weddingSession },
      { label: "Vendor sendiri", value: yesNo(lead.ownVendor) },
      { label: "Dekorasi sejak pagi", value: yesNo(lead.earlyDecoration) },
      { label: "Tujuan shooting", value: lead.shootPurpose },
      { label: "Peralatan besar", value: yesNo(lead.heavyEquipment) },
      {
        label: "Kebutuhan khusus",
        value: lead.specialNeeds.length
          ? lead.specialNeeds.map((n) => labelOf(EVENT_SPECIAL_NEEDS, n)).join(", ")
          : undefined,
      },
      { label: "Catatan", value: lead.notes || undefined }
    )
  } else {
    rows.push(
      { label: "Properti", value: lead.property },
      { label: "Check-in", value: formatDateId(lead.checkIn) },
      { label: "Check-out", value: formatDateId(lead.checkOut) },
      { label: "Jumlah tamu", value: String(lead.guests) }
    )
  }

  return rows.filter((r): r is { label: string; value: string } => Boolean(r.value))
}

/** Pre-filled WhatsApp follow-up built from the submitted form. */
export function buildLeadWhatsAppUrl(lead: LeadInput, leadId?: string): string {
  let opener: string
  if (lead.target === "OWNER") {
    opener = ownerWhatsAppMessage({
      service: lead.service,
      propertyType: labelOf(OWNER_PROPERTY_TYPES, lead.propertyType).toLowerCase(),
      location: lead.location,
      units: lead.units,
    })
  } else if (lead.target === "EVENT") {
    opener = eventWhatsAppMessage({
      eventType: lead.eventType,
      propertyName: lead.property,
      date: lead.eventDate,
      guests: lead.guests,
    })
  } else {
    opener = stayWhatsAppMessage({
      propertyName: lead.property,
      checkIn: lead.checkIn,
      checkOut: lead.checkOut,
      guests: lead.guests,
    })
  }

  const summary = summarizeLead(lead)
    .filter((r) => r.label !== "Nama")
    .map((r) => `• ${r.label}: ${r.value}`)
    .join("\n")

  const message = [`${opener}`, "", `Nama: ${lead.name}`, summary, leadId ? `\nRef: ${leadId}` : ""]
    .filter((line) => line !== undefined)
    .join("\n")
    .trim()

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

const OWNER_SERVICE_PITCH: Record<OwnerLeadInput["service"], string> = {
  "hk-on-demand": "layanan HK on Demand cocok untuk turnover antar tamu dan deep clean sesuai jadwal Kakak",
  "co-hosting": "layanan Co-Hosting cocok jika Kakak ingin tetap memegang properti",
  "full-management": "layanan Full Management cocok jika Kakak ingin properti dikelola penuh tanpa repot",
  undecided: "kami bantu pilihkan layanan yang paling sesuai",
}

/**
 * The first admin reply from the response guide, pre-filled with what the
 * form already told us. Brackets mark what the admin still fills in.
 */
export function firstReplyMessage(lead: LeadInput): string {
  const firstName = lead.name.trim().split(/\s+/)[0]

  if (lead.target === "OWNER") {
    return (
      `Halo Kak ${firstName}, terima kasih sudah menghubungi Kinghouse 🙏 ` +
      `Untuk ${labelOf(OWNER_PROPERTY_TYPES, lead.propertyType).toLowerCase()} Kakak di ${lead.location}, ` +
      `${OWNER_SERVICE_PITCH[lead.service]}. ` +
      "Boleh kami jadwalkan survei atau panggilan 15 menit untuk menjelaskan skema dan estimasi biaya? " +
      "Pilihan waktu: [hari/jam 1] atau [hari/jam 2]."
    )
  }

  if (lead.target === "EVENT") {
    const vendorKnown = lead.ownVendor !== undefined || lead.eventType === "shooting"
    return (
      `Halo Kak ${firstName}, terima kasih sudah menghubungi Kinghouse 😊 ` +
      `Kami cek tanggal ${formatDateId(lead.eventDate)} (${lead.startTime}–${lead.endTime}, ${lead.guests} ` +
      `${lead.eventType === "shooting" ? "kru" : "tamu"}) untuk ${getEventTypeLabel(lead.eventType).toLowerCase()} dulu ya. ` +
      "Pricelist dan aturan venue kami lampirkan." +
      (vendorKnown ? "" : " Untuk estimasi final, apakah ada vendor atau dekorasi sendiri?") +
      " 🙏"
    )
  }

  const dates = `${formatDateId(lead.checkIn)}–${formatDateId(lead.checkOut)}`
  if (lead.need === "notify") {
    return (
      `Halo Kak ${firstName}, terima kasih 😊 Kami catat permintaan untuk ${lead.property} tanggal ${dates} ` +
      `(${lead.guests} tamu) dan akan kabari begitu tanggalnya kosong. ` +
      "Sementara itu, tanggal terdekat yang tersedia: [tanggal]. Mau kami tahan untuk Kakak?"
    )
  }
  return (
    `Halo Kak ${firstName}, terima kasih 😊 ${lead.property} tanggal ${dates} [tersedia]. ` +
    `Total untuk ${lead.guests} tamu: [harga]. Mau kami bantu booking sekarang? Link pembayaran: [link].`
  )
}

/** wa.me link to the lead's own number with the first reply ready to send. */
export function buildFirstReplyUrl(lead: LeadInput): string {
  return `https://wa.me/${normalizeWhatsAppNumber(lead.whatsapp)}?text=${encodeURIComponent(firstReplyMessage(lead))}`
}
