"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Globe2, MonitorSmartphone, Smartphone } from "lucide-react";
import FilterPills from "@/components/FilterPills";
import DonutChart from "@/components/charts/DonutChart";
import TrafficTrendChart from "@/components/charts/TrafficTrendChart";
import {
  getSiteTrafficSeries,
  type RecentVisit,
  type TrafficRangeDays,
  type VisitDayPoint,
  type VisitSlicePoint,
} from "@/lib/api/resources";
import type { ChartPoint } from "@/lib/dashboardCharts";
import { toPersianDigits } from "@/lib/digits";
import { useAuth } from "@/lib/auth";

const TRAFFIC_RANGE_OPTIONS = [
  { value: "7", label: "۷ روز" },
  { value: "15", label: "۱۵ روز" },
  { value: "30", label: "۳۰ روز" },
] as const;

type TrafficRangeKey = (typeof TRAFFIC_RANGE_OPTIONS)[number]["value"];

const DEVICE_LABEL: Record<string, string> = {
  mobile: "موبایل",
  desktop: "دسکتاپ",
  tablet: "تبلت",
};

function toTrafficRangeDays(value: TrafficRangeKey): TrafficRangeDays {
  return Number(value) as TrafficRangeDays;
}

function formatCount(n: number) {
  return n.toLocaleString("fa-IR");
}

function visitLabel(isoDate: string, range: TrafficRangeDays) {
  const date = new Date(`${isoDate}T12:00:00`);
  if (range === 7) {
    return date.toLocaleDateString("fa-IR", { weekday: "short" });
  }
  return toPersianDigits(date.getDate());
}

function rangeLabel(days: TrafficRangeDays) {
  return `${toPersianDigits(days)} روز`;
}

function formatVisitAt(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("fa-IR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MetricTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="bg-surface px-3 py-2.5 sm:px-4 sm:py-3">
      <p className="text-[11px] font-medium text-ink-muted">{label}</p>
      <p className="mt-1 text-xl font-bold tabular-nums leading-none text-ink sm:text-2xl">
        {value}
      </p>
      {hint ? <p className="mt-1 text-[10px] leading-4 text-ink-muted">{hint}</p> : null}
    </div>
  );
}

