"use client";

import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import { toEnglishDigits, toPersianDigits } from "@/lib/digits";

export const inputClassName =
  "w-full rounded-xl border border-ink/10 bg-cream/30 px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-muted/70 focus:border-pine/40 focus:ring-2 focus:ring-mint-soft disabled:cursor-not-allowed disabled:opacity-60 dark:bg-surface/80";

export const inputErrorClassName =
  "border-red-500 bg-red-50/50 focus:border-red-500 focus:ring-red-200 dark:border-red-500/80 dark:bg-red-950/20 dark:focus:ring-red-900/40";

export function controlClassName(error?: boolean, className = "") {
  return `${inputClassName} ${error ? inputErrorClassName : ""} ${className}`.trim();
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
  persianDigits?: boolean;
  /** Red border when validation failed */
  error?: boolean;
};

export function Input({
  className = "",
  icon,
  persianDigits = false,
  error = false,
  value,
  defaultValue,
  onChange,
  required: _required,
  ...props
}: InputProps) {
  const displayValue =
    persianDigits && value != null ? toPersianDigits(String(value)) : value;
  const displayDefault =
    persianDigits && defaultValue != null
      ? toPersianDigits(String(defaultValue))
      : defaultValue;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (!onChange) return;
    if (!persianDigits) {
      onChange(e);
      return;
    }
    const next = toEnglishDigits(e.target.value);
    onChange({
      ...e,
      target: { ...e.target, value: next },
      currentTarget: { ...e.currentTarget, value: next },
    } as ChangeEvent<HTMLInputElement>);
  }

  const input = (
    <input
      {...props}
      required={false}
      aria-invalid={error || undefined}
      className={controlClassName(error, `${icon ? "pr-10" : ""} ${className}`)}
      value={displayValue}
      defaultValue={displayDefault}
      onChange={handleChange}
    />
  );

  if (!icon) return input;

  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-ink-muted">
        {icon}
      </span>
      {input}
    </div>
  );
}
