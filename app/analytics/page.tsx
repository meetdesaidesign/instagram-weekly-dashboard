import { isConnected } from "@/lib/settings";
import {
  summarizeRange,
  getTrend,
  getTopContent,
} from "@/lib/analytics";
import { todayInAppTz, addDaysKey } from "@/lib/dates";
import { PageHeader, StatCard, Card, EmptyState } from "@/components/ui";
import { MultiLineTrend } from "@/components/charts";
import { ContentCard } from "@/components/content-card";
import { RangePicker } from "@/components/range-picker";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  const connected = await isConnected();
  const params = await searchParams;
  const today = todayInAppTz();
  const end = params.end && params.end <= today ? params.end : today;
  const start =
    params.start && params.start <= end ? params.start : addDaysKey(end, -29);

  if (!connected) {
    return (
      <>
        <PageHeader title="Analytics" subtitle="Custom date range performance" />
        <EmptyState
          title="Connect your account first"
          description="Once connected and after a few daily syncs, you can explore any custom date range here."
          action={
            <Link href="/settings" className="btn brand-gradient btn-primary mt-2">
              Go to Settings
            </Link>
          }
        />
      </>
    );
  }

  const [summary, trend, top] = await Promise.all([
    summarizeRange(start, end),
    getTrend(start, end),
    getTopContent(start, end, 12),
  ]);

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Explore any custom date range"
        action={<RangePicker start={start} end={end} />}
      />

      {!summary.hasData ? (
        <EmptyState
          title="No data in this range"
          description="We only have data from the days the sync has run. Pick a more recent range, or let a few daily syncs accumulate."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Followers gained"
              value={
                (summary.followersGained >= 0 ? "+" : "") +
                formatNumber(summary.followersGained)
              }
              hint={`${formatNumber(summary.followersStart)} → ${formatNumber(summary.followersEnd)}`}
              accent
            />
            <StatCard label="Views" value={formatNumber(summary.views)} />
            <StatCard label="Reach" value={formatNumber(summary.reach)} />
            <StatCard
              label="Profile views"
              value={formatNumber(summary.profileViews)}
            />
            <StatCard label="Likes" value={formatNumber(summary.likes)} />
            <StatCard label="Comments" value={formatNumber(summary.comments)} />
            <StatCard label="Shares" value={formatNumber(summary.shares)} />
            <StatCard label="Saves" value={formatNumber(summary.saved)} />
          </div>

          <Card className="mt-6">
            <h3 className="text-sm font-semibold mb-3">Trends</h3>
            <MultiLineTrend
              data={trend}
              series={[
                { key: "views", name: "Views", color: "#f77737" },
                { key: "reach", name: "Reach", color: "#d6377b" },
                { key: "profileViews", name: "Profile views", color: "#a537d6" },
              ]}
            />
          </Card>

          <Card className="mt-4">
            <h3 className="text-sm font-semibold mb-3">Follower growth</h3>
            <MultiLineTrend
              data={trend}
              series={[
                { key: "followers", name: "Followers", color: "#34d399" },
              ]}
            />
          </Card>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">
              Top content · {summary.postsPublished} posts in range
            </h2>
            {top.length === 0 ? (
              <p className="text-sm text-muted">
                No posts published in this range.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {top.map((item, i) => (
                  <ContentCard key={item.id} item={item} rank={i + 1} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
