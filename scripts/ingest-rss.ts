import { config } from "dotenv";
config({ path: ".env.local" });

// Dynamic import after env is loaded so callClaude picks up GEMINI_API_KEY
const { callClaude } = await import("@/lib/claude/client");

import Parser from "rss-parser";
import { createClient } from "@supabase/supabase-js";
import { RSS_FEEDS } from "@/lib/rss/feeds";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const parser = new Parser();

const SYSTEM_PROMPT = `You are an article categorizer for SkillFeed, a developer learning platform.

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
    const response = await callClaude(SYSTEM_PROMPT, userMessage, {
      maxTokens: 1024,
    });

    let jsonText = response.trim();
    const match = jsonText.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/);
    if (match) jsonText = match[1].trim();

    return JSON.parse(jsonText);
  } catch (err) {
    console.error(`  Failed to categorize "${item.title}":`, err instanceof Error ? err.message : err);
    return null;
  }
}

async function ingestFeed(feedUrl: string, feedName: string) {
  console.log(`\nFetching ${feedName}...`);
  let feed;
  try {
    feed = await parser.parseURL(feedUrl);
  } catch (err) {
    console.error(`  Failed to fetch ${feedName}:`, err instanceof Error ? err.message : err);
    return 0;
  }

  const items = feed.items.slice(0, 5);
  console.log(`  Found ${feed.items.length} items, processing top ${items.length}`);

  let inserted = 0;
  for (const item of items) {
    if (!item.title || !item.link) continue;

    const messageId = `rss:${item.guid ?? item.link}`;

    const { data: existing } = await supabase
      .from("articles")
      .select("id")
      .eq("message_id", messageId)
      .single();

    if (existing) {
      console.log(`  Skipping (already exists): ${item.title}`);
      continue;
    }

    console.log(`  Categorizing: ${item.title}`);
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
      received_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
    });

    if (error) {
      console.error(`  DB insert failed for "${item.title}":`, error.message);
    } else {
      console.log(`  Inserted: ${categorized.title} [${categorized.level}] [${categorized.roles.join(", ")}]`);
      inserted++;
    }
  }

  return inserted;
}

async function main() {
  console.log(`Starting RSS ingestion (provider: ${process.env.LLM_PROVIDER ?? "auto"})...\n`);

  let total = 0;
  for (const feed of RSS_FEEDS) {
    const count = await ingestFeed(feed.url, feed.name);
    total += count;
  }

  console.log(`\nDone! Inserted ${total} new articles.`);
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
