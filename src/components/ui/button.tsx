import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-display font-extrabold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "btn-shine text-white shadow-[0_8px_24px_rgba(200,147,46,0.45)] bg-gradient-to-br from-honey via-gold to-gold-deep hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(200,147,46,0.55)]",
        secondary:
          "bg-white text-gold-deep border-2 border-gold shadow-sm hover:bg-gold hover:text-white hover:-translate-y-0.5",
        outline:
          "border-2 border-[rgba(200,147,46,0.35)] bg-transparent text-brown hover:bg-cream-deep",
        ghost: "bg-transparent text-brown hover:bg-cream-deep",
        destructive: "bg-brand-red text-white hover:opacity-90",
        link: "text-gold-deep underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-[54px] px-8 py-4 text-[17px]",
        sm: "min-h-[42px] px-5 py-2.5 text-sm",
        lg: "min-h-[64px] px-11 py-5 text-xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
