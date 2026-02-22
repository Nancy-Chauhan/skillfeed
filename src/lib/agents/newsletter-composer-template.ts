import type { ComposedNewsletter, MatchedArticle, User } from "@/lib/utils/types";
import { ROLE_LABELS, type Role } from "@/lib/utils/constants";

function roleLabel(slug: string): string {
  return ROLE_LABELS[slug as Role] ?? slug;
}

export async function composeNewsletterTemplate(
  user: User,
  articles: MatchedArticle[]
): Promise<ComposedNewsletter> {
  const name = user.name ?? "there";
  const firstName = name.split(" ")[0];
  const allTargetRoles = [
    ...user.target_roles.map(roleLabel),
    ...(user.custom_target_roles ?? []),
  ];
  const targetRole = allTargetRoles[0] ?? "your next role";

  const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const includeWhyItMatters = process.env.NEWSLETTER_INCLUDE_WHY_IT_MATTERS !== "false";
  const includeRoadmap = process.env.NEWSLETTER_INCLUDE_ROADMAP !== "false";

  const featured_articles = articles.slice(0, 6).map((a) => {
    let whyItMatters = "";
    if (includeWhyItMatters) {
      whyItMatters = a.takeaway
        ?? `Covers ${a.keywords.slice(0, 3).join(", ")} — relevant to your interests.`;
    }

    return {
      title: a.title,
      summary: a.summary ?? "No summary available.",
      why_it_matters: whyItMatters,
      url: a.url,
      level: a.level,
    };
  });

  const roadmap_items = includeRoadmap
    ? [`Explore today's ${featured_articles.length} articles — start with the one that catches your eye.`]
    : [];

  return {
    subject: `Your Learning Brief, ${date}`,
    greeting: `Hi ${name} — here are today's picks to support your journey toward ${targetRole}.`,
    featured_articles,
    roadmap_items,
    closing: `Keep building, ${firstName}. Every article you read is a step forward.`,
  };
}
