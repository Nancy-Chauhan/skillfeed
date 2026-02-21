"use client";

import { LEVEL_LABELS, type Level } from "@/lib/utils/constants";

interface LevelSelectorProps {
  levels: readonly Level[];
  selected: Level | null;
  onChange: (level: Level) => void;
  label: string;
}

export function LevelSelector({
  levels,
  selected,
  onChange,
  label,
}: LevelSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-[13px] text-white/60">
        {label} <span className="text-white/35">— pick one</span>
      </p>
      <div className="grid grid-cols-3 gap-2">
        {levels.map((level, i) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            aria-pressed={selected === level}
            style={{ animationDelay: `${i * 25}ms` }}
            className={`animate-pill-enter px-3 py-2.5 rounded-lg border text-sm font-medium cursor-pointer
              transition-all duration-200 active:scale-[0.97] ${
              selected === level
                ? "bg-violet-500 text-white border-violet-500 shadow-[0_0_12px_rgba(167,139,250,0.25)]"
                : "border-white/[0.08] text-white/55 hover:border-white/[0.15] hover:text-white/80"
            }`}
          >
            {LEVEL_LABELS[level]}
          </button>
        ))}
      </div>
    </div>
  );
}
