# PROJECT_STATE.md — KingHouse Hospitality Web Platform

> **Single Source of Truth (SSOT)** for AI Coding Agents (Claude 4.6 Sonnet, Gemini 3.7 Flash, Antigravity, etc.).  
> Read this document to understand architectural standards, technical stack, current implementation status, data schemas, and development workflows without rescanning the entire repository.

---

## 1. EXECUTIVE SUMMARY & SCOPE

### 1.1 Core Purpose & Scope
**KingHouse** is an editorial-grade property management, SEO CMS, 100% Free-Tier Hospitality ERP/POS, and dual-path short-stay booking platform focused on **Jabodetabek** (Jagakarsa - Jakarta Selatan, Pinang - Tangerang, Palmerah - Jakarta Barat, and Cikarang Selatan - Bekasi).

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
| **Framework** | Next.js (App Router) | `16.0.7` (`next dev --turbopack`) | Core fullstack framework & static/dynamic generation |
| **Runtime / Core** | React / React DOM | `19.2.0` | Modern React UI with Server/Client Components |
| **Language** | TypeScript | `^5.0` (Strict mode) | Type safety across schemas, state, and props |
| **Typography** | Philosopher & Plus Jakarta Sans | Google Fonts (`next/font/google`) | Luxury editorial headers (`Philosopher`) & ultra-clean UI |
| **Localization** | Multi-Language & Multi-Currency Context | Custom `LocalizationProvider` | Real-time conversions (10 currencies) & i18n (9 languages: JA, ZH, FR, ES, DE, RU, ID, EN) |
| **Styling** | Tailwind CSS v4 + PostCSS | `@tailwindcss/postcss ^4`, `tailwindcss ^4` | Nakula Olive-Khaki (`#8C7F5F`) + KingHouse Gold (`#B8934C`) & Slate |
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
│   │   ├── erp/                      # Dynamic ERP endpoints (reservations, expenses)
│   │   └── ical/[villaSlug]/         # Dynamic RFC 5545 iCal calendar feeds
│   ├── blog/                         # Blog index & article reader with BlogPosting schema
│   ├── dashboard/                    # Hospitality ERP/POS & CMS Suite
│   │   ├── analytics/page.tsx        # Revenue intelligence, POS expense ledger, & print statements
│   │   ├── blog/page.tsx             # Blog article manager
│   │   ├── bookings/page.tsx         # Multi-channel reservations hub with 1-click CSV export
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
│   │   ├── initial-data.ts           # Realistic reservations and POS expenses seed
│   │   └── types.ts                  # ERP domain models (Reservation, ExpenseRecord, OwnerStatement)
│   ├── security/
│   │   └── rate-limiter.ts           # Zero-cost in-memory sliding window rate limiter
│   ├── validations/
│   │   └── index.ts                  # Zod validation schemas for forms, APIs, and auth
│   ├── auth.ts                       # HMAC-SHA256 session tokenization
│   ├── constants.ts                  # SITE_CONFIG, MANAGED_AREAS, MANAGEMENT_SERVICES
│   ├── data.ts                       # Real Airbnb properties, 6 blog posts, 3 event packages
│   ├── types.ts                      # Core domain models (Villa, BlogPost, VillaEvent, SeoMeta)
│   └── utils.ts                      # VacationRental schema generator, currency formatters
├── tests/
│   ├── erp-calculations.test.ts      # Automated unit tests for financial math & statement generator
│   ├── ical-feed.test.ts             # Automated unit tests for CSV and calendar feeds
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
- [x] **Official Contact & Social Integration**: Desk & WhatsApp (`082123933218`), Email (`ptkreasiusmangosse@gmail.com`), and TikTok ([`@kinghouse.id`](https://www.tiktok.com/@kinghouse.id)).

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
  - Replaced legacy neon pinks (`#FF3B70`) and non-standard dark purple surfaces with official KingHouse Gold (`#B8934C`, `#DFC58E`), Nakula Khaki (`#8C7F5F`), and Luxury Charcoal (`#19191B`, `#222225`, `#28282B`).
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
  - WebSite JSON-LD with Sitelinks `SearchAction`, Organization, LocalBusiness, Breadcrumbs, and Brand Aliases targeting `kinghousemanagemet.com` / `KingHouse Management`.
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

---

## 4. VERIFICATION COMMANDS

```bash
# Run automated Vitest test suite
npm test

# Run TypeScript strict type verification
npx tsc --noEmit

# Run ESLint validation (0 errors)
npm run lint

# Run Next.js optimized production build (63 static & dynamic routes)
npm run build
```






