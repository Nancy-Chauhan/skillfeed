import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Img,
  Preview,
} from "@react-email/components";
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

export function NewsletterEmail({
  newsletter,
  unsubscribeUrl,
  trackingPixelUrl,
  feedbackUrls,
}: NewsletterEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{newsletter.subject}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>
              skillfeed<span style={logoAccent}>_</span>
            </Text>
            <Text style={tagline}>Your personalized daily brief</Text>
          </Section>

          {/* Greeting */}
          <Section style={contentSection}>
            <Text style={greeting}>{newsletter.greeting}</Text>
          </Section>

          {/* Featured Articles */}
          <Section style={contentSection}>
            <Text style={sectionLabel}>FEATURED FOR YOU</Text>
            {newsletter.featured_articles.map((article, i) => (
              <Section key={i} style={articleCard}>
                <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
                  <tr>
                    <td style={articleNumber}>{i + 1}.</td>
                    <td style={{ width: "100%" }}>
                      <Text style={articleTitle}>
                        {article.url ? (
                          <Link href={article.url} style={articleLink}>
                            {article.title}
                          </Link>
                        ) : (
                          article.title
                        )}
                      </Text>
                      <Text style={articleMeta}>
                        <span style={levelBadge}>{article.level}</span>
                      </Text>
                      <Text style={articleSummary}>{article.summary}</Text>
                      <Text style={whyItMatters}>
                        &quot;{article.why_it_matters}&quot;
                      </Text>
                      {article.url && (
                        <Text style={readMore}>
                          <Link href={article.url} style={readMoreLink}>
                            Read article →
                          </Link>
                        </Text>
                      )}
                      {feedbackUrls?.[article.title] && (
                        <Text style={feedbackRow}>
                          Was this helpful?{" "}
                          <Link
                            href={feedbackUrls[article.title].helpful}
                            style={feedbackYes}
                          >
                            Yes
                          </Link>
                          {"  ·  "}
                          <Link
                            href={feedbackUrls[article.title].notHelpful}
                            style={feedbackNo}
                          >
                            No
                          </Link>
                        </Text>
                      )}
                    </td>
                  </tr>
                </table>
              </Section>
            ))}
          </Section>

          {/* Roadmap */}
          {newsletter.roadmap_items.length > 0 && (
            <Section style={contentSection}>
              <Text style={sectionLabel}>YOUR NEXT STEPS</Text>
              {newsletter.roadmap_items.map((item, i) => (
                <table key={i} cellPadding="0" cellSpacing="0" style={roadmapRow}>
                  <tr>
                    <td style={roadmapBullet}>→</td>
                    <td>
                      <Text style={roadmapText}>{item}</Text>
                    </td>
                  </tr>
                </table>
              ))}
            </Section>
          )}



          {/* Closing */}
          <Section style={closingSection}>
            <Text style={closingText}>{newsletter.closing}</Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerBrand}>
              skillfeed<span style={logoAccent}>_</span>
            </Text>
            <Text style={footerLinks}>
              <Link href={unsubscribeUrl} style={footerLink}>
                Unsubscribe
              </Link>
              {"  ·  "}
              <span style={footerLink}>Preferences</span>
            </Text>
          </Section>

          {/* Tracking pixel */}
          {trackingPixelUrl && (
            <Img
              src={trackingPixelUrl}
              width="1"
              height="1"
              alt=""
              style={{ display: "block", width: "1px", height: "1px" }}
            />
          )}
        </Container>
      </Body>
    </Html>
  );
}

// ── White template with landing page design language ──

const body = {
  backgroundColor: "#F4F4F5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  margin: "0",
  padding: "0",
};

const container = {
  maxWidth: "600px",
  margin: "20px auto",
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  overflow: "hidden" as const,
  border: "1px solid #E4E4E7",
};

const header = {
  backgroundColor: "#FAFAFA",
  borderBottom: "1px solid #E4E4E7",
  padding: "28px 24px 20px",
  textAlign: "center" as const,
};

