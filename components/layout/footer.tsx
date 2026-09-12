"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Mail,
  Phone,
  ArrowRight,
  MapPin,
  Briefcase,
} from "lucide-react"
import { useLocalization } from "@/lib/context/localization-context"
import {
  trackWhatsAppClick,
  trackEmailClick,
} from "@/lib/analytics"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useLocalization()


  return (
    <footer className="w-full">
      {/* Newsletter Section: Hidden until an email service provider (Resend/Brevo/Mailchimp) is configured */}
      {/* 2. Main Footer Body (Exact Nakula Olive/Khaki Palette #8C7F5F) */}
      <div className="bg-[#8C7F5F] text-[#F5F2EB] pt-16 pb-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            
            {/* Column 1: Monogram & ABOUT US */}
            <div className="lg:col-span-3 space-y-6">
              {/* Stylized Official Brand Logo */}
              <Link href="/" className="inline-flex items-center group py-1">
                <Image
                  src="/brand/logo-secondary-bone.svg"
                  alt="Kinghouse Management"
                  width={180}
                  height={52}
                  quality={100}
                  className="h-10 w-auto object-contain transition-opacity group-hover:opacity-85"
                />
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
                  <li>
                    <a
                      href="https://glints.com/id/en/companies/pt-kreasi-usman-gosse/351bd7d6-fff5-4a77-a91b-f69918d3b2fe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white font-medium text-[#DFC58E] transition-colors inline-flex items-center space-x-1"
                    >
                      <Briefcase className="h-3 w-3" />
                      <span>Careers (Glints)</span>
                      <span className="text-[10px]">↗</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.kinghousecleaning.id/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white font-medium text-[#DFC58E] transition-colors inline-flex items-center space-x-1"
                    >
                      <span>Kinghouse Cleaning</span>
                      <span className="text-[10px]">↗</span>
                    </a>
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

            {/* Column 3: OFFICE, HOURS, CONNECT WITH US & ECOSYSTEM */}
            <div className="lg:col-span-4 space-y-6">
              {/* OFFICE / CORPORATE HEADQUARTERS */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
                  Corporate Headquarters
                </h4>
                <div className="text-xs font-light text-[#F0EBE0] leading-relaxed">
                  <p className="font-semibold text-white">PT Kreasi Usman Gosse</p>
                  <p className="mt-0.5">
                    Jl. Reni Jaya Blk. K2 No.16, Pd. Ranji, Kec. Ciputat Tim., Kota Tangerang Selatan, Banten 15416
                  </p>
                </div>

                {/* Google Maps & Reviews Link */}
                <div className="pt-1">
                  <a
                    href="https://share.google/WHLcKlmJf8zZo27gO"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-black/20 hover:bg-black/35 border border-white/15 text-xs text-white transition-all group"
                  >
                    <MapPin className="h-3.5 w-3.5 text-[#DFC58E]" />
                    <span className="font-medium group-hover:text-[#DFC58E] transition-colors">Google Maps &amp; Reviews</span>
                    <span className="text-[10px] opacity-70">↗</span>
                  </a>
                </div>
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

              {/* AFFILIATE BUSINESS LINE: KINGHOUSE CLEANING */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
                  Our Business Lines
                </h4>
                <a
                  href="https://www.kinghousecleaning.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3 rounded-lg bg-black/15 border border-white/10 hover:border-[#DFC58E]/50 hover:bg-black/25 transition-all text-xs"
                >
                  <div>
                    <span className="font-medium text-white block group-hover:text-[#DFC58E] transition-colors">
                      Kinghouse Cleaning
                    </span>
                    <span className="text-[11px] text-[#F0EBE0]/80 font-light block">
                      Housekeeping, Villa Turnover & Deep Cleaning
                    </span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-[#DFC58E] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </a>
              </div>
            </div>

          </div>

          {/* 3. Bottom Bar (Clean Editorial Legal Footer) */}
          <div className="mt-14 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#E0DACB]">
            <div>
              <p>&copy; {currentYear} Kinghouse Management &bull; PT Kreasi Usman Gosse. All rights reserved.</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link href="/stay" className="hover:text-white transition-colors">
                Guest Guide
              </Link>
              <span>&bull;</span>
              <a
                href="https://www.kinghousecleaning.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white text-[#DFC58E] font-medium transition-colors"
              >
                Kinghouse Cleaning
              </a>
              <span>&bull;</span>
              <a
                href="https://glints.com/id/en/companies/pt-kreasi-usman-gosse/351bd7d6-fff5-4a77-a91b-f69918d3b2fe"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white text-[#DFC58E] font-medium transition-colors"
              >
                Careers
              </a>
              <span>&bull;</span>
              <a
                href="https://share.google/WHLcKlmJf8zZo27gO"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white text-[#DFC58E] font-medium transition-colors"
              >
                Google Business
              </a>
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
