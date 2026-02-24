"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, Mail, Zap } from "lucide-react";

/* ── Newsletter data ── */

const newsletters = [
  { name: "TLDR AI", subject: "GPT-5 is here, Llama 4 benchmarks...", color: "border-violet-400/20", domain: "tldr.tech" },
  { name: "The Batch", subject: "Andrew Ng: Why RAG will dominate 2026", color: "border-sky-400/20", domain: "deeplearning.ai" },
  { name: "Ben's Bites", subject: "OpenAI ships Codex, Google fights back...", color: "border-orange-400/20", domain: "bensbites.com" },
  { name: "ByteByteGo", subject: "System Design: How Netflix handles 250M...", color: "border-amber-400/20", domain: "bytebytego.com" },
  { name: "The Neuron", subject: "AI spending hits $200B, Apple's new...", color: "border-yellow-400/20", domain: "theneuron.ai" },
  { name: "Import AI", subject: "The skills gap is widening. Here's the...", color: "border-pink-400/20", domain: "importai.net" },
  { name: "Alpha Signal", subject: "Top papers this week: agents, reasoning...", color: "border-red-400/20", domain: "alphasignal.ai" },
  { name: "Pragmatic Eng.", subject: "How Stripe built their AI assistant", color: "border-emerald-400/20", domain: "pragmaticengineer.com" },
];

/* Compact pile — cards overlap in a tight messy cluster */
const cardPositions = [
  { top: "2%",  left: "8%",  rotate: "-5deg", z: 1 },
  { top: "0%",  left: "42%", rotate: "4deg",  z: 2 },
  { top: "16%", left: "25%", rotate: "7deg",  z: 5 },
  { top: "22%", left: "5%",  rotate: "-3deg", z: 3 },
  { top: "20%", left: "48%", rotate: "-6deg", z: 4 },
  { top: "38%", left: "15%", rotate: "5deg",  z: 6 },
  { top: "40%", left: "42%", rotate: "-4deg", z: 7 },
  { top: "56%", left: "28%", rotate: "6deg",  z: 8 },
];

const mobileCardPositions = [
  { top: "0%",  left: "2%",  rotate: "-5deg", z: 1 },
  { top: "2%",  left: "48%", rotate: "5deg",  z: 2 },
  { top: "18%", left: "20%", rotate: "7deg",  z: 4 },
  { top: "22%", left: "50%", rotate: "-4deg", z: 3 },
  { top: "40%", left: "8%",  rotate: "4deg",  z: 5 },
  { top: "42%", left: "44%", rotate: "-6deg", z: 6 },
];

/*
  Animation sequence (auto-play, loops):
  Phase 1 "cards"        — 0s   : cards fade in, sources visible
  Phase 2 "distilling"   — 2s   : cards dim, flow arrows animate, label changes
  Phase 3 "notification" — 3.5s : notification toast slides in
  Phase 4 "email"        — 5.5s : notification fades, full email expands
  Hold                   — 12s  : restart cycle
*/
type Phase = "cards" | "distilling" | "notification" | "email";

const phases: Phase[] = ["cards", "distilling", "notification", "email"];
const phaseLabels: Record<Phase, string> = {
  cards: "Sources",
  distilling: "Scanning",
  notification: "Brief ready",
  email: "Your email",
};

