"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Phone, MapPin, MessageSquare, ArrowUpRight, CheckCircle2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  trackEvent,
  trackWhatsAppClick,
  trackEmailClick,
  trackPhoneCall,
} from "@/lib/analytics"

export default function ContactPage() {
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
      {/* Editorial Header */}
      <section className="section-macro-spacing bg-[#FAFAFA] border-b border-[#EBEBEB]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#A69C8E]">
              Direct Communication Desk
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#222222] font-normal leading-[1.1]">
              Get in Touch with Kinghouse
            </h1>
            <p className="text-base sm:text-lg text-[#717171] font-light leading-relaxed">
              Whether you are planning an architectural escape or seeking high-yield management for your luxury villa asset, our team is at your disposal.
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
                  Direct Channels
                </span>
                <h2 className="font-serif text-3xl text-[#222222]">
                  Concierge & Asset Management Desk
                </h2>
              </div>

              {/* Fast WhatsApp Channel */}
              <div className="rounded-2xl border border-[#EBEBEB] bg-[#FAFAFA] p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#222222] text-white">
                    <MessageSquare className="h-5 w-5 text-[#25D366]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#222222]">Instant WhatsApp Concierge</h3>
                    <p className="text-xs text-[#717171]">Average reply time: under 15 minutes</p>
                  </div>
                </div>
                <Button asChild className="w-full text-xs uppercase tracking-wider font-semibold">
                  <a
                    href="https://wa.me/6282123933218?text=Hello%20Kinghouse%2C%20I%20would%20like%20to%20inquire%20about%20your%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick({ source: "contact_page", context: "instant_concierge" })}
                  >
                    Open WhatsApp Chat <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>

              {/* Contact Details List */}
              <div className="space-y-4 pt-2 text-sm text-[#222222]">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-[#A69C8E] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#717171] block">Direct Inquiries</span>
                    <a
                      href="mailto:ptkreasiusmangosse@gmail.com"
                      onClick={() => trackEmailClick({ source: "contact_page", email: "ptkreasiusmangosse@gmail.com" })}
                      className="font-medium hover:underline"
                    >
                      ptkreasiusmangosse@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-[#A69C8E] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#717171] block">WhatsApp Desk</span>
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
                    <span className="text-xs text-[#717171] block">Principal Studio</span>
                    <span className="text-xs text-[#717171] leading-relaxed block">
                      Jakarta Selatan, Jabodetabek, Indonesia
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
                    <h3 className="font-serif text-2xl text-[#222222]">Message Dispatched</h3>
                    <p className="text-xs text-[#717171] max-w-sm mx-auto">
                      Thank you for contacting Kinghouse. Our hospitality concierge or senior asset manager will follow up shortly.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                      <h3 className="font-serif text-2xl text-[#222222]">Send a Direct Inquiry</h3>
                      <p className="text-xs text-[#717171]">We respond to all requests within 24 hours.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#222222]">
                          Full Name *
                        </label>
                        <Input
                          required
                          placeholder="Marcus Aurelius"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                          placeholder="marcus@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#222222]">
                        Inquiry Nature
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="flex h-11 w-full rounded-lg border border-[#EBEBEB] bg-white px-3.5 py-2 text-xs sm:text-sm text-[#222222] focus:border-[#222222] focus:outline-none cursor-pointer"
                      >
                        <option value="Owner Asset Management">Owner Asset Management (15% vs 20% Models)</option>
                        <option value="Guest Reservation Inquiry">Guest Reservation / Airbnb Inquiry</option>
                        <option value="Architectural Partnership">Architectural & Media Partnership</option>
                        <option value="General Question">General Question</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#222222]">
                        Message Details *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us about your property, dates, or specific requirements..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full rounded-lg border border-[#EBEBEB] bg-white p-3.5 text-xs sm:text-sm text-[#222222] focus:border-[#222222] focus:outline-none"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full text-xs uppercase tracking-widest font-semibold h-12">
                      Submit Inquiry
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
