import { prisma } from "@/lib/prisma";
import { getTopContent } from "@/lib/analytics";
import { generateIdeas, getModelName, type TopPerformer } from "@/lib/openai";
import { todayInAppTz, addDaysKey, dateKeyToUtc } from "@/lib/dates";

export interface WeeklyIdeasResult {
  weekOf: string;
  ideaCount: number;
  basedOn: number;
}

/**
 * Analyze the last 7 days of content, ask OpenAI for 7 next-week ideas,
 * and store them keyed by the current week date. Idempotent per week.
 */
export async function runWeeklyIdeas(): Promise<WeeklyIdeasResult> {
  const todayKey = todayInAppTz();
  const startKey = addDaysKey(todayKey, -7);

  const top = await getTopContent(startKey, todayKey, 8);

  const performers: TopPerformer[] = top.map((t) => ({
    caption: t.caption,
    productType: t.productType,
    views: t.views,
    likes: t.likes,
    comments: t.comments,
    shares: t.shares,
    saved: t.saved,
    reach: t.reach,
  }));

  const ideas = await generateIdeas(performers);

  await prisma.ideaBatch.upsert({
    where: { weekOf: dateKeyToUtc(todayKey) },
    create: {
      weekOf: dateKeyToUtc(todayKey),
      ideas: JSON.parse(JSON.stringify(ideas)),
      basedOnMediaIds: top.map((t) => t.igMediaId),
      model: getModelName(),
    },
    update: {
      ideas: JSON.parse(JSON.stringify(ideas)),
      basedOnMediaIds: top.map((t) => t.igMediaId),
      model: getModelName(),
    },
  });

  return { weekOf: todayKey, ideaCount: ideas.length, basedOn: top.length };
}
