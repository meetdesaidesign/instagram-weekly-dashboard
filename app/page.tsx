import Link from "next/link";
import { isConnected } from "@/lib/settings";
import {
  summarizeRange,
  getTrend,
  getTopContent,
  pctChange,
} from "@/lib/analytics";
import { todayInAppTz, addDaysKey } from "@/lib/dates";
import { PageHeader, StatCard, Card, EmptyState } from "@/components/ui";
import { AreaTrend } from "@/components/charts";
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
            <Link href="/settings" className="btn brand-gradient btn-primary mt-2">
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

  return (
    <>
      <PageHeader
        title="This week"
        subtitle={`${thisStart} → ${today} · compared to previous 7 days`}
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Followers gained"
              value={
                (thisWeek.followersGained >= 0 ? "+" : "") +
                formatNumber(thisWeek.followersGained)
              }
              delta={pctChange(
                thisWeek.followersGained,
                prevWeek.followersGained,
              )}
              hint={`${formatFullNumber(thisWeek.followersEnd)} total`}
              accent
            />
            <StatCard
              label="Views"
              value={formatNumber(thisWeek.views)}
              delta={pctChange(thisWeek.views, prevWeek.views)}
            />
            <StatCard
              label="Likes"
              value={formatNumber(thisWeek.likes)}
              delta={pctChange(thisWeek.likes, prevWeek.likes)}
              hint="on posts published this week"
            />
            <StatCard
              label="Shares"
              value={formatNumber(thisWeek.shares)}
              delta={pctChange(thisWeek.shares, prevWeek.shares)}
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <StatCard label="Reach" value={formatNumber(thisWeek.reach)} delta={pctChange(thisWeek.reach, prevWeek.reach)} />
            <StatCard
              label="Profile views"
              value={formatNumber(thisWeek.profileViews)}
              delta={pctChange(thisWeek.profileViews, prevWeek.profileViews)}
            />
            <StatCard
              label="Comments"
              value={formatNumber(thisWeek.comments)}
              delta={pctChange(thisWeek.comments, prevWeek.comments)}
            />
            <StatCard
              label="Saves"
              value={formatNumber(thisWeek.saved)}
              delta={pctChange(thisWeek.saved, prevWeek.saved)}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2 mt-6">
            <Card>
              <h3 className="text-sm font-semibold mb-3">
                Followers · last 30 days
              </h3>
              <AreaTrend
                data={followersTrend}
                dataKey="followers"
                color="#d6377b"
              />
            </Card>
            <Card>
              <h3 className="text-sm font-semibold mb-3">
                Daily views · last 30 days
              </h3>
              <AreaTrend data={viewsTrend} dataKey="views" color="#f77737" />
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">
              Most popular content this week
            </h2>
            {topContent.length === 0 ? (
              <p className="text-sm text-muted">
                No posts published in this window.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
