"use client"

import { useState } from "react"
import Link from "@/components/ui/localized-link"
import Image from "next/image"
import { Mail, Phone, MapPin, MessageSquare, ArrowUpRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  trackEvent,
  trackWhatsAppClick,
  trackEmailClick,
  trackPhoneCall,
} from "@/lib/analytics"
import { useLocalization } from "@/lib/context/localization-context"

export default function ContactPage() {
  const { tc } = useLocalization()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Owner Inquiries",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    trackEvent("contact_form_submit", {
      event_category: "Lead Generation",
      event_label: formData.subject,
      sender_name: formData.name,
      sender_email: formData.email,
      inquiry_subject: formData.subject,
    })
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Editorial Architectural Header with Real Flagship Asset */}
      <section className="relative overflow-hidden bg-[#1E1B18] text-white pt-24 pb-20 lg:pt-32 lg:pb-24 border-b border-[#352F27]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/properties/versatile-house/new/VersatileHouse_02_Living_Hall.jpg"
            alt={tc("Versatile House Flagship Living Hall")}
            fill
            priority
            className="object-cover brightness-[0.32]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B18] via-[#1E1B18]/70 to-black/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#DFC58E] backdrop-blur-md border border-white/15">
                {tc("Direct Communication Desk")}
              </span>
              <a
                href="https://www.airbnb.com/users/profile/1470743715397835749?previous_page_name=PdpHomeMarketplace"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-[#DFC58E]/20 hover:bg-[#DFC58E]/30 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#DFC58E] backdrop-blur-md border border-[#DFC58E]/50 transition-all hover:scale-105"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-[#DFC58E]" />
                <span>{tc("Official Airbnb Superhost • 4.5★ ↗")}</span>
              </a>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal leading-[1.1]">
              {tc("Get in Touch with Kinghouse")}
            </h1>
            <p className="text-base sm:text-lg text-[#E0DACB] font-light leading-relaxed">
              {tc("Whether you are planning a private getaway, hosting an intimate villa wedding, or looking for transparent revenue-share property management in Greater Jakarta, our hospitality team is here for you 24/7.")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="section-macro-spacing bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Direct Contact Channels Column */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A69C8E]">
                  {tc("Direct Channels")}
                </span>
                <h2 className="font-serif text-3xl text-[#222222]">
                  {tc("Concierge & Asset Management Desk")}
                </h2>
              </div>

              {/* Official Airbnb Superhost Screenshot Card */}
              <a
                href="https://www.airbnb.com/users/profile/1470743715397835749?previous_page_name=PdpHomeMarketplace"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border border-[#E8E4DC] bg-white overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                title={tc("Official Airbnb Superhost Profile")}
              >
                <div className="bg-[#FAF8F5] px-3.5 py-2 border-b border-[#E8E4DC] flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#FF385C]" />
                    <span className="font-semibold text-[#222222]">{tc("Official Airbnb Superhost Profile")}</span>
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {tc("Verified")}
                  </span>
                </div>
                <div className="p-3 bg-white flex items-center justify-center">
                  <Image
                    src="/brand/airbnb-superhost-profile-card.png"
                    alt={tc("Official Airbnb Superhost Profile")}
                    width={725}
                    height={507}
                    className="w-full h-auto rounded-xl object-contain shadow-xs transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                </div>
                <div className="bg-[#FAF8F5] px-4 py-2.5 border-t border-[#E8E4DC] flex items-center justify-between text-xs text-[#8C7F5F] font-semibold group-hover:bg-[#F2ECE1] transition-colors">
                  <span>{tc("View the original profile on airbnb.com")}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </a>

              {/* Fast WhatsApp Channel */}
              <div className="rounded-2xl border border-[#EBEBEB] bg-[#FAFAFA] p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#222222] text-white">
                    <MessageSquare className="h-5 w-5 text-[#25D366]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#222222]">{tc("Instant WhatsApp Concierge")}</h3>
                    <p className="text-xs text-[#717171]">{tc("Average reply time: under 15 minutes")}</p>
                  </div>
                </div>
                <Button asChild className="w-full text-xs uppercase tracking-wider font-semibold">
                  <a
                    href="https://wa.me/6282123933218?text=Hello%20Kinghouse%2C%20I%20would%20like%20to%20inquire%20about%20your%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick({ source: "contact_page", context: "instant_concierge" })}
                  >
                    {tc("Open WhatsApp Chat")} <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>

              {/* Contact Details List */}
              <div className="space-y-4 pt-2 text-sm text-[#222222]">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-[#A69C8E] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#717171] block">{tc("Direct Inquiries")}</span>
                    <a
                      href="mailto:info@kinghousemanagement.com"
                      onClick={() => trackEmailClick({ source: "contact_page", email: "info@kinghousemanagement.com" })}
                      className="font-medium hover:underline"
                    >
                      info@kinghousemanagement.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-[#A69C8E] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#717171] block">{tc("WhatsApp Desk")}</span>
                    <a
                      href="https://wa.me/6282123933218"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackPhoneCall({ source: "contact_page", phoneNumber: "+62 821-2393-3218" })}
                      className="font-medium hover:underline"
                    >
                      +62 821-2393-3218
                    </a>
                  </div>
                </div>


                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-[#A69C8E] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#717171] block">{tc("Headquarters • PT Kreasi Usman Gosse")}</span>
                    <a
                      href="https://maps.google.com/?q=18+Office+Park+Building+Jl.+TB+Simatupang+Kav.+18+Jakarta+Selatan+12520"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#222222] font-medium leading-relaxed block hover:text-[#8C7F5F] hover:underline transition-colors"
                    >
                      18 Office Park Building 21th Floor Unit C. Jl. TB Simatupang Kav. 18, Jakarta Selatan, 12520
                    </a>
                    <span className="inline-flex items-center space-x-1 text-xs text-[#8C7F5F] mt-1 font-semibold">
                      <a
                        href="https://maps.google.com/?q=18+Office+Park+Building+Jl.+TB+Simatupang+Kav.+18+Jakarta+Selatan+12520"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline inline-flex items-center space-x-1"
                      >
                        <span>{tc("Open in Google Maps")}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiries Form Column */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-[#EBEBEB] bg-[#FAFAFA] p-8 sm:p-12 shadow-xs">
                {submitted ? (
                  <div className="text-center py-12 space-y-4 animate-in fade-in duration-300">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#222222] text-white">
                      <CheckCircle2 className="h-7 w-7 text-[#A69C8E]" />
                    </div>
                    <h3 className="font-serif text-2xl text-[#222222]">{tc("Message Dispatched")}</h3>
                    <p className="text-xs text-[#717171] max-w-sm mx-auto">
                      {tc("Thank you for contacting Kinghouse. Our hospitality concierge or senior asset manager will follow up shortly.")}
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                      {tc("Send Another Message")}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                      <h3 className="font-serif text-2xl text-[#222222]">{tc("Send a Direct Inquiry")}</h3>
                      <p className="text-xs text-[#717171]">{tc("We respond to all requests within 24 hours.")}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#222222]">
                          {tc("Full Name *")}
                        </label>
                        <Input
                          required
                          placeholder="Marcus Aurelius"
                          value={tc(formData.name)}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#222222]">
                          {tc("Email Address *")}
                        </label>
                        <Input
                          type="email"
                          required
                          placeholder="marcus@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#222222]">
                        {tc("Inquiry Nature")}
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="flex h-11 w-full rounded-lg border border-[#EBEBEB] bg-white px-3.5 py-2 text-xs sm:text-sm text-[#222222] focus:border-[#222222] focus:outline-none cursor-pointer"
                      >
                        <option value="Owner Asset Management">{tc("Owner Asset Management (HK on Demand, Co-Hosting, Full Management)")}</option>
                        <option value="Guest Reservation Inquiry">{tc("Guest Reservation / Airbnb Inquiry")}</option>
                        <option value="Architectural Partnership">{tc("Architectural & Media Partnership")}</option>
                        <option value="General Question">{tc("General Question")}</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#222222]">
                        {tc("Message Details *")}
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder={tc("Tell us about your property, dates, or specific requirements...")}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full rounded-lg border border-[#EBEBEB] bg-white p-3.5 text-xs sm:text-sm text-[#222222] focus:border-[#222222] focus:outline-none"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full text-xs uppercase tracking-widest font-semibold h-12">
                      {tc("Submit Inquiry")}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
