// Kinghouse — WhatsApp deep links & pre-filled funnel messages
// Format: https://wa.me/<number>?text=<encoded message>, one message per button,
// always carrying the need (service / event type), property and dates — written
// in the visitor's language (lib/i18n/funnel).

import type { LanguageCode } from "@/lib/context/localization-context"
import { formatDateFor, translatorFor, type Translate } from "@/lib/i18n/funnel/core"
import {
  WHATSAPP_LINES,
  eventTypeLabelKey,
  ownerServiceLabelKey,
  type EventTypeId,
  type LeadTarget,
  type OwnerServiceChoice,
} from "./config"

/** `https://wa.me/<number>` for a funnel line (append `?text=` yourself or use buildWhatsAppUrl). */
export function whatsappBase(target: LeadTarget): string {
  return `https://wa.me/${WHATSAPP_LINES[target]}`
}

export function buildWhatsAppUrl(target: LeadTarget, message: string): string {
  return `${whatsappBase(target)}?text=${encodeURIComponent(message)}`
}

export interface MessageLocale {
  t: Translate
  language: LanguageCode
}

const DEFAULT_LOCALE: MessageLocale = { t: translatorFor(), language: "EN" }

export function ownerWhatsAppMessage(
  opts: { service: OwnerServiceChoice; propertyType?: string; location?: string; units?: number },
  { t }: MessageLocale = DEFAULT_LOCALE
): string {
  const service = opts.service === "undecided" ? t("f.wa.ownerUndecided") : t(ownerServiceLabelKey(opts.service))
  const typeAndPlace =
    opts.propertyType && opts.location
      ? t("f.wa.ownerTypeIn", { type: opts.propertyType, location: opts.location })
      : opts.propertyType || opts.location
  const detail = [typeAndPlace, opts.units ? t("f.wa.ownerUnits", { n: opts.units }) : undefined].filter(Boolean).join(", ")

  return [t("f.wa.owner", { service }), detail ? t("f.wa.ownerDetail", { detail }) : undefined, t("f.wa.ownerAsk")]
    .filter(Boolean)
    .join(" ")
}

export function stayWhatsAppMessage(
  opts: { propertyName?: string; checkIn?: string; checkOut?: string; guests?: number },
  { t, language }: MessageLocale = DEFAULT_LOCALE
): string {
  return t("f.wa.stay", {
    property: opts.propertyName || t("f.wa.stayAnyProperty"),
    when:
      opts.checkIn && opts.checkOut
        ? t("f.wa.stayWhen", {
            checkIn: formatDateFor(language, opts.checkIn),
            checkOut: formatDateFor(language, opts.checkOut),
          })
        : "",
    who: opts.guests ? t("f.wa.stayWho", { guests: opts.guests }) : "",
  })
}

export function eventWhatsAppMessage(
  opts: { eventType?: EventTypeId; propertyName?: string; date?: string; guests?: number },
  { t, language }: MessageLocale = DEFAULT_LOCALE
): string {
  return t("f.wa.event", {
    type: opts.eventType ? t(eventTypeLabelKey(opts.eventType)).toLowerCase() : t("f.wa.eventGeneric"),
    where: opts.propertyName ? t("f.wa.eventWhere", { property: opts.propertyName }) : "",
    when: opts.date ? t("f.wa.eventWhen", { date: formatDateFor(language, opts.date) }) : "",
    who: opts.guests ? t("f.wa.eventWho", { guests: opts.guests }) : "",
  })
}

/**
 * Picks the funnel line from the page the visitor is on, so the chat opens
 * with the right need instead of one generic message for every service.
 */
export function resolvePageWhatsApp(
  pathname: string,
  locale: MessageLocale = DEFAULT_LOCALE
): { target: LeadTarget; funnel: "owner" | "stay" | "event" | "general"; message: string } {
  if (/^\/(owner-services|management-inquiry|services)(\/|$)/.test(pathname)) {
    return { target: "OWNER", funnel: "owner", message: ownerWhatsAppMessage({ service: "undecided" }, locale) }
  }
  if (/^\/events(\/|$)/.test(pathname)) {
    return { target: "EVENT", funnel: "event", message: eventWhatsAppMessage({}, locale) }
  }
  if (/^\/(villas|stay)(\/|$)/.test(pathname) || /^\/locations\/[^/]+\/villas\//.test(pathname)) {
    return { target: "STAY", funnel: "stay", message: stayWhatsAppMessage({}, locale) }
  }
  return { target: "STAY", funnel: "general", message: locale.t("f.wa.general") }
}
