// Kinghouse — First-touch lead source (UTM) capture
// Stores utm_source / utm_medium / utm_campaign, the external referrer and the
// landing page once per session, so every form submission carries its source.

const STORAGE_KEY = "kh_lead_source"

export interface LeadSource {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  referrer?: string
  landingPage?: string
}

/** Pure parser — exported for tests. */
export function parseLeadSource(href: string, referrer: string): LeadSource {
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return {}
  }

  const pick = (key: string) => url.searchParams.get(key)?.slice(0, 100) || undefined

  let externalReferrer: string | undefined
  if (referrer) {
    try {
      const ref = new URL(referrer)
      if (ref.hostname !== url.hostname) externalReferrer = `${ref.origin}${ref.pathname}`.slice(0, 300)
    } catch {
      externalReferrer = undefined
    }
  }

  return {
    utmSource: pick("utm_source"),
    utmMedium: pick("utm_medium"),
    utmCampaign: pick("utm_campaign"),
    referrer: externalReferrer,
    landingPage: url.pathname.slice(0, 300),
  }
}

/**
 * Records the first touch of the session. A later visit that arrives with new
 * UTM parameters (e.g. a second ad click) replaces it.
 */
export function captureLeadSource(): void {
  if (typeof window === "undefined") return
  try {
    const current = parseLeadSource(window.location.href, document.referrer)
    const stored = window.sessionStorage.getItem(STORAGE_KEY)
    if (!stored || current.utmSource) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current))
    }
  } catch {
    // Storage blocked (private mode) — leads are still accepted without a source.
  }
}

export function getLeadSource(): LeadSource {
  if (typeof window === "undefined") return {}
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as LeadSource) : parseLeadSource(window.location.href, document.referrer)
  } catch {
    return {}
  }
}
