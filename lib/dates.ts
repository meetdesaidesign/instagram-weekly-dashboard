import { config } from "@/lib/config";

/**
 * Returns the current calendar date in the app timezone (IST) as a
 * YYYY-MM-DD string. We use this for daily snapshot buckets so that a cron
 * running at 12pm IST always lands on the correct local day.
 */
export function todayInAppTz(now: Date = new Date()): string {
  return dateKeyInTz(now, config.timezone);
}

export function dateKeyInTz(date: Date, timeZone: string): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  // en-CA formats as YYYY-MM-DD
  return fmt.format(date);
}

/** Parse a YYYY-MM-DD string into a UTC-midnight Date (safe for @db.Date). */
export function dateKeyToUtc(key: string): Date {
  return new Date(`${key}T00:00:00.000Z`);
}

/** A Date at UTC midnight for the given IST "today". */
export function todayUtcDate(now: Date = new Date()): Date {
  return dateKeyToUtc(todayInAppTz(now));
}

/** Subtract N days from a YYYY-MM-DD key, returning a new key. */
export function addDaysKey(key: string, days: number): string {
  const d = dateKeyToUtc(key);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Inclusive list of date keys between start and end (YYYY-MM-DD). */
export function dateRangeKeys(startKey: string, endKey: string): string[] {
  const keys: string[] = [];
  let cur = startKey;
  let guard = 0;
  while (cur <= endKey && guard < 4000) {
    keys.push(cur);
    cur = addDaysKey(cur, 1);
    guard++;
  }
  return keys;
}

/** Day of week in app tz: 0=Sun ... 5=Fri ... 6=Sat */
export function weekdayInAppTz(now: Date = new Date()): number {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: config.timezone,
    weekday: "short",
  });
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[fmt.format(now)] ?? 0;
}

export function formatDateLabel(key: string): string {
  const d = dateKeyToUtc(key);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
