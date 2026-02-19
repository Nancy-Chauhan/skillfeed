import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillFeed | Personalized Developer Learning",
  description:
    "AI-curated newsletters matched to your skills, your role, and where you want to go. Learn what matters, skip the noise.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    title: "SkillFeed | Personalized Developer Learning",
    description:
      "AI-curated newsletters matched to your skills, your role, and where you want to go.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillFeed | Personalized Developer Learning",
    description:
      "AI-curated newsletters matched to your skills, your role, and where you want to go.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
