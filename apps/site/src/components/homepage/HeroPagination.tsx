"use client";

import { toPersianDigits } from "@/lib/utils/digits";

type HeroPaginationProps = {
  count: number;
  current: number;
  progress: number;
  onSelect: (index: number) => void;
};

export function HeroPagination({
  count,
  current,
  progress,
  onSelect,
}: HeroPaginationProps) {
  if (count <= 1) return null;

  return (
    <div
      className="flex items-center gap-2 rounded-full border border-white/15 bg-ink/35 px-3.5 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md backdrop-saturate-150"
      role="tablist"
      aria-label="اسلایدهای هیرو"
    >
      {Array.from({ length: count }, (_, idx) => {
        const isActive = idx === current;
        return (
          <button
            key={idx}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`رفتن به اسلاید ${toPersianDigits(idx + 1)}`}
            onClick={() => onSelect(idx)}
            className={
              isActive
                ? "relative h-2 w-9 overflow-hidden rounded-full bg-white/25 transition-all duration-300 sm:h-2.5 sm:w-10"
                : "h-2 w-2 rounded-full bg-white/40 transition-all duration-300 hover:bg-white/60 sm:h-2.5 sm:w-2.5"
            }
          >
            {isActive ? (
              <span
                className="absolute inset-y-0 start-0 rounded-full bg-white/90 transition-[width] duration-75 ease-linear"
                style={{ width: `${progress}%` }}
                aria-hidden
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
