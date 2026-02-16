import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden pt-14">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[30%] w-[500px] h-[500px] rounded-full bg-[#00FF88]/[0.04] blur-[150px]" />
        <div className="absolute bottom-[20%] right-[25%] w-[400px] h-[400px] rounded-full bg-[#A78BFA]/[0.03] blur-[120px]" />
      </div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center px-6 pt-20 pb-12 space-y-7">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-[#00FF88]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
            AI-powered, curated for developers
          </span>
        </div>

        <h1 className="animate-fade-in-up-delay-1 text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.08] tracking-tight">
          Stop reading 500
          <br />
          duplicate articles.
          <br />
          <span className="text-[#00FF88]">Read the one that matters.</span>
        </h1>

        <p className="animate-fade-in-up-delay-2 text-base md:text-lg text-white/40 max-w-lg mx-auto leading-relaxed">
          One personalized daily brief from 500+ newsletters,
          matched to your skills and career goals.
        </p>

        <div className="animate-fade-in-up-delay-3">
          <Link href="/login">
            <Button
              size="lg"
              className="rounded-full bg-[#00FF88] text-[#0C0C0C] hover:bg-[#00FF88]/90 px-7 py-5 text-sm font-semibold cursor-pointer shadow-[0_0_30px_rgba(0,255,136,0.15)] hover:shadow-[0_0_50px_rgba(0,255,136,0.25)] transition-all duration-300 hover:scale-[1.02]"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
