import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResend } from "@/lib/resend/client";
import { WaitlistConfirmationEmail } from "@/emails/waitlist-confirmation";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Get the authenticated user's email
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        const admin = createAdminClient();

        // Check waitlist status
        const { data: entry } = await admin
          .from("waitlist")
          .select("status")
          .eq("email", user.email)
          .single();

        if (!entry) {
          // First sign-in — add to waitlist as pending
          await admin.from("waitlist").insert({ email: user.email });

          // Send confirmation email (fire-and-forget)
          try {
            const resend = getResend();
            await resend.emails.send({
              from: process.env.EMAIL_FROM!,
              to: user.email,
              subject: "You're on the skillfeed_ waitlist",
              react: WaitlistConfirmationEmail({ email: user.email }),
            });
          } catch (e) {
            console.error("Waitlist confirmation email failed:", e);
          }

          return NextResponse.redirect(`${origin}/waitlist`);
        }

        if (entry.status !== "approved") {
          return NextResponse.redirect(`${origin}/waitlist`);
        }
      }

      return NextResponse.redirect(`${origin}${redirect}`);
    }
  }

  // Auth code exchange failed — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
