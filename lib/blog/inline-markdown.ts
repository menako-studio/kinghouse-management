/**
 * Inline markdown (**bold** and [text](url)) for blog paragraphs rendered with
 * dangerouslySetInnerHTML. Article content comes from the CMS / database, so it
 * is treated as untrusted: HTML is escaped first, and links are only emitted
 * for http(s), mailto:, tel:, site-relative and #anchor targets — never
 * javascript:, data: or other schemes.
 */

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch])
}

/** Returns the href when it is safe to put in a link, otherwise null. Input is already HTML-escaped. */
export function safeHref(rawHref: string): string | null {
  const href = rawHref.trim()
  if (!href) return null
  // Site-relative ("/path", not protocol-relative "//host") or in-page anchor.
  if ((href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/\\")) || href.startsWith("#")) {
    return href
  }
  if (/^(https?:\/\/|mailto:|tel:)/i.test(href)) return href
  return null
}

export function formatInlineMarkdown(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, "<strong class='text-[#222222] font-semibold'>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, label: string, href: string) => {
      const safe = safeHref(href)
      if (!safe) return label
      const external = /^https?:\/\//i.test(safe)
      const rel = external ? " target='_blank' rel='noopener noreferrer nofollow'" : ""
      return `<a href='${safe}' class='text-[#B8934C] hover:underline font-semibold'${rel}>${label}</a>`
    })
}
