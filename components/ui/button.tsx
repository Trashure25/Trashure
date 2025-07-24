import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-base font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-accent text-white hover:bg-[#04331f] shadow-md border-0",
        'invert-accent': "bg-white text-[#06402B] border border-[#06402B] hover:bg-[#06402B] hover:text-white",
        destructive:
          "bg-[#950606] text-white hover:bg-[#7a0505]",
        outline:
          "bg-white text-black border border-gray-300 hover:bg-accent/10 hover:text-black",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "bg-transparent text-black hover:bg-accent/10 hover:text-accent",
        link: "text-black underline-offset-4 hover:underline hover:text-accent",
      },
      size: {
        default: "h-12 px-6 py-2 text-base",
        sm: "h-10 px-4 py-2 text-sm",
        lg: "h-14 px-8 py-3 text-lg",
        icon: "h-12 w-12 p-0",
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
