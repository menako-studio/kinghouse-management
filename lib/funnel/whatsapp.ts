// Kinghouse — WhatsApp deep links & pre-filled funnel messages
// Format: https://wa.me/<number>?text=<encoded message>, one message per button,
// always carrying the need (service / event type), property and dates.

import {
  WHATSAPP_LINES,
  getEventTypeLabel,
  getOwnerServiceLabel,
  type EventTypeId,
  type LeadTarget,
  type OwnerServiceChoice,
} from "./config"

/** `https://wa.me/<number>` for a funnel line (append `?text=` yourself or use buildWhatsAppUrl). */
export function whatsappBase(target: LeadTarget): string {
  return `https://wa.me/${WHATSAPP_LINES[target]}`
}

export function buildWhatsAppUrl(target: LeadTarget, message: string): string {
  return `${whatsappBase(target)}?text=${encodeURIComponent(message)}`
}

function formatDateId(isoDate: string | undefined): string | undefined {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate || undefined
  const [y, m, d] = isoDate.split("-").map(Number)
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
  return `${d} ${months[m - 1]} ${y}`
}

export function ownerWhatsAppMessage(opts: {
  service: OwnerServiceChoice
  propertyType?: string
  location?: string
  units?: number
}): string {
  const serviceText =
    opts.service === "undecided"
      ? "layanan pengelolaan properti"
      : `layanan ${getOwnerServiceLabel(opts.service)}`

  const detail = [
    opts.propertyType && opts.location ? `${opts.propertyType} di ${opts.location}` : opts.propertyType || opts.location,
    opts.units ? `${opts.units} kamar/unit` : undefined,
  ]
    .filter(Boolean)
    .join(", ")

  return [
    `Halo Kinghouse, saya pemilik properti dan tertarik dengan ${serviceText}.`,
    detail ? `Properti saya: ${detail}.` : undefined,
    "Boleh dijelaskan paket dan biayanya?",
  ]
    .filter(Boolean)
    .join(" ")
}

export function stayWhatsAppMessage(opts: {
  propertyName?: string
  checkIn?: string
  checkOut?: string
  guests?: number
}): string {
  const where = opts.propertyName ? `di ${opts.propertyName}` : "di salah satu properti Kinghouse"
  const when =
    opts.checkIn && opts.checkOut
      ? ` tanggal ${formatDateId(opts.checkIn)}–${formatDateId(opts.checkOut)}`
      : ""
  const who = opts.guests ? ` untuk ${opts.guests} tamu` : ""
  return `Halo Kinghouse, saya tertarik menginap ${where}${when}${who}. Apakah tersedia?`
}

export function eventWhatsAppMessage(opts: {
  eventType?: EventTypeId
  propertyName?: string
  date?: string
  guests?: number
}): string {
  const type = opts.eventType ? getEventTypeLabel(opts.eventType).toLowerCase() : "acara"
  const where = opts.propertyName ? ` di ${opts.propertyName}` : ""
  const when = opts.date ? ` tanggal ${formatDateId(opts.date)}` : ""
  const who = opts.guests ? `, sekitar ${opts.guests} orang` : ""
  return `Halo Kinghouse, saya mau tanya event ${type}${where}${when}${who}. Apakah tersedia dan berapa biayanya?`
}

/** Generic opener that mirrors the WhatsApp Business auto-reply menu. */
export const GENERAL_WHATSAPP_MESSAGE =
  "Halo Kinghouse, saya ingin bertanya tentang: (1) Menginap, (2) Acara/Event, atau (3) Kelola properti."

/**
 * Picks the funnel line from the page the visitor is on, so the chat opens
 * with the right need instead of one generic message for every service.
 */
export function resolvePageWhatsApp(pathname: string): { target: LeadTarget; funnel: "owner" | "stay" | "event" | "general"; message: string } {
  if (/^\/(owner-services|management-inquiry|services)(\/|$)/.test(pathname)) {
    return { target: "OWNER", funnel: "owner", message: ownerWhatsAppMessage({ service: "undecided" }) }
  }
  if (/^\/events(\/|$)/.test(pathname)) {
    return { target: "EVENT", funnel: "event", message: eventWhatsAppMessage({}) }
  }
  if (/^\/(villas|stay)(\/|$)/.test(pathname) || /^\/locations\/[^/]+\/villas\//.test(pathname)) {
    return { target: "STAY", funnel: "stay", message: stayWhatsAppMessage({}) }
  }
  return { target: "STAY", funnel: "general", message: GENERAL_WHATSAPP_MESSAGE }
}

export { formatDateId }
