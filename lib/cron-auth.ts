import { config } from "@/lib/config";

/**
 * Verify a request is an authorized cron/manual trigger.
 * Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` automatically.
 */
export function isAuthorizedCron(req: Request): boolean {
  if (!config.cronSecret) {
    // If no secret is configured, only allow in development.
    return process.env.NODE_ENV !== "production";
  }
  const header = req.headers.get("authorization");
  return header === `Bearer ${config.cronSecret}`;
}
