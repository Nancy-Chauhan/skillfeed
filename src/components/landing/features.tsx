import { Target, Lightbulb, Route, Layers } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Matched to Your Goals",
    description:
      "Filtered by your role, skill level, and career trajectory. Zero noise.",
    iconColor: "text-[#00FF88]",
    glowColor: "rgba(0, 255, 136, 0.06)",
  },
  {
    icon: Lightbulb,
    title: "\"Why This Matters\"",
    description:
      "Every article includes a personalized explanation tied to your career journey.",
    iconColor: "text-[#A78BFA]",
    glowColor: "rgba(167, 139, 250, 0.06)",
  },
  {
    icon: Route,
    title: "Actionable Roadmap",
    description:
      "Concrete next steps for your learning path. No fluff, just direction.",
    iconColor: "text-[#22D3EE]",
    glowColor: "rgba(34, 211, 238, 0.06)",
  },
  {
    icon: Layers,
    title: "500+ Sources, One Brief",
    description:
      "We read every newsletter so you don't have to. One email, zero duplicates.",
    iconColor: "text-[#F59E0B]",
    glowColor: "rgba(245, 158, 11, 0.06)",
  },
];

export function Features() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-medium">Why SkillFeed</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
            Why read 500 newsletters
            <br />
            <span className="text-[#00FF88]">when one is enough?</span>
          </h2>
          <p className="text-sm text-white/35 leading-relaxed">
            Most newsletters repeat the same stories. We deduplicate, personalize, and deliver only what matters.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-7 space-y-4 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
            >
              <div
                className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: feature.glowColor }}
              />
              <div className="relative w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <feature.icon className={`w-5 h-5 ${feature.iconColor}`} strokeWidth={1.5} />
              </div>
              <h3 className="relative text-[15px] font-semibold text-white/90">
                {feature.title}
              </h3>
              <p className="relative text-sm text-white/35 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
