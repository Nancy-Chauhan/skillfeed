import Parser from "rss-parser";
import { createAdminClient } from "@/lib/supabase/admin";
import { callClaude } from "@/lib/claude/client";
import { RSS_FEEDS } from "./feeds";
import { LEVELS, ROLES } from "@/lib/utils/constants";

const parser = new Parser();

const CATEGORIZE_PROMPT = `You are an article categorizer for SkillFeed, a developer learning platform.

Given an article title, link, and content snippet, categorize it for developer learners.

Return ONLY valid JSON (no markdown fences) with this exact structure:
{
  "title": "the article title",
  "summary": "2-3 sentence summary of what the article covers and why it's valuable for developers",
  "takeaway": "A single sentence explaining why this matters for someone in the relevant roles",
  "level": "beginner" | "intermediate" | "senior",
  "roles": ["backend", "ai_engineer", "general"],
  "keywords": ["keyword1", "keyword2", ...]
}

Rules:
- roles: pick 1-3 from: frontend, backend, fullstack, mobile, data_engineer, devops, security, product_manager, engineering_manager, solutions_engineer, ai_engineer, ml_engineer, data_scientist, mlops, ai_product_manager, general
- level: beginner (tutorials, intros), intermediate (practical guides, patterns), senior (architecture, scale, deep dives)
- keywords: 3-6 specific technical terms
- summary: focus on practical value for the developer
- takeaway: one sentence on why this article matters for the relevant roles`;

interface FeedItem {
  title?: string;
  link?: string;
  contentSnippet?: string;
  content?: string;
  pubDate?: string;
  guid?: string;
}

async function categorizeArticle(item: FeedItem): Promise<{
  title: string;
  summary: string;
  takeaway: string;
  level: string;
  roles: string[];
  keywords: string[];
} | null> {
  const content = (item.contentSnippet ?? item.content ?? "").slice(0, 1000);
  const userMessage = `Title: ${item.title}\nURL: ${item.link}\n\nContent:\n${content}`;

  try {
    console.log(`[cron:ingest] RSS: categorizing "${item.title}"...`);
    const response = await callClaude(CATEGORIZE_PROMPT, userMessage, {
      maxTokens: 1024,
    });
    const parsed = JSON.parse(response);

    // Validate and fix level
    if (!LEVELS.includes(parsed.level)) {
      parsed.level = "intermediate";
    }

    // Validate and fix roles
    parsed.roles = (parsed.roles ?? []).filter((r: string) =>
      (ROLES as readonly string[]).includes(r)
    );
    if (parsed.roles.length === 0) parsed.roles = ["general"];

    console.log(`[cron:ingest] RSS: categorized "${item.title}" — level: ${parsed.level}, roles: [${parsed.roles?.join(", ")}]`);
    return parsed;
  } catch (err) {
    console.error(
      `[cron:ingest] RSS: failed to categorize "${item.title}":`,
      err instanceof Error ? err.message : err
    );
    return null;
  }
}

async function ingestFeed(
  feedUrl: string,
  feedName: string
): Promise<number> {
  const supabase = createAdminClient();
  let feed;
  try {
    console.log(`[cron:ingest] RSS: fetching "${feedName}" (${feedUrl})`);
    feed = await parser.parseURL(feedUrl);
  } catch (err) {
    console.error(
      `[cron:ingest] RSS: failed to fetch "${feedName}":`,
      err instanceof Error ? err.message : err
    );
    return 0;
  }

  const items = feed.items.slice(0, 5);
  console.log(`[cron:ingest] RSS: "${feedName}" — ${items.length} items to process`);
  let inserted = 0;

  for (const item of items) {
    if (!item.title || !item.link) {
      console.log(`[cron:ingest] RSS: "${feedName}" — skipping item with missing title/link`);
      continue;
    }

    const messageId = `rss:${item.guid ?? item.link}`;

    // Skip if already exists
    const { data: existing } = await supabase
      .from("articles")
      .select("id")
      .eq("message_id", messageId)
      .single();

    if (existing) {
      console.log(`[cron:ingest] RSS: "${feedName}" — skipping duplicate "${item.title}"`);
      continue;
    }

    const categorized = await categorizeArticle(item);
    if (!categorized) continue;

    const { error } = await supabase.from("articles").insert({
      source_email: feedUrl,
      source_name: feedName,
      original_subject: item.title,
      message_id: messageId,
      title: categorized.title,
      summary: categorized.summary,
      takeaway: categorized.takeaway,
      url: item.link,
      level: categorized.level,
      roles: categorized.roles,
      keywords: categorized.keywords,
      processing_status: "completed",
      received_at: item.pubDate
        ? new Date(item.pubDate).toISOString()
        : new Date().toISOString(),
    });

    if (error) {
      console.error(`[cron:ingest] RSS: DB insert failed for "${item.title}": ${error.message}`);
    } else {
      inserted++;
    }
  }

  console.log(`[cron:ingest] RSS: "${feedName}" — ${inserted} new articles inserted`);
  return inserted;
}

// Process feeds in concurrent batches with a time budget
const BATCH_SIZE = 5;
const TIME_BUDGET_MS = 50_000; // stop starting new batches after 50s (leaves headroom for response)

export async function ingestAllFeeds(): Promise<{
  totalInserted: number;
  feedsProcessed: number;
  feedsFailed: number;
  timedOut: boolean;
}> {
  console.log(`[cron:ingest] RSS: starting ingestion of ${RSS_FEEDS.length} feeds`);
  let totalInserted = 0;
  let feedsProcessed = 0;
  let feedsFailed = 0;
  let timedOut = false;
  const startTime = Date.now();

  for (let i = 0; i < RSS_FEEDS.length; i += BATCH_SIZE) {
    if (Date.now() - startTime > TIME_BUDGET_MS) {
      console.log(`[cron:ingest] RSS: time budget exceeded after ${feedsProcessed} feeds, stopping`);
      timedOut = true;
      break;
    }

    const batch = RSS_FEEDS.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((feed) => ingestFeed(feed.url, feed.name))
    );

    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      if (result.status === "fulfilled") {
        totalInserted += result.value;
        feedsProcessed++;
      } else {
        console.error(`[cron:ingest] RSS: feed "${batch[j].name}" threw unexpectedly:`, result.reason);
        feedsFailed++;
      }
    }
  }

  console.log(`[cron:ingest] RSS: all feeds done — ${feedsProcessed} processed, ${totalInserted} total inserted, ${feedsFailed} failed, timedOut=${timedOut}`);
  return { totalInserted, feedsProcessed, feedsFailed, timedOut };
}
