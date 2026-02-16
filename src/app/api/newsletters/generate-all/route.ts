import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  // Fetch all eligible users
  const { data: users, error } = await supabase
    .from("users")
    .select("id")
    .eq("is_active", true)
    .is("unsubscribed_at", null)
    .or(`last_newsletter_at.is.null,last_newsletter_at.lt.${today}`);

  if (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }

  if (!users || users.length === 0) {
    return NextResponse.json({ status: "complete", processed: 0, skipped: 0, failed: 0 });
  }

  let processed = 0;
  let skipped = 0;
  let failed = 0;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  for (const user of users) {
    try {
      const res = await fetch(`${appUrl}/api/newsletters/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const result = await res.json();
      if (result.status === "sent") {
        processed++;
      } else if (result.status === "skipped") {
        skipped++;
      } else {
        failed++;
      }
    } catch (err) {
      console.error(`Failed to generate newsletter for user ${user.id}:`, err);
      failed++;
    }
  }

  return NextResponse.json({ status: "complete", processed, skipped, failed });
}
