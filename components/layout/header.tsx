"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import {
  ChevronDown,
  Globe,
  DollarSign,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Check,
} from "lucide-react"
import {
  useLocalization,
  SUPPORTED_CURRENCIES,
  SUPPORTED_LANGUAGES,
  CurrencyCode,
  LanguageCode,
} from "@/lib/context/localization-context"

export function Header() {
  const pathname = usePathname()
  const {
    currency,
    setCurrency,
    currentCurrencyConfig,
    language,
    setLanguage,
    currentLanguageConfig,
    t,
  } = useLocalization()

  const [isScrolled, setIsScrolled] = useState(false)
  const [propertiesMenuOpen, setPropertiesMenuOpen] = useState(false)
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navRef = useRef<HTMLDivElement>(null)
  const currencyRef = useRef<HTMLDivElement>(null)
  const languageRef = useRef<HTMLDivElement>(null)

  // Auto-close dropdowns on scroll or path change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPropertiesMenuOpen(false)
    setCurrencyDropdownOpen(false)
    setLanguageDropdownOpen(false)
    setMobileMenuOpen(false)
  }, [pathname])

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        currencyRef.current &&
        !currencyRef.current.contains(event.target as Node)
      ) {
        setCurrencyDropdownOpen(false)
      }
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setLanguageDropdownOpen(false)
      }
      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setPropertiesMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-[#E8E4DC] bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
          : "border-b border-[#F0ECE1] bg-white"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Left: Official Brandmark Logo (Secondary Horizontal) */}
        <Link
          href="/"
          className="group flex items-center shrink-0 py-1"
          onClick={() => {
            setPropertiesMenuOpen(false)
          }}
          aria-label="Kinghouse Management Home"
        >
          <Image
            src="/brand/logo-secondary-charcoal.svg"
            alt="Kinghouse Management"
            width={160}
            height={46}
            priority
            className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-opacity duration-200 group-hover:opacity-80"
          />
        </Link>

        {/* Right Section: Desktop Navigation Links + Utility Controls Grouped Together (Nakula.com Layout) */}
        <div className="hidden lg:flex items-center space-x-7 xl:space-x-10 shrink-0">
          {/* Navigation Bar in Cormorant Garamond Serif */}
          <nav className="flex items-center space-x-5 xl:space-x-7">
            <Link
              href="/"
              className={`font-serif text-[13px] uppercase tracking-[0.2em] whitespace-nowrap transition-colors py-1 ${
                pathname === "/" ? "text-[#8C7F5F] font-semibold" : "text-[#231F1A] hover:text-[#8C7F5F]"
              }`}
            >
              {t("home") || "Home"}
            </Link>

            {/* OUR PROPERTIES dropdown toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setPropertiesMenuOpen(!propertiesMenuOpen)
                  setCurrencyDropdownOpen(false)
                  setLanguageDropdownOpen(false)
                }}
                onMouseEnter={() => setPropertiesMenuOpen(true)}
                className={`flex items-center space-x-1 font-serif text-[13px] uppercase tracking-[0.2em] whitespace-nowrap transition-colors py-1 cursor-pointer ${
                  propertiesMenuOpen || pathname.startsWith("/villas") || pathname.startsWith("/locations")
                    ? "text-[#8C7F5F] font-semibold"
                    : "text-[#231F1A] hover:text-[#8C7F5F]"
                }`}
              >
                <span>{t("ourProperties")}</span>
                <ChevronDown
                  className={`h-3 w-3 stroke-[1.5] transition-transform duration-200 ${
                    propertiesMenuOpen ? "rotate-180 text-[#8C7F5F]" : "text-[#231F1A]/70"
                  }`}
                />
              </button>
            </div>

            <Link
              href="/villas"
              className={`font-serif text-[13px] uppercase tracking-[0.2em] whitespace-nowrap transition-colors py-1 ${
                pathname === "/offers" ? "text-[#8C7F5F] font-semibold" : "text-[#231F1A] hover:text-[#8C7F5F]"
              }`}
            >
              {t("monthlyOffers")}
            </Link>

            <Link
              href="/events"
              className={`font-serif text-[13px] uppercase tracking-[0.2em] whitespace-nowrap transition-colors py-1 ${
                pathname === "/events" ? "text-[#8C7F5F] font-semibold" : "text-[#231F1A] hover:text-[#8C7F5F]"
              }`}
            >
              {t("events")}
            </Link>

            {/* OWNER SERVICES */}
            <Link
              href="/owner-services"
              className={`font-serif text-[13px] uppercase tracking-[0.2em] whitespace-nowrap transition-colors py-1 ${
                pathname === "/owner-services" ? "text-[#8C7F5F] font-semibold" : "text-[#231F1A] hover:text-[#8C7F5F]"
              }`}
            >
              {t("ownerServices")}
            </Link>

            {/* ENQUIRE underlined with editorial offset */}
            <Link
              href="/contact"
              className="font-serif text-[13px] uppercase tracking-[0.2em] whitespace-nowrap text-[#231F1A] hover:text-[#8C7F5F] underline underline-offset-8 decoration-1 transition-colors py-1"
            >
              {t("enquire")}
            </Link>
          </nav>

          {/* Right Utilities: Currency, Language & Pill Button */}
          <div className="flex items-center space-x-5 xl:space-x-6 shrink-0">
            {/* Currency Dropdown (matching nakula.com) */}
            <div className="relative" ref={currencyRef}>
              <button
                type="button"
                onClick={() => {
                  setCurrencyDropdownOpen(!currencyDropdownOpen)
                  setLanguageDropdownOpen(false)
                  setPropertiesMenuOpen(false)
                }}
                className="flex items-center space-x-1 font-serif text-[13px] uppercase tracking-[0.16em] text-[#231F1A] hover:text-[#8C7F5F] transition-colors py-1 cursor-pointer"
              >
                <span>$ {currentCurrencyConfig.short}</span>
                <ChevronDown
                  className={`h-3 w-3 stroke-[1.5] text-[#231F1A]/70 transition-transform ${
                    currencyDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white py-1.5 shadow-2xl border border-[#E8E4DC] ring-1 ring-black/5 z-50">
                  <div className="px-3 py-1 text-[10px] uppercase font-semibold text-[#8C7F5F] tracking-wider border-b border-[#F0ECE1]">
                    Select Currency
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {SUPPORTED_CURRENCIES.map((curr) => (
                      <button
                        key={curr.code}
                        type="button"
                        onClick={() => {
                          setCurrency(curr.code)
                          setCurrencyDropdownOpen(false)
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition-colors ${
                          currency === curr.code
                            ? "bg-[#FAF8F3] text-[#8C7F5F] font-semibold"
                            : "text-[#444444] hover:bg-[#F7F5F0] hover:text-[#222222]"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-6 font-semibold text-center text-[#8C7F5F]">
                            {curr.symbol}
                          </span>
                          <span>{curr.label}</span>
                        </div>
                        {currency === curr.code && <Check className="h-3.5 w-3.5 text-[#8C7F5F]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Dropdown (matching nakula.com) */}
            <div className="relative" ref={languageRef}>
              <button
                type="button"
                onClick={() => {
                  setLanguageDropdownOpen(!languageDropdownOpen)
                  setCurrencyDropdownOpen(false)
                  setPropertiesMenuOpen(false)
                }}
                className="flex items-center space-x-1.5 font-serif text-[13px] uppercase tracking-[0.16em] text-[#231F1A] hover:text-[#8C7F5F] transition-colors py-1 cursor-pointer"
              >
                <Globe className="h-3.5 w-3.5 stroke-[1.25] text-[#231F1A]" />
                <span>{currentLanguageConfig.code}</span>
                <ChevronDown
                  className={`h-3 w-3 stroke-[1.5] text-[#231F1A]/70 transition-transform ${
                    languageDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {languageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-lg bg-white py-1.5 shadow-2xl border border-[#E8E4DC] ring-1 ring-black/5 z-50">
                  <div className="px-3 py-1 text-[10px] uppercase font-semibold text-[#8C7F5F] tracking-wider border-b border-[#F0ECE1]">
                    Select Language
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code)
                          setLanguageDropdownOpen(false)
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition-colors ${
                          language === lang.code
                            ? "bg-[#FAF8F3] text-[#8C7F5F] font-semibold"
                            : "text-[#444444] hover:bg-[#F7F5F0] hover:text-[#222222]"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-9 font-mono text-[11px] font-semibold text-[#8C7F5F]">
                            {lang.code}
                          </span>
                          <span>{lang.nativeName}</span>
                        </div>
                        {language === lang.code && <Check className="h-3.5 w-3.5 text-[#8C7F5F]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* EXPLORE PROPERTIES Pill Button (matching Nakula button aesthetic) */}
            <Link
              href="/villas"
              className="inline-flex items-center justify-center rounded-full border border-[#231F1A] bg-transparent px-5 py-1.5 font-serif text-[11px] uppercase tracking-[0.2em] text-[#231F1A] hover:bg-[#231F1A] hover:text-[#FAF7F1] transition-all duration-300 shadow-xs"
            >
              {t("exploreProperties")}
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex h-10 w-10 items-center justify-center text-[#222222] focus:outline-none rounded-md hover:bg-[#F5F2EB]"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mega Menu Dropdown for "OUR PROPERTIES" (Exact Nakula Khaki Theme) */}
      {propertiesMenuOpen && (
        <div
          className="w-full bg-[#8C7F5F] text-white shadow-2xl border-t border-[#7A6E50] animate-in fade-in slide-in-from-top-2 duration-200"
          onMouseLeave={() => setPropertiesMenuOpen(false)}
        >
          <div className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
              {/* Column 1: By Property Type */}
              <div className="md:col-span-4 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#EFECE6] border-b border-white/20 pb-2">
                  {t("byPropertyType")}
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      href="/villas?bedrooms=4"
                      className="group flex items-center justify-between text-white/90 hover:text-white transition-colors"
                      onClick={() => setPropertiesMenuOpen(false)}
                    >
                      <span className="font-light">{t("villasUpTo4")}</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/villas?bedrooms=5"
                      className="group flex items-center justify-between text-white/90 hover:text-white transition-colors"
                      onClick={() => setPropertiesMenuOpen(false)}
                    >
                      <span className="font-light">{t("villas5Plus")}</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/villas"
                      className="group flex items-center justify-between text-white/90 hover:text-white transition-colors"
                      onClick={() => setPropertiesMenuOpen(false)}
                    >
                      <span className="font-light">{t("resortApartment")}</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/events"
                      className="group flex items-center justify-between text-white/90 hover:text-white transition-colors"
                      onClick={() => setPropertiesMenuOpen(false)}
                    >
                      <span className="font-light">{t("eventsAndWeddings")}</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2 & 3: By Location (2 Grid Columns) */}
              <div className="md:col-span-8 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#EFECE6] border-b border-white/20 pb-2">
                  {t("byLocation")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 text-sm">
                  <Link
                    href="/locations/jagakarsa"
                    className="group flex items-center justify-between text-white/90 hover:text-white transition-colors"
                    onClick={() => setPropertiesMenuOpen(false)}
                  >
                    <span className="font-light">Jagakarsa (Jakarta Selatan)</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                  </Link>

                  <Link
                    href="/locations/tangerang"
                    className="group flex items-center justify-between text-white/90 hover:text-white transition-colors"
                    onClick={() => setPropertiesMenuOpen(false)}
                  >
                    <span className="font-light">Tangerang (Banten)</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                  </Link>

                  <Link
                    href="/locations/palmerah"
                    className="group flex items-center justify-between text-white/90 hover:text-white transition-colors"
                    onClick={() => setPropertiesMenuOpen(false)}
                  >
                    <span className="font-light">Palmerah (Jakarta Barat)</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                  </Link>

                  <Link
                    href="/locations/cikarang"
                    className="group flex items-center justify-between text-white/90 hover:text-white transition-colors"
                    onClick={() => setPropertiesMenuOpen(false)}
                  >
                    <span className="font-light">Cikarang (Bekasi)</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                  </Link>

                  <Link
                    href="/villas"
                    className="group flex items-center justify-between text-[#DFC58E] font-medium hover:text-white transition-colors sm:col-span-2 pt-2 border-t border-white/10"
                    onClick={() => setPropertiesMenuOpen(false)}
                  >
                    <span>{t("allLocations")} &rarr;</span>
                    <Sparkles className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bottom-0 bg-white z-50 overflow-y-auto px-6 py-8 flex flex-col justify-between border-t border-[#E8E4DC]">
          <div className="space-y-6">
            {/* Quick Currency & Language Selectors */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE1]">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-[#777777]">Currency:</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  aria-label="Select Currency"
                  className="rounded border border-[#E8E4DC] bg-[#FAF8F3] px-2.5 py-1 text-xs font-semibold text-[#8C7F5F]"
                >
                  {SUPPORTED_CURRENCIES.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.symbol} - {curr.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-[#777777]">Lang:</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                  aria-label="Select Language"
                  className="rounded border border-[#E8E4DC] bg-[#FAF8F3] px-2.5 py-1 text-xs font-semibold text-[#8C7F5F]"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.code} - {lang.nativeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col space-y-3">
              <Link
                href="/villas"
                className="font-serif text-xl text-[#222222] hover:text-[#8C7F5F] py-1 border-b border-[#F5F3EF]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("ourProperties")}
              </Link>
              <Link
                href="/events"
                className="font-serif text-xl text-[#222222] hover:text-[#8C7F5F] py-1 border-b border-[#F5F3EF]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("events")}
              </Link>
              <Link
                href="/owner-services"
                className="font-serif text-xl text-[#222222] hover:text-[#8C7F5F] py-1 border-b border-[#F5F3EF]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("ownerServices")}
              </Link>
              <Link
                href="/contact"
                className="font-serif text-xl text-[#8C7F5F] py-1 border-b border-[#F5F3EF]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("enquire")}
              </Link>
            </nav>

            {/* Mobile CTAs */}
            <div className="pt-4 space-y-2.5">
              <Link
                href="/villas"
                className="w-full flex items-center justify-center rounded-lg bg-[#8C7F5F] py-3 text-xs font-semibold uppercase tracking-wider text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("exploreProperties")}
              </Link>
              <Link
                href="/contact"
                className="w-full flex items-center justify-center rounded-lg border border-[#8C7F5F] py-3 text-xs font-semibold uppercase tracking-wider text-[#8C7F5F] hover:bg-[#FAF8F3] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("enquire")}
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E8E4DC] text-xs text-[#717171] space-y-1">
            <p className="font-medium text-[#222222]">KingHouse Hospitality Concierge</p>
            <p>Jakarta Selatan, Greater Jakarta, Indonesia</p>
          </div>
        </div>
      )}
    </header>
  )
}
