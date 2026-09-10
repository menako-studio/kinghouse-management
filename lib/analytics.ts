/**
 * KingHouse Hospitality Analytics & Event Dispatcher
 * Integrates Google Analytics 4 (gtag.js) and Google Tag Manager (dataLayer)
 * for deep conversion and interaction tracking across all digital touchpoints.
 */

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-TWXVH3RCP4"
export const GTM_ID =
  process.env.NEXT_PUBLIC_GTM_ID || "GTM-PH9N4N7H"


declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Generic safe event dispatcher pushing to both window.dataLayer and window.gtag
 */
export function trackEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return

  // 1. Push to Google Tag Manager dataLayer
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: eventName,
    ...params,
    timestamp: new Date().toISOString(),
  })

  // 2. Push to Google Analytics gtag if available
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params)
  }

  // Development debug log
  if (process.env.NODE_ENV === "development") {
    console.debug(`[Analytics] ${eventName}:`, params)
  }
}

/**
 * Track virtual page view on Next.js App Router navigation
 */
export function trackPageView(url: string, title?: string) {
  if (typeof window === "undefined") return

  const pageTitle = title || (typeof document !== "undefined" ? document.title : "")
  const pageLocation = typeof window.location !== "undefined" && window.location.href ? window.location.href : url

  // GA4 standard config update
  if (typeof window.gtag === "function" && GA_MEASUREMENT_ID) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: pageTitle,
      page_location: pageLocation,
    })
  }

  // GTM virtual page view event
  trackEvent("virtual_page_view", {
    page_path: url,
    page_title: pageTitle,
    page_location: pageLocation,
  })
}


/**
 * Track WhatsApp Concierge / Inquiries
 */
export function trackWhatsAppClick(options: {
  source: "header" | "footer" | "floating" | "villa_detail" | "booking_modal" | "owner_page" | "event_page" | "contact_page" | "guest_compendium" | "management_inquiry"
  propertyName?: string
  context?: string
  value?: number
}) {
  trackEvent("whatsapp_click", {
    event_category: "Conversion",
    event_label: options.propertyName || options.context || options.source,
    click_source: options.source,
    property_name: options.propertyName,
    context: options.context,
    currency: "IDR",
    value: options.value,
  })
}

/**
 * Track Airbnb Outbound Clicks
 */
export function trackAirbnbClick(options: {
  propertyName: string
  airbnbUrl: string
  nightlyPrice?: number
  source?: string
}) {
  trackEvent("airbnb_outbound_click", {
    event_category: "Outbound Referral",
    event_label: options.propertyName,
    property_name: options.propertyName,
    airbnb_url: options.airbnbUrl,
    nightly_price: options.nightlyPrice,
    source: options.source || "villa_detail",
  })
}

/**
 * Track Booking Inquiries & Channel Selection
 */
export function trackBookingInquiry(options: {
  propertyName: string
  channel: "direct_whatsapp" | "airbnb" | "agoda" | "booking_com"
  checkIn?: string
  checkOut?: string
  guests?: number
  estimatedTotal?: number
}) {
  trackEvent("booking_inquiry", {
    event_category: "Ecommerce",
    event_label: `${options.propertyName} - ${options.channel}`,
    property_name: options.propertyName,
    booking_channel: options.channel,
    check_in_date: options.checkIn,
    check_out_date: options.checkOut,
    guest_count: options.guests,
    currency: "IDR",
    value: options.estimatedTotal,
  })
}

/**
 * Track Property Owner Lead Generation Submissions
 */
export function trackOwnerLead(options: {
  propertyType: string
  area: string
  bedrooms?: string | number
  ownerName?: string
  serviceTier?: string
}) {
  trackEvent("owner_lead_submit", {
    event_category: "Lead Generation",
    event_label: `${options.propertyType} in ${options.area}`,
    property_type: options.propertyType,
    property_area: options.area,
    bedrooms: options.bedrooms,
    owner_name: options.ownerName,
    service_tier: options.serviceTier || "15% Full Service",
  })
}

/**
 * Track Brochure Downloads
 */
export function trackBrochureDownload(options: {
  brochureType: "villa" | "event" | "owner_deck"
  itemName: string
  fileUrl?: string
}) {
  trackEvent("brochure_download", {
    event_category: "Engagement",
    event_label: `${options.brochureType} - ${options.itemName}`,
    brochure_type: options.brochureType,
    item_name: options.itemName,
    file_url: options.fileUrl,
  })
}

/**
 * Track Search and Filter Interactions
 */
export function trackSearchFilter(options: {
  filterType: "destination" | "property_type" | "bedrooms" | "search_query" | "date_range" | "clear_all"
  filterValue: string | number
  activeCount?: number
}) {
  trackEvent("filter_interaction", {
    event_category: "Search & Navigation",
    filter_type: options.filterType,
    filter_value: String(options.filterValue),
    active_filters_count: options.activeCount,
  })
}

/**
 * Track Blog Reading and Article Views
 */
export function trackBlogRead(options: {
  articleSlug: string
  articleTitle: string
  category: string
  readingTimeMinutes?: number
}) {
  trackEvent("blog_read", {
    event_category: "Content Engagement",
    event_label: options.articleTitle,
    article_slug: options.articleSlug,
    article_title: options.articleTitle,
    article_category: options.category,
    reading_time_est: options.readingTimeMinutes,
  })
}

/**
 * Track Guest Compendium WiFi Credential Copies
 */
export function trackWiFiCopy(options: {
  propertyName: string
  ssid: string
}) {
  trackEvent("wifi_credential_copy", {
    event_category: "Guest Experience",
    event_label: `${options.propertyName} - ${options.ssid}`,
    property_name: options.propertyName,
    wifi_ssid: options.ssid,
  })
}

/**
 * Track Map Directions Click
 */
export function trackDirectionsClick(options: {
  propertyName: string
  mapUrl: string
}) {
  trackEvent("map_directions_click", {
    event_category: "Guest Experience",
    event_label: options.propertyName,
    property_name: options.propertyName,
    map_url: options.mapUrl,
  })
}

/**
 * Track Phone Call Inquiries
 */
export function trackPhoneCall(options: {
  source: string
  phoneNumber: string
}) {
  trackEvent("phone_call_click", {
    event_category: "Conversion",
    event_label: `${options.source} - ${options.phoneNumber}`,
    click_source: options.source,
    phone_number: options.phoneNumber,
  })
}

/**
 * Track Email Contact Inquiries
 */
export function trackEmailClick(options: {
  source: string
  email: string
}) {
  trackEvent("email_click", {
    event_category: "Conversion",
    event_label: `${options.source} - ${options.email}`,
    click_source: options.source,
    email_address: options.email,
  })
}

/**
 * Track Language Preference Changes
 */
export function trackLanguageChange(language: string) {
  trackEvent("language_change", {
    event_category: "Localization",
    selected_language: language,
  })
}

/**
 * Track Currency Preference Changes
 */
export function trackCurrencyChange(currency: string) {
  trackEvent("currency_change", {
    event_category: "Localization",
    selected_currency: currency,
  })
}
