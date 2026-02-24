"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";

/* ── Newsletter data ── */


const newsletters = [
  { name: "TLDR AI", subject: "GPT-5 is here, Llama 4 benchmarks, AI agents...", color: "border-violet-400/20", domain: "tldr.tech" },
  { name: "The Batch", subject: "Andrew Ng: Why RAG will dominate 2026", color: "border-sky-400/20", domain: "deeplearning.ai" },
  { name: "Ben's Bites", subject: "OpenAI ships Codex, Google fights back...", color: "border-orange-400/20", domain: "bensbites.com" },
  { name: "ByteByteGo", subject: "System Design: How Netflix handles 250M users", color: "border-amber-400/20", domain: "bytebytego.com" },
  { name: "The Neuron", subject: "AI spending hits $200B, Apple's new model...", color: "border-yellow-400/20", domain: "theneuron.ai" },
  { name: "Import AI", subject: "The skills gap is widening. Here's the data.", color: "border-pink-400/20", domain: "importai.net" },
  { name: "Alpha Signal", subject: "Top papers this week: agents, reasoning, vision", color: "border-red-400/20", domain: "alphasignal.ai" },
  { name: "Pragmatic Eng.", subject: "How Stripe built their AI assistant", color: "border-emerald-400/20", domain: "pragmaticengineer.com" },
  { name: "Superhuman", subject: "10 tools senior engineers swear by in 2026", color: "border-cyan-400/20", domain: "joinsuperhuman.ai" },
  { name: "AI Breakfast", subject: "Claude 4.5 deep-dive, Mistral updates...", color: "border-lime-400/20", domain: "aibreakfast.beehiiv.com" },
];

const cardPositions = [
  { top: "0%", left: "5%", rotate: "-3deg", z: 1 },
  { top: "2%", left: "45%", rotate: "2deg", z: 2 },
  { top: "18%", left: "15%", rotate: "1.5deg", z: 3 },
  { top: "20%", left: "52%", rotate: "-2deg", z: 4 },
  { top: "36%", left: "0%", rotate: "2.5deg", z: 5 },
  { top: "38%", left: "42%", rotate: "-1deg", z: 6 },
  { top: "54%", left: "10%", rotate: "-2.5deg", z: 7 },
  { top: "55%", left: "48%", rotate: "1deg", z: 8 },
  { top: "72%", left: "5%", rotate: "3deg", z: 9 },
  { top: "73%", left: "44%", rotate: "-1.5deg", z: 10 },
];

const mobileCardPositions = [
  { top: "0%", left: "2%", rotate: "-2deg", z: 1 },
  { top: "1%", left: "48%", rotate: "2.5deg", z: 2 },
  { top: "22%", left: "5%", rotate: "1.5deg", z: 3 },
  { top: "24%", left: "50%", rotate: "-1.5deg", z: 4 },
  { top: "44%", left: "0%", rotate: "-2.5deg", z: 5 },
  { top: "46%", left: "47%", rotate: "1deg", z: 6 },
  { top: "66%", left: "4%", rotate: "2deg", z: 7 },
  { top: "68%", left: "49%", rotate: "-2deg", z: 8 },
];

/* Animation phases:
   0 → 1.0s : cards fade in on left
   1.0s      : notification slides in on right
   2.5s      : notification fades out, email expands in
*/

