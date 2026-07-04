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

export interface SeriesPoint {
  date: string;
  [key: string]: number | string;
}

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
    <div className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-medium text-foreground">
        {label ? formatDateLabel(String(label)) : ""}
      </p>
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2 text-muted">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: p.color }}
          />
          {p.name}: <span className="text-foreground">{formatNumber(p.value ?? 0)}</span>
        </p>
      ))}
    </div>
  );
}

export function AreaTrend<T extends { date: string }>({
  data,
  dataKey,
  color = "#d6377b",
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
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a37" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(v) => formatDateLabel(String(v))}
          stroke="#6d6d80"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          minTickGap={24}
        />
        <YAxis
          stroke="#6d6d80"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatNumber(Number(v))}
          width={48}
        />
        <Tooltip content={<TooltipBox />} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
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
  series: { key: string; name: string; color: string }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a37" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(v) => formatDateLabel(String(v))}
          stroke="#6d6d80"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          minTickGap={24}
        />
        <YAxis
          stroke="#6d6d80"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatNumber(Number(v))}
          width={48}
        />
        <Tooltip content={<TooltipBox />} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
