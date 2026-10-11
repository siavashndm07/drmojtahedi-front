"use client";

import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import { toEnglishDigits, toPersianDigits } from "@/lib/digits";

export const inputClassName =
  "w-full rounded-xl border border-ink/10 bg-cream/30 px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-muted/70 focus:border-pine/40 focus:ring-2 focus:ring-mint-soft disabled:cursor-not-allowed disabled:opacity-60 dark:bg-surface/80";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
  persianDigits?: boolean;
};

export function Input({
  className = "",
  icon,
  persianDigits = false,
  value,
  defaultValue,
  onChange,
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
      className={`${inputClassName} ${icon ? "pr-10" : ""} ${className}`.trim()}
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
