// Kinghouse — Daily lead digest for each PIC
// Lists leads that crossed their deadline in the pipeline (first reply,
// follow-up 1/2, date holds) plus yesterday's intake, sent every weekday morning.

import type { LeadTarget } from "./config"
import { formatWib } from "./config"
import { normalizeWhatsAppNumber, type LeadStatus } from "./lead"
import { escapeTelegramHtml } from "./notify"

export interface DigestLeadRow {
  id: string
  created_at: string
  target: LeadTarget
  need: string
  name: string
  whatsapp: string
  status: LeadStatus
  priority: boolean
  pic: string | null
  first_response_due_at: string | null
  first_response_at: string | null
  last_contact_at: string | null
}

const DAY_MS = 24 * 60 * 60 * 1000
const MAX_PER_SECTION = 15

export interface LeadDigest {
  overdueFirstReply: DigestLeadRow[]
  followUpDue: DigestLeadRow[]
  holdsToCheck: DigestLeadRow[]
  newLast24h: Record<LeadTarget, number>
}

function lastTouch(row: DigestLeadRow): number {
  return new Date(row.last_contact_at ?? row.first_response_at ?? row.created_at).getTime()
}

const byPriorityThenAge = (a: DigestLeadRow, b: DigestLeadRow) =>
  Number(b.priority) - Number(a.priority) || lastTouch(a) - lastTouch(b)

export function buildLeadDigest(openLeads: DigestLeadRow[], recentLeads: DigestLeadRow[], now: Date = new Date()): LeadDigest {
  const t = now.getTime()
  const newLast24h: Record<LeadTarget, number> = { OWNER: 0, STAY: 0, EVENT: 0 }
  for (const row of recentLeads) {
    if (t - new Date(row.created_at).getTime() <= DAY_MS) newLast24h[row.target]++
  }

  return {
    overdueFirstReply: openLeads
      .filter(
        (r) =>
          r.status === "Baru" &&
          !r.first_response_at &&
          r.first_response_due_at !== null &&
          new Date(r.first_response_due_at).getTime() < t
      )
      .sort(byPriorityThenAge),
    // Response guide: follow-up 1 one day after the offer, then follow-up 2.
    followUpDue: openLeads
      .filter((r) => r.status === "Penawaran terkirim" && t - lastTouch(r) >= DAY_MS)
      .sort(byPriorityThenAge),
    // Example hold limit from the plan is 24 hours; confirm DP or release.
    holdsToCheck: openLeads
      .filter((r) => r.status === "Tanggal ditahan" && t - lastTouch(r) >= DAY_MS)
      .sort(byPriorityThenAge),
    newLast24h,
  }
}

function formatRow(row: DigestLeadRow, now: Date): string {
  const e = escapeTelegramHtml
  const days = Math.floor((now.getTime() - lastTouch(row)) / DAY_MS)
  const age = days >= 1 ? `${days} hari` : formatWib(new Date(row.first_response_due_at ?? row.created_at))
  return (
    `${row.priority ? "⚡ " : ""}<b>${e(row.name)}</b> · ${e(row.target)}/${e(row.need)} · ` +
    `<a href="https://wa.me/${normalizeWhatsAppNumber(row.whatsapp)}">${e(row.whatsapp)}</a> · ` +
    `${e(row.pic ?? "PIC belum ada")} · ${e(age)} · <code>${e(row.id)}</code>`
  )
}

function section(title: string, rows: DigestLeadRow[], now: Date): string[] {
  if (rows.length === 0) return []
  const shown = rows.slice(0, MAX_PER_SECTION).map((r) => formatRow(r, now))
  const more = rows.length > MAX_PER_SECTION ? [`… dan ${rows.length - MAX_PER_SECTION} lainnya`] : []
  return ["", `<b>${title} (${rows.length})</b>`, ...shown, ...more]
}

/** Telegram HTML message for the morning digest. */
export function formatLeadDigest(digest: LeadDigest, now: Date = new Date()): string {
  const { OWNER, STAY, EVENT } = digest.newLast24h
  const pending = digest.overdueFirstReply.length + digest.followUpDue.length + digest.holdsToCheck.length

  return [
    `📋 <b>Lead harian · ${escapeTelegramHtml(formatWib(now))}</b>`,
    `Masuk 24 jam terakhir: Owner ${OWNER} · Stay ${STAY} · Event ${EVENT}`,
    ...section("🔴 Belum dibalas, lewat batas", digest.overdueFirstReply, now),
    ...section("🟡 Jadwal follow-up (penawaran > 1 hari)", digest.followUpDue, now),
    ...section("🟠 Tanggal ditahan > 24 jam: konfirmasi DP atau lepas", digest.holdsToCheck, now),
    pending === 0 ? "\n✅ Tidak ada lead tertunda." : "",
  ]
    .join("\n")
    .trim()
}
