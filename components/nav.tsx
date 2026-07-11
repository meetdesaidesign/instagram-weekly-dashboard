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
import { useSidebarCollapsed } from "@/components/sidebar";

const links = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/captions", label: "Captions", icon: PenLine },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Nav() {
  const pathname = usePathname();
  const { collapsed } = useSidebarCollapsed();

  return (
    <aside
      className={cn(
        "hidden shrink-0 overflow-hidden py-5 md:flex md:flex-col",
        "transition-[width,padding] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
        collapsed ? "md:w-16 md:px-2" : "md:w-60 md:px-3",
      )}
    >
      <Link
        href="/"
        title="Weekly Insights"
        className={cn(
          "mb-8 flex items-center rounded-ctl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
          collapsed ? "justify-center" : "gap-2.5 px-3",
        )}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-ctl bg-accent font-mono text-[11px] font-semibold text-on-accent">
          IG
        </span>
        <span
          className={cn(
            "whitespace-nowrap text-sm font-semibold tracking-tight text-foreground",
            collapsed && "sr-only",
          )}
        >
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
              title={label}
              className={cn(
                "flex items-center rounded-ctl text-[13px] transition-[background-color,color,box-shadow] duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
                collapsed ? "justify-center py-2.5" : "gap-3 px-3 py-2",
                active
                  ? "bg-surface font-bold text-foreground shadow-[var(--shadow-elevated)]"
                  : "font-medium text-muted hover:bg-surface/70 hover:text-foreground",
              )}
            >
              <Icon
                size={16}
                className={cn("shrink-0", active && "text-accent")}
              />
              <span className={cn("whitespace-nowrap", collapsed && "sr-only")}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className={cn("mt-auto", !collapsed && "px-3")}>
        <ThemeToggle compact={collapsed} />
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
