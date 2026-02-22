import { NextResponse } from "next/server";
import { ingestAllFeeds } from "@/lib/rss/ingest";
import { processIngestionQueue } from "@/lib/queue/ingestion";

export const maxDuration = 300; // 5 minutes

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  console.log(`[cron:ingest] Starting ingestion at ${new Date().toISOString()}`);

  // Step 1: Ingest RSS feeds
  console.log("[cron:ingest] RSS: starting feed ingestion...");
  const rssResult = await ingestAllFeeds();
  console.log(`[cron:ingest] RSS: done — ${rssResult.feedsProcessed} feeds processed, ${rssResult.totalInserted} articles inserted, ${rssResult.feedsFailed} feeds failed`);

  // Step 2: Process email ingestion queue
  console.log("[cron:ingest] Queue: starting queue processing...");
  const queueResult = await processIngestionQueue();
  console.log(`[cron:ingest] Queue: done — ${queueResult.processed} processed, ${queueResult.skipped} skipped, ${queueResult.failed} failed`);

  const durationMs = Date.now() - startTime;
  console.log(`[cron:ingest] Complete in ${durationMs}ms`);

  return NextResponse.json({
    status: "complete",
    rss: rssResult,
    queue: queueResult,
  });
}
