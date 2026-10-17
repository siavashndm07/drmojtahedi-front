"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type OptionPill<T extends string = string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
  hint?: string;
};

export default function OptionPills<T extends string>({
  label,
  value,
  options,
  onChange,
  columns: _columns = "auto",
  error,
  className,
}: {
  label?: string;
  value: T;
  options: OptionPill<T>[];
  onChange: (value: T) => void;
  /** Kept for callers; pills always sit together as one row. */
  columns?: "auto" | 2 | 3;
  error?: string | null;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <p className="text-sm font-medium text-ink">{label}</p>
      ) : null}
      <div
        className={cn(
          "flex flex-wrap gap-2",
          error && "rounded-2xl ring-2 ring-red-400/70",
        )}
        role="radiogroup"
        aria-label={label}
        aria-invalid={error ? true : undefined}
      >
        {options.map((option) => {
          const active = option.value === value;
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-start text-sm transition",
                active
                  ? "border-pine bg-mint-soft font-semibold text-pine shadow-sm dark:bg-mint"
                  : "border-ink/10 bg-surface text-ink-muted hover:border-pine/30 hover:bg-mint-soft/40 hover:text-ink",
              )}
            >
              {Icon ? (
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    active
                      ? "bg-pine text-white"
                      : "bg-cream text-ink-muted dark:bg-ink/10",
                  )}
                  aria-hidden
                >
                  <Icon className="h-4 w-4" />
                </span>
              ) : null}
              <span className="min-w-0">
                <span className="block leading-5">{option.label}</span>
                {option.hint ? (
                  <span className="mt-0.5 block text-[11px] font-normal text-ink-muted">
                    {option.hint}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
      {error ? (
        <p className="flex items-start gap-1.5 text-xs font-medium text-red-600 dark:text-red-400" role="alert">
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
