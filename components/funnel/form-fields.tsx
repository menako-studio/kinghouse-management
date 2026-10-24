import * as React from "react"
import { cn } from "@/lib/utils"

export const selectClassName =
  "flex h-11 w-full rounded-lg border border-[#EBEBEB] bg-white px-3.5 py-2 text-sm text-[#222222] focus:border-[#222222] focus:outline-none cursor-pointer"

export const textareaClassName =
  "flex min-h-[88px] w-full rounded-lg border border-[#EBEBEB] bg-white px-3.5 py-2.5 text-sm text-[#222222] placeholder:text-[#999999] focus-visible:border-[#222222] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#222222]"

interface FieldProps {
  label: string
  htmlFor: string
  required?: boolean
  hint?: string
  className?: string
  children: React.ReactNode
}

export function Field({ label, htmlFor, required, hint, className, children }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-[11px] font-bold uppercase tracking-wider text-[#222222]">
        {label}
        {required && <span className="text-[#8C7F5F]"> *</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-[#717171]">{hint}</p>}
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
        "inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors",
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
    <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
      {message}
    </p>
  )
}
