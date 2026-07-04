# Instagram Weekly Insights

A weekly performance dashboard for a single Instagram **Business/Creator** account. It:

- Syncs your account + content metrics every day at **12pm IST** and stores daily snapshots (so you own unlimited history).
- Shows **weekly performance** (followers gained, views, likes, shares, reach, saves, comments) vs the previous week.
- Lets you explore any **custom date range** with charts and top content.
- Auto-generates **7 content ideas every Friday at 12pm IST** based on what performed best.
- Writes **structured captions** from a reel topic, using an editable caption structure.

Built with Next.js (App Router) + TypeScript, Prisma + Postgres, OpenAI, Recharts, deployed on Vercel with Vercel Cron.

## Why daily snapshots?

Instagram's API only retains user insights for ~90 days and data lags 24–48h. Storing a daily snapshot means the app can answer any historical range and compute week-over-week deltas.

## Prerequisites

1. **Instagram Business or Creator account.**
2. A **Meta Developer app** with the *Instagram API with Instagram Login* product:
   - Add the OAuth redirect URI: `https://YOUR_DOMAIN/api/instagram/callback`
   - Scopes used: `instagram_business_basic`, `instagram_business_manage_insights`
   - Add your account as an Instagram Tester (until the app is reviewed).
3. A **Postgres database** (Neon, Supabase, or Prisma Postgres).
4. An **OpenAI API key**.

## Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `OPENAI_API_KEY` | OpenAI key |
| `OPENAI_MODEL` | Optional, defaults to `gpt-4o-mini` |
| `INSTAGRAM_APP_ID` / `INSTAGRAM_APP_SECRET` | From your Meta app |
| `INSTAGRAM_GRAPH_VERSION` | Defaults to `v25.0` |
| `NEXT_PUBLIC_APP_URL` | Public base URL (no trailing slash) |
| `CRON_SECRET` | Long random string protecting the cron endpoints |

## Local development

```bash
npm install
cp .env.example .env   # fill in values
npx prisma migrate deploy   # applies the initial migration
npm run dev
```

Open http://localhost:3000, go to **Settings**, and click **Connect Instagram**.
Then click **Sync now** on the dashboard to pull the first day of data.

## Deploy (Vercel)

1. Push this repo to GitHub and import it into Vercel.
2. Add all environment variables in the Vercel project settings.
3. Set `NEXT_PUBLIC_APP_URL` to your production URL.
4. Deploy. The build runs `prisma generate`; run `npx prisma migrate deploy` against your production DB (e.g. as a build step or manually).
5. Cron schedules are defined in `vercel.json`:
   - `POST /api/cron/daily-sync` — daily at `30 6 * * *` UTC (12pm IST)
   - `POST /api/cron/weekly-ideas` — Fridays at `30 6 * * 5` UTC (12pm IST)

Vercel automatically sends `Authorization: Bearer $CRON_SECRET` to cron endpoints.

## Notes

- The dashboard is **open** (no login). Anyone with the URL can view your analytics. Add auth if you want to lock it down.
- Historical data accrues from the day you connect; the API only backfills limited history.
- Metrics for accounts with < 100 followers may be limited by Instagram.
