"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocalization } from "@/lib/context/localization-context"

/** Same shape as Select's change event, so `onChange={(e) => set(e.target.value)}` keeps working. */
export interface DateChangeEvent {
  target: { value: string; name?: string }
  currentTarget: { value: string; name?: string }
}

export interface DatePickerProps {
  /** ISO date `YYYY-MM-DD`, or "" when empty (same contract as <input type="date">). */
  value?: string
  onChange?: (event: DateChangeEvent) => void
  onValueChange?: (value: string) => void
  min?: string
  max?: string
  id?: string
  name?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
  /** Hide the calendar icon inside the trigger (when the field already shows one). */
  hideIcon?: boolean
  "aria-label"?: string
  "aria-labelledby"?: string
  title?: string
}

const pad = (n: number) => String(n).padStart(2, "0")
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
function fromIso(iso?: string): Date | null {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}
/** Today in the visitor's timezone as `YYYY-MM-DD` (for `min`). */
export const todayIso = () => toIso(new Date())
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)

const POPOVER_WIDTH = 320
const POPOVER_HEIGHT = 400

/**
 * Brand date picker replacing the browser's native date input: a month grid
 * with large (44px) day buttons, Monday-first weeks, localized month names,
 * keyboard support (arrows, PageUp/PageDown, Home/End, Enter, Esc) and
 * min/max limits. Value format is ISO `YYYY-MM-DD`, like the native input.
 */
