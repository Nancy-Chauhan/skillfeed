import { z } from "zod/v4";

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // LLM — at least one provider must be set
  ANTHROPIC_API_KEY: z.string().startsWith("sk-ant-").optional(),
  GEMINI_API_KEY: z.string().min(1).optional(),

  // Resend
  RESEND_API_KEY: z.string().startsWith("re_"),

  // AgentMail
  AGENTMAIL_API_KEY: z.string().min(1),
  AGENTMAIL_WEBHOOK_SECRET: z.string().min(1).optional(),

  // Cron / Auth
  CRON_SECRET: z.string().min(8),
  JWT_SECRET: z.string().min(16),

  // App
  NEXT_PUBLIC_APP_URL: z.url(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate all required environment variables.
 * Call once at startup (e.g. in instrumentation.ts) to fail fast.
 */
export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const formatted = z.prettifyError(result.error);
    console.error("Environment validation failed:\n", formatted);
    throw new Error("Missing or invalid environment variables. See logs above.");
  }
  return result.data;
}
