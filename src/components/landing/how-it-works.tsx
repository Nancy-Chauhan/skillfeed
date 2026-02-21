const steps = [
  {
    number: "01",
    command: "$ skillfeed init --profile",
    title: "Define your career arc",
    description:
      "Tell us your current role, target role, skill level, and what you want to learn. Paste your resume or just describe your goals. AI handles the rest.",
    accent: "text-violet-400",
    output: "→ backend dev → ML engineer",
  },
  {
    number: "02",
    command: "$ skillfeed scan --match",
    title: "AI bridges the gap",
    description:
      "We scan 50+ newsletters, deduplicate, and match articles to your specific skill gaps. Each one is scored by how relevant it is to your career transition.",
    accent: "text-emerald-400",
    output: "→ 53 filtered, 3 matched to your path",
  },
  {
    number: "03",
    command: "$ skillfeed deliver --brief",
    title: "Wake up leveled up",
    description:
      "One email every morning with curated articles, personalized \"why this matters\" context, and a roadmap of concrete next steps for your journey.",
    accent: "text-sky-400",
    output: "→ brief sent ✓ + roadmap included",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-44 px-6 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-20 space-y-5">
          <p className="font-mono text-[11px] text-emerald-400/60 uppercase tracking-[0.15em]">// how-it-works</p>
          <h2 className="text-3xl md:text-[2.75rem] font-bold text-white tracking-[-0.02em]">
            From where you are
            <br />
            <span className="text-white/70">to where you want to be.</span>
          </h2>
          <p className="text-sm text-white/70 leading-relaxed max-w-md mx-auto font-mono">
            Tell us the destination. We&apos;ll build the reading list.
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
                <span className="font-mono text-[11px] text-white/60 truncate">
                  {step.command}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-[15px] font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
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
