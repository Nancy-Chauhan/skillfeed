import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Preview,
} from "@react-email/components";

interface WaitlistConfirmationEmailProps {
  email: string;
}

export function WaitlistConfirmationEmail({
  email,
}: WaitlistConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You&apos;re on the skillfeed_ waitlist</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>
              skillfeed<span style={logoAccent}>_</span>
            </Text>
          </Section>

          {/* Content */}
          <Section style={contentSection}>
            <Text style={heading}>You&apos;re on the list.</Text>
            <Text style={paragraph}>
              We got your email ({email}). You&apos;ll be one of the first 50
              people to try skillfeed_ — a daily brief curated from 50+
              newsletters, matched to your exact career path.
            </Text>
            <Text style={paragraph}>
              We&apos;ll send you a link to get started as soon as your spot
              opens up.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerBrand}>
              skillfeed<span style={logoAccent}>_</span>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ── Styles matching the white skillfeed_ branding ──

const body = {
  backgroundColor: "#F4F4F5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  margin: "0",
  padding: "0",
};

const container = {
  maxWidth: "500px",
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
  margin: "0",
  letterSpacing: "-0.02em",
};

const logoAccent = {
  color: "#7C3AED",
};

const contentSection = {
  padding: "32px 24px",
};

const heading = {
  fontSize: "22px",
  fontWeight: "600" as const,
  color: "#18181B",
  margin: "0 0 16px 0",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "1.7",
  color: "#52525B",
  margin: "0 0 14px 0",
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
  margin: "0",
};

export default WaitlistConfirmationEmail;