export function DatePicker({
  value = "",
  onChange,
  onValueChange,
  min,
  max,
  id,
  name,
  required,
  disabled,
  placeholder,
  className,
  hideIcon,
  title,
  ...aria
}: DatePickerProps) {
  const { language } = useLocalization()
  const isId = language === "ID"
  const locale = isId ? "id-ID" : "en-GB"
  const selected = fromIso(value)
  const minDate = fromIso(min)
  const maxDate = fromIso(max)

  const [open, setOpen] = React.useState(false)
  const [focusDate, setFocusDate] = React.useState<Date>(() => selected ?? minDate ?? new Date())
  const [position, setPosition] = React.useState<React.CSSProperties | null>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const popRef = React.useRef<HTMLDivElement>(null)
  const reactId = React.useId()
  const dialogId = `${id ?? reactId}-calendar`

  const isDisabledDay = (d: Date) =>
    (minDate !== null && d < minDate) || (maxDate !== null && d > maxDate)

  const commit = (iso: string) => {
    const target = { value: iso, name }
    onChange?.({ target, currentTarget: target })
    onValueChange?.(iso)
  }

  const place = React.useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    const width = Math.min(POPOVER_WIDTH, window.innerWidth - 16)
    const left = Math.min(Math.max(8, rect.left), window.innerWidth - width - 8)
    const below = window.innerHeight - rect.bottom
    const openUp = below < POPOVER_HEIGHT && rect.top > below
    setPosition({
      position: "fixed",
      left,
      width,
      ...(openUp ? { bottom: window.innerHeight - rect.top + 6 } : { top: rect.bottom + 6 }),
    })
  }, [])

  const openPicker = () => {
    if (disabled) return
    setFocusDate(selected ?? (minDate && minDate > new Date() ? minDate : new Date()))
    place()
    setOpen(true)
  }

  const close = (focusTrigger = true) => {
    setOpen(false)
    if (focusTrigger) triggerRef.current?.focus()
  }

  React.useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node
      if (triggerRef.current?.contains(t) || popRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener("pointerdown", onPointer)
    window.addEventListener("resize", place)
    window.addEventListener("scroll", place, true)
    return () => {
      document.removeEventListener("pointerdown", onPointer)
      window.removeEventListener("resize", place)
      window.removeEventListener("scroll", place, true)
    }
  }, [open, place])

  // Keep DOM focus on the highlighted day while the calendar is open.
  React.useEffect(() => {
    if (!open) return
    popRef.current?.querySelector<HTMLButtonElement>(`[data-day="${toIso(focusDate)}"]`)?.focus()
  }, [open, focusDate])

  const onGridKey = (e: React.KeyboardEvent) => {
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focusDate, -1),
      ArrowRight: () => addDays(focusDate, 1),
      ArrowUp: () => addDays(focusDate, -7),
      ArrowDown: () => addDays(focusDate, 7),
      PageUp: () => new Date(focusDate.getFullYear(), focusDate.getMonth() - 1, focusDate.getDate()),
      PageDown: () => new Date(focusDate.getFullYear(), focusDate.getMonth() + 1, focusDate.getDate()),
      Home: () => addDays(focusDate, -((focusDate.getDay() + 6) % 7)),
      End: () => addDays(focusDate, 6 - ((focusDate.getDay() + 6) % 7)),
    }
    if (moves[e.key]) {
      e.preventDefault()
      setFocusDate(moves[e.key]())
    } else if (e.key === "Escape") {
      e.preventDefault()
      close()
    }
  }

  // Month grid: Monday-first, padded with the neighbouring months' days.
  const monthStart = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1)
  const gridStart = addDays(monthStart, -((monthStart.getDay() + 6) % 7))
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
  const weekdayNames = Array.from({ length: 7 }, (_, i) =>
    addDays(new Date(2024, 0, 1), i).toLocaleDateString(locale, { weekday: "short" })
  )
  const todayIso = toIso(new Date())
  const prevDisabled = minDate !== null && addMonths(monthStart, 0) <= new Date(minDate.getFullYear(), minDate.getMonth(), 1)
  const nextDisabled = maxDate !== null && addMonths(monthStart, 1) > maxDate

  const label = selected
    ? selected.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })
    : placeholder ?? (isId ? "Pilih tanggal" : "Select date")

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        disabled={disabled}
        title={title}
        onClick={() => (open ? close() : openPicker())}
        onKeyDown={(e) => {
          if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
            e.preventDefault()
            openPicker()
          }
        }}
        className={cn(
          "flex w-full items-center gap-2 text-left cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7F5F]/40",
          "disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
        {...aria}
      >
        {!hideIcon && <Calendar className="h-4 w-4 shrink-0 text-[#8C7F5F]" aria-hidden="true" />}
        <span className={cn("min-w-0 flex-1 truncate", !selected && "text-[#8A8275]")}>{label}</span>
      </button>
      {name && <input type="hidden" name={name} value={value} />}

      {open &&
        position &&
        createPortal(
          <div
            ref={popRef}
            id={dialogId}
            role="dialog"
            aria-modal="false"
            aria-label={aria["aria-label"] ?? (isId ? "Pilih tanggal" : "Choose a date")}
            style={position}
            className="z-[80] rounded-2xl border border-[#E8E4DC] bg-white p-3 font-sans text-[#231F1A] shadow-[0_20px_40px_-12px_rgba(35,31,26,0.25)] animate-kh-pop"
          >
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setFocusDate(addMonths(monthStart, -1))}
                disabled={prevDisabled}
                aria-label={isId ? "Bulan sebelumnya" : "Previous month"}
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-[#FAF7F1] disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-base font-semibold" aria-live="polite">
                {monthStart.toLocaleDateString(locale, { month: "long", year: "numeric" })}
              </span>
              <button
                type="button"
                onClick={() => setFocusDate(addMonths(monthStart, 1))}
                disabled={nextDisabled}
                aria-label={isId ? "Bulan berikutnya" : "Next month"}
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-[#FAF7F1] disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div role="grid" onKeyDown={onGridKey} className="grid grid-cols-7 gap-0.5 text-center">
              {weekdayNames.map((w) => (
                <span key={w} role="columnheader" className="py-1 text-xs font-semibold uppercase text-[#8A8275]">
                  {w}
                </span>
              ))}
              {days.map((d) => {
                const iso = toIso(d)
                const inMonth = d.getMonth() === monthStart.getMonth()
                const isSelected = iso === value
                const isFocus = iso === toIso(focusDate)
                const off = isDisabledDay(d)
                return (
                  <button
                    key={iso}
                    type="button"
                    role="gridcell"
                    data-day={iso}
                    tabIndex={isFocus ? 0 : -1}
                    disabled={off}
                    aria-selected={isSelected}
                    aria-label={d.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    onClick={() => {
                      commit(iso)
                      close()
                    }}
                    className={cn(
                      "flex h-11 items-center justify-center rounded-full text-base transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7F5F]",
                      inMonth ? "text-[#231F1A]" : "text-[#B5AD9F]",
                      !isSelected && !off && "hover:bg-[#FAF7F1]",
                      iso === todayIso && !isSelected && "font-semibold underline decoration-[#B8934C] underline-offset-4",
                      isSelected && "bg-[#231F1A] font-semibold text-white",
                      off && "cursor-not-allowed text-[#D5CFC3] line-through"
                    )}
                  >
                    {d.getDate()}
                  </button>
                )
              })}
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-[#E8E4DC] pt-2 text-sm">
              {!required && value ? (
                <button
                  type="button"
                  onClick={() => {
                    commit("")
                    close()
                  }}
                  className="min-h-10 rounded-full px-3 font-medium text-[#5C5347] hover:bg-[#FAF7F1]"
                >
                  {isId ? "Hapus" : "Clear"}
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                disabled={isDisabledDay(fromIso(todayIso)!)}
                onClick={() => {
                  commit(todayIso)
                  close()
                }}
                className="min-h-10 rounded-full px-3 font-semibold text-[#6B4B2A] hover:bg-[#FAF7F1] disabled:opacity-30"
              >
                {isId ? "Hari ini" : "Today"}
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
