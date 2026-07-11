"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Lightbulb,
  PenLine,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme";

const links = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/captions", label: "Captions", icon: PenLine },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <aside className="hidden shrink-0 px-3 py-5 md:flex md:w-60 md:flex-col">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2.5 rounded-ctl px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-ctl bg-accent font-mono text-[11px] font-semibold text-on-accent">
          IG
        </span>
        <span className="text-sm font-semibold tracking-tight text-foreground">
          Weekly Insights
        </span>
      </Link>
      <nav className="flex flex-col gap-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-ctl px-3 py-2 text-[13px] transition-[background-color,color,box-shadow] duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
                active
                  ? "bg-surface font-bold text-foreground shadow-[var(--shadow-elevated)]"
                  : "font-medium text-muted hover:bg-surface/70 hover:text-foreground",
              )}
            >
              <Icon size={16} className={cn(active && "text-accent")} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-3">
        <ThemeToggle />
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-around border-t border-border bg-background/95 py-1.5 backdrop-blur md:hidden">
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex min-w-14 flex-col items-center gap-1 rounded-ctl px-2 py-1.5 text-[10px]",
              active ? "font-bold text-accent" : "font-medium text-muted",
            )}
          >
            <Icon size={19} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
