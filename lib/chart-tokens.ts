/**
 * Chart palette + dash patterns. Lives outside the "use client" charts
 * module so server components can read the values (client-module exports
 * are opaque references on the server).
 */

/** Theme-aware chart palette — resolves to tokens in globals.css */
export const chartColors = {
  1: "var(--chart-1)",
  2: "var(--chart-2)",
  3: "var(--chart-3)",
  4: "var(--chart-4)",
} as const;

/**
 * Dash patterns to tell greyscale series apart when shade alone is
 * not enough (multi-series charts). 1 = solid.
 */
export const chartDashes = {
  1: undefined,
  2: "5 3",
  3: "2 2",
  4: "7 3 2 3",
} as const;
