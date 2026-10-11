import { forwardRef, type TextareaHTMLAttributes } from "react";
import { inputClassName } from "./Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className = "", ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={`${inputClassName} min-h-[6rem] resize-y ${className}`.trim()}
      {...props}
    />
  );
});
