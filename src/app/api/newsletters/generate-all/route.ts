import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { composeNewsletter } from "@/lib/agents/newsletter-composer";
import { getResend } from "@/lib/resend/client";
import { renderNewsletterEmail } from "@/emails/newsletter-template";
import { MIN_ARTICLES_FOR_NEWSLETTER } from "@/lib/utils/constants";
import type { User, MatchedArticle } from "@/lib/utils/types";
import { buildTrackingPixelUrl, buildFeedbackUrl, buildClickTrackingUrl } from "@/lib/metrics/events";
import jwt from "jsonwebtoken";

const CONCURRENCY_LIMIT = 5;

async function generateForUser(userId: string): Promise<"sent" | "skipped" | "failed"> {
  const supabase = createAdminClient();

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (userError || !user) return "failed";

  const typedUser = user as User;

  if (!typedUser.is_active || typedUser.unsubscribed_at) return "skipped";

  const today = new Date().toISOString().split("T")[0];
  if (typedUser.last_newsletter_at?.startsWith(today)) return "skipped";

  const { data: articles, error: matchError } = await supabase.rpc(
    "match_articles_for_user",
    { p_user_id: userId }
  );

  if (matchError) return "failed";

  const matchedArticles = (articles ?? []) as MatchedArticle[];
  if (matchedArticles.length < MIN_ARTICLES_FOR_NEWSLETTER) return "skipped";

  const newsletter = await composeNewsletter(typedUser, matchedArticles);

  const unsubscribeToken = jwt.sign(
    { userId: typedUser.id },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" }
  );
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const unsubscribeUrl = `${appUrl}/api/unsubscribe?token=${unsubscribeToken}`;

  const usedTitles = new Set(newsletter.featured_articles.map((a) => a.title));
  const usedArticles = matchedArticles.filter((a) => usedTitles.has(a.title));

  const { data: newsletterRecord, error: insertError } = await supabase
    .from("newsletters_sent")
    .insert({
      user_id: typedUser.id,
      subject: newsletter.subject,
      html_content: "",
      summary_text: newsletter.greeting,
      roadmap_items: newsletter.roadmap_items.map((text) => ({ text })),
      article_ids: usedArticles.map((a) => a.id),
      match_scores: usedArticles.map((a) => a.relevance_score),
      delivery_status: "pending",
      attempt_count: 0,
    })
    .select("id")
    .single();

  if (insertError || !newsletterRecord) return "failed";

  const newsletterId = newsletterRecord.id;
  const trackingPixelUrl = buildTrackingPixelUrl(appUrl, newsletterId, typedUser.id);

  const feedbackUrls: Record<string, { helpful: string; notHelpful: string }> = {};
  for (const article of newsletter.featured_articles) {
    const matched = matchedArticles.find((a) => a.title === article.title);
    if (matched) {
      feedbackUrls[article.title] = {
        helpful: buildFeedbackUrl(appUrl, newsletterId, matched.id, typedUser.id, 1),
        notHelpful: buildFeedbackUrl(appUrl, newsletterId, matched.id, typedUser.id, -1),
      };
      if (article.url) {
        article.url = buildClickTrackingUrl(appUrl, newsletterId, matched.id, typedUser.id, article.url);
      }
    }
  }

  const htmlContent = renderNewsletterEmail({
    newsletter,
    unsubscribeUrl,
    trackingPixelUrl,
    feedbackUrls,
  });

  const { data: emailResult, error: sendError } = await getResend().emails.send({
    from: process.env.EMAIL_FROM ?? "SkillFeed <onboarding@resend.dev>",
    to: typedUser.email,
    subject: newsletter.subject,
    html: htmlContent,
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });

  if (sendError) {
    await supabase
      .from("newsletters_sent")
      .update({
        html_content: htmlContent,
        delivery_status: "failed",
        attempt_count: 1,
        error_message: sendError.message,
      })
      .eq("id", newsletterId);
    return "failed";
  }

  await supabase
    .from("newsletters_sent")
    .update({
      html_content: htmlContent,
      resend_email_id: emailResult?.id ?? null,
      delivery_status: "sent",
      attempt_count: 1,
    })
    .eq("id", newsletterId);

  await supabase
    .from("users")
    .update({ last_newsletter_at: new Date().toISOString() })
    .eq("id", typedUser.id);

  return "sent";
}

async function generateAll(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: users, error } = await supabase
    .from("users")
    .select("id")
    .eq("is_active", true)
    .is("unsubscribed_at", null)
    .or(`last_newsletter_at.is.null,last_newsletter_at.lt.${today}`)
    .limit(100);

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

  // Process users with concurrency limit
  for (let i = 0; i < users.length; i += CONCURRENCY_LIMIT) {
    const batch = users.slice(i, i + CONCURRENCY_LIMIT);
    const results = await Promise.allSettled(
      batch.map((user) => generateForUser(user.id))
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        if (result.value === "sent") processed++;
        else if (result.value === "skipped") skipped++;
        else failed++;
      } else {
        console.error("Newsletter generation failed:", result.reason);
        failed++;
      }
    }
  }

  return NextResponse.json({ status: "complete", processed, skipped, failed });
}

// Vercel crons send GET requests
export async function GET(request: Request) {
  return generateAll(request);
}

export async function POST(request: Request) {
  return generateAll(request);
}