export function DistillationVisual() {
  const [phase, setPhase] = useState<"notification" | "email">("notification");
  const [userPicked, setUserPicked] = useState(false);

  useEffect(() => {
    if (userPicked) return; // stop auto-play once user interacts

    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;

    function runCycle() {
      setPhase("notification");
      t1 = setTimeout(() => setPhase("email"), 2500);
      t2 = setTimeout(() => runCycle(), 10000);
    }

    t1 = setTimeout(() => setPhase("email"), 2500);
    t2 = setTimeout(() => runCycle(), 10000);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [userPicked]);

  function pickPhase(p: "notification" | "email") {
    setUserPicked(true);
    setPhase(p);
  }

  return (
    <div className="w-full max-w-5xl mx-auto relative">

      {/* Desktop: side-by-side */}
      <div className="hidden md:grid grid-cols-[1fr_1fr] items-start gap-8 relative">

        {/* ─── Left: Scattered newsletter cards ─── */}
        <div className="relative">
          <p className="font-mono text-[10px] text-white/35 uppercase tracking-[0.12em] mb-4 text-center">
            {phase === "email" ? <>All scanned &middot; <span className="text-emerald-400/50">3 articles picked</span></> : "What arrives"}
          </p>
          <div className="relative h-[480px]">
            {newsletters.map((nl, i) => (
              <div
                key={nl.name}
                className={`absolute w-[48%] opacity-0 animate-fade-in transition-all duration-500 ${
                  phase === "email" ? "!opacity-30" : ""
                }`}
                style={{
                  top: cardPositions[i].top,
                  left: cardPositions[i].left,
                  transform: `rotate(${cardPositions[i].rotate})`,
                  zIndex: cardPositions[i].z,
                  animationDelay: `${i * 0.06 + 0.1}s`,
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
              className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
            >
              <span className="font-mono text-[10px] text-white/50">+500 more...</span>
            </div>
          </div>
        </div>

        {/* ─── Right: Notification → Email ─── */}
        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <p className="font-mono text-[10px] text-white/35 uppercase tracking-[0.12em]">What you get</p>
            <div className="flex items-center gap-1 bg-white/[0.04] rounded-full p-0.5 border border-white/[0.06]">
              <button
                onClick={() => pickPhase("notification")}
                className={`font-mono text-[9px] px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  phase === "notification"
                    ? "bg-violet-500/20 text-violet-300/80"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                Notification
              </button>
              <button
                onClick={() => pickPhase("email")}
                className={`font-mono text-[9px] px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  phase === "email"
                    ? "bg-violet-500/20 text-violet-300/80"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                Email
              </button>
            </div>
          </div>
          <RightPanel phase={phase} />
        </div>
      </div>

      {/* Mobile: stacked */}
      <div className="md:hidden space-y-0">
        <p className="font-mono text-[10px] text-white/35 uppercase tracking-[0.12em] mb-3 text-center">
          {phase === "email" ? <>All scanned &middot; <span className="text-emerald-400/50">3 articles picked</span></> : "What arrives"}
        </p>
        <div className="relative h-[300px]">
          {newsletters.slice(0, 8).map((nl, i) => (
            <div
              key={nl.name}
              className={`absolute w-[48%] opacity-0 animate-fade-in transition-all duration-500 ${
                phase === "email" ? "!opacity-30" : ""
              }`}
              style={{
                top: mobileCardPositions[i].top,
                left: mobileCardPositions[i].left,
                transform: `rotate(${mobileCardPositions[i].rotate})`,
                zIndex: mobileCardPositions[i].z,
                animationDelay: `${i * 0.06 + 0.1}s`,
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
            className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
          >
            <span className="font-mono text-[10px] text-white/50">+500 more...</span>
          </div>
        </div>

        {/* Mobile: down arrow */}
        <div className="flex justify-center py-4">
          <div className="w-px h-8 bg-gradient-to-b from-white/[0.04] to-violet-400/15" />
        </div>

        <div className="flex items-center justify-center gap-3 mb-3">
          <p className="font-mono text-[10px] text-white/35 uppercase tracking-[0.12em]">What you get</p>
          <div className="flex items-center gap-1 bg-white/[0.04] rounded-full p-0.5 border border-white/[0.06]">
            <button
              onClick={() => pickPhase("notification")}
              className={`font-mono text-[9px] px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                phase === "notification"
                  ? "bg-violet-500/20 text-violet-300/80"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              Notification
            </button>
            <button
              onClick={() => pickPhase("email")}
              className={`font-mono text-[9px] px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                phase === "email"
                  ? "bg-violet-500/20 text-violet-300/80"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              Email
            </button>
          </div>
        </div>
        <RightPanel phase={phase} />
      </div>
    </div>
  );
}

/* ── Right panel: notification → email transition ── */

function RightPanel({ phase }: { phase: "notification" | "email" }) {
  return (
    <div className="relative min-h-[420px] md:min-h-[480px]">
      {/* Notification toast */}
      <div
        className={`absolute top-12 md:top-16 inset-x-0 mx-auto max-w-sm z-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          phase === "notification"
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
        }`}
        style={{ transitionDelay: phase === "notification" ? "1s" : "0s" }}
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

      {/* Full email (expands in after notification) */}
      <div
        className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          phase === "email"
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-[0.96]"
        }`}
      >
        <div className="absolute -inset-3 bg-violet-500/[0.04] rounded-xl blur-xl pointer-events-none" />

        <div className="relative rounded-xl border border-white/[0.08] bg-[#111113] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">

          {/* Header */}
          <div className="px-4 sm:px-5 pt-5 pb-4 border-b border-white/[0.06]">
            <p className="text-[10px] text-white/35 flex items-center gap-1.5 mb-2">
              <ArrowLeft className="w-3 h-3" /> Back
            </p>
            <h3 className="text-[14px] sm:text-[15px] text-white/85 font-semibold leading-snug">
              Your Personalized AI Learning Brief, Maya
            </h3>
            <p className="font-mono text-[10px] text-white/35 mt-1.5">
              Tuesday, February 24, 2026 &middot; 3 articles
            </p>
          </div>

          {/* Greeting */}
          <div className="px-4 sm:px-5 pt-4 pb-3">
            <p className="text-[11px] text-white/50 leading-relaxed">
              Hello Maya, it&apos;s wonderful to see your dedication to transitioning from Backend Developer to an AI Engineer role. We&apos;ve hand-picked some articles to support your journey.
            </p>
          </div>

          {/* Section label */}
          <div className="px-4 sm:px-5 pb-2">
            <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.15em]">Featured for you</p>
          </div>

          {/* Articles */}
          <div className="px-4 sm:px-5 pb-1">
            <RealArticle
              number={1}
              title="Fine-Tuning LLMs on Custom Datasets: A Practical Guide"
              level="Intermediate"
              sources="The Batch · deeplearning.ai"
              summary="A step-by-step walkthrough of fine-tuning open-source models on domain-specific data — the core skill bridging backend engineering and ML production systems."
              delay={0.3}
              revealed={phase === "email"}
            />
            <RealArticle
              number={2}
              title="RAG vs Fine-Tuning: When to Use What in Production"
              level="Intermediate"
              sources="TLDR AI · tldr.tech"
              summary="The decision framework senior ML engineers use daily. Covers latency trade-offs, cost analysis, and when retrieval-augmented generation beats model customization."
              delay={0.7}
              revealed={phase === "email"}
            />
            <RealArticle
              number={3}
              title="From REST APIs to ML Pipelines: A Backend Engineer's Guide"
              level="Intermediate"
              sources="ByteByteGo · bytebytego.com"
              summary="How to leverage your existing API design skills to build robust ML inference pipelines. Covers model serving, batching strategies, and monitoring in production."
              delay={1.1}
              revealed={phase === "email"}
              isLast
            />
          </div>

          {/* Next Steps */}
          <NextSteps revealed={phase === "email"} />
        </div>
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
    if (!revealed) return;
    const timer = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [revealed, delay]);

  return (
    <div
      className={`py-3.5 transition-all duration-500 ease-out ${!isLast ? "border-b border-white/[0.04]" : ""} ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-[11px] font-semibold text-violet-400/50 mt-0.5 shrink-0">{number}.</span>
        <div className="min-w-0 space-y-1.5">
          <p className="text-[12px] text-white/75 font-medium leading-snug">{title}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded font-medium">{level}</span>
            <span className="text-[9px] text-white/35">{sources}</span>
          </div>
          <p className="text-[10px] text-white/40 leading-relaxed">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
}

function NextSteps({ revealed }: { revealed: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!revealed) return;
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, [revealed]);

  return (
    <div className={`px-4 sm:px-5 pt-2 pb-4 transition-all duration-500 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
      <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.15em] mb-3">Your next steps</p>
      <div className="space-y-2.5">
        <div className="flex items-start gap-2">
          <span className="text-emerald-400/50 text-[10px] mt-px shrink-0">→</span>
          <p className="text-[10px] text-white/40 leading-relaxed">
            Start with the fine-tuning guide — your backend data pipeline experience maps directly to ML training workflows.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-emerald-400/50 text-[10px] mt-px shrink-0">→</span>
          <p className="text-[10px] text-white/40 leading-relaxed">
            Use the RAG vs fine-tuning framework to evaluate your current project — this is what interviewers ask at the senior ML level.
          </p>
        </div>
      </div>
    </div>
  );
}
