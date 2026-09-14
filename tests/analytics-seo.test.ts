import { describe, it, expect, beforeEach, vi } from "vitest"
import {
  trackEvent,
  trackPageView,
  trackWhatsAppClick,
  trackAirbnbClick,
  trackBookingInquiry,
  trackOwnerLead,
  trackViewItem,
  trackViewItemList,
  trackSearch,
  trackBrochureDownload,
  trackSearchFilter,
  trackWiFiCopy,
  trackLanguageChange,
  trackCurrencyChange,
} from "@/lib/analytics"
import { SITE_CONFIG } from "@/lib/constants"
import { generateVacationRentalSchema } from "@/lib/utils"
import { CURATED_VILLAS } from "@/lib/data"
import robots from "@/app/robots"

describe("Google Analytics 4 & Tag Manager Event Dispatcher", () => {
  beforeEach(() => {
    // Mock browser window object in Node test environment
    const mockGtag = vi.fn()
    const mockDataLayer: Record<string, unknown>[] = []

    globalThis.window = {
      dataLayer: mockDataLayer,
      gtag: mockGtag,
    } as unknown as Window & typeof globalThis
  })


  it("pushes custom events to window.dataLayer and calls window.gtag", () => {
    trackEvent("custom_conversion", { value: 500000, source: "test" })
    trackPageView("/villas", "Luxury Villas")

    expect(window.dataLayer).toHaveLength(2)
    expect(window.dataLayer![0]).toMatchObject({
      event: "custom_conversion",
      value: 500000,
      source: "test",
    })
    expect(window.dataLayer![0]).toHaveProperty("timestamp")
    expect(window.gtag).toHaveBeenCalledWith("event", "custom_conversion", {
      value: 500000,
      source: "test",
    })
  })


  it("dispatches trackWhatsAppClick with standard category and parameters", () => {
    trackWhatsAppClick({
      source: "villa_detail",
      propertyName: "Versatile House",
      value: 1900000,
    })

    expect(window.dataLayer).toHaveLength(1)
    expect(window.dataLayer![0]).toMatchObject({
      event: "whatsapp_click",
      event_category: "Conversion",
      click_source: "villa_detail",
      property_name: "Versatile House",
      currency: "IDR",
      value: 1900000,
    })
  })

  it("dispatches trackAirbnbClick with outbound referral metadata", () => {
    trackAirbnbClick({
      propertyName: "Sky House",
      airbnbUrl: "https://www.airbnb.com/rooms/1325106294978348497",
      nightlyPrice: 280000,
    })

    expect(window.dataLayer![0]).toMatchObject({
      event: "airbnb_outbound_click",
      event_category: "Outbound Referral",
      property_name: "Sky House",
      airbnb_url: "https://www.airbnb.com/rooms/1325106294978348497",
      nightly_price: 280000,
    })
  })

  it("dispatches trackBookingInquiry for direct WhatsApp and OTA channels", () => {
    trackBookingInquiry({
      propertyName: "Skyline Luxury Orange County",
      channel: "direct_whatsapp",
      checkIn: "2026-09-10",
      checkOut: "2026-09-15",
      guests: 2,
      estimatedTotal: 1500000,
    })

    expect(window.dataLayer![0]).toMatchObject({
      event: "booking_inquiry",
      event_category: "Ecommerce",
      property_name: "Skyline Luxury Orange County",
      booking_channel: "direct_whatsapp",
      guest_count: 2,
      currency: "IDR",
      value: 1500000,
    })
    expect(window.dataLayer![1]).toMatchObject({
      event: "begin_checkout",
      event_category: "Ecommerce",
      currency: "IDR",
      value: 1500000,
    })
  })

  it("dispatches trackOwnerLead on free revenue audit form submission with generate_lead conversion", () => {
    trackOwnerLead({
      propertyType: "villa",
      area: "Jagakarsa",
      bedrooms: 5,
      ownerName: "Budi Santoso",
      serviceTier: "15% Full Service",
    })

    expect(window.dataLayer![0]).toMatchObject({
      event: "owner_lead_submit",
      event_category: "Lead Generation",
      property_type: "villa",
      property_area: "Jagakarsa",
      bedrooms: 5,
      owner_name: "Budi Santoso",
      service_tier: "15% Full Service",
    })
    expect(window.dataLayer![1]).toMatchObject({
      event: "generate_lead",
      event_category: "Lead Generation",
      lead_type: "owner_management_inquiry",
      currency: "IDR",
      value: 5000000,
    })
  })

  it("dispatches trackViewItem and trackViewItemList for GA4 ecommerce tracking", () => {
    trackViewItem({
      propertyId: "villa-1",
      propertyName: "Versatile House",
      area: "Jagakarsa",
      price: 1900000,
    })
    trackViewItemList({
      listName: "Jakarta Selatan Accommodations",
      itemCount: 4,
    })

    expect(window.dataLayer![0]).toMatchObject({
      event: "view_item",
      event_category: "Ecommerce",
      currency: "IDR",
      value: 1900000,
    })
    expect(window.dataLayer![1]).toMatchObject({
      event: "view_item_list",
      item_list_name: "Jakarta Selatan Accommodations",
      items_count: 4,
    })
  })

  it("dispatches trackSearch for user search queries", () => {
    trackSearch("villa kolam renang jagakarsa")

    expect(window.dataLayer![0]).toMatchObject({
      event: "search",
      search_term: "villa kolam renang jagakarsa",
    })
  })

  it("dispatches trackBrochureDownload for villa and event brochures", () => {
    trackBrochureDownload({
      brochureType: "event",
      itemName: "Garden Wedding Package",
    })

    expect(window.dataLayer![0]).toMatchObject({
      event: "brochure_download",
      event_category: "Engagement",
      brochure_type: "event",
      item_name: "Garden Wedding Package",
    })
  })

  it("dispatches trackSearchFilter for search and catalog filter changes", () => {
    trackSearchFilter({
      filterType: "destination",
      filterValue: "jagakarsa",
    })

    expect(window.dataLayer![0]).toMatchObject({
      event: "filter_interaction",
      filter_type: "destination",
      filter_value: "jagakarsa",
    })
  })

  it("dispatches trackWiFiCopy for guest compendium WiFi copy actions", () => {
    trackWiFiCopy({
      propertyName: "Skyline Luxury",
      ssid: "N0510",
    })

    expect(window.dataLayer![0]).toMatchObject({
      event: "wifi_credential_copy",
      property_name: "Skyline Luxury",
      wifi_ssid: "N0510",
    })
  })

  it("dispatches localization events on language and currency updates", () => {
    trackLanguageChange("ID")
    trackCurrencyChange("USD")

    expect(window.dataLayer).toHaveLength(2)
    expect(window.dataLayer![0]).toMatchObject({
      event: "language_change",
      selected_language: "ID",
    })
    expect(window.dataLayer![1]).toMatchObject({
      event: "currency_change",
      selected_currency: "USD",
    })
  })
})

