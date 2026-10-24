"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Clock, Info, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChoiceChip, Field, FormError, HoneypotField, selectClassName, textareaClassName } from "@/components/funnel/form-fields"
import {
  EVENT_SPECIAL_NEEDS,
  EVENT_TYPES,
  EVENT_VENUES,
  EVENT_VENUE_RULES,
  EVENT_VENUE_UNDECIDED,
  type EventTypeId,
} from "@/lib/funnel/config"
import { buildWhatsAppUrl, eventWhatsAppMessage } from "@/lib/funnel/whatsapp"
import { submitLead, type LeadErrorKey } from "@/lib/funnel/client"
import { trackWhatsAppClick } from "@/lib/analytics"
import { useLocalization } from "@/lib/context/localization-context"
import type { EventLeadInput } from "@/lib/validations"

type SpecialNeed = EventLeadInput["specialNeeds"][number]
type FormErrorKey = LeadErrorKey | "f.ef.endBeforeStart"

interface EventLeadFormProps {
  eventType: EventTypeId
  onEventTypeChange: (id: EventTypeId) => void
}

const inputClass = "h-12 text-base"

/**
 * Funnel B2 step 3 — one event form that asks everything the quote depends on
 * (date + backup, hours, headcount, vendors) so the first reply can be a price.
 */
