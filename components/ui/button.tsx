import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center text-center whitespace-normal sm:whitespace-nowrap rounded-md text-sm font-medium tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#222222] text-white hover:bg-black shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.14)]",
        secondary:
          "bg-[#FAFAFA] text-[#222222] border border-[#EBEBEB] hover:bg-[#F0EEEB] hover:border-[#DCD8D2]",
        outline:
          "border border-[#222222] text-[#222222] bg-transparent hover:bg-[#222222] hover:text-white",
        outlineLight:
          "border border-white/60 text-white bg-transparent hover:bg-white hover:text-[#222222] backdrop-blur-xs",
        ghost:
          "hover:bg-[#F5F5F5] text-[#222222]",
        link:
          "text-[#222222] underline-offset-4 hover:underline p-0 h-auto",
        accent:
          "bg-[#A69C8E] text-white hover:bg-[#8F8577]",
      },
      size: {
        default: "min-h-11 px-6 py-2.5",
        sm: "min-h-9 px-4 text-xs",
        lg: "min-h-13 px-8 py-3 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
