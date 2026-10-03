import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";
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
  "w-full rounded-ctl border border-border bg-control px-2.5 py-2 text-[13px] font-medium text-foreground " +
  "placeholder:text-muted-2 transition-[border-color,box-shadow] duration-150 " +
  "hover:border-border-strong " +
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
      <div className="min-w-0">
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[13px] text-muted">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function ConfigRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {ok ? (
        <CheckCircle2 size={15} className="text-success" />
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
