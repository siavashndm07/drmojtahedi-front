"use client";

import { useEffect, useId, useMemo, useRef, useState, type MouseEvent } from "react";
import { LineChart, type LucideIcon } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import ChartCard from "./ChartCard";
import { ChartTip, useChartTip } from "./ChartTooltip";
import {
  CHART_AREA_BOTTOM,
  CHART_AREA_TOP,
  CHART_GRID_COLOR,
  CHART_LINE_COLOR,
  type ChartPoint,
} from "@/lib/chartColors";

const CHART_HEIGHT = 200;
const PAD_X = 16;
const PAD_Y = 20;
const MIN_POINT_WIDTH = 44;

function formatValue(value: number, valueFormatter?: (n: number) => string) {
  return valueFormatter ? valueFormatter(value) : value.toLocaleString("fa-IR");
}

export default function LineAreaChart({
  title,
  subtitle,
  icon,
  data,
  valueFormatter,
  emptyLabel = "داده‌ای نیست",
  lineColor = CHART_LINE_COLOR,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  data: ChartPoint[];
  valueFormatter?: (value: number) => string;
  emptyLabel?: string;
  lineColor?: string;
}) {
  const gradientId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const { rootRef, tip, show, hide } = useChartTip();
  const [containerWidth, setContainerWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const syncWidth = () => setContainerWidth(node.clientWidth);
    syncWidth();
    const observer = new ResizeObserver(syncWidth);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const max = Math.max(...data.map((point) => point.value), 1);
  const hasData = data.some((point) => point.value > 0);

  const chartWidth = useMemo(() => {
    const dense = data.length * MIN_POINT_WIDTH;
    const measured = containerWidth || 320;
    return Math.max(measured, dense);
  }, [containerWidth, data.length]);

  const geometry = useMemo(() => {
    const innerW = chartWidth - PAD_X * 2;
    const innerH = CHART_HEIGHT - PAD_Y * 2;

    const points = data.map((point, index) => {
      const x =
        data.length === 1
          ? chartWidth / 2
          : PAD_X + (index / (data.length - 1)) * innerW;
      const y = PAD_Y + innerH - (point.value / max) * innerH;
      return { ...point, x, y, index };
    });

    const linePath = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

    const areaPath =
      points.length > 0
        ? `${linePath} L ${points[points.length - 1].x} ${CHART_HEIGHT - PAD_Y} L ${points[0].x} ${CHART_HEIGHT - PAD_Y} Z`
        : "";

    return { points, linePath, areaPath, innerW, innerH };
  }, [chartWidth, data, max]);

  const scrollable = chartWidth > (containerWidth || chartWidth);

  function indexFromX(svgX: number) {
    if (data.length <= 1) return 0;
    const t = (svgX - PAD_X) / geometry.innerW;
    return Math.max(0, Math.min(data.length - 1, Math.round(t * (data.length - 1))));
  }

  function onMove(event: MouseEvent<SVGSVGElement>) {
    const svg = event.currentTarget;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const loc = point.matrixTransform(ctm.inverse());
    const index = indexFromX(loc.x);
    const item = data[index];
    if (!item) return;
    setActive(index);
    show(event, {
      title: item.label,
      rows: [
        {
          label: "مقدار",
          value: formatValue(item.value, valueFormatter),
          color: lineColor,
        },
      ],
    });
  }

  return (
    <ChartCard title={title} subtitle={subtitle} icon={icon}>
      {!hasData ? (
        <EmptyState
          bare
          compact
          icon={icon ?? LineChart}
          title={emptyLabel}
          description="به محض ثبت داده، روند اینجا رسم می‌شود."
        />
      ) : (
        <div ref={rootRef} className="relative">
          <div ref={containerRef} className="w-full min-w-0">
            <div className={scrollable ? "overflow-x-auto pb-1" : undefined}>
              <svg
                width={chartWidth}
                height={CHART_HEIGHT}
                viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}
                className="block max-w-none cursor-crosshair"
                role="img"
                aria-label={title}
                onMouseMove={onMove}
                onMouseLeave={() => {
                  setActive(null);
                  hide();
                }}
              >
                {[0.25, 0.5, 0.75].map((ratio) => {
                  const y = PAD_Y + geometry.innerH * (1 - ratio);
                  return (
                    <line
                      key={ratio}
                      x1={PAD_X}
                      x2={chartWidth - PAD_X}
                      y1={y}
                      y2={y}
                      stroke={CHART_GRID_COLOR}
                      strokeWidth={1}
                      strokeDasharray="4 6"
                    />
                  );
                })}

                {active != null && geometry.points[active] ? (
                  <g pointerEvents="none">
                    <rect
                      x={
                        geometry.points[active].x -
                        geometry.innerW / Math.max(data.length * 2, 2)
                      }
                      y={PAD_Y}
                      width={geometry.innerW / Math.max(data.length, 1)}
                      height={geometry.innerH}
                      className="fill-pine/10"
                    />
                    <line
                      x1={geometry.points[active].x}
                      x2={geometry.points[active].x}
                      y1={PAD_Y}
                      y2={PAD_Y + geometry.innerH}
                      stroke="currentColor"
                      strokeDasharray="3 5"
                      className="text-pine/40"
                    />
                  </g>
                ) : null}

                <defs>
                  <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={CHART_AREA_TOP} />
                    <stop offset="100%" stopColor={CHART_AREA_BOTTOM} />
                  </linearGradient>
                </defs>

                {geometry.areaPath ? (
                  <path d={geometry.areaPath} fill={`url(#${gradientId})`} />
                ) : null}

                {geometry.linePath ? (
                  <path
                    d={geometry.linePath}
                    fill="none"
                    stroke={lineColor}
                    strokeWidth={2.5}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                ) : null}

                {geometry.points.map((point) => (
                  <circle
                    key={`${point.label}-${point.index}`}
                    cx={point.x}
                    cy={point.y}
                    r={active === point.index ? 6 : 3.5}
                    fill={lineColor}
                    stroke="white"
                    strokeWidth={active === point.index ? 2.5 : 1.5}
                    className="transition-[r] duration-150"
                  />
                ))}
              </svg>

              <div
                className="mt-2 grid gap-1"
                style={{
                  width: chartWidth,
                  gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))`,
                }}
              >
                {data.map((point, index) => (
                  <span
                    key={`${point.label}-${index}`}
                    className={`truncate text-center text-[10px] ${
                      active === index
                        ? "font-semibold text-ink"
                        : "text-ink-muted"
                    }`}
                  >
                    {point.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <ChartTip tip={tip} />
        </div>
      )}
    </ChartCard>
  );
}
