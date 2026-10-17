"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type OptionPill<T extends string = string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
  hint?: string;
};

export function OptionPills<T extends string>({
  label,
  value,
  options,
  onChange,
  columns = "auto",
  error,
}: {
  label?: string;
  value: T | "";
  options: OptionPill<T>[];
  onChange: (value: T) => void;
  columns?: "auto" | 2 | 3;
  error?: string | null;
}) {
  return (
    <div className="space-y-2">
      {label ? <p className="text-sm font-medium text-ink">{label}</p> : null}
      <div
        className={cn(
          "grid gap-2",
          columns === 2 && "grid-cols-2",
          columns === 3 && "grid-cols-2 sm:grid-cols-3",
          columns === "auto" && "grid-cols-1 sm:grid-cols-2",
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
                  ? "border-pine bg-mint-soft/70 font-semibold text-pine shadow-sm"
                  : "border-ink/10 bg-paper text-ink-muted hover:border-pine/30 hover:bg-mint-soft/40 hover:text-ink",
              )}
            >
              {Icon ? (
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-xl",
                    active ? "bg-pine text-white" : "bg-cream text-ink-muted",
                  )}
                  aria-hidden
                >
                  <Icon className="size-4" />
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
        <p className="text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
