import mjml2html from "mjml";

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

export function renderWaitlistApprovalEmail(name: string | null): string {
  const greeting = name ? `${escapeHtml(name)}, you're in!` : "You're in!";
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://skillfeed.vercel.app"}/dashboard`;

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
      <mj-section background-color="#FFFFFF" padding="32px 24px">
        <mj-column>
          <mj-text font-size="22px" font-weight="600" color="#18181B" padding="0 0 16px 0">
            ${greeting}
          </mj-text>
          <mj-text font-size="14px" line-height="1.7" color="#52525B" padding="0 0 14px 0">
            Your spot on skillfeed_ is ready. You'll start receiving a daily brief curated from 50+ newsletters, matched to your exact career path.
          </mj-text>
          <mj-text font-size="14px" line-height="1.7" color="#52525B" padding="0 0 24px 0">
            Head to your dashboard to see your first brief.
          </mj-text>
          <mj-button background-color="#7C3AED" color="#FFFFFF" font-size="14px" font-weight="600" border-radius="8px" inner-padding="12px 24px" href="${dashboardUrl}">
            Go to Dashboard
          </mj-button>
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
