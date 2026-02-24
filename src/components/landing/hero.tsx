import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { RotatingText } from "./rotating-text";
import { DistillationVisual } from "./distillation-visual";
import { NewsletterMarquee } from "./newsletter-marquee";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center pt-14 overflow-hidden">
      {/* Ambient gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-500/[0.06] blur-[140px] animate-subtle-glow" />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center px-6 pt-20 md:pt-28 pb-10 md:pb-16">
        {/* Badge */}
        <div className="reveal mb-8">
          <span className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/[0.08] border border-violet-500/[0.12] font-mono text-[11px] text-violet-300 tracking-wide">
            <Zap className="w-3 h-3 text-violet-400 fill-violet-400 shrink-0" />
            500+ sources &middot; One daily brief
          </span>
        </div>

        {/* Headline — short & punchy */}
        <h1 className="reveal-delay-1 text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.12] tracking-[-0.03em] mb-6">
          We read every newsletter.
          <br />
          <span className="text-white/50">You get what matters for </span>
          <br className="sm:hidden" />
          <RotatingText />
        </h1>

        {/* One-line sub — no paragraph */}
        <p className="reveal-delay-2 text-sm md:text-[15px] text-white/45 max-w-md mx-auto leading-relaxed font-mono mb-10">
          Career goals in, daily must-reads out. Zero noise.
        </p>

        {/* CTA */}
        <div className="reveal-delay-3 flex flex-col items-center gap-4">
          <Link href="/login">
            <Button
              size="lg"
              className="rounded-lg bg-violet-500 text-white hover:bg-violet-400 px-8 h-12 text-sm font-semibold cursor-pointer transition-all duration-200 shadow-[0_0_32px_rgba(167,139,250,0.25)] hover:shadow-[0_0_40px_rgba(167,139,250,0.35)]"
            >
              Start for free
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <p className="font-mono text-[11px] text-white/30">
            Free forever &middot; 2-min setup &middot; No credit card
          </p>
        </div>

        {/* Newsletter marquee */}
        <div className="reveal-delay-4 mt-14">
          <NewsletterMarquee />
        </div>
      </div>

      {/* Distillation visual */}
      <div className="reveal-delay-4 relative z-10 w-full px-6 pb-10 md:pb-14">
        <DistillationVisual />
      </div>
    </section>
  );
}
