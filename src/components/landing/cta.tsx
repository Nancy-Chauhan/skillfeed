import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden p-10 md:p-14 text-center space-y-5 border border-white/[0.06] bg-white/[0.02]">
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#00FF88]/[0.06] blur-[60px] pointer-events-none" />

          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <h2 className="relative text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
            Ditch the duplicates.
            <br />
            <span className="text-[#00FF88]">Read what matters.</span>
          </h2>
          <p className="relative text-sm text-white/40 leading-relaxed max-w-sm mx-auto">
            Set up your profile and get your first personalized
            newsletter tomorrow morning.
          </p>
          <div className="relative">
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
          <p className="relative text-[11px] text-white/20">
            Free forever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