describe("SEO, Sitemaps & Technical Optimization", () => {
  it("verifies SITE_CONFIG domain and brand aliases for Google ranking", () => {
    expect(SITE_CONFIG.domain).toBe("kinghousemanagement.com")
    expect(SITE_CONFIG.name).toBe("Kinghouse Management")
    expect(SITE_CONFIG.brandAliases).toContain("Kinghouse Management")
    expect(SITE_CONFIG.brandAliases).toContain("King House Management")
    expect(SITE_CONFIG.brandAliases).toContain("kinghousemanagement.com")
    expect(SITE_CONFIG.brandAliases).toContain("www.kinghousemanagement.com")
  })

  it("generates valid VacationRental Schema.org markup", () => {
    const villa = CURATED_VILLAS[0]
    const schema = generateVacationRentalSchema(villa)

    expect(schema["@context"]).toBe("https://schema.org")
    expect(schema["@type"]).toBe("VacationRental")
    expect(schema.url).toContain("kinghousemanagement.com")
    expect(schema.address).toBeDefined()
    expect(schema.geo).toBeDefined()
    expect(schema.occupancy).toBeDefined()
  })

  it("verifies robots.txt crawl directives and canonical sitemap", () => {
    const robotRules = robots()

    expect(robotRules.sitemap).toContain("kinghousemanagement.com/sitemap.xml")
    expect(robotRules.rules).toBeDefined()

    const allUserAgents = Array.isArray(robotRules.rules) ? robotRules.rules : [robotRules.rules]
    const defaultRule = allUserAgents.find((r) => r.userAgent === "*")
    expect(defaultRule).toBeDefined()
    expect(defaultRule?.disallow).toContain("/dashboard/*")
    expect(defaultRule?.disallow).toContain("/api/*")
    expect(defaultRule?.disallow).toContain("/login")
  })

  it("verifies sitemap does not expose /dashboard, /login, or /api routes and indexes all published blog articles", async () => {
    const { default: sitemap } = await import("@/app/sitemap")
    const routes = await sitemap()

    expect(routes.length).toBeGreaterThan(15)

    const urls = routes.map((r) => r.url)
    
    // Ensure administrative, auth, and private stay routes are NOT in sitemap
    expect(urls.some((u) => u.includes("/dashboard"))).toBe(false)
    expect(urls.some((u) => u.includes("/login"))).toBe(false)
    expect(urls.some((u) => u.includes("/api"))).toBe(false)
    expect(urls.some((u) => u.includes("/stay/"))).toBe(false)

    // Ensure all URLs start with canonical baseUrl
    urls.forEach((url) => {
      expect(url.startsWith("https://www.kinghousemanagement.com")).toBe(true)
    })

    // Check newly added organic blog posts are in the sitemap
    expect(urls.some((u) => u.includes("panduan-investasi-airbnb-jabodetabek-2026"))).toBe(true)
    expect(urls.some((u) => u.includes("rekomendasi-villa-intimate-wedding-family-gathering-jakarta"))).toBe(true)
    expect(urls.some((u) => u.includes("strategi-maksimalkan-okupansi-apartemen-cikarang"))).toBe(true)

    // Check event routes and canonical property routes are indexed
    expect(urls.some((u) => u.includes("/events/garden-wedding-jagakarsa"))).toBe(true)
    expect(urls.some((u) => u.includes("/locations/jagakarsa/villas/versatile-house-jagakarsa"))).toBe(true)
  })
})

