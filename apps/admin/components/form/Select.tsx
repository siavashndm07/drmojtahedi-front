import type { SelectHTMLAttributes } from "react";
import { inputClassName } from "./Input";

export function Select({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${inputClassName} ${className}`.trim()} {...props}>
      {children}
    </select>
  );
}
