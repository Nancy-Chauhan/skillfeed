import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 md:py-32 px-6 border-t border-white/[0.04]">
      <div className="max-w-2xl mx-auto">
        <div className="relative rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="w-2 h-2 rounded-full bg-white/[0.08]" />
            <div className="w-2 h-2 rounded-full bg-white/[0.08]" />
            <div className="w-2 h-2 rounded-full bg-white/[0.08]" />
            <span className="ml-2 font-mono text-[11px] text-white/15">get-started</span>
          </div>

          <div className="p-10 md:p-16 text-center space-y-5">
            <h2 className="text-2xl md:text-[2.25rem] font-bold text-white tracking-[-0.02em] leading-tight">
              Where do you want to be
              <br />
              <span className="text-white/30">in 6 months?</span>
            </h2>
            <p className="text-sm text-white/25 leading-relaxed max-w-md mx-auto font-mono">
              Define your career goal. We&apos;ll start curating the
              exact content to get you there — first brief arrives
              tomorrow morning.
            </p>
            <div className="flex items-center justify-center pt-3">
              <Link href="/login">
                <Button
                  size="lg"
                  className="rounded-md bg-violet-500 text-white hover:bg-violet-400 px-7 h-11 text-sm font-medium cursor-pointer transition-all duration-200"
                >
                  Set my career goal
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <p className="font-mono text-[11px] text-white/10 pt-1">
              free forever &middot; takes 3 minutes &middot; unsubscribe anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
