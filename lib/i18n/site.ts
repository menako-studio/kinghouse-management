// Locale-prefixed routing for the crawlable Indonesian site.
// English stays at the existing URLs; Indonesian lives under /id/… for the
// pages listed in ID_ROUTES. Safe to import from server and client code
// (the Indonesian dictionary lives in ./content so it never ships with English pages).

import type { Metadata } from "next"
import { SITE_CONFIG, DEFAULT_OG_IMAGES } from "@/lib/constants"

export type SiteLocale = "en" | "id"

export const ID_PREFIX = "/id"

/** English paths that have an Indonesian version at /id + path. */
const ID_ROUTES: (string | RegExp)[] = [
  "/",
  "/villas",
  "/owner-services",
  "/events",
  /^\/events\/[^/]+$/,
  /^\/locations\/[^/]+$/,
  /^\/locations\/[^/]+\/villas\/[^/]+$/,
  "/airbnb-cleaning-jakarta",
  "/about",
  "/contact",
  "/faq",
  "/management-inquiry",
]

function splitPath(href: string): [path: string, rest: string] {
  const i = href.search(/[?#]/)
  return i === -1 ? [href, ""] : [href.slice(0, i), href.slice(i)]
}

export function localeFromPath(pathname: string | null | undefined): SiteLocale {
  return pathname === ID_PREFIX || pathname?.startsWith(`${ID_PREFIX}/`) ? "id" : "en"
}

/** "/id/villas" → "/villas", "/id" → "/" */
export function stripLocale(pathname: string): string {
  if (localeFromPath(pathname) === "en") return pathname
  return pathname.slice(ID_PREFIX.length) || "/"
}

export function hasIdVersion(href: string): boolean {
  const [path] = splitPath(stripLocale(href))
  return ID_ROUTES.some((r) => (typeof r === "string" ? r === path : r.test(path)))
}

/** Internal link for the given locale; pages without an Indonesian version stay English. */
export function localizePath(href: string, locale: SiteLocale): string {
  if (!href.startsWith("/")) return href
  const english = stripLocale(href)
  if (locale === "en" || !hasIdVersion(english)) return english
  const [path, rest] = splitPath(english)
  return `${ID_PREFIX}${path === "/" ? "" : path}${rest}`
}

const absolute = (path: string) => `${SITE_CONFIG.baseUrl}${path === "/" ? "" : path}`

/** canonical + reciprocal hreflang for a page that exists in both languages. */
export function localeAlternates(englishPath: string, locale: SiteLocale): NonNullable<Metadata["alternates"]> {
  const en = absolute(englishPath)
  const id = absolute(localizePath(englishPath, "id"))
  return {
    canonical: locale === "id" ? id : en,
    languages: { en, id, "x-default": en },
  }
}

type OgImage = { url: string; width?: number; height?: number; alt?: string }

/** Full metadata for an Indonesian page: title, description, canonical + hreflang, Open Graph. */
export function idPageMetadata(opts: {
  path: string
  title: string
  description: string
  keywords?: string[]
  images?: OgImage[]
  type?: "website" | "article"
}): Metadata {
  const alternates = localeAlternates(opts.path, "id")
  const images = opts.images ?? DEFAULT_OG_IMAGES
  return {
    title: { absolute: opts.title },
    description: opts.description,
    keywords: opts.keywords,
    alternates,
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: alternates.canonical as string,
      type: opts.type ?? "website",
      locale: "id_ID",
      alternateLocale: ["en_US"],
      siteName: "Kinghouse Management",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: images.map((i) => i.url),
    },
  }
}