export default function SiteTrafficPanel({
  todayVisits,
  todayUniques,
  visitBrowsers = [],
  visitDevices = [],
  recentVisits = [],
  loading,
}: {
  todayVisits: number;
  todayUniques: number;
  visitBrowsers?: VisitSlicePoint[];
  visitDevices?: VisitSlicePoint[];
  recentVisits?: RecentVisit[];
  loading: boolean;
}) {
  const { accessToken } = useAuth();
  const [rangeKey, setRangeKey] = useState<TrafficRangeKey>("7");
  const range = toTrafficRangeDays(rangeKey);
  const [series, setSeries] = useState<VisitDayPoint[]>([]);
  const [seriesLoading, setSeriesLoading] = useState(true);
  const [seriesError, setSeriesError] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    async function load() {
      setSeriesLoading(true);
      try {
        const next = await getSiteTrafficSeries(accessToken!, range);
        if (cancelled) return;
        setSeries(next);
        setSeriesError(null);
      } catch (err) {
        if (!cancelled) {
          setSeriesError(err instanceof Error ? err.message : "بارگذاری بازدید ناموفق");
        }
      } finally {
        if (!cancelled) setSeriesLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [range, accessToken]);

  const chartVisits = useMemo<ChartPoint[]>(
    () =>
      series.map((point) => ({
        label: visitLabel(point.date, range),
        value: point.pageviews,
      })),
    [series, range],
  );

  const browserData = useMemo<ChartPoint[]>(
    () => visitBrowsers.map((row) => ({ label: row.label, value: row.value })),
    [visitBrowsers],
  );

  const deviceData = useMemo<ChartPoint[]>(
    () =>
      visitDevices.map((row) => ({
        label: DEVICE_LABEL[row.label] ?? row.label,
        value: row.value,
      })),
    [visitDevices],
  );

  const visitRangeTotal = series.reduce((sum, point) => sum + point.pageviews, 0);
  const uniqueRangeTotal = series.reduce((sum, point) => sum + point.uniques, 0);

  const bounceHint =
    todayVisits > 0
      ? `${toPersianDigits(Math.round((todayUniques / todayVisits) * 100))}٪ نسبت یکتا`
      : "امروز";

  const chartBusy = loading || seriesLoading;

  return (
    <section className="overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/5 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
            <Globe2 className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-ink">بازدید سایت</h2>
            <p className="text-[11px] text-ink-muted">ترافیک عمومی سایت بنیاد</p>
          </div>
        </div>
        {!chartBusy ? (
          <div className="flex flex-wrap gap-2 text-[11px] text-ink-muted">
            <span className="rounded-full border border-ink/10 bg-cream/40 px-2.5 py-1 dark:bg-cream/10">
              {formatCount(visitRangeTotal)} بازدید / {rangeLabel(range)}
            </span>
            <span className="rounded-full border border-ink/10 bg-cream/40 px-2.5 py-1 dark:bg-cream/10">
              {formatCount(uniqueRangeTotal)} یکتا / {rangeLabel(range)}
            </span>
          </div>
        ) : null}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:items-stretch">
        <div className="grid grid-cols-2 gap-px border-b border-ink/5 bg-ink/5 lg:grid-cols-1 lg:border-b-0 lg:border-l">
          <MetricTile
            label="بازدید امروز"
            value={loading ? "—" : formatCount(todayVisits)}
            hint="صفحه‌بازدید"
          />
          <MetricTile
            label="یکتای امروز"
            value={loading ? "—" : formatCount(todayUniques)}
            hint={bounceHint}
          />
          <MetricTile
            label="میانگین روزانه"
            value={
              chartBusy
                ? "—"
                : formatCount(Math.round(visitRangeTotal / Math.max(series.length, 1)))
            }
            hint={rangeLabel(range)}
          />
          <MetricTile
            label="نسبت یکتا"
            value={
              chartBusy || visitRangeTotal <= 0
                ? "—"
                : `${toPersianDigits(Math.round((uniqueRangeTotal / visitRangeTotal) * 100))}٪`
            }
            hint="یکتا به بازدید"
          />
        </div>

        <div className="flex h-full min-h-[220px] min-w-0 flex-col p-4 sm:p-5">
          <FilterPills
            value={rangeKey}
            options={[...TRAFFIC_RANGE_OPTIONS]}
            onChange={setRangeKey}
          />

          {seriesError ? (
            <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {seriesError}
            </p>
          ) : null}

          <TrafficTrendChart
            className="mt-3 min-h-0 flex-1"
            pageviews={chartVisits}
            rangeDays={range}
            loading={chartBusy}
            emptyLabel="بازدیدی در این بازه ثبت نشده"
          />
        </div>
      </div>

      <button
        type="button"
        aria-expanded={detailsOpen}
        aria-controls="site-traffic-details"
        onClick={() => setDetailsOpen((open) => !open)}
        className="flex w-full items-center justify-center gap-2 border-t border-ink/5 px-4 py-3 text-xs font-medium text-ink-muted transition hover:bg-cream/40 hover:text-ink dark:hover:bg-cream/10"
      >
        {detailsOpen ? "نمایش کمتر" : "نمایش بیشتر"}
        <span className="text-[10px] font-normal">
          مرورگر، دستگاه و بازدیدهای اخیر
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
            detailsOpen ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {detailsOpen ? (
        <div id="site-traffic-details">
      <div className="grid gap-px border-t border-ink/5 bg-ink/5 sm:grid-cols-2">
        <div className="bg-surface p-4 sm:p-5">
          <DonutChart
            title="مرورگر"
            subtitle="۷ روز اخیر"
            icon={MonitorSmartphone}
            data={browserData}
            emptyLabel={loading ? "در حال بارگذاری…" : "بازدیدی ثبت نشده"}
            className="border-0 bg-transparent p-0 shadow-none"
          />
        </div>
        <div className="bg-surface p-4 sm:p-5">
          <DonutChart
            title="دستگاه"
            subtitle="۷ روز اخیر"
            icon={Smartphone}
            data={deviceData}
            emptyLabel={loading ? "در حال بارگذاری…" : "بازدیدی ثبت نشده"}
            className="border-0 bg-transparent p-0 shadow-none"
          />
        </div>
      </div>

      <div className="border-t border-ink/5">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <h3 className="text-sm font-semibold text-ink">بازدیدهای اخیر</h3>
          <span className="text-[11px] text-ink-muted">
            {loading ? "—" : `${toPersianDigits(recentVisits.length)} مورد`}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-xs">
            <thead className="border-y border-ink/5 bg-cream/40 text-[11px] text-ink-muted dark:bg-cream/10">
              <tr>
                <th className="px-4 py-2 font-medium sm:px-5">زمان</th>
                <th className="px-4 py-2 font-medium sm:px-5">مسیر</th>
                <th className="px-4 py-2 font-medium sm:px-5">IP</th>
                <th className="px-4 py-2 font-medium sm:px-5">مرورگر</th>
                <th className="px-4 py-2 font-medium sm:px-5">دستگاه</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-ink-muted sm:px-5">
                    در حال بارگذاری…
                  </td>
                </tr>
              ) : recentVisits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-ink-muted sm:px-5">
                    هنوز بازدیدی ثبت نشده
                  </td>
                </tr>
              ) : (
                recentVisits.map((visit, index) => (
                  <tr
                    key={`${visit.at}-${visit.path}-${index}`}
                    className="border-b border-ink/5 last:border-b-0"
                  >
                    <td className="whitespace-nowrap px-4 py-2.5 tabular-nums text-ink sm:px-5">
                      {formatVisitAt(visit.at)}
                    </td>
                    <td className="max-w-[14rem] truncate px-4 py-2.5 font-medium text-ink sm:px-5">
                      {visit.path || "/"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[11px] text-ink-muted sm:px-5" dir="ltr">
                      {visit.ip || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-ink sm:px-5">
                      {visit.browser || "Other"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-ink sm:px-5">
                      {DEVICE_LABEL[visit.device] ?? visit.device ?? "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
        </div>
      ) : null}
    </section>
  );
}
