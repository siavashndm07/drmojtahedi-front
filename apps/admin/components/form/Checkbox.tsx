"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
  description?: ReactNode;
  error?: string | null;
  variant?: "default" | "card";
};

export function Checkbox({
  label,
  description,
  className = "",
  checked,
  error,
  disabled,
  variant = "default",
  id,
  required: _required,
  ...rest
}: CheckboxProps) {
  const inputId = id ?? (typeof rest.name === "string" ? rest.name : undefined);
  const isCard = variant === "card";

  return (
    <div className={`flex flex-col gap-1 ${className}`.trim()}>
      <label
        htmlFor={inputId}
        className={`group relative inline-flex cursor-pointer gap-3 transition ${
          isCard
            ? `w-full items-start rounded-xl border px-3.5 py-3 ${
                error && !checked ? "border-red-400" : ""
              }`
            : "items-center"
        } ${
          isCard
            ? checked
              ? "border-pine/40 bg-mint-soft/80 dark:bg-mint"
              : error
                ? ""
                : "border-ink/10 bg-surface hover:border-pine/25"
            : ""
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          {...rest}
          required={false}
          className="peer sr-only"
          aria-invalid={!!error}
        />
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition peer-focus-visible:ring-2 peer-focus-visible:ring-pine/35 peer-focus-visible:ring-offset-2 ${
            checked
              ? "border-pine bg-pine text-white"
              : "border-ink/25 bg-surface"
          } ${isCard ? "mt-0.5" : ""} ${error && !checked ? "border-red-400" : ""}`}
          aria-hidden
        >
          <Check
            className={`h-3 w-3 transition ${
              checked ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          />
        </span>
        {label || description ? (
          <span className="min-w-0 flex-1">
            {label ? (
              <span className="block text-sm font-medium text-ink">{label}</span>
            ) : null}
            {description ? (
              <span className="mt-0.5 block text-xs leading-6 text-ink-muted">
                {description}
              </span>
            ) : null}
          </span>
        ) : null}
      </label>
      {error ? (
        <p className="text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
