// Kinghouse — Lead Funnel Configuration
// Single source of truth for the two-target funnel (Owner vs Guest → Stay / Event):
// service & event options, WhatsApp lines, response targets and venue rules.

import { SITE_CONFIG } from "@/lib/constants"
import type { FunnelKey } from "@/lib/i18n/funnel"

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
 * Two WhatsApp lines (owner decision, Oct 2026):
 *  - OWNER: Kinghouse products — HK on Demand, Co-Hosting, Full Management
 *  - GUEST: stays and event bookings at our properties (STAY + EVENT)
 * Both fall back to the main hotline until the numbers are set.
 * NEXT_PUBLIC_* values are fixed at build time: redeploy after changing them.
 */
const OWNER_LINE = normalizeNumber(process.env.NEXT_PUBLIC_WA_OWNER)
const GUEST_LINE = normalizeNumber(
  process.env.NEXT_PUBLIC_WA_GUEST || process.env.NEXT_PUBLIC_WA_STAY || process.env.NEXT_PUBLIC_WA_EVENT
)

export const WHATSAPP_LINES: Record<LeadTarget, string> = {
  OWNER: OWNER_LINE,
  STAY: GUEST_LINE,
  EVENT: GUEST_LINE,
}

/* ------------------------------------------------------------------ */
/* Response targets & office hours                                     */
/* ------------------------------------------------------------------ */

/** First-reply target per funnel (business hours). */
export const RESPONSE_TARGETS: Record<LeadTarget, { minutes: number; labelKey: FunnelKey }> = {
  STAY: { minutes: 15, labelKey: "f.reply.stay" },
  EVENT: { minutes: 30, labelKey: "f.reply.event" },
  OWNER: { minutes: 60, labelKey: "f.reply.owner" },
}

export const OFFICE_HOURS = {
  /** Office window in WIB (UTC+7, no DST); weekdays only. Shown via the f.officeHours key. */
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
/* Visitor-facing copy lives in lib/i18n/funnel (keys referenced here). */
/* ------------------------------------------------------------------ */


export type OwnerServiceId = "hk-on-demand" | "co-hosting" | "full-management"
export type OwnerServiceChoice = OwnerServiceId | "undecided"

/** Internal team that follows up a lead. */
export type LeadRoute = "owner_relations" | "cleaning" | "reservations" | "event_sales"

export interface OwnerService {
  id: OwnerServiceId
  /** i18n key prefix: `${key}.name`, `.audience`, `.f1`…, `.cta` */
  key: "f.svc.hk" | "f.svc.co" | "f.svc.full"
  featureCount: number
  route: LeadRoute
}

export const OWNER_SERVICES: OwnerService[] = [
  { id: "hk-on-demand", key: "f.svc.hk", featureCount: 3, route: "cleaning" },
  { id: "co-hosting", key: "f.svc.co", featureCount: 4, route: "owner_relations" },
  { id: "full-management", key: "f.svc.full", featureCount: 4, route: "owner_relations" },
]

export const OWNER_SERVICE_CHOICES: { id: OwnerServiceChoice; labelKey: FunnelKey }[] = [
  ...OWNER_SERVICES.map((s) => ({ id: s.id, labelKey: `${s.key}.name` as FunnelKey })),
  { id: "undecided", labelKey: "f.svc.undecided" },
]

export const OWNER_PROPERTY_TYPES = ["rumah", "apartemen", "villa"] as const
export const OWNER_PROPERTY_STATUSES = ["ota-live", "not-listed", "new-build"] as const

export function ownerServiceLabelKey(id: OwnerServiceChoice): FunnelKey {
  return OWNER_SERVICE_CHOICES.find((s) => s.id === id)?.labelKey ?? "f.svc.undecided"
}

/** HK on Demand landing page FAQ (also rendered as FAQPage structured data). */
export const HK_FAQ = [
  ["f.hk.q1", "f.hk.a1"],
  ["f.hk.q2", "f.hk.a2"],
  ["f.hk.q3", "f.hk.a3"],
] as const satisfies readonly (readonly [FunnelKey, FunnelKey])[]

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
  highlightCount: number
  image: string
}

export const EVENT_TYPES: EventTypeOption[] = [
  { id: "wedding", highlightCount: 4, image: "/properties/versatile-house/events/wedding-ceremony-lawn-pool.jpg" },
  { id: "gathering", highlightCount: 3, image: "/properties/versatile-house/events/evening-garden-party-banquet.jpg" },
  { id: "shooting", highlightCount: 3, image: "/properties/versatile-house/new/VersatileHouse_09_Zen_Courtyard.jpg" },
]

export function eventTypeLabelKey(id: EventTypeId): FunnelKey {
  return `f.evt.${id}.name` as FunnelKey
}

/** Venues that can be requested on the event form. */
export const EVENT_VENUE_UNDECIDED = "undecided"
export const EVENT_VENUES = ["Versatile House Jagakarsa", EVENT_VENUE_UNDECIDED] as const

export const EVENT_SPECIAL_NEEDS = ["music", "decoration", "catering", "overnight"] as const

/**
 * Venue rules shown once on /events so they are not asked again in chat.
 * Only confirmed rules are listed. To publish music limits, deposit, early
 * decoration or date-hold rules, add their keys to every lib/i18n/funnel
 * dictionary and list them here — never publish a guessed value.
 */
export const EVENT_VENUE_RULES: { labelKey: FunnelKey; valueKey: FunnelKey }[] = [
  { labelKey: "f.rules.capacity", valueKey: "f.rules.capacityValue" },
  { labelKey: "f.rules.quietHours", valueKey: "f.rules.quietHoursValue" },
  { labelKey: "f.rules.vendors", valueKey: "f.rules.vendorsValue" },
]
