"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

const PRESETS = [
  { label: "7d", days: 7 },
  { label: "14d", days: 14 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

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
  const [s, setS] = useState(start);
  const [e, setE] = useState(end);

  function keyMinusDays(days: number): string {
    // Anchor on the server-provided app-timezone date, not browser-local time
    const d = new Date(today + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() - days + 1);
    return d.toISOString().slice(0, 10);
  }

  function apply(nextStart: string, nextEnd: string) {
    router.push(`/?start=${nextStart}&end=${nextEnd}`);
  }

  const activeDays =
    e === today
      ? Math.round(
          (Date.parse(e + "T00:00:00Z") - Date.parse(s + "T00:00:00Z")) /
            86_400_000,
        ) + 1
      : null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex overflow-hidden rounded-ctl border border-border">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => {
              const ns = keyMinusDays(p.days);
              setS(ns);
              setE(today);
              apply(ns, today);
            }}
            className={cn(
              "h-[30px] cursor-pointer px-3 font-mono text-[11px] font-medium transition-colors",
              i > 0 && "border-l border-border",
              activeDays === p.days
                ? "bg-accent-soft text-accent"
                : "bg-surface-2 text-muted hover:bg-surface-3 hover:text-foreground",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={s}
          max={e}
          onChange={(ev) => setS(ev.target.value)}
          className="h-[30px] w-auto py-0 font-mono text-[11px]"
        />
        <span className="text-xs text-muted-2">to</span>
        <Input
          type="date"
          value={e}
          min={s}
          max={today}
          onChange={(ev) => setE(ev.target.value)}
          className="h-[30px] w-auto py-0 font-mono text-[11px]"
        />
        <Button
          variant="primary"
          size="sm"
          className="h-[30px]"
          onClick={() => apply(s, e)}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
