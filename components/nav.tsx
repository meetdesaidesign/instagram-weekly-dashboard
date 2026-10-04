"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme";

const links = [
  { href: "/", label: "Write", icon: PenLine },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-ctl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-ctl bg-accent font-mono text-[11px] font-semibold text-on-accent">
            C
          </span>
          <span className="hidden text-sm font-semibold tracking-tight text-foreground sm:inline">
            Captions
          </span>
        </Link>

        <nav className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto scrollbar-thin">
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-ctl px-2.5 py-1.5 text-[13px] transition-[background-color,color] duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
                  active
                    ? "bg-surface font-semibold text-foreground shadow-[var(--shadow-elevated)]"
                    : "font-medium text-muted hover:bg-surface/70 hover:text-foreground",
                )}
              >
                <Icon
                  size={15}
                  className={cn("shrink-0", active && "text-accent")}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        <ThemeToggle compact className="shrink-0" />
      </div>
    </header>
  );
}
