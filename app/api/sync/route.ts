import { NextResponse } from "next/server";
import { runDailySync } from "@/lib/sync";
import { isConnected } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST() {
  if (!(await isConnected())) {
    return NextResponse.json(
      { ok: false, error: "Instagram is not connected." },
      { status: 400 },
    );
  }
  try {
    const result = await runDailySync();
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
