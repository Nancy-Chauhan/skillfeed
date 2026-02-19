import { z } from "zod/v4";
import { callClaude } from "@/lib/claude/client";
import { LEVELS } from "@/lib/utils/constants";
import type { ComposedNewsletter, MatchedArticle, User } from "@/lib/utils/types";

const NewsletterSchema = z.object({
  subject: z.string(),
  greeting: z.string(),
  featured_articles: z
    .array(
      z.object({
        title: z.string(),
        summary: z.string(),
        why_it_matters: z.string(),
        url: z.string().nullable(),
        level: z.enum(LEVELS),
      })
    )
    .min(1)
    .max(6),
  roadmap_items: z.array(z.string()).max(3),
  closing: z.string(),
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
- featured_articles: 4-6 articles with:
  - title, summary, url, level (from the provided articles)
  - why_it_matters: 1-2 sentences explaining why THIS article matters for THIS user's specific goals. Reference their current skills and target role.
- roadmap_items: 2-3 actionable next steps tailored to their learning trajectory. Be specific, not generic.
- closing: A warm, encouraging closing that reinforces their growth journey

Rules:
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
      `${i + 1}. "${a.title}" (${a.level}) — ${a.summary ?? "No summary"}\n   URL: ${a.url ?? "none"}\n   Keywords: ${a.keywords.join(", ")}\n   Relevance score: ${a.relevance_score}`
  )
  .join("\n\n")}`;

  const userMessage = `${userContext}\n\n${articlesContext}`;
  const response = await callClaude(SYSTEM_PROMPT, userMessage);

  let parsed: unknown;
  try {
    parsed = JSON.parse(response);
  } catch {
    throw new Error(
      `Failed to parse newsletter composer response: ${response.slice(0, 200)}`
    );
  }

  const result = NewsletterSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `Newsletter failed schema validation: ${JSON.stringify(result.error)}`
    );
  }

  return result.data;
}
