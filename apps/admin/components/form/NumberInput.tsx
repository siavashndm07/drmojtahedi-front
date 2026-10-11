"use client";

import { Minus, Plus } from "lucide-react";
import { toEnglishDigits, toPersianDigits } from "@/lib/digits";
import { inputClassName } from "./Input";

type NumberInputProps = {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  allowEmpty?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  placeholder?: string;
};

function clamp(value: number, min: number, max?: number) {
  let next = Math.max(min, value);
  if (max !== undefined) next = Math.min(max, next);
  return next;
}

function snapToStep(value: number, step: number) {
  if (step >= 1) return value;
  const snapped = Math.round(value / step) * step;
  const decimals = String(step).split(".")[1]?.length ?? 2;
  return Number(snapped.toFixed(decimals));
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  allowEmpty = false,
  disabled,
  id,
  className = "",
  placeholder,
}: NumberInputProps) {
  const current = value ?? min;
  const decimalStep = step % 1 !== 0;

  function apply(next: number) {
    onChange(clamp(decimalStep ? snapToStep(next, step) : next, min, max));
  }

  function stepBy(delta: number) {
    if (disabled) return;
    if (value === undefined && allowEmpty) {
      apply(min + delta * step);
      return;
    }
    apply(current + delta * step);
  }

  function handleInput(raw: string) {
    if (allowEmpty && raw.trim() === "") {
      onChange(undefined);
      return;
    }
    const normalized = toEnglishDigits(raw.trim());
    const parsed = decimalStep
      ? Number(normalized.replace(/[^\d.]/g, ""))
      : Number(normalized.replace(/[^\d]/g, ""));
    if (Number.isNaN(parsed)) return;
    apply(parsed);
  }

  const displayValue =
    allowEmpty && value === undefined
      ? ""
      : decimalStep
        ? toPersianDigits((value ?? min).toFixed(String(step).split(".")[1]?.length ?? 2))
        : toPersianDigits(value ?? min);

  const canDecrease = value !== undefined ? value > min + (decimalStep ? step / 2 : 0) : false;

  return (
    <div
      className={`flex w-full items-stretch overflow-hidden rounded-xl border border-ink/10 bg-cream/30 ${className}`.trim()}
    >
      <button
        type="button"
        disabled={disabled || !canDecrease}
        onClick={() => stepBy(-1)}
        className="inline-flex w-11 shrink-0 items-center justify-center text-ink-muted transition hover:bg-mint-soft/50 hover:text-pine disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="کاهش"
      >
        <Minus className="h-4 w-4" aria-hidden />
      </button>

      <input
        id={id}
        type="text"
        inputMode="numeric"
        disabled={disabled}
        value={displayValue}
        placeholder={placeholder}
        onChange={(e) => handleInput(e.target.value)}
        className={`${inputClassName} !rounded-none !border-0 !bg-transparent text-center tabular-nums focus:!ring-0`}
      />

      <button
        type="button"
        disabled={disabled || (max !== undefined && current >= max - (decimalStep ? step / 2 : 0))}
        onClick={() => stepBy(1)}
        className="inline-flex w-11 shrink-0 items-center justify-center text-ink-muted transition hover:bg-mint-soft/50 hover:text-pine disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="افزایش"
      >
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
