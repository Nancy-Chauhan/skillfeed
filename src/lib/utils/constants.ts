export const ROLES = [
  "frontend",
  "backend",
  "fullstack",
  "mobile",
  "data_engineer",
  "devops",
  "security",
  "product_manager",
  "engineering_manager",
  "solutions_engineer",
  "ai_engineer",
  "ml_engineer",
  "data_scientist",
  "mlops",
  "ai_product_manager",
  "general",
] as const;

export type Role = (typeof ROLES)[number];

/** Traditional roles for "What do you do?" (step 2). */
export const CURRENT_ROLES: Role[] = [
  "frontend",
  "backend",
  "fullstack",
  "mobile",
  "data_engineer",
  "devops",
  "security",
  "product_manager",
  "engineering_manager",
  "solutions_engineer",
];

/** AI-era roles for "Where do you want to be?" (step 3). */
export const TARGET_ROLES: Role[] = [
  "ai_engineer",
  "ml_engineer",
  "data_scientist",
  "mlops",
  "data_engineer",
  "ai_product_manager",
  "engineering_manager",
];

export const ROLE_LABELS: Record<Role, string> = {
  frontend: "Frontend",
  backend: "Backend",
  fullstack: "Full-Stack",
  mobile: "Mobile",
  data_engineer: "Data Engineer",
  devops: "DevOps",
  security: "Security",
  product_manager: "Product Manager",
  engineering_manager: "Eng Manager",
  solutions_engineer: "Solutions Eng",
  ai_engineer: "AI Engineer",
  ml_engineer: "ML Engineer",
  data_scientist: "Data Scientist",
  mlops: "MLOps",
  ai_product_manager: "AI Product Mgr",
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
