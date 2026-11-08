// Scheduled publishing for blog posts.
//
// A post is live when its status is "Published" AND its publish time has passed.
// A "Published" post with a future publishedAt is therefore *scheduled*: it stays
// out of /blog, the sitemap, related posts and its own URL (404) until that
// moment, then appears on its own: /blog/[slug] renders per request, /blog
// revalidates every 2 minutes and the sitemap every hour. No cron job needed.

import type { BlogPost } from "@/lib/types"

/** Date-only values go live at 07:00 Jakarta time (morning reading peak). */
export const DEFAULT_PUBLISH_TIME_WIB = "07:00"
const WIB_OFFSET = "+07:00"

/** Exact moment a post goes live. Accepts `YYYY-MM-DD` or a full ISO timestamp. */
export function publishInstant(publishedAt: string | undefined | null): Date {
  if (!publishedAt) return new Date(0)
  if (/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)) {
    return new Date(`${publishedAt}T${DEFAULT_PUBLISH_TIME_WIB}:00${WIB_OFFSET}`)
  }
  const d = new Date(publishedAt)
  return Number.isNaN(d.getTime()) ? new Date(0) : d
}

/** ISO timestamp for a Jakarta-time date + time picked in the dashboard. */
export function wibToIso(date: string, time = DEFAULT_PUBLISH_TIME_WIB): string {
  return new Date(`${date}T${time}:00${WIB_OFFSET}`).toISOString()
}

/** Split a publish timestamp back into Jakarta date (`YYYY-MM-DD`) and time (`HH:mm`). */
export function isoToWib(publishedAt: string): { date: string; time: string } {
  const d = publishInstant(publishedAt)
  const wib = new Date(d.getTime() + 7 * 60 * 60 * 1000)
  const iso = wib.toISOString()
  return { date: iso.slice(0, 10), time: iso.slice(11, 16) }
}

type Publishable = Pick<BlogPost, "publishedAt"> & { status?: string }

export function isLive(post: Publishable, now: Date = new Date()): boolean {
  return (post.status ?? "Published") === "Published" && publishInstant(post.publishedAt) <= now
}

export function isScheduled(post: Publishable, now: Date = new Date()): boolean {
  return (post.status ?? "Published") === "Published" && publishInstant(post.publishedAt) > now
}

/** "16 Nov 2026, 07:00 WIB" for dashboard labels. */
export function formatPublishWib(publishedAt: string, locale = "id-ID"): string {
  const d = publishInstant(publishedAt)
  const date = d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" })
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" })
  return `${date}, ${time} WIB`
}
