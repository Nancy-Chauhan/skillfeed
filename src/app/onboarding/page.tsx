import { requireAuth } from "@/lib/auth/session";
import { ProfileForm } from "@/components/onboarding/profile-form";

export default async function OnboardingPage() {
  const user = await requireAuth();

  return <ProfileForm userEmail={user.email!} />;
}
