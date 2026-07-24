import Link from "next/link";
import { Eye, Heart, UserPlus } from "lucide-react";
import { isConnected } from "@/lib/settings";
import {
  summarizeRange,
  getTrend,
  getTopContent,
  pctChange,
} from "@/lib/analytics";
import {
  todayInAppTz,
  addDaysKey,
  formatDateLabel,
  saturdayWeekContaining,
  saturdayWeekFilled,
  saturdayOnOrBefore,
} from "@/lib/dates";
import {
  Card,
  EmptyState,
  SectionTitle,
  WeekStrip,
  buttonClasses,
} from "@/components/ui";
import { MultiLineTrend } from "@/components/charts";
import { chartColors, chartDashes } from "@/lib/chart-tokens";
import { ContentCard } from "@/components/content-card";
import { SyncButton } from "@/components/actions";
import { WeekNav } from "@/components/week-nav";
import { formatNumber, formatDelta, formatPercent, cn } from "@/lib/utils";
import type { ReactNode } from "react";

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

function MetricChip({
  icon: Icon,
  tone,
}: {
  icon: typeof Heart;
  tone: "followers" | "likes" | "views";
}) {
  return (
    <span
      className={cn(
        "relative mx-1.5 inline-flex h-[1.15em] w-[1.55em] shrink-0 items-center justify-center align-[-0.2em]",
        "rounded-[0.28em] border border-border bg-surface shadow-[var(--shadow-elevated)]",
      )}
      aria-hidden
    >
      <Icon
        className={cn(
          "h-[0.55em] w-[0.55em]",
          tone === "followers" && "text-accent",
          tone === "likes" && "text-danger",
          tone === "views" && "text-chart-2",
        )}
        strokeWidth={2.25}
      />
    </span>
  );
}

function HeroStat({ children }: { children: ReactNode }) {
  return (
    <span className="font-semibold tabular-nums tracking-[-0.03em] text-foreground">
      {children}
    </span>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const connected = await isConnected();
  const params = await searchParams;
  const today = todayInAppTz();

  const requested =
    params.week && /^\d{4}-\d{2}-\d{2}$/.test(params.week)
      ? saturdayOnOrBefore(params.week)
      : undefined;
  const { start: weekStart, end: weekEnd } = saturdayWeekContaining(requested);
  // In-progress weeks only have data through today.
  const dataEnd = weekEnd > today ? today : weekEnd;
  const filled = saturdayWeekFilled(weekStart, today);
  const isCurrent = weekStart === saturdayOnOrBefore(today);

  if (!connected) {
    return (
      <div className="mx-auto max-w-2xl pt-10">
        <EmptyState
          title="Connect your Instagram account"
          description="Link your Instagram Business or Creator account to start tracking weekly followers, likes, and reel views. Data syncs automatically every day at 12pm IST."
          action={
            <Link
              href="/settings"
              className={buttonClasses({ variant: "primary", className: "mt-2" })}
            >
              Go to Settings
            </Link>
          }
        />
      </div>
    );
  }

  const prevStart = addDaysKey(weekStart, -7);
  const prevEnd = weekStart;

  const [current, previous, trend, topContent] = await Promise.all([
    summarizeRange(weekStart, dataEnd),
    summarizeRange(prevStart, prevEnd),
    getTrend(weekStart, dataEnd),
    getTopContent(weekStart, dataEnd, 8),
  ]);

  const followerSeries = [
    { key: "followers", name: "Followers", color: chartColors[1] },
  ];
  const trendSeries = [
    { key: "views", name: "Views", color: chartColors[1], dash: chartDashes[1] },
    { key: "reach", name: "Reach", color: chartColors[2], dash: chartDashes[2] },
  ];

  const weekLabel = `${formatDateLabel(weekStart)} → ${formatDateLabel(weekEnd)}`;
  const gained = current.followersGained;
  const gainedLabel = formatDelta(gained);

  return (
    <>
      {/* Hero */}
      <section className="relative pb-14 pt-4 sm:pb-20 sm:pt-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-2">
              {isCurrent ? "This week" : "Week of"} · Sat → Sat
            </p>
            <WeekStrip filled={filled} className="w-28" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <WeekNav start={weekStart} label={weekLabel} today={today} />
            <SyncButton />
          </div>
        </div>

        {!current.hasData ? (
          <EmptyState
            title="No data in this week yet"
            description="We only have data from the days the sync has run. Come back after the next sync, or run one now."
            action={<SyncButton />}
          />
        ) : (
          <h1
            className={cn(
              "max-w-4xl text-[clamp(2.25rem,6.5vw,4.5rem)] font-bold leading-[1.08] tracking-[-0.035em] text-foreground",
              "text-balance rise-in",
            )}
          >
            You gained{" "}
            <HeroStat>
              {gainedLabel}
            </HeroStat>
            <MetricChip icon={UserPlus} tone="followers" />
            followers —{" "}
            <HeroStat>{formatNumber(current.likes)}</HeroStat>
            <MetricChip icon={Heart} tone="likes" />
            likes and{" "}
            <HeroStat>{formatNumber(current.reelViews)}</HeroStat>
            <MetricChip icon={Eye} tone="views" />
            reel views
            <span className="text-muted"> on what you posted.</span>
          </h1>
        )}

        {current.hasData && (
          <p
            className="mt-8 max-w-md text-[15px] leading-relaxed text-muted rise-in"
            style={{ ["--stagger-i" as string]: 1 }}
          >
            {current.reelsPublished === 0
              ? "No reels published this week yet."
              : `${current.reelsPublished} reel${current.reelsPublished === 1 ? "" : "s"} · ${current.postsPublished} total post${current.postsPublished === 1 ? "" : "s"}`}
            {previous.hasData && gained !== previous.followersGained ? (
              <>
                {" · "}
                <span
                  className={
                    gained >= previous.followersGained
                      ? "text-success"
                      : "text-danger"
                  }
                >
                  {formatPercent(pctChange(gained, previous.followersGained))} vs
                  last week
                </span>
              </>
            ) : null}
          </p>
        )}
      </section>

      {current.hasData && (
        <div className="space-y-6 border-t border-border pt-10">
          <Card>
            <SectionTitle meta={<Legend items={followerSeries} />}>
              Follower growth
            </SectionTitle>
            <MultiLineTrend data={trend} series={followerSeries} />
          </Card>

          <Card>
            <SectionTitle meta={<Legend items={trendSeries} />}>
              Reach & views
            </SectionTitle>
            <MultiLineTrend data={trend} series={trendSeries} />
          </Card>

          <div>
            <SectionTitle
              meta={`${current.postsPublished} posts`}
              className="mb-4"
            >
              Top content
            </SectionTitle>
            {topContent.length === 0 ? (
              <p className="text-[13px] text-muted">
                No posts published this week.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {topContent.map((item, i) => (
                  <ContentCard key={item.id} item={item} rank={i + 1} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
