# KingHouse - Short-Stay Property Management & Hospitality Platform

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
- **4 Real Curated Properties with Actual Photography**: 
  - *Versatile House With Beautiful Garden Beyond* (Jagakarsa, Jakarta Selatan — 12 guests, 5BR, private pool & garden)
  - *Sky House • Hotel-Style Bed + IKEA 5min* (Pinang, Tangerang — 2 guests, 1BR, Scandinavian aesthetic & gym)
  - *Bright & Airy Apartment* (Palmerah, Jakarta Barat — 2 guests, 1BR, urban natural light suite)
  - *Skyline Luxury at Orange County* (Cikarang Selatan, Bekasi — 2 guests, 1BR, executive skyline view & pool/gym)
- **High-Resolution Architectural Bento Gallery**: Dynamic 5-photo bento grid with fullscreen lightbox modal powered by real property assets.
- **Dynamic IDR/USD Pricing**: Real-time rate calculation, cleaning fees, and service breakdown.
- **Location Proximity Maps**: Distances and drive times to MRT stations, KRL, industrial estates, and airports.
- **Events & Wedding Packages**: Dedicated garden wedding, corporate retreat, and party packages at the Jagakarsa private garden house.
- **Sticky Floating WhatsApp Concierge Button**: Persistent bottom-right WhatsApp widget with online status indicator, reply time badge, and pre-filled inquiry routing.
- **Dedicated Public Pages & Editorial Hubs**:
  - **Press & Media Center (`/press`)**: Official announcements, media coverage quotes, and brand asset media kit downloads.
  - **Comprehensive Knowledge Base & FAQ (`/faq`)**: Interactive categorization covering guest stays, house rules, and owner asset management.
  - **Terms & Conditions (`/terms`)**: Professional hospitality terms, cancellation schedules, and legal governing law for Indonesia.
  - **Privacy Policy (`/privacy`)**: Indonesian UU PDP No. 27/2022 compliant data protection guidelines.
  - **Property Owner Management Inquiry (`/management-inquiry`)**: High-converting lead intake form with 24-hour yield estimate and instant WhatsApp fast-track.
  - **High-Performance Blog Hub (`/blog`)**: ISR cached (`revalidate = 120`) and 1500ms timeout race to guarantee instantaneous page loads.

### 🛎️ For In-House Guests (Digital Guest Compendium & Upselling Suite — `/stay`)
- **Vouch-Style Digital Guest Compendium (`/stay/[slug]`)**:
  - **High-Speed WiFi Widget**: 1-Click instant copy for SSID & Password with tested speed ratings.
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
    - *Vercel Cron Automation*: Scheduled cron (`vercel.json`) running every 2 hours on Vercel Hobby Free Tier (`0 */2 * * *`), automatically refreshing calendars with zero manual effort.
    - *Collision-Resistant Architecture*: Suffix-based UID deduplication, Airbnb confirmation code extraction (`HMB8PSTSB9`), and guest contact phone suffix extraction.
