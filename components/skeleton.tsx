import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-ctl bg-surface-2", className)} />
  );
}

export function FormPageSkeleton({ title }: { title: string }) {
  return (
    <>
      <PageHeader title={title} subtitle="Loading…" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }, (_, i) => (
          <div
            key={i}
            className="rounded-card border border-border bg-surface p-4"
          >
            <Skeleton className="mb-3 h-4 w-36" />
            <Skeleton className="h-28 w-full" />
          </div>
        ))}
      </div>
    </>
  );
}
