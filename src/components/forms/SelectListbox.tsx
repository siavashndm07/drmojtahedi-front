"use client";

import { Fragment } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
  hint?: string;
  disabled?: boolean;
};

type SelectListboxProps<T extends string> = {
  id?: string;
  label?: string;
  value: T | "";
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  error?: string | null;
  className?: string;
};

/**
 * Pro single-select patterned after Bina SortControl / Combobox:
 * Headless UI Listbox, mint focus, check mark, optional hint lines.
 */
export function SelectListbox<T extends string>({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "انتخاب کنید",
  disabled,
  error,
  className,
}: SelectListboxProps<T>) {
  const selected = options.find((option) => option.value === value) ?? null;

  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      ) : null}

      <Listbox
        value={(value || null) as T | null}
        onChange={(next) => {
          if (next) onChange(next);
        }}
        disabled={disabled}
      >
        <div className={cn("relative", label && "mt-2")}>
          <ListboxButton
            id={id}
            className={cn(
              "group flex w-full items-center justify-between gap-2 rounded-xl border bg-paper px-4 py-3 text-start text-sm shadow-sm outline-none transition",
              "hover:border-pine/30 focus:border-pine focus:ring-2 focus:ring-pine/20",
              "disabled:cursor-not-allowed disabled:opacity-60",
              error
                ? "border-red-300 focus:border-red-400 focus:ring-red-200/60"
                : "border-ink/10",
            )}
          >
            <span className="min-w-0">
              {selected ? (
                <>
                  <span className="block font-medium text-ink">{selected.label}</span>
                  {selected.hint ? (
                    <span className="mt-0.5 block text-xs text-ink-muted">
                      {selected.hint}
                    </span>
                  ) : null}
                </>
              ) : (
                <span className="text-ink-muted">{placeholder}</span>
              )}
            </span>
            <ChevronDown
              className="size-4 shrink-0 text-ink-muted transition group-data-[open]:rotate-180"
              aria-hidden
            />
          </ListboxButton>

          <ListboxOptions
            transition
            anchor="bottom start"
            className="z-[80] mt-2 max-h-64 w-[var(--button-width)] origin-top overflow-auto rounded-2xl border border-ink/10 bg-surface p-1.5 shadow-card outline-none transition data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                as={Fragment}
              >
                {({ focus, selected: isSelected, disabled: optDisabled }) => (
                  <div
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 transition",
                      optDisabled && "cursor-not-allowed opacity-50",
                      !optDisabled &&
                        (focus || isSelected
                          ? "bg-mint-soft"
                          : "hover:bg-cream"),
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                        isSelected
                          ? "border-pine bg-pine text-white"
                          : "border-ink/20",
                      )}
                    >
                      {isSelected ? (
                        <Check className="size-3" aria-hidden />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-ink">
                        {option.label}
                      </span>
                      {option.hint ? (
                        <span className="mt-0.5 block text-xs text-ink-muted">
                          {option.hint}
                        </span>
                      ) : null}
                    </span>
                  </div>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>

      {error ? (
        <p id={id ? `${id}-error` : undefined} className="mt-2 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