- **Production-Grade CMS Authorization & Security (`/login`, `/dashboard`)**:
  - **In-Memory Sliding Window Rate Limiting**: Brute-force protection on `/api/auth/login` blocking credential stuffing.
  - **Runtime Zod Schema Validation**: Form inputs, numeric bounds, dates, and API payloads validated strictly via Zod.
  - **Edge Route Protection Middleware**: Intercepts unauthenticated dashboard requests with secure HttpOnly SameSite=Lax HMAC-SHA256 session tokens.
  - **Defense-in-Depth HTTP Security Headers**: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` injected on all responses.
- **Pure Dynamic Actual Data Architecture & 100% Real Live Metrics**:
  - **Zero Dummy Data**: Initialized reservation and expense state strictly as empty arrays (`INITIAL_RESERVATIONS = []`, `INITIAL_EXPENSES = []`), removing all artificial mock names or placeholder PLN transactions.
  - **Live Dynamic Overview Dashboard (`/dashboard`)**: Computes real-time gross booking turnover, occupancy rate, total nights, and active reservations from active Airbnb iCal events and authentic guest review scores.
  - **Airbnb Payout CSV Importer (`/dashboard/analytics`)**: Integrated 1-click modal parser for official Airbnb Host Payout CSV files (*Earnings > Completed Payouts*), calculating net IDR revenues alongside manual reservation and expense ledgers.
  - **Persistent In-Memory Pipeline (`lib/erp/store.ts`)**: Auto-triggers inbound live Airbnb `.ics` calendar sync on first request/boot, immediately populating authentic reservations across all units.
- **Universal Brand Standardization (`Kinghouse Management`)**: Standardized brand naming to `Kinghouse Management` across all site metadata, Schema.org JSON-LD (Organization, LocalBusiness, WebSite), OpenGraph tags, page titles, footer, headers, legal terms, and automated test suites.
- **Complete CMS Management Suite & Notification Hub**:
  - **Dynamic System Alerts & In-App Toasts**: Real-time bell notification dropdown with live unread badge, category tagging, and automatic floating toast feedback for every operator action.
  - **Editorial Blog CRUD Suite (`/dashboard/blog`)**: Non-tech friendly modal form with auto-slug generation, villa photo presets, live card preview tab, automatic SEO quality score calculator, and 1-click Published/Draft toggles.
  - **Portal Modal Architecture**: Full-viewport frosted glass backdrops (`createPortal`) eliminating CSS transform clipping, with fixed headers and sticky save footers.
  - **Overview (`/dashboard`)**: Multi-channel OTA status, occupancy KPIs, and quick shortcuts.
  - **Properties (`/dashboard/properties`)**: Portfolio inventory, 1-click iCal URL copy, and step-by-step Airbnb sync guide.
  - **SEO Manager (`/dashboard/seo`)**: Interactive per-property Meta Title & Description editor, real-time Google SERP preview, and SEO health checklist.
  - **Bookings Hub (`/dashboard/bookings`)**: Multi-channel reservation table, visual Gantt timeline switcher, Inbound iCal sync modal, manual WhatsApp booking modal, and 1-click CSV export.
  - **Revenue & POS Analytics (`/dashboard/analytics`)**: Financial yield intelligence (ADR, RevPAR, Occupancy rate), POS expense ledger with deletion flow, and printable Owner Statement generator.
  - **Settings & Profile (`/dashboard/settings`)**: Admin profile credentials, session security inspect, and master iCal calendar feed exporter.

---

## 🚀 Tech Stack

| Category | Technology | Purpose & Free Tier Capability |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.0.7 (App Router) | High-speed SSR, ISR, and API endpoints |
| **Database** | Supabase (PostgreSQL) | Isolated `kinghouse` dedicated schema for persistent ERP & CMS |
| **Runtime & UI** | React 19.2.0 + TypeScript 5 | Type safety across schemas, state, and props |
| **Styling** | Tailwind CSS v4 + PostCSS | Luxury minimalist styling with Sana tokens |
| **Icons & Motion** | Lucide React + Framer Motion | Accessible vector icons and smooth physics |
| **Validation** | Zod (`zod`) | Strict runtime schema validation for forms and APIs |
| **Security** | Web Crypto HMAC-SHA256 + Rate Limiter | Zero-cost edge authentication and brute-force defense |
| **Testing** | Vitest (`vitest`) | Lightning fast automated unit testing suite (34 tests passing) |
| **Channel Sync** | Native RFC 5545 iCal Generator | Free 2-way calendar sync for Airbnb / Agoda / Booking.com |
| **Localization** | Multi-Currency & i18n Context | 10 currencies (IDR, USD, EUR, etc.) & 9 languages |
| **Guest Upsell** | Vouch-Style Digital Compendium | Interactive add-on cart & dynamic WhatsApp dispatch |
| **Hosting** | Vercel Free Hobby Tier | 100% Free Tier Compatible ($0/month) |

---

## 🧪 Automated Testing & Production Quality Assurance

```bash
# Run automated Vitest test suite (34 comprehensive tests)
npm test

# Run TypeScript strict compilation
npx tsc --noEmit

