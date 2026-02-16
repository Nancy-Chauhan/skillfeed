import { UserPlus, Sparkles, Mail } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Tell us about yourself",
    description:
      "Your role, target role, and learning goals. Takes under 3 minutes.",
    iconColor: "text-[#00FF88]",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "AI curates your brief",
    description:
      "We read hundreds of newsletters, deduplicate, and match what's relevant to you.",
    iconColor: "text-[#A78BFA]",
  },
  {
    number: "03",
    icon: Mail,
    title: "Wake up to signal",
    description:
      "One email every morning. Curated articles, insights, and next steps.",
    iconColor: "text-[#22D3EE]",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 md:py-32 px-6 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-medium">How it works</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Three minutes to
            <span className="text-[#A78BFA]"> inbox clarity</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
              )}
              <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-7 text-center space-y-4 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/[0.04] border border-white/[0.06] mx-auto">
                  <step.icon className={`w-7 h-7 ${step.iconColor}`} strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-[#00FF88] uppercase tracking-[0.2em]">
                    Step {step.number}
                  </p>
                  <h3 className="text-[15px] font-semibold text-white/90">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/35 leading-relaxed max-w-[240px] mx-auto">
                    {step.description}
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
