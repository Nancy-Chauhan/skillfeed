import { z } from "zod/v4";
import { callClaude } from "@/lib/claude/client";
import { ROLES, LEVELS } from "@/lib/utils/constants";
import type { CategorizedArticle } from "@/lib/utils/types";

const ArticleSchema = z.object({
  title: z.string(),
  summary: z.string(),
  takeaway: z.string(),
  level: z.string().transform((v) =>
    (LEVELS as readonly string[]).includes(v) ? v as typeof LEVELS[number] : "intermediate" as const
  ),
  roles: z.array(z.string()).min(1).transform((arr) => {
    const valid = arr.filter((r) => (ROLES as readonly string[]).includes(r)) as (typeof ROLES[number])[];
    return valid.length > 0 ? valid : ["general" as const];
  }),
  keywords: z.array(z.string()).min(1),
  url: z.string().url().nullable(),
});

const ResponseSchema = z.object({
  articles: z.array(ArticleSchema),
});

const SYSTEM_PROMPT = `You are an article categorizer for a developer learning newsletter platform called SkillFeed.

Given a raw newsletter email, extract each distinct article/topic into a structured format.

For each article, provide:
- title: A clear, concise title
- summary: 2-3 sentence summary of the key takeaway
- takeaway: A single sentence explaining why this article matters for someone in the relevant roles (e.g. "Helps backend engineers understand how to scale WebSocket connections under load.")
- level: One of "beginner", "intermediate", "senior" based on assumed reader expertise
- roles: Array of relevant roles from: "frontend", "backend", "fullstack", "mobile", "data_engineer", "devops", "security", "product_manager", "engineering_manager", "solutions_engineer", "ai_engineer", "ml_engineer", "data_scientist", "mlops", "ai_product_manager". Pick all that apply.
- keywords: Array of 3-8 specific technical keywords (technologies, concepts, tools)
- url: The original article URL if present, otherwise null

Rules:
- If the email contains multiple articles/topics, extract each separately
- If the email is not a newsletter or has no extractable articles, return an empty articles array
- Be specific with keywords — prefer "LangChain" over "AI framework"
- Level should reflect the assumed reader, not the topic complexity
- Always respond with valid JSON matching the schema

Respond with JSON only, no markdown fences, no explanation.`;

export async function categorizeArticles(
  subject: string,
  body: string
): Promise<CategorizedArticle[]> {
  const userMessage = `Email Subject: ${subject}\n\nEmail Body:\n${body}`;

  const response = await callClaude(SYSTEM_PROMPT, userMessage);

  let parsed: unknown;
  try {
    parsed = JSON.parse(response);
  } catch {
    console.error("Failed to parse Claude response as JSON:", response.slice(0, 200));
    return [];
  }

  const result = ResponseSchema.safeParse(parsed);
  if (!result.success) {
    console.error("Claude response failed schema validation:", result.error);
    return [];
  }

  // Drop articles without a URL — they can't be linked in newsletters
  return result.data.articles.filter(
    (a): a is typeof a & { url: string } => a.url !== null
  );
}
