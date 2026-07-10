import { cn, formatPercent } from "@/lib/utils";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  XCircle,
} from "lucide-react";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

/* ----------------------------------------------------------------
   Buttons — one source of truth for anything clickable.
   `buttonClasses` exists so <a>/<Link> can share the exact styling.
   ---------------------------------------------------------------- */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

export function buttonClasses({
  variant = "secondary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-ctl border border-transparent font-medium",
    "transition-[background-color,border-color,color,transform] duration-150",
    "active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
    "disabled:pointer-events-none disabled:opacity-50",
    size === "md" ? "h-[34px] px-[15px] text-[13px]" : "h-7 px-2.5 text-xs",
    variant === "primary" &&
      "bg-accent text-on-accent hover:brightness-[1.08]",
    variant === "secondary" &&
      "border-border bg-surface-2 text-foreground hover:border-border-strong hover:bg-surface-3",
    variant === "ghost" && "text-muted hover:bg-surface-2 hover:text-foreground",
    variant === "danger" &&
      "border-border bg-surface-2 text-danger hover:border-danger/40 hover:bg-danger-soft",
    className,
  );
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button className={buttonClasses({ variant, size, className })} {...props} />
  );
}

/* ----------------------------------------------------------------
   Form controls — inputs sit darker than their surroundings (inset).
   ---------------------------------------------------------------- */

const controlBase =
  "w-full rounded-ctl border border-border bg-control px-2.5 py-2 text-[13px] text-foreground " +
  "placeholder:text-muted-2 transition-[border-color,box-shadow] duration-150 " +
  "focus-visible:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] " +
  "disabled:cursor-not-allowed disabled:opacity-50";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlBase, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlBase, className)} {...props} />;
}

