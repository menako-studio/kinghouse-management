"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { Building2, CalendarHeart, MessageCircle, X } from "lucide-react"
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
 * CTAs that already imply a purpose (villa, event, owner pages) skip the modal.
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

  useEffect(() => {
    if (!request) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close()
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [request, close])

  // Global treatment: every wa.me link on the public site opens this chooser first.
  // Capture phase + stopPropagation keeps the link's own tracking from double-counting
  // (the final pick is tracked below). Modified clicks (new tab) are left alone.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const anchor = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null
      if (!anchor || anchor.closest("[data-wa-chooser]")) return
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
          title: tc("Stay, Venue & Events"),
          text: tc("Check a villa, venue or package, book a stay or plan an event."),
          message: request?.suggested === "stay" && request.message ? request.message : t("f.wa.general"),
        },
        {
          funnel: "owner" as const,
          target: "OWNER" as const,
          icon: Building2,
          title: tc("I'm a Property Owner"),
          text: tc("Housekeeping on demand, co-hosting or full management for my property."),
          message:
            request?.suggested === "owner" && request.message
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
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={close}
        >
          <div
            data-wa-chooser
            role="dialog"
            aria-modal="true"
            aria-labelledby="wa-chooser-title"
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#E8E2D6] bg-white shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-[#2D2118] px-6 py-5 text-center text-white">
              <button
                type="button"
                onClick={close}
                className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label={tc("Close")}
              >
                <X className="h-5 w-5" />
              </button>
              <MessageCircle className="mx-auto mb-2 h-6 w-6 text-[#25D366]" />
              <h2 id="wa-chooser-title" className="text-sm font-semibold uppercase tracking-[0.18em]">
                {tc("Chat with Kinghouse")}
              </h2>
              <p className="mt-1 text-xs font-light text-white/80">{tc("What can we help you with?")}</p>
            </div>

            <div className="space-y-3 p-5">
              {choices.map((choice) => (
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
                  className="flex items-start gap-3 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] p-4 transition-all hover:border-[#8C7F5F] hover:bg-[#F7F1E6]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2D2118] text-[#D8B486]">
                    <choice.icon className="h-5 w-5" />
                  </span>
                  <span className="text-left">
                    <span className="block text-sm font-semibold text-[#222222]">
                      {choice.title}
                      {request.suggested === choice.funnel && (
                        <span className="ml-2 rounded-full bg-[#F2ECE1] px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wider text-[#8C7F5F]">
                          {tc("Suggested")}
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-xs font-light leading-relaxed text-[#5C5347]">{choice.text}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </ChooserContext.Provider>
  )
}