const logo = {
  fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace",
  fontSize: "18px",
  fontWeight: "600" as const,
  color: "#18181B",
  margin: "0 0 4px 0",
  letterSpacing: "-0.02em",
};

const logoAccent = {
  color: "#7C3AED",
};

const tagline = {
  fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace",
  fontSize: "11px",
  color: "#A1A1AA",
  margin: "0",
  letterSpacing: "0.05em",
};

const contentSection = {
  padding: "24px 24px 8px",
};

const greeting = {
  fontSize: "14px",
  lineHeight: "1.7",
  color: "#52525B",
  margin: "0",
};

const sectionLabel = {
  fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace",
  fontSize: "10px",
  fontWeight: "600" as const,
  color: "#A1A1AA",
  letterSpacing: "0.15em",
  margin: "0 0 16px 0",
  textTransform: "uppercase" as const,
};

const articleCard = {
  marginBottom: "4px",
  paddingBottom: "16px",
  paddingTop: "16px",
  borderBottom: "1px solid #F4F4F5",
};

const articleNumber = {
  fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace",
  fontSize: "14px",
  fontWeight: "600" as const,
  color: "#7C3AED",
  verticalAlign: "top" as const,
  paddingRight: "12px",
  paddingTop: "2px",
  width: "24px",
  opacity: "0.6",
};

const articleTitle = {
  fontSize: "15px",
  fontWeight: "600" as const,
  color: "#18181B",
  margin: "0 0 6px 0",
  lineHeight: "1.4",
};

const articleLink = {
  color: "#18181B",
  textDecoration: "none",
};

const articleMeta = {
  margin: "0 0 10px 0",
};

const levelBadge = {
  fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace",
  fontSize: "10px",
  color: "#059669",
  backgroundColor: "#ECFDF5",
  padding: "2px 8px",
  borderRadius: "3px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

const articleSummary = {
  fontSize: "13px",
  lineHeight: "1.6",
  color: "#52525B",
  margin: "0 0 10px 0",
};

const whyItMatters = {
  fontSize: "12px",
  lineHeight: "1.5",
  color: "#71717A",
  margin: "0 0 10px 0",
  fontStyle: "italic" as const,
};

const readMore = {
  margin: "0 0 8px 0",
};

const readMoreLink = {
  fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace",
  fontSize: "12px",
  color: "#7C3AED",
  textDecoration: "none",
};

const feedbackRow = {
  fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace",
  fontSize: "11px",
  color: "#D4D4D8",
  margin: "0",
};

const feedbackYes = {
  color: "#059669",
  textDecoration: "none",
};

const feedbackNo = {
  color: "#A1A1AA",
  textDecoration: "none",
};

const roadmapRow = {
  width: "100%" as const,
  marginBottom: "8px",
};

const roadmapBullet = {
  fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace",
  fontSize: "13px",
  color: "#7C3AED",
  verticalAlign: "top" as const,
  paddingRight: "10px",
  paddingTop: "2px",
  width: "20px",
  opacity: "0.5",
};

const roadmapText = {
  fontSize: "13px",
  lineHeight: "1.6",
  color: "#52525B",
  margin: "0",
};


const closingSection = {
  padding: "16px 24px 24px",
  borderTop: "1px solid #F4F4F5",
};

const closingText = {
  fontSize: "13px",
  lineHeight: "1.7",
  color: "#71717A",
  fontStyle: "italic" as const,
  margin: "0",
};

const footer = {
  padding: "20px 24px",
  borderTop: "1px solid #E4E4E7",
  textAlign: "center" as const,
  backgroundColor: "#FAFAFA",
};

const footerBrand = {
  fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace",
  fontSize: "13px",
  fontWeight: "600" as const,
  color: "#D4D4D8",
  margin: "0 0 8px 0",
};

const footerLinks = {
  fontSize: "11px",
  color: "#A1A1AA",
  margin: "0",
};

const footerLink = {
  color: "#A1A1AA",
  textDecoration: "underline",
};

export default NewsletterEmail;
