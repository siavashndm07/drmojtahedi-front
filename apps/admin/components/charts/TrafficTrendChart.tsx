"use client";

import { useLayoutEffect, useMemo, useState, type MouseEvent } from "react";
import type { ChartPoint } from "@/lib/dashboardCharts";
import type { TrafficRangeDays } from "@/lib/api/resources";
import { CHART_GRID_COLOR, chartBarFill } from "@/lib/chartColors";
import { toPersianDigits } from "@/lib/digits";
import { ChartTip, useChartTip } from "./ChartTooltip";

const MIN_HEIGHT = 160;
const PAD = { top: 28, right: 8, bottom: 32, left: 8 };
const GROUP_OUTER_GAP = 8;
const MIN_BAR_HEIGHT = 4;
const VALUE_FONT_SIZE = 13;
const LABEL_FONT_SIZE = 12;

const BAR_COLOR = "#0284c7";

function formatValue(value: number) {
  return value.toLocaleString("fa-IR");
}

function rangeTitle(days: TrafficRangeDays) {
  return `بازدید روزانه · ${toPersianDigits(days)} روز`;
}

export default function TrafficTrendChart({
  pageviews,
  rangeDays = 7,
  loading = false,
  emptyLabel = "بازدیدی ثبت نشده",
  className = "",
}: {
  pageviews: ChartPoint[];
  rangeDays?: TrafficRangeDays;
  loading?: boolean;
  emptyLabel?: string;
  className?: string;
}) {
  const { rootRef, tip, show, hide } = useChartTip();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [active, setActive] = useState<number | null>(null);

  const max = Math.max(...pageviews.map((p) => p.value), 1);
  const hasData = pageviews.some((p) => p.value > 0);
  const total = pageviews.reduce((sum, p) => sum + p.value, 0);
  const showValueLabels = pageviews.length <= 14;

  useLayoutEffect(() => {
    const node = rootRef.current;
    if (!node || !hasData || loading) return;

    const sync = () => {
      setSize({
        width: node.clientWidth,
        height: Math.max(node.clientHeight, MIN_HEIGHT),
      });
    };
    sync();

    const observer = new ResizeObserver(sync);
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasData, loading, pageviews.length, rootRef]);

  const chartWidth = Math.max(size.width, 1);
  const chartHeight = Math.max(size.height, MIN_HEIGHT);

  const geometry = useMemo(() => {
    const count = pageviews.length;
    const innerW = chartWidth - PAD.left - PAD.right;
    const innerH = chartHeight - PAD.top - PAD.bottom;
    const groupWidth =
      count > 0
        ? (innerW - GROUP_OUTER_GAP * Math.max(count - 1, 0)) / count
        : innerW;
    const barWidth = Math.max(6, Math.min(48, groupWidth * 0.62));
    const labelStep = count <= 10 ? 1 : count <= 20 ? 2 : 5;

    const barHeight = (value: number) => {
      if (value <= 0) return 0;
      return Math.max(MIN_BAR_HEIGHT, (value / max) * innerH);
    };

    const groups = pageviews.map((point, index) => {
      const groupX = PAD.left + index * (groupWidth + GROUP_OUTER_GAP);
      const height = barHeight(point.value);
      const baseY = PAD.top + innerH;

      return {
        label: point.label,
        showLabel: index % labelStep === 0 || index === count - 1,
        groupX,
        groupWidth,
        bar: {
          x: groupX + (groupWidth - barWidth) / 2,
          y: baseY - height,
          width: barWidth,
          height,
          value: point.value,
        },
      };
    });

    return { groups, innerH, labelStep };
  }, [pageviews, max, chartWidth, chartHeight]);

  const header = (
    <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
      <p className="text-xs font-medium text-ink">{rangeTitle(rangeDays)}</p>
      <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-muted">
        <span
          className="h-2.5 w-2.5 rounded-sm"
          style={{ background: chartBarFill(BAR_COLOR, "top") }}
          aria-hidden
        />
        بازدید
      </span>
    </div>
  );

  function hoverBar(event: MouseEvent, index: number, label: string, value: number) {
    setActive(index);
    const share = total > 0 ? value / total : 0;
    show(event, {
      title: label,
      rows: [
        {
          label: "بازدید",
          value: formatValue(value),
          color: BAR_COLOR,
        },
        {
          label: "سهم",
          value: `${toPersianDigits(Math.round(share * 100))}٪`,
        },
      ],
    });
  }

  if (loading) {
    return (
      <div className={`flex min-h-0 w-full flex-col ${className}`}>
        {header}
        <div className="flex min-h-[160px] flex-1 items-center justify-center">
          <p className="text-sm text-ink-muted">در حال بارگذاری…</p>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className={`flex min-h-0 w-full flex-col ${className}`}>
        {header}
        <p className="flex min-h-[160px] flex-1 items-center justify-center text-sm text-ink-muted">
          {emptyLabel}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative flex min-h-0 w-full flex-col ${className}`}>
      {header}

      <div
        ref={rootRef}
        className="relative min-h-[160px] w-full flex-1"
        onMouseLeave={() => {
          setActive(null);
          hide();
        }}
      >
        {size.width > 0 && size.height > 0 ? (
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="block"
            role="img"
            aria-label={`نمودار میله‌ای بازدید ${rangeDays} روز`}
          >
            {[0.5, 1].map((ratio) => {
              const y = PAD.top + geometry.innerH * (1 - ratio);
              return (
                <line
                  key={ratio}
                  x1={PAD.left}
                  x2={chartWidth - PAD.right}
                  y1={y}
                  y2={y}
                  stroke={CHART_GRID_COLOR}
                  strokeWidth={1}
                  strokeDasharray="4 6"
                />
              );
            })}

            {geometry.groups.map((group, index) => {
              const isActive = active === index;
              const dimmed = active != null && !isActive;
              return (
                <g
                  key={`${group.label}-${index}`}
                  opacity={dimmed ? 0.4 : 1}
                  className="cursor-pointer transition-opacity duration-150"
                  onMouseMove={(event) =>
                    hoverBar(event, index, group.label, group.bar.value)
                  }
                >
                  {group.bar.height > 0 ? (
                    <>
                      <rect
                        x={group.bar.x}
                        y={group.bar.y}
                        width={group.bar.width}
                        height={group.bar.height}
                        rx={5}
                        fill={BAR_COLOR}
                        style={{
                          filter: isActive
                            ? "brightness(1.1)"
                            : undefined,
                        }}
                      />
                      {(showValueLabels && group.bar.height >= 22) || isActive ? (
                        <text
                          x={group.bar.x + group.bar.width / 2}
                          y={group.bar.y - 6}
                          textAnchor="middle"
                          fill={BAR_COLOR}
                          fontSize={VALUE_FONT_SIZE}
                          fontWeight={700}
                        >
                          {formatValue(group.bar.value)}
                        </text>
                      ) : null}
                    </>
                  ) : null}

                  {group.showLabel ? (
                    <text
                      x={group.groupX + group.groupWidth / 2}
                      y={chartHeight - 10}
                      textAnchor="middle"
                      fill="currentColor"
                      fontSize={LABEL_FONT_SIZE}
                      fontWeight={isActive ? 700 : 500}
                      className={isActive ? "text-ink" : "text-ink-muted"}
                    >
                      {group.label}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
        ) : null}
        <ChartTip tip={tip} />
      </div>
    </div>
  );
}
