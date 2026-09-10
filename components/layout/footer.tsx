"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import {
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import { useLocalization } from "@/lib/context/localization-context"
import {
  trackEvent,
  trackWhatsAppClick,
  trackEmailClick,
} from "@/lib/analytics"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useLocalization()

  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      trackEvent("newsletter_subscribe", {
        event_category: "Engagement",
        event_label: "Footer Newsletter",
        email_submitted: email.trim(),
      })
      setIsSubscribed(true)
      setTimeout(() => {
        setEmail("")
        setIsSubscribed(false)
      }, 4000)
    }
  }


  return (
    <footer className="w-full">
      {/* 1. Top Newsletter Banner (Exact Nakula Style from footer.png) */}
      <div className="relative overflow-hidden bg-[#24221F] py-14 lg:py-16">
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80"
            alt="KingHouse Luxury Property"
            fill
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/75" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Headline */}
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl uppercase tracking-[0.12em] text-white leading-tight">
                {t("newsletterHeadline")}
              </h2>
            </div>

            {/* Newsletter Subscription Box */}
            <div className="w-full max-w-md rounded-lg bg-white/95 backdrop-blur-md p-6 shadow-2xl">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#222222] mb-1">
                {t("subscribeNewsletter")}
              </h3>
              <p className="text-xs text-[#666666] mb-4">
                Receive handpicked villa collections, seasonal promotions, and owner yield reports.
              </p>

              {isSubscribed ? (
                <div className="flex items-center space-x-2 rounded-md bg-[#FAF8F3] p-3 text-xs font-semibold text-[#8C7F5F] border border-[#8C7F5F]/30">
                  <CheckCircle2 className="h-4 w-4 text-[#8C7F5F]" />
                  <span>Thank you for subscribing to KingHouse!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div>
                    <label htmlFor="newsletter-email" className="block text-[10px] uppercase tracking-widest font-semibold text-[#777777] mb-1">
                      EMAIL
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("emailPlaceholder")}
                      required
                      className="w-full rounded border border-[#E0DCD3] bg-[#FAFAF8] px-3.5 py-2.5 text-xs text-[#222222] placeholder:text-[#999999] focus:border-[#8C7F5F] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded bg-[#8C7F5F] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#776B4E] transition-colors shadow-sm"
                  >
                    {t("signUp")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Body (Exact Nakula Olive/Khaki Palette #8C7F5F) */}
      <div className="bg-[#8C7F5F] text-[#F5F2EB] pt-16 pb-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            
            {/* Column 1: Monogram & ABOUT US */}
            <div className="lg:col-span-3 space-y-6">
              {/* Stylized Brand Emblem */}
              <Link href="/" className="inline-flex items-center space-x-3 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white transition-transform group-hover:scale-105">
                  <span className="font-serif text-2xl font-bold tracking-widest">K</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl tracking-[0.2em] text-white uppercase font-normal">
                    KINGHOUSE
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#E0DACB]">
                    Hospitality Management
                  </span>
                </div>
              </Link>

              {/* ABOUT US Links */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
                  {t("aboutUs")}
                </h4>
                <ul className="space-y-2 text-xs font-light text-[#F0EBE0]">
                  <li>
                    <Link href="/about" className="hover:text-white transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="hover:text-white transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/press" className="hover:text-white transition-colors">
                      Press
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white transition-colors">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="hover:text-white transition-colors">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-white transition-colors">
                      T&C
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/management-inquiry" className="hover:text-white font-medium text-white transition-colors">
                      Management Enquiry
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 2: DIRECT CONCIERGE & INQUIRIES (Streamlined & Non-Redundant) */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-2">
                  Direct Concierge & Reservations
                </h4>
                <p className="text-xs text-[#F0EBE0] font-light leading-relaxed">
                  Connect with our dedicated hospitality desk for guest bookings, custom event stays, or villa asset management partnerships across Jabodetabek.
                </p>
              </div>

              <div className="space-y-2.5 text-xs font-light text-[#F0EBE0] bg-black/10 rounded-lg p-4 border border-white/10">
                <div className="flex items-start space-x-2.5">
                  <Phone className="h-3.5 w-3.5 text-[#DFC58E] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#DFC58E] font-semibold block">
                      Hotline & WhatsApp Desk
                    </span>
                    <a
                      href="https://wa.me/6282123933218"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackWhatsAppClick({ source: "footer", context: "streamlined_hotline" })}
                      className="font-medium text-white hover:underline transition-colors text-sm"
                    >
                      +62 821 2393 3218
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 pt-2 border-t border-white/10">
                  <Mail className="h-3.5 w-3.5 text-[#DFC58E] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#DFC58E] font-semibold block">
                      Direct Email Inquiries
                    </span>
                    <a
                      href="mailto:ptkreasiusmangosse@gmail.com"
                      onClick={() => trackEmailClick({ source: "footer", email: "ptkreasiusmangosse@gmail.com" })}
                      className="font-medium text-white hover:underline transition-colors"
                    >
                      ptkreasiusmangosse@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                <Link
                  href="/contact"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
                >
                  <span>Guest Assistance</span>
                  <ArrowRight className="h-3 w-3 opacity-70" />
                </Link>
                <Link
                  href="/management-inquiry"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#8C7F5F] hover:bg-[#FAF8F5] text-xs font-semibold transition-colors"
                >
                  <span>Property Owner Inquiry</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Column 3: OFFICE, HOURS, CONNECT WITH US */}
            <div className="lg:col-span-4 space-y-6">
              {/* OFFICE */}
              <div className="space-y-1.5">
                <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
                  {t("office")}
                </h4>
                <p className="text-xs font-light text-[#F0EBE0] leading-relaxed">
                  Jalan Jagakarsa No. 9, Jakarta Selatan,<br />
                  DKI Jakarta, 12620 - Indonesia
                </p>
              </div>

              {/* HOURS */}
              <div className="space-y-1.5 pt-2">
                <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
                  {t("hours")}
                </h4>
                <p className="text-xs font-light text-[#F0EBE0]">
                  08:00 - 18:00 (GMT+7)<br />
                  Monday - Friday (Concierge 24/7 on WhatsApp)
                </p>
              </div>

              {/* CONNECT WITH US */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
                  {t("connectWithUs")}
                </h4>
                <div className="flex items-center space-x-3">
                  <a
                    href="https://www.tiktok.com/@kinghouse.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok @kinghouse.id"
                    className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white text-[#8C7F5F] hover:bg-[#FAF8F3] hover:scale-105 transition-all text-xs font-semibold shadow-xs"
                  >
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76c-.99-.02-1.95-.07-1.8-.07z" />
                    </svg>
                    <span>TikTok @kinghouse.id</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* 3. Bottom Bar (Clean Editorial Legal Footer) */}
          <div className="mt-14 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#E0DACB]">
            <div>
              <p>&copy; {currentYear} KingHouse Villa & Property Asset Management. All rights reserved.</p>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/stay" className="hover:text-white transition-colors">
                Guest Guide
              </Link>
              <span>&bull;</span>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <span>&bull;</span>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span>&bull;</span>
              <Link href="/login" className="hover:text-white transition-colors opacity-70 hover:opacity-100">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
