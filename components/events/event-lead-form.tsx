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
  OFFICE_HOURS,
  RESPONSE_TARGETS,
  type EventTypeId,
} from "@/lib/funnel/config"
import { buildWhatsAppUrl, eventWhatsAppMessage } from "@/lib/funnel/whatsapp"
import { submitLead } from "@/lib/funnel/client"
import { trackWhatsAppClick } from "@/lib/analytics"
import type { EventLeadInput } from "@/lib/validations"

type SpecialNeed = EventLeadInput["specialNeeds"][number]

interface EventLeadFormProps {
  eventType: EventTypeId
  onEventTypeChange: (id: EventTypeId) => void
}

function YesNo({ name, value, onChange }: { name: string; value: boolean | undefined; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-2">
      <ChoiceChip type="radio" name={name} label="Ya" checked={value === true} onChange={() => onChange(true)} />
      <ChoiceChip type="radio" name={name} label="Tidak" checked={value === false} onChange={() => onChange(false)} />
    </div>
  )
}

/**
 * Funnel B2 step 3 — one event form that asks everything the quote depends on
 * (date + backup, hours, headcount, vendors) so the first reply can be a price.
 */
export function EventLeadForm({ eventType, onEventTypeChange }: EventLeadFormProps) {
  const router = useRouter()
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
  const [error, setError] = useState<string | null>(null)

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const toggleNeed = (need: SpecialNeed) =>
    update(
      "specialNeeds",
      form.specialNeeds.includes(need) ? form.specialNeeds.filter((n) => n !== need) : [...form.specialNeeds, need]
    )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const result = await submitLead({
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
    })

    if (!result.ok) {
      setError(result.error || "Gagal mengirim, silakan coba lagi.")
      setIsSubmitting(false)
      return
    }
    router.push("/thanks")
  }

  const whatsappUrl = buildWhatsAppUrl(
    "EVENT",
    eventWhatsAppMessage({
      eventType,
      propertyName: form.property === EVENT_VENUES[0] ? form.property : undefined,
      date: form.eventDate || undefined,
      guests: Number(form.guests) || undefined,
    })
  )
  const visibleRules = EVENT_VENUE_RULES.filter((r) => r.value)

  return (
    <section id="event-form" className="scroll-mt-24 mx-auto max-w-7xl px-6 pb-16 pt-4 lg:px-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Venue rules — written once here so they are not asked again in chat */}
        <aside className="space-y-5 rounded-3xl border border-[#E8E4DC] bg-[#FAF8F5] p-6 sm:p-8 lg:order-2">
          <div className="flex items-center gap-2 text-[#8C7F5F]">
            <Info className="h-4 w-4" />
            <h3 className="text-[11px] font-bold uppercase tracking-widest">Aturan venue</h3>
          </div>
          <dl className="space-y-3">
            {visibleRules.map((rule) => (
              <div key={rule.label} className="border-b border-[#E8E4DC] pb-3 last:border-0 last:pb-0">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6862]">{rule.label}</dt>
                <dd className="mt-0.5 text-sm text-[#222225]">{rule.value}</dd>
              </div>
            ))}
          </dl>
          <a href="#pricelist" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C7F5F] hover:underline">
            Lihat pricelist paket <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </aside>

        <div className="rounded-3xl border border-[#E8E4DC] bg-white p-6 shadow-xs sm:p-10 lg:col-span-2">
          <div className="mb-6 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C7F5F]">Cek tanggal & harga</span>
            <h2 className="font-serif text-3xl text-[#222225]">Detail acara Anda</h2>
            <p className="text-xs text-[#6B6862]">
              Tim event membalas dalam {RESPONSE_TARGETS.EVENT.label} kerja dengan ketersediaan dan pricelist.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative space-y-5">
            <HoneypotField value={form.website} onChange={(v) => update("website", v)} />

            <Field label="Jenis acara" htmlFor="event-type" required>
              <div id="event-type" role="radiogroup" className="flex flex-wrap gap-2">
                {EVENT_TYPES.map((t) => (
                  <ChoiceChip
                    key={t.id}
                    type="radio"
                    name="eventType"
                    label={t.name}
                    checked={eventType === t.id}
                    onChange={() => onEventTypeChange(t.id)}
                  />
                ))}
              </div>
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Nama" htmlFor="event-name" required>
                <Input id="event-name" required minLength={2} autoComplete="name" value={form.name} onChange={(e) => update("name", e.target.value)} />
              </Field>
              <Field label="Nomor WhatsApp" htmlFor="event-wa" required>
                <Input
                  id="event-wa"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="0812-3456-7890"
                  value={form.whatsapp}
                  onChange={(e) => update("whatsapp", e.target.value)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Tanggal acara" htmlFor="event-date" required>
                <Input id="event-date" type="date" required value={form.eventDate} onChange={(e) => update("eventDate", e.target.value)} />
              </Field>
              <Field label="Tanggal cadangan" htmlFor="event-backup" hint="Opsional, agar kami bisa menawarkan alternatif">
                <Input id="event-backup" type="date" value={form.backupDate} onChange={(e) => update("backupDate", e.target.value)} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              <Field label="Jam mulai" htmlFor="event-start" required>
                <Input id="event-start" type="time" required value={form.startTime} onChange={(e) => update("startTime", e.target.value)} />
              </Field>
              <Field label="Jam selesai" htmlFor="event-end" required>
                <Input id="event-end" type="time" required value={form.endTime} onChange={(e) => update("endTime", e.target.value)} />
              </Field>
              <Field label={eventType === "shooting" ? "Jumlah kru" : "Jumlah tamu"} htmlFor="event-guests" required>
                <Input
                  id="event-guests"
                  type="number"
                  inputMode="numeric"
                  required
                  min={1}
                  max={1000}
                  value={form.guests}
                  onChange={(e) => update("guests", e.target.value)}
                />
              </Field>
              <Field label="Properti" htmlFor="event-property" required>
                <select id="event-property" value={form.property} onChange={(e) => update("property", e.target.value)} className={selectClassName}>
                  {EVENT_VENUES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Type-specific questions */}
            {eventType === "wedding" && (
              <div className="grid grid-cols-1 gap-5 rounded-2xl bg-[#FAF8F5] p-5 sm:grid-cols-3">
                <Field label="Sesi" htmlFor="event-session">
                  <div id="event-session" className="flex flex-wrap gap-2">
                    {(["akad", "resepsi", "keduanya"] as const).map((s) => (
                      <ChoiceChip
                        key={s}
                        type="radio"
                        name="weddingSession"
                        label={s.charAt(0).toUpperCase() + s.slice(1)}
                        checked={form.weddingSession === s}
                        onChange={() => update("weddingSession", s)}
                      />
                    ))}
                  </div>
                </Field>
                <Field label="Dekorasi sejak pagi?" htmlFor="event-early">
                  <YesNo name="earlyDecoration" value={form.earlyDecoration} onChange={(v) => update("earlyDecoration", v)} />
                </Field>
                <Field label="Bawa vendor sendiri?" htmlFor="event-vendor">
                  <YesNo name="ownVendor" value={form.ownVendor} onChange={(v) => update("ownVendor", v)} />
                </Field>
              </div>
            )}

            {eventType === "gathering" && (
              <div className="rounded-2xl bg-[#FAF8F5] p-5">
                <Field label="Bawa catering sendiri?" htmlFor="event-catering">
                  <YesNo name="ownVendor" value={form.ownVendor} onChange={(v) => update("ownVendor", v)} />
                </Field>
              </div>
            )}

            {eventType === "shooting" && (
              <div className="grid grid-cols-1 gap-5 rounded-2xl bg-[#FAF8F5] p-5 sm:grid-cols-2">
                <Field label="Tujuan shooting" htmlFor="event-purpose">
                  <div id="event-purpose" className="flex gap-2">
                    {(["komersial", "pribadi"] as const).map((p) => (
                      <ChoiceChip
                        key={p}
                        type="radio"
                        name="shootPurpose"
                        label={p.charAt(0).toUpperCase() + p.slice(1)}
                        checked={form.shootPurpose === p}
                        onChange={() => update("shootPurpose", p)}
                      />
                    ))}
                  </div>
                </Field>
                <Field label="Membawa peralatan besar?" htmlFor="event-equipment" hint="mis. crane, lighting besar, genset">
                  <YesNo name="heavyEquipment" value={form.heavyEquipment} onChange={(v) => update("heavyEquipment", v)} />
                </Field>
              </div>
            )}

            <Field label="Kebutuhan khusus" htmlFor="event-needs">
              <div id="event-needs" className="flex flex-wrap gap-2">
                {EVENT_SPECIAL_NEEDS.map((n) => (
                  <ChoiceChip key={n.id} label={n.label} checked={form.specialNeeds.includes(n.id)} onChange={() => toggleNeed(n.id)} />
                ))}
              </div>
            </Field>

            <Field label="Catatan" htmlFor="event-notes" hint="Opsional">
              <textarea
                id="event-notes"
                maxLength={500}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                className={textareaClassName}
              />
            </Field>

            <FormError message={error} />

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="h-14 w-full bg-[#8C7F5F] text-xs font-semibold uppercase tracking-widest text-white shadow-md hover:bg-[#776B4E]"
            >
              {isSubmitting ? (
                "Mengirim..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Cek Ketersediaan & Minta Pricelist <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 flex flex-col gap-3 border-t border-[#E8E4DC] pt-5 text-[11px] text-[#6B6862] sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#8C7F5F]" /> Jam kantor {OFFICE_HOURS.label}
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick({ source: "event_page", funnel: "event", context: eventType })}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-[#F0FDF4] px-5 py-2.5 text-xs font-semibold text-[#15803D] hover:bg-[#DCFCE7]"
            >
              <MessageCircle className="h-4 w-4" /> Lebih suka chat? WhatsApp tim event
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
