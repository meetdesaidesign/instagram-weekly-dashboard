"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDateLabel } from "@/lib/dates";
import { formatNumber } from "@/lib/utils";
import { chartColors } from "@/lib/chart-tokens";

export interface SeriesPoint {
  date: string;
  [key: string]: number | string;
}

const axisStyle = {
  fontSize: 10,
  fontFamily: "var(--font-geist-mono)",
  fill: "var(--muted-2)",
} as const;

function TooltipBox({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-card border border-border-strong bg-surface-2 px-3 py-2 text-xs">
      <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted">
        {label ? formatDateLabel(String(label)) : ""}
      </p>
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2 text-muted">
          <span
            className="h-2 w-2 rounded-[1px]"
            style={{ background: p.color }}
          />
          {p.name}:{" "}
          <span className="font-mono tabular-nums text-foreground">
            {formatNumber(p.value ?? 0)}
          </span>
        </p>
      ))}
    </div>
  );
}

export function AreaTrend<T extends { date: string }>({
  data,
  dataKey,
  color = chartColors[1],
}: {
  data: T[];
  dataKey: string;
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tickFormatter={(v) => formatDateLabel(String(v))}
          tick={axisStyle}
          stroke="var(--border)"
          tickLine={false}
          axisLine={false}
          minTickGap={24}
        />
        <YAxis
          tick={axisStyle}
          stroke="var(--border)"
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatNumber(Number(v))}
          width={48}
        />
        <Tooltip content={<TooltipBox />} cursor={{ stroke: "var(--border-strong)" }} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={1.75}
          fill={`url(#grad-${dataKey})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MultiLineTrend<T extends { date: string }>({
  data,
  series,
}: {
  data: T[];
  series: { key: string; name: string; color: string; dash?: string }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tickFormatter={(v) => formatDateLabel(String(v))}
          tick={axisStyle}
          stroke="var(--border)"
          tickLine={false}
          axisLine={false}
          minTickGap={24}
        />
        <YAxis
          tick={axisStyle}
          stroke="var(--border)"
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatNumber(Number(v))}
          width={48}
        />
        <Tooltip content={<TooltipBox />} cursor={{ stroke: "var(--border-strong)" }} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={1.75}
            strokeDasharray={s.dash}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
