import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  exchangeCodeForToken,
  getLongLivedToken,
  getProfile,
} from "@/lib/instagram";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CAPTION_TEMPLATE } from "@/lib/settings";
import { runDailySync } from "@/lib/sync";
import { config } from "@/lib/config";

export const dynamic = "force-dynamic";

function redirect(path: string) {
  return NextResponse.redirect(new URL(path, config.appUrl));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return redirect(`/settings?error=${encodeURIComponent(error)}`);
  }
  if (!code) {
    return redirect("/settings?error=missing_code");
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get("ig_oauth_state")?.value;
  if (!savedState || savedState !== state) {
    return redirect("/settings?error=state_mismatch");
  }

  try {
    const short = await exchangeCodeForToken(code);
    const long = await getLongLivedToken(short.accessToken);
    const expiresAt = new Date(Date.now() + long.expiresInSeconds * 1000);

    const profile = await getProfile(long.accessToken);
    const userId = profile.id || short.userId;

    await prisma.setting.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        igUserId: userId,
        igUsername: profile.username,
        accessToken: long.accessToken,
        tokenExpiresAt: expiresAt,
        captionTemplate: DEFAULT_CAPTION_TEMPLATE,
      },
      update: {
        igUserId: userId,
        igUsername: profile.username,
        accessToken: long.accessToken,
        tokenExpiresAt: expiresAt,
      },
    });

    cookieStore.delete("ig_oauth_state");

    // Kick off an initial sync so the dashboard has same-day data immediately.
    try {
      await runDailySync();
    } catch {
      // Non-fatal: the daily cron will populate data on its next run.
    }

    return redirect("/settings?connected=1");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to connect Instagram";
    return redirect(`/settings?error=${encodeURIComponent(message)}`);
  }
}
