import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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

  const date = new Date(newsletter.created_at).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B]">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 pt-24 pb-10 space-y-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="text-white/25 hover:text-white/50 hover:bg-white/[0.04] -ml-2 cursor-pointer text-[13px]">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Back
          </Button>
        </Link>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white tracking-tight">{newsletter.subject}</h1>
          <p className="font-mono text-xs text-white/25">
            {date} &middot; {newsletter.article_ids.length} articles
          </p>
        </div>

        <div
          className="gradient-border rounded-xl bg-white/[0.02] p-8 overflow-hidden [&_h1]:text-white [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-white/90 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-white/80 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-white/40 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:mb-4 [&_a]:text-violet-400/80 [&_a:hover]:text-violet-400 [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-violet-400/30 [&_li]:text-white/40 [&_li]:text-sm [&_ul]:mb-4 [&_ol]:mb-4 [&_strong]:text-white/60 [&_hr]:border-white/[0.04] [&_hr]:my-6 [&_img]:rounded-lg [&_code]:font-mono [&_code]:text-xs [&_code]:bg-white/[0.04] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-violet-400/60 [&_pre]:bg-white/[0.03] [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:mb-4 [&_pre]:overflow-x-auto [&_blockquote]:border-l-2 [&_blockquote]:border-violet-500/20 [&_blockquote]:pl-4 [&_blockquote]:text-white/30 [&_blockquote]:italic"
          dangerouslySetInnerHTML={{ __html: newsletter.html_content }}
        />
      </main>
      <Footer />
    </div>
  );
}
