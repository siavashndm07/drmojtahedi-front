"use client";

import type { LucideIcon } from "lucide-react";
import { toPersianDigits } from "@/lib/digits";
import { cn } from "@/lib/cn";

type FilterPillsProps<T extends string> = {
  label?: string;
  value: T;
  options: {
    value: T;
    label: string;
    count?: number;
    icon?: LucideIcon;
  }[];
  onChange: (value: T) => void;
};

export default function FilterPills<T extends string>({
  label,
  value,
  options,
  onChange,
}: FilterPillsProps<T>) {
  return (
    <div className="space-y-2">
      {label ? (
        <p className="text-xs font-medium text-ink-muted">{label}</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value;
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                active
                  ? "border-pine bg-pine text-white shadow-sm"
                  : "border-ink/10 bg-surface text-ink-muted hover:border-pine/30 hover:bg-mint-soft/40 hover:text-ink",
              )}
              aria-pressed={active}
            >
              {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
              {option.label}
              {option.count !== undefined ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
                    active ? "bg-white/20" : "bg-cream text-ink-muted",
                  )}
                >
                  {toPersianDigits(option.count)}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
