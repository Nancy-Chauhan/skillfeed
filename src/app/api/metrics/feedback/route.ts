import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyMetricsSignature } from "@/lib/metrics/events";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nid = searchParams.get("nid");
  const aid = searchParams.get("aid");
  const uid = searchParams.get("uid");
  const value = searchParams.get("value");
  const sig = searchParams.get("sig");

  if (!nid || !aid || !uid || !value || !sig) {
    return new NextResponse(renderPage("Missing parameters.", false), {
      headers: { "Content-Type": "text/html" },
      status: 400,
    });
  }

  const feedbackValue = parseInt(value, 10);
  if (feedbackValue !== 1 && feedbackValue !== -1) {
    return new NextResponse(renderPage("Invalid feedback value.", false), {
      headers: { "Content-Type": "text/html" },
      status: 400,
    });
  }

  if (!verifyMetricsSignature({ nid, aid, uid, value }, sig)) {
    return new NextResponse(renderPage("Invalid or expired link.", false), {
      headers: { "Content-Type": "text/html" },
      status: 403,
    });
  }

  try {
    const supabase = createAdminClient();
    await supabase.from("newsletter_events").insert({
      newsletter_id: nid,
      user_id: uid,
      article_id: aid,
      event_type: "feedback",
      feedback_value: feedbackValue,
    });
  } catch {
    return new NextResponse(renderPage("Something went wrong. Please try again.", false), {
      headers: { "Content-Type": "text/html" },
      status: 500,
    });
  }

  return new NextResponse(
    renderPage("Thanks for your feedback! It helps us curate better content for you.", true),
    { headers: { "Content-Type": "text/html" } }
  );
}

function renderPage(message: string, success: boolean): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SkillFeed | Feedback</title>
  <style>
    body {
      font-family: Inter, -apple-system, sans-serif;
      background: #FAF8FC;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
    }
    .card {
      background: white;
      border: 1px solid #D4D0DC;
      border-radius: 16px;
      padding: 48px;
      max-width: 420px;
      text-align: center;
    }
    h1 { color: #4A4453; font-size: 20px; }
    p { color: ${success ? "#4A6B47" : "#8A8295"}; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <h1>SkillFeed</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;
}
