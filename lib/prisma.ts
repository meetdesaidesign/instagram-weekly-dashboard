import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function buildPgConfig() {
  const raw = process.env.DATABASE_URL ?? "";
  if (!raw) return { connectionString: "" };

  try {
    const url = new URL(raw);
    const isLocal = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
    // The `pg` driver's handling of `sslmode` in the URL differs from Prisma's
    // migration engine and rejects Supabase's pooler self-signed cert chain.
    // We strip it and configure SSL explicitly for hosted databases.
    url.searchParams.delete("sslmode");
    return {
      connectionString: url.toString(),
      ssl: isLocal ? undefined : { rejectUnauthorized: false },
    };
  } catch {
    return { connectionString: raw };
  }
}

function createClient() {
  const adapter = new PrismaPg(buildPgConfig());
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
