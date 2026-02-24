import { Header } from "@/components/shared/header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/shared/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] relative overflow-x-hidden">
      {/* Dot grid overlay */}
      <div className="fixed inset-0 dot-grid pointer-events-none z-0" />
      <Header />
      <main className="flex-1 relative z-10">
        <Hero />
        <Features />
        <CTA />
      </main>
      {/* Aurora glow band above footer */}
      <div className="relative z-10">
        <div className="aurora-glow h-px w-full" />
        <div className="aurora-glow h-24 w-full opacity-40 blur-2xl -mt-12 pointer-events-none" />
      </div>
      <Footer />
    </div>
  );
}
