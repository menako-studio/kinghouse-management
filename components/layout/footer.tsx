"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowUpRight, Clock, Mail, MapPin, MessageCircle } from "lucide-react"
import { useWhatsAppChooser } from "@/components/funnel/whatsapp-chooser"
import { useLocalization } from "@/lib/context/localization-context"
import { MANAGED_AREAS } from "@/lib/constants"
import { trackEmailClick } from "@/lib/analytics"

const EMAIL = "info@kinghousemanagement.com"
const MAPS_URL =
  "https://maps.google.com/?q=18+Office+Park+Building+Jl.+TB+Simatupang+Kav.+18+Jakarta+Selatan+12520"

const EXTERNAL = {
  airbnb: "https://www.airbnb.com/users/profile/1470743715397835749",
  tiktok: "https://www.tiktok.com/@kinghousemanagement",
  google: "https://share.google/WHLcKlmJf8zZo27gO",
  careers: "https://glints.com/id/en/companies/pt-kreasi-usman-gosse/351bd7d6-fff5-4a77-a91b-f69918d3b2fe",
  cleaning: "https://www.kinghousecleaning.id/",
}

// Global h1/h2 rules set the serif face; column labels use the interface face.
const SANS_HEADING = { fontFamily: "var(--font-sans-family)", fontWeight: 600, letterSpacing: "0.14em" }

interface FooterLink {
  href: string
  label: string
  external?: boolean
}

/**
 * Every destination appears once: services, areas and company pages in three
 * link columns, all contact routes in one column, legal links in the bottom bar.
 */
export function Footer() {
  const currentYear = new Date().getFullYear()
  const { t, localizeHref } = useLocalization()
  const { open: openChooser } = useWhatsAppChooser()

  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: t("ftServices"),
      links: [
        { href: "/villas", label: t("f.footer.villas") },
        { href: "/events", label: t("f.footer.events") },
        { href: "/owner-services", label: t("navOwnerServices") },
        { href: "/airbnb-cleaning-jakarta", label: t("f.footer.cleaning") },
        { href: "/stay", label: t("ftGuestGuide") },
      ],
    },
    {
      title: t("ftAreas"),
      links: MANAGED_AREAS.map((a) => ({ href: `/locations/${a.slug}`, label: a.name })),
    },
    {
      title: t("ftCompany"),
      links: [
        { href: "/about", label: t("ftAbout") },
        { href: "/blog", label: "Blog" },
        { href: "/press", label: t("ftPress") },
        { href: "/faq", label: "FAQ" },
        { href: "/contact", label: t("ftContact") },
        { href: EXTERNAL.careers, label: t("ftCareers"), external: true },
        { href: EXTERNAL.cleaning, label: "Kinghouse Cleaning", external: true },
      ],
    },
  ]

  const linkClass =
    "inline-block py-1 text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline"
  const headingClass = "text-sm font-semibold uppercase tracking-[0.14em] text-[#EFE2CE]"

  return (
    <footer className="w-full bg-[#776B4E] text-white print:hidden">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-14 lg:px-12 lg:pt-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 space-y-5 md:col-span-3 lg:col-span-3">
            <Link href={localizeHref("/")} className="inline-flex py-1" aria-label="Kinghouse Management">
              <Image
                src="/brand/logo-secondary-bone.svg"
                alt="Kinghouse Management"
                width={180}
                height={52}
                className="h-11 w-auto"
                style={{ width: "auto" }}
              />
            </Link>
            <p className="max-w-xs text-base leading-relaxed text-white/90">
              {t("ftTagline")}
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { href: EXTERNAL.airbnb, label: "★ Airbnb Superhost" },
                { href: EXTERNAL.google, label: "Google" },
                { href: EXTERNAL.tiktok, label: "TikTok" },
              ].map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center gap-1 rounded-full border border-white/30 px-4 text-sm font-medium text-white transition-colors hover:bg-white hover:text-[#231F1A]"
                >
                  {s.label}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="space-y-3 lg:col-span-2">
              <h2 className={headingClass} style={SANS_HEADING}>{col.title}</h2>
              <ul className="space-y-1 text-base">
                {col.links.map((l) => (
                  <li key={l.href}>
                    {l.external ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        {l.label.split(" ").slice(0, -1).join(" ")}{" "}
                        <span className="whitespace-nowrap">
                          {l.label.split(" ").at(-1)}
                          <ArrowUpRight className="ml-1 inline h-3.5 w-3.5 align-[-0.1em] opacity-70" aria-hidden="true" />
                        </span>
                      </a>
                    ) : (
                      <Link href={localizeHref(l.href)} className={linkClass}>
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact */}
          <div className="col-span-2 space-y-4 md:col-span-3 lg:col-span-3">
            <h2 className={headingClass} style={SANS_HEADING}>{t("ftContact")}</h2>
            <button
              type="button"
              onClick={() => openChooser({ source: "footer", context: "footer" })}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-base font-semibold text-[#231F1A] transition-colors hover:bg-[#FAF7F1] sm:w-auto"
            >
              <MessageCircle className="h-5 w-5 text-[#25D366]" aria-hidden="true" />
              {t("waChooserTitle")}
            </button>
            <ul className="space-y-3 text-base text-white/90">
              <li className="flex gap-3">
                <Mail className="mt-1 h-4 w-4 shrink-0 text-[#EFE2CE]" aria-hidden="true" />
                <a
                  href={`mailto:${EMAIL}`}
                  onClick={() => trackEmailClick({ source: "footer", email: EMAIL })}
                  className="break-words text-[0.9375rem] hover:text-white hover:underline [overflow-wrap:anywhere]"
                >
                  {EMAIL}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#EFE2CE]" aria-hidden="true" />
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">
                  18 Office Park, Lt. 21 Unit C, Jl. TB Simatupang Kav. 18, Jakarta Selatan 12520
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-1 h-4 w-4 shrink-0 text-[#EFE2CE]" aria-hidden="true" />
                <span>
                  {t("ftOffice")}
                  <br />
                  {t("ftConcierge")}
                </span>
              </li>
            </ul>
            <Link
              href={localizeHref("/management-inquiry")}
              className="inline-flex items-center gap-1.5 text-base font-semibold text-[#EFE2CE] hover:text-white hover:underline"
            >
              {t("ftOwnerCta")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Bottom bar: legal only */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/20 pt-6 text-sm text-white/80 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {currentYear} Kinghouse Management · PT Kreasi Usman Gosse
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li>
              <Link href={localizeHref("/terms")} className="hover:text-white hover:underline">
                {t("ftTerms")}
              </Link>
            </li>
            <li>
              <Link href={localizeHref("/privacy")} className="hover:text-white hover:underline">
                {t("ftPrivacy")}
              </Link>
            </li>
            <li>
              <Link href="/login" rel="nofollow" className="text-white/60 hover:text-white hover:underline">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
