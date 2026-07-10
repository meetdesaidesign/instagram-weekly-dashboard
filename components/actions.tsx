"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

export function SyncButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function run() {
    setLoading(true);
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Sync failed");
      toast.success("Synced with Instagram");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={run} disabled={loading} className={className}>
      <RefreshCw size={14} className={cn(loading && "animate-spin")} />
      {loading ? "Syncing…" : "Sync now"}
    </Button>
  );
}

export function GenerateIdeasButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function run() {
    setLoading(true);
    try {
      const res = await fetch("/api/ideas/generate", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed");
      toast.success("Fresh ideas generated");
      router.refresh();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to generate ideas",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="primary"
      onClick={run}
      disabled={loading}
      className={className}
    >
      <Sparkles size={14} />
      {loading ? "Generating…" : "Generate ideas"}
    </Button>
  );
}
