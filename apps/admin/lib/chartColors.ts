/** Brand-aligned segment colors for SVG charts */

export type ChartPoint = {
  label: string;
  value: number;
  color?: string;
};

export const CHART_SEGMENT_COLORS = [
  "rgb(var(--pine))",
  "#0ea5e9",
  "#14b8a6",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#64748b",
  "#ec4899",
];

export const CHART_LINE_COLOR = "#2F7F78";
export const CHART_AREA_TOP = "rgba(47, 127, 120, 0.28)";
export const CHART_AREA_BOTTOM = "rgba(47, 127, 120, 0.02)";
export const CHART_GRID_COLOR = "rgba(47, 127, 120, 0.08)";

/** Opaque bar fill — hex-alpha suffixes break on `rgb(var(--token))` colors. */
export function chartBarFill(color: string, to: "top" | "left"): string {
  return `linear-gradient(to ${to}, ${color}, color-mix(in srgb, ${color} 78%, white))`;
}

export function pointColor(point: ChartPoint, index: number): string {
  return point.color || CHART_SEGMENT_COLORS[index % CHART_SEGMENT_COLORS.length];
}

export function topChartPoints(data: ChartPoint[], limit = 8): ChartPoint[] {
  const sorted = [...data]
    .filter((point) => point.value > 0)
    .sort((a, b) => b.value - a.value);
  if (sorted.length <= limit) return sorted;
  const head = sorted.slice(0, limit - 1);
  const rest = sorted.slice(limit - 1).reduce((sum, point) => sum + point.value, 0);
  return [...head, { label: "سایر", value: rest, color: "#94a3b8" }];
}
