import type { SelectHTMLAttributes } from "react";
import { controlClassName } from "./Input";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: boolean;
};

export function Select({
  className = "",
  children,
  error = false,
  required: _required,
  ...props
}: SelectProps) {
  return (
    <select
      {...props}
      required={false}
      aria-invalid={error || undefined}
      className={controlClassName(error, className)}
    >
      {children}
    </select>
  );
}
