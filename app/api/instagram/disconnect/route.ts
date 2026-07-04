import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { config } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function POST() {
  await prisma.setting.updateMany({
    data: {
      igUserId: null,
      igUsername: null,
      accessToken: null,
      tokenExpiresAt: null,
    },
  });
  return NextResponse.redirect(new URL("/settings?disconnected=1", config.appUrl), {
    status: 303,
  });
}
