import { prisma } from "@/lib/prisma";
import { dateKeyToUtc } from "@/lib/dates";

export interface RangeSummary {
  startKey: string;
  endKey: string;
  followersStart: number;
  followersEnd: number;
  followersGained: number;
  views: number;
  reach: number;
  profileViews: number;
  likes: number;
  comments: number;
  shares: number;
  saved: number;
  postsPublished: number;
  hasData: boolean;
}

export interface TrendPoint {
  date: string;
  followers: number;
  views: number;
  reach: number;
  profileViews: number;
}

export interface TopContentItem {
  id: number;
  igMediaId: string;
  caption: string | null;
  productType: string | null;
  permalink: string | null;
  thumbnailUrl: string | null;
  timestamp: string | null;
  views: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saved: number;
  totalInteractions: number;
  engagement: number;
}

/** Aggregate account + content metrics over an inclusive date range. */
export async function summarizeRange(
  startKey: string,
  endKey: string,
): Promise<RangeSummary> {
  const start = dateKeyToUtc(startKey);
  const end = dateKeyToUtc(endKey);

  const accountSnaps = await prisma.accountSnapshot.findMany({
    where: { date: { gte: start, lte: end } },
    orderBy: { date: "asc" },
  });

  const views = accountSnaps.reduce((s, a) => s + a.views, 0);
  const reach = accountSnaps.reduce((s, a) => s + a.reach, 0);
  const profileViews = accountSnaps.reduce((s, a) => s + a.profileViews, 0);
  const followersStart = accountSnaps[0]?.followersCount ?? 0;
  const followersEnd =
    accountSnaps[accountSnaps.length - 1]?.followersCount ?? followersStart;

  // Content published within the range, using each post's latest snapshot.
  const media = await prisma.media.findMany({
    where: { timestamp: { gte: start, lte: end } },
    include: { snapshots: { orderBy: { date: "desc" }, take: 1 } },
  });

  let likes = 0;
  let comments = 0;
  let shares = 0;
  let saved = 0;
  for (const m of media) {
    const snap = m.snapshots[0];
    if (!snap) continue;
    likes += snap.likes;
    comments += snap.comments;
    shares += snap.shares;
    saved += snap.saved;
  }

  return {
    startKey,
    endKey,
    followersStart,
    followersEnd,
    followersGained: followersEnd - followersStart,
    views,
    reach,
    profileViews,
    likes,
    comments,
    shares,
    saved,
    postsPublished: media.length,
    hasData: accountSnaps.length > 0 || media.length > 0,
  };
}

/** Daily series for charts across a range. */
export async function getTrend(
  startKey: string,
  endKey: string,
): Promise<TrendPoint[]> {
  const start = dateKeyToUtc(startKey);
  const end = dateKeyToUtc(endKey);
  const snaps = await prisma.accountSnapshot.findMany({
    where: { date: { gte: start, lte: end } },
    orderBy: { date: "asc" },
  });
  return snaps.map((s) => ({
    date: s.date.toISOString().slice(0, 10),
    followers: s.followersCount,
    views: s.views,
    reach: s.reach,
    profileViews: s.profileViews,
  }));
}

/** Top performing content published within a range, ranked by views then engagement. */
export async function getTopContent(
  startKey: string,
  endKey: string,
  limit = 6,
): Promise<TopContentItem[]> {
  const start = dateKeyToUtc(startKey);
  const end = dateKeyToUtc(endKey);
  const media = await prisma.media.findMany({
    where: { timestamp: { gte: start, lte: end } },
    include: { snapshots: { orderBy: { date: "desc" }, take: 1 } },
  });

  const items: TopContentItem[] = media.map((m) => {
    const s = m.snapshots[0];
    const likes = s?.likes ?? 0;
    const comments = s?.comments ?? 0;
    const shares = s?.shares ?? 0;
    const saved = s?.saved ?? 0;
    const engagement = likes + comments + shares + saved;
    return {
      id: m.id,
      igMediaId: m.igMediaId,
      caption: m.caption,
      productType: m.productType,
      permalink: m.permalink,
      thumbnailUrl: m.thumbnailUrl,
      timestamp: m.timestamp ? m.timestamp.toISOString() : null,
      views: s?.views ?? 0,
      reach: s?.reach ?? 0,
      likes,
      comments,
      shares,
      saved,
      totalInteractions: s?.totalInteractions ?? engagement,
      engagement,
    };
  });

  items.sort((a, b) => b.views - a.views || b.engagement - a.engagement);
  return items.slice(0, limit);
}

/** Compute percent change safely. */
export function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}
