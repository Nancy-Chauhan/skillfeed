import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Mail, ChevronRight } from "lucide-react";

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
    year: "numeric",
  });

  const statusColor =
    deliveryStatus === "sent" || deliveryStatus === "delivered"
      ? "bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/20"
      : deliveryStatus === "failed"
        ? "bg-red-500/10 text-red-400 border-red-500/20"
        : "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20";

  return (
    <Link href={`/newsletters/${id}`}>
      <div className="group bg-[#141414] rounded-xl border border-[#262626] hover:border-[#00FF88]/20 transition-all cursor-pointer" style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.03)' }}>
        <div className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#262626] flex items-center justify-center shrink-0 group-hover:border-[#00FF88]/20 transition-colors">
            <Mail className="w-4.5 h-4.5 text-[#00FF88]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate group-hover:text-[#00FF88] transition-colors">{subject}</p>
            <p className="text-xs text-[#525252] mt-0.5">
              {date} &middot; {articleCount} article{articleCount !== 1 ? "s" : ""}
            </p>
          </div>
          <Badge variant="secondary" className={`${statusColor} border rounded-lg text-xs shrink-0 font-medium`}>
            {deliveryStatus}
          </Badge>
          <ChevronRight className="w-4 h-4 text-[#333] group-hover:text-[#00FF88] transition-colors shrink-0" />
        </div>
      </div>
    </Link>
  );
}
