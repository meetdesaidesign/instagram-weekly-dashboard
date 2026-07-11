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

  if (compact) {
    const next = current === "dark" ? "light" : "dark";
    const Icon = current === "dark" ? Moon : Sun;
    return (
      <button
        type="button"
        title={`Switch to ${next}`}
        aria-label={`Switch to ${next} theme`}
        onClick={() => setTheme(next)}
        className={cn(
          "flex h-9 w-full cursor-pointer items-center justify-center rounded-ctl text-muted",
          "transition-[background-color,color,transform] duration-150",
          "hover:bg-surface/70 hover:text-foreground active:scale-[0.97]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
          className,
        )}
      >
        <Icon size={16} strokeWidth={1.75} />
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className={cn(
        "inline-flex w-full items-center rounded-full bg-surface-3 p-1",
        className,
      )}
    >
      {options.map(({ value, label, icon: Icon }) => {
        const active = current === value;
        return (
          <button
            key={value}
            role="radio"
            aria-checked={active}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              "flex h-7 flex-1 cursor-pointer items-center justify-center rounded-full transition-[background-color,color,box-shadow] duration-150",
              active
                ? "bg-surface text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                : "text-muted hover:text-foreground",
            )}
          >
            <Icon size={14} strokeWidth={1.75} />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
