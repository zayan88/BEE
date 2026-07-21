import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full rounded-[14px] border-2 border-[rgba(200,147,46,0.2)] bg-cream px-4 py-3.5 text-[15px] text-brown transition-all placeholder:text-brown-soft/60 focus:border-gold focus:bg-white focus:outline-none focus:ring-4 focus:ring-[rgba(200,147,46,0.12)] disabled:opacity-50 aria-[invalid=true]:border-brand-red aria-[invalid=true]:bg-[rgba(197,69,59,0.04)]",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
