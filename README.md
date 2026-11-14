# Kinghouse Management - Short-Stay Property Management & Hospitality Platform

An editorial-grade property management, SEO CMS, and 100% Free-Tier Hospitality ERP/POS platform built with Next.js 16 (App Router, React 19), Tailwind CSS v4, TypeScript, Vitest, and Framer Motion for Greater Jakarta & Jabodetabek (Jagakarsa, Tangerang, Palmerah, Cikarang Selatan).

[![Next.js 16](https://img.shields.io/badge/Next.js-16.0.7-black.svg)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-v4-38B2AC.svg)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-Automated_Tests-6E9F18.svg)](https://vitest.dev/)
[![100% Free Tier](https://img.shields.io/badge/Stack-100%25_Free_Tier-emerald.svg)](https://vercel.com/)

---

## 🌟 Key Platform Features

### 🌴 For Discerning Guests & Travelers
- **Official Airbnb Superhost Status**: Verified host profile ([@kinghousemanagement](https://www.airbnb.com/users/profile/1470743715397835749?previous_page_name=PdpHomeMarketplace)), 4.5★ rating, 10+ authentic reviews, and 1 year hosting history.
- **4 Real Curated Properties with Actual Photography**: 
  - *Versatile House With Beautiful Garden Beyond* (Jagakarsa, Jakarta Selatan — 12 guests, 5BR, private pool & garden)
  - *Sky House • Hotel-Style Bed + IKEA 5min* (Pinang, Tangerang — 2 guests, 1BR, Scandinavian aesthetic & gym)
  - *Bright & Airy Apartment* (Palmerah, Jakarta Barat — 2 guests, 1BR, urban natural light suite)
  - *Skyline Luxury at Orange County* (Cikarang Selatan, Bekasi — 2 guests, 1BR, executive skyline view & pool/gym)
- **High-Resolution Architectural Bento Gallery**: Dynamic 5-photo bento grid with fullscreen lightbox modal powered by real property assets (zero placeholder images).
- **Wedding Portfolio & International Concierge Desk**: Dedicated high-resolution wedding setup photography (lawn moon-gate altar, twilight poolside dinner banquet, bridal suite, terrace blessing) and specialized international expat wedding guarantees (0% corkage, multi-currency invoicing, 35-min airport highway link).
- **Dynamic IDR/USD Pricing**: Real-time rate calculation, cleaning fees, and service breakdown.
- **Location Proximity Maps**: Distances and drive times to MRT stations, KRL, industrial estates, and airports.
- **WhatsApp Chooser (guest vs owner)**: Generic WhatsApp buttons (floating button, footer, contact, FAQ) open a brand-styled bottom sheet / dialog ("I'm a Guest" / "I'm a Property Owner") with focus trap, Esc, scroll lock and focus return, then route to the right line. CTAs whose purpose is already clear (owner form, villa booking, event enquiry, revenue calculator) carry `data-wa-direct` and open WhatsApp directly. The floating "online" hint hides itself after 8 s.
- **Simple Landing Journey**: One Superhost trust badge, a 2-button hero ("Find a Stay" / "I Own a Property"), one owner-vs-guest gate (`FunnelEntryGate`), no jargon (B2B/B2C removed) and larger type for 30+ readers (public-site minimum 14 px, small text 16 px, see `.site-public` in `app/globals.css`).
- **Brand Form Components (no browser defaults)**: `components/ui/select.tsx` (accessible combobox/listbox, typeahead, portalled so it is never clipped) and `components/ui/date-picker.tsx` (month grid, 44 px days, localized EN/ID, min/max, keyboard) replace every native `<select>` and `<input type="date">`, public site and dashboard.
- **Single-Source Footer**: every destination appears once (Services, Areas, Company, Contact, legal bar); labels are translated on `/id`.
- **Dedicated Public Pages & Editorial Hubs**:
  - **Press & Media Center (`/press`)**: Official announcements, media coverage quotes, and brand asset media kit downloads.
  - **Comprehensive Knowledge Base & FAQ (`/faq`)**: Interactive categorization covering guest stays, house rules, and owner asset management.
  - **Terms & Conditions (`/terms`)**: Professional hospitality terms, cancellation schedules, and legal governing law for Indonesia.
  - **Privacy Policy (`/privacy`)**: Indonesian UU PDP No. 27/2022 compliant data protection guidelines.
  - **Property Owner Management Inquiry (`/management-inquiry`)**: High-converting lead intake form with 24-hour yield estimate and instant WhatsApp fast-track.
  - **High-Performance Blog Hub (`/blog`)**: ISR cached (`revalidate = 120`) and 1500ms timeout race to guarantee instantaneous page loads.
  - **Scheduled Blog Publishing**: a *Published* article with a future publish time stays hidden (not in `/blog`, sitemap, related posts; its URL returns 404) and goes live on its own at that moment, no cron. Dashboard form has a date + time (WIB) picker and a *Terjadwal* tab. Details in [Blog scheduling](#-blog-scheduling--editorial-calendar).
  - **Owner Case Studies from Airbnb Data (`/owner-services`)**: average and best monthly payout are computed from `lib/earnings/airbnb-monthly.ts` (the Airbnb earnings export), with the export date shown as the source. No hand-typed revenue, occupancy or EBITDA claims.

### 🛎️ For In-House Guests (Digital Guest Compendium & Upselling Suite — `/stay`)
- **Vouch-Style Digital Guest Compendium (`/stay/[slug]`)**:
  - **High-Speed WiFi Widget**: 1-Click instant copy for SSID & Password with tested speed ratings. Passwords are kept in `lib/guest-guide/data.ts` (accepted exposure, see the security section).
  - **Digital House Manual**: Step-by-step smart lock / gate PIN instructions, check-in/out hours, and appliance manuals (AC inverter, Ariston water heater, smart TV Netflix).
  - **In-Stay Ancillary Upsell Service Menu**: Interactive add-on item selector with dynamic IDR subtotal calculation and 1-click WhatsApp concierge dispatch (Late check-out 2 PM / 4 PM, BBQ charcoal setup, extra hotel bed, mid-stay refresh).
  - **Curated Neighborhood Guide**: Top verified local cafes, Indonesian specialties, 24-hour convenience stores, and emergency pharmacies with direct Google Maps navigation.
  - **Printable Room Table QR Code**: Instant QR code generator modal (`/stay/[slug]`) for caretakers to print or frame in living areas.

### 💼 For Property Owners & Pitching (CMS Dashboard & ERP/POS Suite)
- **100% Free-Tier Hospitality ERP / POS Architecture**:
  - **Persistent Cloud Database (Supabase PostgreSQL)**: Fully integrated with dedicated `kinghouse` schema (`kinghouse.reservations`, `kinghouse.expenses`, `kinghouse.blog_posts`) ensuring persistent multi-device state with zero cold-start data loss.
  - **Zero External Paid API Dependency**: Full functionality running on Vercel Hobby + Supabase Free PostgreSQL (Cost: **Rp 0 / month**).
  - **Non-Tech Operator Friendly (UI/UX)**: Designed for non-technical villa operators and staff with Indonesian & English helper tooltips, step-by-step modal wizards, and color-coded status badges.
  - **1-Click Spreadsheet Export**: Instant download of clean CSV/Excel files for reservations and operational expenses.
  - **Print-Ready Owner Payout Statements (Laporan Bagi Hasil)**: Official printable A4 formatted revenue statements with commission breakdown (15% Standard vs 20% Premium) and expense deductions.
  - **POS Operational Expense Ledger**: Track PLN tokens, laundry linen, guest amenities, and technician maintenance with vendor tagging.
  - **Little Hotelier Front-Desk Visual Timeline Gantt (`/dashboard/bookings`)**: Interactive daily room turnover grid with property rows, color-coded OTA channel chips (Airbnb, Direct WhatsApp, Booking.com, Agoda), and 1-click guest/commission popups.
  - **2-Way OTA Synchronization Engine (Outbound & Inbound iCal - 100% Free Tier)**:
    - *Outbound*: Per-property dynamic RFC 5545 `.ics` feeds (`/api/ical/[villaSlug]`) queried directly from live Supabase reservations with fallback, exporting cleanly to Airbnb, Agoda, and Booking.com.
    - *Inbound Parser & Batch Sync*: Multi-unit background parser (`/api/erp/ical-sync?action=sync-all`) actively connected to 4 verified live Airbnb feeds (Versatile House Stay, Versatile House Events, Sky House Tangerang, and Skyline Luxury Cikarang).
    - *Vercel Cron Automation*: Scheduled cron (`vercel.json`) running daily at 02:00 UTC on the Vercel Hobby Free Tier (`0 2 * * *`; Hobby allows one run per day), authenticated with `CRON_SECRET`. Feed URLs are kept in `lib/data.ts` (accepted exposure).
    - *Supabase keep-alive*: a second daily cron (`0 5 * * *`) calls `/api/cron/supabase-keepalive`, which runs one row-less count query so the Supabase free-tier project is never paused for 7 days of inactivity. Same `CRON_SECRET` auth; returns no data.
    - *Collision-Resistant Architecture*: Suffix-based UID deduplication, Airbnb confirmation code extraction (`HMB8PSTSB9`), and guest contact phone suffix extraction.
- **Production-Grade CMS Authorization & Security (`/login`, `/dashboard`)**:
  - **In-Memory Sliding Window Rate Limiting**: Brute-force protection on `/api/auth/login` blocking credential stuffing.
  - **Runtime Zod Schema Validation**: Form inputs, numeric bounds, dates, and API payloads validated strictly via Zod.
  - **Route Protection Proxy (`proxy.ts`)**: Intercepts unauthenticated dashboard requests with secure HttpOnly SameSite=Lax HMAC-SHA256 session tokens (Next.js 16 renamed `middleware.ts` to `proxy.ts`).
  - **Defense-in-Depth HTTP Security Headers**: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` injected on all responses.
- **Pure Dynamic Actual Data Architecture & 100% Real Live Metrics**:
  - **Zero Dummy Data**: Initialized reservation and expense state strictly as empty arrays (`INITIAL_RESERVATIONS = []`, `INITIAL_EXPENSES = []`), removing all artificial mock names or placeholder PLN transactions.
  - **Live Dynamic Overview Dashboard (`/dashboard`)**: Computes real-time gross booking turnover, occupancy rate, total nights, and active reservations from active Airbnb iCal events and authentic guest review scores.
  - **Airbnb Payout CSV Importer (`/dashboard/analytics`)**: Integrated 1-click modal parser for official Airbnb Host Payout CSV files (*Earnings > Completed Payouts*), calculating net IDR revenues alongside manual reservation and expense ledgers.
  - **Persistent In-Memory Pipeline (`lib/erp/store.ts`)**: Auto-triggers inbound live Airbnb `.ics` calendar sync on first request/boot, immediately populating authentic reservations across all units.
- **Dynamic Pricing & Smart Rates Suite (`/dashboard/pricing`)**:
  - **60-Day Outlook Anchored to Airbnb Payouts (`lib/pricing/yield.ts`, `lib/earnings/airbnb-monthly.ts`)**: The summary starts from the exact Airbnb Earnings CSV figures (monthly *Paid* + *Upcoming*, Sky House converted from JPY at Rp 105/¥), not from "every night sells":
    - *Run-rate* = average monthly total of the current month and the two before, scaled to 60 days.
    - *Locked* = Airbnb *Upcoming* for later months inside the horizon.
    - *Smart-pricing lift* = (run-rate − locked) × average dynamic-price uplift on open nights × 50% (higher prices also turn some guests away).
    - *Projection* = locked + remaining + lift. Properties without an export show a notice instead of rupiah figures.
    - To refresh: export *Earnings → Performance → Monthly earnings* from each Airbnb host account and update `lib/earnings/airbnb-monthly.ts`.
  - **Plain-Language UI for Owners**: Cards badged *Data Airbnb* / *Kalender Airbnb* / *Estimasi sistem*, a "Bagaimana angka ini dihitung?" walkthrough with the property's own numbers, and a monthly Airbnb earnings chart. Demand index and competitor rate sit in a secondary, clearly labelled market-context row.
  - **Actual Data Fetching (Zero Dummy Data)**: Connects real live Airbnb iCal reservation dates, live Indonesian public holidays API (`date.nager.at`), and Jabodetabek submarket benchmarks (Jagakarsa, Alam Sutera/Pinang, Palmerah, Cikarang Orange County).
  - **Hospitality Revenue Management Formula**: $P_d = \operatorname{Clamp}(P_{\text{base}} \times M_{\text{dow}} \times M_{\text{season}} \times M_{\text{holiday}} \times M_{\text{leadTime}} \times M_{\text{pacing}}, P_{\text{min}}, P_{\text{max}})$.
  - **Submarket-Aware Day-of-Week Curves**: Inverted weekday/weekend logic distinguishing staycation group villas (weekend surge +35%) from expat industrial apartments (Mon-Thu peak, weekend discount).
  - **Lead-Time Urgency Curve**: Automated last-minute fire-sale discount (-15% on H-2) preventing zero-occupancy nights, and early bird protection premium (>45 days).
  - **Occupancy Velocity Pacing**: Dynamically surges remaining unbooked dates (+15% to +25%) when month occupancy exceeds target velocity threshold (>60%).
  - **Interactive 60-Day Pricing Heatmap Calendar**: Month switcher tabs, status chips in plain Indonesian (*Sudah dipesan*, *Akhir pekan*, *Libur nasional*, *Diskon mendadak*, *Harga manual*), and price deviation tags.
  - **Calculation Breakdown & Custom Rate Override Modal**: React Portal modal inspecting day-by-day multiplier factors with 1-click admin price override and reset capabilities.
  - **Guardrail Drawer**: Configurable Floor & Ceiling price limits, weekend surge %, and last-minute discount sliders.
  - **1-Click CSV Exporter (`lib/pricing/export.ts`)**: Instant `.csv` generation for OTA multi-calendar rate imports.
- **Universal Brand Standardization (`Kinghouse Management`)**: Standardized brand naming to `Kinghouse Management` across all site metadata, Schema.org JSON-LD (Organization, LocalBusiness, WebSite), OpenGraph tags, page titles, footer, headers, legal terms, and automated test suites.
- **Complete CMS Management Suite & Notification Hub**:
  - **Dynamic System Alerts & In-App Toasts**: Real-time bell notification dropdown with live unread badge, category tagging, and automatic floating toast feedback for every operator action.
  - **Editorial Blog CRUD Suite (`/dashboard/blog`)**: Non-tech friendly modal form with auto-slug generation, villa photo presets, live card preview tab, automatic SEO quality score calculator, and 1-click Published/Draft toggles.
  - **Portal Modal Architecture**: Full-viewport frosted glass backdrops (`createPortal`) eliminating CSS transform clipping, with fixed headers and sticky save footers.
  - **Overview (`/dashboard`)**: Multi-channel OTA status, occupancy KPIs, and quick shortcuts.
  - **Properties (`/dashboard/properties`)**: Portfolio inventory, 1-click iCal URL copy, and step-by-step Airbnb sync guide.
  - **Dynamic Pricing (`/dashboard/pricing`)**: Smart rate calendar heatmap, 60-day outlook anchored to Airbnb payouts, monthly Airbnb earnings chart, and custom date override controls.
  - **SEO Manager (`/dashboard/seo`)**: Interactive per-property Meta Title & Description editor, real-time Google SERP preview, and SEO health checklist.
  - **Bookings Hub (`/dashboard/bookings`)**: Multi-channel reservation table, visual Gantt timeline switcher, Inbound iCal sync modal, manual WhatsApp booking modal, and 1-click CSV export.
  - **Revenue & POS Analytics (`/dashboard/analytics`)**: Financial yield intelligence (ADR, RevPAR, Occupancy rate), POS expense ledger with deletion flow, and printable Owner Statement generator.
  - **Advanced Local SEO & Google Search Rank 1 Architecture**:
  - **Local Geo-Targeting Meta Tags**: Head meta tags (`geo.region: ID-JK`, `geo.placename: Jakarta Selatan, Tangerang, Palmerah, Cikarang`, `ICBM`, `geo.position`) targeting Greater Jakarta.
  - **Multi-Location LocalBusiness / Lodging Schema**: Enriched Schema.org JSON-LD registering physical lodging departments across Jagakarsa (Jaksel), Pinang (Tangerang), Palmerah (Jakbar), and Newport Tower (Cikarang), complete with GeoCoordinates, 24/7 hours, rating (4.90★ from 96 reviews), payment options, currencies, and verified Google Business Profile link.
  - **Dynamic Area Hub Pages (`/locations/[area]`)**: Dedicated landing pages featuring `TouristDestination`, `BreadcrumbList`, and localized `FAQPage` schemas designed to capture Google SERP FAQ rich accordions.
  - **Google VacationRental Schema Suite**: Rich structured data across all properties including check-in/out schedules, amenity specifications, pricing units, and review counts.
  - **Authoritative Canonical URL Consolidation**: Automatic 308 permanent redirect from `/villas/[slug]` to `/locations/[area]/villas/[slug]` consolidating PageRank and topical authority to the localized URL structure.
  - **Dedicated Onboarding Metadata Layout (`/management-inquiry`)**: Server-rendered SEO metadata, OpenGraph cards, and `ContactPage` + `Service` schemas for high-converting owner leads.
- **Enterprise Analytics Architecture (GA4, GTM & Google Consent Mode v2)**:
  - **Google Consent Mode v2**: Default privacy-compliant initialization granting `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization` without tag blocking.
  - **SPA Single-Source-of-Truth Pageviews**: Configured `send_page_view: false` on base GA4 setup, delegating pageviews exclusively to `PageViewTracker` to eliminate duplicate pageview reporting in Next.js App Router.
  - **Full-Funnel E-commerce & Conversion Dispatcher (`lib/analytics.ts`)**: Standard GA4 recommended events including `generate_lead` (property audits and inquiries), `begin_checkout` (direct booking and OTA referral clicks), `view_item` (property detail inspection), `view_item_list` (catalog and location views), and `search`.
- **Google Search Console & Dynamic XML Sitemap Fortification (`/sitemap.xml`)**:
  - Dynamic XML sitemap indexing static pages, 4 dynamic location hubs, 4 canonical property pages with image metadata (`images`), 3 dynamic event packages (`/events/[slug]`), and 11 dynamic blog articles.
  - Omission of redirected, private, or disallowed routes (`/dashboard`, `/login`, `/stay/*`, `/api/*`, `/villas/[slug]`) to maintain 100% GSC sitemap hygiene with zero redirect or indexing conflict errors.

---

## 🚀 Tech Stack

| Category | Technology | Purpose & Free Tier Capability |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack) | High-speed SSR, ISR, and API endpoints |
| **Database** | Supabase (PostgreSQL) | Isolated `kinghouse` dedicated schema for persistent ERP & CMS |
| **Runtime & UI** | React 19 + TypeScript 5 | Type safety across schemas, state, and props |
| **Typography** | Cormorant Garamond & Inter | Brand Guidelines Vol II: Cormorant Garamond (editorial/display) & Inter (interface/body) |
| **Styling** | Tailwind CSS v4 + PostCSS | Kinghouse Official Palette: Charcoal Ink (`#231F1A`), Bone (`#FAF7F1`), Warm Bone (`#F5EFEB`), Sandstone (`#CBBEA0`), Warm Stone (`#5C5347`), Brass Monochrome (`#6B4B2A` / `#EFE2CE`) + Nakula Khaki (`#8C7F5F`) |
| **Brand Identity** | Official Monoline Quiet Custodian Key | `public/brand/` SVGs & PNGs for primary, secondary horizontal, and icon marks with 1X secure area |
| **Icons & Motion** | Lucide React + Framer Motion | Accessible vector icons and smooth physics |
| **Validation** | Zod (`zod`) | Strict runtime schema validation for forms and APIs |
| **Security** | Web Crypto HMAC-SHA256 + Rate Limiter | Zero-cost edge authentication and brute-force defense |
| **Testing** | Vitest (`vitest`) | Lightning fast automated unit testing suite (171 tests passing across 22 suites) |
| **Dynamic Pricing** | AirDNA-Grade Multi-Factor Revenue Engine | 100% actual data fetch, submarket benchmarks, and CSV exporter |
| **Channel Sync** | Native RFC 5545 iCal Generator | Free 2-way calendar sync for Airbnb / Agoda / Booking.com |
| **Localization** | Multi-Currency & i18n Context | English default + 9 languages & 10 currencies. Two root layouts: `app/(site)` renders `<html lang="en">`, `app/id` renders `<html lang="id">` |
| **Revenue Simulator** | AirDNA-Grade Rentalizer (`/owner-services`) | Live submarket benchmarks, dynamic yield comparison, 1-click A4 audit sheet |
| **SEO & Rich Snippets** | Schema.org JSON-LD Suite | LocalBusiness (AggregateRating 4.90★), FAQPage, Service/OfferCatalog, ItemList, VacationRental, Event |
| **Analytics & Tagging** | GA4 + GTM + Consent Mode v2 | Single-source virtual pageviews, standard e-commerce and lead conversion tracking |
| **Guest Upsell** | Vouch-Style Digital Compendium | Interactive add-on cart & dynamic WhatsApp dispatch |
| **Hosting** | Vercel Free Hobby Tier | 100% Free Tier Compatible ($0/month) |

---

## 🧪 Automated Testing & Production Quality Assurance

```bash
# Run automated Vitest test suite (171 tests across 22 suites)
npm test

# Run TypeScript strict compilation
npx tsc --noEmit

# Run ESLint validation (0 errors)
npm run lint

# Run Next.js production build (all routes verified)
npm run build
```

The project includes an automated test suite powered by **Vitest** covering ERP calculations, 2-way iCal sync, commission fee splits, Zod validators, rate limiters, GA4/GTM tracking, dynamic pricing, and revenue simulation.

### UI/UX & Media Performance Architecture:
- **Desktop Navbar & Luxury Spacing**: Generous `max-w-[1400px]` container with `px-6 lg:px-12 xl:px-16` padding, secondary horizontal brandmark on far left (≥120px digital minimum size), clean menu hierarchy starting with `Home`, and sleek pill-outline CTA button.
- **English Default & Multilingual Capabilities**: Universal English (`en`) default locale with fluid switching to Indonesian (`id`), Japanese (`ja`), Chinese (`zh`), French (`fr`), Spanish (`es`), German (`de`), and Russian (`ru`), backed by canonical hreflang tags.
- **Responsive Viewport-Aware Video Streaming**: Automatically serves portrait vertical video on mobile and landscape video on desktop, using `preload="metadata"` to prevent downloading multiple streams or stalling bandwidth.
- **Guest Compendium Asset Resilience (`/stay`)**: Verified local photography assets mapped cleanly to each managed unit, eliminating broken or missing images across all Jabodetabek properties.
- **Mobile Collision-Free Layout**: Dynamic responsive spacing preventing floating search components from obscuring bottom hero specifications.
- **Events Showcase Gallery**: Visual gallery with interactive category filters, real event and wedding setup photos, and instant WhatsApp booking inquiry.

### Test Coverage Highlights:
- `tests/property-revenue-calculator.test.ts`: Validates AirDNA-grade submarket benchmarks, occupancy velocity formulas, 15% vs 20% commission net payouts, and annual surplus math.
- `tests/airbnb-yield.test.ts`: Locks the Airbnb CSV figures and checks the run-rate, locked bookings, JPY conversion, yield lift and projection math.
- `tests/dynamic-pricing.test.ts`: Validates dynamic pricing formula, DOW multipliers for staycation vs business submarkets, official Indonesian public holiday detection, urgency curve discounts, floor/ceiling clamps, admin overrides, and CSV exports.
- `tests/erp-calculations.test.ts`: Validates 15% vs 20% commission splits, cleaning fee exemptions, net owner payouts, ADR, and RevPAR math.
- `tests/ical-sync-engine.test.ts`: Validates 2-way iCal synchronization and RFC 5545 parsing.
- `tests/guest-compendium.test.ts`: Verifies house rules, amenities, digital compendium structure, and that WiFi passwords come only from the environment.
- `tests/validation-security.test.ts`: Verifies Zod schema boundaries, timing-safe authentication, fail-closed behaviour when secrets are missing or weak, and rate-limiting sliding windows.
- `tests/analytics-seo.test.ts`: Verifies GTM/GA4 event dispatching, VacationRental Schema.org, robots.txt directives, and dynamic sitemap generation.
- `tests/ical-feed.test.ts`: Verifies CSV export engine headers and row escaping.
- `tests/localization-currency.test.ts`: Verifies multi-currency conversion rates and multi-language dictionary fallbacks.
- `tests/blog-schedule.test.ts`: Verifies WIB publish-time rules, that scheduled posts stay hidden until their time (and appear after), the 16 Nov – 16 Dec calendar, and that every internal link and image in scheduled articles exists.
- `tests/case-study.test.ts`: Verifies owner case-study figures are computed from the Airbnb export (paid months only, JPY converted).
- `tests/no-hardcoded-secrets.test.ts`: **Fails the build** if a credential pattern (iCal tokens, JWT/Supabase keys, private keys, password literals, `process.env.X || "literal"`) or a real `.env` file is committed.
- `tests/setup-env.ts`: Generates throwaway random auth secrets per test run (auth has no built-in defaults).

---

## 🔐 Administrative Authentication & Security Architecture

The CMS Dashboard is only accessible with verified administrative session tokens:
- **No admin secrets in the repository**: there are no default admin passwords or signing keys in code. Those come from environment variables (Vercel → Settings → Environment Variables, marked *Sensitive*; `.env.local` for development). `tests/no-hardcoded-secrets.test.ts` blocks regressions, except for the two accepted-exposure data files listed in it.
- **Fails closed**: `ADMIN_PASSWORD` (≥ 12 chars) and `AUTH_SECRET` (≥ 32 chars) are required. If either is missing or too short, `/api/auth/login` returns `503`, no session token can be signed, and existing tokens are rejected. A misconfigured deploy locks the dashboard instead of running on a published default.
- **Server Runtime Isolation**: admin credentials and the session key are resolved server-side only and never inlined into browser bundles.
- **Timing-Safe Authentication**: constant-time comparison that also hides the expected value's length.
- **Search Engine Isolation**: `/dashboard` and `/login` are disallowed in `robots.txt`, omitted from `sitemap.xml`, and return `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`.
- **Rate Limiting**: sliding-window limiter blocks brute-force attempts on `/api/auth/login`.
- **Draft & scheduled content is private**: public pages, the sitemap and anonymous `/api/blog` calls only see posts that are Published *and* past their publish time; a Supabase RLS policy enforces the same rule for the anon key (`supabase/migrations/20261108_blog_scheduled_publishing.sql`).

### Environment Variables
`.env.example` is the complete, documented template (all values empty). Summary:

| Variable | Required | Notes |
| :--- | :---: | :--- |
| `ADMIN_PASSWORD` | ✅ | ≥ 12 chars, unique to this site |
| `AUTH_SECRET` | ✅ | ≥ 32 chars: `openssl rand -base64 48`. Changing it signs everyone out |
| `ADMIN_EMAIL` / `ADMIN_NAME` | – | Default `info@kinghousemanagement.com` / `Kinghouse Admin` |
| `CRON_SECRET` | ✅ prod | ≥ 16 chars. Vercel sends it as `Authorization: Bearer …` to the daily iCal sync; without it the cron is rejected (fails closed) and only a signed-in admin can sync |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ prod | Server-only, bypasses RLS. Never `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` / `_SCHEMA` | ✅ prod | Public client config |
| `NEXT_PUBLIC_SITE_URL`, `_GA_MEASUREMENT_ID`, `_GTM_ID`, `_GOOGLE_SITE_VERIFICATION` | – | Public site / analytics config |
| `NEXT_PUBLIC_WA_OWNER`, `NEXT_PUBLIC_WA_GUEST` | – | Public WhatsApp business lines |
| `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_SECRET` | – | Optional lead forwarding (Google Sheet / CRM) |

### Accepted exposure (owner decision)
The Airbnb iCal feed URLs (`lib/data.ts`) and the guest WiFi passwords (`lib/guest-guide/data.ts`) are kept in the repository on purpose. They are visible in the source and in git history. Rotate the WiFi passwords on the routers and regenerate Airbnb calendar links if that becomes necessary; the admin password and session key are the only secrets that moved to environment variables.

---

## 📝 Blog Scheduling & Editorial Calendar

- **Rule** (`lib/blog/schedule.ts`): a post is *live* when `status = Published` **and** its publish time has passed. A Published post with a future time is *scheduled*. Date-only values go live at 07:00 WIB; the dashboard stores a full timestamp (Jakarta time).
- **Where it applies**: `/blog`, `/blog/[slug]` (404 before the time), related posts, `sitemap.xml`, `/api/blog` for anonymous callers. Admins see everything. No cron is needed: article pages render per request, `/blog` revalidates every 2 minutes and the sitemap hourly.
- **Dashboard** (`/dashboard/blog`): *Jadwal Tayang (WIB)* date + time picker, *Terjadwal* tab and badge.
- **Editorial calendar** (`lib/blog/scheduled.ts`): articles written ahead of time and shipped with the code; a database row with the same slug (edited in the dashboard) overrides them. Current campaign, 16 Nov – 16 Dec 2026, one article every 10 days at 07:00 WIB:

| Date | Article |
| :--- | :--- |
| 16 Nov | Checklist Persiapan Airbnb untuk Libur Natal & Tahun Baru |
| 26 Nov | Venue Year-End Party Kantor di Jakarta Selatan |
| 6 Dec | Sewa Villa untuk Malam Tahun Baru di Jakarta Selatan |
| 16 Dec | Biaya Jasa Kelola Airbnb di Jakarta |

After each article goes live, request indexing in Google Search Console.

---

## 📞 Official Corporate Contact & Social Media

- **Corporate Entity**: PT Kreasi Usman Gosse
- **Headquarters (Virtual Office)**: 18 Office Park Building 21th Floor Unit C. Jl. TB Simatupang Kav. 18, Jakarta Selatan, 12520
- **WhatsApp Concierge & Desk**: `082123933218` / `+62 821-2393-3218` (`https://wa.me/6282123933218`)
- **Corporate Email**: `info@kinghousemanagement.com`
- **Official Airbnb Superhost**: [Airbnb Host #1470743715397835749](https://www.airbnb.com/users/profile/1470743715397835749?previous_page_name=PdpHomeMarketplace)
- **Official TikTok**: [`@kinghousemanagement`](https://www.tiktok.com/@kinghousemanagement)
- **Official Instagram**: [`@kinghouse.id`](https://instagram.com/kinghouse.id)
- **Verified Locations**: Jabodetabek (Jagakarsa - Jakarta Selatan, Pinang - Tangerang, Palmerah - Jakarta Barat, Cikarang Selatan - Bekasi)