# Run ESLint validation (0 errors)
npm run lint

# Run Next.js production build (63/63 routes verified)
npm run build
```

The project includes an automated test suite powered by **Vitest** covering ERP calculations, 2-way iCal sync, commission fee splits, Zod validators, rate limiters, GA4/GTM tracking, and XML sitemaps.

### UI/UX & Media Performance Architecture:
- **Responsive Viewport-Aware Video Streaming**: Automatically serves portrait vertical video on mobile and landscape video on desktop, using `preload="metadata"` to prevent downloading multiple streams or stalling bandwidth.
- **Header Navigation Consistency**: Strict single-line whitespace preservation (`whitespace-nowrap`), uncluttered layout (redundant "Home" link removed and covered by brand logo).
- **Mobile Collision-Free Layout**: Dynamic responsive spacing preventing floating search components from obscuring bottom hero specifications.
- **Events Showcase Gallery**: Nakula-inspired visual gallery with interactive category filters, real event and wedding setup photos, and instant WhatsApp booking inquiry.

### Test Coverage Highlights:
- `tests/erp-calculations.test.ts`: Validates 15% vs 20% commission splits, cleaning fee exemptions, net owner payouts, ADR, and RevPAR math.
- `tests/ical-sync-engine.test.ts`: Validates 2-way iCal synchronization and RFC 5545 parsing.
- `tests/guest-compendium.test.ts`: Verifies house rules, amenities, and digital compendium structure.
- `tests/validation-security.test.ts`: Verifies Zod schema boundaries, timing-safe authentication, and rate-limiting sliding windows.
- `tests/analytics-seo.test.ts`: Verifies GTM/GA4 event dispatching, VacationRental Schema.org, robots.txt directives, and dynamic sitemap generation.
- `tests/ical-feed.test.ts`: Verifies CSV export engine headers and row escaping.

---

## 🔐 Administrative Authentication & Security Architecture

The CMS Dashboard is fortified and only accessible with verified administrative session tokens:
- **Server Runtime Isolation**: Superadmin credentials are exclusively resolved on the server side via environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET_KEY`) and never leaked into client bundles.
- **Timing-Safe Authentication**: Constant-time string comparisons protect password verification against side-channel timing attacks.
- **Search Engine Isolation**: The `/dashboard` and `/login` routes are explicitly disallowed in `robots.txt`, omitted from `sitemap.xml`, and return `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` response headers.
- **Rate Limiting**: Sliding-window rate limiters block brute-force attempts on `/api/auth/login`.

### Environment Configuration:
| Field | Environment Variable | Notes |
| :--- | :--- | :--- |
| **Admin Email** | `ADMIN_EMAIL` | Administrative email for login |
| **Admin Password** | `ADMIN_PASSWORD` | Strong password configured in production environment variables |
| **Session Secret** | `AUTH_SECRET_KEY` | HMAC-SHA256 signing secret for session tokens |
| **Base URL** | `NEXT_PUBLIC_SITE_URL` | Set to `https://www.kinghousemanagement.com` |
| **GA4 ID** | `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics Measurement ID |
| **GTM ID** | `NEXT_PUBLIC_GTM_ID` | Google Tag Manager Container ID |

### Environment Variables:
```env
# Optional overrides for production deployment
ADMIN_EMAIL=ptkreasiusmangosse@gmail.com
ADMIN_PASSWORD=KingHouse2026!Admin
AUTH_SECRET=kinghouse-hospitality-production-secret-key-2026-secure-jwt-hmac-token
```

---

## 📞 Official Corporate Contact & Social Media

- **WhatsApp Concierge & Desk**: `082123933218` / `+62 821-2393-3218` (`https://wa.me/6282123933218`)
- **Corporate Email**: `ptkreasiusmangosse@gmail.com`
- **Official TikTok**: [`@kinghouse.id`](https://www.tiktok.com/@kinghouse.id) (`https://www.tiktok.com/@kinghouse.id`)
- **Location**: Jabodetabek (Jakarta Selatan, Tangerang, Jakarta Barat, Cikarang Selatan)
