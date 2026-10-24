import { Villa } from "@/lib/types"
import { parseIcalString } from "./parser"
import type { DateRange } from "@/lib/funnel/availability"

/** OTA calendars are re-read at most every 5 minutes (shared Next.js data cache). */
const LIVE_CALENDAR_REVALIDATE_SECONDS = 300
const LIVE_CALENDAR_TIMEOUT_MS = 4000

export interface LiveCalendarResult {
  /** Booked/blocked ranges read from the OTA feeds that answered. */
  ranges: DateRange[]
  /** Number of iCal feeds configured for the villa. */
  feedCount: number
  /** True only when every configured feed was read successfully. */
  complete: boolean
}

export function getVillaIcalFeeds(villa: Villa): string[] {
  return [villa.airbnbIcalUrl, villa.airbnbEventIcalUrl, villa.agodaIcalUrl].filter((u): u is string => Boolean(u))
}

async function fetchFeedRanges(url: string): Promise<DateRange[] | null> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), LIVE_CALENDAR_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Kinghouse-Hospitality-Sync/1.0" },
      next: { revalidate: LIVE_CALENDAR_REVALIDATE_SECONDS },
      signal: controller.signal,
    })
    if (!res.ok) return null
    return parseIcalString(await res.text())
      .filter((e) => e.dtStart && e.dtEnd && e.status?.toUpperCase() !== "CANCELLED")
      .map((e) => ({ checkIn: e.dtStart, checkOut: e.dtEnd }))
  } catch {
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Reads the villa's Airbnb / Agoda iCal feeds at request time, so a booking
 * made since the daily sync cron still shows as unavailable on the website.
 */
export async function getLiveBookedRanges(villa: Villa): Promise<LiveCalendarResult> {
  const feeds = getVillaIcalFeeds(villa)
  const results = await Promise.all(feeds.map(fetchFeedRanges))
  return {
    ranges: results.flatMap((r) => r ?? []),
    feedCount: feeds.length,
    complete: feeds.length > 0 && results.every((r) => r !== null),
  }
}
