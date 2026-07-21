import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[90px] w-full resize-y rounded-[14px] border-2 border-[rgba(200,147,46,0.2)] bg-cream px-4 py-3.5 text-[15px] text-brown transition-all placeholder:text-brown-soft/60 focus:border-gold focus:bg-white focus:outline-none focus:ring-4 focus:ring-[rgba(200,147,46,0.12)] aria-[invalid=true]:border-brand-red",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