export function EventLeadForm({ eventType, onEventTypeChange }: EventLeadFormProps) {
  const router = useRouter()
  const { t, language } = useLocalization()
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    eventDate: "",
    backupDate: "",
    startTime: "10:00",
    endTime: "16:00",
    guests: "30",
    property: EVENT_VENUES[0] as string,
    specialNeeds: [] as SpecialNeed[],
    weddingSession: undefined as EventLeadInput["weddingSession"],
    ownVendor: undefined as boolean | undefined,
    earlyDecoration: undefined as boolean | undefined,
    shootPurpose: undefined as EventLeadInput["shootPurpose"],
    heavyEquipment: undefined as boolean | undefined,
    notes: "",
    website: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorKey, setErrorKey] = useState<FormErrorKey | null>(null)

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const toggleNeed = (need: SpecialNeed) =>
    update(
      "specialNeeds",
      form.specialNeeds.includes(need) ? form.specialNeeds.filter((n) => n !== need) : [...form.specialNeeds, need]
    )

  const yesNo = (name: string, value: boolean | undefined, onChange: (v: boolean) => void) => (
    <div className="flex gap-2">
      <ChoiceChip type="radio" name={name} label={t("f.yes")} checked={value === true} onChange={() => onChange(true)} />
      <ChoiceChip type="radio" name={name} label={t("f.no")} checked={value === false} onChange={() => onChange(false)} />
    </div>
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.endTime <= form.startTime) {
      setErrorKey("f.ef.endBeforeStart")
      return
    }
    setErrorKey(null)
    setIsSubmitting(true)

    const result = await submitLead(
      {
        target: "EVENT",
        name: form.name,
        whatsapp: form.whatsapp,
        eventType,
        eventDate: form.eventDate,
        backupDate: form.backupDate,
        startTime: form.startTime,
        endTime: form.endTime,
        guests: Number(form.guests) || 1,
        property: form.property,
        specialNeeds: form.specialNeeds,
        // Only send the questions that belong to the chosen event type.
        weddingSession: eventType === "wedding" ? form.weddingSession : undefined,
        ownVendor: eventType !== "shooting" ? form.ownVendor : undefined,
        earlyDecoration: eventType === "wedding" ? form.earlyDecoration : undefined,
        shootPurpose: eventType === "shooting" ? form.shootPurpose : undefined,
        heavyEquipment: eventType === "shooting" ? form.heavyEquipment : undefined,
        notes: form.notes,
        website: form.website,
      },
      { language }
    )

    if (!result.ok) {
      setErrorKey(result.errorKey ?? "f.errorGeneric")
      setIsSubmitting(false)
      return
    }
    router.push("/thanks")
  }

  const whatsappUrl = buildWhatsAppUrl(
    "EVENT",
    eventWhatsAppMessage(
      {
        eventType,
        propertyName: form.property === EVENT_VENUE_UNDECIDED ? undefined : form.property,
        date: form.eventDate || undefined,
        guests: Number(form.guests) || undefined,
      },
      { t, language }
    )
  )

  return (
    <section id="event-form" className="scroll-mt-24 mx-auto max-w-7xl px-6 pb-16 pt-4 lg:px-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Venue rules — written once here so they are not asked again in chat */}
        <aside className="space-y-5 self-start rounded-3xl border border-[#E8E4DC] bg-[#FAF8F5] p-6 sm:p-8 lg:order-2">
          <div className="flex items-center gap-2 text-[#8C7F5F]">
            <Info className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider">{t("f.rules.title")}</h3>
          </div>
          <dl className="space-y-3">
            {EVENT_VENUE_RULES.map((rule) => (
              <div key={rule.labelKey} className="border-b border-[#E8E4DC] pb-3 last:border-0 last:pb-0">
                <dt className="text-sm font-semibold text-[#5C5347]">{t(rule.labelKey)}</dt>
                <dd className="mt-0.5 text-base text-[#222225]">{t(rule.valueKey)}</dd>
              </div>
            ))}
          </dl>
          <a href="#pricelist" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8C7F5F] hover:underline">
            {t("f.rules.priceList")} <ArrowRight className="h-4 w-4" />
          </a>
        </aside>

        <div className="rounded-3xl border border-[#E8E4DC] bg-white p-6 shadow-xs sm:p-10 lg:col-span-2">
          <div className="mb-6 space-y-1">
            <span className="text-sm font-bold uppercase tracking-[0.15em] text-[#8C7F5F]">{t("f.ef.eyebrow")}</span>
            <h2 className="font-serif text-3xl text-[#222225]">{t("f.ef.title")}</h2>
            <p className="text-base text-[#5C5347]">{t("f.ef.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="relative space-y-5">
            <HoneypotField value={form.website} onChange={(v) => update("website", v)} />

            <Field label={t("f.ef.type")} required>
              <div className="flex flex-wrap gap-2">
                {EVENT_TYPES.map((type) => (
                  <ChoiceChip
                    key={type.id}
                    type="radio"
                    name="eventType"
                    label={t(`f.evt.${type.id}.name`)}
                    checked={eventType === type.id}
                    onChange={() => onEventTypeChange(type.id)}
                  />
                ))}
              </div>
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label={t("f.field.name")} htmlFor="event-name" required>
                <Input id="event-name" required minLength={2} autoComplete="name" className={inputClass} value={form.name} onChange={(e) => update("name", e.target.value)} />
              </Field>
              <Field label={t("f.field.whatsapp")} htmlFor="event-wa" required>
                <Input
                  id="event-wa"
                  type="tel"
                  required
                  autoComplete="tel"
                  className={inputClass}
                  placeholder={t("f.field.whatsappPlaceholder")}
                  value={form.whatsapp}
                  onChange={(e) => update("whatsapp", e.target.value)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label={t("f.ef.date")} htmlFor="event-date" required>
                <Input id="event-date" type="date" required className={inputClass} value={form.eventDate} onChange={(e) => update("eventDate", e.target.value)} />
              </Field>
              <Field label={t("f.ef.backupDate")} htmlFor="event-backup" hint={t("f.ef.backupHint")}>
                <Input id="event-backup" type="date" className={inputClass} value={form.backupDate} onChange={(e) => update("backupDate", e.target.value)} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              <Field label={t("f.ef.start")} htmlFor="event-start" required>
                <Input id="event-start" type="time" required className={inputClass} value={form.startTime} onChange={(e) => update("startTime", e.target.value)} />
              </Field>
              <Field label={t("f.ef.end")} htmlFor="event-end" required>
                <Input id="event-end" type="time" required className={inputClass} value={form.endTime} onChange={(e) => update("endTime", e.target.value)} />
              </Field>
              <Field label={t(eventType === "shooting" ? "f.ef.crew" : "f.ef.guests")} htmlFor="event-guests" required>
                <Input
                  id="event-guests"
                  type="number"
                  inputMode="numeric"
                  required
                  min={1}
                  max={1000}
                  className={inputClass}
                  value={form.guests}
                  onChange={(e) => update("guests", e.target.value)}
                />
              </Field>
              <Field label={t("f.ef.venue")} htmlFor="event-property" required>
                <select id="event-property" value={form.property} onChange={(e) => update("property", e.target.value)} className={selectClassName}>
                  {EVENT_VENUES.map((v) => (
                    <option key={v} value={v}>
                      {v === EVENT_VENUE_UNDECIDED ? t("f.ef.venueUndecided") : v}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Type-specific questions */}
            {eventType === "wedding" && (
              <div className="grid grid-cols-1 gap-5 rounded-2xl bg-[#FAF8F5] p-5 md:grid-cols-3">
                <Field label={t("f.ef.session")}>
                  <div className="flex flex-wrap gap-2">
                    {(["akad", "resepsi", "keduanya"] as const).map((session) => (
                      <ChoiceChip
                        key={session}
                        type="radio"
                        name="weddingSession"
                        label={t(`f.ef.session.${session}`)}
                        checked={form.weddingSession === session}
                        onChange={() => update("weddingSession", session)}
                      />
                    ))}
                  </div>
                </Field>
                <Field label={t("f.ef.earlyDecoration")}>
                  {yesNo("earlyDecoration", form.earlyDecoration, (v) => update("earlyDecoration", v))}
                </Field>
                <Field label={t("f.ef.ownVendor")}>
                  {yesNo("ownVendor", form.ownVendor, (v) => update("ownVendor", v))}
                </Field>
              </div>
            )}

            {eventType === "gathering" && (
              <div className="rounded-2xl bg-[#FAF8F5] p-5">
                <Field label={t("f.ef.ownCatering")}>
                  {yesNo("ownVendor", form.ownVendor, (v) => update("ownVendor", v))}
                </Field>
              </div>
            )}

            {eventType === "shooting" && (
              <div className="grid grid-cols-1 gap-5 rounded-2xl bg-[#FAF8F5] p-5 sm:grid-cols-2">
                <Field label={t("f.ef.purpose")}>
                  <div className="flex flex-wrap gap-2">
                    {(["komersial", "pribadi"] as const).map((purpose) => (
                      <ChoiceChip
                        key={purpose}
                        type="radio"
                        name="shootPurpose"
                        label={t(`f.ef.purpose.${purpose}`)}
                        checked={form.shootPurpose === purpose}
                        onChange={() => update("shootPurpose", purpose)}
                      />
                    ))}
                  </div>
                </Field>
                <Field label={t("f.ef.equipment")} hint={t("f.ef.equipmentHint")}>
                  {yesNo("heavyEquipment", form.heavyEquipment, (v) => update("heavyEquipment", v))}
                </Field>
              </div>
            )}

            <Field label={t("f.ef.needs")}>
              <div className="flex flex-wrap gap-2">
                {EVENT_SPECIAL_NEEDS.map((need) => (
                  <ChoiceChip key={need} label={t(`f.ef.need.${need}`)} checked={form.specialNeeds.includes(need)} onChange={() => toggleNeed(need)} />
                ))}
              </div>
            </Field>

            <Field label={t("f.ef.notes")} htmlFor="event-notes" hint={t("f.optional")}>
              <textarea
                id="event-notes"
                maxLength={500}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                className={textareaClassName}
              />
            </Field>

            <FormError message={errorKey ? t(errorKey) : null} />

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="h-14 w-full bg-[#8C7F5F] text-base font-semibold text-white shadow-md hover:bg-[#776B4E]"
            >
              {isSubmitting ? (
                t("f.sending")
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {t("f.ef.submit")} <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 flex flex-col gap-3 border-t border-[#E8E4DC] pt-5 text-sm text-[#5C5347] sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[#8C7F5F]" /> {t("f.officeHours")}
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick({ source: "event_page", funnel: "event", context: eventType })}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-[#F0FDF4] px-5 py-3 text-sm font-semibold text-[#15803D] hover:bg-[#DCFCE7]"
            >
              <MessageCircle className="h-4 w-4" /> {t("f.ef.whatsapp")}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
