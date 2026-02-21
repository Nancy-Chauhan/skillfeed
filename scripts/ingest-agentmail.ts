import { config } from "dotenv";
config({ path: ".env.local" });

import { AgentMailClient } from "agentmail";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const agentmail = new AgentMailClient({
  apiKey: process.env.AGENTMAIL_API_KEY!,
});

const INBOX = process.env.AGENTMAIL_INBOX || "perfectcar947@agentmail.to";

const ROLES = [
  "frontend", "backend", "fullstack", "mobile", "data_engineer", "devops",
  "security", "product_manager", "engineering_manager", "solutions_engineer",
  "ai_engineer", "ml_engineer", "data_scientist", "mlops", "ai_product_manager", "general",
];

const LEVELS = ["beginner", "intermediate", "senior"];

const SYSTEM_PROMPT = `You are an article categorizer for a developer learning newsletter platform called SkillFeed.

Given a raw newsletter email, extract each distinct article/topic into a structured format.

For each article, provide:
- title: A clear, concise title
- summary: 2-3 sentence summary of the key takeaway
- level: One of "beginner", "intermediate", "senior" based on assumed reader expertise
- roles: Array of relevant roles from: ${ROLES.join(", ")}. Pick 1-3 that apply.
- keywords: Array of 3-8 specific technical keywords (technologies, concepts, tools)
- url: The original article URL if present, otherwise null

Rules:
- If the email contains multiple articles/topics, extract each separately
- If the email is not a newsletter or has no extractable articles, return an empty articles array
- Be specific with keywords — prefer "LangChain" over "AI framework"
- Level should reflect the assumed reader, not the topic complexity
- Always respond with valid JSON matching the schema

Respond with JSON only, no markdown fences:
{"articles": [...]}`;

async function categorizeEmail(subject: string, body: string) {
  const userMessage = `Email Subject: ${subject}\n\nEmail Body:\n${body.slice(0, 8000)}`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      systemInstruction: { role: "model", parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 4096,
      },
    });

    const text = result.response.text().trim();
    const parsed = JSON.parse(text);
    return parsed.articles ?? [];
  } catch (err) {
    console.error(`  Failed to categorize "${subject}":`, err instanceof Error ? err.message : err);
    return [];
  }
}

async function main() {
  console.log("Fetching threads from AgentMail inbox...\n");

  const threads = await agentmail.threads.list(INBOX);
  console.log(`Found ${threads.count} threads\n`);

  let totalInserted = 0;
  let totalSkipped = 0;

  for (const thread of threads.threads ?? []) {
    const subject = thread.subject || "(no subject)";
    console.log(`\nProcessing: ${subject}`);

    // Get full thread messages
    let threadData;
    try {
      threadData = await agentmail.threads.get(thread.threadId!);
    } catch (err) {
      console.error(`  Failed to fetch thread:`, err instanceof Error ? err.message : err);
      continue;
    }

    // Get the first message body
    const msg = (threadData as any).messages?.[0] ?? threadData;
    const body = msg.text || msg.body || msg.html || "";
    const from = msg.from || "";
    const messageId = msg.messageId || thread.threadId || "";

    if (!body) {
      console.log(`  No body, skipping`);
      continue;
    }

    // Check if already processed
    const { data: existing } = await supabase
      .from("articles")
      .select("id")
      .like("message_id", `agentmail:${messageId}%`)
      .limit(1);

    if (existing?.length) {
      console.log(`  Already processed, skipping`);
      totalSkipped++;
      continue;
    }

    console.log(`  Categorizing with Gemini...`);
    const articles = await categorizeEmail(subject, body);

    if (!articles.length) {
      console.log(`  No articles extracted`);
      continue;
    }

    for (const article of articles) {
      // Skip articles without a URL
      if (!article.url) {
        console.log(`  Skipping "${article.title}" - no URL`);
        continue;
      }

      // Validate level
      if (!LEVELS.includes(article.level)) {
        console.log(`  Skipping "${article.title}" - invalid level: ${article.level}`);
        continue;
      }

      // Validate roles
      const validRoles = (article.roles || []).filter((r: string) => ROLES.includes(r));
      if (!validRoles.length) validRoles.push("general");

      const artMessageId = `agentmail:${messageId}:${article.title?.slice(0, 50)}`;

      // Handle Date objects for received_at
      const receivedAt = thread.createdAt instanceof Date
        ? thread.createdAt.toISOString()
        : typeof thread.createdAt === "string"
          ? thread.createdAt
          : new Date().toISOString();

      const { error } = await supabase.from("articles").upsert(
        {
          source_email: from,
          source_name: subject.slice(0, 100),
          original_subject: subject,
          message_id: artMessageId,
          title: article.title,
          summary: article.summary,
          url: article.url,
          level: article.level,
          roles: validRoles,
          keywords: article.keywords || [],
          processing_status: "completed",
          received_at: receivedAt,
        },
        { onConflict: "message_id" }
      );

      if (error) {
        console.error(`  DB insert failed for "${article.title}":`, error.message);
      } else {
        console.log(`  Inserted: ${article.title} [${article.level}] [${validRoles.join(", ")}]`);
        totalInserted++;
      }
    }
  }

  console.log(`\nDone! Inserted ${totalInserted} articles, skipped ${totalSkipped} already-processed threads.`);
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
