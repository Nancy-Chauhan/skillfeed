import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { LogOut, Clock } from "lucide-react";

export default async function WaitlistPage() {
  const user = await requireAuth();
  const admin = createAdminClient();

  // No profile means onboarding was never completed
  const { data: profile } = await admin
    .from("users")
    .select("id")
    .eq("email", user.email)
    .single();

  if (!profile) {
    redirect("/onboarding");
  }

  // If already approved, send them to dashboard
  const { data: entry } = await admin
    .from("waitlist")
    .select("status")
    .eq("email", user.email)
    .single();

  if (entry?.status === "approved") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090B] px-6 relative overflow-hidden">
      <div className="fixed inset-0 dot-grid pointer-events-none z-0" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-violet-500/[0.05] blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 text-center">
        <div className="mb-8">
          <span className="font-mono text-sm font-semibold text-white tracking-tight">
            skillfeed<span className="text-violet-400">_</span>
          </span>
        </div>

        <div className="space-y-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/20">
            <Clock className="w-5 h-5 text-violet-400" />
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight">
            You&apos;re on the waitlist
          </h1>

          <p className="text-sm text-white/70 leading-relaxed font-mono">
            We&apos;ll send you an email at{" "}
            <span className="text-violet-400/80">{user.email}</span>{" "}
            as soon as your spot opens up.
          </p>

          <p className="text-xs text-white/55 font-mono">
            We&apos;re onboarding the first 50 members now.
          </p>

          <form action="/auth/signout" method="post" className="pt-4">
            <Button
              variant="ghost"
              className="font-mono text-white/60 hover:text-white/80 hover:bg-white/[0.05] cursor-pointer text-[13px]"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              sign out
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
