import { z } from "zod/v4";
import { callClaude } from "@/lib/claude/client";
import { LEVELS } from "@/lib/utils/constants";
import type { ComposedNewsletter, MatchedArticle, User } from "@/lib/utils/types";

const FeaturedArticleSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  why_it_matters: z.string().min(1),
  url: z.string().url(),
  level: z.enum(LEVELS),
});

const NewsletterSchema = z.object({
  subject: z.string().min(1),
  greeting: z.string().min(1),
  featured_articles: z.array(FeaturedArticleSchema).min(1).max(6),
  roadmap_items: z.array(z.string()).max(3),
  closing: z.string().min(1),
});

const SYSTEM_PROMPT = `You are the newsletter composer for SkillFeed, a personalized AI learning platform.

Given a user's profile and a set of matched articles, compose a personalized newsletter.

Your tone should be:
- Encouraging, not pushy
- Personal, not corporate (use their name, reference their specific journey)
- Clear, not clever
- Calm, not urgent
- Growth-oriented

Produce:
- subject: A short, warm subject line (e.g., "Your AI Learning Brief, Feb 15")
- greeting: A personalized greeting referencing their specific career trajectory
- featured_articles: 4-6 articles. EVERY article MUST include ALL of these fields:
  - title: The article title (copy exactly from the provided articles)
  - summary: A concise description of what the article covers
  - why_it_matters: 1-2 sentences explaining why THIS article matters for THIS user's specific goals. Reference their current skills and target role.
  - url: The article URL (copy exactly from the provided articles — never omit, never set to null)
  - level: The difficulty level (copy exactly from the provided articles)
- roadmap_items: 2-3 actionable next steps tailored to their learning trajectory. Be specific, not generic.
- closing: A warm, encouraging closing that reinforces their growth journey

Rules:
- EVERY featured_article MUST have all 5 fields: title, summary, why_it_matters, url, level. No exceptions.
- Copy url and level exactly from the input articles — do not modify or omit them.
- why_it_matters MUST be personalized. Never write generic descriptions.
- Roadmap items should connect the articles to concrete next actions
- Keep the tone calm and supportive — no FOMO, no urgency
- Respond with valid JSON only, no markdown fences

Respond with JSON only, no markdown fences, no explanation.`;

export async function composeNewsletter(
  user: User,
  articles: MatchedArticle[]
): Promise<ComposedNewsletter> {
  const userContext = `User Profile:
- Name: ${user.name ?? "there"}
- Current roles: ${user.current_roles.join(", ")}
- Target roles: ${user.target_roles.join(", ")}
- Current level: ${user.current_level}
- Target level: ${user.target_level}
- Skills: ${user.extracted_skills.join(", ")}
- Learning goals: ${user.learning_goals.join("; ")}
- Keywords of interest: ${user.extracted_keywords.join(", ")}`;

  const articlesContext = `Matched Articles (ordered by relevance):
${articles
  .map(
    (a, i) =>
      `${i + 1}. "${a.title}" (${a.level}) — ${a.summary ?? "No summary"}\n   URL: ${a.url}\n   Keywords: ${a.keywords.join(", ")}\n   Relevance score: ${a.relevance_score}`
  )
  .join("\n\n")}`;

  const userMessage = `${userContext}\n\n${articlesContext}`;

  const MAX_ATTEMPTS = 2;
  let lastError: string | null = null;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const prompt = attempt === 0
      ? userMessage
      : `${userMessage}\n\nYour previous response had validation errors:\n${lastError}\n\nPlease fix and return valid JSON. Every featured_article MUST have: title, summary, why_it_matters, url (valid URL), and level.`;

    const response = await callClaude(SYSTEM_PROMPT, prompt);

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(response);
    } catch {
      lastError = `Invalid JSON: ${response.slice(0, 200)}`;
      console.warn(`Newsletter compose attempt ${attempt + 1} failed: ${lastError}`);
      continue;
    }

    // Normalize roadmap_items: some LLMs return objects instead of strings
    if (Array.isArray(parsed.roadmap_items)) {
      parsed.roadmap_items = parsed.roadmap_items.map((item: unknown) => {
        if (typeof item === "string") return item;
        const obj = item as Record<string, unknown>;
        return String(obj.text ?? obj.description ?? obj.step ?? Object.values(obj)[0] ?? "");
      });
    }

    const result = NewsletterSchema.safeParse(parsed);
    if (result.success) {
      return result.data;
    }

    lastError = JSON.stringify(result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`));
    console.warn(`Newsletter compose attempt ${attempt + 1} validation failed: ${lastError}`);
  }

  throw new Error(
    `Newsletter failed schema validation after ${MAX_ATTEMPTS} attempts: ${lastError}`
  );
}
