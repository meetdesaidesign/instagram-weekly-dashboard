import { NextResponse } from "next/server";
import { generateCaption, getModelName } from "@/lib/openai";
import {
  getSettings,
  DEFAULT_CAPTION_TEMPLATE,
  DEFAULT_CAPTION_EXAMPLES,
} from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { isOpenAIConfigured } from "@/lib/config";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  if (!isOpenAIConfigured()) {
    return NextResponse.json(
      { ok: false, error: "OPENAI_API_KEY is not configured." },
      { status: 400 },
    );
  }
  try {
    const body = (await req.json()) as { topic?: string };
    const topic = body.topic?.trim();
    if (!topic) {
      return NextResponse.json(
        { ok: false, error: "Please provide a reel topic." },
        { status: 400 },
      );
    }

    const settings = await getSettings();
    const template = settings.captionTemplate || DEFAULT_CAPTION_TEMPLATE;
    const examples = settings.captionExamples || DEFAULT_CAPTION_EXAMPLES;

    const output = await generateCaption(topic, template, examples);

    const run = await prisma.captionRun.create({
      data: {
        topic,
        output,
        templateUsed: template,
        model: getModelName(),
      },
    });

    return NextResponse.json({ ok: true, output, id: run.id });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to generate caption";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
