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
  title: "SkillFeed | We Read Every Newsletter So You Don't Have To",
  description:
    "We read 500+ newsletters so you don't have to. Get a daily brief matched to your career goals — the right articles, zero noise.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    title: "SkillFeed | We Read Every Newsletter So You Don't Have To",
    description:
      "We read 500+ newsletters so you don't have to. Get a daily brief matched to your career goals.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "SkillFeed — AI Career Briefs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillFeed | We Read Every Newsletter So You Don't Have To",
    description:
      "We read 500+ newsletters so you don't have to. Get a daily brief matched to your career goals.",
    images: ["/og-image.png"],
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
