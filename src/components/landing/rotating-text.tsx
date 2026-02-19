"use client";

import { useState, useEffect, useCallback } from "react";

const phrases = [
  "dev → AI engineer.",
  "backend → MLOps.",
  "frontend → AI PM.",
  "junior → ML eng.",
  "dev → LLM engineer.",
  "IC → eng manager.",
  "SWE → ML platform.",
  "data eng → ML infra.",
];

export function RotatingText() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationState, setAnimationState] = useState<"visible" | "exiting" | "entering">("visible");

  const cycle = useCallback(() => {
    setAnimationState("exiting");

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % phrases.length);
      setAnimationState("entering");
    }, 300);

    setTimeout(() => {
      setAnimationState("visible");
    }, 600);
  }, []);

  useEffect(() => {
    const interval = setInterval(cycle, 3000);
    return () => clearInterval(interval);
  }, [cycle]);

  return (
    <span className="inline-grid overflow-hidden leading-[1.3] whitespace-nowrap max-w-full">
      <span
        className={`col-start-1 row-start-1 bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent pb-[0.05em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          animationState === "exiting"
            ? "translate-y-[-100%] opacity-0"
            : animationState === "entering"
              ? "translate-y-0 opacity-100 animate-slide-up-in"
              : "translate-y-0 opacity-100"
        }`}
      >
        {phrases[currentIndex]}
      </span>
    </span>
  );
}
