import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[#222222] text-white",
        secondary:
          "bg-[#F5F5F5] text-[#222222] border border-[#EBEBEB]",
        outline:
          "border border-[#EBEBEB] text-[#717171] bg-white",
        superhost:
          "bg-white/95 text-[#222222] border border-[#EBEBEB] shadow-xs backdrop-blur-sm",
        accent:
          "bg-[#A69C8E]/15 text-[#6D6356] border border-[#A69C8E]/30",
        dark:
          "bg-black text-white border border-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
