import { NextResponse } from "next/server";
import { runWeeklyIdeas } from "@/lib/ideas";
import { isOpenAIConfigured } from "@/lib/config";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST() {
  if (!isOpenAIConfigured()) {
    return NextResponse.json(
      { ok: false, error: "OPENAI_API_KEY is not configured." },
      { status: 400 },
    );
  }
  try {
    const result = await runWeeklyIdeas();
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Idea generation failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
