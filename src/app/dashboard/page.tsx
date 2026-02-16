import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { ProfileSummary } from "@/components/dashboard/profile-summary";
import { NewsletterList } from "@/components/dashboard/newsletter-list";
import type { User, NewsletterSent } from "@/lib/utils/types";

export default async function DashboardPage() {
  const authUser = await requireAuth();
  const supabase = await createClient();

  // Fetch user profile
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  // If no profile yet, redirect to onboarding
  if (!profile) {
    redirect("/onboarding");
  }

  const user = profile as User;

  // Fetch newsletters
  const { data: newsletters } = await supabase
    .from("newsletters_sent")
    .select("*")
    .eq("user_id", authUser.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const firstName = user.name?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <Header />
      <main className="flex-1 pt-16">
        {/* Greeting banner */}
        <div className="border-b border-[#262626] relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-32 bg-[#00FF88]/5 blur-[80px]" />
            <div className="absolute top-0 right-1/4 w-96 h-32 bg-[#A78BFA]/5 blur-[80px]" />
          </div>
          <div className="relative max-w-4xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-semibold text-white tracking-tight">
              Welcome back, <span className="text-[#00FF88]">{firstName}</span>
            </h1>
            <p className="text-[#737373] mt-1.5">Your learning journey at a glance.</p>
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

          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-white">Your Newsletters</h2>
            <NewsletterList newsletters={(newsletters ?? []) as NewsletterSent[]} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
