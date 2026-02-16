export const ROLES = [
  "backend",
  "devops",
  "security",
  "solutions_engineer",
  "ai_engineer",
  "general",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  backend: "Backend",
  devops: "DevOps",
  security: "Security",
  solutions_engineer: "Solutions Engineer",
  ai_engineer: "AI Engineer",
  general: "General",
};

export const LEVELS = ["beginner", "intermediate", "senior"] as const;

export type Level = (typeof LEVELS)[number];

export const LEVEL_LABELS: Record<Level, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  senior: "Senior",
};

export const PROCESSING_STATUSES = [
  "pending",
  "processing",
  "completed",
  "failed",
] as const;

export type ProcessingStatus = (typeof PROCESSING_STATUSES)[number];

export const DELIVERY_STATUSES = [
  "pending",
  "sent",
  "delivered",
  "failed",
] as const;

export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

export const MIN_ARTICLES_FOR_NEWSLETTER = 3;
export const MAX_MATCHED_ARTICLES = 15;
export const ARTICLE_WINDOW_DAYS = 7;
export const MAX_INGESTION_ATTEMPTS = 5;
export const INGESTION_BASE_BACKOFF_SECONDS = 30;
