// Kinghouse — Stay availability check
// Pure date-range logic used by /api/availability. Check-out day is free for
// the next check-in (same as Airbnb), so ranges overlap only when
// existing.checkIn < requested.checkOut && existing.checkOut > requested.checkIn.

export interface DateRange {
  checkIn: string
  checkOut: string
}

const DAY_MS = 24 * 60 * 60 * 1000

function toUtc(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number)
  return Date.UTC(y, m - 1, d)
}

function toIso(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10)
}

export function addDays(iso: string, days: number): string {
  return toIso(toUtc(iso) + days * DAY_MS)
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  return Math.round((toUtc(checkOut) - toUtc(checkIn)) / DAY_MS)
}

export function rangesOverlap(a: DateRange, b: DateRange): boolean {
  return a.checkIn < b.checkOut && a.checkOut > b.checkIn
}

export function isRangeAvailable(booked: DateRange[], requested: DateRange): boolean {
  return !booked.some((b) => rangesOverlap(b, requested))
}

/**
 * Nearest free ranges with the same number of nights, searching both
 * directions from the requested check-in (never before `today`).
 */
export function findNearestAvailableRanges(
  booked: DateRange[],
  requested: DateRange,
  opts: { today: string; maxResults?: number; searchDays?: number }
): DateRange[] {
  const nights = Math.max(1, nightsBetween(requested.checkIn, requested.checkOut))
  const maxResults = opts.maxResults ?? 2
  const searchDays = opts.searchDays ?? 60
  const results: DateRange[] = []

  for (let offset = 1; offset <= searchDays && results.length < maxResults; offset++) {
    for (const direction of [1, -1]) {
      if (results.length >= maxResults) break
      const checkIn = addDays(requested.checkIn, offset * direction)
      if (checkIn < opts.today) continue
      const candidate = { checkIn, checkOut: addDays(checkIn, nights) }
      if (isRangeAvailable(booked, candidate)) results.push(candidate)
    }
  }

  return results.sort((a, b) => a.checkIn.localeCompare(b.checkIn))
}
