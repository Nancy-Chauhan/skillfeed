"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const steps = [
  {
    number: "01",
    title: "Set your goals",
    description: "Current role → target role. Two minutes.",
    accent: "text-violet-400",
    output: "→ backend dev → ML engineer",
  },
  {
    number: "02",
    title: "We distill",
    description: "500+ newsletters scanned, ranked, deduplicated.",
    accent: "text-emerald-400",
    output: "→ 53 filtered, 3 matched",
  },
  {
    number: "03",
    title: "You level up",
    description: "One daily email. Curated articles + why they matter.",
    accent: "text-sky-400",
    output: "→ brief sent ✓",
  },
];

export function HowItWorks() {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const cardsRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="how-it-works" className="py-20 md:py-32 px-6 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        <div ref={headerRef} className="scroll-reveal text-center max-w-xl mx-auto mb-12 md:mb-20 space-y-4">
          <p className="font-mono text-[11px] text-emerald-400/60 uppercase tracking-[0.15em]">// how-it-works</p>
          <h2 className="text-3xl md:text-[2.75rem] font-bold text-white tracking-[-0.02em]">
            Inbox overload →
            <br />
            <span className="text-white/50">career clarity.</span>
          </h2>
        </div>

        <div ref={cardsRef} className="scroll-reveal-child grid md:grid-cols-3 gap-4 relative">
          {/* Connecting line between steps */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px border-t border-dashed border-white/[0.06]" />

          {steps.map((step) => (
            <div key={step.number} className="relative rounded-lg border border-white/[0.06] bg-[#111113] overflow-hidden">
              {/* Step header — terminal style */}
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-white/[0.06] bg-[#0d0d10]">
                <span className={`font-mono text-[11px] font-bold ${step.accent} opacity-60 shrink-0`}>
                  {step.number}
                </span>
                <span className="font-mono text-[11px] text-white/40 truncate">
                  {step.title.toLowerCase()}
                </span>
              </div>

              <div className="p-5 space-y-2.5">
                <h3 className="text-[15px] font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {step.description}
                </p>
                <p className={`font-mono text-[12px] ${step.accent} opacity-50 pt-0.5`}>
                  {step.output}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
