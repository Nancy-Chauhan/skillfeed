import { NewsletterCard } from "./newsletter-card";
import { Mail } from "lucide-react";
import type { NewsletterSent } from "@/lib/utils/types";

interface NewsletterListProps {
  newsletters: NewsletterSent[];
}

export function NewsletterList({ newsletters }: NewsletterListProps) {
  if (newsletters.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] border border-[#262626] flex items-center justify-center mx-auto">
          <Mail className="w-6 h-6 text-[#333]" />
        </div>
        <div className="space-y-1.5">
          <p className="text-lg font-medium text-white">No newsletters yet</p>
          <p className="text-sm text-[#525252] max-w-sm mx-auto">
            Your first personalized newsletter will arrive soon. We&apos;re curating
            articles that match your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
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
