import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { RotatingText } from "./rotating-text";
import { DistillationVisual } from "./distillation-visual";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center pt-14 overflow-hidden">
      {/* Ambient gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full bg-violet-500/[0.05] blur-[120px] animate-subtle-glow" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center px-6 pt-16 md:pt-24 pb-10 md:pb-16">
        {/* Badge */}
        <div className="reveal mb-6">
          <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.06] font-mono text-[11px] text-violet-400 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            50+ newsletters → 1 daily brief
          </span>
        </div>

        {/* Headline */}
        <h1 className="reveal-delay-1 text-[2rem] xs:text-[2.75rem] sm:text-5xl md:text-6xl lg:text-[4rem] font-bold text-white leading-[1.15] tracking-[-0.03em] mb-4">
          We read every newsletter
          <br />
          <span className="text-white/50">so you just read </span>
          <br className="sm:hidden" />
          <RotatingText />
        </h1>

        {/* Value prop — newsletter-first messaging */}
        <p className="reveal-delay-2 text-base sm:text-lg text-white/70 max-w-xl mx-auto leading-relaxed mb-3">
          TLDR, The Batch, Pragmatic Engineer, and 50+ more,
          distilled into <span className="text-emerald-400/80">3&#8209;5&nbsp;articles</span> matched to your career path.
        </p>

        {/* How it works — one-liner */}
        <p className="reveal-delay-2 text-[13px] text-white/45 max-w-md mx-auto leading-relaxed font-mono mb-8">
          Tell us your current role → target role. Get a personalized brief every morning.
        </p>

        {/* CTA */}
        <div className="reveal-delay-3 flex items-center justify-center">
          <Link href="/login">
            <Button
              size="lg"
              className="rounded-md bg-violet-500 text-white hover:bg-violet-400 px-7 h-11 text-sm font-medium cursor-pointer transition-all duration-200"
            >
              Start for free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Distillation visual */}
      <div className="reveal-delay-4 relative z-10 w-full px-6 pb-20 md:pb-28">
        <DistillationVisual />
      </div>
    </section>
  );
}
