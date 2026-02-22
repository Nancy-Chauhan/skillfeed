const steps = [
  {
    number: "01",
    command: "step 1 / set your goals",
    title: "Tell us where you're headed",
    description:
      "Set your current role, target role, and skill level. Paste your resume or just describe your goals in plain English. Takes about two minutes.",
    accent: "text-violet-400",
    output: "→ backend dev → ML engineer",
  },
  {
    number: "02",
    command: "step 2 / we distill",
    title: "500+ newsletters, distilled",
    description:
      "Every morning we scan 500+ newsletters, remove duplicates, and score each article by how relevant it is to your specific skill gaps and career goals.",
    accent: "text-emerald-400",
    output: "→ 53 filtered, 3 matched to your path",
  },
  {
    number: "03",
    command: "step 3 / you level up",
    title: "Wake up to your brief",
    description:
      "One email every morning with curated articles, personalized context on why each one matters to you, and concrete next steps for your journey.",
    accent: "text-sky-400",
    output: "→ brief sent ✓ + roadmap included",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 px-6 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12 md:mb-20 space-y-5">
          <p className="font-mono text-[11px] text-emerald-400/60 uppercase tracking-[0.15em]">// how-it-works</p>
          <h2 className="text-3xl md:text-[2.75rem] font-bold text-white tracking-[-0.02em]">
            From inbox overload
            <br />
            <span className="text-white/50">to career clarity.</span>
          </h2>
          <p className="text-sm text-white/45 leading-relaxed max-w-md mx-auto font-mono">
            Three steps. Three minutes. One daily brief built around your goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 relative">
          {/* Connecting line between steps */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px border-t border-dashed border-white/[0.06]" />

          {steps.map((step) => (
            <div key={step.number} className="relative rounded-lg border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              {/* Step header — terminal style */}
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02] overflow-hidden">
                <span className={`font-mono text-[11px] font-bold ${step.accent} opacity-60 shrink-0`}>
                  {step.number}
                </span>
                <span className="font-mono text-[11px] text-white/40 truncate">
                  {step.command}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-[15px] font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-white/55 leading-relaxed">
                  {step.description}
                </p>
                <p className={`font-mono text-[12px] ${step.accent} opacity-50`}>
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
