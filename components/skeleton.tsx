import { cn } from "@/lib/utils";
import { PageHeader, WeekStrip } from "@/components/ui";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-ctl bg-surface-2", className)} />
  );
}

function ChartCardSkeleton() {
  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-2.5 w-12" />
      </div>
      <Skeleton className="h-[220px] w-full" />
    </div>
  );
}

function ContentGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-card border border-border bg-surface"
        >
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="flex flex-col gap-2 p-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Home week report skeleton — typography hero first. */
export function MetricsPageSkeleton({
  title = "This week",
  contentCards = 4,
}: {
  title?: string;
  contentCards?: number;
}) {
  return (
    <>
      <section className="pb-14 pt-4 sm:pb-20 sm:pt-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-2">
              {title} · Sat → Sat
            </p>
            <WeekStrip filled={0} className="w-28" />
          </div>
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-12 w-[min(100%,28rem)] sm:h-16" />
          <Skeleton className="h-12 w-[min(100%,36rem)] sm:h-16" />
          <Skeleton className="h-12 w-[min(90%,24rem)] sm:h-16" />
        </div>
        <Skeleton className="mt-8 h-4 w-64" />
      </section>
      <div className="space-y-6 border-t border-border pt-10">
        <ChartCardSkeleton />
        <ChartCardSkeleton />
        <div>
          <Skeleton className="mb-4 h-3.5 w-48" />
          <ContentGridSkeleton count={contentCards} />
        </div>
      </div>
    </>
  );
}

export function ListPageSkeleton({ title }: { title: string }) {
  return (
    <>
      <PageHeader title={title} subtitle="Loading…" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4"
          >
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    </>
  );
}

export function FormPageSkeleton({ title }: { title: string }) {
  return (
    <>
      <PageHeader title={title} subtitle="Loading…" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="rounded-card border border-border bg-surface p-4"
          >
            <Skeleton className="mb-3 h-4 w-36" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    </>
  );
}
