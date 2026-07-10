import { isConnected } from "@/lib/settings";
import { summarizeRange, getTrend, getTopContent } from "@/lib/analytics";
import { todayInAppTz, addDaysKey, formatDateLabel } from "@/lib/dates";
import {
  PageHeader,
  Card,
  EmptyState,
  SectionTitle,
  StatPanel,
  StatCell,
  buttonClasses,
} from "@/components/ui";
import { MultiLineTrend } from "@/components/charts";
import { chartColors, chartDashes } from "@/lib/chart-tokens";
import { ContentCard } from "@/components/content-card";
import { RangePicker } from "@/components/range-picker";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

function Legend({
  items,
}: {
  items: { name: string; color: string; dash?: string }[];
}) {
  return (
    <span className="flex items-center gap-3">
      {items.map((s) => (
        <span
          key={s.name}
          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted"
        >
          <svg width="14" height="8" aria-hidden>
            <line
              x1="0"
              y1="4"
              x2="14"
              y2="4"
              stroke={s.color}
              strokeWidth="2"
              strokeDasharray={s.dash}
            />
          </svg>
          {s.name}
        </span>
      ))}
    </span>
  );
}

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
            <Link
              href="/settings"
              className={buttonClasses({ variant: "primary", className: "mt-2" })}
            >
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

  const trendSeries = [
    { key: "views", name: "Views", color: chartColors[1], dash: chartDashes[1] },
    { key: "reach", name: "Reach", color: chartColors[2], dash: chartDashes[2] },
    {
      key: "profileViews",
      name: "Profile views",
      color: chartColors[3],
      dash: chartDashes[3],
    },
  ];
  const followerSeries = [
    { key: "followers", name: "Followers", color: chartColors[1] },
  ];

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle={`${formatDateLabel(start)} → ${formatDateLabel(end)}`}
        action={<RangePicker start={start} end={end} today={today} />}
      />

      {!summary.hasData ? (
        <EmptyState
          title="No data in this range"
          description="We only have data from the days the sync has run. Pick a more recent range, or let a few daily syncs accumulate."
        />
      ) : (
        <>
          <StatPanel className="grid-cols-2 lg:grid-cols-4">
            <StatCell
              label="Followers gained"
              value={
                (summary.followersGained >= 0 ? "+" : "") +
                formatNumber(summary.followersGained)
              }
              hint={`${formatNumber(summary.followersStart)} → ${formatNumber(summary.followersEnd)}`}
            />
            <StatCell label="Views" value={formatNumber(summary.views)} />
            <StatCell label="Reach" value={formatNumber(summary.reach)} />
            <StatCell
              label="Profile views"
              value={formatNumber(summary.profileViews)}
            />
            <StatCell label="Likes" value={formatNumber(summary.likes)} />
            <StatCell label="Comments" value={formatNumber(summary.comments)} />
            <StatCell label="Shares" value={formatNumber(summary.shares)} />
            <StatCell label="Saves" value={formatNumber(summary.saved)} />
          </StatPanel>

          <Card className="mt-6">
            <SectionTitle meta={<Legend items={trendSeries} />}>
              Trends
            </SectionTitle>
            <MultiLineTrend data={trend} series={trendSeries} />
          </Card>

          <Card className="mt-4">
            <SectionTitle meta={<Legend items={followerSeries} />}>
              Follower growth
            </SectionTitle>
            <MultiLineTrend data={trend} series={followerSeries} />
          </Card>

          <div className="mt-8">
            <SectionTitle
              meta={`${summary.postsPublished} posts in range`}
              className="mb-4"
            >
              Top content
            </SectionTitle>
            {top.length === 0 ? (
              <p className="text-[13px] text-muted">
                No posts published in this range.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
