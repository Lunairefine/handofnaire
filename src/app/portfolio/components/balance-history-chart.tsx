"use client";

import { useMemo } from "react";
import { formatUsd } from "@/app/portfolio/lib/holdings";

type BalanceSnapshot = {
  timestamp: number;
  totalUsd: number;
};

type BalanceHistoryChartProps = {
  history: BalanceSnapshot[];
  currentTotalUsd: number | null;
  currentSnapshotTimestamp: number | null;
  isLoading: boolean;
};

const CHART_WIDTH = 320;
const CHART_HEIGHT = 144;
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

const buildChart = (history: BalanceSnapshot[], windowStart: number) => {
  const series = history;
  const totals = series.map((item) => item.totalUsd);
  const min = Math.min(...totals);
  const max = Math.max(...totals);
  const range = max - min || 0.0001; // Avoid division by zero

  const points = series.map((item) => {
    // Force horizontal spread across the full 24h window (0 to CHART_WIDTH)
    const timeRatio = (item.timestamp - windowStart) / ONE_DAY_IN_MS;
    const x = Math.max(0, Math.min(CHART_WIDTH, timeRatio * CHART_WIDTH));
    
    const y =
      CHART_HEIGHT - 10 -
      ((item.totalUsd - min) / range) * (CHART_HEIGHT - 20);
    return { x, y };
  });

  const linePath = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
    )
    .join(" ");

  const areaPath = `${linePath} L ${CHART_WIDTH.toFixed(2)} ${CHART_HEIGHT.toFixed(2)} L 0 ${CHART_HEIGHT.toFixed(2)} Z`;

  return {
    areaPath,
    linePath,
    points,
  };
};

export default function BalanceHistoryChart({
  history,
  currentTotalUsd,
  currentSnapshotTimestamp,
  isLoading,
}: BalanceHistoryChartProps) {
  // eslint-disable-next-line react-hooks/purity
  const windowEnd = currentSnapshotTimestamp ?? Date.now();
  const windowStart = windowEnd - ONE_DAY_IN_MS;

  const chartSeries = useMemo(() => {
    if (currentTotalUsd === null) return [];

    const sortedHistory = [...history].sort(
      (left, right) => left.timestamp - right.timestamp
    );

    // Only keep history from the last 24h
    const entriesInWindow = sortedHistory.filter(
      (entry) => entry.timestamp >= windowStart && entry.timestamp <= windowEnd
    );

    // Find the latest value just before our window
    const latestBeforeWindow = [...sortedHistory]
      .reverse()
      .find((entry) => entry.timestamp < windowStart);

    const initialValue = latestBeforeWindow?.totalUsd ?? entriesInWindow[0]?.totalUsd ?? currentTotalUsd;

    // Build the 24h points
    const series = [
      { timestamp: windowStart, totalUsd: initialValue },
      ...entriesInWindow,
      { timestamp: windowEnd, totalUsd: currentTotalUsd },
    ].sort((a, b) => a.timestamp - b.timestamp);

    // Remove duplicates
    return series.reduce<BalanceSnapshot[]>((acc, entry) => {
      const last = acc[acc.length - 1];
      if (last && last.timestamp === entry.timestamp) {
        acc[acc.length - 1] = entry;
        return acc;
      }
      acc.push(entry);
      return acc;
    }, []);
  }, [currentTotalUsd, history, windowStart, windowEnd]);

  const chartData = useMemo(
    () => (chartSeries.length >= 2 ? buildChart(chartSeries, windowStart) : null),
    [chartSeries, windowStart]
  );

  return (
    <div className="w-full max-w-sm py-4 lg:min-w-[340px]">
      {chartData ? (
        <div className="relative overflow-hidden p-0">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_33%]" />
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-start">
            <p className="text-3xl font-bold text-foreground">
              {currentTotalUsd === null ? (
                isLoading ? (
                  <span className="inline-block h-8 w-32 animate-pulse rounded bg-foreground/5 align-middle" />
                ) : (
                  formatUsd(0)
                )
              ) : (
                formatUsd(currentTotalUsd)
              )}
            </p>
          </div>
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="relative h-40 w-full"
            preserveAspectRatio="none"
            aria-label="Balance history chart"
          >
            <defs>
              <linearGradient id="balance-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={chartData.areaPath} fill="url(#balance-area)" />
            <path
              d={chartData.linePath}
              fill="none"
              stroke="var(--teal)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center px-4 text-center text-sm text-zinc-500">
          {isLoading
            ? "Memuat chart saldo..."
            : "Belum ada histori saldo terdeteksi untuk address ini."}
        </div>
      )}
    </div>
  );
}
