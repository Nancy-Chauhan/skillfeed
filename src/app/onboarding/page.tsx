import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProfileForm } from "@/components/onboarding/profile-form";

export default async function OnboardingPage() {
  const user = await requireAuth();

  // Waitlist gate: only approved users can onboard
  const admin = createAdminClient();
  const { data: entry } = await admin
    .from("waitlist")
    .select("status")
    .eq("email", user.email)
    .single();

  if (!entry || entry.status !== "approved") {
    redirect("/waitlist");
  }

  return <ProfileForm userEmail={user.email!} />;
}
