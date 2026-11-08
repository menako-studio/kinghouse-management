"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectOption {
  value: string
  label: React.ReactNode
  text: string
  disabled?: boolean
}

/** Minimal event shape so existing `onChange={(e) => set(e.target.value)}` handlers keep working. */
export interface SelectChangeEvent {
  target: { value: string; name?: string }
  currentTarget: { value: string; name?: string }
}

export interface SelectProps {
  value?: string | number
  defaultValue?: string | number
  onChange?: (event: SelectChangeEvent) => void
  onValueChange?: (value: string) => void
  /** `<option value="…">label</option>` elements, as with a native select. */
  children: React.ReactNode
  id?: string
  name?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
  /** Extra classes for the floating option list. */
  menuClassName?: string
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-describedby"?: string
  title?: string
}

function textOf(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join("")
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children)
  return ""
}

function readOptions(children: React.ReactNode): SelectOption[] {
  const options: SelectOption[] = []
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<{ value?: string | number; children?: React.ReactNode; disabled?: boolean }>(child)) return
    if (child.type === React.Fragment) {
      options.push(...readOptions(child.props.children))
      return
    }
    const label = child.props.children
    const text = textOf(label)
    options.push({ value: String(child.props.value ?? text), label, text, disabled: child.props.disabled })
  })
  return options
}

const MENU_GAP = 6
const MENU_MAX_HEIGHT = 320

/**
 * Brand dropdown replacing the browser's native <select>: same markup contract
 * (`<option>` children, `value`, `onChange(e.target.value)`), rendered as an
 * accessible listbox (WAI-ARIA combobox pattern) with large touch targets.
 * The option list is portalled with fixed positioning so cards with
 * `overflow: hidden` never clip it, and flips above the trigger near the
 * bottom of the screen.
 */
