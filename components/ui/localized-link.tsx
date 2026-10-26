"use client"

import NextLink from "next/link"
import type { ComponentProps } from "react"
import { useLocalization } from "@/lib/context/localization-context"

/** next/link that keeps visitors in their URL language (/villas → /id/villas on Indonesian pages). */
export default function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const { localizeHref } = useLocalization()
  return <NextLink href={typeof href === "string" ? localizeHref(href) : href} {...props} />
}
