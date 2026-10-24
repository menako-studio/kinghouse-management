-- ==============================================================================
-- KINGHOUSE HOSPITALITY ERP & CMS DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Standard Schema: public (PostgREST Default Exposed Schema)
-- ==============================================================================

-- 1. RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS public.reservations (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL,
    property_slug TEXT NOT NULL,
    property_name TEXT NOT NULL,
    guest_name TEXT NOT NULL,
    guest_phone TEXT,
    guest_email TEXT,
    channel TEXT NOT NULL DEFAULT 'Direct WhatsApp',
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    nights INTEGER NOT NULL DEFAULT 1,
    guests INTEGER NOT NULL DEFAULT 1,
    gross_payout_idr BIGINT NOT NULL DEFAULT 0,
    cleaning_fee_idr BIGINT NOT NULL DEFAULT 0,
    fee_tier TEXT NOT NULL DEFAULT 'standard',
    management_fee_percent NUMERIC(5,2) NOT NULL DEFAULT 15.00,
    management_fee_idr BIGINT NOT NULL DEFAULT 0,
    net_owner_payout_idr BIGINT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Confirmed',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast filtering
CREATE INDEX IF NOT EXISTS idx_reservations_property_id ON public.reservations (property_id);
CREATE INDEX IF NOT EXISTS idx_reservations_check_in ON public.reservations (check_in);
CREATE INDEX IF NOT EXISTS idx_reservations_channel ON public.reservations (channel);

-- 2. OPERATIONAL EXPENSES (POS LEDGER) TABLE
CREATE TABLE IF NOT EXISTS public.expenses (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL,
    property_slug TEXT NOT NULL,
    property_name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    amount_idr BIGINT NOT NULL DEFAULT 0,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    recorded_by TEXT NOT NULL DEFAULT 'Operational Staff',
    vendor_name TEXT,
    receipt_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for expenses
CREATE INDEX IF NOT EXISTS idx_expenses_property_id ON public.expenses (property_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses (date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses (category);

-- 3. BLOG POSTS TABLE (CMS)
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    author_name TEXT NOT NULL DEFAULT 'KingHouse Hospitality',
    author_avatar TEXT,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'Published',
    reading_time TEXT DEFAULT '4 min read',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    seo_score INTEGER DEFAULT 85,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. LEADS TABLE (Owner / Stay / Event funnel pipeline)
-- Contains personal data (name, WhatsApp): RLS is enabled with NO anon/authenticated
-- policies, so only the server (SUPABASE_SERVICE_ROLE_KEY) can read or write it.
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    target TEXT NOT NULL CHECK (target IN ('OWNER', 'STAY', 'EVENT')),
    need TEXT NOT NULL,
    name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT,
    event_date DATE,
    check_out DATE,
    guests_or_units INTEGER,
    property TEXT,
    status TEXT NOT NULL DEFAULT 'Baru'
        CHECK (status IN ('Baru', 'Dikualifikasi', 'Penawaran terkirim', 'Tanggal ditahan', 'Booking / Kontrak', 'Batal')),
    priority BOOLEAN NOT NULL DEFAULT FALSE,
    route_to TEXT NOT NULL,
    pic TEXT,
    first_response_due_at TIMESTAMPTZ,
    first_response_at TIMESTAMPTZ,
    last_contact_at TIMESTAMPTZ,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    referrer TEXT,
    landing_page TEXT,
    details JSONB NOT NULL DEFAULT '{}'::JSONB,
    notes TEXT,
    lost_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_target_status ON public.leads (target, status);

-- Grant schema and table permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Enable Row Level Security (RLS)
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.leads FROM anon, authenticated;

-- Allow public read access (anon / service_role)
CREATE POLICY "Public Read Reservations" ON public.reservations FOR SELECT USING (true);
CREATE POLICY "Public Read Expenses" ON public.expenses FOR SELECT USING (true);
CREATE POLICY "Public Read Blog Posts" ON public.blog_posts FOR SELECT USING (true);

-- Allow authenticated / service_role inserts and updates
CREATE POLICY "Allow All Insert Reservations" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow All Update Reservations" ON public.reservations FOR UPDATE USING (true);
CREATE POLICY "Allow All Delete Reservations" ON public.reservations FOR DELETE USING (true);

CREATE POLICY "Allow All Insert Expenses" ON public.expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow All Update Expenses" ON public.expenses FOR UPDATE USING (true);
CREATE POLICY "Allow All Delete Expenses" ON public.expenses FOR DELETE USING (true);

CREATE POLICY "Allow All Insert Blog Posts" ON public.blog_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow All Update Blog Posts" ON public.blog_posts FOR UPDATE USING (true);
CREATE POLICY "Allow All Delete Blog Posts" ON public.blog_posts FOR DELETE USING (true);

-- ==============================================================================
-- INITIAL SEED DATA (JABODETABEK PROPERTIES)
-- ==============================================================================

INSERT INTO public.reservations (
    id, property_id, property_slug, property_name, guest_name, guest_phone, guest_email, 
    channel, check_in, check_out, nights, guests, gross_payout_idr, cleaning_fee_idr, 
    fee_tier, management_fee_percent, management_fee_idr, net_owner_payout_idr, status, notes
) VALUES
('RES-8491', 'villa-jagakarsa', 'versatile-house-with-beautiful-garden-beyond', 'Versatile House With Beautiful Garden Beyond', 'Budi Santoso', '+6281299887766', 'budi.santoso@gmail.com', 'Airbnb', '2026-08-25', '2026-08-28', 3, 10, 8550000, 250000, 'standard', 15.00, 1245000, 7055000, 'Confirmed', 'Family gathering & BBQ party.'),
('RES-8492', 'sky-house-bsd', 'sky-house-hotel-style-bed-ikea-5min', 'Sky House • Hotel-Style Bed + IKEA 5min', 'Sarah Wijaya', '+6281122334455', 'sarah.w@yahoo.com', 'Direct WhatsApp', '2026-08-26', '2026-08-27', 1, 2, 480000, 50000, 'premium', 20.00, 86000, 344000, 'Checked-in Ready', 'Business staycation.'),
('RES-8493', 'palmerah-apt', 'bright-airy-apartment', 'Bright & Airy Apartment', 'David Pratama', '+628176543210', 'david.pratama@outlook.com', 'Booking.com', '2026-08-29', '2026-08-31', 2, 2, 1100000, 75000, 'standard', 15.00, 153750, 871250, 'Confirmed', 'Late check-in requested.'),
('RES-8494', 'cikarang-luxury', 'skyline-luxury-at-orange-county', 'Skyline Luxury at Orange County', 'Kenji Tanaka', '+628189876543', 'kenji.tanaka@corporation.jp', 'Airbnb', '2026-09-01', '2026-09-05', 4, 2, 2800000, 100000, 'premium', 20.00, 540000, 2160000, 'Confirmed', 'Expat corporate assignment.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.expenses (
    id, property_id, property_slug, property_name, category, description, amount_idr, date, recorded_by, vendor_name
) VALUES
('EXP-101', 'villa-jagakarsa', 'versatile-house-with-beautiful-garden-beyond', 'Versatile House With Beautiful Garden Beyond', 'PLN & Utilities', 'Pembelian Token Listrik 1000k PLN Pascabayar', 1000000, '2026-08-15', 'Pak Joko (Caretaker)', 'PLN Mobile'),
('EXP-102', 'villa-jagakarsa', 'versatile-house-with-beautiful-garden-beyond', 'Versatile House With Beautiful Garden Beyond', 'Linen & Laundry', 'Laundry Bedcover King, 9 Sprei, dan 12 Handuk Hotel', 350000, '2026-08-18', 'Ibu Rina (Housekeeping)', 'Berkah Laundry Express'),
('EXP-103', 'sky-house-bsd', 'sky-house-hotel-style-bed-ikea-5min', 'Sky House • Hotel-Style Bed + IKEA 5min', 'Guest Amenities', 'Restock Hotel Shampoo, Dental Kit, & Teh/Kopi Premium', 120000, '2026-08-20', 'Admin Operasional', 'Mitra Hotel Supplies'),
('EXP-104', 'cikarang-luxury', 'skyline-luxury-at-orange-county', 'Skyline Luxury at Orange County', 'Maintenance & Repairs', 'Servis Cuci AC Daikin Inverter & Cek Freon Kamar Utama', 200000, '2026-08-21', 'Teknisi AC', 'Sejuk Abadi Service')
ON CONFLICT (id) DO NOTHING;
