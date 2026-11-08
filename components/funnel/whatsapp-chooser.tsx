"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight, Building2, CalendarHeart, MessageCircle, X } from "lucide-react"
import { trackEvent, trackWhatsAppClick } from "@/lib/analytics"
import { useLocalization } from "@/lib/context/localization-context"
import { WA_OWNER_NUMBER } from "@/lib/funnel/config"
import { buildWhatsAppUrl, ownerWhatsAppMessage } from "@/lib/funnel/whatsapp"

type ChooserSource = Parameters<typeof trackWhatsAppClick>[0]["source"]

interface OpenOptions {
  source: ChooserSource
  context?: string
  /** Pre-filled message of the CTA that was clicked; used for the suggested line. */
  message?: string
  /** Which line the clicked CTA was originally meant for. */
  suggested?: "stay" | "owner"
}

/** In-stay concierge pages talk to the property's own desk: no purpose to choose. */
const DIRECT_PATHS = /^\/(id\/)?stay(\/|$)/
const WA_HREF = /^https:\/\/wa\.me\/(\d+)/

interface ChooserContextValue {
  open: (options: OpenOptions) => void
}

const ChooserContext = createContext<ChooserContextValue | null>(null)

/**
 * Opens the "who are you?" WhatsApp chooser. Outside the provider (e.g. an
 * isolated render) it degrades to a no-op so a CTA never throws.
 */
export function useWhatsAppChooser(): ChooserContextValue {
  return useContext(ChooserContext) ?? { open: () => {} }
}

/**
 * One modal for every ambiguous WhatsApp CTA. The visitor picks the purpose and
 * is sent to the matching line:
 *  - Guest (B2C): stay, venue, event, packages  → WHATSAPP_LINES.STAY
 *  - Owner (B2B): housekeeping / co-hosting / full management → WHATSAPP_LINES.OWNER
 * CTAs that already imply a purpose (villa booking, event and owner forms) carry
 * `data-wa-direct` and skip the modal.
 */
