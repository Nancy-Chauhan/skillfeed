import type { ComposedNewsletter, MatchedArticle, User } from "@/lib/utils/types";
import { composeNewsletter } from "./newsletter-composer";
import { composeNewsletterTemplate } from "./newsletter-composer-template";

export function composeNewsletterAuto(
  user: User,
  articles: MatchedArticle[]
): Promise<ComposedNewsletter> {
  if (process.env.NEWSLETTER_COMPOSER_MODE === "template") {
    return composeNewsletterTemplate(user, articles);
  }
  return composeNewsletter(user, articles);
}
