"use client";

import { useState } from "react";
import { PieChart, type LucideIcon } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import ChartCard from "./ChartCard";
import { ChartTip, useChartTip } from "./ChartTooltip";
import { pointColor, type ChartPoint } from "@/lib/chartColors";
import { toPersianDigits } from "@/lib/digits";

const SIZE = 196;
const STROKE = 26;
const R = (SIZE - STROKE) / 2;
const C = SIZE / 2;
const CIRC = 2 * Math.PI * R;

function formatValue(value: number, valueFormatter?: (n: number) => string) {
  return valueFormatter ? valueFormatter(value) : value.toLocaleString("fa-IR");
}

export default function DonutChart({
  title,
  subtitle,
  icon,
  data,
  valueFormatter,
  emptyLabel = "داده‌ای نیست",
  centerLabel = "جمع",
  className,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  data: ChartPoint[];
  valueFormatter?: (value: number) => string;
  emptyLabel?: string;
  centerLabel?: string;
  className?: string;
}) {
  const { rootRef, tip, show, hide } = useChartTip();
  const [active, setActive] = useState<string | null>(null);
  const total = data.reduce((sum, point) => sum + point.value, 0);
  let cumulative = 0;
  const drawn = data.filter((point) => point.value > 0);
  const segments = drawn.map((point, index) => {
    const share = total > 0 ? point.value / total : 0;
    const length = share * CIRC;
    const segment = {
      ...point,
      color: pointColor(point, index),
      dasharray: `${length} ${CIRC - length}`,
      dashoffset: -cumulative,
      share,
    };
    cumulative += length;
    return segment;
  });
  const cap = segments.length === 1 ? "round" : "butt";
  const hovered = segments.find((item) => item.label === active);

  function tipFor(label: string, value: number, share: number, color: string) {
    return {
      title: label,
      rows: [
        {
          label: "مقدار",
          value: formatValue(value, valueFormatter),
          color,
        },
        { label: "سهم", value: `${toPersianDigits(Math.round(share * 100))}٪` },
      ],
    };
  }

  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      icon={icon}
      className={className}
    >
      {total <= 0 ? (
        <EmptyState
          bare
          compact
          icon={icon ?? PieChart}
          title={emptyLabel}
          description="با ثبت داده، سهم هر بخش اینجا دیده می‌شود."
        />
      ) : (
        <div
          ref={rootRef}
          className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center"
          onMouseLeave={() => {
            setActive(null);
            hide();
          }}
        >
          <div className="relative" style={{ width: SIZE, height: SIZE }}>
            <svg
              width={SIZE}
              height={SIZE}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="-rotate-90"
              role="img"
              aria-label={title}
            >
              <circle
                cx={C}
                cy={C}
                r={R}
                fill="none"
                stroke="currentColor"
                strokeWidth={STROKE}
                className="text-cream dark:text-cream/20"
              />
              {segments.map((segment) => {
                const isActive = active === segment.label;
                const dimmed = active != null && !isActive;
                return (
                  <circle
                    key={segment.label}
                    cx={C}
                    cy={C}
                    r={R}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth={isActive ? STROKE + 4 : STROKE}
                    strokeDasharray={segment.dasharray}
                    strokeDashoffset={segment.dashoffset}
                    strokeLinecap={cap}
                    className="cursor-pointer transition-[stroke-width,opacity] duration-150"
                    opacity={dimmed ? 0.28 : 1}
                    onMouseMove={(event) => {
                      setActive(segment.label);
                      show(
                        event,
                        tipFor(
                          segment.label,
                          segment.value,
                          segment.share,
                          segment.color,
                        ),
                      );
                    }}
                  />
                );
              })}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              {hovered ? (
                <>
                  <span className="line-clamp-1 text-[10px] text-ink-muted">
                    {hovered.label}
                  </span>
                  <span className="text-xl font-bold tabular-nums leading-none text-ink sm:text-2xl">
                    {formatValue(hovered.value, valueFormatter)}
                  </span>
                  <span className="mt-1 text-[10px] text-ink-muted">
                    {toPersianDigits(Math.round(hovered.share * 100))}٪
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[10px] text-ink-muted">{centerLabel}</span>
                  <span className="text-xl font-bold tabular-nums leading-none text-ink sm:text-2xl">
                    {formatValue(total, valueFormatter)}
                  </span>
                </>
              )}
            </div>
          </div>

          <ul className="w-full space-y-3 sm:max-w-[14rem]">
            {data.map((point, index) => {
              const share = total > 0 ? point.value / total : 0;
              const color = pointColor(point, index);
              const isActive = active === point.label;
              const dimmed = active != null && !isActive;
              return (
                <li
                  key={point.label}
                  className={`cursor-pointer rounded-lg px-1 py-0.5 transition ${
                    isActive ? "bg-cream/80 dark:bg-cream/20" : ""
                  } ${dimmed ? "opacity-45" : ""}`}
                  onMouseMove={(event) => {
                    setActive(point.label);
                    show(event, tipFor(point.label, point.value, share, color));
                  }}
                >
                  <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                    <span className="flex min-w-0 items-center gap-2 text-ink-muted">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="truncate">{point.label}</span>
                    </span>
                    <span className="shrink-0 font-medium tabular-nums text-ink">
                      {formatValue(point.value, valueFormatter)}
                      <span className="ms-1 text-[10px] font-normal text-ink-muted">
                        ({toPersianDigits(Math.round(share * 100))}٪)
                      </span>
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-cream dark:bg-cream/20">
                    <div
                      className="h-full rounded-full transition-[width]"
                      style={{
                        width: `${Math.max(share * 100, point.value > 0 ? 4 : 0)}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <ChartTip tip={tip} />
        </div>
      )}
    </ChartCard>
  );
}
