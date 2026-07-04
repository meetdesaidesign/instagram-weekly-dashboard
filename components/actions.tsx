"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function SyncButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  async function run() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Sync failed");
      setMsg("Synced");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(null), 4000);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {msg && <span className="text-xs text-muted">{msg}</span>}
      <button
        onClick={run}
        disabled={loading}
        className={cn("btn btn-secondary", className)}
      >
        <RefreshCw size={16} className={cn(loading && "animate-spin")} />
        {loading ? "Syncing…" : "Sync now"}
      </button>
    </div>
  );
}

export function GenerateIdeasButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  async function run() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/ideas/generate", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(null), 5000);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {msg && <span className="text-xs text-danger">{msg}</span>}
      <button
        onClick={run}
        disabled={loading}
        className={cn("btn brand-gradient btn-primary", className)}
      >
        <Sparkles size={16} />
        {loading ? "Generating…" : "Generate ideas"}
      </button>
    </div>
  );
}
