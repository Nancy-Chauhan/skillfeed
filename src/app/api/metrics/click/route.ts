import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyMetricsSignature } from "@/lib/metrics/events";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nid = searchParams.get("nid");
  const aid = searchParams.get("aid");
  const uid = searchParams.get("uid");
  const sig = searchParams.get("sig");

  if (!nid || !aid || !uid || !sig) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  if (!verifyMetricsSignature({ nid, aid, uid }, sig)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const supabase = createAdminClient();

  // Look up the article URL from the database
  const { data: article } = await supabase
    .from("articles")
    .select("url")
    .eq("id", aid)
    .single();

  if (!article?.url) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  // Record click event (don't block the redirect)
  try {
    await supabase.from("newsletter_events").insert({
      newsletter_id: nid,
      user_id: uid,
      article_id: aid,
      event_type: "click",
    });
  } catch {
    // Don't block the redirect
  }

  return NextResponse.redirect(article.url, 302);
}
