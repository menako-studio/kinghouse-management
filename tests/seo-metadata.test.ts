import { describe, it, expect } from "vitest"
import { VILLA_EVENTS } from "@/lib/data"
import { BLOG_POSTS } from "@/lib/blog/posts"

// Google truncates titles past ~60 characters in results.
const MAX_TITLE = 61

describe("SEO metadata", () => {
  it("keeps event titles short and location-focused", () => {
    for (const e of VILLA_EVENTS) {
      expect(e.seoTitle, e.slug).toBeTruthy()
      expect(e.seoTitle!.length, e.slug).toBeLessThanOrEqual(MAX_TITLE)
      expect(e.seoTitle, e.slug).toMatch(/Jakarta Selatan|Jagakarsa/)
    }
  })

  it("keeps custom blog titles within the visible length", () => {
    for (const p of BLOG_POSTS) {
      if (p.seoTitle) expect(p.seoTitle.length, p.slug).toBeLessThanOrEqual(MAX_TITLE)
    }
  })

  it("marks English articles so Google gets the right language signal", () => {
    const english = BLOG_POSTS.filter((p) => p.language === "en").map((p) => p.slug)
    expect(english).toContain("airbnb-villa-property-management-jakarta-owner-guide")
  })
})
