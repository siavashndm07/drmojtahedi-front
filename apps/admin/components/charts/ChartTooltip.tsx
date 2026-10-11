"use client";

import { useCallback, useRef, useState, type MouseEvent } from "react";

export type ChartTipRow = {
  label: string;
  value: string;
  color?: string;
};

export type ChartTipState = {
  x: number;
  y: number;
  title?: string;
  rows: ChartTipRow[];
};

export function useChartTip() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<ChartTipState | null>(null);

  const show = useCallback(
    (event: MouseEvent, next: Omit<ChartTipState, "x" | "y">) => {
      const box = rootRef.current?.getBoundingClientRect();
      if (!box) return;
      setTip({
        x: event.clientX - box.left,
        y: event.clientY - box.top,
        ...next,
      });
    },
    [],
  );

  const hide = useCallback(() => setTip(null), []);

  return { rootRef, tip, show, hide };
}

export function ChartTip({ tip }: { tip: ChartTipState | null }) {
  if (!tip) return null;
  const flipDown = tip.y < 72;
  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-30 min-w-[10rem] max-w-[16rem] rounded-xl border border-ink/10 bg-surface/95 px-3 py-2 text-xs shadow-lg ring-1 ring-ink/5 backdrop-blur-md"
      style={{
        left: `clamp(5.5rem, ${tip.x}px, calc(100% - 5.5rem))`,
        top: tip.y,
        transform: flipDown
          ? "translate(-50%, 14px)"
          : "translate(-50%, calc(-100% - 12px))",
      }}
    >
      {tip.title ? (
        <p className="mb-1.5 font-semibold text-ink">{tip.title}</p>
      ) : null}
      <ul className="space-y-1">
        {tip.rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between gap-5"
          >
            <span className="inline-flex min-w-0 items-center gap-1.5 text-ink-muted">
              {row.color ? (
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: row.color }}
                />
              ) : null}
              <span className="truncate">{row.label}</span>
            </span>
            <span className="shrink-0 font-semibold tabular-nums text-ink">
              {row.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
