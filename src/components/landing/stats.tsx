"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const stats = [
  { value: "500+", label: "Newsletters scanned daily" },
  { value: "3-5", label: "Articles in your brief" },
  { value: "2 min", label: "Setup time" },
  { value: "8 AM", label: "Delivered to your inbox" },
];

export function Stats() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-12 md:py-16 px-6 border-t border-white/[0.04]">
      <div
        ref={ref}
        className="scroll-reveal max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="text-center space-y-1.5">
            <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {stat.value}
            </p>
            <p className="font-mono text-[11px] text-white/45 leading-relaxed">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
