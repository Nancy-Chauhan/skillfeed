import crypto from "crypto";

const HMAC_SECRET = process.env.JWT_SECRET ?? "skillfeed-metrics";

export function signMetricsUrl(params: Record<string, string>): string {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  const sig = crypto
    .createHmac("sha256", HMAC_SECRET)
    .update(sorted)
    .digest("hex")
    .slice(0, 16);
  return sig;
}

export function verifyMetricsSignature(
  params: Record<string, string>,
  signature: string
): boolean {
  const expected = signMetricsUrl(params);
  return expected === signature;
}

export function buildTrackingPixelUrl(
  appUrl: string,
  newsletterId: string,
  userId: string
): string {
  const params = { nid: newsletterId, uid: userId };
  const sig = signMetricsUrl(params);
  return `${appUrl}/api/metrics/open?nid=${newsletterId}&uid=${userId}&sig=${sig}`;
}

export function buildClickTrackingUrl(
  appUrl: string,
  newsletterId: string,
  articleId: string,
  userId: string,
  _originalUrl?: string
): string {
  const params = { nid: newsletterId, aid: articleId, uid: userId };
  const sig = signMetricsUrl(params);
  return `${appUrl}/api/metrics/click?nid=${newsletterId}&aid=${articleId}&uid=${userId}&sig=${sig}`;
}

export function buildFeedbackUrl(
  appUrl: string,
  newsletterId: string,
  articleId: string,
  userId: string,
  value: 1 | -1
): string {
  const params = {
    nid: newsletterId,
    aid: articleId,
    uid: userId,
    value: String(value),
  };
  const sig = signMetricsUrl(params);
  return `${appUrl}/api/metrics/feedback?nid=${newsletterId}&aid=${articleId}&uid=${userId}&value=${value}&sig=${sig}`;
}

// 1x1 transparent GIF as a Buffer
export const TRACKING_PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);
