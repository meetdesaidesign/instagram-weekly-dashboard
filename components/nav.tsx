"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarRange, Lightbulb, PenLine, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/analytics", label: "Analytics", icon: CalendarRange },
  { href: "/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/captions", label: "Captions", icon: PenLine },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-surface/50 backdrop-blur px-3 py-5">
      <Link href="/" className="flex items-center gap-2 px-3 mb-8">
        <span className="brand-gradient h-8 w-8 rounded-xl flex items-center justify-center text-white font-black">
          IG
        </span>
        <span className="font-semibold tracking-tight">Weekly Insights</span>
      </Link>
      <nav className="flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-surface-2 text-foreground"
                  : "text-muted hover:text-foreground hover:bg-surface-2/60",
              )}
            >
              <Icon size={18} className={cn(active && "brand-text")} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-3 text-xs text-[var(--muted-2)]">
        Auto-syncs daily at 12pm IST
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border bg-surface/90 backdrop-blur flex justify-around py-2">
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 px-2 py-1 text-[10px] font-medium",
              active ? "brand-text" : "text-muted",
            )}
          >
            <Icon size={20} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
