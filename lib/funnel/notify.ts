// Kinghouse — Team notifications for new leads
// Every lead pings the team the moment it is saved, so the 15/30/60-minute
// first-reply targets can actually be met:
//   • Telegram group (TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID) with a one-tap
//     "Balas via WhatsApp" button that opens the first-reply template
//   • LEAD_WEBHOOK_URL (Google Apps Script → Sheet + email, Make, Zapier, CRM)

import type { LeadInput } from "@/lib/validations"
import { RESPONSE_TARGETS, formatWib, type LeadRoute } from "./config"
import { buildFirstReplyUrl, type LeadRecord } from "./lead"

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

export function escapeTelegramHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export interface LeadNotification {
  /** Telegram HTML message */
  html: string
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
  const due = `${formatWib(new Date(record.first_response_due_at))} (${RESPONSE_TARGETS[record.target].label} kerja)`
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

  const e = escapeTelegramHtml
  const html = [
    `🔔 <b>Lead baru · ${e(record.target)} · ${e(need)}</b>${record.priority ? " ⚡ <b>PRIORITAS</b>" : ""}`,
    `<b>${e(record.name)}</b> · ${e(record.whatsapp)}`,
    "",
    ...details.map(e),
    "",
    `⏱ Balas sebelum <b>${e(due)}</b>`,
    `👤 ${e(ROUTE_LABEL[record.route_to])} · Sumber: ${e(source)}`,
    `<code>${e(record.id)}</code>`,
  ].join("\n")

  return { html, text: lines.join("\n"), replyUrl: buildFirstReplyUrl(lead) }
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

/** Sends an HTML message (optionally with URL buttons) to the team's Telegram chat. */
export async function sendTelegramMessage(html: string, buttons: { text: string; url: string }[] = []): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return false

  const ok = await postJson(`https://api.telegram.org/bot${token}/sendMessage`, {
    chat_id: chatId,
    text: html,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    ...(buttons.length ? { reply_markup: { inline_keyboard: [buttons] } } : {}),
  })
  if (!ok) console.warn("Telegram lead notification failed")
  return ok
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
): Promise<{ telegram: boolean; webhook: boolean }> {
  const notification = buildLeadNotification(record, summary, lead)
  const [telegram, webhook] = await Promise.all([
    sendTelegramMessage(notification.html, [{ text: "💬 Balas via WhatsApp", url: notification.replyUrl }]),
    forwardLeadToWebhook(record, summary, notification),
  ])
  return { telegram, webhook }
}
