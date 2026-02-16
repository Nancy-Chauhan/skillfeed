import { createAdminClient } from "@/lib/supabase/admin";
import { categorizeArticles } from "@/lib/agents/article-categorizer";
import {
  MAX_INGESTION_ATTEMPTS,
  INGESTION_BASE_BACKOFF_SECONDS,
} from "@/lib/utils/constants";
import type { IngestionJob } from "@/lib/utils/types";

export async function processIngestionQueue(): Promise<{
  processed: number;
  failed: number;
  skipped: number;
}> {
  const supabase = createAdminClient();
  let processed = 0;
  let failed = 0;
  let skipped = 0;

  // Fetch pending or retryable jobs
  const { data: jobs, error: fetchError } = await supabase
    .from("ingestion_jobs")
    .select("*")
    .in("status", ["pending", "failed"])
    .lt("next_retry_at", new Date().toISOString())
    .lt("attempts", MAX_INGESTION_ATTEMPTS)
    .order("created_at", { ascending: true })
    .limit(10);

  if (fetchError) {
    console.error("Failed to fetch ingestion jobs:", fetchError);
    return { processed: 0, failed: 0, skipped: 0 };
  }

  if (!jobs || jobs.length === 0) {
    return { processed: 0, failed: 0, skipped: 0 };
  }

  for (const job of jobs as IngestionJob[]) {
    try {
      // Mark as processing
      await supabase
        .from("ingestion_jobs")
        .update({ status: "processing" })
        .eq("id", job.id)
        .eq("status", job.status); // Optimistic lock

      // Extract email content from payload
      const payload = job.payload as Record<string, unknown>;
      const subject = (payload.subject as string) ?? "";
      const body =
        (payload.text as string) ??
        (payload.body as string) ??
        (payload.html as string) ??
        "";
      const sourceEmail = (payload.from as string) ?? (payload.sender as string) ?? "unknown";
      const sourceName = (payload.from_name as string) ?? null;

      if (!body.trim()) {
        skipped++;
        await supabase
          .from("ingestion_jobs")
          .update({
            status: "completed",
            processed_at: new Date().toISOString(),
            last_error: "Empty email body — skipped",
          })
          .eq("id", job.id);
        continue;
      }

      // Categorize articles using Claude
      const articles = await categorizeArticles(subject, body);

      if (articles.length === 0) {
        skipped++;
        await supabase
          .from("ingestion_jobs")
          .update({
            status: "completed",
            processed_at: new Date().toISOString(),
            last_error: "No articles extracted",
          })
          .eq("id", job.id);
        continue;
      }

      // Insert articles into database
      const articleRows = articles.map((article) => ({
        source_email: sourceEmail,
        source_name: sourceName,
        original_subject: subject,
        message_id: `${job.message_id}:${article.title.slice(0, 50)}`,
        title: article.title,
        summary: article.summary,
        url: article.url,
        level: article.level,
        roles: article.roles,
        keywords: article.keywords,
        processing_status: "completed" as const,
        received_at: job.created_at,
      }));

      const { error: insertError } = await supabase
        .from("articles")
        .upsert(articleRows, { onConflict: "message_id", ignoreDuplicates: true });

      if (insertError) {
        throw new Error(`Article insert failed: ${insertError.message}`);
      }

      // Mark job as completed
      await supabase
        .from("ingestion_jobs")
        .update({
          status: "completed",
          processed_at: new Date().toISOString(),
          attempts: job.attempts + 1,
        })
        .eq("id", job.id);

      processed++;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const nextAttempt = job.attempts + 1;
      const backoffSeconds =
        Math.pow(2, nextAttempt) * INGESTION_BASE_BACKOFF_SECONDS;
      const nextRetryAt = new Date(
        Date.now() + backoffSeconds * 1000
      ).toISOString();

      await supabase
        .from("ingestion_jobs")
        .update({
          status: "failed",
          attempts: nextAttempt,
          last_error: errorMessage,
          next_retry_at:
            nextAttempt >= MAX_INGESTION_ATTEMPTS
              ? new Date("2099-01-01").toISOString()
              : nextRetryAt,
        })
        .eq("id", job.id);

      failed++;
      console.error(
        `Ingestion job ${job.id} failed (attempt ${nextAttempt}):`,
        errorMessage
      );
    }
  }

  return { processed, failed, skipped };
}
