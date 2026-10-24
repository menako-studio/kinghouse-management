// Kinghouse — Team notification for new leads
// Every lead is forwarded to LEAD_WEBHOOK_URL (Google Sheet / CRM + team
// notification, per the funnel plan) with a ready-to-send first reply link.

import type { LeadInput } from "@/lib/validations"
import { RESPONSE_TARGETS, formatWib, type LeadRoute } from "./config"
import { TEAM_LOCALE, buildFirstReplyUrl, type LeadRecord } from "./lead"

const NOTIFY_TIMEOUT_MS = 4000

const ROUTE_LABEL: Record<LeadRoute, string> = {
  owner_relations: "Owner relations",
  cleaning: "Kinghouse Cleaning",
  reservations: "Reservasi",
  event_sales: "Sales event",
}

const NEED_LABEL: Record<string, string> = {
  "hk-on-demand": "HK on Demand",
  "co-hosting": "Co-Hosting",
  "full-management": "Full Management",
  undecided: "Belum tahu",
  wedding: "Wedding",
  gathering: "Gathering",
  shooting: "Shooting",
  notify: "Beri tahu jika kosong",
  inquiry: "Tanya ketersediaan",
}

export interface LeadNotification {
  /** Plain text, for email / webhook receivers */
  text: string
  /** wa.me link to the lead with the first reply pre-filled */
  replyUrl: string
}

export function buildLeadNotification(
  record: LeadRecord,
  summary: { label: string; value: string }[],
  lead: LeadInput
): LeadNotification {
  const need = NEED_LABEL[record.need] ?? record.need
  const due = `${formatWib(new Date(record.first_response_due_at))} (${TEAM_LOCALE.t(RESPONSE_TARGETS[record.target].labelKey)})`
  const source = [record.utm_source, record.utm_medium, record.utm_campaign].filter(Boolean).join(" / ") || record.referrer || "langsung"
  const details = summary.filter((r) => r.label !== "Nama").map((r) => `• ${r.label}: ${r.value}`)

  const lines = [
    `Lead baru · ${record.target} · ${need}${record.priority ? " · PRIORITAS" : ""}`,
    `${record.name} (${record.whatsapp})`,
    ...details,
    `Balas sebelum: ${due}`,
    `Tim: ${ROUTE_LABEL[record.route_to]}`,
    `Sumber: ${source}`,
    `ID: ${record.id}`,
  ]

  return { text: lines.join("\n"), replyUrl: buildFirstReplyUrl(lead) }
}

async function postJson(url: string, body: unknown, headers: Record<string, string> = {}): Promise<boolean> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), NOTIFY_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    return res.ok
  } catch {
    return false
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Forwards the lead to an external pipeline. LEAD_WEBHOOK_SECRET is sent as a
 * header; receivers that cannot read headers (Apps Script) put it in the URL.
 */
export async function forwardLeadToWebhook(
  record: LeadRecord,
  summary: { label: string; value: string }[],
  notification: LeadNotification
): Promise<boolean> {
  const url = process.env.LEAD_WEBHOOK_URL
  if (!url) return false

  const ok = await postJson(
    url,
    {
      lead: record,
      summary,
      notification: notification.text,
      reply_whatsapp_url: notification.replyUrl,
    },
    process.env.LEAD_WEBHOOK_SECRET ? { "X-Kinghouse-Secret": process.env.LEAD_WEBHOOK_SECRET } : {}
  )
  if (!ok) console.warn("Lead webhook delivery failed")
  return ok
}

export async function notifyTeamOfLead(
  record: LeadRecord,
  summary: { label: string; value: string }[],
  lead: LeadInput
): Promise<{ webhook: boolean }> {
  const webhook = await forwardLeadToWebhook(record, summary, buildLeadNotification(record, summary, lead))
  return { webhook }
}
