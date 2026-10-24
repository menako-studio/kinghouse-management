"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Clock, MessageCircle, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FormError, HoneypotField, selectClassName } from "@/components/funnel/form-fields"
import {
  OFFICE_HOURS,
  OWNER_PROPERTY_STATUSES,
  OWNER_PROPERTY_TYPES,
  OWNER_SERVICE_CHOICES,
  RESPONSE_TARGETS,
  type OwnerServiceChoice,
} from "@/lib/funnel/config"
import { buildWhatsAppUrl, ownerWhatsAppMessage } from "@/lib/funnel/whatsapp"
import { submitLead } from "@/lib/funnel/client"
import { trackWhatsAppClick } from "@/lib/analytics"
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
  const [error, setError] = useState<string | null>(null)

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const result = await submitLead({
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
    })

    if (!result.ok) {
      setError(result.error || "Gagal mengirim, silakan coba lagi.")
      setIsSubmitting(false)
      return
    }
    router.push("/thanks")
  }

  const whatsappUrl = buildWhatsAppUrl("OWNER", ownerWhatsAppMessage({ service }))

  return (
    <section id="owner-form" className="scroll-mt-24 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-12">
        <div className="rounded-3xl border border-[#EBEBEB] bg-[#FAFAFA] p-8 shadow-[0_10px_50px_rgba(0,0,0,0.03)] sm:p-12">
          <div className="mb-8 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A69C8E]">Konsultasi pemilik</span>
            <h2 className="font-serif text-3xl text-[#222222] sm:text-4xl">Ceritakan properti Anda</h2>
            <p className="max-w-xl text-xs leading-relaxed text-[#717171] sm:text-sm">
              Kurang dari 1 menit. Tim owner relations membalas dalam {RESPONSE_TARGETS.OWNER.label} kerja dengan estimasi
              skema dan biaya.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative space-y-5">
            <HoneypotField value={form.website} onChange={(v) => update("website", v)} />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Nama" htmlFor="owner-name" required>
                <Input
                  id="owner-name"
                  required
                  minLength={2}
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </Field>
              <Field label="Nomor WhatsApp" htmlFor="owner-wa" required>
                <Input
                  id="owner-wa"
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
              <Field label="Email" htmlFor="owner-email" hint="Opsional">
                <Input
                  id="owner-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </Field>
              <Field label="Layanan yang diminati" htmlFor="owner-service" required>
                <select
                  id="owner-service"
                  value={service}
                  onChange={(e) => setService(e.target.value as OwnerServiceChoice)}
                  className={selectClassName}
                >
                  {OWNER_SERVICE_CHOICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Field label="Jenis properti" htmlFor="owner-type" required>
                <select
                  id="owner-type"
                  value={form.propertyType}
                  onChange={(e) => update("propertyType", e.target.value as PropertyType)}
                  className={selectClassName}
                >
                  {OWNER_PROPERTY_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Lokasi / kota" htmlFor="owner-location" required>
                <Input
                  id="owner-location"
                  required
                  minLength={2}
                  placeholder="mis. Jagakarsa, Jakarta Selatan"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                />
              </Field>
              <Field label="Jumlah kamar / unit" htmlFor="owner-units" required>
                <Input
                  id="owner-units"
                  type="number"
                  inputMode="numeric"
                  required
                  min={1}
                  max={500}
                  value={form.units}
                  onChange={(e) => update("units", e.target.value)}
                />
              </Field>
            </div>

            <Field label="Status properti" htmlFor="owner-status" required>
              <select
                id="owner-status"
                value={form.propertyStatus}
                onChange={(e) => update("propertyStatus", e.target.value as PropertyStatus)}
                className={selectClassName}
              >
                {OWNER_PROPERTY_STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>

            <FormError message={error} />

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="h-14 w-full bg-[#222222] text-xs font-semibold uppercase tracking-widest text-white shadow-md hover:bg-black"
            >
              {isSubmitting ? (
                "Mengirim..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Kirim & Jadwalkan Konsultasi <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 flex flex-col gap-4 border-t border-[#EBEBEB] pt-5 text-[11px] text-[#717171] sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#A69C8E]" /> Data Anda rahasia. Tanpa kewajiban.
              </p>
              <p className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#A69C8E]" /> Jam kantor {OFFICE_HOURS.label}
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick({ source, funnel: "owner", context: service })}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-[#F0FDF4] px-5 py-2.5 text-xs font-semibold text-[#15803D] hover:bg-[#DCFCE7]"
            >
              <MessageCircle className="h-4 w-4" /> Lebih suka chat? WhatsApp tim owner
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
