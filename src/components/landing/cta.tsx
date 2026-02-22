import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-16 md:py-32 px-6 border-t border-white/[0.04]">
      <div className="max-w-2xl mx-auto">
        <div className="relative rounded-xl border border-white/[0.06] bg-[#111113] overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06] bg-[#0d0d10]">
            <div className="w-2 h-2 rounded-full bg-[#ff5f57]/60" />
            <div className="w-2 h-2 rounded-full bg-[#febc2e]/60" />
            <div className="w-2 h-2 rounded-full bg-[#28c840]/60" />
            <span className="ml-2 font-mono text-[11px] text-white/40">~/skillfeed</span>
          </div>

          {/* Terminal body */}
          <div className="p-5 sm:p-8 md:p-12 font-mono space-y-5">
            <div className="space-y-3">
              <p className="text-[13px] text-white/50">
                <span className="text-emerald-400/70">$</span> skillfeed --start
              </p>
              <div className="pl-0 space-y-1.5">
                <p className="text-[13px] text-white/45">
                  <span className="text-white/30">→</span> scanning 500+ newsletters...
                  <span className="text-emerald-400/60 ml-1.5">done</span>
                </p>
                <p className="text-[13px] text-white/45">
                  <span className="text-white/30">→</span> matching to your career goals...
                  <span className="text-emerald-400/60 ml-1.5">done</span>
                </p>
                <p className="text-[13px] text-white/45">
                  <span className="text-white/30">→</span> composing your daily brief...
                  <span className="text-emerald-400/60 ml-1.5">done</span>
                </p>
              </div>
            </div>

            <div className="border-t border-white/[0.06] pt-5 space-y-4">
              <p className="text-[13px] text-violet-400/80">
                ✓ Your next career move starts tomorrow morning.
              </p>
              <p className="text-[12px] text-white/45 leading-relaxed max-w-md">
                Two inputs: where you are and where you want to be.
                We&apos;ll curate the reading that bridges the gap.
              </p>

              <div className="flex items-center gap-4 pt-1">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="rounded-md bg-violet-500 text-white hover:bg-violet-400 px-7 h-11 text-sm font-medium cursor-pointer transition-all duration-200 font-sans"
                  >
                    Start for free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <p className="text-[11px] text-white/35 pt-1">
                free forever · takes 2 minutes · unsubscribe anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
