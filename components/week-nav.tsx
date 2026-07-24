import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDaysKey, saturdayOnOrBefore } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { buttonClasses } from "@/components/ui";

export function WeekNav({
  start,
  label,
  today,
  className,
}: {
  start: string;
  label: string;
  today: string;
  className?: string;
}) {
  const prev = addDaysKey(start, -7);
  const next = addDaysKey(start, 7);
  const currentStart = saturdayOnOrBefore(today);
  const canGoNext = next <= currentStart;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Link
        href={`/?week=${prev}`}
        className={buttonClasses({ variant: "secondary", size: "sm" })}
        aria-label="Previous week"
      >
        <ChevronLeft size={14} />
      </Link>
      <span className="min-w-[10rem] text-center font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
        {label}
      </span>
      {canGoNext ? (
        <Link
          href={next === currentStart ? "/" : `/?week=${next}`}
          className={buttonClasses({ variant: "secondary", size: "sm" })}
          aria-label="Next week"
        >
          <ChevronRight size={14} />
        </Link>
      ) : (
        <span
          className={buttonClasses({
            variant: "secondary",
            size: "sm",
            className: "pointer-events-none opacity-40",
          })}
          aria-disabled
        >
          <ChevronRight size={14} />
        </span>
      )}
    </div>
  );
}
