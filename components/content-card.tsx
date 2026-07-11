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
        timeZone: "UTC",
      })
    : "";

  return (
    <a
      href={item.permalink ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="rise-in group flex flex-col overflow-hidden rounded-card border border-border bg-surface transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
      style={{ "--stagger-i": Math.min((rank ?? 1) - 1, 8) } as React.CSSProperties}
    >
      <div className="relative aspect-square bg-surface-2 overflow-hidden">
        {item.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt={short || "post"}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 50vw, 200px"
          />
        ) : (
          <div className="absolute inset-0 bg-accent-soft" />
        )}
        {rank !== undefined && (
          <span className="absolute top-2 left-2 flex h-5 min-w-5 items-center justify-center rounded-ctl bg-black/70 px-1 font-mono text-[10px] font-semibold text-white backdrop-blur">
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
        <div className="mt-auto grid grid-cols-2 gap-x-3 gap-y-1 text-[12px] font-medium tabular-nums text-muted">
          <Stat icon={<Eye size={12} />} value={item.views} />
          <Stat icon={<Heart size={12} />} value={item.likes} />
          <Stat icon={<MessageCircle size={12} />} value={item.comments} />
          <Stat icon={<Send size={12} />} value={item.shares} />
          <Stat icon={<Bookmark size={12} />} value={item.saved} />
          <span className="text-right text-muted-2">{date}</span>
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
