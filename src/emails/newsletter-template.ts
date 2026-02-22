import mjml2html from "mjml";
import type { ComposedNewsletter } from "@/lib/utils/types";

interface FeedbackUrls {
  [articleTitle: string]: {
    helpful: string;
    notHelpful: string;
  };
}

interface NewsletterEmailProps {
  newsletter: ComposedNewsletter;
  unsubscribeUrl: string;
  trackingPixelUrl?: string;
  feedbackUrls?: FeedbackUrls;
}

// Shared font stacks
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

export function renderNewsletterEmail({
  newsletter,
  unsubscribeUrl,
  trackingPixelUrl,
  feedbackUrls,
}: NewsletterEmailProps): string {
  const articlesMarkup = newsletter.featured_articles
    .map((article, i) => {
      const titleContent = `<a href="${escapeHtml(article.url)}" style="color:#18181B;text-decoration:none;">${escapeHtml(article.title)}</a>`;

      const readMoreMarkup = `<p style="margin:0 0 8px 0;">
            <a href="${escapeHtml(article.url)}" style="font-family:${mono};font-size:12px;color:#7C3AED;text-decoration:none;">Read article →</a>
          </p>`;

      const feedbackMarkup =
        feedbackUrls?.[article.title]
          ? `<p style="font-family:${mono};font-size:11px;color:#D4D4D8;margin:0;">
              Was this helpful?
              <a href="${escapeHtml(feedbackUrls[article.title].helpful)}" style="color:#059669;text-decoration:none;">Yes</a>
              &nbsp;&middot;&nbsp;
              <a href="${escapeHtml(feedbackUrls[article.title].notHelpful)}" style="color:#A1A1AA;text-decoration:none;">No</a>
            </p>`
          : "";

      return `
        <mj-section padding="0 24px">
          <mj-column>
            <mj-table>
              <tr>
                <td style="font-family:${mono};font-size:14px;font-weight:600;color:#7C3AED;vertical-align:top;padding-right:12px;padding-top:2px;width:24px;opacity:0.6;">
                  ${i + 1}.
                </td>
                <td>
                  <p style="font-size:15px;font-weight:600;color:#18181B;margin:0 0 6px 0;line-height:1.4;">
                    ${titleContent}
                  </p>
                  <p style="margin:0 0 10px 0;">
                    <span style="font-family:${mono};font-size:10px;color:#059669;background-color:#ECFDF5;padding:2px 8px;border-radius:3px;text-transform:uppercase;letter-spacing:0.05em;">
                      ${escapeHtml(article.level)}
                    </span>
                  </p>
                  <p style="font-size:13px;line-height:1.6;color:#52525B;margin:0 0 10px 0;">
                    ${escapeHtml(article.summary)}
                  </p>
                  ${article.why_it_matters ? `<p style="font-size:12px;line-height:1.5;color:#71717A;margin:0 0 10px 0;font-style:italic;">
                    &ldquo;${escapeHtml(article.why_it_matters)}&rdquo;
                  </p>` : ""}
                  ${readMoreMarkup}
                  ${feedbackMarkup}
                </td>
              </tr>
            </mj-table>
          </mj-column>
        </mj-section>
        <mj-section padding="0 24px"><mj-column><mj-divider border-color="#F4F4F5" border-width="1px" padding="0" /></mj-column></mj-section>`;
    })
    .join("\n");

  const roadmapMarkup =
    newsletter.roadmap_items.length > 0
      ? `
        <mj-section padding="24px 24px 8px">
          <mj-column>
            <mj-text font-family="${mono}" font-size="10px" font-weight="600" color="#A1A1AA" letter-spacing="0.15em" padding="0 0 16px 0">
              YOUR NEXT STEPS
            </mj-text>
          </mj-column>
        </mj-section>
        ${newsletter.roadmap_items
          .map(
            (item) => `
        <mj-section padding="0 24px 8px">
          <mj-column>
            <mj-table>
              <tr>
                <td style="font-family:${mono};font-size:13px;color:#7C3AED;vertical-align:top;padding-right:10px;padding-top:2px;width:20px;opacity:0.5;">
                  →
                </td>
                <td>
                  <p style="font-size:13px;line-height:1.6;color:#52525B;margin:0;">${escapeHtml(item)}</p>
                </td>
              </tr>
            </mj-table>
          </mj-column>
        </mj-section>`
          )
          .join("\n")}`
      : "";

  const trackingPixelMarkup = trackingPixelUrl
    ? `<mj-section padding="0"><mj-column><mj-image src="${escapeHtml(trackingPixelUrl)}" width="1px" height="1px" padding="0" /></mj-column></mj-section>`
    : "";

  const mjmlTemplate = `
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="${sans}" />
      <mj-text padding="0" />
    </mj-attributes>
    <mj-style>
      a { color: inherit; }
    </mj-style>
  </mj-head>
  <mj-body background-color="#F4F4F5">
    <mj-wrapper padding="20px 0" background-color="#FFFFFF" border="1px solid #E4E4E7" border-radius="12px">

      <!-- Header -->
      <mj-section background-color="#FAFAFA" border-bottom="1px solid #E4E4E7" padding="28px 24px 20px">
        <mj-column>
          <mj-text align="center" font-family="${mono}" font-size="18px" font-weight="600" color="#18181B" padding="0 0 4px 0" letter-spacing="-0.02em">
            skillfeed<span style="color:#7C3AED;">_</span>
          </mj-text>
          <mj-text align="center" font-family="${mono}" font-size="11px" color="#A1A1AA" padding="0" letter-spacing="0.05em">
            Your personalized daily brief
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Greeting -->
      <mj-section padding="24px 24px 8px">
        <mj-column>
          <mj-text font-size="14px" line-height="1.7" color="#52525B" padding="0">
            ${escapeHtml(newsletter.greeting)}
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Featured Articles -->
      <mj-section padding="24px 24px 8px">
        <mj-column>
          <mj-text font-family="${mono}" font-size="10px" font-weight="600" color="#A1A1AA" letter-spacing="0.15em" padding="0 0 16px 0">
            FEATURED FOR YOU
          </mj-text>
        </mj-column>
      </mj-section>

      ${articlesMarkup}

      <!-- Roadmap -->
      ${roadmapMarkup}

      <!-- Closing -->
      <mj-section padding="16px 24px 24px" border-top="1px solid #F4F4F5">
        <mj-column>
          <mj-text font-size="13px" line-height="1.7" color="#71717A" font-style="italic" padding="0">
            ${escapeHtml(newsletter.closing)}
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Footer -->
      <mj-section background-color="#FAFAFA" border-top="1px solid #E4E4E7" padding="20px 24px">
        <mj-column>
          <mj-text align="center" font-family="${mono}" font-size="13px" font-weight="600" color="#D4D4D8" padding="0 0 8px 0">
            skillfeed<span style="color:#7C3AED;">_</span>
          </mj-text>
          <mj-text align="center" font-size="11px" color="#A1A1AA" padding="0">
            <a href="${escapeHtml(unsubscribeUrl)}" style="color:#A1A1AA;text-decoration:underline;">Unsubscribe</a>
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Tracking pixel -->
      ${trackingPixelMarkup}

    </mj-wrapper>
  </mj-body>
</mjml>`;

  const { html, errors } = mjml2html(mjmlTemplate);
  if (errors.length > 0) {
    console.warn("MJML rendering warnings:", errors);
  }
  return html;
}
