import type { BlogPost } from "@/lib/types"

// ─── EDITORIAL CALENDAR ───────────────────────────────────────────────────────
// Articles written ahead of time and published automatically on `publishedAt`
// (see lib/blog/schedule.ts). Until then they are invisible on the site: not in
// /blog, the sitemap or related posts, and their URL returns 404.

export const SCHEDULED_POSTS: BlogPost[] = []
