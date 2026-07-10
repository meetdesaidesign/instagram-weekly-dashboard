import { cn } from "@/lib/utils";
import { PageHeader, StatPanel, WeekStrip } from "@/components/ui";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-ctl bg-surface-2", className)} />
  );
}

function StatCellSkeleton({
  hero,
  className,
}: {
  hero?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col bg-surface", hero ? "p-5" : "p-4", className)}>
      <Skeleton className="h-2.5 w-20" />
      <Skeleton className={cn("mt-3", hero ? "h-9 w-32" : "h-6 w-16")} />
      {hero && (
        <div className="mt-auto pt-5">
          <WeekStrip filled={0} />
        </div>
      )}
    </div>
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

/** Full dashboard/analytics shaped skeleton */
export function MetricsPageSkeleton({
  title,
  contentCards = 4,
}: {
  title: string;
  contentCards?: number;
}) {
  return (
    <>
      <PageHeader title={title} subtitle="Loading…" />
      <StatPanel className="grid-cols-2 lg:grid-cols-4">
        <StatCellSkeleton hero className="col-span-2 row-span-2" />
        {Array.from({ length: 7 }, (_, i) => (
          <StatCellSkeleton key={i} />
        ))}
      </StatPanel>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCardSkeleton />
        <ChartCardSkeleton />
      </div>
      <div className="mt-8">
        <Skeleton className="mb-4 h-3.5 w-48" />
        <ContentGridSkeleton count={contentCards} />
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
