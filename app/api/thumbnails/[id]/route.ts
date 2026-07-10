import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const mediaId = Number(id);
  if (!Number.isInteger(mediaId) || mediaId <= 0) {
    return new Response("Not found", { status: 404 });
  }

  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    select: { thumbData: true, thumbMime: true },
  });
  if (!media?.thumbData) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(Buffer.from(media.thumbData), {
    headers: {
      "Content-Type": media.thumbMime ?? "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
