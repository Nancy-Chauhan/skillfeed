import { NextResponse } from "next/server";
import { ingestAllFeeds } from "@/lib/rss/ingest";
import { processIngestionQueue } from "@/lib/queue/ingestion";

export const maxDuration = 300; // 5 minutes

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Step 1: Ingest RSS feeds
  const rssResult = await ingestAllFeeds();

  // Step 2: Process email ingestion queue
  const queueResult = await processIngestionQueue();

  return NextResponse.json({
    status: "complete",
    rss: rssResult,
    queue: queueResult,
  });
}
