"use client";

import { GitCompareArrows, Lightbulb, Route, Layers } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const features = [
  {
    key: "gap",
    icon: GitCompareArrows,
    title: "Skill gap analysis",
    description: "We map your current → target role and surface content that closes the gap.",
    accent: "text-violet-400",
    accentBg: "bg-violet-400/10",
    accentBorder: "group-hover:border-violet-400/[0.15]",
  },
  {
    key: "context",
    icon: Lightbulb,
    title: "Why this matters to you",
    description: "Every article has a personalized explanation — not generic fluff.",
    accent: "text-emerald-400",
    accentBg: "bg-emerald-400/10",
    accentBorder: "group-hover:border-emerald-400/[0.15]",
  },
  {
    key: "roadmap",
    icon: Route,
    title: "Actionable next steps",
    description: "Concrete things to learn, build, or explore — tied to your goals.",
    accent: "text-sky-400",
    accentBg: "bg-sky-400/10",
    accentBorder: "group-hover:border-sky-400/[0.15]",
  },
  {
    key: "sources",
    icon: Layers,
    title: "Zero noise",
    description: "500+ newsletters in, 3-5 articles out. Zero duplicates, pure signal.",
    accent: "text-amber-400",
    accentBg: "bg-amber-400/10",
    accentBorder: "group-hover:border-amber-400/[0.15]",
  },
];

export function Features() {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="features" className="py-20 md:py-32 px-6 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div ref={headerRef} className="scroll-reveal text-center max-w-xl mx-auto mb-14 md:mb-16 space-y-4">
          <p className="font-mono text-[11px] text-emerald-400/60 uppercase tracking-[0.15em]">// features</p>
          <h2 className="text-3xl md:text-[2.75rem] font-bold text-white tracking-[-0.02em] leading-tight">
            Built for your career,
            <br />
            <span className="text-white/50">not the algorithm.</span>
          </h2>
        </div>

        {/* 2x2 grid */}
        <div ref={gridRef} className="scroll-reveal-child grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div
              key={feature.key}
              className={`group relative rounded-xl border border-white/[0.06] bg-[#111113] hover:bg-[#141417] ${feature.accentBorder} transition-all duration-300 p-6`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg ${feature.accentBg} flex items-center justify-center shrink-0`}>
                  <feature.icon className={`w-[18px] h-[18px] ${feature.accent}`} strokeWidth={1.5} />
                </div>
                <div className="space-y-1.5 pt-0.5">
                  <h3 className="text-[15px] font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
