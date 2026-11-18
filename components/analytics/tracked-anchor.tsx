"use client"

import { trackOwnerCtaClick } from "@/lib/analytics"

/** Plain anchor that reports an owner-CTA click to GA4/GTM (usable from server components). */
export function OwnerCtaAnchor({
  location,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { location: string }) {
  return <a {...props} onClick={() => trackOwnerCtaClick({ location })} />
}
