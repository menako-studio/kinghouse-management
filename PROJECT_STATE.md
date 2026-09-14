# PROJECT_STATE.md — Kinghouse Hospitality Web Platform

> **Single Source of Truth (SSOT)** for AI Coding Agents (Claude 4.6 Sonnet, Gemini 3.7 Flash, Antigravity, etc.).  
> Read this document to understand architectural standards, technical stack, current implementation status, data schemas, and development workflows without rescanning the entire repository.

---

## 1. EXECUTIVE SUMMARY & SCOPE

### 1.1 Core Purpose & Scope
**Kinghouse** is an editorial-grade property management, SEO CMS, 100% Free-Tier Hospitality ERP/POS, and dual-path short-stay booking platform focused on **Jabodetabek** (Jagakarsa - Jakarta Selatan, Pinang - Tangerang, Palmerah - Jakarta Barat, and Cikarang Selatan - Bekasi).

The platform serves two primary user personas:
1. **Discerning Guests**: Seeking curated, hotel-standard short-stay accommodations and event venues with rich architectural bento photo galleries, IDR pricing, amenity breakdowns, proximity maps, and seamless Airbnb booking.
2. **Property Owners & Operators**: Managing portfolio yield, occupancy, automated owner revenue statements (15% Standard vs 20% Premium), POS expense tracking, 1-click spreadsheet exports, and OTA 2-way calendar synchronization without any paid third-party API dependencies.

### 1.2 Active Managed Properties (Airbnb Host #1470743715397835749)
| # | Property Name | Area / Region | Capacity | Airbnb Room ID | Rating / Reviews |
|---|---|---|---|---|---|
| 1 | Versatile House With Beautiful Garden Beyond | Jagakarsa, Jakarta Selatan | 12 Guests, 5BR, 9 Beds | `45834267` | 4.90 ★ (68 reviews) |
| 2 | Sky House • Hotel-Style Bed + IKEA 5min | Pinang, Tangerang | 2 Guests, 1BR, 1 Bed | `1325106294978348497` | 4.91 ★ (22 reviews) |
| 3 | Bright & Airy Apartment | Palmerah, Jakarta Barat | 2 Guests, 1BR, 1 Bed | `1444158185166882045` | New Listing |
| 4 | Skyline Luxury at Orange County | Cikarang Selatan, Bekasi | 2 Guests, 1BR, 1 Bed | `1691723711820833674` | 4.83 ★ (6 reviews) |

### 1.3 Tech Stack Table

| Category | Technology | Version / Configuration | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `16.3.4` (`next dev --turbopack`) | Core fullstack framework & static/dynamic generation |
| **Runtime / Core** | React / React DOM | `19.2.0` | Modern React UI with Server/Client Components |
| **Language** | TypeScript | `^5.0` (Strict mode) | Type safety across schemas, state, and props |
| **Typography** | Cormorant Garamond & Inter | Google Fonts (`next/font/google`) | Official Brand Guidelines Vol II: Cormorant Garamond (editorial/display) & Inter (interface/body) |
| **Localization** | Multi-Language & Multi-Currency Context | Custom `LocalizationProvider` | Real-time conversions (10 currencies) & i18n (9 languages: JA, ZH, FR, ES, DE, RU, ID, EN) |
| **Styling** | Tailwind CSS v4 + PostCSS | `@tailwindcss/postcss ^4`, `tailwindcss ^4` | Kinghouse Official Palette: Charcoal Ink (`#231F1A`), Bone (`#FAF7F1`), Warm Bone (`#F5EFEB`), Sandstone (`#CBBEA0`), Warm Stone (`#5C5347`), Brass Monochrome (`#6B4B2A` / `#EFE2CE`) + Nakula Olive-Khaki (`#8C7F5F`) |
| **Brand Assets** | Official Monoline Quiet Custodian Key | `public/brand/` (SVG & PNG) | Primary vertical, secondary horizontal, and tertiary icon brandmarks with 1X secure area (bow width) |
| **UI Primitives** | Radix UI Slot, CVA | `class-variance-authority ^0.7.1`, `clsx`, `tailwind-merge` | Headless, accessible components |
| **Animations** | Framer Motion | `^12.23.25` | Fluid micro-interactions and transitions |
| **Icons** | Lucide React | `^0.556.0` | Vector iconography |
| **Validation** | Zod | `^4.4.3` | Runtime schema validation for forms & API payloads |
| **Testing** | Vitest | `^4.1.11` | Automated unit testing for ERP, security, and feeds |
| **Security** | Web Crypto HMAC-SHA256 + Rate Limiter | In-Memory Sliding Window | Edge session protection and brute-force mitigation |
| **Hosting** | Vercel (Hobby Tier) | 100% Free Tier Compatible | Zero external paid API dependencies |

---

## 2. PROJECT STRUCTURE & ROUTES

### 2.1 Complete Directory Tree

```
kinghouse-mockup/
├── app/
│   ├── api/
│   │   ├── auth/                     # Login (with rate-limiting & Zod), logout, me routes
│   │   ├── erp/                      # Dynamic ERP endpoints (reservations, expenses, dynamic-pricing)
│   │   │   ├── dynamic-pricing/      # AirDNA-grade smart rates & override REST endpoint
│   │   │   ├── expenses/             # Operational POS expense ledger CRUD
│   │   │   ├── ical-sync/            # Multi-unit live Airbnb iCal background sync
│   │   │   └── reservations/         # Multi-channel reservations CRUD & store pipeline
│   │   └── ical/[villaSlug]/         # Dynamic RFC 5545 iCal calendar feeds
│   ├── blog/                         # Blog index & article reader with BlogPosting schema
│   ├── dashboard/                    # Hospitality ERP/POS & CMS Suite
│   │   ├── analytics/page.tsx        # Revenue intelligence, POS expense ledger, & print statements
│   │   ├── blog/page.tsx             # Blog article manager
│   │   ├── bookings/page.tsx         # Multi-channel reservations hub with 1-click CSV export
│   │   ├── pricing/page.tsx          # AirDNA dynamic pricing & smart rates calendar heatmap
│   │   ├── properties/page.tsx       # Portfolio asset inventory & iCal sync setup wizard
│   │   ├── seo/page.tsx              # Interactive SEO Editor & Live Google SERP preview
│   │   ├── settings/page.tsx         # Admin credentials, security audit, & master feeds
│   │   ├── layout.tsx                # Dashboard layout with dark collapsible sidebar
│   │   └── page.tsx                  # Portfolio KPIs & multi-channel OTA status
│   ├── events/                       # Events & garden wedding venue pages
│   ├── faq/page.tsx                  # Interactive FAQ knowledge base
│   ├── locations/[area]/             # Dynamic area landing pages (TouristDestination schema)
│   ├── login/page.tsx                # Sana Labs styled administrative login portal
│   ├── management-inquiry/page.tsx   # Dedicated property owner onboarding inquiry & fast-track audit
│   ├── owner-services/page.tsx       # Tiered fees (15% vs 20%), ROI case studies, audit form
│   ├── press/page.tsx                # Press releases, media coverage, and media kit downloads
│   ├── privacy/page.tsx              # Indonesian UU PDP compliant privacy policy
│   ├── terms/page.tsx                # Official terms & conditions and booking policies
│   ├── villas/                       # Property catalog & single villa editorial detail
│   ├── about/page.tsx                # Company profile & hospitality standards
│   ├── contact/page.tsx              # Contact info & direct WhatsApp concierge
│   ├── globals.css                   # Tailwind v4 theme, variables & scrollbars
│   ├── layout.tsx                    # Root shell with Organization + LocalBusiness JSON-LD
│   └── page.tsx                      # Dual-path high-conversion homepage
├── components/
│   ├── bento/                        # Bento image gallery & lightbox modal
│   ├── blog/                         # BlogCard component (featured & standard variants)
│   ├── dashboard/                    # Dashboard sidebar, stat-card, channel-badge, seo-editor
│   ├── home/                         # Hero slider, search bar, trust proof
│   ├── layout/                       # Sticky header navigation & editorial footer
│   ├── owner/                        # Pricing tables, ROI metrics, lead audit form
│   ├── ui/                           # Badge, button, card, floating-whatsapp, input primitives
│   └── villas/                       # Amenities grid, booking sidebar, map, villa card
├── lib/
│   ├── erp/                          # Calculations, types, export engine, seed data
│   │   ├── calculations.ts           # 15% vs 20% fee splits, ADR, RevPAR, owner statements
│   │   ├── export.ts                 # 1-click CSV and printable HTML statements
│   │   ├── initial-data.ts           # Zero-dummy reservations and POS expenses store
│   │   ├── store.ts                  # In-memory runtime persistence & iCal trigger
│   │   └── types.ts                  # ERP domain models (Reservation, ExpenseRecord, OwnerStatement)
│   ├── pricing/                      # AirDNA-grade dynamic revenue intelligence engine
│   │   ├── engine.ts                 # Multi-factor pricing algorithm & submarket benchmarks
│   │   ├── export.ts                 # 1-click CSV rate calendar exporter
│   │   ├── holidays.ts               # Indonesian Public Holidays API & long weekend service
│   │   ├── store.ts                  # In-memory custom price overrides & rules store
│   │   └── types.ts                  # Dynamic pricing domain models & multiplier breakdown
│   ├── security/
│   │   └── rate-limiter.ts           # Zero-cost in-memory sliding window rate limiter
│   ├── validations/
│   │   └── index.ts                  # Zod validation schemas for forms, APIs, and auth
│   ├── auth.ts                       # HMAC-SHA256 session tokenization
│   ├── constants.ts                  # SITE_CONFIG, MANAGED_AREAS, MANAGEMENT_SERVICES
│   ├── data.ts                       # Real Airbnb properties, 11 blog posts, 3 event packages
│   ├── types.ts                      # Core domain models (Villa, BlogPost, VillaEvent, SeoMeta)
│   └── utils.ts                      # VacationRental schema generator, currency formatters
├── tests/
│   ├── analytics-seo.test.ts         # Automated unit tests for GTM/GA4 & Schema.org
│   ├── dynamic-pricing.test.ts       # Automated unit tests for AirDNA dynamic pricing engine
│   ├── erp-calculations.test.ts      # Automated unit tests for financial math & statement generator
│   ├── guest-compendium.test.ts      # Automated unit tests for guest stay & house rules
│   ├── ical-feed.test.ts             # Automated unit tests for CSV and calendar feeds
│   ├── ical-sync-engine.test.ts      # Automated unit tests for 2-way Airbnb calendar sync
│   ├── localization-currency.test.ts # Automated unit tests for 10 currencies & 9 languages
│   └── validation-security.test.ts   # Automated unit tests for Zod schemas & rate limiter
└── middleware.ts                     # Edge security headers & route protection
```

