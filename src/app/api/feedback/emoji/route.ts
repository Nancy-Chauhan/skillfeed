import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyMetricsSignature } from "@/lib/metrics/events";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");
  const rating = searchParams.get("rating");
  const sig = searchParams.get("sig");

  if (!uid || !rating || !sig) {
    return new NextResponse(renderPage("Missing parameters.", false), {
      headers: { "Content-Type": "text/html" },
      status: 400,
    });
  }

  const validRatings = ["love_it", "good", "meh", "needs_work"];
  if (!validRatings.includes(rating)) {
    return new NextResponse(renderPage("Invalid rating.", false), {
      headers: { "Content-Type": "text/html" },
      status: 400,
    });
  }

  if (!verifyMetricsSignature({ uid, rating }, sig)) {
    return new NextResponse(renderPage("Invalid or expired link.", false), {
      headers: { "Content-Type": "text/html" },
      status: 403,
    });
  }

  try {
    const supabase = createAdminClient();
    await supabase.from("feedback").insert({
      message: `[emoji-rating] rating=${rating} user=${uid}`,
    });
  } catch {
    return new NextResponse(
      renderPage("Something went wrong. Please try again.", false),
      { headers: { "Content-Type": "text/html" }, status: 500 }
    );
  }

  const emojiMap: Record<string, string> = {
    love_it: "\u{1F929}",
    good: "\u{1F44D}",
    meh: "\u{1F610}",
    needs_work: "\u{1F44E}",
  };

  return new NextResponse(
    renderPage(
      `${emojiMap[rating] ?? ""} Thanks for your feedback! It helps us make skillfeed_ better for you.`,
      true
    ),
    { headers: { "Content-Type": "text/html" } }
  );
}

function renderPage(message: string, success: boolean): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>skillfeed_ | Feedback</title>
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
    p { color: ${success ? "#4A6B47" : "#8A8295"}; line-height: 1.6; font-size: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>skillfeed_</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;
}
