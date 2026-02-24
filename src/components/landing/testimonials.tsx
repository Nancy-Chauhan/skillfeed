"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Went from 20+ newsletters to one email that actually matches my career goals. Game changer.",
    name: "Priya S.",
    role: "Backend Dev → ML Engineer",
    avatar: "PS",
    accentFrom: "from-violet-500/30",
    accentTo: "to-emerald-500/30",
  },
  {
    quote: "The personalized 'why this matters' context is what sold me. Not just links — real insight.",
    name: "Marcus T.",
    role: "Senior SWE → AI Architect",
    avatar: "MT",
    accentFrom: "from-sky-500/30",
    accentTo: "to-violet-500/30",
  },
  {
    quote: "Two minutes to set up. Now every morning I wake up to a brief that feels handcrafted.",
    name: "Sarah K.",
    role: "PM → AI Product Manager",
    avatar: "SK",
    accentFrom: "from-emerald-500/30",
    accentTo: "to-sky-500/30",
  },
];

export function Testimonials() {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-20 md:py-32 px-6 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        <div ref={headerRef} className="scroll-reveal text-center max-w-xl mx-auto mb-14 md:mb-16 space-y-4">
          <p className="font-mono text-[11px] text-emerald-400/60 uppercase tracking-[0.15em]">
            // testimonials
          </p>
          <h2 className="text-3xl md:text-[2.75rem] font-bold text-white tracking-[-0.02em] leading-tight">
            People love it.
          </h2>
        </div>

        <div ref={gridRef} className="scroll-reveal-child grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-white/[0.06] bg-[#111113] p-6 space-y-4 hover:border-white/[0.1] transition-all duration-300"
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-[13px] text-white/60 leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.accentFrom} ${t.accentTo} flex items-center justify-center shrink-0`}>
                  <span className="text-[9px] font-bold text-white/70">{t.avatar}</span>
                </div>
                <div>
                  <p className="text-[12px] font-medium text-white/75">{t.name}</p>
                  <p className="font-mono text-[10px] text-violet-400/55">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
