import { GitCompareArrows, Lightbulb, Route, Layers } from "lucide-react";

const features = [
  {
    key: "gap",
    icon: GitCompareArrows,
    title: "career.diff()",
    description:
      "You tell us your current role and your dream role. We identify the skill gaps and match content that closes them.",
    accent: "text-violet-400",
    accentBg: "bg-violet-400/10",
    tag: "current → target",
  },
  {
    key: "context",
    icon: Lightbulb,
    title: "brief.whyThisMatters()",
    description:
      "Every article comes with a personalized explanation: why it matters for YOUR specific career trajectory, not generic fluff.",
    accent: "text-emerald-400",
    accentBg: "bg-emerald-400/10",
    tag: "personalized",
  },
  {
    key: "roadmap",
    icon: Route,
    title: "career.nextSteps()",
    description:
      "Each brief includes actionable roadmap items. Concrete things to learn, build, or explore, tied to your goals.",
    accent: "text-sky-400",
    accentBg: "bg-sky-400/10",
    tag: "actionable",
  },
  {
    key: "sources",
    icon: Layers,
    title: "feeds.distill(50)",
    description:
      "We scan 50+ AI, dev, and engineering newsletters daily. You get 3-5 articles. Zero duplicates, pure signal.",
    accent: "text-amber-400",
    accentBg: "bg-amber-400/10",
    tag: "50+ sources",
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center max-w-xl mx-auto mb-14 md:mb-16 space-y-4">
          <p className="font-mono text-[11px] text-emerald-400/60 uppercase tracking-[0.15em]">// features</p>
          <h2 className="text-3xl md:text-[2.75rem] font-bold text-white tracking-[-0.02em] leading-tight">
            Your career path
            <br />
            <span className="text-white/70">drives every recommendation.</span>
          </h2>
          <p className="text-sm text-white/70 leading-relaxed max-w-md mx-auto font-mono">
            Not just what&apos;s trending. What&apos;s relevant to where you&apos;re headed.
          </p>
        </div>

        {/* Bento grid — alternating wide/narrow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <div
              key={feature.key}
              className={`group rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 overflow-hidden ${
                i === 0 || i === 3 ? "md:col-span-2 p-5 md:p-7" : "md:col-span-1 p-5 md:p-6"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg ${feature.accentBg} flex items-center justify-center shrink-0`}>
                  <feature.icon className={`w-[18px] h-[18px] ${feature.accent}`} strokeWidth={1.5} />
                </div>
                <div className="space-y-2 pt-0.5 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-[15px] font-semibold text-white font-mono">
                      {feature.title}
                    </h3>
                    <span className={`text-[10px] font-mono ${feature.accent} opacity-50 px-1.5 py-0.5 rounded border border-current/20`}>
                      {feature.tag}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">
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
