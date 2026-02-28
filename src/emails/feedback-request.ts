import mjml2html from "mjml";
import { signMetricsUrl } from "@/lib/metrics/events";

const mono = "'SF Mono', 'Fira Code', Menlo, monospace";
const sans =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmojiFeedbackUrl(
  appUrl: string,
  userId: string,
  rating: string
): string {
  const params = { uid: userId, rating };
  const sig = signMetricsUrl(params);
  return `${appUrl}/api/feedback/emoji?uid=${userId}&rating=${rating}&sig=${sig}`;
}

export function renderFeedbackRequestEmail(
  name: string | null,
  userId: string
): string {
  const greeting = name ? `Hey ${escapeHtml(name)},` : "Hey there,";
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://skillfeed.dev";

  const ratings = [
    { emoji: "&#x1F929;", label: "Love it", value: "love_it" },
    { emoji: "&#x1F44D;", label: "It's good", value: "good" },
    { emoji: "&#x1F610;", label: "Meh", value: "meh" },
    { emoji: "&#x1F44E;", label: "Needs work", value: "needs_work" },
  ];

  const emojiButtons = ratings
    .map(
      (r) =>
        `<a href="${escapeHtml(buildEmojiFeedbackUrl(appUrl, userId, r.value))}" style="text-decoration:none;display:inline-block;text-align:center;margin:0 6px;">
          <span style="font-size:32px;display:block;">${r.emoji}</span>
          <span style="font-size:11px;font-family:${mono};color:#A1A1AA;display:block;margin-top:4px;">${r.label}</span>
        </a>`
    )
    .join("\n");

  const mjmlTemplate = `
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="${sans}" />
      <mj-text padding="0" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#F4F4F5">
    <mj-wrapper padding="20px 0" background-color="#F4F4F5">

      <!-- Header -->
      <mj-section background-color="#FAFAFA" border-bottom="1px solid #E4E4E7" padding="28px 24px 20px" border-radius="12px 12px 0 0">
        <mj-column>
          <mj-text align="center" font-family="${mono}" font-size="18px" font-weight="600" color="#18181B" padding="0" letter-spacing="-0.02em">
            skillfeed<span style="color:#7C3AED;">_</span>
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Content -->
      <mj-section background-color="#FFFFFF" padding="32px 24px 20px">
        <mj-column>
          <mj-text font-size="22px" font-weight="600" color="#18181B" padding="0 0 16px 0">
            Quick feedback?
          </mj-text>
          <mj-text font-size="14px" line-height="1.7" color="#52525B" padding="0 0 20px 0">
            ${greeting} You've been getting your skillfeed_ daily briefs for a bit now. We'd love to know how it's going -- just tap one:
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Emoji Rating -->
      <mj-section background-color="#FFFFFF" padding="0 24px 28px">
        <mj-column>
          <mj-text align="center" padding="0">
            ${emojiButtons}
          </mj-text>
        </mj-column>
      </mj-section>

      <mj-section background-color="#FFFFFF" padding="0 24px 32px">
        <mj-column>
          <mj-text font-size="12px" line-height="1.6" color="#A1A1AA" padding="0 0 0 0" align="center">
            One tap. That's it.
          </mj-text>
          <mj-text font-size="14px" line-height="1.7" color="#52525B" padding="20px 0 0 0">
            Your feedback directly shapes what we build next.
          </mj-text>
          <mj-text font-size="14px" line-height="1.7" color="#52525B" padding="12px 0 0 0">
            Thanks,<br/>
            <span style="font-weight:600;">The skillfeed_ team</span>
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Footer -->
      <mj-section background-color="#FAFAFA" border-top="1px solid #E4E4E7" padding="20px 24px" border-radius="0 0 12px 12px">
        <mj-column>
          <mj-text align="center" font-family="${mono}" font-size="13px" font-weight="600" color="#D4D4D8" padding="0">
            skillfeed<span style="color:#7C3AED;">_</span>
          </mj-text>
        </mj-column>
      </mj-section>

    </mj-wrapper>
  </mj-body>
</mjml>`;

  const { html, errors } = mjml2html(mjmlTemplate);
  if (errors.length > 0) {
    console.warn("MJML rendering warnings:", errors);
  }
  return html;
}