export function WhatsAppChooserProvider({ children }: { children: React.ReactNode }) {
  const { t, tc, language } = useLocalization()
  const [request, setRequest] = useState<OpenOptions | null>(null)

  const open = useCallback((options: OpenOptions) => {
    setRequest(options)
    trackEvent("whatsapp_chooser_open", {
      event_category: "Conversion",
      click_source: options.source,
      context: options.context,
    })
  }, [])
  const close = useCallback(() => setRequest(null), [])
  const value = useMemo(() => ({ open }), [open])

  const dialogRef = useRef<HTMLDivElement>(null)
  const isOpen = request !== null

  // Modal a11y: Esc closes, Tab stays inside, page behind does not scroll,
  // focus moves into the dialog and returns to the clicked CTA afterwards.
  useEffect(() => {
    if (!isOpen) return
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const focusables = () =>
      Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? [])
    focusables()[1]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close()
      if (e.key !== "Tab") return
      const items = focusables()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [isOpen, close])

  // Global treatment: every wa.me link on the public site opens this chooser first.
  // Capture phase + stopPropagation keeps the link's own tracking from double-counting
  // (the final pick is tracked below). Modified clicks (new tab) are left alone.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const anchor = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null
      // [data-wa-direct]: the CTA already states its purpose (owner form, villa
      // booking, event enquiry), so asking "guest or owner?" again only adds a step.
      if (!anchor || anchor.closest("[data-wa-chooser], [data-wa-direct]")) return
      const match = anchor.href.match(WA_HREF)
      if (!match || DIRECT_PATHS.test(window.location.pathname)) return
      e.preventDefault()
      e.stopPropagation()
      const message = new URL(anchor.href).searchParams.get("text") || undefined
      open({
        source: "chooser",
        context: window.location.pathname,
        message,
        suggested: match[1] === WA_OWNER_NUMBER ? "owner" : "stay",
      })
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [open])

  const choices = request
    ? [
        {
          funnel: "stay" as const,
          target: "STAY" as const,
          icon: CalendarHeart,
          title: tc("I'm a Guest"),
          text: tc("Book a villa, venue or event."),
          message: request.suggested === "stay" && request.message ? request.message : t("f.wa.general"),
        },
        {
          funnel: "owner" as const,
          target: "OWNER" as const,
          icon: Building2,
          title: tc("I'm a Property Owner"),
          text: tc("Housekeeping, co-hosting or full management."),
          message:
            request.suggested === "owner" && request.message
              ? request.message
              : ownerWhatsAppMessage({ service: "undecided" }, { t, language }),
        },
      ]
    : []

  return (
    <ChooserContext.Provider value={value}>
      {children}
      {request && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-[#191714]/70 backdrop-blur-sm animate-kh-fade sm:items-center sm:p-6"
          onClick={close}
        >
          <div
            ref={dialogRef}
            data-wa-chooser
            role="dialog"
            aria-modal="true"
            aria-labelledby="wa-chooser-title"
            aria-describedby="wa-chooser-desc"
            className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-[#FAF7F1] shadow-[0_30px_80px_-20px_rgba(25,23,20,0.6)] animate-kh-sheet sm:max-w-lg sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-[#231F1A] px-6 pb-7 pt-8 text-center sm:px-10">
              <span aria-hidden="true" className="absolute left-1/2 top-2.5 h-1 w-10 -translate-x-1/2 rounded-full bg-white/25 sm:hidden" />
              <button
                type="button"
                onClick={close}
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-[#CBBEA0] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFC58E]"
                aria-label={tc("Close")}
              >
                <X className="h-5 w-5" />
              </button>
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/15 ring-1 ring-[#25D366]/40">
                <MessageCircle className="h-6 w-6 text-[#25D366]" />
              </span>
              <h2 id="wa-chooser-title" className="mt-4 font-serif text-[2rem] leading-tight text-[#FAF7F1]">
                {tc("Chat on WhatsApp")}
              </h2>
              <p id="wa-chooser-desc" className="mt-1.5 text-base text-[#CBBEA0]">
                {tc("Who are you chatting as?")}
              </p>
            </div>

            <div className="space-y-3 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6">
              {choices.map((choice) => {
                const isSuggested = request.suggested === choice.funnel
                return (
                  <a
                    key={choice.funnel}
                    href={buildWhatsAppUrl(choice.target, choice.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackWhatsAppClick({
                        source: request.source,
                        funnel: choice.funnel,
                        context: `chooser_${choice.funnel}${request.context ? `:${request.context}` : ""}`,
                      })
                      close()
                    }}
                    className={`group flex min-h-[88px] items-center gap-4 rounded-2xl border-2 bg-white p-4 text-left transition-all hover:border-[#8C7F5F] hover:shadow-md focus-visible:border-[#8C7F5F] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7F5F]/20 sm:p-5 ${
                      isSuggested ? "border-[#8C7F5F]" : "border-[#E8E4DC]"
                    }`}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#231F1A] text-[#DFC58E]">
                      <choice.icon className="h-6 w-6" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-lg font-semibold leading-snug text-[#231F1A]">{choice.title}</span>
                        {isSuggested && (
                          <span className="rounded-full bg-[#EFE2CE] px-2.5 py-0.5 text-xs font-semibold text-[#6B4B2A]">
                            {tc("Suggested")}
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-base leading-snug text-[#5C5347]">{choice.text}</span>
                    </span>
                    <ArrowRight className="h-5 w-5 shrink-0 text-[#8C7F5F] transition-transform group-hover:translate-x-1" />
                  </a>
                )
              })}
              <p className="flex items-center justify-center gap-2 pt-2 text-sm text-[#5C5347]">
                <span className="h-2 w-2 rounded-full bg-[#25D366]" aria-hidden="true" />
                {tc("Usually replies within 15 minutes")}
              </p>
            </div>
          </div>
        </div>
      )}
    </ChooserContext.Provider>
  )
}
