// Kinghouse — Lead Funnel Configuration
// Single source of truth for the two-target funnel (Owner vs Guest → Stay / Event):
// service & event options, WhatsApp lines, response targets and venue rules.

import { SITE_CONFIG } from "@/lib/constants"

export type LeadTarget = "OWNER" | "STAY" | "EVENT"

/* ------------------------------------------------------------------ */
/* WhatsApp lines                                                      */
/* ------------------------------------------------------------------ */

const DEFAULT_WHATSAPP = SITE_CONFIG.contact.whatsapp.replace(/[^0-9]/g, "")

function normalizeNumber(raw: string | undefined): string {
  const digits = (raw || "").replace(/[^0-9]/g, "")
  return digits.length >= 8 ? digits : DEFAULT_WHATSAPP
}

/**
 * One WhatsApp line per target. All three fall back to the main hotline, so the
 * site works today with a single number; set the env vars once the team splits
 * the lines (or keep one number and rely on WhatsApp Business labels).
 */
export const WHATSAPP_LINES: Record<LeadTarget, string> = {
  OWNER: normalizeNumber(process.env.NEXT_PUBLIC_WA_OWNER),
  STAY: normalizeNumber(process.env.NEXT_PUBLIC_WA_STAY),
  EVENT: normalizeNumber(process.env.NEXT_PUBLIC_WA_EVENT),
}

/* ------------------------------------------------------------------ */
/* Response targets & office hours                                     */
/* ------------------------------------------------------------------ */

/** First-reply target per funnel (business hours). */
export const RESPONSE_TARGETS: Record<LeadTarget, { minutes: number; label: string }> = {
  STAY: { minutes: 15, label: "15 menit" },
  EVENT: { minutes: 30, label: "30 menit" },
  OWNER: { minutes: 60, label: "1 jam" },
}

export const OFFICE_HOURS = {
  label: "Senin–Jumat, 08.00–18.00 WIB",
  conciergeNote: "Concierge 24/7 khusus tamu yang sedang menginap.",
  /** Office window in WIB (UTC+7, no DST); weekdays only. */
  openHour: 8,
  closeHour: 18,
} as const

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000
const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS

/**
 * Adds working minutes counted only inside office hours (Mon–Fri 08–18 WIB),
 * so a lead sent Friday 17:50 with a 1-hour target is due Monday 08:50 WIB.
 * Public holidays are not excluded.
 */
export function addBusinessMinutes(start: Date, minutes: number): Date {
  // Work on "WIB wall clock" milliseconds so UTC getters read WIB values.
  let t = start.getTime() + WIB_OFFSET_MS
  let remaining = minutes * 60 * 1000

  for (let guard = 0; guard < 60; guard++) {
    const d = new Date(t)
    const dayStart = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    const open = dayStart + OFFICE_HOURS.openHour * HOUR_MS
    const close = dayStart + OFFICE_HOURS.closeHour * HOUR_MS
    const weekday = d.getUTCDay()

    if (weekday === 0 || weekday === 6 || t >= close) {
      t = dayStart + DAY_MS + OFFICE_HOURS.openHour * HOUR_MS
      continue
    }
    if (t < open) t = open
    if (remaining <= close - t) return new Date(t + remaining - WIB_OFFSET_MS)
    remaining -= close - t
    t = dayStart + DAY_MS + OFFICE_HOURS.openHour * HOUR_MS
  }
  return new Date(t - WIB_OFFSET_MS)
}

/** "Sen, 26 Okt 09.00 WIB" */
export function formatWib(date: Date): string {
  return `${date.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })} WIB`
}

/* ------------------------------------------------------------------ */
/* Funnel A — Owner services                                           */
/* ------------------------------------------------------------------ */

export type OwnerServiceId = "hk-on-demand" | "co-hosting" | "full-management"
export type OwnerServiceChoice = OwnerServiceId | "undecided"

/** Internal team that follows up a lead. */
export type LeadRoute = "owner_relations" | "cleaning" | "reservations" | "event_sales"

export interface OwnerService {
  id: OwnerServiceId
  name: string
  audience: string
  features: string[]
  cta: string
  route: LeadRoute
}