export function DistillationVisual() {
  const [phase, setPhase] = useState<Phase>("cards");
  const [paused, setPaused] = useState(false);

  const runCycle = useCallback(() => {
    setPhase("cards");
    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setPhase("distilling"), 2000));
    timers.push(setTimeout(() => setPhase("notification"), 3500));
    timers.push(setTimeout(() => setPhase("email"), 5500));
    return timers;
  }, []);

  useEffect(() => {
    if (paused) return;

    let timers = runCycle();
    const loop = setInterval(() => {
      timers.forEach(clearTimeout);
      timers = runCycle();
    }, 13000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(loop);
    };
  }, [runCycle, paused]);

  function pickPhase(p: Phase) {
    setPaused(true);
    setPhase(p);
  }

  const cardsDimmed = phase === "distilling" || phase === "notification" || phase === "email";
  const showFlow = phase === "distilling" || phase === "notification" || phase === "email";

  return (
    <div className="w-full max-w-5xl mx-auto relative">

      {/* ══════ Desktop ══════ */}
      <div className="hidden md:block relative">
        {/* Status label */}
        <div className="text-center mb-5">
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.12em] h-4 transition-all duration-500">
            {phase === "cards" && "500+ newsletters & feeds arrive daily"}
            {phase === "distilling" && <><span className="text-violet-400/60">Scanning & matching</span> to your goals...</>}
            {phase === "notification" && <><span className="text-emerald-400/60">Done.</span> Your brief is ready</>}
            {phase === "email" && <><span className="text-emerald-400/60">3 articles</span> picked from 500+ sources</>}
          </p>
        </div>

        {/* Main visual area */}
        <div className="relative min-h-[460px]">

          {/* Left: Scattered cards */}
          <div className="absolute top-0 left-0 w-[42%] h-[370px]">
            {newsletters.map((nl, i) => (
              <div
                key={nl.name}
                className={`absolute w-[54%] opacity-0 animate-fade-in transition-all duration-700 ${
                  cardsDimmed ? "!opacity-15 !blur-[2px] !scale-95" : ""
                }`}
                style={{
                  top: cardPositions[i].top,
                  left: cardPositions[i].left,
                  transform: `rotate(${cardPositions[i].rotate})`,
                  zIndex: cardPositions[i].z,
                  animationDelay: `${i * 0.07 + 0.1}s`,
                  animationFillMode: "forwards",
                }}
              >
                <div className={`rounded-md border ${nl.color} bg-[#0d0d10] p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.4)]`}>
                  <div className="flex items-start gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${nl.domain}&sz=64`}
                      alt={nl.name}
                      className="w-5 h-5 rounded shrink-0 mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-white/60 font-medium truncate">{nl.name}</p>
                      <p className="text-[9px] text-white/45 truncate leading-relaxed">{nl.subject}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in transition-opacity duration-500 ${
                cardsDimmed ? "!opacity-0" : ""
              }`}
              style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
            >
              <span className="font-mono text-[10px] text-white/50">+500 more sources...</span>
            </div>
          </div>

          {/* Center: Converging flow SVG */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
              showFlow ? "opacity-100" : "opacity-0"
            }`}
            style={{ zIndex: 20 }}
          >
            <svg className="w-full h-full" viewBox="0 0 1000 460" fill="none" preserveAspectRatio="none">
              <defs>
                <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgb(167,139,250)" stopOpacity="0.06" />
                  <stop offset="50%" stopColor="rgb(167,139,250)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="rgb(167,139,250)" stopOpacity="0.35" />
                </linearGradient>
              </defs>

              {/* Converging paths: from left card area → single point → right panel */}
              {[
                "M 380,50  C 430,50  460,170 500,190 S 540,200 560,200",
                "M 390,110 C 430,110 465,165 500,190 S 540,198 560,200",
                "M 400,180 C 440,180 470,188 500,190 S 540,196 560,200",
                "M 390,250 C 430,250 465,215 500,190 S 540,194 560,200",
                "M 380,320 C 430,320 460,220 500,190 S 540,192 560,200",
              ].map((d, i) => (
                <g key={i}>
                  <path d={d} stroke="url(#flowGrad)" strokeWidth="1.2" />
                  <circle r="2.5" fill="rgb(167,139,250)" opacity="0.8">
                    <animateMotion
                      dur={`${1.5 + i * 0.2}s`}
                      repeatCount="indefinite"
                      begin={`${i * 0.3}s`}
                    >
                      <mpath href={`#fp${i}`} />
                    </animateMotion>
                  </circle>
                  <path id={`fp${i}`} d={d} fill="none" />
                </g>
              ))}

              {/* Convergence point glow */}
              <circle cx="500" cy="190" r="20" fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.15)" strokeWidth="1" />

              {/* Output arrow from convergence → right */}
              <path d="M 520,190 L 560,190" stroke="rgb(167,139,250)" strokeWidth="1.5" strokeOpacity="0.3" />
              <path d="M 555,185 L 562,190 L 555,195" stroke="rgb(167,139,250)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" />
            </svg>

            {/* Zap icon at convergence */}
            <div
              className="absolute flex flex-col items-center"
              style={{
                left: "50%",
                top: "41%",
                transform: "translate(-50%, -50%)",
                zIndex: 21,
              }}
            >
              <div className="w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center animate-distill-pulse">
                <Zap className="w-3.5 h-3.5 text-violet-400/70" />
              </div>
            </div>
          </div>

          {/* Right: Sequential notification → email — uses ml-auto to stay right, relative so it pushes parent height */}
          <div className="relative ml-auto w-[44%]" style={{ zIndex: 10 }}>
            <div className="relative">

              {/* Notification toast — shows during "notification" phase */}
              <div
                className={`absolute top-16 inset-x-0 mx-auto max-w-sm z-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  phase === "notification"
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
                }`}
              >
                <div className="rounded-xl border border-white/[0.1] bg-[#161618] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-4 h-4 text-violet-400/70" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-[11px] text-white/70 font-semibold">SkillFeed</p>
                        <p className="text-[9px] text-white/30 shrink-0">just now</p>
                      </div>
                      <p className="text-[12px] text-white/60 font-medium leading-snug">Your Personalized AI Learning Brief, Maya</p>
                      <p className="text-[10px] text-white/35 mt-1 leading-relaxed truncate">3 articles matched to your Backend → AI Engineer transition</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full email — shows during "email" phase */}
              <div
                className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  phase === "email"
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-6 scale-[0.97] pointer-events-none"
                }`}
              >
                <div className="absolute -inset-3 bg-violet-500/[0.04] rounded-xl blur-xl pointer-events-none" />
                <div className="relative rounded-xl border border-white/[0.08] bg-[#111113] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
                  <div className="px-5 pt-5 pb-4 border-b border-white/[0.06]">
                    <p className="text-[10px] text-white/35 flex items-center gap-1.5 mb-2">
                      <ArrowLeft className="w-3 h-3" /> Back
                    </p>
                    <h3 className="text-[15px] text-white/85 font-semibold leading-snug">
                      Your Personalized AI Learning Brief, Maya
                    </h3>
                    <p className="font-mono text-[10px] text-white/35 mt-1.5">
                      Tuesday, February 24, 2026 &middot; 3 articles
                    </p>
                  </div>
                  <div className="px-5 pt-4 pb-3">
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      Hello Maya, we&apos;ve hand-picked these articles for your Backend → AI Engineer transition.
                    </p>
                  </div>
                  <div className="px-5 pb-2">
                    <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.15em]">Featured for you</p>
                  </div>
                  <div className="px-5 pb-1">
                    <RealArticle
                      number={1}
                      title="Fine-Tuning LLMs on Custom Datasets: A Practical Guide"
                      level="Intermediate"
                      sources="The Batch · deeplearning.ai"
                      summary="A step-by-step walkthrough of fine-tuning open-source models on domain-specific data."
                      delay={0.3}
                      revealed={phase === "email"}
                    />
                    <RealArticle
                      number={2}
                      title="RAG vs Fine-Tuning: When to Use What in Production"
                      level="Intermediate"
                      sources="TLDR AI · tldr.tech"
                      summary="The decision framework senior ML engineers use daily. Covers latency trade-offs and cost analysis."
                      delay={0.7}
                      revealed={phase === "email"}
                    />
                    <RealArticle
                      number={3}
                      title="From REST APIs to ML Pipelines: A Backend Engineer's Guide"
                      level="Intermediate"
                      sources="ByteByteGo · bytebytego.com"
                      summary="Leverage your existing API design skills to build robust ML inference pipelines."
                      delay={1.1}
                      revealed={phase === "email"}
                      isLast
                    />
                  </div>
                  <div className="px-5 pt-2 pb-4">
                    <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.15em] mb-2">Your next steps</p>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400/50 text-[10px] mt-px shrink-0">→</span>
                      <p className="text-[10px] text-white/40 leading-relaxed">
                        Start with the fine-tuning guide. Your backend data pipeline experience maps directly to ML training workflows.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ Mobile ══════ */}
      <div className="md:hidden space-y-0">
        {/* Status label */}
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.12em] mb-3 text-center h-4 transition-all duration-500">
          {phase === "cards" && "500+ newsletters & feeds arrive daily"}
          {phase === "distilling" && <><span className="text-violet-400/60">Scanning & matching</span> to your goals...</>}
          {phase === "notification" && <><span className="text-emerald-400/60">Done.</span> Your brief is ready</>}
          {phase === "email" && <><span className="text-emerald-400/60">3 articles</span> picked from 500+ sources</>}
        </p>

        {/* Scattered cards */}
        <div className="relative h-[240px]">
          {newsletters.slice(0, 6).map((nl, i) => (
            <div
              key={nl.name}
              className={`absolute w-[48%] opacity-0 animate-fade-in transition-all duration-700 ${
                cardsDimmed ? "!opacity-15 !blur-[2px] !scale-95" : ""
              }`}
              style={{
                top: mobileCardPositions[i].top,
                left: mobileCardPositions[i].left,
                transform: `rotate(${mobileCardPositions[i].rotate})`,
                zIndex: mobileCardPositions[i].z,
                animationDelay: `${i * 0.07 + 0.1}s`,
                animationFillMode: "forwards",
              }}
            >
              <div className={`rounded-md border ${nl.color} bg-[#0d0d10] p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.3)]`}>
                <div className="flex items-start gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${nl.domain}&sz=64`}
                    alt={nl.name}
                    className="w-5 h-5 rounded shrink-0 mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-white/60 font-medium truncate">{nl.name}</p>
                    <p className="text-[9px] text-white/45 truncate leading-relaxed">{nl.subject}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in transition-opacity duration-500 ${
              cardsDimmed ? "!opacity-0" : ""
            }`}
            style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
          >
            <span className="font-mono text-[10px] text-white/50">+500 more...</span>
          </div>
        </div>

        {/* Funnel indicator */}
        <div className={`flex flex-col items-center py-4 gap-1.5 transition-opacity duration-500 ${showFlow ? "opacity-100" : "opacity-0"}`}>
          <svg width="120" height="32" viewBox="0 0 120 32" fill="none">
            <path d="M 10,2  C 30,2  50,14 60,16" stroke="rgb(167,139,250)" strokeOpacity="0.2" strokeWidth="1" />
            <path d="M 40,2  C 48,5  55,12 60,16" stroke="rgb(167,139,250)" strokeOpacity="0.2" strokeWidth="1" />
            <path d="M 80,2  C 72,5  65,12 60,16" stroke="rgb(167,139,250)" strokeOpacity="0.2" strokeWidth="1" />
            <path d="M 110,2 C 90,2  70,14 60,16" stroke="rgb(167,139,250)" strokeOpacity="0.2" strokeWidth="1" />
            <path d="M 60,16 L 60,28" stroke="rgb(167,139,250)" strokeWidth="1" strokeOpacity="0.3" />
            <path d="M 56,24 L 60,29 L 64,24" stroke="rgb(167,139,250)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" />
          </svg>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-violet-400/60" />
            </div>
            <span className="font-mono text-[8px] text-white/30">distilled for you</span>
          </div>
        </div>

        {/* Mobile: notification → email (sequential, collapses when hidden) */}
        <div className="relative">
          {/* Notification */}
          <div
            className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              phase === "notification"
                ? "opacity-100 translate-y-0 scale-100 max-h-[200px]"
                : "opacity-0 -translate-y-4 scale-95 pointer-events-none max-h-0 overflow-hidden"
            }`}
          >
            <div className="mx-auto max-w-sm py-4">
              <div className="rounded-xl border border-white/[0.1] bg-[#161618] p-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-violet-400/70" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-[11px] text-white/70 font-semibold">SkillFeed</p>
                      <p className="text-[9px] text-white/30 shrink-0">just now</p>
                    </div>
                    <p className="text-[11px] text-white/60 font-medium leading-snug">Your AI Learning Brief, Maya</p>
                    <p className="text-[9px] text-white/35 mt-1 leading-relaxed truncate">3 articles for your Backend → AI Engineer transition</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full email */}
          <div
            className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              phase === "email"
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-6 scale-[0.97] pointer-events-none max-h-0 overflow-hidden"
            }`}
          >
            <div className="relative rounded-xl border border-white/[0.08] bg-[#111113] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
              <div className="px-3.5 pt-4 pb-3 border-b border-white/[0.06]">
                <p className="text-[10px] text-white/35 flex items-center gap-1.5 mb-2">
                  <ArrowLeft className="w-3 h-3" /> Back
                </p>
                <h3 className="text-[13px] text-white/85 font-semibold leading-snug">
                  Your AI Learning Brief, Maya
                </h3>
                <p className="font-mono text-[9px] text-white/35 mt-1.5">
                  Feb 24, 2026 &middot; 3 articles
                </p>
              </div>
              <div className="px-3.5 pt-3 pb-2">
                <p className="text-[10px] text-white/50 leading-relaxed">
                  We&apos;ve hand-picked these for your Backend → AI Engineer transition.
                </p>
              </div>
              <div className="px-3.5 pb-1.5">
                <p className="font-mono text-[8px] text-white/30 uppercase tracking-[0.15em]">Featured for you</p>
              </div>
              <div className="px-3.5 pb-1">
                <RealArticle number={1} title="Fine-Tuning LLMs on Custom Datasets" level="Intermediate" sources="The Batch" summary="Fine-tuning open-source models on domain-specific data." delay={0.3} revealed={phase === "email"} />
                <RealArticle number={2} title="RAG vs Fine-Tuning in Production" level="Intermediate" sources="TLDR AI" summary="The decision framework senior ML engineers use daily." delay={0.7} revealed={phase === "email"} />
                <RealArticle number={3} title="From REST APIs to ML Pipelines" level="Intermediate" sources="ByteByteGo" summary="Leverage API design skills to build ML inference pipelines." delay={1.1} revealed={phase === "email"} isLast />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ Phase stepper (both desktop & mobile) ══════ */}
      <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-8 flex-wrap">
        {phases.map((p, i) => {
          const isActive = phase === p;
          const isPast = phases.indexOf(phase) > i;
          return (
            <button
              key={p}
              onClick={() => pickPhase(p)}
              className={`group flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-violet-500/15 border border-violet-500/25"
                  : "bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]"
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                isActive ? "bg-violet-400" : isPast ? "bg-violet-400/40" : "bg-white/20"
              }`} />
              <span className={`font-mono text-[8px] sm:text-[9px] transition-all duration-300 ${
                isActive ? "text-violet-300/80" : "text-white/30 group-hover:text-white/45"
              }`}>
                {phaseLabels[p]}
              </span>
            </button>
          );
        })}
        {paused && (
          <button
            onClick={() => setPaused(false)}
            className="ml-1 sm:ml-2 font-mono text-[8px] sm:text-[9px] text-white/25 hover:text-white/45 transition-colors cursor-pointer flex items-center gap-1"
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><path d="M1 0.5v7l6-3.5z" /></svg>
            Auto
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function RealArticle({
  number,
  title,
  level,
  sources,
  summary,
  delay,
  revealed,
  isLast = false,
}: {
  number: number;
  title: string;
  level: string;
  sources: string;
  summary: string;
  delay: number;
  revealed: boolean;
  isLast?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!revealed) { setVisible(false); return; }
    const timer = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [revealed, delay]);

  return (
    <div
      className={`py-3 transition-all duration-500 ease-out ${!isLast ? "border-b border-white/[0.04]" : ""} ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-[11px] font-semibold text-violet-400/50 mt-0.5 shrink-0">{number}.</span>
        <div className="min-w-0 space-y-1">
          <p className="text-[12px] text-white/75 font-medium leading-snug">{title}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded font-medium">{level}</span>
            <span className="text-[9px] text-white/35">{sources}</span>
          </div>
          <p className="text-[10px] text-white/40 leading-relaxed">{summary}</p>
        </div>
      </div>
    </div>
  );
}
