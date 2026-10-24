"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Clock, MessageCircle, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FormError, HoneypotField, selectClassName } from "@/components/funnel/form-fields"
import {
  OWNER_PROPERTY_STATUSES,
  OWNER_PROPERTY_TYPES,
  OWNER_SERVICE_CHOICES,
  type OwnerServiceChoice,
} from "@/lib/funnel/config"
import { buildWhatsAppUrl, ownerWhatsAppMessage } from "@/lib/funnel/whatsapp"
import { submitLead, type LeadErrorKey } from "@/lib/funnel/client"
import { trackWhatsAppClick } from "@/lib/analytics"
import { useLocalization } from "@/lib/context/localization-context"
import type { OwnerLeadInput } from "@/lib/validations"
import { useOwnerService } from "./owner-service-context"

type PropertyType = OwnerLeadInput["propertyType"]
type PropertyStatus = OwnerLeadInput["propertyStatus"]

/**
 * Funnel A step 3 — owner qualification form (8 fields, so it is not abandoned).
 * Sends the lead tagged OWNER + service, then continues on /thanks.
 */
export function OwnerLeadForm({ source = "owner_page" }: { source?: "owner_page" | "management_inquiry" }) {
  const router = useRouter()
  const { t, language } = useLocalization()
  const { service, setService } = useOwnerService()
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    email: "",
    propertyType: "rumah" as PropertyType,
    location: "",
    units: "1",
    propertyStatus: "not-listed" as PropertyStatus,
    website: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorKey, setErrorKey] = useState<LeadErrorKey | null>(null)

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorKey(null)
    setIsSubmitting(true)

    const result = await submitLead(
      {
        target: "OWNER",
        name: form.name,
        whatsapp: form.whatsapp,
        email: form.email,
        service,
        propertyType: form.propertyType,
        location: form.location,
        units: Number(form.units) || 1,
        propertyStatus: form.propertyStatus,
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

  const whatsappUrl = buildWhatsAppUrl("OWNER", ownerWhatsAppMessage({ service }, { t, language }))

  return (
    <section id="owner-form" className="scroll-mt-24 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-12">
        <div className="rounded-3xl border border-[#E8E4DC] bg-[#FAFAFA] p-6 shadow-[0_10px_50px_rgba(0,0,0,0.03)] sm:p-12">
          <div className="mb-8 space-y-2">
            <span className="text-sm font-semibold uppercase tracking-[0.15em] text-[#8C7F5F]">{t("f.owner.eyebrow")}</span>
            <h2 className="font-serif text-3xl text-[#222222] sm:text-4xl">{t("f.owner.title")}</h2>
            <p className="max-w-xl text-base leading-relaxed text-[#5C5347]">{t("f.owner.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="relative space-y-5">
            <HoneypotField value={form.website} onChange={(v) => update("website", v)} />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label={t("f.field.name")} htmlFor="owner-name" required>
                <Input
                  id="owner-name"
                  required
                  minLength={2}
                  autoComplete="name"
                  className="h-12 text-base"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </Field>
              <Field label={t("f.field.whatsapp")} htmlFor="owner-wa" required>
                <Input
                  id="owner-wa"
                  type="tel"
                  required
                  autoComplete="tel"
                  className="h-12 text-base"
                  placeholder={t("f.field.whatsappPlaceholder")}
                  value={form.whatsapp}
                  onChange={(e) => update("whatsapp", e.target.value)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label={t("f.field.email")} htmlFor="owner-email" hint={t("f.optional")}>
                <Input
                  id="owner-email"
                  type="email"
                  autoComplete="email"
                  className="h-12 text-base"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </Field>
              <Field label={t("f.owner.service")} htmlFor="owner-service" required>
                <select
                  id="owner-service"
                  value={service}
                  onChange={(e) => setService(e.target.value as OwnerServiceChoice)}
                  className={selectClassName}
                >
                  {OWNER_SERVICE_CHOICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {t(s.labelKey)}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Field label={t("f.owner.propertyType")} htmlFor="owner-type" required>
                <select
                  id="owner-type"
                  value={form.propertyType}
                  onChange={(e) => update("propertyType", e.target.value as PropertyType)}
                  className={selectClassName}
                >
                  {OWNER_PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {t(`f.owner.type.${type}`)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t("f.owner.location")} htmlFor="owner-location" required>
                <Input
                  id="owner-location"
                  required
                  minLength={2}
                  className="h-12 text-base"
                  placeholder={t("f.owner.locationPlaceholder")}
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                />
              </Field>
              <Field label={t("f.owner.units")} htmlFor="owner-units" required>
                <Input
                  id="owner-units"
                  type="number"
                  inputMode="numeric"
                  required
                  min={1}
                  max={500}
                  className="h-12 text-base"
                  value={form.units}
                  onChange={(e) => update("units", e.target.value)}
                />
              </Field>
            </div>

            <Field label={t("f.owner.status")} htmlFor="owner-status" required>
              <select
                id="owner-status"
                value={form.propertyStatus}
                onChange={(e) => update("propertyStatus", e.target.value as PropertyStatus)}
                className={selectClassName}
              >
                {OWNER_PROPERTY_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {t(`f.owner.status.${status}`)}
                  </option>
                ))}
              </select>
            </Field>

            <FormError message={errorKey ? t(errorKey) : null} />

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="h-14 w-full bg-[#222222] text-base font-semibold text-white shadow-md hover:bg-black"
            >
              {isSubmitting ? (
                t("f.sending")
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {t("f.owner.submit")} <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 flex flex-col gap-4 border-t border-[#E8E4DC] pt-5 text-sm text-[#5C5347] sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#8C7F5F]" /> {t("f.confidential")}
              </p>
              <p className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#8C7F5F]" /> {t("f.officeHours")}
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick({ source, funnel: "owner", context: service })}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-[#F0FDF4] px-5 py-3 text-sm font-semibold text-[#15803D] hover:bg-[#DCFCE7]"
            >
              <MessageCircle className="h-4 w-4" /> {t("f.owner.whatsapp")}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
