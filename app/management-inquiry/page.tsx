"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Building2,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  CalendarCheck,
  MessageCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { trackWhatsAppClick } from "@/lib/analytics"

export default function ManagementInquiryPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    propertyType: "Standalone Villa",
    location: "Jagakarsa (Jakarta Selatan)",
    bedrooms: "3-4 Bedrooms",
    condition: "Fully Furnished",
    notes: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Prepare WhatsApp Message
    const message = encodeURIComponent(
      `Hello KingHouse Management! I would like to submit a property management inquiry:\n\n` +
      `👤 Name: ${formData.name}\n` +
      `📞 WhatsApp: ${formData.phone}\n` +
      `✉️ Email: ${formData.email}\n` +
      `🏡 Property Type: ${formData.propertyType}\n` +
      `📍 Location: ${formData.location}\n` +
      `🛏️ Bedrooms: ${formData.bedrooms}\n` +
      `🛋️ Condition: ${formData.condition}\n` +
      (formData.notes ? `📝 Notes: ${formData.notes}` : "")
    )

    trackWhatsAppClick({
      source: "management_inquiry",
      context: "owner_lead",
    })

    setSubmitted(true)
    window.open(`https://wa.me/6282123933218?text=${message}`, "_blank")
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-[#24221F] text-white pt-28 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
            alt="KingHouse Luxury Villa Management"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#24221F] via-[#24221F]/80 to-black/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#DFC58E] mb-4">
                <Building2 className="h-3.5 w-3.5" />
                <span>Villa &amp; Property Asset Management</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl uppercase tracking-[0.1em] font-normal leading-tight">
                Unlock Maximum Yield <br />
                <span className="text-[#DFC58E]">From Your Property</span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-[#E0DACB] font-light leading-relaxed">
                Transform your luxury home or apartment in Jabodetabek into a high-yielding, 5-star short-stay destination. Zero operational hassle, full transparency, and automated monthly owner payouts.
              </p>

              {/* Stats pill bar */}
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
                <div>
                  <p className="font-serif text-2xl sm:text-3xl text-white">85%+</p>
                  <p className="text-[11px] uppercase tracking-wider text-[#DFC58E]">Avg. Occupancy</p>
                </div>
                <div>
                  <p className="font-serif text-2xl sm:text-3xl text-white">2.4x</p>
                  <p className="text-[11px] uppercase tracking-wider text-[#DFC58E]">Yield vs Long-Term</p>
                </div>
                <div>
                  <p className="font-serif text-2xl sm:text-3xl text-white">4.9★</p>
                  <p className="text-[11px] uppercase tracking-wider text-[#DFC58E]">Guest Review Avg</p>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp fast-track badge */}
            <div className="w-full lg:w-auto shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center max-w-sm">
              <Sparkles className="h-6 w-6 text-[#DFC58E] mx-auto mb-2" />
              <h3 className="font-serif text-lg text-white font-normal">Need an Instant Feasibility Audit?</h3>
              <p className="text-xs text-[#E0DACB] font-light mt-1 mb-4">
                Send property photos and location to our WhatsApp for a 24-hour yield estimate.
              </p>
              <a
                href="https://wa.me/6282123933218?text=Hello%20KingHouse!%20I%20would%20like%20a%20property%20management%20audit%20for%20my%20property."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick({ source: "management_inquiry", context: "fast_track" })}
                className="w-full inline-flex items-center justify-center space-x-2 rounded-full bg-[#25D366] text-white py-3 px-5 text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-md"
              >
                <MessageCircle className="h-4 w-4 fill-white" />
                <span>Fast-Track WhatsApp Audit</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Management Pillars & Benefits */}
      <section className="py-16 lg:py-20 border-b border-[#E8E4DC]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C7F5F]">
              End-to-End Asset Care
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#222222] uppercase tracking-wider font-normal mt-1">
              Why Owners Choose KingHouse
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-[#E8E4DC] bg-white p-8 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-[#8C7F5F] mb-5">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl text-[#222222] font-normal mb-2">
                Dynamic Revenue Maximization
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] font-light leading-relaxed">
                Algorithmic pricing synced to regional concert schedules, business conventions, and seasonal holidays across Greater Jakarta to maximize ADR and eliminate empty nights.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E8E4DC] bg-white p-8 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-[#8C7F5F] mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl text-[#222222] font-normal mb-2">
                Vetted Guests &amp; Asset Protection
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] font-light leading-relaxed">
                Rigorous multi-layer guest screening, security deposits, strict quiet-hour enforcement, and up to $3M AirCover safety protection to keep your estate pristine.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E8E4DC] bg-white p-8 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-[#8C7F5F] mb-5">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl text-[#222222] font-normal mb-2">
                Hotel-Grade Linen &amp; Operations
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] font-light leading-relaxed">
                300+ thread count commercial linens, 48-point turnover inspections, preventive plumbing/AC maintenance, and dedicated on-site hospitality butlers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Management Inquiry Form */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="rounded-3xl border border-[#E8E4DC] bg-white p-8 sm:p-12 shadow-sm">
            <div className="text-center max-w-lg mx-auto mb-10">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C7F5F]">
                Property Onboarding
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#222222] uppercase tracking-wider font-normal mt-1">
                Submit Your Property Details
              </h2>
              <p className="text-xs sm:text-sm text-[#777777] font-light mt-2">
                Fill in the form below and our head of acquisitions will contact you within 24 hours with a comprehensive yield projection.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl bg-[#FAF8F3] border border-[#8C7F5F]/40 p-8 text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-[#8C7F5F] mx-auto" />
                <h3 className="font-serif text-2xl text-[#222222] font-normal">
                  Thank you, {formData.name}!
                </h3>
                <p className="text-sm text-[#666666] font-light max-w-md mx-auto leading-relaxed">
                  Your inquiry has been submitted. Our WhatsApp concierge has opened with your inquiry pre-filled. We look forward to partnering with you!
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#8C7F5F] hover:underline"
                  >
                    <span>Submit another property</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#555555] mb-2">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Hendra Wijaya"
                      className="w-full rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] px-4 py-3 text-sm text-[#222222] focus:border-[#8C7F5F] focus:outline-none"
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#555555] mb-2">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +62 812 3456 7890"
                      className="w-full rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] px-4 py-3 text-sm text-[#222222] focus:border-[#8C7F5F] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#555555] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. hendra@example.com"
                    className="w-full rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] px-4 py-3 text-sm text-[#222222] focus:border-[#8C7F5F] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Property Type */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#555555] mb-2">
                      Property Type
                    </label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] px-4 py-3 text-sm text-[#222222] focus:border-[#8C7F5F] focus:outline-none"
                    >
                      <option value="Standalone Villa">Standalone Villa</option>
                      <option value="Private Townhouse">Private Townhouse</option>
                      <option value="Luxury Apartment">Luxury Apartment</option>
                      <option value="Event Venue Estate">Event Venue Estate</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#555555] mb-2">
                      Location Area
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] px-4 py-3 text-sm text-[#222222] focus:border-[#8C7F5F] focus:outline-none"
                    >
                      <option value="Jagakarsa (Jakarta Selatan)">Jagakarsa (Jakarta Selatan)</option>
                      <option value="Tangerang (Banten)">Tangerang (Banten)</option>
                      <option value="Palmerah (Jakarta Barat)">Palmerah (Jakarta Barat)</option>
                      <option value="Cikarang (Bekasi)">Cikarang (Bekasi)</option>
                      <option value="Other Greater Jakarta">Other Greater Jakarta</option>
                    </select>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#555555] mb-2">
                      Bedrooms
                    </label>
                    <select
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] px-4 py-3 text-sm text-[#222222] focus:border-[#8C7F5F] focus:outline-none"
                    >
                      <option value="Studio / 1 Bedroom">Studio / 1 Bedroom</option>
                      <option value="2 Bedrooms">2 Bedrooms</option>
                      <option value="3-4 Bedrooms">3-4 Bedrooms</option>
                      <option value="5+ Bedrooms">5+ Bedrooms</option>
                    </select>
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#555555] mb-2">
                    Current Property Condition
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] px-4 py-3 text-sm text-[#222222] focus:border-[#8C7F5F] focus:outline-none"
                  >
                    <option value="Fully Furnished (Ready to Host)">Fully Furnished (Ready to Host)</option>
                    <option value="Semi-Furnished (Needs minor styling)">Semi-Furnished (Needs minor styling)</option>
                    <option value="Unfurnished (Requires complete setup)">Unfurnished (Requires complete setup)</option>
                    <option value="Currently on Airbnb (Seeking Better Yields)">Currently on Airbnb (Seeking Better Yields)</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#555555] mb-2">
                    Additional Notes or Special Features (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Private swimming pool, large garden suitable for gatherings, smart TV setup..."
                    className="w-full rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] px-4 py-3 text-sm text-[#222222] focus:border-[#8C7F5F] focus:outline-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#8C7F5F] py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white hover:bg-[#776B4E] transition-all shadow-md"
                >
                  Submit Inquiry &amp; Fast-Track WhatsApp Audit
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
