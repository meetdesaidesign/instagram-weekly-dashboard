import { prisma } from "@/lib/prisma";

/**
 * Instagram CDN URLs (`scontent-*.cdninstagram.com`) are signed and expire
 * within days. We download thumbnail bytes at sync time and store them in
 * the database, so the dashboard never depends on Instagram's URL lifetimes.
 */

const MAX_BYTES = 5 * 1024 * 1024;

async function fetchImageBytes(
  url: string,
): Promise<{ data: Uint8Array<ArrayBuffer>; mime: string } | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) return null;
    const mime = res.headers.get("content-type")?.split(";")[0] ?? "image/jpeg";
    if (!mime.startsWith("image/")) return null;
    const data = new Uint8Array(await res.arrayBuffer());
    if (data.byteLength === 0 || data.byteLength > MAX_BYTES) return null;
    return { data, mime };
  } catch {
    return null;
  }
}

export interface ThumbnailCacheResult {
  cached: number;
  failed: number;
}

/**
 * Download and store thumbnails for media rows that don't have one yet.
 * Called during sync while the CDN URLs are still fresh. Idempotent:
 * media with cached bytes are skipped.
 */
export async function cacheMissingThumbnails(): Promise<ThumbnailCacheResult> {
  const missing = await prisma.media.findMany({
    where: {
      thumbMime: null,
      OR: [{ thumbnailUrl: { not: null } }, { mediaUrl: { not: null } }],
    },
    select: { id: true, thumbnailUrl: true, mediaUrl: true },
  });

  let cached = 0;
  let failed = 0;
  for (const m of missing) {
    const url = m.thumbnailUrl ?? m.mediaUrl;
    if (!url) continue;
    const img = await fetchImageBytes(url);
    if (!img) {
      failed++;
      continue;
    }
    await prisma.media.update({
      where: { id: m.id },
      data: { thumbData: img.data, thumbMime: img.mime },
    });
    cached++;
  }
  return { cached, failed };
}
