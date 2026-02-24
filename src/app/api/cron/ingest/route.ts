import { NextResponse } from "next/server";
import { ingestAllFeeds } from "@/lib/rss/ingest";
import { processIngestionQueue } from "@/lib/queue/ingestion";

export const maxDuration = 300; // 5 minutes

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Debug: return immediately to verify the endpoint is reachable
  const url = new URL(request.url);
  const debug = url.searchParams.get("debug");
  if (debug === "ping") {
    return NextResponse.json({
      status: "pong",
      provider: process.env.LLM_PROVIDER ?? "not set",
      geminiKeySet: !!process.env.GEMINI_API_KEY,
      anthropicKeySet: !!process.env.ANTHROPIC_API_KEY,
    });
  }

  const startTime = Date.now();
  console.log(`[cron:ingest] Starting ingestion at ${new Date().toISOString()}`);
  console.log(`[cron:ingest] LLM_PROVIDER=${process.env.LLM_PROVIDER}, GEMINI_API_KEY set=${!!process.env.GEMINI_API_KEY}, ANTHROPIC_API_KEY set=${!!process.env.ANTHROPIC_API_KEY}`);

  try {
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
  } catch (err) {
    const durationMs = Date.now() - startTime;
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error(`[cron:ingest] FATAL after ${durationMs}ms:`, message, stack);
    return NextResponse.json(
      { status: "error", error: message, durationMs },
      { status: 500 }
    );
  }
}
