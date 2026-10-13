import { forwardRef, type TextareaHTMLAttributes } from "react";
import { controlClassName } from "./Input";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className = "", error = false, required: _required, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        {...props}
        required={false}
        aria-invalid={error || undefined}
        className={controlClassName(error, `min-h-[6rem] resize-y ${className}`)}
      />
    );
  },
);
