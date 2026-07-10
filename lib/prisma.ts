import { Pool, type PoolConfig } from "pg";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createClient> | undefined;
  pgPool: Pool | undefined;
};

function buildPoolConfig(): PoolConfig {
  const raw = process.env.DATABASE_URL ?? "";
  if (!raw) return { connectionString: "" };

  try {
    const url = new URL(raw);
    const isLocal = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);

    // Supabase session-mode pooler (:5432) caps clients at pool size (~15) and
    // fails under Vercel concurrency with EMAXCONNSESSION. Transaction mode
    // (:6543) is the correct serverless target.
    if (url.hostname.includes("pooler.supabase.com") && (url.port === "5432" || url.port === "")) {
      url.port = "6543";
    }

    // The `pg` driver's handling of `sslmode` in the URL differs from Prisma's
    // migration engine and rejects Supabase's pooler self-signed cert chain.
    // We strip it and configure SSL explicitly for hosted databases.
    url.searchParams.delete("sslmode");

    return {
      connectionString: url.toString(),
      ssl: isLocal ? undefined : { rejectUnauthorized: false },
      // One connection per serverless instance; the pooler multiplexes.
      max: 1,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    };
  } catch {
    return { connectionString: raw, max: 1 };
  }
}

function getPool(): Pool {
  if (globalForPrisma.pgPool) return globalForPrisma.pgPool;
  const pool = new Pool(buildPoolConfig());
  pool.on("error", (err) => {
    console.error("Unexpected Postgres pool error", err);
  });
  globalForPrisma.pgPool = pool;
  return pool;
}

function createClient() {
  const adapter = new PrismaPg(getPool());
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    // Cached thumbnail bytes are heavy; only the thumbnail route selects them explicitly.
    omit: { media: { thumbData: true } },
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

// Always reuse across warm serverless invocations (not only in development).
globalForPrisma.prisma = prisma;
