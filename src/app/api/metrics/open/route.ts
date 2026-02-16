import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyMetricsSignature, TRACKING_PIXEL } from "@/lib/metrics/events";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nid = searchParams.get("nid");
  const uid = searchParams.get("uid");
  const sig = searchParams.get("sig");

  // Always return the pixel, even if validation fails (don't break email rendering)
  const pixelResponse = new NextResponse(TRACKING_PIXEL, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });

  if (!nid || !uid || !sig) {
    return pixelResponse;
  }

  if (!verifyMetricsSignature({ nid, uid }, sig)) {
    return pixelResponse;
  }

  // Record open event
  try {
    const supabase = createAdminClient();
    await supabase.from("newsletter_events").insert({
      newsletter_id: nid,
      user_id: uid,
      event_type: "open",
    });
  } catch {
    // Silently fail — don't break the pixel
  }

  return pixelResponse;
}
