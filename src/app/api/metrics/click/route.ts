import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyMetricsSignature } from "@/lib/metrics/events";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nid = searchParams.get("nid");
  const aid = searchParams.get("aid");
  const uid = searchParams.get("uid");
  const url = searchParams.get("url");
  const sig = searchParams.get("sig");

  if (!nid || !aid || !uid || !url || !sig) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  if (!verifyMetricsSignature({ nid, aid, uid, url }, sig)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  // Record click event
  try {
    const supabase = createAdminClient();
    await supabase.from("newsletter_events").insert({
      newsletter_id: nid,
      user_id: uid,
      article_id: aid,
      event_type: "click",
    });
  } catch {
    // Don't block the redirect
  }

  // Redirect to original URL
  return NextResponse.redirect(url, 302);
}
