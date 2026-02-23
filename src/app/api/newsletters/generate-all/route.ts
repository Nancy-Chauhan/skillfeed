import { NextResponse, after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { composeNewsletterAuto as composeNewsletter } from "@/lib/agents/newsletter-composer-factory";
import { getResend } from "@/lib/resend/client";
import { renderNewsletterEmail } from "@/emails/newsletter-template";
import { MIN_ARTICLES_FOR_NEWSLETTER } from "@/lib/utils/constants";
import type { User, MatchedArticle } from "@/lib/utils/types";
import { buildTrackingPixelUrl, buildFeedbackUrl, buildClickTrackingUrl } from "@/lib/metrics/events";
import jwt from "jsonwebtoken";

export const maxDuration = 300;

const CONCURRENCY_LIMIT = 5;

async function generateForUser(userId: string): Promise<"sent" | "skipped" | "failed"> {
  const tag = `[cron:generate-all] [user:${userId}]`;
  console.log(`${tag} Starting newsletter generation`);
  const supabase = createAdminClient();

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (userError || !user) {
    console.log(`${tag} Skipped — user fetch failed: ${userError?.message ?? "no data"}`);
    return "failed";
  }

  const typedUser = user as User;

  if (!typedUser.is_active || typedUser.unsubscribed_at) {
    console.log(`${tag} Skipped — inactive or unsubscribed`);
    return "skipped";
  }

  if (typedUser.last_newsletter_at) {
    const userTz = typedUser.timezone || "UTC";
    const now = new Date();
    const todayLocal = now.toLocaleDateString("en-CA", { timeZone: userTz });
    const lastSentLocal = new Date(typedUser.last_newsletter_at)
      .toLocaleDateString("en-CA", { timeZone: userTz });
    if (lastSentLocal === todayLocal) {
      console.log(`${tag} Skipped — already sent today (${userTz})`);
      return "skipped";
    }
  }

  // Claim this user immediately to prevent duplicate sends from overlapping cron runs.
  // Uses optimistic locking: only update if last_newsletter_at hasn't changed since we read it.
  const previousLastNewsletterAt = typedUser.last_newsletter_at;
  let claimQuery = supabase
    .from("users")
    .update({ last_newsletter_at: new Date().toISOString() })
    .eq("id", typedUser.id);

  if (previousLastNewsletterAt) {
    claimQuery = claimQuery.eq("last_newsletter_at", previousLastNewsletterAt);
  } else {
    claimQuery = claimQuery.is("last_newsletter_at", null);
  }

  const { data: claimData, error: claimError } = await claimQuery.select("id");

  if (claimError || !claimData || claimData.length === 0) {
    console.log(`${tag} Skipped — failed to claim user (likely already claimed by another run)`);
    return "skipped";
  }

  // Helper to roll back the claim so the user gets retried on the next cron run
  const rollbackClaim = async () => {
    await supabase
      .from("users")
      .update({ last_newsletter_at: previousLastNewsletterAt })
      .eq("id", typedUser.id);
  };

  const { data: articles, error: matchError } = await supabase.rpc(
    "match_articles_for_user",
    { p_user_id: userId }
  );

  if (matchError) {
    console.log(`${tag} Failed — article match error: ${matchError.message}`);
    await rollbackClaim();
    return "failed";
  }

  const matchedArticles = (articles ?? []) as MatchedArticle[];
  if (matchedArticles.length < MIN_ARTICLES_FOR_NEWSLETTER) {
    console.log(`${tag} Skipped — only ${matchedArticles.length} articles (need ${MIN_ARTICLES_FOR_NEWSLETTER})`);
    await rollbackClaim();
    return "skipped";
  }

  console.log(`${tag} Matched ${matchedArticles.length} articles, composing newsletter...`);
  const newsletter = await composeNewsletter(typedUser, matchedArticles);
  console.log(`${tag} Newsletter composed, subject: "${newsletter.subject}"`);

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

  if (insertError || !newsletterRecord) {
    console.log(`${tag} Failed — newsletter record insert error: ${insertError?.message ?? "no data"}`);
    return "failed";
  }

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
    await supabase
      .from("newsletters_sent")
      .update({
        html_content: htmlContent,
        delivery_status: "failed",
        attempt_count: 1,
        error_message: sendError.message,
      })
      .eq("id", newsletterId);
    await rollbackClaim();
    return "failed";
  }

  console.log(`${tag} Email sent via Resend (id: ${emailResult?.id ?? "unknown"})`);

  const { error: updateSentError } = await supabase
    .from("newsletters_sent")
    .update({
      html_content: htmlContent,
      resend_email_id: emailResult?.id ?? null,
      delivery_status: "sent",
      attempt_count: 1,
    })
    .eq("id", newsletterId);

  if (updateSentError) {
    console.log(`${tag} Warning — failed to update newsletter status to sent: ${updateSentError.message}`);
  }

  console.log(`${tag} Done — sent successfully`);
  return "sent";
}

async function processUsers(users: { id: string }[]) {
  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < users.length; i += CONCURRENCY_LIMIT) {
    const batch = users.slice(i, i + CONCURRENCY_LIMIT);
    console.log(`[cron:generate-all] Processing batch ${Math.floor(i / CONCURRENCY_LIMIT) + 1} (users ${i + 1}-${Math.min(i + CONCURRENCY_LIMIT, users.length)} of ${users.length})`);
    const results = await Promise.allSettled(
      batch.map((user: { id: string }) => generateForUser(user.id))
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        if (result.value === "sent") processed++;
        else if (result.value === "skipped") skipped++;
        else failed++;
      } else {
        console.error("[cron:generate-all] Newsletter generation rejected:", result.reason);
        failed++;
      }
    }
  }

  console.log(`[cron:generate-all] Complete — sent: ${processed}, skipped: ${skipped}, failed: ${failed}`);
}

async function generateAll(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log(`[cron:generate-all] Hourly newsletter run at ${new Date().toISOString()}`);

  const supabase = createAdminClient();

  const { data: users, error } = await supabase.rpc(
    "get_users_due_for_newsletter",
    { p_target_hour: 8 }
  );

  if (error) {
    console.error("[cron:generate-all] Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }

  if (!users || users.length === 0) {
    console.log("[cron:generate-all] No eligible users found");
    return NextResponse.json({ status: "accepted", queued: 0 });
  }

  console.log(`[cron:generate-all] Queued ${users.length} users for processing`);

  // Return immediately, process in the background
  after(async () => {
    await processUsers(users as { id: string }[]);
  });

  return NextResponse.json({ status: "accepted", queued: users.length });
}

// Vercel crons send GET requests
export async function GET(request: Request) {
  return generateAll(request);
}

export async function POST(request: Request) {
  return generateAll(request);
}
