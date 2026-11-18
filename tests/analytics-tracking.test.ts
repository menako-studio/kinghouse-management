import { describe, it, expect, beforeEach, vi } from "vitest"
import {
  KEY_EVENTS,
  isCmsPath,
  serviceTypeFor,
  trackPageView,
  trackLeadFormSubmit,
  trackPhoneCall,
  trackBookingInquiry,
  trackCalculatorOpen,
  trackOwnerCtaClick,
} from "@/lib/analytics"

describe("GA4 tracking cleanup", () => {
  beforeEach(() => {
    globalThis.window = { dataLayer: [], gtag: vi.fn() } as unknown as Window & typeof globalThis
  })

  it("only real leads are key events", () => {
    expect([...KEY_EVENTS].sort()).toEqual(["booking_request", "click_phone", "click_whatsapp", "generate_lead"])
  })

  it("recognises CMS routes", () => {
    expect(isCmsPath("/login")).toBe(true)
    expect(isCmsPath("/dashboard")).toBe(true)
    expect(isCmsPath("/dashboard/bookings")).toBe(true)
    expect(isCmsPath("/dashboards-info")).toBe(false)
    expect(isCmsPath("/owner-services")).toBe(false)
  })

  it("never sends a page_view for CMS routes", () => {
    trackPageView("/dashboard/analytics", "CMS Dashboard")
    trackPageView("/login", "CMS Portal Login")
    expect(window.gtag).not.toHaveBeenCalled()
    expect(window.dataLayer).toHaveLength(0)
  })

  it("sends exactly one page_view with the given title", () => {
    trackPageView("/owner-services?utm_source=ig", "Owner Services")
    expect(window.gtag).toHaveBeenCalledTimes(1)
    expect(window.gtag).toHaveBeenCalledWith(
      "event",
      "page_view",
      expect.objectContaining({ page_title: "Owner Services", page_path: "/owner-services?utm_source=ig" })
    )
  })

  it("maps funnels to service_type", () => {
    expect(serviceTypeFor("owner")).toBe("owner")
    expect(serviceTypeFor("stay")).toBe("guest")
    expect(serviceTypeFor("event", "wedding")).toBe("wedding")
    expect(serviceTypeFor("event", "gathering")).toBe("event")
    expect(serviceTypeFor("general")).toBeUndefined()
  })

  it("lead submit carries villa_name and service_type", () => {
    trackLeadFormSubmit({ target: "EVENT", need: "wedding", leadId: "L1", propertyName: "Versatile House" })
    const lead = window.dataLayer!.find((e) => e.event === "generate_lead")
    expect(lead).toMatchObject({ villa_name: "Versatile House", service_type: "wedding" })
  })

  it("fires click_phone, booking_request, calculator_open and cta_owner_click", () => {
    trackPhoneCall({ source: "footer", phoneNumber: "+6281234", propertyName: "Sky House", serviceType: "guest" })
    trackBookingInquiry({ propertyName: "Sky House", channel: "direct_whatsapp" })
    trackCalculatorOpen({ submarket: "x" })
    trackOwnerCtaClick({ location: "hero" })
    const names = window.dataLayer!.map((e) => e.event)
    expect(names).toEqual(
      expect.arrayContaining(["click_phone", "booking_request", "calculator_open", "cta_owner_click"])
    )
    expect(window.dataLayer!.find((e) => e.event === "booking_request")).toMatchObject({
      villa_name: "Sky House",
      service_type: "guest",
    })
  })
})
