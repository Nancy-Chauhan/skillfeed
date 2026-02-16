import Parser from "rss-parser";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const parser = new Parser();

// Real tech RSS feeds
const RSS_FEEDS = [
  { url: "https://hnrss.org/best?count=10", name: "Hacker News Best" },
  { url: "https://dev.to/feed/tag/ai", name: "Dev.to AI" },
  { url: "https://dev.to/feed/tag/webdev", name: "Dev.to WebDev" },
  { url: "https://dev.to/feed/tag/devops", name: "Dev.to DevOps" },
  { url: "https://dev.to/feed/tag/security", name: "Dev.to Security" },
  { url: "https://blog.google/technology/ai/rss/", name: "Google AI Blog" },
  { url: "https://aws.amazon.com/blogs/machine-learning/feed/", name: "AWS ML Blog" },
  { url: "https://engineering.fb.com/feed/", name: "Meta Engineering" },
];

const SYSTEM_PROMPT = `You are an article categorizer for SkillFeed, a developer learning platform.

Given an article title, link, and content snippet, categorize it for developer learners.

Return ONLY valid JSON (no markdown fences) with this exact structure:
{
  "title": "the article title",
  "summary": "2-3 sentence summary of what the article covers and why it's valuable for developers",
  "level": "beginner" | "intermediate" | "senior",
  "roles": ["backend", "devops", "security", "solutions_engineer", "ai_engineer", "general"],
  "keywords": ["keyword1", "keyword2", ...]
}

Rules:
- roles: pick 1-3 from: backend, devops, security, solutions_engineer, ai_engineer, general
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
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = response.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") return null;

    let jsonText = text.text.trim();
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

  const items = feed.items.slice(0, 5); // Take top 5 per feed
  console.log(`  Found ${feed.items.length} items, processing top ${items.length}`);

  let inserted = 0;
  for (const item of items) {
    if (!item.title || !item.link) continue;

    const messageId = `rss:${item.guid ?? item.link}`;

    // Skip if already exists
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
  console.log("Starting RSS ingestion...\n");

  let total = 0;
  for (const feed of RSS_FEEDS) {
    const count = await ingestFeed(feed.url, feed.name);
    total += count;
  }

  console.log(`\nDone! Inserted ${total} new articles.`);

  // Show summary
  const { data: articles } = await supabase
    .from("articles")
    .select("title, level, roles, url")
    .eq("processing_status", "completed")
    .order("received_at", { ascending: false })
    .limit(20);

  if (articles?.length) {
    console.log(`\nLatest articles in database:`);
    for (const a of articles) {
      console.log(`  [${a.level}] ${a.title}`);
      console.log(`    ${a.url}`);
    }
  }
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
