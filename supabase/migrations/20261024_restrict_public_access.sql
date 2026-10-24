-- ==============================================================================
-- Lock down public (anon) access — run ONCE in the Supabase SQL Editor.
--
-- BEFORE running: set SUPABASE_SERVICE_ROLE_KEY in Vercel and redeploy. The
-- website's server code then uses service_role, which bypasses RLS, so the
-- dashboard, iCal sync, blog CMS and lead form keep working.
--
-- What it fixes: the original schema let the public anon key READ guest names,
-- phones, emails and payouts, and INSERT/UPDATE/DELETE reservations, expenses
-- and blog posts.
-- ==============================================================================

-- 1. Remove the open policies
DROP POLICY IF EXISTS "Public Read Reservations" ON public.reservations;
DROP POLICY IF EXISTS "Public Read Expenses" ON public.expenses;
DROP POLICY IF EXISTS "Public Read Blog Posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow All Insert Reservations" ON public.reservations;
DROP POLICY IF EXISTS "Allow All Update Reservations" ON public.reservations;
DROP POLICY IF EXISTS "Allow All Delete Reservations" ON public.reservations;
DROP POLICY IF EXISTS "Allow All Insert Expenses" ON public.expenses;
DROP POLICY IF EXISTS "Allow All Update Expenses" ON public.expenses;
DROP POLICY IF EXISTS "Allow All Delete Expenses" ON public.expenses;
DROP POLICY IF EXISTS "Allow All Insert Blog Posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow All Update Blog Posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow All Delete Blog Posts" ON public.blog_posts;

-- 2. Table privileges: server (service_role) only; public may read blog posts
REVOKE ALL ON public.reservations, public.expenses, public.leads FROM anon, authenticated;
REVOKE ALL ON public.blog_posts FROM anon, authenticated;
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT ALL ON public.reservations, public.expenses, public.blog_posts, public.leads TO service_role;

-- 3. Public can read published articles only
DROP POLICY IF EXISTS "Public Read Published Blog Posts" ON public.blog_posts;
CREATE POLICY "Public Read Published Blog Posts" ON public.blog_posts FOR SELECT USING (status = 'Published');

-- 4. Make sure RLS is on everywhere
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
