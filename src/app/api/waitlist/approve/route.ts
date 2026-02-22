import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { renderWaitlistApprovalEmail } from "@/emails/waitlist-approval";
import { getResend } from "@/lib/resend/client";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Check current waitlist status
  const { data: entry, error: fetchError } = await supabase
    .from("waitlist")
    .select("status")
    .eq("email", email)
    .single();

  if (fetchError || !entry) {
    return NextResponse.json({ error: "User not found on waitlist" }, { status: 404 });
  }

  if (entry.status === "approved") {
    return NextResponse.json({ error: "User already approved" }, { status: 409 });
  }

  // Approve
  const { error: updateError } = await supabase
    .from("waitlist")
    .update({ status: "approved" })
    .eq("email", email);

  if (updateError) {
    console.error("Failed to approve waitlist entry:", updateError);
    return NextResponse.json({ error: "Failed to update waitlist" }, { status: 500 });
  }

  // Look up user name for personalization
  const { data: user } = await supabase
    .from("users")
    .select("name")
    .eq("email", email)
    .single();

  // Send approval email
  try {
    const html = renderWaitlistApprovalEmail(user?.name ?? null);
    await getResend().emails.send({
      from: process.env.EMAIL_FROM ?? "SkillFeed <onboarding@resend.dev>",
      to: email,
      subject: "You're in! Your skillfeed_ spot is ready",
      html,
    });
  } catch (e) {
    console.error("Failed to send approval email:", e);
    // Still return success — the user is approved even if email fails
  }

  return NextResponse.json({ status: "approved", email });
}
