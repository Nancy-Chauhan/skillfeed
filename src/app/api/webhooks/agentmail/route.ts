import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIp } from "@/lib/utils/rate-limiter";

export async function POST(request: Request) {
  // Rate limit: 60 requests per minute per IP
  const ip = getClientIp(request);
  const rl = checkRateLimit(`webhook:${ip}`, 60, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.text();
  const headers = Object.fromEntries(request.headers.entries());

  // Verify Svix webhook signature
  const webhookSecret = process.env.AGENTMAIL_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("AGENTMAIL_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  let payload: Record<string, unknown>;
  try {
    const wh = new Webhook(webhookSecret);
    payload = wh.verify(body, {
      "svix-id": headers["svix-id"] ?? "",
      "svix-timestamp": headers["svix-timestamp"] ?? "",
      "svix-signature": headers["svix-signature"] ?? "",
    }) as Record<string, unknown>;
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Extract message_id for idempotency
  const messageId =
    (payload.message_id as string) ??
    (payload.id as string) ??
    headers["svix-id"];

  if (!messageId) {
    return NextResponse.json({ error: "Missing message_id" }, { status: 400 });
  }

  // Insert into ingestion queue (idempotent via unique constraint)
  const supabase = createAdminClient();
  const { error } = await supabase.from("ingestion_jobs").insert({
    message_id: messageId,
    payload,
    status: "pending",
    attempts: 0,
    next_retry_at: new Date().toISOString(),
  });

  if (error) {
    // Duplicate message_id — already queued, return success (idempotent)
    if (error.code === "23505") {
      return NextResponse.json({ status: "already_queued" }, { status: 200 });
    }
    console.error("Failed to insert ingestion job:", error);
    return NextResponse.json({ error: "Queue insert failed" }, { status: 500 });
  }

  return NextResponse.json({ status: "queued" }, { status: 200 });
}
