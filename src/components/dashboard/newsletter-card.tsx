import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface NewsletterCardProps {
  id: string;
  subject: string;
  createdAt: string;
  deliveryStatus: string;
  articleCount: number;
}

export function NewsletterCard({
  id,
  subject,
  createdAt,
  deliveryStatus,
  articleCount,
}: NewsletterCardProps) {
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const isOk = deliveryStatus === "sent" || deliveryStatus === "delivered";

  return (
    <Link href={`/newsletters/${id}`}>
      <div className="group flex items-center gap-4 px-4 py-3.5 rounded-xl border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.02] transition-all duration-200 cursor-pointer">
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isOk ? "bg-emerald-400/60" : deliveryStatus === "failed" ? "bg-red-400/60" : "bg-amber-400/60"}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white/65 truncate group-hover:text-white/90 transition-colors">{subject}</p>
        </div>
        <span className="font-mono text-[11px] text-white/35 shrink-0 hidden sm:inline">
          {articleCount} articles
        </span>
        <span className="font-mono text-[11px] text-white/35 shrink-0 text-right">
          {date}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white/55 transition-colors shrink-0" />
      </div>
    </Link>
  );
}
