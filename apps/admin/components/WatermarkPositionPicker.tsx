"use client";

import Image from "next/image";
import type { WatermarkPosition } from "@/lib/api/settings";

const POSITIONS: {
  id: WatermarkPosition;
  label: string;
  dotClass: string;
}[] = [
  { id: "top_left", label: "بالا چپ", dotClass: "top-3 start-3" },
  { id: "top_right", label: "بالا راست", dotClass: "top-3 end-3" },
  { id: "center", label: "وسط", dotClass: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" },
  { id: "bottom_left", label: "پایین چپ", dotClass: "bottom-3 start-3" },
  { id: "bottom_right", label: "پایین راست", dotClass: "bottom-3 end-3" },
];

type Props = {
  value: WatermarkPosition;
  onChange: (next: WatermarkPosition) => void;
  watermarkUrl?: string;
  opacity?: number;
};

export default function WatermarkPositionPicker({
  value,
  onChange,
  watermarkUrl,
  opacity = 0.35,
}: Props) {
  const activeLabel = POSITIONS.find((item) => item.id === value)?.label ?? value;
  const activeDotClass =
    POSITIONS.find((item) => item.id === value)?.dotClass ?? "bottom-3 end-3";

  return (
    <div className="space-y-3">
      <div
        className="relative aspect-[4/3] w-[12.5rem] max-w-full overflow-hidden rounded-xl border border-ink/15 bg-gradient-to-br from-blush via-cream to-mint-soft dark:from-mint/40 dark:to-surface"
        role="radiogroup"
        aria-label="موقعیت واترمارک"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(47_127_120/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(47_127_120/0.06)_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="absolute inset-x-4 top-1/2 h-px -translate-y-1/2 bg-ink/10" />
        <div className="absolute inset-y-4 left-1/2 w-px -translate-x-1/2 bg-ink/10" />

        {watermarkUrl ? (
          <div
            className={`pointer-events-none absolute h-7 w-7 ${activeDotClass}`}
            aria-hidden
          >
            <Image
              src={watermarkUrl}
              alt=""
              width={28}
              height={28}
              className="h-full w-full object-contain"
              style={{ opacity }}
              unoptimized
            />
          </div>
        ) : null}

        {POSITIONS.map((item) => {
          const selected = value === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={item.label}
              title={item.label}
              onClick={() => onChange(item.id)}
              className={`absolute flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${item.dotClass} ${
                selected
                  ? "border-pine bg-pine text-white shadow-md ring-2 ring-pine/25"
                  : "border-white/90 bg-white/90 text-ink-muted hover:border-pine/40 hover:bg-mint-soft hover:text-pine dark:border-surface/90 dark:bg-surface/90"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
            </button>
          );
        })}
      </div>
      <div className="flex max-w-[12.5rem] flex-wrap gap-1.5">
        {POSITIONS.map((item) => {
          const selected = value === item.id;
          return (
            <button
              key={`chip-${item.id}`}
              type="button"
              onClick={() => onChange(item.id)}
              className={`rounded-full px-3 py-1.5 text-xs transition ${
                selected
                  ? "bg-pine text-white"
                  : "bg-cream text-ink-muted hover:bg-mint-soft hover:text-ink dark:bg-mint/30"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
