import Parser from "rss-parser";
import { createAdminClient } from "@/lib/supabase/admin";
import { callClaude } from "@/lib/claude/client";
import { RSS_FEEDS } from "./feeds";

const parser = new Parser();

const CATEGORIZE_PROMPT = `You are an article categorizer for SkillFeed, a developer learning platform.

Given an article title, link, and content snippet, categorize it for developer learners.

Return ONLY valid JSON (no markdown fences) with this exact structure:
{
  "title": "the article title",
  "summary": "2-3 sentence summary of what the article covers and why it's valuable for developers",
  "level": "beginner" | "intermediate" | "senior",
  "roles": ["backend", "ai_engineer", "general"],
  "keywords": ["keyword1", "keyword2", ...]
}

Rules:
- roles: pick 1-3 from: frontend, backend, fullstack, mobile, data_engineer, devops, security, product_manager, engineering_manager, solutions_engineer, ai_engineer, ml_engineer, data_scientist, mlops, ai_product_manager, general
- level: beginner (tutorials, intros), intermediate (practical guides, patterns), senior (architecture, scale, deep dives)
- keywords: 3-6 specific technical terms
- summary: focus on practical value for the developer`;

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

export async function ingestAllFeeds(): Promise<{
  totalInserted: number;
  feedsProcessed: number;
  feedsFailed: number;
}> {
  console.log(`[cron:ingest] RSS: starting ingestion of ${RSS_FEEDS.length} feeds`);
  let totalInserted = 0;
  let feedsProcessed = 0;
  let feedsFailed = 0;

  for (const feed of RSS_FEEDS) {
    try {
      const count = await ingestFeed(feed.url, feed.name);
      totalInserted += count;
      feedsProcessed++;
    } catch (err) {
      console.error(`[cron:ingest] RSS: feed "${feed.name}" threw unexpectedly:`, err instanceof Error ? err.message : err);
      feedsFailed++;
    }
  }

  console.log(`[cron:ingest] RSS: all feeds done — ${feedsProcessed} processed, ${totalInserted} total inserted, ${feedsFailed} failed`);
  return { totalInserted, feedsProcessed, feedsFailed };
}
