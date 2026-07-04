import { prisma } from "@/lib/prisma";
import { getValidToken } from "@/lib/settings";
import {
  getProfile,
  getAccountInsights,
  getMedia,
  getMediaInsights,
} from "@/lib/instagram";
import { todayUtcDate } from "@/lib/dates";

export interface SyncResult {
  date: string;
  followersCount: number;
  views: number;
  reach: number;
  profileViews: number;
  mediaSynced: number;
  mediaInsightsSynced: number;
  errors: string[];
}

/**
 * Pull the latest account + media metrics and store today's daily snapshot.
 * Idempotent per day: re-running updates the same-day rows.
 */
export async function runDailySync(): Promise<SyncResult> {
  const errors: string[] = [];
  const { token, userId } = await getValidToken();
  const today = todayUtcDate();

  // 1. Account profile + insights
  const profile = await getProfile(token);
  const insights = await getAccountInsights(userId, token);

  await prisma.setting.update({
    where: { id: 1 },
    data: { igUsername: profile.username },
  });

  await prisma.accountSnapshot.upsert({
    where: { date: today },
    create: {
      date: today,
      followersCount: profile.followersCount,
      views: insights.views,
      reach: insights.reach,
      profileViews: insights.profileViews,
    },
    update: {
      followersCount: profile.followersCount,
      views: insights.views,
      reach: insights.reach,
      profileViews: insights.profileViews,
    },
  });

  // 2. Media list
  const mediaList = await getMedia(userId, token);
  let mediaSynced = 0;
  const dbMedia: { id: number; igMediaId: string; productType: string | null; timestamp: Date | null }[] =
    [];

  for (const m of mediaList) {
    const ts = m.timestamp ? new Date(m.timestamp) : null;
    const row = await prisma.media.upsert({
      where: { igMediaId: m.igMediaId },
      create: {
        igMediaId: m.igMediaId,
        caption: m.caption,
        mediaType: m.mediaType,
        productType: m.productType,
        permalink: m.permalink,
        thumbnailUrl: m.thumbnailUrl,
        mediaUrl: m.mediaUrl,
        timestamp: ts,
      },
      update: {
        caption: m.caption,
        mediaType: m.mediaType,
        productType: m.productType,
        permalink: m.permalink,
        thumbnailUrl: m.thumbnailUrl,
        mediaUrl: m.mediaUrl,
        timestamp: ts,
      },
    });
    dbMedia.push({
      id: row.id,
      igMediaId: m.igMediaId,
      productType: m.productType,
      timestamp: ts,
    });
    mediaSynced++;
  }

  // 3. Media insights (bounded to recent posts to limit API calls)
  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
  const recent = dbMedia
    .filter((m) => !m.timestamp || m.timestamp.getTime() >= cutoff)
    .slice(0, 60);

  const mediaByIg = new Map(mediaList.map((m) => [m.igMediaId, m]));
  let mediaInsightsSynced = 0;

  for (const m of recent) {
    try {
      const ins = await getMediaInsights(
        { igMediaId: m.igMediaId, productType: m.productType },
        token,
      );
      const base = mediaByIg.get(m.igMediaId);
      const likes = base?.likeCount ?? 0;
      const comments = base?.commentsCount ?? 0;

      await prisma.mediaSnapshot.upsert({
        where: { mediaId_date: { mediaId: m.id, date: today } },
        create: {
          mediaId: m.id,
          date: today,
          likes,
          comments,
          shares: ins.shares,
          saved: ins.saved,
          reach: ins.reach,
          views: ins.views,
          totalInteractions:
            ins.totalInteractions ||
            likes + comments + ins.shares + ins.saved,
        },
        update: {
          likes,
          comments,
          shares: ins.shares,
          saved: ins.saved,
          reach: ins.reach,
          views: ins.views,
          totalInteractions:
            ins.totalInteractions ||
            likes + comments + ins.shares + ins.saved,
        },
      });
      mediaInsightsSynced++;
    } catch (err) {
      errors.push(
        `media ${m.igMediaId}: ${err instanceof Error ? err.message : "unknown"}`,
      );
    }
  }

  return {
    date: today.toISOString().slice(0, 10),
    followersCount: profile.followersCount,
    views: insights.views,
    reach: insights.reach,
    profileViews: insights.profileViews,
    mediaSynced,
    mediaInsightsSynced,
    errors,
  };
}
