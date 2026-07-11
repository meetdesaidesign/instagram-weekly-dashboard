"use client";

import { useCallback, useSyncExternalStore } from "react";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "sidebar-collapsed";
const CHANGE_EVENT = "sidebar-collapsed-change";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) === "1";
}

function getServerSnapshot() {
  return false;
}

function writeCollapsed(value: boolean) {
  window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useSidebarCollapsed() {
  const collapsed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setCollapsed = useCallback((value: boolean) => {
    writeCollapsed(value);
  }, []);

  const toggle = useCallback(() => {
    writeCollapsed(!getSnapshot());
  }, []);

  return { collapsed, toggle, setCollapsed };
}

export function SidebarToggle({ className }: { className?: string }) {
  const { collapsed, toggle } = useSidebarCollapsed();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-expanded={!collapsed}
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={cn(
        "hidden h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-ctl text-muted",
        "transition-[background-color,color,transform] duration-150",
        "hover:bg-surface-2 hover:text-foreground",
        "active:scale-[0.97]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
        "md:inline-flex",
        className,
      )}
    >
      <PanelLeft size={16} strokeWidth={1.75} />
    </button>
  );
}
