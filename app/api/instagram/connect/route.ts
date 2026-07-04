import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { getAuthUrl } from "@/lib/instagram";
import { isInstagramConfigured } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isInstagramConfigured()) {
    return NextResponse.redirect(
      new URL(
        "/settings?error=instagram_not_configured",
        process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      ),
    );
  }

  const state = randomBytes(16).toString("hex");
  const cookieStore = await cookies();
  cookieStore.set("ig_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return NextResponse.redirect(getAuthUrl(state));
}