export function Field({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="text-[13px] font-medium text-foreground">{label}</label>
      {description && (
        <p className="mt-0.5 text-xs text-muted">{description}</p>
      )}
      <div className="mt-2">{children}</div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Surfaces
   ---------------------------------------------------------------- */

export function Card({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-surface p-4",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  meta,
  className,
}: {
  children: ReactNode;
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-baseline justify-between gap-3", className)}>
      <h2 className="text-sm font-semibold tracking-tight text-foreground">
        {children}
      </h2>
      {meta && (
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-2">
          {meta}
        </span>
      )}
    </div>
  );
}

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
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-[13px] text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ----------------------------------------------------------------
   Signature — the week strip. 7 segments, filled = days elapsed
   in the current week window.
   ---------------------------------------------------------------- */

export function WeekStrip({
  filled = 7,
  className,
}: {
  filled?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-1", className)} aria-hidden>
      {Array.from({ length: 7 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-[3px] flex-1 rounded-full",
            i < filled ? "bg-accent" : "bg-surface-3",
          )}
        />
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------
   Data display
   ---------------------------------------------------------------- */

export function StatCard({
  label,
  value,
  delta,
  hint,
  accent,
  weekFilled,
}: {
  label: string;
  value: string;
  delta?: number | null;
  hint?: string;
  accent?: boolean;
  weekFilled?: number;
}) {
  const showDelta = delta !== undefined && delta !== null;
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.07em] text-muted">
        {label}
      </p>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span
          className={cn(
            "font-mono font-medium tabular-nums tracking-tight text-foreground",
            accent ? "text-[28px]" : "text-xl",
          )}
        >
          {value}
        </span>
        {showDelta && (
          <span
            className={cn(
              "flex items-center gap-0.5 font-mono text-[11px] font-medium tabular-nums",
              positive ? "text-foreground" : "text-muted",
            )}
          >
            {positive ? (
              <ArrowUpRight size={12} />
            ) : (
              <ArrowDownRight size={12} />
            )}
            {formatPercent(delta)}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-[11px] text-muted-2">{hint}</p>}
      {accent && <WeekStrip filled={weekFilled ?? 7} className="mt-3" />}
    </div>
  );
}

/**
 * Instrument-panel stat grid: one bordered container, cells divided by
 * hairlines (gap-px over the border color) instead of floating boxes.
 */
export function StatPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-px overflow-hidden rounded-card border border-border bg-border",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function StatCell({
  label,
  value,
  delta,
  hint,
  hero,
  children,
  className,
}: {
  label: string;
  value: string;
  delta?: number | null;
  hint?: string;
  hero?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  const showDelta = delta !== undefined && delta !== null;
  const positive = (delta ?? 0) >= 0;
  return (
    <div
      className={cn(
        "flex flex-col bg-surface",
        hero ? "justify-between p-5" : "p-4",
        className,
      )}
    >
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.07em] text-muted">
        {label}
      </p>
      <div className={cn("flex items-baseline gap-2", hero ? "mt-4" : "mt-1.5")}>
        <span
          className={cn(
            "font-mono font-medium tabular-nums tracking-tight text-foreground",
            hero ? "text-[34px] leading-none" : "text-xl",
          )}
        >
          {value}
        </span>
        {showDelta && (
          <span
            className={cn(
              "flex items-center gap-0.5 font-mono text-[11px] font-medium tabular-nums",
              positive ? "text-foreground" : "text-muted",
            )}
          >
            {positive ? (
              <ArrowUpRight size={12} />
            ) : (
              <ArrowDownRight size={12} />
            )}
            {formatPercent(delta)}
          </span>
        )}
      </div>
      {hint && (
        <p className={cn("text-[11px] text-muted-2", hero ? "mt-2" : "mt-1")}>
          {hint}
        </p>
      )}
      {children}
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
        "inline-flex items-center rounded-ctl border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ----------------------------------------------------------------
   Disclosure — styled native <details> accordion for history lists.
   ---------------------------------------------------------------- */

export function Disclosure({
  title,
  meta,
  children,
}: {
  title: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <details className="group rounded-card border border-border bg-surface transition-colors hover:border-border-strong open:border-border-strong">
      <summary className="flex cursor-pointer list-none items-center gap-2.5 px-4 py-3 text-[13px] font-medium text-foreground [&::-webkit-details-marker]:hidden">
        <ChevronRight
          size={14}
          className="shrink-0 text-muted-2 transition-transform duration-150 group-open:rotate-90"
        />
        <span className="min-w-0 flex-1 truncate">{title}</span>
        {meta && (
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-2">
            {meta}
          </span>
        )}
      </summary>
      <div className="border-t border-border px-4 py-3">{children}</div>
    </details>
  );
}

/* ----------------------------------------------------------------
   Feedback
   ---------------------------------------------------------------- */

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
    <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-12 text-center">
      <WeekStrip filled={3} className="w-16" />
      <h3 className="mt-1 text-base font-semibold text-foreground">{title}</h3>
      <p className="max-w-md text-[13px] leading-relaxed text-muted">
        {description}
      </p>
      {action}
    </div>
  );
}

export function Banner({
  children,
  tone,
  className,
}: {
  children: ReactNode;
  tone: "success" | "danger" | "muted";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-4 flex items-start gap-2 rounded-card border p-3 text-[13px]",
        tone === "muted"
          ? "border-border bg-surface text-muted"
          : "border-border-strong bg-surface text-foreground",
        className,
      )}
    >
      {tone === "success" && (
        <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
      )}
      {tone === "danger" && (
        <AlertCircle size={15} className="mt-0.5 shrink-0" />
      )}
      <span>{children}</span>
    </div>
  );
}

export function ConfigRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {ok ? (
        <CheckCircle2 size={15} className="text-foreground" />
      ) : (
        <XCircle size={15} className="text-muted-2" />
      )}
      <span
        className={cn("text-[13px]", ok ? "text-foreground" : "text-muted")}
      >
        {label}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-2">
        {ok ? "configured" : "missing"}
      </span>
    </div>
  );
}
