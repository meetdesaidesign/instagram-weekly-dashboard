"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};
/** True after hydration; false during SSR and the first client render. */
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

const THEME_TRANSITION_MS = 400;

/** Briefly enable color transitions so the light ↔ dark swap is visible. */
function withThemeTransition(apply: () => void) {
  if (typeof document === "undefined") {
    apply();
    return;
  }

  const root = document.documentElement;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reduceMotion) {
    apply();
    return;
  }

  root.classList.add("theme-transition");
  apply();

  window.setTimeout(() => {
    root.classList.remove("theme-transition");
  }, THEME_TRANSITION_MS);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </NextThemesProvider>
  );
}

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
] as const;

export function ThemeToggle({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useHydrated();
  const current = mounted
    ? theme === "dark" || theme === "light"
      ? theme
      : resolvedTheme
    : "light";

  const selectTheme = (value: "light" | "dark") => {
    if (value === current) return;
    withThemeTransition(() => setTheme(value));
  };

  if (compact) {
    const next = current === "dark" ? "light" : "dark";
    const isDark = current === "dark";
    return (
      <button
        type="button"
        title={`Switch to ${next}`}
        aria-label={`Switch to ${next} theme`}
        onClick={() => selectTheme(next)}
        className={cn(
          "relative flex h-9 w-full cursor-pointer items-center justify-center rounded-ctl text-muted",
          "transition-[background-color,color,transform] duration-150",
          "hover:bg-surface/70 hover:text-foreground active:scale-[0.97]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
          className,
        )}
      >
        <span className="relative size-4">
          <Sun
            size={16}
            strokeWidth={1.75}
            className={cn(
              "absolute inset-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
              isDark
                ? "scale-50 rotate-90 opacity-0"
                : "scale-100 rotate-0 opacity-100",
            )}
            aria-hidden
          />
          <Moon
            size={16}
            strokeWidth={1.75}
            className={cn(
              "absolute inset-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
              isDark
                ? "scale-100 rotate-0 opacity-100"
                : "scale-50 -rotate-90 opacity-0",
            )}
            aria-hidden
          />
        </span>
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className={cn(
        "relative inline-flex w-full items-center rounded-full bg-surface-3 p-1",
        className,
      )}
    >
      {/* Sliding pill — moves between Light / Dark */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full",
          "bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
          "transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
          current === "dark" ? "translate-x-full" : "translate-x-0",
        )}
      />
      {options.map(({ value, label, icon: Icon }) => {
        const active = current === value;
        return (
          <button
            key={value}
            role="radio"
            aria-checked={active}
            title={label}
            onClick={() => selectTheme(value)}
            className={cn(
              "relative z-10 flex h-7 flex-1 cursor-pointer items-center justify-center rounded-full",
              "transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
              active ? "text-foreground" : "text-muted hover:text-foreground",
            )}
          >
            <Icon
              size={14}
              strokeWidth={1.75}
              className={cn(
                "transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                active ? "scale-100" : "scale-90",
              )}
            />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
