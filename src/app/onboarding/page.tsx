import { requireAuth } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProfileForm } from "@/components/onboarding/profile-form";

export default async function OnboardingPage() {
  const user = await requireAuth();

  const admin = createAdminClient();

  // Load existing profile if any (for edit flow)
  const { data: profile } = await admin
    .from("users")
    .select("id, name, current_roles, target_roles, prompt_text")
    .eq("email", user.email)
    .single();

  // Determine where to redirect after save
  let redirectTo = "/waitlist";
  if (profile) {
    const { data: entry } = await admin
      .from("waitlist")
      .select("status")
      .eq("email", user.email)
      .single();

    if (entry?.status === "approved") {
      redirectTo = "/dashboard";
    }
  }

  const defaultName = profile?.name
    ?? user.user_metadata?.full_name
    ?? user.user_metadata?.name
    ?? "";

  return (
    <ProfileForm
      defaultName={defaultName}
      redirectTo={redirectTo}
      existingProfile={profile ? {
        id: profile.id,
        current_roles: profile.current_roles,
        target_roles: profile.target_roles,
        prompt_text: profile.prompt_text,
      } : undefined}
    />
  );
}
