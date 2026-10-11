"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown, type LucideIcon } from "lucide-react";

export type SettingsListboxOption<T extends string> = {
  value: T;
  label: string;
  hint?: string;
  Icon?: LucideIcon;
};

export default function SettingsListbox<T extends string>({
  id,
  value,
  onChange,
  options,
  placeholder = "انتخاب کنید",
  disabled = false,
}: {
  id: string;
  value: T;
  onChange: (next: T) => void;
  options: SettingsListboxOption<T>[];
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((opt) => opt.value === value);
  const SelectedIcon = selected?.Icon;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-2 rounded-xl border border-ink/10 bg-surface px-3 py-2 text-sm text-ink transition hover:border-ink/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {SelectedIcon ? (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-mint-soft/80 text-mint-deep dark:bg-mint/40">
            <SelectedIcon className="h-4 w-4" aria-hidden />
          </span>
        ) : null}
        <span className="min-w-0 flex-1 truncate text-start">
          <span className="block font-medium">
            {selected?.label ?? (value || placeholder)}
          </span>
          {selected?.hint ? (
            <span className="mt-0.5 block text-[11px] text-ink-muted">
              {selected.hint}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={id}
          className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-ink/10 bg-surface p-1 shadow-lg"
        >
          {options.map((opt) => {
            const active = opt.value === value;
            const Icon = opt.Icon;
            return (
              <li key={opt.value} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm transition ${
                    active
                      ? "bg-mint-soft/80 text-mint-deep dark:bg-mint/40"
                      : "text-ink hover:bg-cream/70 dark:hover:bg-mint/20"
                  }`}
                >
                  {Icon ? (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cream/80 text-ink dark:bg-mint/30">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                  ) : null}
                  <OptionLabel label={opt.label} hint={opt.hint} />
                  {active ? (
                    <Check className="h-4 w-4 shrink-0 text-mint-deep" aria-hidden />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function OptionLabel({ label, hint }: { label: string; hint?: string }): ReactNode {
  return (
    <span className="min-w-0 flex-1 text-start">
      <span className="block font-medium">{label}</span>
      {hint ? (
        <span className="mt-0.5 block text-[11px] text-ink-muted">{hint}</span>
      ) : null}
    </span>
  );
}
