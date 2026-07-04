import { cn, formatPercent } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  hint,
  accent,
}: {
  label: string;
  value: string;
  delta?: number | null;
  hint?: string;
  accent?: boolean;
}) {
  const showDelta = delta !== undefined && delta !== null;
  const positive = (delta ?? 0) >= 0;
  return (
    <div className={cn("card p-5", accent && "relative overflow-hidden")}>
      {accent && (
        <div className="brand-gradient absolute inset-x-0 top-0 h-1" />
      )}
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <span className="text-2xl font-bold tracking-tight">{value}</span>
        {showDelta && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-semibold",
              positive ? "text-success" : "text-danger",
            )}
          >
            {positive ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {formatPercent(delta)}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-[var(--muted-2)]">{hint}</p>}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("card p-5", className)}>{children}</div>;
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="card p-10 flex flex-col items-center text-center gap-3">
      <div className="brand-gradient h-12 w-12 rounded-2xl opacity-80" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted max-w-md">{description}</p>
      {action}
    </div>
  );
}

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
