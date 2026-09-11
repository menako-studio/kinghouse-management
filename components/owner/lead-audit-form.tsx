"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { trackOwnerLead, trackWhatsAppClick } from "@/lib/analytics"

export function LeadAuditForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    villaLinkOrLocation: "",
    managementModel: "full-management",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    trackOwnerLead({
      propertyType: formData.managementModel,
      area: formData.villaLinkOrLocation || "Jabodetabek",
      ownerName: formData.fullName,
      serviceTier: formData.managementModel === "full-management" ? "15% Full Service" : "20% Premium",
    })

    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 800)
  }


  return (
    <section id="audit" className="section-macro-spacing bg-white">
      <div className="mx-auto max-w-4xl px-6 lg:px-12">
        <div className="rounded-3xl border border-[#EBEBEB] bg-[#FAFAFA] p-8 sm:p-14 shadow-[0_10px_50px_rgba(0,0,0,0.03)]">
          {isSubmitted ? (
            <div className="text-center py-12 space-y-6 animate-in fade-in zoom-in-95 duration-400">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#222222] text-white">
                <CheckCircle2 className="h-8 w-8 text-[#A69C8E]" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-3xl text-[#222222]">
                  Property Audit Request Received
                </h3>
                <p className="text-sm text-[#717171] max-w-md mx-auto">
                  Thank you, <strong className="text-[#222222]">{formData.fullName}</strong>. Our senior asset manager will analyze your property and reach out via email and WhatsApp within 24 hours with your custom revenue and EBITDA yield projection.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs uppercase tracking-wider font-semibold"
                >
                  Submit Another Property
                </Button>
                <Button
                  asChild
                  className="text-xs uppercase tracking-wider font-semibold"
                >
                  <a
                    href={`https://wa.me/6282123933218?text=${encodeURIComponent(
                      `Hello Kinghouse, I just requested an audit for my villa in ${formData.villaLinkOrLocation}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick({ source: "owner_page", context: "fast_track_audit" })}
                  >
                    <MessageSquare className="mr-2 h-4 w-4 text-[#25D366]" />
                    Fast-Track via WhatsApp
                  </a>

                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Form Header */}
              <div className="space-y-3 text-center sm:text-left">
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A69C8E]">
                  Free Property Audit
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-[#222222]">
                  Discover Your Villa&apos;s True Revenue Potential
                </h3>
                <p className="text-xs sm:text-sm text-[#717171] leading-relaxed max-w-xl">
                  Receive a complimentary RevPAR benchmark, competitive pricing model, and 12-month EBITDA projection tailored to your asset.
                </p>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#222222]">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Alexander Richter"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#222222]">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="alexander@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#222222]">
                      Phone / WhatsApp Number *
                    </label>
                    <Input
                      type="tel"
                      required
                      placeholder="+62 812-3456-7890 or +65..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#222222]">
                      Preferred Management Model
                    </label>
                    <select
                      value={formData.managementModel}
                      onChange={(e) => setFormData({ ...formData, managementModel: e.target.value })}
                      className="flex h-11 w-full rounded-lg border border-[#EBEBEB] bg-white px-3.5 py-2 text-xs sm:text-sm text-[#222222] focus:border-[#222222] focus:outline-none cursor-pointer"
                    >
                      <option value="full-management">Option B: Full Management (20% Fee - Turnkey)</option>
                      <option value="exclusive-marketing">Option A: Exclusive Marketing (15% Fee - Marketing Only)</option>
                      <option value="undecided">Undecided / Need Consultation</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#222222]">
                    Villa Link, Airbnb URL, or Location / Specifications *
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. airbnb.com/rooms/45834267 atau Rumah 5BR di Jagakarsa, Jakarta Selatan"
                    value={formData.villaLinkOrLocation}
                    onChange={(e) => setFormData({ ...formData, villaLinkOrLocation: e.target.value })}
                    className="bg-white"
                  />
                </div>

                {/* Primary CTA */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                    className="w-full h-14 bg-[#222222] text-white hover:bg-black font-semibold text-xs uppercase tracking-widest shadow-md transition-all active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <span>Analyzing Property...</span>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <span>Get a Free Property Audit</span>
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>

                {/* Trust Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-[#EBEBEB] text-[11px] text-[#717171]">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#A69C8E]" />
                    <span>100% Confidential. No obligation or upfront fees.</span>
                  </div>
                  <span>Response time: Under 24 hours</span>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
