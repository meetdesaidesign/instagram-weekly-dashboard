"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { addDaysKey, formatDateLabel } from "@/lib/dates";
import { cn } from "@/lib/utils";

const PRESETS = [
  { label: "7d", days: 7 },
  { label: "14d", days: 14 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
] as const;

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;

function parseKey(key: string): { y: number; m: number; d: number } {
  const [y, m, d] = key.split("-").map(Number);
  return { y, m: m - 1, d };
}

function toKey(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function monthLabel(y: number, m: number): string {
  return new Date(Date.UTC(y, m, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Monday-based weekday index: Mon=0 … Sun=6 */
function mondayIndex(y: number, m: number, d: number): number {
  const js = new Date(Date.UTC(y, m, d)).getUTCDay(); // Sun=0
  return (js + 6) % 7;
}

function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
}

function inclusiveDays(start: string, end: string): number {
  return (
    Math.round(
      (Date.parse(end + "T00:00:00Z") - Date.parse(start + "T00:00:00Z")) /
        86_400_000,
    ) + 1
  );
}

function buildMonthCells(y: number, m: number) {
  const total = daysInMonth(y, m);
  const lead = mondayIndex(y, m, 1);
  const cells: { key: string; day: number; inMonth: boolean }[] = [];

  // Leading days from previous month
  const prevM = m === 0 ? 11 : m - 1;
  const prevY = m === 0 ? y - 1 : y;
  const prevTotal = daysInMonth(prevY, prevM);
  for (let i = lead - 1; i >= 0; i--) {
    const day = prevTotal - i;
    cells.push({ key: toKey(prevY, prevM, day), day, inMonth: false });
  }

  for (let day = 1; day <= total; day++) {
    cells.push({ key: toKey(y, m, day), day, inMonth: true });
  }

  // Trailing days to fill 6 rows
  const nextM = m === 11 ? 0 : m + 1;
  const nextY = m === 11 ? y + 1 : y;
  let nextDay = 1;
  while (cells.length % 7 !== 0 || cells.length < 42) {
    cells.push({
      key: toKey(nextY, nextM, nextDay),
      day: nextDay,
      inMonth: false,
    });
    nextDay++;
  }

  return cells;
}

export function RangePicker({
  start,
  end,
  today,
}: {
  start: string;
  end: string;
  /** Today's date key in the app timezone (from the server) */
  today: string;
}) {
  const router = useRouter();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [draftStart, setDraftStart] = useState(start);
  const [draftEnd, setDraftEnd] = useState(end);
  const [picking, setPicking] = useState<"start" | "end">("start");
  const startParts = parseKey(start);
  const [viewY, setViewY] = useState(startParts.y);
  const [viewM, setViewM] = useState(startParts.m);

  const syncFromProps = useCallback(() => {
    setDraftStart(start);
    setDraftEnd(end);
    setPicking("start");
    const p = parseKey(end);
    setViewY(p.y);
    setViewM(p.m);
  }, [start, end]);

  useEffect(() => {
    if (!open) syncFromProps();
  }, [open, syncFromProps]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function apply(nextStart: string, nextEnd: string) {
    setOpen(false);
    router.push(`/?start=${nextStart}&end=${nextEnd}`);
  }

  function keyMinusDays(days: number): string {
    return addDaysKey(today, -(days - 1));
  }

  const activeDays =
    end === today ? inclusiveDays(start, end) : null;

  const draftDays = inclusiveDays(draftStart, draftEnd);
  const triggerLabel =
    end === today && activeDays && [7, 14, 30, 90].includes(activeDays)
      ? `Last ${activeDays} days`
      : `${formatDateLabel(start)} – ${formatDateLabel(end)}`;

  function selectDay(key: string) {
    if (key > today) return;
    if (picking === "start" || key < draftStart) {
      setDraftStart(key);
      setDraftEnd(key);
      setPicking("end");
      return;
    }
    setDraftEnd(key);
    setPicking("start");
  }

  function shiftMonth(delta: number) {
    const d = new Date(Date.UTC(viewY, viewM + delta, 1));
    setViewY(d.getUTCFullYear());
    setViewM(d.getUTCMonth());
  }

  function onTriggerKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  }

  const cells = buildMonthCells(viewY, viewM);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKey}
        className={cn(
          "inline-flex h-9 cursor-pointer items-center gap-2 rounded-ctl border bg-surface px-3 text-[13px] font-medium text-foreground",
          "transition-[border-color,box-shadow,background-color] duration-150",
          "hover:border-border-strong hover:bg-surface-2",
          "focus-visible:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
          open
            ? "border-accent shadow-[0_0_0_2px_var(--focus-ring)]"
            : "border-border",
        )}
      >
        <CalendarDays size={15} className="text-muted" aria-hidden />
        <span>{triggerLabel}</span>
        <ChevronDown
          size={14}
          className={cn(
            "text-muted-2 transition-transform duration-150",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="Date range"
          className={cn(
            "absolute top-[calc(100%+8px)] right-0 z-50 w-[320px] origin-top-right",
            "rounded-modal border border-border bg-surface p-4",
            "shadow-[var(--shadow-popover)]",
            "animate-in",
          )}
          style={{
            animation: "rise-in 0.18s cubic-bezier(0.23, 1, 0.32, 1) both",
          }}
        >
          {/* Presets */}
          <div className="mb-4 flex gap-1.5">
            {PRESETS.map((p) => {
              const selected =
                draftEnd === today && draftDays === p.days;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    const ns = keyMinusDays(p.days);
                    setDraftStart(ns);
                    setDraftEnd(today);
                    setPicking("start");
                    const parts = parseKey(today);
                    setViewY(parts.y);
                    setViewM(parts.m);
                  }}
                  className={cn(
                    "h-8 flex-1 cursor-pointer rounded-ctl text-[12px] font-medium transition-colors duration-150",
                    selected
                      ? "bg-accent text-on-accent"
                      : "bg-surface-2 text-muted hover:bg-surface-3 hover:text-foreground",
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Month header */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => shiftMonth(-1)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-ctl text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <ChevronLeft size={16} />
            </button>
            <p className="text-[13px] font-semibold tracking-tight text-foreground">
              {monthLabel(viewY, viewM)}
            </p>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => shiftMonth(1)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-ctl text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="mb-1 grid grid-cols-7">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="flex h-8 items-center justify-center text-[11px] font-medium text-muted-2"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7">
            {cells.map((cell) => {
              const disabled = cell.key > today;
              const isStart = cell.key === draftStart;
              const isEnd = cell.key === draftEnd;
              const inRange =
                cell.key > draftStart && cell.key < draftEnd;
              const isToday = cell.key === today;
              const isEdge = isStart || isEnd;
              const rangeSolo = draftStart === draftEnd;

              return (
                <button
                  key={cell.key}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectDay(cell.key)}
                  className={cn(
                    "relative flex h-9 items-center justify-center text-[13px] transition-colors duration-100",
                    !cell.inMonth && "text-muted-2/50",
                    cell.inMonth && !disabled && !isEdge && "text-foreground",
                    disabled && "cursor-not-allowed text-muted-2/40",
                    !disabled && "cursor-pointer",
                    // Range bar behind mid days
                    inRange && "bg-accent-soft",
                    // Soft connector on start/end when spanning
                    isStart && !rangeSolo && "rounded-l-full bg-accent-soft",
                    isEnd && !rangeSolo && "rounded-r-full bg-accent-soft",
                  )}
                >
                  <span
                    className={cn(
                      "relative z-[1] flex h-8 w-8 items-center justify-center rounded-full font-medium",
                      isEdge && "bg-accent text-on-accent",
                      !isEdge &&
                        !disabled &&
                        cell.inMonth &&
                        "hover:bg-surface-3",
                      isToday && !isEdge && "text-accent",
                    )}
                  >
                    {cell.day}
                  </span>
                  {isToday && !isEdge && (
                    <span
                      className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent"
                      aria-hidden
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selection summary */}
          <p className="mt-3 text-center text-[12px] text-muted">
            {formatDateLabel(draftStart)}
            {draftStart !== draftEnd && (
              <>
                <span className="mx-1.5 text-muted-2">→</span>
                {formatDateLabel(draftEnd)}
              </>
            )}
            <span className="ml-1.5 text-muted-2">
              · {draftDays === 1 ? "1 day" : `${draftDays} days`}
            </span>
          </p>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-8 cursor-pointer rounded-ctl px-3 text-[13px] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => apply(draftStart, draftEnd)}
              className="h-8 cursor-pointer rounded-ctl bg-accent px-4 text-[13px] font-medium text-on-accent transition-[filter,transform] duration-150 hover:brightness-[1.08] active:scale-[0.97]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
