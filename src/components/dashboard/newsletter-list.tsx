import { NewsletterCard } from "./newsletter-card";
import { Inbox } from "lucide-react";
import type { NewsletterSent } from "@/lib/utils/types";

interface NewsletterListProps {
  newsletters: NewsletterSent[];
}

export function NewsletterList({ newsletters }: NewsletterListProps) {
  if (newsletters.length === 0) {
    return (
      <div className="text-center py-16 space-y-3 border border-dashed border-white/[0.06] rounded-xl">
        <Inbox className="w-5 h-5 text-white/15 mx-auto" />
        <div className="space-y-1">
          <p className="text-sm text-white/40">No newsletters yet</p>
          <p className="font-mono text-[11px] text-white/15">
            first delivery arriving soon
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {newsletters.map((nl) => (
        <NewsletterCard
          key={nl.id}
          id={nl.id}
          subject={nl.subject}
          createdAt={nl.created_at}
          deliveryStatus={nl.delivery_status}
          articleCount={nl.article_ids.length}
        />
      ))}
    </div>
  );
}