export function Select({
  value,
  defaultValue,
  onChange,
  onValueChange,
  children,
  id,
  name,
  required,
  disabled,
  placeholder,
  className,
  menuClassName,
  title,
  ...aria
}: SelectProps) {
  const options = React.useMemo(() => readOptions(children), [children])
  const isControlled = value !== undefined
  const [innerValue, setInnerValue] = React.useState(String(defaultValue ?? options[0]?.value ?? ""))
  const current = isControlled ? String(value) : innerValue
  const selectedIndex = options.findIndex((o) => o.value === current)
  const selected = options[selectedIndex]

  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const [position, setPosition] = React.useState<React.CSSProperties | null>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)
  const typeahead = React.useRef({ text: "", timer: 0 })
  const reactId = React.useId()
  const listId = `${id ?? reactId}-listbox`

  const commit = (option: SelectOption | undefined) => {
    if (!option || option.disabled) return
    let nextValue = option.value
    const target = {
      name,
      get value() {
        return nextValue
      },
      // Handlers that reset the field (e.target.value = "") still work.
      set value(v: string) {
        nextValue = v
        if (!isControlled) setInnerValue(v)
      },
    }
    if (!isControlled) setInnerValue(option.value)
    onChange?.({ target, currentTarget: target })
    onValueChange?.(option.value)
  }

  const place = React.useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const below = window.innerHeight - rect.bottom - MENU_GAP - 8
    const above = rect.top - MENU_GAP - 8
    const openUp = below < 200 && above > below
    const maxHeight = Math.max(160, Math.min(MENU_MAX_HEIGHT, openUp ? above : below))
    const width = Math.max(rect.width, 200)
    const left = Math.min(Math.max(8, rect.left), window.innerWidth - width - 8)
    setPosition({
      position: "fixed",
      left,
      width,
      maxHeight,
      ...(openUp ? { bottom: window.innerHeight - rect.top + MENU_GAP } : { top: rect.bottom + MENU_GAP }),
    })
  }, [])

  const openMenu = (index = selectedIndex) => {
    if (disabled) return
    place()
    setActiveIndex(index >= 0 ? index : options.findIndex((o) => !o.disabled))
    setOpen(true)
  }

  const closeMenu = (focusTrigger = true) => {
    setOpen(false)
    if (focusTrigger) triggerRef.current?.focus()
  }

  React.useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node
      if (triggerRef.current?.contains(t) || listRef.current?.contains(t)) return
      setOpen(false)
    }
    const onScroll = (e: Event) => {
      if (listRef.current?.contains(e.target as Node)) return
      place()
    }
    document.addEventListener("pointerdown", onPointer)
    window.addEventListener("resize", place)
    window.addEventListener("scroll", onScroll, true)
    return () => {
      document.removeEventListener("pointerdown", onPointer)
      window.removeEventListener("resize", place)
      window.removeEventListener("scroll", onScroll, true)
    }
  }, [open, place])

  // Keep the highlighted option in view while using the keyboard.
  React.useEffect(() => {
    if (!open || activeIndex < 0) return
    listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" })
  }, [open, activeIndex])

  const move = (from: number, step: 1 | -1) => {
    for (let i = 1; i <= options.length; i++) {
      const next = (from + step * i + options.length * 2) % options.length
      if (!options[next].disabled) return next
    }
    return from
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    const key = e.key
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(key)) {
        e.preventDefault()
        openMenu()
      }
      return
    }
    switch (key) {
      case "ArrowDown":
        e.preventDefault()
        setActiveIndex((i) => move(i, 1))
        return
      case "ArrowUp":
        e.preventDefault()
        setActiveIndex((i) => move(i, -1))
        return
      case "Home":
        e.preventDefault()
        setActiveIndex(move(-1, 1))
        return
      case "End":
        e.preventDefault()
        setActiveIndex(move(options.length, -1))
        return
      case "Enter":
      case " ":
        e.preventDefault()
        commit(options[activeIndex])
        closeMenu()
        return
      case "Escape":
        e.preventDefault()
        closeMenu()
        return
      case "Tab":
        setOpen(false)
        return
    }
    if (key.length === 1 && /\S/.test(key)) {
      const ta = typeahead.current
      window.clearTimeout(ta.timer)
      ta.text += key.toLowerCase()
      ta.timer = window.setTimeout(() => (ta.text = ""), 600)
      const match = options.findIndex((o) => !o.disabled && o.text.toLowerCase().trim().startsWith(ta.text))
      if (match >= 0) setActiveIndex(match)
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        aria-required={required || undefined}
        disabled={disabled}
        title={title}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onKeyDown}
        className={cn(
          "relative flex w-full items-center justify-between gap-2 text-left cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7F5F]/40",
          "disabled:cursor-not-allowed disabled:opacity-60",
          className,
          "appearance-none"
        )}
        {...aria}
      >
        <span className={cn("min-w-0 flex-1 truncate", !selected && "text-[#8A8275]")}>
          {selected ? selected.label : placeholder ?? "—"}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn("h-4 w-4 shrink-0 text-[#8C7F5F] transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {name && <input type="hidden" name={name} value={current} />}

      {open &&
        position &&
        createPortal(
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={aria["aria-labelledby"]}
            aria-label={aria["aria-labelledby"] ? undefined : aria["aria-label"] ?? (selected?.text || placeholder)}
            tabIndex={-1}
            style={position}
            className={cn(
              "z-[80] overflow-y-auto overscroll-contain rounded-xl border border-[#E8E4DC] bg-white p-1.5 font-sans text-base text-[#231F1A] shadow-[0_20px_40px_-12px_rgba(35,31,26,0.25)] animate-kh-pop",
              menuClassName
            )}
          >
            {options.map((option, index) => {
              const isSelected = index === selectedIndex
              return (
                <li
                  key={`${option.value}-${index}`}
                  id={`${listId}-${index}`}
                  data-index={index}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  onPointerEnter={() => !option.disabled && setActiveIndex(index)}
                  onClick={() => {
                    if (option.disabled) return
                    commit(option)
                    closeMenu()
                  }}
                  className={cn(
                    "flex min-h-11 cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-3 py-2.5 leading-snug",
                    index === activeIndex && "bg-[#FAF7F1]",
                    isSelected && "font-semibold text-[#6B4B2A]",
                    option.disabled && "cursor-not-allowed opacity-40"
                  )}
                >
                  <span className="min-w-0">{option.label}</span>
                  {isSelected && <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-[#8C7F5F]" />}
                </li>
              )
            })}
          </ul>,
          document.body
        )}
    </>
  )
}
