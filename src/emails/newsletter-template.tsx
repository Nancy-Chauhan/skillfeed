import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
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
              <span style={logoIcon}>&#9889;</span> SkillFeed
            </Text>
            <Text style={tagline}>Your personalized developer brief</Text>
          </Section>

          {/* Greeting */}
          <Section style={section}>
            <Text style={greeting}>{newsletter.greeting}</Text>
          </Section>

          {/* Featured Articles */}
          <Section style={section}>
            <Text style={sectionTitle}>
              <span style={sectionIcon}>&#9733;</span> Featured for You
            </Text>
            {newsletter.featured_articles.map((article, i) => (
              <Section key={i} style={articleCard}>
                <Text style={articleTitle}>
                  {article.url ? (
                    <Link href={article.url} style={articleLink}>
                      {article.title}
                    </Link>
                  ) : (
                    article.title
                  )}
                </Text>
                <Text style={articleLevel}>{article.level}</Text>
                <Text style={articleSummary}>{article.summary}</Text>
                <Text style={whyItMatters}>
                  <span style={whyLabel}>Why it matters: </span>
                  {article.why_it_matters}
                </Text>
                {feedbackUrls?.[article.title] && (
                  <Text style={feedbackRow}>
                    Was this helpful?{" "}
                    <Link
                      href={feedbackUrls[article.title].helpful}
                      style={feedbackLinkHelpful}
                    >
                      Yes
                    </Link>
                    {" / "}
                    <Link
                      href={feedbackUrls[article.title].notHelpful}
                      style={feedbackLinkNot}
                    >
                      No
                    </Link>
                  </Text>
                )}
              </Section>
            ))}
          </Section>

          {/* Roadmap */}
          <Section style={section}>
            <Text style={sectionTitle}>
              <span style={sectionIcon}>&#10148;</span> Your Next Steps
            </Text>
            {newsletter.roadmap_items.map((item, i) => (
              <Text key={i} style={roadmapItem}>
                <span style={roadmapNumber}>{i + 1}</span> {item}
              </Text>
            ))}
          </Section>

          {/* Quick Reads */}
          <Section style={section}>
            <Text style={sectionTitle}>
              <span style={sectionIcon}>&#9889;</span> Quick Reads
            </Text>
            {newsletter.quick_reads.map((read, i) => (
              <Section key={i} style={quickReadCard}>
                <Text style={quickRead}>
                  {read.url ? (
                    <Link href={read.url} style={quickReadLink}>
                      {read.title}
                    </Link>
                  ) : (
                    <span style={quickReadTitle}>{read.title}</span>
                  )}
                  <span style={quickReadOneliner}> {read.one_liner}</span>
                </Text>
              </Section>
            ))}
          </Section>

          {/* Closing */}
          <Section style={section}>
            <Text style={closing}>{newsletter.closing}</Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Sent by SkillFeed. Personalized learning for developers.
            </Text>
            <Link href={unsubscribeUrl} style={unsubscribeLinkStyle}>
              Unsubscribe
            </Link>
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

// Styles - Clean white with green accents
const body = {
  backgroundColor: "#F4F4F5",
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  margin: "0",
  padding: "0",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#FFFFFF",
};

const header = {
  backgroundColor: "#FFFFFF",
  borderBottom: "1px solid #E4E4E7",
  padding: "32px 24px 24px",
  textAlign: "center" as const,
};

const logo = {
  fontSize: "22px",
  fontWeight: "700" as const,
  color: "#18181B",
  margin: "0 0 4px 0",
  letterSpacing: "-0.02em",
};

const logoIcon = {
  color: "#00CC6A",
};

const tagline = {
  fontSize: "12px",
  color: "#A1A1AA",
  margin: "0",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
};

const section = {
  padding: "24px",
};

const greeting = {
  fontSize: "15px",
  lineHeight: "1.7",
  color: "#3F3F46",
};

const sectionTitle = {
  fontSize: "16px",
  fontWeight: "600" as const,
  color: "#18181B",
  marginBottom: "16px",
  letterSpacing: "-0.01em",
};

const sectionIcon = {
  color: "#00CC6A",
  marginRight: "6px",
};

const articleCard = {
  borderLeft: "2px solid #00CC6A",
  marginBottom: "20px",
  backgroundColor: "#FAFAFA",
  padding: "16px",
  borderRadius: "8px",
};

const articleTitle = {
  fontSize: "15px",
  fontWeight: "600" as const,
  color: "#18181B",
  margin: "0 0 4px 0",
};

const articleLink = {
  color: "#059669",
  textDecoration: "none",
};

const articleLevel = {
  fontSize: "11px",
  color: "#A1A1AA",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  margin: "0 0 10px 0",
};

const articleSummary = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#52525B",
  margin: "0 0 10px 0",
};

const whyItMatters = {
  fontSize: "13px",
  lineHeight: "1.5",
  color: "#71717A",
  margin: "0 0 10px 0",
};

const whyLabel = {
  color: "#059669",
  fontWeight: "500" as const,
};

const feedbackRow = {
  fontSize: "12px",
  color: "#A1A1AA",
  margin: "0",
};

const feedbackLinkHelpful = {
  color: "#059669",
  textDecoration: "underline",
};

const feedbackLinkNot = {
  color: "#A1A1AA",
  textDecoration: "underline",
};

const roadmapItem = {
  fontSize: "14px",
  lineHeight: "1.7",
  color: "#52525B",
  marginBottom: "8px",
};

const roadmapNumber = {
  display: "inline-block" as const,
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  backgroundColor: "#ECFDF5",
  color: "#059669",
  fontSize: "11px",
  fontWeight: "600" as const,
  textAlign: "center" as const,
  lineHeight: "20px",
  marginRight: "8px",
};

const quickReadCard = {
  borderBottom: "1px solid #F4F4F5",
  paddingBottom: "10px",
  marginBottom: "10px",
};

const quickRead = {
  fontSize: "14px",
  lineHeight: "1.5",
  color: "#52525B",
  margin: "0",
};

const quickReadTitle = {
  fontWeight: "600" as const,
  color: "#3F3F46",
};

const quickReadLink = {
  color: "#7C3AED",
  textDecoration: "underline",
  fontWeight: "500" as const,
};

const quickReadOneliner = {
  color: "#71717A",
};

const closing = {
  fontSize: "14px",
  lineHeight: "1.7",
  color: "#71717A",
  fontStyle: "italic",
};

const divider = {
  borderColor: "#E4E4E7",
  margin: "0",
};

const footer = {
  padding: "24px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#A1A1AA",
  margin: "0 0 8px 0",
};

const unsubscribeLinkStyle = {
  fontSize: "12px",
  color: "#A1A1AA",
  textDecoration: "underline",
};

export default NewsletterEmail;
