import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default async function NewsletterViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAuth();
  const supabase = await createClient();

  const { data: newsletter, error } = await supabase
    .from("newsletters_sent")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !newsletter) {
    notFound();
  }

  // Fetch the actual articles
  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, summary, url, level, source_name, keywords")
    .in("id", newsletter.article_ids);

  // Order articles to match article_ids order
  const orderedArticles = newsletter.article_ids
    .map((aid: string) => articles?.find((a) => a.id === aid))
    .filter(Boolean);

  const date = new Date(newsletter.created_at).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B]">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 pt-24 pb-10 space-y-8">
        {/* Back button */}
        <Link href="/dashboard">
          <Button variant="ghost" className="text-white/25 hover:text-white/50 hover:bg-white/[0.04] -ml-2 cursor-pointer text-[13px]">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Back
          </Button>
        </Link>

        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-xl font-bold text-white tracking-tight">{newsletter.subject}</h1>
          <p className="font-mono text-xs text-white/25">
            {date} &middot; {newsletter.article_ids.length} articles
          </p>
        </div>

        {/* Greeting */}
        {newsletter.summary_text && (
          <p className="text-sm text-white/35 leading-relaxed">
            {newsletter.summary_text}
          </p>
        )}

        {/* Articles */}
        <div className="space-y-1">
          <p className="font-mono text-[10px] text-white/15 tracking-[0.15em] uppercase mb-4">
            Featured for you
          </p>
          {orderedArticles.map((article: { id: string; title: string; summary: string; url: string | null; level: string; source_name: string; keywords: string[] }, i: number) => (
            <div
              key={article.id}
              className="py-4 border-b border-white/[0.04] last:border-b-0"
            >
              <div className="flex items-start gap-3">
                <span className="font-mono text-sm font-semibold text-violet-400/50 mt-0.5 shrink-0">
                  {i + 1}.
                </span>
                <div className="space-y-2 min-w-0">
                  <div>
                    {article.url ? (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-white/60 hover:text-white/80 transition-colors inline-flex items-center gap-1.5"
                      >
                        {article.title}
                        <ExternalLink className="w-3 h-3 text-white/20 shrink-0" />
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-white/60">{article.title}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-emerald-400/60 bg-emerald-400/[0.08] px-2 py-0.5 rounded">
                      {article.level}
                    </span>
                    {article.source_name && (
                      <span className="text-[11px] text-white/20">{article.source_name}</span>
                    )}
                  </div>
                  {article.summary && (
                    <p className="text-xs text-white/25 leading-relaxed">
                      {article.summary}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Roadmap */}
        {newsletter.roadmap_items && newsletter.roadmap_items.length > 0 && (
          <div className="space-y-1">
            <p className="font-mono text-[10px] text-white/15 tracking-[0.15em] uppercase mb-4">
              Your next steps
            </p>
            {newsletter.roadmap_items.map((item: { text: string }, i: number) => (
              <div key={i} className="flex items-start gap-3 py-2">
                <span className="font-mono text-sm text-violet-400/40 mt-0.5 shrink-0">→</span>
                <p className="text-xs text-white/30 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
