-- ==============================================================================
-- Scheduled blog posts — run ONCE in the Supabase SQL Editor.
--
-- A post with status 'Published' and a future published_at is *scheduled*.
-- The website already hides it until that moment (lib/blog/schedule.ts); this
-- policy makes the public anon key respect the same rule, so a scheduled
-- article cannot be read early through the Supabase REST API either.
-- The server uses service_role (bypasses RLS), so the dashboard still sees it.
-- ==============================================================================

DROP POLICY IF EXISTS "Public Read Published Blog Posts" ON public.blog_posts;
CREATE POLICY "Public Read Published Blog Posts" ON public.blog_posts
  FOR SELECT USING (status = 'Published' AND published_at <= NOW());

-- Listing and sitemap queries filter and sort on these two columns.
CREATE INDEX IF NOT EXISTS blog_posts_status_published_at_idx
  ON public.blog_posts (status, published_at DESC);