export const OWNER_SERVICES: OwnerService[] = [
  {
    id: "hk-on-demand",
    name: "HK on Demand",
    audience: "Untuk pemilik yang sudah mengelola sendiri, tapi butuh kebersihan sesuai panggilan.",
    features: [
      "Turnover antar tamu & deep clean",
      "Pesan lewat form atau WhatsApp, jadwal fleksibel",
      "Balasan maksimal 1 jam kerja",
    ],
    cta: "Pesan Housekeeping",
    route: "cleaning",
  },
  {
    id: "co-hosting",
    name: "Co-Hosting",
    audience: "Untuk pemilik yang ingin tetap memegang properti, tapi butuh operasional tamu.",
    features: [
      "Pembuatan & optimasi listing",
      "Pesan tamu 24/7 dan screening",
      "Harga dinamis harian",
      "Laporan performa bulanan",
    ],
    cta: "Konsultasi Co-Hosting",
    route: "owner_relations",
  },
  {
    id: "full-management",
    name: "Full Management",
    audience: "Untuk pemilik yang ingin properti dikelola penuh, tanpa repot.",
    features: [
      "Semua layanan Co-Hosting + housekeeping",
      "Perawatan & koordinasi perbaikan",
      "Dashboard laba-rugi pemilik",
      "Fee 15%–20% dari pendapatan",
    ],
    cta: "Ajukan Full Management",
    route: "owner_relations",
  },
]

export const OWNER_SERVICE_CHOICES: { id: OwnerServiceChoice; label: string }[] = [
  ...OWNER_SERVICES.map((s) => ({ id: s.id, label: s.name })),
  { id: "undecided", label: "Belum tahu, butuh saran" },
]

export const OWNER_PROPERTY_TYPES = [
  { id: "rumah", label: "Rumah" },
  { id: "apartemen", label: "Apartemen" },
  { id: "villa", label: "Villa" },
] as const

export const OWNER_PROPERTY_STATUSES = [
  { id: "ota-live", label: "Sudah tayang di Airbnb/OTA" },
  { id: "not-listed", label: "Belum tayang" },
  { id: "new-build", label: "Baru dibangun / renovasi" },
] as const

export function getOwnerServiceLabel(id: OwnerServiceChoice): string {
  return OWNER_SERVICE_CHOICES.find((s) => s.id === id)?.label ?? id
}

/** HK on Demand goes to the cleaning team; everything else to owner relations. */
export function routeOwnerService(id: OwnerServiceChoice): LeadRoute {
  return OWNER_SERVICES.find((s) => s.id === id)?.route ?? "owner_relations"
}

/* ------------------------------------------------------------------ */
/* Funnel B2 — Event types                                             */
/* ------------------------------------------------------------------ */

export type EventTypeId = "wedding" | "gathering" | "shooting"

export interface EventTypeOption {
  id: EventTypeId
  name: string
  shortName: string
  description: string
  highlights: string[]
  image: string
}

export const EVENT_TYPES: EventTypeOption[] = [
  {
    id: "wedding",
    name: "Wedding",
    shortName: "wedding",
    description: "Akad, pemberkatan, atau resepsi intim di taman & tepi kolam.",
    highlights: ["Taman 500 m² & kolam", "Hingga 50 tamu", "Vendor bebas, 0% corkage", "Bridal suite"],
    image: "/properties/versatile-house/events/wedding-ceremony-lawn-pool.jpg",
  },
  {
    id: "gathering",
    name: "Gathering & Ulang Tahun",
    shortName: "gathering",
    description: "Arisan, ulang tahun, reuni, atau acara kantor dengan paket per jam.",
    highlights: ["Paket Half Day / Full Day", "Kolam & area BBQ", "Catering bebas"],
    image: "/properties/versatile-house/events/evening-garden-party-banquet.jpg",
  },
  {
    id: "shooting",
    name: "Shooting Foto & Video",
    shortName: "shooting",
    description: "Lokasi konten, iklan, pre-wedding, atau film dengan banyak sudut.",
    highlights: ["Taman, ruang tengah, zen courtyard", "Cahaya alami", "Durasi fleksibel"],
    image: "/properties/versatile-house/new/VersatileHouse_09_Zen_Courtyard.jpg",
  },
]

export function getEventTypeLabel(id: EventTypeId): string {
  return EVENT_TYPES.find((e) => e.id === id)?.name ?? id
}

/** Venues that can be requested on the event form. */
export const EVENT_VENUES = ["Versatile House Jagakarsa", "Belum tahu, butuh rekomendasi"] as const

export const EVENT_SPECIAL_NEEDS = [
  { id: "music", label: "Musik / sound system" },
  { id: "decoration", label: "Dekorasi" },
  { id: "catering", label: "Catering" },
  { id: "overnight", label: "Menginap setelah acara" },
] as const

/**
 * Venue rules shown once on /events so they are not asked again in chat.
 * A rule with `value: null` is hidden until the team confirms it — never
 * publish a guessed deposit or music limit.
 */
export const EVENT_VENUE_RULES: { label: string; value: string | null }[] = [
  { label: "Kapasitas maksimum", value: "50 tamu (acara) • 12 tamu menginap" },
  { label: "Jam tenang", value: "22.00–06.00 WIB" },
  { label: "Vendor & catering", value: "Bebas bawa vendor sendiri, 0% corkage" },
  { label: "Batas musik", value: null },
  { label: "Deposit", value: null },
  { label: "Dekorasi sejak pagi", value: null },
  { label: "Penahanan tanggal", value: null },
]
