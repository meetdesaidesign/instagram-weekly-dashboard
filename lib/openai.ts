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
