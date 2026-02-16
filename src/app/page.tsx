import { Header } from "@/components/shared/header";
import { Hero } from "@/components/landing/hero";
import { NewsletterMarquee } from "@/components/landing/newsletter-marquee";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/shared/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0C0C0C]">
      <Header />
      <main className="flex-1">
        <Hero />
        <NewsletterMarquee />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
