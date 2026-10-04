# Caption writer

Write a structured Instagram caption from a reel topic. The caption follows a saved structure and optional example captions you can edit in Settings.

Built with Next.js (App Router) + TypeScript, Prisma + Postgres, and OpenAI.

## Prerequisites

1. A **Postgres database** (Neon, Supabase, or Prisma Postgres).
2. An **OpenAI API key**.

## Environment variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `OPENAI_API_KEY` | OpenAI key |
| `OPENAI_MODEL` | Optional, defaults to `gpt-4o-mini` |

## Local development

```bash
npm install
npx prisma migrate deploy
npm run dev
```

Open http://localhost:3000, describe a reel topic, and write a caption. Edit the structure and example voice in **Settings**.

## Deploy

1. Push this repo and import it into your host.
2. Add the environment variables.
3. Run `npx prisma migrate deploy` against the production database.

The app is open (no login). Anyone with the URL can write captions and edit the structure.
