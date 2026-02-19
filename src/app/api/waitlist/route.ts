import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResend } from "@/lib/resend/client";
import { WaitlistConfirmationEmail } from "@/emails/waitlist-confirmation";

const bodySchema = z.object({
  email: z.email(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid email address." },
      { status: 400 }
    );
  }

  const { email } = parsed.data;
  const supabase = createAdminClient();

  // Check if already on waitlist
  const { data: existing } = await supabase
    .from("waitlist")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "You're already on the waitlist!" },
      { status: 409 }
    );
  }

  // Insert into waitlist
  const { error: insertError } = await supabase
    .from("waitlist")
    .insert({ email });

  if (insertError) {
    console.error("Waitlist insert error:", insertError);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  // Send confirmation email
  try {
    const resend = getResend();
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "You're on the skillfeed_ waitlist",
      react: WaitlistConfirmationEmail({ email }),
    });
  } catch (emailError) {
    console.error("Waitlist confirmation email error:", emailError);
    // Don't fail the request — the signup still succeeded
  }

  return NextResponse.json({ success: true });
}
