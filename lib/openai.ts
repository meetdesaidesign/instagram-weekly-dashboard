import OpenAI from "openai";
import { config } from "@/lib/config";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!config.openai.apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }
  if (!client) client = new OpenAI({ apiKey: config.openai.apiKey });
  return client;
}

export interface TopPerformer {
  caption: string | null;
  productType: string | null;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saved: number;
  reach: number;
}

export interface GeneratedIdea {
  title: string;
  format: string;
  hook: string;
  outline: string;
  rationale: string;
}

export async function generateIdeas(
  performers: TopPerformer[],
): Promise<GeneratedIdea[]> {
  const openai = getClient();

  const perfSummary = performers
    .map((p, i) => {
      const cap = (p.caption ?? "(no caption)").slice(0, 220).replace(/\s+/g, " ");
      return `${i + 1}. [${p.productType ?? "POST"}] views=${p.views} reach=${p.reach} likes=${p.likes} comments=${p.comments} shares=${p.shares} saved=${p.saved}\n   caption: ${cap}`;
    })
    .join("\n");

  const prompt = `You are an Instagram growth strategist. Below are this account's best performing posts from the last 7 days, ranked by engagement.

TOP PERFORMERS:
${perfSummary || "(no data yet - propose broadly appealing ideas for this niche)"}

Based on what worked (topics, formats, hooks, and engagement patterns), generate exactly 7 concrete content ideas to try next week. Lean into the winning patterns while adding fresh angles.

Return ONLY valid JSON in this shape:
{
  "ideas": [
    {
      "title": "short catchy idea title",
      "format": "Reel | Carousel | Story | Photo",
      "hook": "the exact opening line/hook to use",
      "outline": "2-3 sentence outline of the content",
      "rationale": "why this should perform, referencing the data"
    }
  ]
}`;

  const completion = await openai.chat.completions.create({
    model: config.openai.model,
    messages: [
      {
        role: "system",
        content:
          "You are a data-driven Instagram content strategist. Always respond with strict JSON.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.8,
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as { ideas?: GeneratedIdea[] };
  return (parsed.ideas ?? []).slice(0, 7);
}

export async function generateCaption(
  topic: string,
  template: string,
  examples?: string,
): Promise<string> {
  const openai = getClient();

  const exampleBlock = examples?.trim()
    ? `\n\nMatch the voice and style of these example captions:\n${examples.trim()}`
    : "";

  const completion = await openai.chat.completions.create({
    model: config.openai.model,
    messages: [
      {
        role: "system",
        content: `${template}${exampleBlock}\n\nReturn ONLY the finished caption text, ready to paste. Do not include explanations, labels, or markdown code fences.`,
      },
      {
        role: "user",
        content: `Write an Instagram caption for a reel about: ${topic}`,
      },
    ],
    temperature: 0.8,
  });

  return (completion.choices[0]?.message?.content ?? "").trim();
}

export function getModelName(): string {
  return config.openai.model;
}