---

## 3. CURRENT STATUS & COMPLETED WORK

### Phase 1.0 - 1.9 (Completed)
- [x] **Core Editorial Hospitality Foundation**: Next.js 16 App Router, React 19, Tailwind v4, Google Fonts (*Playfair Display* & *Plus Jakarta Sans*).
- [x] **Real Property Assets**: 4 real Jabodetabek Airbnb properties with high-res photography galleries and dynamic pricing.
- [x] **SEO Schema Suite**: Organization, LocalBusiness, VacationRental, FAQPage, BreadcrumbList, TouristDestination, BlogPosting, Event JSON-LD schemas.
- [x] **Sana Labs Design System**: Minimalist luxury tokens, ambient glow meshes, frosted glassmorphism, and responsive bento layouts.
- [x] **Official Contact & Social Integration**: Desk & WhatsApp (`082123933218`), Email (`info@kinghousemanagement.com`), and TikTok ([`@kinghouse.id`](https://www.tiktok.com/@kinghouse.id)).

### Phase 2.0 — Production-Ready UMKM Hospitality ERP/POS & Fortified CMS (Completed)
- [x] **Hospitality ERP & Financial Calculation Engine** (`lib/erp/`):
  - Automated management commission fee splits: **15% Standard Full-Service** vs **20% Multi-Channel Premium**.
  - Net Owner Payout calculation with cleaning fee exemptions and operating expense deductions.
  - Granular yield metrics: ADR (Average Daily Rate), RevPAR, and occupancy percentage.
- [x] **POS Operational Expense Ledger** (`app/dashboard/analytics/` & `/api/erp/expenses`):
  - Per-property tracking for PLN tokens, laundry linen, guest amenities, maintenance, and staff costs.
  - Modal quick-entry for on-the-ground operational staff.
- [x] **Non-Tech Operator Friendly UI/UX & 1-Click Exports** (`lib/erp/export.ts`):
  - **1-Click CSV/Excel Download**: Instant spreadsheet generation for reservations and POS expenses.
  - **Printable Owner Payout Statements**: Official A4-formatted report generator with signature boxes and itemized revenue/expense breakdown.
  - Step-by-step modal guides for non-technical villa operators (e.g., Airbnb calendar import wizard).
  - **Enhanced Legibility**: CMS `/dashboard` and `/login` enforced 100% **Plus Jakarta Sans** (sans-serif) for high data legibility, numbers, and operational table scans.
- [x] **Live Two-Way OTA Synchronization** (`app/api/ical/[villaSlug]/route.ts`):
  - Dynamic RFC 5545 `.ics` calendar feed generation per villa for seamless import into Airbnb, Agoda, and Booking.com.
- [x] **Security Fortification & Runtime Validation** (`lib/security/`, `lib/validations/`, `middleware.ts`):
  - Zero-dependency in-memory sliding window rate limiting on `/api/auth/login` to thwart brute-force attacks.
  - Strict **Zod** schema validation across login, manual reservations, expenses, and SEO metadata.
  - HTTP defense-in-depth headers: `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`.
- [x] **Automated Testing Suite (`tests/`, Vitest)**:
  - 12 comprehensive unit tests running and passing across ERP math, Zod schemas, rate limiters, and CSV exports.

### Phase 2.1 — Dynamic Notification Hub, Non-Tech Blog CRUD & Portal Modals (Completed)
- [x] **Dynamic System Alerts & In-App Floating Toasts** (`components/dashboard/notification-context.tsx`, `components/dashboard/dashboard-header.tsx`):
  - Bell notification dropdown with live unread counter badge, pulsing indicator, category-colored tags (Blog, Booking, POS, SEO, Sync, System), mark all as read, and clear alerts.
  - Real-time floating toast notifications triggered automatically on all CRUD actions across dashboard pages.
  - Persistent state in browser storage (`localStorage`).
- [x] **Non-Tech Friendly Editorial Blog CRUD Suite** (`app/dashboard/blog/page.tsx`):
  - Full Create, Read, Update, and Delete flow with auto-slugification, verified property photo picker presets, custom image URL inputs, and real-time SEO score calculation (0–100).
  - Tabbed interface switching between Form Editor and Live Card Preview.
  - 1-click status toggle button (Published vs Draft) directly from the article table.
  - Safe 2-step deletion modal dialog.
- [x] **Seamless React Portal Modal Architecture**:
  - Implemented `createPortal(..., document.body)` across all CMS modals (`/dashboard/blog`, `/dashboard/bookings`, `/dashboard/analytics`) to eliminate containing block transform clipping.
  - Full-viewport dark backdrop blur (`bg-black/60 backdrop-blur-md`) and unclipped elevated shadows (`shadow-[0_25px_70px_rgba(0,0,0,0.35)]`).
  - Fixed header + scrollable body + sticky footer pattern guaranteeing action buttons (Save / Cancel) are always visible.
### Phase 2.3 — Digital Guest Experience & In-Stay Upselling Platform (Vouch-Style) (Completed)
- [x] **Vouch-Style Digital Guest Compendium Suite** (`app/stay/[slug]/page.tsx`, `app/stay/page.tsx`):
  - Dedicated mobile-first digital house manual for all 4 managed Jabodetabek properties.
  - **High-Speed WiFi Card** (`components/stay/wifi-widget.tsx`): 1-click clipboard copy for SSID and Password with toast confirmation.
  - **Smart Lock & Access Guide**: PIN keypad instructions, parking guide, and check-in/out schedules.
  - **Appliance & House Rules Accordion** (`components/stay/guide-section.tsx`): Guides for Daikin AC, Ariston water heater, Samsung Netflix 4K, swimming pool safety, and quiet hours.
  - **Curated Neighborhood Guide**: Verified local food, 24-hour convenience stores, and emergency hospitals with direct Google Maps navigation.
  - **Printable Room Table QR Code Modal** (`components/stay/qr-modal.tsx`): High-res QR code generator for room table displays.
### Phase 2.4 — Little Hotelier Front-Desk Timeline Gantt & 2-Way Inbound iCal Sync (Completed)
- [x] **Front-Desk Visual Timeline Gantt Chart** (`components/dashboard/bookings-gantt-chart.tsx`, `app/dashboard/bookings/page.tsx`):
  - Interactive calendar timeline with property rows for 4 Jabodetabek properties.
  - Multi-channel color-coded reservation bars (Airbnb, Direct WhatsApp, Booking.com, Agoda, Walk-in).
  - Quick popup modal for guest details, nights, gross rent, and 15%/20% owner fee splits.
  - View Switcher toggle: `[📋 List Tabel]` vs `[📅 Visual Timeline Gantt]`.
- [x] **2-Way Inbound iCal Sync Engine** (`lib/ical/parser.ts`, `lib/ical/sync.ts`, `app/api/erp/ical-sync/route.ts`):
  - Zero-dependency RFC 5545 iCalendar `.ics` parser for multi-event OTA calendar feeds.
  - Automatic deduplication and auto-blocking of dates in Supabase `kinghouse.reservations`.
  - Inbound iCal sync modal on `/dashboard/bookings` with real-time feedback toast.
- [x] **Automated Testing Suite (`tests/`, Vitest)**:
  - 19 comprehensive unit tests passing across ERP calculations, 2-way iCal sync parser, guest compendiums, rate limiters, and Zod schemas.

### Phase 2.5 — Nakula Left-Sidebar Filtering & CMS Color Palette Standardization (Completed)
- [x] **Left-Sidebar Catalog & Events Filtering (`app/villas/page.tsx`, `app/events/page.tsx`)**:
  - Restructured layout to match reference designs (`properties.png` and `events.png`) with a sticky left sidebar filter (`w-full lg:w-72`) alongside a 2-column card grid.
  - Interactive multi-select checkboxes for property types & events, datepicker availability, destination dropdowns, room/capacity selectors, and Search with `[APPLY]` and `[CLEAR]` action buttons.
  - **Nakula Editorial 2-Col Grid**: Cards styled with bottom-left `Start From IDR X / Night` (or `/ Event`) price badges, bottom-right `↗` action buttons, meta lines, rating/reviews, `DOWNLOAD BROCHURE` buttons, capacity specs, and pill tags.
  - Retained rich editorial sections on `/villas` (About, Summary Table, Photo Strip, FAQ Accordion) and `/events` (Official Price Matrix and Stay Configurations).
- [x] **Complete CMS Suite & Login Color Palette Harmonization (`app/globals.css`)**:
  - Replaced legacy neon pinks (`#FF3B70`) and non-standard dark purple surfaces with official Kinghouse Gold (`#B8934C`, `#DFC58E`), Nakula Khaki (`#8C7F5F`), and Luxury Charcoal (`#19191B`, `#222225`, `#28282B`).
  - Standardized all CMS pages (`/dashboard`, `/dashboard/bookings`, `/dashboard/analytics`, `/dashboard/blog`, `/dashboard/properties`, `/dashboard/seo`, `/dashboard/settings`) and `/login` to use consistent design tokens, glassmorphism, and border colors (`#E8E4DC`, `#FAF8F5`).

### Phase 2.6 — Property House Rules & Digital Compendium Synchronization (Completed)
- [x] **Sky House Tangerang (`sky-house-tangerang`) Verified Guidelines**:
  - **WiFi**: SSID `KINGSKYHOUSE22` | Password `120210120069#`.
  - **House Rules**: No smoking, No pets, Flush toilet, Switch off electricity points/AC when not in use, Keep room clean & hygienic, No noise pollution, Return items after use, Material damage charged, No eating/drinking on bed (stains subject to cleaning fee), Review request on checkout.
  - **Check-Out Guidelines**: Check-out 12:00 PM, turn off utilities, leave access card & key on table, lock doors & windows.
- [x] **Skyline Luxury at Orange County Cikarang (`skyline-luxury-orange-county-cikarang`) Verified Guidelines**:
  - **Access & Delivery**: Newport Building mailbox N0510, 5th floor unit, package delivery pickup at security lobby.
  - **WiFi**: SSID `N0510` | Password `Kinghouse`.
  - **Facilities & Waste**: Level 2 pool/gym/playground, trash disposal in KWH room near lift.
  - **House Rules & Safety**: No smoking 🚭, No pets, No parties/commercial use, Do not rearrange furniture, Respect neighbors.
  - **Electrical Safety Suggestion**: Prevent electrical overload by not using high-power appliances (stove, hair dryer, kettle) simultaneously; use one at a time.
- [x] **Versatile House Jagakarsa (`versatile-house-jagakarsa`) Verified Guidelines**:
  - **Rules**: No pets (service animals per Airbnb policy), No events for overnight stay, No indoor smoking (outdoor smoking in gazebo/garden), Quiet hours 10:00 PM – 6:00 AM, No commercial photography/filming without permit, Max 12 overnight guests (2 per bedroom).
  - **Schedule & Fees**: Check-in 3:00 PM (flexible), Check-out before 12:00 PM. Early check-in / late check-out Rp 950,000. Extra guest Rp 300,000/pax (>4 pax). Cleaning fee Rp 350,000.
### Phase 2.7 — Multi-Currency & Multi-Language Localization Engine (Completed)
- [x] **Universal Multi-Currency Conversion Engine** (`lib/context/localization-context.tsx`):
  - Real-time exchange rate calculation across 10 global currencies: IDR (Rp), USD ($), SGD (S$), AUD (A$), EUR (€), GBP (£), JPY (¥), CNY (¥), MYR (RM), AED (AED).
  - Floating and header dropdown selectors with persistent user preferences in `localStorage`.
- [x] **Multi-Language Internationalization (i18n)** (`lib/context/localization-context.tsx`):
  - Support for 9 languages: Indonesian (`ID`), English (`EN`), Japanese (`JA`), Mandarin Chinese (`ZH`), French (`FR`), Spanish (`ES`), German (`DE`), Russian (`RU`), and Arabic (`AR`).
- [x] **Multi-Channel Direct Booking & Price Comparison Modal** (`components/villas/booking-channel-modal.tsx`, `components/villas/booking-sidebar.tsx`):
  - Transparent price comparison between Direct Booking (0% extra commission, best rate guarantee) vs Airbnb, Agoda, and Booking.com.
  - 1-click WhatsApp concierge pre-filled message dispatch with check-in, check-out, and guest count.

### Phase 2.9 — Dynamic API Data Layer & Supabase Full CRUD Synchronization (Completed)
- [x] **Central Dynamic Blog Service** (`lib/blog/service.ts`):
  - Server & client shared repository querying Supabase PostgreSQL table `kinghouse.blog_posts` with graceful runtime fallback.
  - CRUD operations: `getBlogPosts`, `getBlogPostBySlug`, `saveBlogPost`, `deleteBlogPost`.
- [x] **Full-Suite Dynamic Blog API** (`app/api/blog/route.ts`):
  - Added complete HTTP handlers: `GET` (with query filtering for slug, category, status, search), `POST` (create), `PUT` (edit/toggle status), and `DELETE` (delete).
- [x] **Dynamic CMS & Public Frontend Linkage**:
  - `app/dashboard/blog/page.tsx`: Connected to `/api/blog` for all create, edit, delete, and publish/draft toggling operations with instant state sync.
  - `app/blog/page.tsx` & `app/blog/[slug]/page.tsx`: Set to `force-dynamic` dynamic rendering; newly added/edited articles in CMS **immediately display on public frontend pages** and render dynamic Schema.org JSON-LD.
- [x] **ERP Reservasi & POS API Synchronizer**:
  - Added `DELETE` route handlers to `app/api/erp/reservations/route.ts` and `app/api/erp/expenses/route.ts`.
  - Connected `/dashboard/bookings` and `/dashboard/analytics` to asynchronously create, fetch, and delete items from backend routes.
### Phase 3.0 — Rich In-Content Media Editor, Live SEO Scorecard & Soft-Delete Architecture (Completed)
- [x] **Rich Markdown Formatting Toolbar** (`app/dashboard/blog/page.tsx`):
  - Heading 2 (`## `), Heading 3 (`### `), Bold (`**`), Italic (`*`), Bullet List (`- `), Blockquote (`> `).
  - 1-Click Villa Internal Linking dropdown (Jagakarsa, BSD, Palmerah, Cikarang) to maximize SEO Topical Authority.
- [x] **In-Content Visual Asset & Alt-Tag Inserter Modal**:
  - Image preset picker from verified high-resolution property photography + custom URL input.
  - Mandatory keyword-rich Alt-Text generator for Google Image SEO.
  - Seamless Next.js `<Image>` & styled `<figure>` rendering with captions in `app/blog/[slug]/page.tsx`.
- [x] **Live Rank Math / Yoast SEO Scorecard (0–100)**:
  - Real-time 6-point checklist: Keyword in H1, Keyword in first 100 words, H2/H3 structure, In-content image with alt tag, internal links count, and word depth (>300 words).
  - Live Google SERP mobile/desktop snippet preview.
- [x] **Enterprise Soft-Delete Architecture & Trash Management**:
  - Soft-delete by default (`status: 'Archived'`) preventing Google 404 broken links.
  - Dedicated **Sampah (Archived)** tab with 1-Click Restore to Draft and Permanent Purge safeguards.
- [x] **Full 100% Free-Tier PostgREST Supabase Sync**:
  - Direct PostgreSQL table synchronization on `public.blog_posts`, `public.reservations`, and `public.expenses`.

### Phase 3.1 — GA4, GTM, GSC Verification, Dynamic XML Sitemaps & Full-Funnel Event Tracking (Completed)
- [x] **Enterprise Google Tag Manager & Google Analytics 4 Architecture** (`lib/analytics.ts`, `components/analytics/`):
  - Injected GTM (`GTM-PH9N4N7H`) and GA4 (`G-TWXVH3RCP4`) via non-blocking Next.js `<Script>` with `<noscript>` iframe fallback.
  - Virtual Page View route transition observer (`components/analytics/page-view-tracker.tsx`) wrapped in `<Suspense>`.
  - Dual-dispatch layer pushing to `window.dataLayer` and calling `window.gtag` across all interactive client events.
- [x] **Google Search Console & Technical SEO Infrastructure** (`app/sitemap.ts`, `app/robots.ts`, `app/layout.tsx`):
  - Dynamic XML Sitemap generator (`app/sitemap.ts`) indexing static pages, dynamic areas, properties, blog posts, and guest stay manuals.
  - Robots.txt (`app/robots.ts`) with custom Googlebot directives, sitemap pointer, and security route exclusions (`/dashboard/*`, `/api/*`, `/login`).
  - WebSite JSON-LD with Sitelinks `SearchAction`, Organization, LocalBusiness, Breadcrumbs, and Brand Aliases targeting `kinghousemanagement.com` / `Kinghouse Management`.
  - GSC verification meta tag integration via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
- [x] **Full-Funnel Commercial Event Tracking Across All Pages**:
  - WhatsApp concierge inquiries (Header, Footer, Villa detail, Event packages, Contact desk, Guest stay).
  - Booking inquiries & channel split comparisons (Direct WhatsApp vs Airbnb vs Agoda).
  - Owner Free Property Revenue Audit lead generation submissions.
  - Brochure downloads (Villas & Event packages).
  - Catalog search query and multi-select filter interactions (Destination, Bedrooms, Property Type).
  - Digital Guest Stay Compendium WiFi password copies & Google Maps directions clicks.
  - Localization preference changes (10 currencies & 9 languages).
### Phase 3.2 — CMS Security Fortification, Credential Isolation, Detailed SEO Extension Compliance & Organic Traffic Expansion (Completed)
- [x] **CMS Security & Superadmin Isolation** (`lib/auth.ts`, `app/login/`, `middleware.ts`):
  - Completely removed evaluation credentials box and auto-fill button from the public login page (`/login`).
  - Isolated admin credentials on server runtime using environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET_KEY`) with constant-time string comparison to prevent timing attacks.
  - Added server-side metadata to `/login/layout.tsx` enforcing `robots: { index: false, follow: false, noarchive: true, nocache: true }`.
  - Added edge `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` response header in `middleware.ts` for all `/dashboard` and `/login` routes.
  - Strengthened `robots.txt` disallow rules and verified that `sitemap.xml` strictly never exposes `/dashboard`, `/login`, or `/api/*`.
- [x] **Detailed SEO Extension & Canonical Domain Alignment**:
  - Standardized canonical base URL across all pages and schemas to `https://www.kinghousemanagement.com`.
  - Tuned all page meta descriptions to the optimal 135–155 character sweet spot to eliminate truncation and pass Chrome Detailed SEO Extension in green.
  - Added server-rendered metadata layouts for client-heavy routes: `/villas/layout.tsx`, `/events/layout.tsx`, `/contact/layout.tsx`, `/villas/[slug]/page.tsx`.
  - Unified Schema.org JSON-LD structured data (`WebSite`, `Organization`, `LocalBusiness`, `BlogPosting`, `VacationRental`).
- [x] **High-Impact Organic SEO Blog Articles for Rank 1 Google** (`lib/data.ts`, `app/blog/`):
  - Published 5 in-depth, authoritative, keyword-targeted articles (11 total in catalog) addressing high-intent commercial & informational search queries:
    1. *Panduan Lengkap Investasi Properti Airbnb Jabodetabek 2026: Strategi ROI & Okupansi Maksimal* (`panduan-investasi-airbnb-jabodetabek-2026`)
    2. *5 Rekomendasi Villa Intimate Wedding & Family Gathering Terbaik di Jakarta 2026* (`rekomendasi-villa-intimate-wedding-family-gathering-jakarta`)
    3. *Strategi Maksimalkan Okupansi Sewa Apartemen Harian di Cikarang & Orange County* (`strategi-maksimalkan-okupansi-apartemen-cikarang`)
    4. *Kelola Sendiri vs Jasa Manajemen Properti Airbnb: Perbandingan Biaya, Waktu, & ROI 2026* (`kelola-sendiri-vs-jasa-manajemen-properti-airbnb`)
    5. *Tips Memilih Villa Private Pool Mewah & Asri di Jakarta Selatan untuk Weekend Escape* (`tips-staycation-villa-private-pool-jakarta-selatan`)
  - Rich internal linking to `/owner-services`, `/events`, `/villas`, and specific property pages.
### Phase 3.3 — Nakula-Style Cinematic Responsive Video Hero & Versatile House Asset Upgrade (Completed)
- [x] **Nakula-Inspired Editorial Video Hero (`components/home/hero-slider.tsx`)**:
  - Responsive HTML5 background video architecture:
    - **Desktop & Tablet Horizontal (Landscape)**: `/properties/versatile-house/talent-act-comp.mp4` / `/properties/versatile-house/empty.mp4` (1920x1080).
    - **Mobile Portrait (Vertical)**: `/properties/versatile-house/talent-act-vertical.mp4` / `/properties/versatile-house/empty-vertical.mp4` (607x1080).
    - Fallback poster: `/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg` to eliminate black flashes on slow connections.
  - Interactive Luxury Controls Dock:
    - Scene mode switcher: `[✦ Lifestyle Experience]` (talent-act) vs `[🏛 Architectural View]` (empty).
    - Glassmorphism Play / Pause controller button with synced video states.
    - Floating property specs bar: "Versatile House With Garden • Jagakarsa, South Jakarta • 12 Guests • 5BR Private Pool" with direct explore link.
    - Soft animated scroll-down chevron indicator.
- [x] **Complete Versatile House High-Resolution Asset Upgrade**:
  - Replaced legacy photos across `lib/data.ts`, `lib/guest-guide/data.ts`, `app/events/page.tsx`, `app/villas/page.tsx`, and `components/home/dual-path-split.tsx` with all 11 new photos from `/public/properties/versatile-house/new`:
    1. `VersatileHouse_01_Pool_Hero.jpg` (Pool Hero)
    2. `VersatileHouse_02_Living_Hall.jpg` (Grand Double-Height Living Hall)
    3. `VersatileHouse_03_Master_Bedroom.jpg` (Master Bedroom Suite)
    4. `VersatileHouse_04_Patio_Terrace.jpg` (Outdoor Patio Terrace)
    5. `VersatileHouse_05_Master_Bathroom.jpg` (En-suite Bathroom with Freestanding Soaking Tub)
    6. `VersatileHouse_06_Dining_Chandelier.jpg` (10-Seater Dining Hall & Crystal Chandelier)
    7. `VersatileHouse_07_Kitchen.jpg` (Gourmet Chef Kitchen & Prep Island)
    8. `VersatileHouse_08_Media_Lounge.jpg` (Smart 4K Entertainment Lounge)
    9. `VersatileHouse_09_Zen_Courtyard.jpg` (Zen Courtyard Garden Corridor)
    10. `VersatileHouse_10_Twin_Bedroom.jpg` (Guest Twin Bedroom)
    11. `gate.jpg` (Private Entrance Gate & Parking Court)
  - Updated Versatile House Event Packages (Garden Wedding, Corporate Retreat, Milestone Birthday) with high-res assets.
### Phase 3.4 — Layout Best Practices, Navigation Optimization, Missing Pages & Floating WhatsApp (Completed)
- [x] **Header / Navbar UX Best Practice Optimization (`components/layout/header.tsx`)**:
  - Removed placeholder `REWARDS` dropdown and replaced with direct high-priority link to `OWNER SERVICES` (`/owner-services`).
  - Removed exposed internal CMS `SIGN IN` pill button from public header and replaced with a conversion-focused `EXPLORE VILLAS` / `BOOK A STAY` CTA linking to `/villas`.
  - Replaced mobile drawer login button with an `ENQUIRE` concierge CTA.
- [x] **Footer Streamlining & Floating WhatsApp Concierge**:
  - Streamlined contact block in `components/layout/footer.tsx`: Eliminated 3x redundant email/WhatsApp repetitions into a single, high-converting Direct Concierge & Reservations block.
  - Removed cookie button and inline chat icon from footer bottom bar.
  - Created persistent, accessible **Sticky Floating WhatsApp Concierge Button** (`components/ui/floating-whatsapp.tsx`) mounted in `components/layout/site-shell.tsx` with live online status and tooltip.
  - Activated all 8 footer navigation links (`/about`, `/blog`, `/press`, `/contact`, `/faq`, `/terms`, `/privacy`, `/management-inquiry`).
- [x] **Dedicated Editorial & Static Pages Created**:
  - `/press`: Official press releases, media quotes, and brand asset media kit downloads.
  - `/faq`: Interactive accordion FAQ for guests, property owners, and operations.
  - `/terms`: Professional hospitality terms, cancellation rules, and legal jurisdiction.
  - `/privacy`: Indonesian UU PDP No. 27/2022 compliant privacy guidelines.
  - `/management-inquiry`: Dedicated property owner onboarding and instant WhatsApp yield audit.
- [x] **High-Performance Blog Hub (`app/blog/page.tsx`, `lib/blog/service.ts`)**:
  - Implemented ISR caching (`revalidate = 120`) and a 1500ms Supabase query race timeout with seamless runtime fallback to eliminate cold-start loading delays.
  - Updated `app/sitemap.ts` to include all new routes for full SEO indexing.

### Phase 3.5 — Header Alignment, Mobile Hero Fix, Events Gallery Showcase & Video Bandwidth Optimization (Completed)
- [x] **Header Navigation Alignment & Spacing (`components/layout/header.tsx`)**:
  - Removed redundant "HOME" text link from desktop navbar and mobile navigation drawer (navigation back to home is naturally covered by the KINGHOUSE brand logo).
  - Applied `whitespace-nowrap` across all primary navigation items (`OUR PROPERTIES`, `MONTHLY OFFERS`, `EVENTS`, `OWNER SERVICES`, `ENQUIRE`) to eliminate awkward multi-line wrapping on mid-sized viewports (1024px–1280px).
  - Enforced consistent `space-x-6 xl:space-x-8` horizontal spacing and uniform vertical alignment, matching Nakula's clean luxury aesthetic.
- [x] **Mobile Hero Viewport & Collision Fix (`components/home/hero-slider.tsx`, `components/home/search-filter-bar.tsx`)**:
  - Changed `SearchFilterBar` top margin on mobile to `mt-4 sm:-mt-10 lg:-mt-12` so the floating search bar sits cleanly beneath the hero section on mobile screens (<640px) without overlapping or obscuring the bottom property specs and villa title.
  - Adjusted mobile hero button padding from `py-6` to `py-3.5 sm:py-6` and tuned container typography (`text-3xl sm:text-6xl`) to guarantee full visibility of featured property details ("Versatile House With Garden • Jagakarsa, Jakarta Selatan").
- [x] **Video Bandwidth & Page Speed Optimization (`components/home/hero-slider.tsx`)**:
  - Replaced dual simultaneous `<video>` elements with dynamic viewport-aware single-stream rendering, downloading only landscape (desktop/tablet) OR portrait (mobile) video.
  - Switched video preloading strategy from `preload="auto"` to `preload="metadata"`, saving over ~50MB of eager data transfer on initial page load and eliminating bandwidth congestion.
  - Maintained instant First Contentful Paint (<200ms) with `POSTER_IMAGE` loaded via Next.js `Image` with `priority`.
- [x] **Events Real Celebrations & Venue Inspiration Gallery (`app/events/page.tsx`)**:
  - Added a curated visual showcase section highlighting real event setups (Lush Lawn Altar & Ceremonial Pool, Grand Chandelier Banquet, Covered Patio Cocktail Lounge, Zen Courtyard Photo Zone, Plenary Living Hall, Bridal Master Suite).
  - Integrated interactive category filter pills (`All Setups`, `Weddings & Ceremonies`, `Cocktails & Receptions`, `Intimate Banquets`, `Bridal Suites`).
  - Implemented an interactive full-screen Lightbox Modal with high-resolution photography inspection, area specs, and direct WhatsApp booking inquiry.
- [x] **Footer Newsletter Streamlining (`components/layout/footer.tsx`)**:
  - Temporarily hid the unconfigured newsletter form and removed external Unsplash background image fetch to reduce initial page weight and avoid user confusion before a dedicated free-tier ESP (e.g., Resend or Brevo) is integrated.

### Phase 3.6 — Luxury Wedding & Event Setup Visual Assets Generation (Nakula-Grade)
- [x] **Generated Bespoke Event Visuals Based on Versatile House Real Architecture (`public/properties/versatile-house/events/`)**:
  - Generated high-converting, photo-realistic visual assets using the actual architectural footprint, pool geometry, and tropical greenery of Versatile House Jagakarsa:
    1. `wedding-ceremony-lawn-pool.jpg`: Exquisite circular floral moon gate arch adorned with white roses and tropical greenery beside the azure pool, with rows of white cross-back wedding chairs on emerald manicured lawns.
    2. `evening-garden-party-banquet.jpg`: Romantic twilight celebration featuring warm canopy festoon string bistro lights, long wooden banquet dining tables, floating pool candles, and lush floral runners.
    3. `cocktail-reception-terrace-lounge.jpg`: Chic pop-up champagne & mixology bar on the covered patio terrace overlooking the pool, high cocktail tables, and resort evening atmosphere.
- [x] **Events Page & Catalog Integration (`app/events/page.tsx` & `lib/data.ts`)**:
  - Elevated the Hero Banner of `/events` with the signature `wedding-ceremony-lawn-pool.jpg` ceremony shot to immediately capture wedding planners and bridal couples, matching the high-end appeal of Nakula's "A Guide to Your Dream Wedding".
  - Upgraded `EVENT_SHOWCASE_PHOTOS` with the new wedding, evening banquet, and cocktail lounge visuals with interactive lightbox previews.
  - Updated `VILLA_EVENTS` catalog items (`event-1` Garden Wedding & `event-3` Birthday / Milestone Party) with dedicated event hero covers and enriched multi-photo galleries.
### Phase 3.7 — Live Airbnb Host iCal Feeds Integration & 100% Free-Tier Vercel Cron Auto-Sync (Completed)
- [x] **Verified Airbnb Host Inbound Feeds Configured (`lib/data.ts`, `lib/types.ts`)**:
  - Attached real verified `.ics` calendar feeds for active Airbnb properties:
    1. *Versatile House Jagakarsa (Stay)* (`versatile-house-jagakarsa`): `45834267.ics`
    2. *Versatile House Jagakarsa (Events)* (`versatile-house-jagakarsa`): `1172798010727828525.ics`
    3. *Sky House Tangerang* (`sky-house-tangerang`): `1325106294978348497.ics`
    4. *Skyline Luxury Orange County Cikarang* (`skyline-luxury-orange-county-cikarang`): `1691723711820833674.ics`
- [x] **Collision-Resistant UID Parsing & Metadata Extraction (`lib/ical/sync.ts`)**:
  - Implemented suffix-based unique reservation ID generation (`SYNC-[uidSuffix]-[idx]`) preventing Supabase row overwrites on identical Airbnb blocked date UID prefixes.
  - Added regex parsing for Airbnb confirmation codes (`details/HMYYBDR3RF`) and guest contact digits (`Phone Number: 4831`).
  - Added differentiation between guest bookings (`SUMMARY:Reserved`) and blocked owner dates (`SUMMARY:Airbnb (Not available)`).
- [x] **Multi-Unit Batch Sync Engine & Vercel Cron Automation (`app/api/erp/ical-sync/route.ts`, `vercel.json`)**:
  - Added `syncAllConfiguredProperties()` running all active units in a single call.
  - Configured `vercel.json` with cron schedule `0 2 * * *` (daily at 02:00 UTC) to strictly comply with Vercel Hobby plan limit (max once per day).
  - Linked CMS `/dashboard/bookings` "Sinkronkan Sekarang" button directly to `/api/erp/ical-sync?action=sync-all`.
- [x] **Automated Testing Suite (`tests/ical-sync-engine.test.ts`, Vitest)**:
  - 34 comprehensive unit tests running and passing with 100% success.

### Phase 3.8 — Pure Dynamic Actual Data Architecture & Brand Standardization (Completed)
- [x] **Universal Brand Name Standardization**:
  - Standardized every instance of `KingHouse Management` to `Kinghouse Management` across all site metadata, Schema.org JSON-LD (`Organization`, `LocalBusiness`, `WebSite`), constants, routes, footers, headers, and unit tests.
- [x] **Elimination of All Dummy Data (`lib/erp/initial-data.ts`)**:
  - Removed all fake/mock dummy reservations and expenses (`Hartono & Family`, `Adrian Kowalski`, fake PLN receipts).
  - Both `INITIAL_RESERVATIONS` and `INITIAL_EXPENSES` initialized strictly as empty arrays.
- [x] **100% Actual Dynamic Overview Dashboard (`app/dashboard/page.tsx`)**:
  - Replaced hardcoded static cards (`Rp 82.5 M`, `81.4%`, `148 guests`) with real-time calculated metrics directly computed from active Airbnb iCal reservations and verified listing reviews.
- [x] **Live In-Memory & Auto-Sync Pipeline (`lib/erp/store.ts`, `app/api/erp/reservations/route.ts`)**:
  - Implemented persistent runtime store with automatic trigger of live Airbnb inbound `.ics` sync on boot/first request, immediately populating the 16 real Airbnb reservations.
- [x] **Financial Intelligence & Airbnb Payout CSV Importer (`app/dashboard/analytics/page.tsx`)**:
  - Added 1-Click modal importer for official Airbnb Host Payout CSV files (*Earnings > Completed Payouts*).
  - Clean zero-dummy empty state for operational expense ledgers with instant IDR calculations.
- [x] **Brand Identity Guidelines Overhaul (Volume II - Confidential)**:
  - Updated `app/globals.css` with Charcoal Ink (`#231F1A`), Bone (`#FAF7F1`), Sandstone (`#CBBEA0`), Warm Stone (`#5C5347`), and architectural blueprint supergraphics.
  - Implemented Next.js Google Fonts using `Cormorant_Garamond` (display/editorial) and `Inter` (interface/body).
  - Deployed official brandmark assets to `public/brand/` (`logo-primary-charcoal`, `logo-secondary-charcoal`, `logo-secondary-bone`, `icon-charcoal`, `icon-bone`) and configured App Router metadata icons & favicons.
  - Replaced legacy text mark and monogram with official secondary horizontal brandmark in header, footer, and dashboard sidebar.
- [x] **Guest Compendium Portal (`/stay`, `/stay/[slug]`) Image Assets Fix**:
  - Remapped hero images to verified existing files on disk (`SkyHouse_IKEA_KamarUtama_Wide.jpeg`, `BrightAiry_Apartment_Kamar_Wide.webp`, `SkylineLuxury_OrangeCounty_KamarUtama.webp`), resolving all broken property cards.
  - Standardized portal branding, brand badge, and back link navigation.
- [x] **Desktop Navbar Alignment & Nakula.com Luxury Spacing**:
  - Structured desktop container with `max-w-[1400px]` and balanced horizontal padding (`px-6 lg:px-12 xl:px-16`).
  - Positioned official secondary horizontal brandmark on far left meeting 120px minimum digital size requirement.
  - Incorporated `Home` as first navigation item with clean letter tracking (`tracking-[0.16em]`).
  - Aligned right-hand controls (Currency, Language) and styled `EXPLORE PROPERTIES` as a sleek pill-outline button matching Nakula layout.
- [x] **Automated Testing & Production Build**:
  - 34 Vitest unit tests passing across all suites.
  - TypeScript strict mode 0 errors.
  - Next.js production build succeeded across all 63 static and dynamic routes.

### Phase 3.9 — Header Nakula-Grade Alignment, Kinghouse Cleaning Ecosystem & Local GBP Strategy (Completed)
- [x] **Secondary Horizontal Brandmark Typography & Viewport Boost (`public/brand/logo-secondary-charcoal.svg`, `public/brand/logo-secondary-bone.svg`)**:
  - Re-anchored SVG `viewBox` from `0 0 480 140` to snug `35 18 410 108`, eliminating dead padding borders.
  - Elevated "KINGHOUSE" typography weight (600, size 32) and "MANAGEMENT" subtitle (700, size 12) for razor-sharp legibility on retina and 4K displays.
- [x] **Desktop Header Alignment & Nakula.com 1:1 Layout (`components/layout/header.tsx`)**:
  - Expanded desktop header container (`h-20 lg:h-22 xl:h-24 max-w-[1440px] px-6 lg:px-10 xl:px-14`) with logo dimensions `width={240} height={64}` (`h-10 sm:h-11 md:h-13 lg:h-14 xl:h-16`), solving logo readability issues.
  - Re-aligned right navigation dock matching Nakula: text currency selector (`$ RP ⌵`), language selector (`Globe EN ⌵`), and pill outline button (`SIGN IN` linking to `/login`).
  - Styled `ENQUIRE` with luxury editorial underline (`underline underline-offset-6 decoration-1`).
- [x] **Kinghouse Cleaning Affiliate Integration (`components/layout/footer.tsx`)**:
  - Added direct link to `https://www.kinghousecleaning.id/` under "About Us" navigation column.
  - Added dedicated "Our Business Lines" card in Column 3 highlighting villa turnover, housekeeping, and deep cleaning services.
  - Added affiliate backlink in bottom copyright bar alongside legal policies.
- [x] **Google Business Profile (GBP) Multi-Entity Architecture Strategy**:
  - Formalized recommendation for dual GBP profiles (Cleaning SAB vs Property Management Corporate) plus individual property Google Maps pins (e.g., Versatile House Jagakarsa) to capture distinct search intents without category confusion or suspension risks.

### Phase 4.0 — Universal Brand Consistency, Dynamic Multi-Currency Engine & Global Multi-Language System (Completed)
- [x] **Brand Consistency & Copywriting Standardization Across All Pages**:
  - Standardized every instance of `KingHouse Management` / `KingHouse` to `Kinghouse Management` and `Kinghouse` across all pages (`/`, `/about`, `/villas`, `/events`, `/owner-services`, `/contact`, `/faq`, `/terms`, `/privacy`, `/press`, `/stay/[slug]`, `/dashboard/*`, `/login`).
  - Updated all Schema.org metadata, SEO titles, WhatsApp auto-inquiry links, digital compendiums, ERP exports, and documentation to strictly adhere to official brand casing.
- [x] **Universal Dynamic Multi-Currency Engine**:
  - Live currency conversion engine now powers all customer-facing surfaces: Header, Footer, Villa cards on Catalog (`/villas`), Events cards and Price Matrix tables (`/events`), Owner Services performance metrics and interactive net yield calculator (`/owner-services`), Digital compendium upsells (`/stay/[slug]`), and Booking Sidebars.
  - Connected 10 global currencies (`IDR`, `USD`, `EUR`, `CNY`, `TWD`, `RUB`, `JPY`, `AUD`, `SGD`, `GBP`) with instant reactive recalculation upon user selection.
- [x] **Universal Multi-Language Localization System**:
  - Expanded `TRANSLATIONS` in `lib/context/localization-context.tsx` across all 9 supported languages (`EN`, `ID`, `JA`, `ZH-CN`, `ZH-TW`, `FR`, `ES`, `DE`, `RU`).
  - Integrated `useLocalization().t` across Hero slider, Search filter bar, Curated grid, Dual-path split, Trust social proof, Villa catalog sidebar filters, Events pricelist matrix, Owner services calculator, and Floating WhatsApp concierge.
  - Switching language in `components/layout/header.tsx` dynamically translates all pages synchronously.
- [x] **Automated Testing Suite (38 Tests Passing)**:
  - Added dedicated Vitest test suite `tests/localization-currency.test.ts` validating all 10 currencies, 9 languages, and live conversion math.

### Phase 4.1 — AirDNA-Grade Dynamic Pricing & Revenue Intelligence Suite (Completed)
- [x] **AirDNA-Standard Dynamic Revenue Algorithm (`lib/pricing/engine.ts`, `lib/pricing/types.ts`)**:
  - Implemented multi-factor formula: $P_d = \operatorname{Clamp}(P_{\text{base}} \times M_{\text{dow}} \times M_{\text{season}} \times M_{\text{holiday}} \times M_{\text{leadTime}} \times M_{\text{pacing}}, P_{\text{min}}, P_{\text{max}})$.
  - **Submarket-Aware Day-of-Week Surges**: Inverted weekday/weekend curves differentiating group staycation villas (Jagakarsa +35% weekend surge) from industrial business apartments (Cikarang Mon-Thu peak, weekend discount).
  - **Lead-Time Urgency Curve**: Automated last-minute fire-sale discount (-15% on H-2 to prevent zero-occupancy nights) vs early-bird premium protection (+15% to +20% on >45 days).
  - **Occupancy Velocity Pacing**: Dynamically surges remaining unbooked dates (+15% to +25%) when month occupancy exceeds target velocity threshold (>60%).
- [x] **Live Actual Data Integrations (Zero Dummy Data)**:
  - **Real Airbnb Host Bookings**: Directly reads real iCal reservations and blocked calendar dates across all 4 managed Jabodetabek properties.
  - **Real Indonesian Holidays API (`lib/pricing/holidays.ts`)**: Connects to official Nager.Date API (`api/v3/PublicHolidays/{year}/ID`) with 24h ISR caching and official Indonesian holiday & long weekend fallbacks.
  - **Submarket Benchmark Engine**: Real area benchmarks for Jagakarsa, Pinang/Alam Sutera, Palmerah, and Cikarang Orange County (ADR, Market Occupancy, Competitor counts, RevPAR lift).
- [x] **CMS Dashboard Dynamic Pricing Page (`app/dashboard/pricing/page.tsx`)**:
  - Dedicated route with property switcher, strategy toggle (*Conservative*, *Balanced (AirDNA)*, *Aggressive*), and live Market Demand Score (0–100).
  - Interactive 60-Day Pricing Heatmap Calendar with month switcher tabs, status badges (*Terpesona*, *Weekend Surge*, *Libur Nasional*, *Last-Minute*, *Custom Override*).
  - **Full Multiplier Breakdown & Custom Rate Override Modal**: React Portal modal inspecting day-by-day calculations with 1-click admin price override and reset capabilities.
  - **Guardrail Drawer**: Configurable Floor & Ceiling price limits, weekend surge %, and last-minute discount sliders.
  - **1-Click CSV Exporter (`lib/pricing/export.ts`)**: Instant `.csv` generation for OTA multi-calendar rate imports.
- [x] **Automated Testing Suite (53 Tests Passing)**:
  - Added 15 comprehensive unit tests in `tests/dynamic-pricing.test.ts` covering submarket DOW multipliers, holiday detection, urgency curves, guardrails clamp, override precedence, and CSV formatting.

### Phase 4.2 — Editorial 404 Not Found Experience & Search Console Sitemap Fortification (Completed)
- [x] **Editorial Custom 404 Not Found Page (`app/not-found.tsx`)**:
  - Conforms to Kinghouse Brandmark Volume II and `app/globals.css` design system.
  - Features `supergraphic-blueprint-bone` architectural pattern, radial ambient gold glow, and `sana-glass` elevated badges.
  - Large display 404 typography in Cormorant Garamond (`font-serif font-light text-8xl sm:text-9xl lg:text-[11rem]`).
  - Seamless bilingual support via `useLocalization()` (Bahasa Indonesia & English).
  - Quick destination discovery bento cards for Jagakarsa, Tangerang, Palmerah, and Cikarang.
  - Direct action buttons ("Kembali ke Beranda", "Jelajahi Villa", and direct 24/7 WhatsApp Concierge assistance).
- [x] **Sitemap & Canonical Base URL Fortification (`app/sitemap.ts`, `lib/constants.ts`)**:
  - Added defensive sanitization in `SITE_CONFIG.baseUrl` (`lib/constants.ts`) to immediately correct legacy typo `kinghousemanagemet` or invalid protocols to canonical `https://www.kinghousemanagement.com`.
  - Harmonized root URL in `app/sitemap.ts` without trailing slash to match canonical URL structure.
  - Removed private stay compendiums (`/stay/[slug]`) from `app/sitemap.ts` to strictly adhere to `app/robots.ts` disallow rules (`/stay/*`), eliminating GSC "Indexed, though blocked by robots.txt" indexing conflicts.
  - Updated Vitest assertions in `tests/analytics-seo.test.ts` to enforce canonical URL prefixes and verify zero disallowed stay URLs in sitemap output.

### Phase 4.3 — Official Brandmark Guidelines Volume II (Ver. 02) & Favicon Suite Integration (Completed)
- [x] **Monoline Quiet Custodian Key Brandmark Overhaul (`public/brand/`, `public/brand_guide/`)**:
  - Replaced legacy door post-and-lintel mark with the official Monoline Key brandmark symbolizing Kinghouse as the Quiet Custodian (pemegang akses dan penjaga kepercayaan properti yang dikelola).
  - Deployed full high-resolution vector (SVG) and raster (PNG) asset suite across all 3 official configurations:
    1. *Primary Brandmark (Vertical)*: `logo-primary-full-color`, `logo-primary-reversed`, `logo-primary-brass-monochrome`.
    2. *Secondary Brandmark (Horizontal)*: `logo-secondary-full-color`, `logo-secondary-reversed`, `logo-secondary-brass-monochrome`, and transparent inverted `logo-secondary-bone.svg`.
    3. *Tertiary Brandmark (Icon)*: `icon-full-color`, `icon-reversed`, `icon-brass-monochrome`, and transparent `icon-bone.svg`.
  - Maintained full backwards-compatible aliases (`logo-secondary-charcoal`, `icon-charcoal`, `logo-primary-charcoal`).
- [x] **Dedicated Favicon & App Icon Suite (`app/favicon.ico`, `public/favicon.ico`, `app/icon.svg`)**:
  - Integrated official 16px single-tooth simplified key icon (`icon-favicon-simplified.svg`, `icon-favicon-simplified.png`) with stroke optimized for high legibility at micro sizes.
  - Generated multi-resolution `favicon.ico` (16x16, 32x32, 48x48) in both `app/` and `public/`.
  - Updated `app/layout.tsx` metadata icons to declare simplified SVG, ICO, and PNG fallbacks.
- [x] **Brand Guidelines Vol II Design Tokens & Supergraphics (`app/globals.css`)**:
  - Added official Brass Monochrome palette tokens (`--brand-brass: #6B4B2A;`, `--brand-brass-tint: #EFE2CE;`) and Warm Bone (`--brand-bone-warm: #F5EFEB;`).
  - Updated Tailwind v4 `@theme inline` mappings for `--color-brand-brass`, `--color-brand-brass-tint`, and `--color-brand-bone-warm`.
  - Formalized 1X key-bow secure area and minimum size reproduction rules (Primary >=160px, Secondary >=120px, Tertiary >=24px, Favicon 16px).
  - Synchronized architectural blueprint supergraphic patterns (Bone grid, Charcoal brass grid, Sandstone divider).
### Phase 4.4 — Corporate Entity Credibility, Glints Career Integration, Google Business Profile & Founder Spotlight (Completed)
- [x] **Corporate Legal Entity & Footer Authority (`components/layout/footer.tsx`, `lib/constants.ts`)**:
  - Added official corporate parent name **PT Kreasi Usman Gosse** prominently in footer Column 3 (Corporate Headquarters) and bottom copyright bar.
  - Updated corporate headquarters address: `Jl. Reni Jaya Blk. K2 No.16, Pd. Ranji, Kec. Ciputat Tim., Kota Tangerang Selatan, Banten 15416`.
  - Added direct link to verified Google Search Address & Reviews.
  - Linked official Glints Career Portal (`https://glints.com/id/en/companies/pt-kreasi-usman-gosse/351bd7d6-fff5-4a77-a91b-f69918d3b2fe`) in Column 1 and bottom legal bar.
  - Linked verified Google Business Profile (`https://share.google/WHLcKlmJf8zZo27gO`) in footer and contact page.
- [x] **Comprehensive About Us Page Overhaul (`app/about/page.tsx`)**:
  - Combined Kinghouse Management's property management & co-hosting narrative with Kinghouse Cleaning's 2020 foundation story.
  - Documented social enterprise mission: empowering single mothers and female heads of households with technical on-the-job training, dignified wages, and entrepreneurial support.
  - Core philosophy: *"The act of cleaning is more than just hygiene; it’s the opportunity to start over."*
  - Showcased 11 Cleaning Services (Commercial, Residential, Rental Turnover, Move Out/In, Common Area, Construction, Event, Day Porter, Floor & Carpet Care, Window Washing, Disinfecting).
  - Showcased 14 Industries Served (Short-term rentals Airbnb, Real-Estate, Hospitality, Office Buildings, Production Offices & Studios, Record Studios, Editing Suites, Warehouses, Distribution Centers, Medical Facilities, etc.).
  - Detailed Founder Spotlight: **Reizky Syaher PU** (Founder & Managing Director) with scraped high-resolution verified photo (`/team/reizky-syaher.jpg`), Universitas Padjadjaran & RevoU background, Kemenparekraf & BEKRAF public sector experience, conversion rate optimization expertise, and direct LinkedIn profile link.
- [x] **Local SEO & Schema.org LocalBusiness Harmonization (`app/layout.tsx`)**:
  - Injected `legalName: "PT Kreasi Usman Gosse"` into Organization and LocalBusiness schemas.
  - Updated PostalAddress to Ciputat Timur, Kota Tangerang Selatan, Banten 15416.
  - Added `hasMap` pointing to Google Business Profile (`https://share.google/WHLcKlmJf8zZo27gO`).
  - Added Glints company URL and LinkedIn founder URL into schema `sameAs`.

### Phase 4.5 — Multilingual About Us Architecture & Brand System Harmonization (Completed)
- [x] **Dynamic Multilingual & English-Default About Us Architecture (`app/about/page.tsx`, `app/about/layout.tsx`)**:
  - Refactored `app/about/page.tsx` into a high-performance Client Component integrating `useLocalization()`.
  - Enforced **English as the primary default language** across all sections, seamlessly switching to Bahasa Indonesia when the user selects `ID` in `components/layout/header.tsx` (or other languages with graceful fallback).
  - Created `app/about/layout.tsx` to maintain server-rendered SEO metadata (`Metadata`, OpenGraph, canonical URLs) without compromising client-side localization responsiveness.
  - Complete bilingual coverage: Hero, Vision & Co-Hosting service, 4 Management Pillars, Founder & Leadership Spotlight (Reizky Syaher PU), Kinghouse Cleaning Heritage & Social Enterprise, 11 Specialized Cleaning Services, 13 Industries Served, Corporate Transparency (PT Kreasi Usman Gosse, GBP, Glints), and Bottom CTAs.
- [x] **Universal Styling Harmonization Inline with `app/globals.css`**:
  - Replaced all non-standard off-brand dark backgrounds (`#24221F`) across `/terms`, `/privacy`, `/faq`, `/press`, `/management-inquiry`, and `/about` with official Kinghouse Charcoal Ink (`#231F1A`).
  - Standardized background surfaces to official Bone (`#FAF7F1`), borders to Subtle Border (`#E8E4DC`), and subtitles to Warm Stone (`#5C5347`).
  - Integrated `supergraphic-blueprint-charcoal`, `supergraphic-blueprint-bone`, and `supergraphic-divider` across editorial hero and quote sections for rich brand consistency.
- [x] **Footer Corporate Headquarters Streamlining (`components/layout/footer.tsx`)**:
  - Eliminated redundant `PT Kreasi Usman Gosse` pill badge adjacent to the section title.
  - Merged duplicate Google Maps/Reviews buttons into a single clean, high-conversion action button (`Google Maps & Reviews ↗`).
- [x] **Automated Testing & Production Build**:
  - 53 Vitest unit tests passing across all suites.
  - Next.js production build succeeded across all 66 static and dynamic routes.

### Phase 4.6 — AirDNA & Little Hotelier Strategic Suite (100% Free-Tier Production Ready) (Completed)
- [x] **AirDNA-Grade "Rentalizer" Property Revenue & Yield Simulator (`components/owner/property-revenue-calculator.tsx`, `app/owner-services/page.tsx`)**:
  - Embedded interactive simulator directly into `/owner-services#calculator` with Hero CTA hook ("Simulasi Potensi Cuan (AirDNA)").
  - **Zero Dummy Data**: Pulls live submarket benchmarks (`SUBMARKET_BENCHMARKS`) for Jagakarsa, Pinang/Alam Sutera, Palmerah, and Cikarang Orange County.
  - Computes empirical comparison: **Self-Managed (~45% occupancy, flat rate)** vs **Kinghouse Dynamic Pricing (~78% occupancy, weekend surge +35%, holiday surge +40%)**.
  - Transparent fee deduction: 15% Standard vs 20% Premium net payout calculator with highlighted annual net surplus.
  - **High-Converting WhatsApp Lead Action**: Pre-populates structured WhatsApp message containing property specs, ADR, and simulation results sent to Reizky (`082123933218`).
  - **1-Click Official Printable Audit Sheet**: Formatted for standard A4 print/PDF with Kinghouse Management & PT Kreasi Usman Gosse branding for in-person pitching.
- [x] **Retained Core Yield Intelligence**: Maintained high-converting AirDNA Property Revenue Simulator with English default and full bilingual support on `/owner-services#calculator`.

### Phase 4.7 — Strategic Scope Streamlining, Universal English Default & Page 1 Google SEO Overhaul (Completed)
- [x] **Feature Removal & Codebase Streamlining**:
  - Completely decommissioned and deleted `/owner-portal/[slug]` routes and `components/owner/owner-portal-view.tsx` to streamline scope and eliminate unnecessary portal overhead.
  - Removed `/dashboard/housekeeping` route and removed Housekeeping item from `components/dashboard/sidebar.tsx` navigation.
  - Purged Next.js cache; verified routes cleanly return `404 Not Found`.
- [x] **Universal English Default Localization**:
  - Standardized root `<html lang="en">` in `app/layout.tsx`.
  - Refactored `components/owner/property-revenue-calculator.tsx` with English as default language while retaining fluid Indonesian toggle.
  - Added alternate hreflang canonical links (`en`, `id`, `x-default`) pointing to `https://www.kinghousemanagement.com`.
  - Configured OpenGraph `alternateLocale` for `id_ID`, `ja_JP`, `zh_CN`, `fr_FR`, `es_ES`, `de_DE`, and `ru_RU`.
- [x] **Google Page 1 Organic SEO & Rich Snippets Optimization**:
  - **Root (`app/layout.tsx`)**: Injected `AggregateRating` (4.90★ from 96 reviews across Airbnb listings) into `LocalBusiness` schema, with geo-coordinates and full corporate entity links (`PT Kreasi Usman Gosse`). Optimized meta title & description for maximum CTR.
  - **Owner Services (`app/owner-services/page.tsx`)**: Added `Service` and `OfferCatalog` Schema.org JSON-LD targeting Airbnb co-hosting, dynamic pricing, and 15%/20% management fees.
  - **Villas Catalog (`app/villas/layout.tsx`)**: Added `ItemList` Schema.org JSON-LD cataloging all 4 managed properties.
  - **Events Venue (`app/events/layout.tsx`)**: Added `EventVenue` Schema.org JSON-LD for Versatile House Jagakarsa.
  - **Contact (`app/contact/layout.tsx`)**: Added `ContactPage` Schema.org JSON-LD with corporate headquarters and concierge endpoints.
  - **FAQ Knowledge Base (`app/faq/layout.tsx`)**: Added `FAQPage` Schema.org JSON-LD with 10 high-intent Q&As to capture Google SERP rich expandable accordions.
- [x] **Quality Assurance & Verification**:
  - All 56 Vitest unit tests pass across 9 test files.
  - Strict TypeScript check passed with 0 errors (`npx tsc --noEmit`).
  - ESLint passed with 0 errors (`npm run lint`).
  - Next.js production build succeeded across all 66 static and dynamic routes.

### Phase 4.8 — Owner Privacy Decommissioning & Secrets Hardening (Completed)
- [x] **Owner Spotlight Removal (`app/about/page.tsx`)**:
  - Completely removed the Founder & Leadership Spotlight section (Section 3) along with all associated quotes, credentials, and narrative keys in both Indonesian and English.
  - Preserved seamless transition between Management Pillars, architectural supergraphic divider, and Kinghouse Cleaning foundational history.
  - Removed unused `Linkedin` import and safely removed the `/team/reizky-syaher.jpg` photo asset.
- [x] **Schema.org & Social Privacy Protection (`app/layout.tsx`, `lib/constants.ts`)**:
  - Removed personal founder LinkedIn profile from `sameAs` array in `LocalBusiness` Schema.org JSON-LD to prevent search engine indexing of personal profile.
  - Removed personal LinkedIn link from `social` configuration in `lib/constants.ts`.
- [x] **Secrets Hardening in Documentation (`README.md`, `PROJECT_STATE.md`)**:
  - Sanitized `README.md` to eliminate real passwords and session secrets, replacing them with standard `.env.example` placeholder templates.
  - Updated testing metrics in `README.md` to reflect 56 tests passing across 9 test suites and documented latest rich Schema.org suites and revenue calculator.
- [x] **Zero-Regression Verification**:
  - 56 Vitest unit tests pass with 100% success.
  - Strict TypeScript check passed with 0 errors.
  - ESLint validation passed with 0 errors.
  - Next.js production build succeeded with 66 routes.

### Phase 4.9 — Official Corporate Email Transition & Full Repo Standardization (Completed)
- [x] **Custom Domain Email Infrastructure (`info@kinghousemanagement.com`)**:
  - Activated zero-cost, enterprise-grade inbound routing using **Cloudflare Email Routing** with automated MX and SPF DNS records.
  - Configured outbound authenticated SMTP alias using **Brevo Relay** (`smtp-relay.brevo.com:587`) for `ptkreasiusmangosse@gmail.com` with sender authentication and unblocked IP policy.
- [x] **Codebase-Wide Standardization & Public Touchpoints**:
  - Synchronized `lib/constants.ts` (`brand.contact.email`).
  - Standardized default admin credentials and timing-safe authentication in `lib/auth.ts` and `tests/validation-security.test.ts`.
  - Updated all public touchpoints: Global Footer (`components/layout/footer.tsx`), Contact Page (`app/contact/page.tsx`), Press Inquiries & Media Kit (`app/press/page.tsx`), Privacy Policy DPO (`app/privacy/page.tsx`), and Terms & Conditions Legal Desk (`app/terms/page.tsx`).
  - Aligned Schema.org JSON-LD LocalBusiness & ContactPage schemas in `app/layout.tsx` and `app/contact/layout.tsx`.
  - Standardized CMS settings and login views (`app/dashboard/settings/page.tsx`, `app/login/page.tsx`).
  - Updated `.env.example`, `.env.production.example`, and `README.md`.
- [x] **Verification & Tests**:
  - Automated Vitest test suite running 56 tests passing with 100% success rate.
  - Strict TypeScript validation passing with 0 errors.
  - Next.js production build succeeded across all routes.

### Phase 5.0 — OTA iCal Feed Resilience & Supabase Auto-Recovery (Completed)
- [x] **OTA Calendar Feed Resilience & Timeout Defense (`app/api/ical/[villaSlug]/route.ts`)**:
  - Integrated `AbortController` with a 4000ms threshold on Supabase queries to guarantee responses never stall or trigger Vercel 504 Gateway Timeouts when Supabase pauses.
  - Added multi-alias identifier matching (`versatile-house-jagakarsa`, `villa-jagakarsa`, `villa-1`, `45834267`) to eliminate slug mismatches between OTA feeds, ERP state, and Supabase tables.
  - Fallback mechanism to runtime in-memory store if database query exceeds threshold or errors.
- [x] **Modular RFC 5545 iCalendar Generator (`lib/ical/generator.ts`)**:
  - Decoupled iCal generation logic into a clean, reusable utility supporting RFC 5545 compliance (UID, DTSTAMP, DTSTART/DTEND, SUMMARY, METHOD:PUBLISH, CRLF line endings).
  - Added unit test coverage in `tests/ical-feed.test.ts` (57 tests passing).
- [x] **Database Row Synchronization**:
  - Aligned existing Supabase `reservations` records to standard property slugs (`versatile-house-jagakarsa`, `sky-house-tangerang`, etc.).
  - Verified live production endpoint returning HTTP 200 with active reservation events in under 300ms.

### Phase 5.1 — Local SEO Winning Architecture, GA4/GTM Consent Mode v2 & GSC Sitemap Fortification (Completed)
- [x] **Local SEO & Google Search Rank 1 Hyper-Localization Architecture (`app/layout.tsx`, `app/locations/`)**:
  - Injected geographic metadata tags in `<head>` (`geo.region: ID-JK`, `geo.placename: Jakarta Selatan, Tangerang, Jakarta Barat, Cikarang`, `geo.position: -6.2843;106.7447`, `ICBM`).
  - Added hyper-local Indonesian keywords targeting search intents across all 4 managed clusters: "sewa villa jagakarsa", "villa private pool jakarta selatan", "villa intimate wedding jakarta", "sewa apartemen harian ikea tangerang", "sewa apartemen pinang tangerang", "sewa apartemen palmerah jakarta barat", "sewa apartemen orange county cikarang", "serviced apartment cikarang", and "jasa kelola airbnb jakarta".
  - Enriched root `LocalBusiness` / `LodgingBusiness` Schema.org JSON-LD with multi-location lodging departments (Versatile House Jagakarsa, Sky House Tangerang, Bright & Airy Palmerah, Skyline Luxury Cikarang), 24/7 hours, rating (4.90★ from 96 reviews), payment options, accepted currencies, and direct link to verified Google Business Profile.
  - Added `BreadcrumbList` and localized `FAQPage` schemas on dynamic area landing pages (`/locations/[area]`), unlocking Google SERP FAQ rich snippets with visible on-page FAQ accordions.
  - Enriched `VacationRental` schema generator (`lib/utils.ts`) with check-in/checkout rules, pets allowed policy, and price specifications.
  - Consolidated duplicate villa URLs by 308 permanent redirecting `/villas/[slug]` to canonical localized `/locations/[area]/villas/[slug]`.
  - Added dedicated server-rendered metadata layout for property owner onboarding (`app/management-inquiry/layout.tsx`) with `ContactPage` and `Service` structured data.
- [x] **Enterprise GA4, GTM & Google Consent Mode v2 Best Practices (`components/analytics/`, `lib/analytics.ts`)**:
  - Implemented standard **Google Consent Mode v2** default initialization in `components/analytics/google-analytics.tsx` (`analytics_storage: granted`, `ad_storage: granted`, etc.) via non-blocking script execution.
  - Configured `send_page_view: false` in base GA4 configuration to eliminate duplicate pageview reporting, delegating pageview tracking to `PageViewTracker` as the single source of truth across SSR and client transitions.
  - Expanded `lib/analytics.ts` with standard GA4 recommended events: `generate_lead` (with estimated monetary yield for owner inquiries and audits), `begin_checkout` (direct booking and OTA referral clicks), `view_item` (property detail inspection), `view_item_list` (catalog and area landing page views), and `search`.
  - Integrated `PropertyViewTracker` client component into `/locations/[area]/villas/[slug]` to automatically trigger `view_item` on property visit.
  - Connected `trackOwnerLead` into `/management-inquiry` form submission.
- [x] **Google Search Console & Dynamic XML Sitemap Fortification (`app/sitemap.ts`)**:
  - Included dynamic event packages (`/events/[slug]`: Garden Wedding, Corporate Retreat, Birthday Party) with weekly changefrequency and 0.85 priority.
  - Added XML image sitemap metadata (`images`) for property listings, event packages, and blog articles to drive Google Images traffic.
  - Removed redirected `/villas/[slug]` URLs from `sitemap.xml` to prevent GSC redirect-in-sitemap warnings and maintain 100% canonical index hygiene.
- [x] **Automated Testing Suite (59 Tests Passing Across 9 Suites)**:
  - Added unit test coverage for GA4 `generate_lead`, `begin_checkout`, `view_item`, `view_item_list`, `search`, and dynamic event package sitemap URLs in `tests/analytics-seo.test.ts`.

---

## 4. VERIFICATION COMMANDS

```bash
# Run automated Vitest test suite (59 tests across 9 suites)
npm test

# Run TypeScript strict type verification (0 errors)
npx tsc --noEmit

# Run ESLint validation (0 errors)
npm run lint

# Run Next.js optimized production build (66 static & dynamic routes)
npm run build
```







