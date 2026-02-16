import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return new NextResponse(renderPage("Missing unsubscribe token.", false), {
      headers: { "Content-Type": "text/html" },
      status: 400,
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const supabase = createAdminClient();
    await supabase
      .from("users")
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("id", payload.userId);

    return new NextResponse(
      renderPage("You've been unsubscribed. We hope the journey served you well.", true),
      { headers: { "Content-Type": "text/html" } }
    );
  } catch {
    return new NextResponse(
      renderPage("This unsubscribe link is invalid or has expired.", false),
      { headers: { "Content-Type": "text/html" }, status: 400 }
    );
  }
}

function renderPage(message: string, success: boolean): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SkillFeed — Unsubscribe</title>
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
