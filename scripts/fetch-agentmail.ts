import { config } from "dotenv";
config({ path: ".env.local" });

import { AgentMailClient } from "agentmail";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const agentmail = new AgentMailClient({
  apiKey: process.env.AGENTMAIL_API_KEY!,
});

const INBOX = process.env.AGENTMAIL_INBOX || "perfectcar947@agentmail.to";

// Extract URLs from text content
function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s<>"')\]]+/g;
  const matches = text.match(urlRegex) || [];
  // Clean trailing punctuation
  return matches.map((u) =>
    u.replace(/[.,;:!?)}\]]+$/, "").replace(/&amp;/g, "&")
  );
}

// Filter to likely article URLs (skip tracking, unsubscribe, images, etc.)
function isArticleUrl(url: string): boolean {
  const skip = [
    "unsubscribe", "manage-preferences", "list-manage", "mailchimp",
    "tracking", "click.", "open.", "pixel", "beacon",
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico",
    "fonts.googleapis", "cdn.", "cloudfront",
    "twitter.com/intent", "facebook.com/sharer", "linkedin.com/share",
    "mailto:", "tel:", "javascript:",
    "agentmail.to", "email.mg.", "sendgrid", "amazonses",
    "substack.com/subscribe", "substack.com/app",
    "buttondown.email/api",
  ];
  const lower = url.toLowerCase();
  return !skip.some((s) => lower.includes(s));
}

// Normalize URL for dedup comparison
function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    // Remove common tracking params
    const trackingParams = [
      "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
      "ref", "source", "mc_cid", "mc_eid", "s", "ss", "ck_subscriber_id",
    ];
    for (const p of trackingParams) u.searchParams.delete(p);
    // Remove trailing slash
    let path = u.pathname.replace(/\/+$/, "");
    return `${u.hostname}${path}${u.search}`.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

interface ExtractedArticle {
  url: string;
  normalizedUrl: string;
  fromNewsletter: string;
  receivedAt: string;
}

async function main() {
  console.log("Step 1: Fetching all threads from AgentMail...\n");

  const threads = await agentmail.threads.list(INBOX);
  console.log(`Found ${threads.count} threads\n`);

  // Fetch all email content
  const allExtracted: ExtractedArticle[] = [];
  const newsletterSummary: { subject: string; urlCount: number; date: string }[] = [];

  for (const thread of threads.threads ?? []) {
    const subject = thread.subject || "(no subject)";
    process.stdout.write(`  Fetching: ${subject.slice(0, 70)}...`);

    try {
      const result = await agentmail.threads.get(thread.threadId!);
      const messages = (result as any).messages ?? [];
      const msg = messages[0];
      if (!msg) {
        console.log(" no messages");
        continue;
      }

      const text = msg.text || msg.extractedText || "";
      const html = msg.html || msg.extractedHtml || "";
      const content = text + "\n" + html;

      const urls = extractUrls(content).filter(isArticleUrl);
      // Deduplicate within same email
      const uniqueUrls = [...new Set(urls.map(normalizeUrl))];
      const urlMap = new Map(urls.map((u) => [normalizeUrl(u), u]));

      for (const norm of uniqueUrls) {
        allExtracted.push({
          url: urlMap.get(norm) || norm,
          normalizedUrl: norm,
          fromNewsletter: subject,
          receivedAt: thread.createdAt || new Date().toISOString(),
        });
      }

      newsletterSummary.push({
        subject,
        urlCount: uniqueUrls.length,
        date: thread.createdAt?.split("T")[0] || "unknown",
      });

      console.log(` ${uniqueUrls.length} URLs`);
    } catch (err) {
      console.log(` ERROR: ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(`\n--- AgentMail Summary ---`);
  console.log(`Total newsletters: ${newsletterSummary.length}`);
  console.log(`Total unique article URLs extracted: ${allExtracted.length}`);

  // Deduplicate across newsletters
  const globalDedup = new Map<string, ExtractedArticle>();
  for (const a of allExtracted) {
    if (!globalDedup.has(a.normalizedUrl)) {
      globalDedup.set(a.normalizedUrl, a);
    }
  }
  console.log(`After cross-newsletter dedup: ${globalDedup.size} unique URLs\n`);

  // Step 2: Compare against existing DB articles
  console.log("Step 2: Fetching existing articles from DB...\n");
  const { data: dbArticles, error } = await supabase
    .from("articles")
    .select("id, url, title, source_name")
    .eq("processing_status", "completed");

  if (error) {
    console.error("Failed to fetch articles:", error.message);
    process.exit(1);
  }

  console.log(`DB has ${dbArticles?.length || 0} articles\n`);

  // Build a set of normalized DB URLs
  const dbUrlSet = new Set<string>();
  for (const a of dbArticles || []) {
    if (a.url) dbUrlSet.add(normalizeUrl(a.url));
  }

  // Find overlaps and new articles
  let duplicateCount = 0;
  let newCount = 0;
  const newArticles: ExtractedArticle[] = [];
  const duplicates: { url: string; newsletter: string }[] = [];

  for (const [normUrl, article] of globalDedup) {
    if (dbUrlSet.has(normUrl)) {
      duplicateCount++;
      duplicates.push({ url: article.url, newsletter: article.fromNewsletter });
    } else {
      newCount++;
      newArticles.push(article);
    }
  }

  console.log("--- Deduplication Results ---");
  console.log(`URLs already in DB (duplicates): ${duplicateCount}`);
  console.log(`New URLs not in DB: ${newCount}`);

  if (duplicates.length > 0) {
    console.log(`\nDuplicate URLs (already from RSS):`);
    for (const d of duplicates.slice(0, 20)) {
      console.log(`  ${d.url}`);
    }
    if (duplicates.length > 20) console.log(`  ... and ${duplicates.length - 20} more`);
  }

  if (newArticles.length > 0) {
    console.log(`\nNew article URLs (from newsletters only):`);
    for (const a of newArticles.slice(0, 30)) {
      console.log(`  ${a.url}`);
      console.log(`    from: ${a.fromNewsletter.slice(0, 80)}`);
    }
    if (newArticles.length > 30) console.log(`  ... and ${newArticles.length - 30} more`);
  }

  // Newsletter breakdown
  console.log(`\n--- Per-Newsletter Breakdown ---`);
  for (const n of newsletterSummary) {
    console.log(`  [${n.date}] ${n.urlCount} URLs | ${n.subject.slice(0, 70)}`);
  }
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
