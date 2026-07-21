import * as React from "react";
import { cn } from "@/lib/utils";

// Native select styled to match the design system. Keeps the order form robust
// and fully accessible on mobile without extra JS.
export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full appearance-none rounded-[14px] border-2 border-[rgba(200,147,46,0.2)] bg-cream bg-[length:16px] bg-[left_1rem_center] bg-no-repeat px-4 py-3.5 text-[15px] text-brown transition-all focus:border-gold focus:bg-white focus:outline-none focus:ring-4 focus:ring-[rgba(200,147,46,0.12)] aria-[invalid=true]:border-brand-red",
          className,
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235B4636' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
        }}
        {...props}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = "Select";

export { Select };
