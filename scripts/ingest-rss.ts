import { config } from "dotenv";
import Parser from "rss-parser";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const parser = new Parser();

// ============================================================
// RSS FEEDS — 60+ curated sources across AI, engineering,
// DevOps, security, and web development
// ============================================================

const RSS_FEEDS = [
  // ── AI / ML: Company Blogs ─────────────────────────────────
  { url: "https://openai.com/news/rss.xml", name: "OpenAI Blog" },
  { url: "https://blog.google/technology/ai/rss/", name: "Google AI Blog" },
  { url: "https://deepmind.google/blog/rss.xml", name: "Google DeepMind" },
  { url: "https://research.google/blog/rss/", name: "Google Research" },
  { url: "https://ai.meta.com/blog/rss/", name: "Meta AI Blog" },
  { url: "https://engineering.fb.com/feed/", name: "Meta Engineering" },
  { url: "https://huggingface.co/blog/feed.xml", name: "Hugging Face Blog" },
  { url: "https://developer.nvidia.com/blog/feed/", name: "NVIDIA Developer Blog" },
  { url: "https://www.microsoft.com/en-us/research/blog/feed/", name: "Microsoft Research" },
  { url: "https://aws.amazon.com/blogs/machine-learning/feed/", name: "AWS ML Blog" },
  { url: "https://aws.amazon.com/blogs/ai/feed/", name: "AWS AI Blog" },
  { url: "https://stability.ai/blog?format=rss", name: "Stability AI Blog" },
  { url: "https://txt.cohere.com/rss/", name: "Cohere Blog" },

  // ── AI / ML: Newsletters & Independent Blogs ───────────────
  { url: "https://importai.substack.com/feed", name: "Import AI (Jack Clark)" },
  { url: "https://magazine.sebastianraschka.com/feed", name: "Ahead of AI (Sebastian Raschka)" },
  { url: "https://simonwillison.net/atom/everything/", name: "Simon Willison's Weblog" },
  { url: "https://lilianweng.github.io/index.xml", name: "Lil'Log (Lilian Weng)" },
  { url: "https://colah.github.io/rss.xml", name: "colah's blog (Chris Olah)" },
  { url: "https://karpathy.bearblog.dev/feed/?type=rss", name: "Andrej Karpathy's Blog" },
  { url: "https://huyenchip.com/feed.xml", name: "Chip Huyen Blog" },
  { url: "https://jalammar.github.io/feed.xml", name: "Jay Alammar Blog" },
  { url: "https://distill.pub/rss.xml", name: "Distill.pub" },
  { url: "https://lastweekin.ai/feed", name: "Last Week in AI" },
  { url: "https://towardsdatascience.com/feed", name: "Towards Data Science" },
  { url: "https://machinelearningmastery.com/blog/feed/", name: "Machine Learning Mastery" },

  // ── AI / ML: Research Feeds ────────────────────────────────
  { url: "https://export.arxiv.org/rss/cs.AI", name: "arXiv cs.AI" },
  { url: "https://export.arxiv.org/rss/cs.LG", name: "arXiv cs.LG (Machine Learning)" },

  // ── Engineering / Backend: Company Blogs ───────────────────
  { url: "https://netflixtechblog.com/feed", name: "Netflix Tech Blog" },
  { url: "https://eng.uber.com/feed/", name: "Uber Engineering" },
  { url: "https://stripe.com/blog/feed.rss", name: "Stripe Blog" },
  { url: "https://medium.com/feed/airbnb-engineering", name: "Airbnb Engineering" },
  { url: "https://engineering.atspotify.com/feed/", name: "Spotify Engineering" },
  { url: "https://blog.cloudflare.com/rss/", name: "Cloudflare Blog" },
  { url: "https://github.blog/engineering.atom", name: "GitHub Engineering" },
  { url: "https://engineering.linkedin.com/blog.rss.html", name: "LinkedIn Engineering" },
  { url: "https://dropbox.tech/feed", name: "Dropbox Tech Blog" },
  { url: "https://medium.com/feed/@Pinterest_Engineering", name: "Pinterest Engineering" },
  { url: "https://shopify.engineering/blog.atom", name: "Shopify Engineering" },
  { url: "https://discord.com/blog/rss.xml", name: "Discord Blog" },
  { url: "https://slack.engineering/feed/", name: "Slack Engineering" },
  { url: "https://eng.lyft.com/feed", name: "Lyft Engineering" },

  // ── DevOps / Infrastructure ────────────────────────────────
  { url: "https://kubernetes.io/feed.xml", name: "Kubernetes Blog" },
  { url: "https://www.docker.com/blog/feed/", name: "Docker Blog" },
  { url: "https://www.cncf.io/feed/", name: "CNCF Blog" },
  { url: "https://www.hashicorp.com/blog/feed.xml", name: "HashiCorp Blog" },
  { url: "https://aws.amazon.com/blogs/devops/feed/", name: "AWS DevOps Blog" },

  // ── Security ───────────────────────────────────────────────
  { url: "https://krebsonsecurity.com/feed/", name: "Krebs on Security" },
  { url: "https://feeds.feedburner.com/TroyHunt", name: "Troy Hunt Blog" },
  { url: "https://www.schneier.com/feed/atom/", name: "Schneier on Security" },
  { url: "https://googleprojectzero.blogspot.com/feeds/posts/default?alt=rss", name: "Google Project Zero" },
  { url: "https://msrc.microsoft.com/blog/feed/", name: "Microsoft Security Response Center" },
  { url: "https://portswigger.net/research/rss", name: "PortSwigger Research" },

  // ── Web Dev / Frontend ─────────────────────────────────────
  { url: "https://www.smashingmagazine.com/feed/", name: "Smashing Magazine" },
  { url: "https://css-tricks.com/feed/", name: "CSS-Tricks" },
  { url: "https://overreacted.io/rss.xml", name: "Overreacted (Dan Abramov)" },
  { url: "https://joshwcomeau.com/rss.xml", name: "Josh W. Comeau" },
  { url: "https://kentcdodds.com/blog/rss.xml", name: "Kent C. Dodds" },
  { url: "https://vercel.com/atom", name: "Vercel Blog" },
  { url: "https://web.dev/static/blog/feed.xml", name: "web.dev (Google)" },

  // ── General Dev / Aggregators ──────────────────────────────
  { url: "https://hnrss.org/best?count=10", name: "Hacker News Best" },
  { url: "https://dev.to/feed/tag/ai", name: "Dev.to AI" },
  { url: "https://dev.to/feed/tag/webdev", name: "Dev.to WebDev" },
  { url: "https://dev.to/feed/tag/devops", name: "Dev.to DevOps" },
  { url: "https://dev.to/feed/tag/security", name: "Dev.to Security" },
  { url: "https://dev.to/feed/tag/javascript", name: "Dev.to JavaScript" },
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
