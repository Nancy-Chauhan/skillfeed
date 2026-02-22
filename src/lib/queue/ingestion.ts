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
  console.log("[cron:ingest] Queue: fetching pending jobs...");
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
    console.error("[cron:ingest] Queue: failed to fetch jobs:", fetchError);
    return { processed: 0, failed: 0, skipped: 0 };
  }

  if (!jobs || jobs.length === 0) {
    console.log("[cron:ingest] Queue: no pending jobs found");
    return { processed: 0, failed: 0, skipped: 0 };
  }

  console.log(`[cron:ingest] Queue: ${jobs.length} jobs fetched, processing...`);

  for (const job of jobs as IngestionJob[]) {
    const payload = job.payload as Record<string, unknown>;
    const subject = (payload.subject as string) ?? "";
    const sourceEmail = (payload.from as string) ?? (payload.sender as string) ?? "unknown";
    console.log(`[cron:ingest] Queue: job ${job.id} — status: ${job.status}, attempt: ${job.attempts + 1}, subject: "${subject}", source: ${sourceEmail}`);

    try {
      // Mark as processing
      await supabase
        .from("ingestion_jobs")
        .update({ status: "processing" })
        .eq("id", job.id)
        .eq("status", job.status); // Optimistic lock

      // Extract email content from payload
      const body =
        (payload.text as string) ??
        (payload.body as string) ??
        (payload.html as string) ??
        "";
      const sourceName = (payload.from_name as string) ?? null;

      if (!body.trim()) {
        console.log(`[cron:ingest] Queue: job ${job.id} — skipped (empty body)`);
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
      console.log(`[cron:ingest] Queue: job ${job.id} — categorized ${articles.length} articles`);

      if (articles.length === 0) {
        console.log(`[cron:ingest] Queue: job ${job.id} — skipped (no articles extracted)`);
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

      // Insert articles into database (skip any without a URL)
      const articleRows = articles.filter((a) => a.url).map((article) => ({
        source_email: sourceEmail,
        source_name: sourceName,
        original_subject: subject,
        message_id: `${job.message_id}:${article.title.slice(0, 50)}`,
        title: article.title,
        summary: article.summary,
        takeaway: article.takeaway,
        url: article.url,
        level: article.level,
        roles: article.roles,
        keywords: article.keywords,
        processing_status: "completed" as const,
        received_at: job.created_at,
      }));

      if (articleRows.length === 0) {
        console.log(`[cron:ingest] Queue: job ${job.id} — skipped (all articles lacked URLs)`);
        skipped++;
        await supabase
          .from("ingestion_jobs")
          .update({
            status: "completed",
            processed_at: new Date().toISOString(),
            last_error: "All extracted articles lacked URLs — skipped",
          })
          .eq("id", job.id);
        continue;
      }

      const { error: insertError } = await supabase
        .from("articles")
        .upsert(articleRows, { onConflict: "message_id", ignoreDuplicates: true });

      if (insertError) {
        throw new Error(`Article insert failed: ${insertError.message}`);
      }

      console.log(`[cron:ingest] Queue: job ${job.id} — inserted ${articleRows.length} articles from "${subject}"`);

      // Mark job as completed
      await supabase
        .from("ingestion_jobs")
        .update({
          status: "completed",
          processed_at: new Date().toISOString(),
          attempts: job.attempts + 1,
        })
        .eq("id", job.id);

      console.log(`[cron:ingest] Queue: job ${job.id} — completed`);
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
        `[cron:ingest] Queue: job ${job.id} failed (attempt ${nextAttempt}): ${errorMessage}`
      );
    }
  }

  console.log(`[cron:ingest] Queue: complete — ${processed} processed, ${skipped} skipped, ${failed} failed`);
  return { processed, failed, skipped };
}
