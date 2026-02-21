import type { Level, Role, ProcessingStatus, DeliveryStatus } from "./constants";

export interface Article {
  id: string;
  source_email: string;
  source_name: string | null;
  original_subject: string | null;
  message_id: string;
  title: string;
  summary: string | null;
  content: string | null;
  url: string;
  level: Level;
  roles: Role[];
  keywords: string[];
  processing_status: ProcessingStatus;
  received_at: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  resume_text: string | null;
  prompt_text: string | null;
  current_roles: Role[];
  target_roles: Role[];
  current_level: Level;
  target_level: Level;
  extracted_keywords: string[];
  extracted_skills: string[];
  learning_goals: string[];
  timezone: string;
  is_active: boolean;
  unsubscribed_at: string | null;
  last_newsletter_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSent {
  id: string;
  user_id: string;
  subject: string;
  html_content: string;
  summary_text: string | null;
  roadmap_items: RoadmapItem[] | null;
  article_ids: string[];
  match_scores: number[];
  resend_email_id: string | null;
  delivery_status: DeliveryStatus;
  attempt_count: number;
  error_message: string | null;
  created_at: string;
}

export interface RoadmapItem {
  text: string;
}

export interface IngestionJob {
  id: string;
  message_id: string;
  payload: Record<string, unknown>;
  status: ProcessingStatus;
  attempts: number;
  next_retry_at: string;
  last_error: string | null;
  created_at: string;
  processed_at: string | null;
}

export interface MatchedArticle {
  id: string;
  title: string;
  summary: string | null;
  url: string;
  level: Level;
  roles: Role[];
  keywords: string[];
  source_name: string | null;
  received_at: string;
  relevance_score: number;
}

export interface CategorizedArticle {
  title: string;
  summary: string;
  level: Level;
  roles: Role[];
  keywords: string[];
  url: string;
}

export interface ParsedProfile {
  current_roles: Role[];
  target_roles: Role[];
  current_level: Level;
  target_level: Level;
  keywords: string[];
  skills: string[];
  learning_goals: string[];
}

export interface ComposedNewsletter {
  subject: string;
  greeting: string;
  featured_articles: {
    title: string;
    summary: string;
    why_it_matters: string;
    url: string;
    level: Level;
  }[];
  roadmap_items: string[];
  closing: string;
}
