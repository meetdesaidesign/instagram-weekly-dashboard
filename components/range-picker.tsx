"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const PRESETS = [
  { label: "7d", days: 7 },
  { label: "14d", days: 14 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

function keyMinusDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days + 1);
  return d.toISOString().slice(0, 10);
}

export function RangePicker({
  start,
  end,
}: {
  start: string;
  end: string;
}) {
  const router = useRouter();
  const [s, setS] = useState(start);
  const [e, setE] = useState(end);

  function apply(nextStart: string, nextEnd: string) {
    router.push(`/analytics?start=${nextStart}&end=${nextEnd}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex gap-1">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              const ns = keyMinusDays(p.days);
              const ne = new Date().toISOString().slice(0, 10);
              setS(ns);
              setE(ne);
              apply(ns, ne);
            }}
            className="btn btn-secondary py-1.5 px-3 text-xs"
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={s}
          max={e}
          onChange={(ev) => setS(ev.target.value)}
          className="input py-1.5 text-xs w-auto"
        />
        <span className="text-muted text-xs">to</span>
        <input
          type="date"
          value={e}
          min={s}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(ev) => setE(ev.target.value)}
          className="input py-1.5 text-xs w-auto"
        />
        <button
          onClick={() => apply(s, e)}
          className="btn brand-gradient btn-primary py-1.5 px-4 text-xs"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
