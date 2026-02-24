"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function CTA() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="pt-16 pb-10 md:pt-24 md:pb-14 px-6 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto flex justify-center">
        <div ref={ref} className="scroll-reveal w-full max-w-2xl">
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
            <div className="space-y-2">
              <p className="text-[13px] text-white/50">
                <span className="text-emerald-400/70">$</span> skillfeed --start
              </p>
              <p className="text-[13px] text-white/40">
                <span className="text-white/30">→</span> scanning 500+ newsletters...
                <span className="text-emerald-400/60 ml-1.5">done</span>
              </p>
              <p className="text-[13px] text-white/40">
                <span className="text-white/30">→</span> matching to your goals...
                <span className="text-emerald-400/60 ml-1.5">done</span>
              </p>
              <p className="text-[13px] text-white/40">
                <span className="text-white/30">→</span> composing brief...
                <span className="text-emerald-400/60 ml-1.5">done</span>
              </p>
            </div>

            <div className="border-t border-white/[0.06] pt-6">
              <p className="text-[14px] text-violet-400/80 font-sans font-medium mb-6">
                Your next career move starts tomorrow morning.
              </p>

              <Link href="/login">
                <Button
                  size="lg"
                  className="rounded-md bg-violet-500 text-white hover:bg-violet-400 px-7 h-11 text-sm font-medium cursor-pointer transition-all duration-200 font-sans shadow-[0_0_24px_rgba(167,139,250,0.2)]"
                >
                  Get your first brief
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>

              <p className="text-[11px] text-white/30 mt-4">
                takes 2 minutes &middot; free forever
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
