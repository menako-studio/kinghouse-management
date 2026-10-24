import * as React from "react"
import { cn } from "@/lib/utils"

export const selectClassName =
  "flex h-12 w-full rounded-lg border border-[#D9D3C7] bg-white px-3.5 py-2 text-base text-[#222222] focus:border-[#222222] focus:outline-none cursor-pointer"

export const textareaClassName =
  "flex min-h-[96px] w-full rounded-lg border border-[#D9D3C7] bg-white px-3.5 py-2.5 text-base text-[#222222] placeholder:text-[#999999] focus-visible:border-[#222222] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#222222]"

interface FieldProps {
  label: string
  /** id of the input this label belongs to; omit for a group of chips (renders a fieldset) */
  htmlFor?: string
  required?: boolean
  hint?: string
  className?: string
  children: React.ReactNode
}

export function Field({ label, htmlFor, required, hint, className, children }: FieldProps) {
  const text = (
    <>
      {label}
      {required && <span className="text-[#8C7F5F]"> *</span>}
    </>
  )
  const labelClass = "block text-sm font-semibold text-[#222222]"
  const hintEl = hint && <p className="text-sm text-[#5C5347]">{hint}</p>

  if (!htmlFor) {
    return (
      <fieldset className={cn("space-y-1.5", className)}>
        <legend className={cn(labelClass, "mb-1.5")}>{text}</legend>
        {children}
        {hintEl}
      </fieldset>
    )
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className={labelClass}>
        {text}
      </label>
      {children}
      {hintEl}
    </div>
  )
}

interface ChoiceChipProps {
  checked: boolean
  onChange: () => void
  label: string
  type?: "checkbox" | "radio"
  name?: string
}

/** Pill-style checkbox / radio used for yes-no and multi-select questions. */
export function ChoiceChip({ checked, onChange, label, type = "checkbox", name }: ChoiceChipProps) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
        "focus-within:ring-2 focus-within:ring-[#8C7F5F]/40",
        checked
          ? "border-[#8C7F5F] bg-[#8C7F5F] text-white"
          : "border-[#E8E4DC] bg-white text-[#222222] hover:border-[#8C7F5F]"
      )}
    >
      <input type={type} name={name} checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
  )
}

/** Hidden honeypot input — bots fill it, people never see it. */
export function HoneypotField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  )
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
      {message}
    </p>
  )
}
