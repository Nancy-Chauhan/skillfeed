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

  // RLS ensures users only see their own newsletters
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
    <div className="min-h-screen flex flex-col bg-[#FAF8FC]">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10 space-y-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="text-[#8A8295] hover:text-[#4A4453] -ml-2 cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-[#4A4453]">{newsletter.subject}</h1>
          <p className="text-sm text-[#8A8295]">
            {date} &middot; {newsletter.article_ids.length} articles &middot;{" "}
            {newsletter.delivery_status}
          </p>
        </div>

        <div
          className="bg-white border border-[#D4D0DC] rounded-2xl p-8 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: newsletter.html_content }}
        />
      </main>
      <Footer />
    </div>
  );
}
