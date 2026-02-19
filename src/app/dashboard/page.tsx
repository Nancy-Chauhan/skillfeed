import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { ProfileSummary } from "@/components/dashboard/profile-summary";
import { NewsletterList } from "@/components/dashboard/newsletter-list";
import type { User, NewsletterSent } from "@/lib/utils/types";

export default async function DashboardPage() {
  const authUser = await requireAuth();

  // Waitlist gate: only approved users can access dashboard
  const admin = createAdminClient();
  const { data: waitlistEntry } = await admin
    .from("waitlist")
    .select("status")
    .eq("email", authUser.email)
    .single();

  if (!waitlistEntry || waitlistEntry.status !== "approved") {
    redirect("/waitlist");
  }

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (!profile) {
    redirect("/onboarding");
  }

  const user = profile as User;

  const { data: newsletters } = await supabase
    .from("newsletters_sent")
    .select("*")
    .eq("user_id", authUser.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const firstName = user.name?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B]">
      <Header />
      <main className="flex-1 pt-14">
        <div className="border-b border-white/[0.04] relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[120px] bg-violet-500/[0.04] blur-[80px] pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-6 py-10">
            <p className="font-mono text-xs text-violet-400/60 mb-2">~/dashboard</p>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Welcome back, {firstName}
            </h1>
            <p className="text-[13px] text-white/30 mt-1">Your learning journey at a glance.</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto w-full px-6 py-10 space-y-10">
          <ProfileSummary
            name={user.name}
            email={user.email}
            currentRoles={user.current_roles}
            targetRoles={user.target_roles}
            currentLevel={user.current_level}
            targetLevel={user.target_level}
            extractedSkills={user.extracted_skills}
            learningGoals={user.learning_goals}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Newsletters</h2>
              <span className="font-mono text-[11px] text-white/20">
                {(newsletters ?? []).length} delivered
              </span>
            </div>
            <NewsletterList newsletters={(newsletters ?? []) as NewsletterSent[]} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
