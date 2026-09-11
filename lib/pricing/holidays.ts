/**
 * Indonesian Public Holidays & Long Weekend Service (Live API & Fallback)
 * Fetches actual official public holidays from Nager.Date API (Country Code: ID)
 * with robust in-memory caching and verified fallback list.
 */

export interface PublicHoliday {
  date: string // YYYY-MM-DD
  localName: string
  name: string
  countryCode: string
  fixed: boolean
  global: boolean
  types?: string[]
}

// Global cache to avoid redundant API hits across requests
declare global {
  var __kinghouse_holidays_cache: Record<number, { timestamp: number; data: PublicHoliday[] }> | undefined
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

// Verified official Indonesian 2026 Public Holidays & Cuti Bersama fallback list
const OFFICIAL_2026_HOLIDAYS_FALLBACK: PublicHoliday[] = [
  { date: "2026-01-01", localName: "Tahun Baru Masehi", name: "New Year's Day", countryCode: "ID", fixed: true, global: true },
  { date: "2026-01-28", localName: "Tahun Baru Imlek 2577", name: "Chinese New Year", countryCode: "ID", fixed: false, global: true },
  { date: "2026-02-17", localName: "Isra Mi'raj Nabi Muhammad SAW", name: "Isra Mi'raj", countryCode: "ID", fixed: false, global: true },
  { date: "2026-03-20", localName: "Hari Suci Nyepi (Tahun Baru Saka 1948)", name: "Nyepi", countryCode: "ID", fixed: false, global: true },
  { date: "2026-03-21", localName: "Hari Raya Idul Fitri 1447 H (Hari 1)", name: "Eid al-Fitr Day 1", countryCode: "ID", fixed: false, global: true },
  { date: "2026-03-22", localName: "Hari Raya Idul Fitri 1447 H (Hari 2)", name: "Eid al-Fitr Day 2", countryCode: "ID", fixed: false, global: true },
  { date: "2026-03-23", localName: "Cuti Bersama Idul Fitri", name: "Eid al-Fitr Holiday", countryCode: "ID", fixed: false, global: true },
  { date: "2026-03-24", localName: "Cuti Bersama Idul Fitri", name: "Eid al-Fitr Holiday", countryCode: "ID", fixed: false, global: true },
  { date: "2026-04-03", localName: "Wafat Isa Almasih (Jumat Agung)", name: "Good Friday", countryCode: "ID", fixed: false, global: true },
  { date: "2026-04-05", localName: "Hari Paskah", name: "Easter Sunday", countryCode: "ID", fixed: false, global: true },
  { date: "2026-05-01", localName: "Hari Buruh Internasional", name: "Labor Day", countryCode: "ID", fixed: true, global: true },
  { date: "2026-05-14", localName: "Kenaikan Isa Almasih", name: "Ascension Day", countryCode: "ID", fixed: false, global: true },
  { date: "2026-05-27", localName: "Hari Raya Idul Adha 1447 H", name: "Eid al-Adha", countryCode: "ID", fixed: false, global: true },
  { date: "2026-05-31", localName: "Hari Raya Waisak 2570", name: "Vesak Day", countryCode: "ID", fixed: false, global: true },
  { date: "2026-06-01", localName: "Hari Lahir Pancasila", name: "Pancasila Day", countryCode: "ID", fixed: true, global: true },
  { date: "2026-06-16", localName: "Tahun Baru Islam 1448 H", name: "Islamic New Year", countryCode: "ID", fixed: false, global: true },
  { date: "2026-08-17", localName: "Hari Kemerdekaan Republik Indonesia", name: "Independence Day", countryCode: "ID", fixed: true, global: true },
  { date: "2026-08-25", localName: "Maulid Nabi Muhammad SAW", name: "Prophet's Birthday", countryCode: "ID", fixed: false, global: true },
  { date: "2026-12-25", localName: "Hari Raya Natal", name: "Christmas Day", countryCode: "ID", fixed: true, global: true },
  { date: "2026-12-26", localName: "Cuti Bersama Hari Raya Natal", name: "Christmas Holiday", countryCode: "ID", fixed: true, global: true },
  { date: "2026-12-31", localName: "Malam Tahun Baru (Peak Season)", name: "New Year's Eve", countryCode: "ID", fixed: true, global: true },
]

/**
 * Fetches official Indonesian Public Holidays for a specific year.
 * Checks memory cache first, then calls Nager.Date API, falling back to official calendar.
 */
export async function getIndonesianHolidays(year: number = new Date().getFullYear()): Promise<PublicHoliday[]> {
  if (!globalThis.__kinghouse_holidays_cache) {
    globalThis.__kinghouse_holidays_cache = {}
  }

  const cached = globalThis.__kinghouse_holidays_cache[year]
  const now = Date.now()

  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data
  }

  try {
    const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/ID`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Kinghouse-Dynamic-Pricing/1.0",
      },
      next: { revalidate: 86400 }, // 24 hours ISR
    })

    if (res.ok) {
      const data: PublicHoliday[] = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        // Enrich with peak holiday periods if missing (e.g. Dec 31, Cuti Bersama)
        const dateSet = new Set(data.map((d) => d.date))
        const enriched = [...data]

        OFFICIAL_2026_HOLIDAYS_FALLBACK.forEach((item) => {
          if (!dateSet.has(item.date) && item.date.startsWith(`${year}-`)) {
            enriched.push(item)
          }
        })

        enriched.sort((a, b) => a.date.localeCompare(b.date))
        globalThis.__kinghouse_holidays_cache[year] = { timestamp: now, data: enriched }
        return enriched
      }
    }
  } catch {
    // Network or API error: proceed to fallback
  }

  const fallback = OFFICIAL_2026_HOLIDAYS_FALLBACK.filter((h) => h.date.startsWith(`${year}-`))
  globalThis.__kinghouse_holidays_cache[year] = { timestamp: now, data: fallback }
  return fallback
}

/**
 * Checks if a specific date (YYYY-MM-DD) is a public holiday, cuti bersama, or adjacent long weekend.
 */
export function isDateHoliday(
  dateStr: string,
  holidays: PublicHoliday[]
): { isHoliday: boolean; holidayName?: string; isLongWeekend: boolean } {
  const holiday = holidays.find((h) => h.date === dateStr)
  const d = new Date(dateStr)
  const dayOfWeek = d.getDay() // 0 = Sunday, 5 = Friday, 6 = Saturday

  // Check if date is part of a long weekend (e.g. Friday holiday + weekend, or Monday holiday + weekend)
  let isLongWeekend = false
  if (holiday) {
    if (dayOfWeek === 5 || dayOfWeek === 1 || dayOfWeek === 6 || dayOfWeek === 0) {
      isLongWeekend = true
    }
  } else {
    // Check if adjacent day is a holiday creating a long weekend
    const prevDate = new Date(d)
    prevDate.setDate(prevDate.getDate() - 1)
    const prevStr = prevDate.toISOString().split("T")[0]

    const nextDate = new Date(d)
    nextDate.setDate(nextDate.getDate() + 1)
    const nextStr = nextDate.toISOString().split("T")[0]

    const prevHoliday = holidays.some((h) => h.date === prevStr)
    const nextHoliday = holidays.some((h) => h.date === nextStr)

    if ((dayOfWeek === 6 && prevHoliday) || (dayOfWeek === 0 && nextHoliday)) {
      isLongWeekend = true
    }
  }

  return {
    isHoliday: Boolean(holiday),
    holidayName: holiday?.localName,
    isLongWeekend,
  }
}
