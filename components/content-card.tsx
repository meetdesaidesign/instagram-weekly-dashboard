import Image from "next/image";
import { Eye, Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import type { TopContentItem } from "@/lib/analytics";
import { formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui";

export function ContentCard({
  item,
  rank,
}: {
  item: TopContentItem;
  rank?: number;
}) {
  const caption = item.caption?.replace(/\s+/g, " ").trim() ?? "";
  const short = caption.length > 120 ? caption.slice(0, 120) + "…" : caption;
  const date = item.timestamp
    ? new Date(item.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <a
      href={item.permalink ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="card overflow-hidden group flex flex-col hover:border-[var(--brand)] transition-colors"
    >
      <div className="relative aspect-square bg-surface-2 overflow-hidden">
        {item.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt={short || "post"}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 200px"
          />
        ) : (
          <div className="brand-gradient absolute inset-0 opacity-20" />
        )}
        {rank !== undefined && (
          <span className="absolute top-2 left-2 h-6 w-6 rounded-full bg-black/70 text-white text-xs font-bold flex items-center justify-center backdrop-blur">
            {rank}
          </span>
        )}
        <span className="absolute top-2 right-2">
          <Badge className="bg-black/60 backdrop-blur border-transparent text-white">
            {item.productType ?? "POST"}
          </Badge>
        </span>
      </div>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className="text-xs text-muted line-clamp-2 min-h-[2rem]">
          {short || "(no caption)"}
        </p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted mt-auto">
          <Stat icon={<Eye size={13} />} value={item.views} />
          <Stat icon={<Heart size={13} />} value={item.likes} />
          <Stat icon={<MessageCircle size={13} />} value={item.comments} />
          <Stat icon={<Send size={13} />} value={item.shares} />
          <Stat icon={<Bookmark size={13} />} value={item.saved} />
          <span className="text-[var(--muted-2)] text-right">{date}</span>
        </div>
      </div>
    </a>
  );
}

function Stat({ icon, value }: { icon: React.ReactNode; value: number }) {
  return (
    <span className="flex items-center gap-1">
      {icon}
      {formatNumber(value)}
    </span>
  );
}
