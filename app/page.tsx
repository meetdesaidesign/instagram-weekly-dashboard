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
  WeekStrip,
  buttonClasses,
} from "@/components/ui";
import { AreaTrend } from "@/components/charts";
import { chartColors } from "@/lib/chart-tokens";
import { ContentCard } from "@/components/content-card";
import { SyncButton } from "@/components/actions";
import { formatNumber, formatFullNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const connected = await isConnected();

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

  const today = todayInAppTz();
  const thisStart = addDaysKey(today, -6);
  const prevEnd = addDaysKey(today, -7);
  const prevStart = addDaysKey(today, -13);

  const [thisWeek, prevWeek, trend, topContent] = await Promise.all([
    summarizeRange(thisStart, today),
    summarizeRange(prevStart, prevEnd),
    getTrend(addDaysKey(today, -29), today),
    getTopContent(thisStart, today, 8),
  ]);

  const followersTrend: { date: string; followers: number }[] = trend.map(
    (t) => ({ date: t.date, followers: t.followers }),
  );
  const viewsTrend = trend.map((t) => ({ date: t.date, views: t.views }));
  const syncedDays = trend.filter((t) => t.date >= thisStart).length;

  return (
    <>
      <PageHeader
        title="This week"
        subtitle={`${formatDateLabel(thisStart)} → ${formatDateLabel(today)} · compared to previous 7 days`}
        action={<SyncButton />}
      />

      {!thisWeek.hasData ? (
        <EmptyState
          title="No data yet"
          description="Your account is connected but we haven't collected metrics yet. Run a sync now, or wait for the daily 12pm IST update. Historical trends build up over time."
          action={<SyncButton />}
        />
      ) : (
        <>
          <StatPanel className="grid-cols-2 lg:grid-cols-4">
            <StatCell
              hero
              label="Followers gained"
              value={
                (thisWeek.followersGained >= 0 ? "+" : "") +
                formatNumber(thisWeek.followersGained)
              }
              delta={pctChange(
                thisWeek.followersGained,
                prevWeek.followersGained,
              )}
              hint={`${formatFullNumber(thisWeek.followersEnd)} total followers`}
              className="col-span-2 row-span-2"
            >
              <div className="mt-auto pt-5">
                <WeekStrip filled={syncedDays} />
                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-2">
                  {syncedDays}/7 days synced
                </p>
              </div>
            </StatCell>
            <StatCell
              label="Views"
              value={formatNumber(thisWeek.views)}
              delta={pctChange(thisWeek.views, prevWeek.views)}
            />
            <StatCell
              label="Reach"
              value={formatNumber(thisWeek.reach)}
              delta={pctChange(thisWeek.reach, prevWeek.reach)}
            />
            <StatCell
              label="Likes"
              value={formatNumber(thisWeek.likes)}
              delta={pctChange(thisWeek.likes, prevWeek.likes)}
              hint="on posts published this week"
            />
            <StatCell
              label="Shares"
              value={formatNumber(thisWeek.shares)}
              delta={pctChange(thisWeek.shares, prevWeek.shares)}
            />
            <StatCell
              label="Comments"
              value={formatNumber(thisWeek.comments)}
              delta={pctChange(thisWeek.comments, prevWeek.comments)}
            />
            <StatCell
              label="Saves"
              value={formatNumber(thisWeek.saved)}
              delta={pctChange(thisWeek.saved, prevWeek.saved)}
            />
            <StatCell
              label="Profile views"
              value={formatNumber(thisWeek.profileViews)}
              delta={pctChange(thisWeek.profileViews, prevWeek.profileViews)}
            />
            <StatCell
              label="Posts published"
              value={formatNumber(thisWeek.postsPublished)}
              delta={pctChange(
                thisWeek.postsPublished,
                prevWeek.postsPublished,
              )}
            />
          </StatPanel>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card>
              <SectionTitle meta="30 days">Followers</SectionTitle>
              <AreaTrend
                data={followersTrend}
                dataKey="followers"
                color={chartColors[1]}
              />
            </Card>
            <Card>
              <SectionTitle meta="30 days">Daily views</SectionTitle>
              <AreaTrend
                data={viewsTrend}
                dataKey="views"
                color={chartColors[2]}
              />
            </Card>
          </div>

          <div className="mt-8">
            <SectionTitle
              meta={`top ${topContent.length}`}
              className="mb-4"
            >
              Most popular content this week
            </SectionTitle>
            {topContent.length === 0 ? (
              <p className="text-[13px] text-muted">
                No posts published in this window.
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
