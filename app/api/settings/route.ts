import { NextResponse } from "next/server";
import { updateSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      captionTemplate?: string;
      captionExamples?: string;
    };
    const updated = await updateSettings({
      captionTemplate: body.captionTemplate,
      captionExamples: body.captionExamples,
    });
    return NextResponse.json({ ok: true, settings: { updatedAt: updated.updatedAt } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save settings";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
