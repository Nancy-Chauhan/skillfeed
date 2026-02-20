import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        const admin = createAdminClient();

        // Check if user has a profile
        const { data: profile } = await admin
          .from("users")
          .select("id")
          .eq("email", user.email)
          .single();

        // Check waitlist status
        const { data: entry } = await admin
          .from("waitlist")
          .select("status")
          .eq("email", user.email)
          .single();

        // No profile → onboarding (regardless of waitlist status)
        if (!profile) {
          return NextResponse.redirect(`${origin}/onboarding`);
        }

        // Has profile but no waitlist entry (edge case) → insert and redirect to waitlist
        if (!entry) {
          await admin.from("waitlist").insert({ email: user.email });
          return NextResponse.redirect(`${origin}/waitlist`);
        }

        // Approved → dashboard
        if (entry.status === "approved") {
          return NextResponse.redirect(`${origin}/dashboard`);
        }

        // Not yet approved → waitlist
        return NextResponse.redirect(`${origin}/waitlist`);
      }

      // Has session but no email (shouldn't happen with Google) → dashboard
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Auth code exchange failed — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
