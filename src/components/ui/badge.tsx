import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
  {
    variants: {
      variant: {
        default: "bg-[rgba(229,167,40,0.12)] text-gold-deep",
        green: "bg-[rgba(74,124,89,0.12)] text-brand-green",
        red: "bg-[rgba(197,69,59,0.12)] text-brand-red",
        neutral: "bg-cream-deep text-brown-soft",
        blue: "bg-[rgba(59,130,246,0.12)] text-blue-700",
        purple: "bg-[rgba(147,51,234,0.12)] text-purple-700",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };
