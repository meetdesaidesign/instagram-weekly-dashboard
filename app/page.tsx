import Link from "next/link";
import { isConnected } from "@/lib/settings";
import {
  summarizeRange,
  getTrend,
  getTopContent,
  pctChange,
} from "@/lib/analytics";
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
import { SyncButton } from "@/components/actions";
import { RangePicker } from "@/components/range-picker";
import { formatNumber, formatFullNumber, formatDelta } from "@/lib/utils";

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

function rangeTitle(dayCount: number, endIsToday: boolean): string {
  if (endIsToday && [7, 14, 30, 90].includes(dayCount)) {
    return `Last ${dayCount} days`;
  }
  return "Custom range";
}

function inclusiveDayCount(start: string, end: string): number {
  return (
    Math.round(
      (Date.parse(end + "T00:00:00Z") - Date.parse(start + "T00:00:00Z")) /
        86_400_000,
    ) + 1
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  const connected = await isConnected();
  const params = await searchParams;
  const today = todayInAppTz();
  const end = params.end && params.end <= today ? params.end : today;
  const start =
    params.start && params.start <= end ? params.start : addDaysKey(end, -6);

  if (!connected) {
    return (
      <>
        <PageHeader
          title="Dashboard"
          subtitle="Weekly performance of your Instagram account"
        />
        <EmptyState
          title="Connect your Instagram account"
          description="Link your Instagram Business or Creator account to start tracking weekly followers, views, and top content. Data syncs automatically every day at 12pm IST."
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

  const dayCount = inclusiveDayCount(start, end);
  const prevEnd = addDaysKey(start, -1);
  const prevStart = addDaysKey(prevEnd, -(dayCount - 1));

  const [current, previous, trend, topContent] = await Promise.all([
    summarizeRange(start, end),
    summarizeRange(prevStart, prevEnd),
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
        title={rangeTitle(dayCount, end === today)}
        subtitle={`${formatDateLabel(start)} → ${formatDateLabel(end)} · compared to previous ${dayCount} days`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <RangePicker start={start} end={end} today={today} />
            <SyncButton />
          </div>
        }
      />

      {!current.hasData ? (
        <EmptyState
          title="No data in this range"
          description="We only have data from the days the sync has run. Pick a more recent range, or run a sync now."
          action={<SyncButton />}
        />
      ) : (
        <>
          <StatPanel className="grid-cols-1 sm:grid-cols-2">
            <StatCell
              hero
              label="Followers"
              value={formatFullNumber(current.followersEnd)}
              delta={pctChange(
                current.followersGained,
                previous.followersGained,
              )}
              hint={`${formatDelta(current.followersGained)} gained in range`}
            />
            <StatCell
              hero
              label="Views"
              value={formatNumber(current.views)}
              delta={pctChange(current.views, previous.views)}
              hint={`vs previous ${dayCount} days`}
            />
          </StatPanel>

          <SectionTitle className="mt-8 mb-3">Engagement</SectionTitle>
          <StatPanel className="grid-cols-2 lg:grid-cols-4">
            <StatCell
              label="Reach"
              value={formatNumber(current.reach)}
              delta={pctChange(current.reach, previous.reach)}
            />
            <StatCell
              label="Profile views"
              value={formatNumber(current.profileViews)}
              delta={pctChange(current.profileViews, previous.profileViews)}
            />
            <StatCell
              label="Likes"
              value={formatNumber(current.likes)}
              delta={pctChange(current.likes, previous.likes)}
              hint="on posts published in range"
            />
            <StatCell
              label="Comments"
              value={formatNumber(current.comments)}
              delta={pctChange(current.comments, previous.comments)}
            />
            <StatCell
              label="Shares"
              value={formatNumber(current.shares)}
              delta={pctChange(current.shares, previous.shares)}
            />
            <StatCell
              label="Saves"
              value={formatNumber(current.saved)}
              delta={pctChange(current.saved, previous.saved)}
            />
            <StatCell
              label="Posts published"
              value={formatNumber(current.postsPublished)}
              delta={pctChange(
                current.postsPublished,
                previous.postsPublished,
              )}
              className="col-span-2"
            />
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
              meta={`${current.postsPublished} posts in range`}
              className="mb-4"
            >
              Top content
            </SectionTitle>
            {topContent.length === 0 ? (
              <p className="text-[13px] text-muted">
                No posts published in this range.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {topContent.map((item, i) => (
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
