import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { createAdminClient } from "@/lib/supabase/admin";
import { composeNewsletterAuto as composeNewsletter } from "@/lib/agents/newsletter-composer-factory";
import { getResend } from "@/lib/resend/client";
import { renderNewsletterEmail } from "@/emails/newsletter-template";
import { MIN_ARTICLES_FOR_NEWSLETTER } from "@/lib/utils/constants";
import type { User, MatchedArticle } from "@/lib/utils/types";
import { buildTrackingPixelUrl, buildFeedbackUrl, buildClickTrackingUrl } from "@/lib/metrics/events";
import jwt from "jsonwebtoken";

const GenerateSchema = z.object({
  userId: z.string().uuid(),
});

export async function POST(request: Request) {
  // Auth: require cron secret or authenticated session
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = GenerateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  const { userId } = result.data;
  const tag = `[cron:generate] [user:${userId}]`;
  console.log(`${tag} Starting single-user newsletter generation`);
  const supabase = createAdminClient();

  // Fetch user
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (userError || !user) {
    console.log(`${tag} Failed — user not found: ${userError?.message ?? "no data"}`);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const typedUser = user as User;

  // Check if active
  if (!typedUser.is_active || typedUser.unsubscribed_at) {
    console.log(`${tag} Skipped — inactive or unsubscribed`);
    return NextResponse.json({ status: "skipped", reason: "User inactive or unsubscribed" });
  }

  // Idempotency: skip if already sent today (in user's local timezone)
  if (typedUser.last_newsletter_at) {
    const userTz = typedUser.timezone || "UTC";
    const now = new Date();
    const todayLocal = now.toLocaleDateString("en-CA", { timeZone: userTz });
    const lastSentLocal = new Date(typedUser.last_newsletter_at)
      .toLocaleDateString("en-CA", { timeZone: userTz });
    if (lastSentLocal === todayLocal) {
      console.log(`${tag} Skipped — already sent today (${userTz})`);
      return NextResponse.json({ status: "skipped", reason: "Already sent today" });
    }
  }

  // Match articles
  const { data: articles, error: matchError } = await supabase.rpc(
    "match_articles_for_user",
    { p_user_id: userId }
  );

  if (matchError) {
    console.error(`${tag} Failed — article match error: ${matchError.message}`);
    return NextResponse.json({ error: "Matching failed" }, { status: 500 });
  }

  const matchedArticles = (articles ?? []) as MatchedArticle[];

  if (matchedArticles.length < MIN_ARTICLES_FOR_NEWSLETTER) {
    console.log(`${tag} Skipped — only ${matchedArticles.length} articles (need ${MIN_ARTICLES_FOR_NEWSLETTER})`);
    return NextResponse.json({
      status: "skipped",
      reason: `Only ${matchedArticles.length} articles matched (minimum ${MIN_ARTICLES_FOR_NEWSLETTER})`,
    });
  }

  console.log(`${tag} Matched ${matchedArticles.length} articles, composing newsletter...`);
  // Compose newsletter
  const newsletter = await composeNewsletter(typedUser, matchedArticles);
  console.log(`${tag} Newsletter composed, subject: "${newsletter.subject}"`);

  // Filter out articles with empty/invalid URLs or missing content
  newsletter.featured_articles = newsletter.featured_articles.filter((a) => {
    try {
      return a.title?.trim() && a.url?.trim() && a.summary?.trim() && new URL(a.url);
    } catch {
      console.log(`${tag} Dropped article with invalid URL: "${a.title}" -> "${a.url}"`);
      return false;
    }
  });

  if (newsletter.featured_articles.length === 0) {
    console.log(`${tag} Skipped -- no valid articles after filtering`);
    return NextResponse.json({ status: "skipped", reason: "No valid articles after filtering" });
  }

  // Generate unsubscribe URL
  const unsubscribeToken = jwt.sign(
    { userId: typedUser.id },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" }
  );
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const unsubscribeUrl = `${appUrl}/api/unsubscribe?token=${unsubscribeToken}`;

  // Collect only the article IDs the composer actually used
  const usedTitles = new Set(
    newsletter.featured_articles.map((a) => a.title)
  );
  const usedArticles = matchedArticles.filter((a) => usedTitles.has(a.title));

  // Insert newsletter record first (pending) to get the ID for tracking URLs
  const { data: newsletterRecord, error: insertError } = await supabase
    .from("newsletters_sent")
    .insert({
      user_id: typedUser.id,
      subject: newsletter.subject,
      html_content: "", // placeholder, updated after render
      summary_text: newsletter.greeting,
      roadmap_items: newsletter.roadmap_items.map((text) => ({ text })),
      article_ids: usedArticles.map((a) => a.id),
      match_scores: usedArticles.map((a) => a.relevance_score),
      delivery_status: "pending",
      attempt_count: 0,
    })
    .select("id")
    .single();

  if (insertError || !newsletterRecord) {
    console.error(`${tag} Failed — newsletter record insert error: ${insertError?.message ?? "no data"}`);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  const newsletterId = newsletterRecord.id;

  // Build tracking pixel URL
  const trackingPixelUrl = buildTrackingPixelUrl(appUrl, newsletterId, typedUser.id);

  // Build feedback URLs for each featured article
  const feedbackUrls: Record<string, { helpful: string; notHelpful: string }> = {};
  for (const article of newsletter.featured_articles) {
    const matched = matchedArticles.find((a) => a.title === article.title);
    if (matched) {
      feedbackUrls[article.title] = {
        helpful: buildFeedbackUrl(appUrl, newsletterId, matched.id, typedUser.id, 1),
        notHelpful: buildFeedbackUrl(appUrl, newsletterId, matched.id, typedUser.id, -1),
      };

      // Wrap article URLs with click tracking
      if (article.url) {
        article.url = buildClickTrackingUrl(appUrl, newsletterId, matched.id, typedUser.id, article.url);
      }
    }
  }


  // Render email HTML with tracking
  const htmlContent = renderNewsletterEmail({
    newsletter,
    unsubscribeUrl,
    trackingPixelUrl,
    feedbackUrls,
  });

  // Send via Resend
  console.log(`${tag} Sending email via Resend to ${typedUser.email}...`);
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
    console.log(`${tag} Failed — Resend send error: ${sendError.message}`);
    // Update record as failed
    await supabase
      .from("newsletters_sent")
      .update({
        html_content: htmlContent,
        delivery_status: "failed",
        attempt_count: 1,
        error_message: sendError.message,
      })
      .eq("id", newsletterId);

    return NextResponse.json({ error: "Email send failed" }, { status: 500 });
  }

  console.log(`${tag} Email sent via Resend (id: ${emailResult?.id ?? "unknown"})`);

  // Update record as sent
  await supabase
    .from("newsletters_sent")
    .update({
      html_content: htmlContent,
      resend_email_id: emailResult?.id ?? null,
      delivery_status: "sent",
      attempt_count: 1,
    })
    .eq("id", newsletterId);

  // Update user's last newsletter timestamp
  await supabase
    .from("users")
    .update({ last_newsletter_at: new Date().toISOString() })
    .eq("id", typedUser.id);

  console.log(`${tag} Done — sent successfully`);
  return NextResponse.json({
    status: "sent",
    subject: newsletter.subject,
    articleCount: matchedArticles.length,
  });
}
