"use client";

import { useEffect, useState } from "react";
import { Star, Reply, MoreVertical, Archive, Trash2, ArrowLeft } from "lucide-react";

/* ── Scattered newsletter mini-cards (left side) ── */

const newsletters = [
  { name: "TLDR AI", subject: "GPT-5 is here, Llama 4 benchmarks, AI agents...", color: "border-violet-400/20", domain: "tldr.tech" },
  { name: "The Batch", subject: "Andrew Ng: Why RAG will dominate 2026", color: "border-sky-400/20", domain: "deeplearning.ai" },
  { name: "Ben's Bites", subject: "OpenAI ships Codex, Google fights back...", color: "border-orange-400/20", domain: "bensbites.com" },
  { name: "ByteByteGo", subject: "System Design: Real-time ML pipelines", color: "border-amber-400/20", domain: "bytebytego.com" },
  { name: "The Neuron", subject: "AI spending hits $200B, Apple's new model...", color: "border-yellow-400/20", domain: "theneuron.ai" },
  { name: "Import AI", subject: "Scaling laws plateau? New research says...", color: "border-pink-400/20", domain: "importai.net" },
  { name: "Alpha Signal", subject: "Top AI papers this week: diffusion, RLHF...", color: "border-red-400/20", domain: "alphasignal.ai" },
  { name: "Pragmatic Eng.", subject: "How Stripe built their AI assistant", color: "border-emerald-400/20", domain: "pragmaticengineer.com" },
  { name: "Superhuman", subject: "10 AI tools that replaced my entire stack", color: "border-cyan-400/20", domain: "joinsuperhuman.ai" },
  { name: "AI Breakfast", subject: "Claude 4.5 deep-dive, Mistral updates...", color: "border-lime-400/20", domain: "aibreakfast.beehiiv.com" },
];

// Fixed positions so they look scattered / overlapping like a messy desk
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

export function DistillationVisual() {
  const [emailRevealed, setEmailRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setEmailRevealed(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto relative">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_56px_1.15fr] items-center gap-6 md:gap-3">

        {/* ─── Left: Scattered newsletter cards ─── */}
        <div className="relative h-[420px] hidden md:block">
          {newsletters.map((nl, i) => (
            <div
              key={nl.name}
              className={`absolute w-[48%] opacity-0 animate-fade-in`}
              style={{
                top: cardPositions[i].top,
                left: cardPositions[i].left,
                transform: `rotate(${cardPositions[i].rotate})`,
                zIndex: cardPositions[i].z,
                animationDelay: `${i * 0.08 + 0.3}s`,
                animationFillMode: "forwards",
              }}
            >
              <div className={`rounded-md border ${nl.color} bg-[#0d0d10] p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-transform duration-300`}>
                {/* Mini email row */}
                <div className="flex items-start gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${nl.domain}&sz=64`}
                    alt={nl.name}
                    className="w-5 h-5 rounded shrink-0 mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-white/40 font-medium truncate">{nl.name}</p>
                    <p className="text-[9px] text-white/20 truncate leading-relaxed">{nl.subject}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Overflow label */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in"
            style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}
          >
            <span className="font-mono text-[10px] text-white/10">+40 more...</span>
          </div>
        </div>

        {/* Mobile: horizontal scroll of cards */}
        <div className="md:hidden flex gap-3 overflow-x-auto pb-4 px-2 -mx-2 scrollbar-none">
          {newsletters.slice(0, 6).map((nl, i) => (
            <div
              key={nl.name}
              className={`shrink-0 w-[170px] sm:w-[200px] rounded-md border ${nl.color} bg-[#0d0d10] p-2.5`}
              style={{ transform: `rotate(${i % 2 === 0 ? "-1" : "1"}deg)` }}
            >
              <div className="flex items-start gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://www.google.com/s2/favicons?domain=${nl.domain}&sz=64`}
                  alt={nl.name}
                  className="w-5 h-5 rounded shrink-0 mt-0.5"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-white/40 font-medium truncate">{nl.name}</p>
                  <p className="text-[9px] text-white/20 truncate leading-relaxed">{nl.subject}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Center: Arrow ─── */}
        <div className="hidden md:flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center gap-2">
            {/* Dashed line */}
            <div className="w-px h-16 border-l border-dashed border-white/[0.08]" />
            {/* Arrow icon */}
            <div className="w-8 h-8 rounded-full bg-violet-400/10 border border-violet-400/[0.15] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7 L11 7 M8 4 L11 7 L8 10" stroke="rgba(167,139,250,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {/* Dashed line */}
            <div className="w-px h-16 border-l border-dashed border-white/[0.08]" />
          </div>
        </div>

        {/* Mobile: simple arrow */}
        <div className="md:hidden flex justify-center py-1">
          <div className="flex flex-col items-center gap-1">
            <div className="w-px h-5 bg-gradient-to-b from-white/[0.04] to-violet-400/20" />
            <div className="w-7 h-7 rounded-full bg-violet-400/10 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M6 2 L6 9 M3 7 L6 10 L9 7" stroke="rgba(167,139,250,0.5)" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="w-px h-5 bg-gradient-to-b from-violet-400/20 to-white/[0.04]" />
          </div>
        </div>

        {/* ─── Right: Gmail with newsletter inside ─── */}
        <div className={`relative transition-all duration-1000 ease-out ${emailRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="absolute -inset-3 bg-violet-500/[0.03] rounded-xl blur-xl pointer-events-none" />

          <div className="relative rounded-xl border border-white/[0.08] bg-[#111113] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">

            {/* Gmail toolbar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <ArrowLeft className="w-3.5 h-3.5 text-white/15" />
                <Archive className="w-3.5 h-3.5 text-white/15" />
                <Trash2 className="w-3.5 h-3.5 text-white/15" />
              </div>
              <span className="text-[10px] text-white/10">1 of 1</span>
            </div>

            {/* Subject */}
            <div className="px-4 pt-3 pb-1 flex items-start justify-between">
              <h3 className="text-[13px] text-white/70 font-medium">Your Daily Brief, Feb 18</h3>
              <Star className="w-4 h-4 text-white/10 shrink-0 mt-0.5" />
            </div>

            {/* Sender row */}
            <div className="px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-emerald-500/30 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-white/60">SF</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] text-white/60 font-medium">SkillFeed</span>
                    <span className="text-[10px] text-white/15 hidden sm:inline">&lt;brief@skillfeed.dev&gt;</span>
                  </div>
                  <span className="text-[10px] text-white/15">to me</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/10 hidden sm:inline">7:00 AM</span>
                <Reply className="w-3.5 h-3.5 text-white/10" />
                <MoreVertical className="w-3.5 h-3.5 text-white/10 hidden sm:block" />
              </div>
            </div>

            {/* ── Newsletter body (rendered HTML email) ── */}
            <div className="mx-2 sm:mx-4 mb-4 mt-1 rounded-lg border border-white/[0.06] bg-[#0a0a0c] overflow-hidden">

              {/* Newsletter header/branding */}
              <div className="px-3 sm:px-5 pt-5 pb-3 border-b border-white/[0.06] text-center">
                <p className="font-mono text-[13px] font-semibold text-white/60 tracking-tight">
                  skillfeed<span className="text-violet-400">_</span>
                </p>
                <p className="text-[10px] text-white/15 mt-1">Your personalized daily brief</p>
              </div>

              {/* Career context bar */}
              <div className="px-3 sm:px-5 pt-4 pb-3">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 py-2 px-3 rounded bg-violet-400/[0.04] border border-violet-400/[0.08]">
                  <span className="text-[10px] text-white/25">Your path:</span>
                  <span className="text-[10px] text-white/40 font-medium">Backend Dev</span>
                  <span className="text-[10px] text-violet-400/50">→</span>
                  <span className="text-[10px] text-violet-400/70 font-medium">ML Engineer</span>
                  <span className="text-[10px] text-white/15 sm:ml-auto">intermediate → senior</span>
                </div>
                <p className="text-[11px] text-white/25 leading-relaxed mt-2.5">
                  Good morning! We scanned <span className="text-white/40">50+ sources</span>, filtered <span className="text-white/40">53 duplicates</span>, and found <span className="text-violet-400/60">3 articles</span> that match your transition to ML Engineer.
                </p>
              </div>

              {/* Articles */}
              <div className="px-3 sm:px-5 pb-2 space-y-0">
                <NewsletterArticle
                  number={1}
                  match={96}
                  source="The Batch"
                  title="Fine-Tuning LLMs on Custom Datasets"
                  reason="Key skill gap for your Backend → ML transition. You know APIs. This teaches you the model layer."
                  delay={0.2}
                  revealed={emailRevealed}
                />
                <NewsletterArticle
                  number={2}
                  match={92}
                  source="TLDR AI"
                  title="RAG vs Fine-Tuning: When to Use What"
                  reason="You listed 'production ML systems' as a goal. This is the decision framework senior ML engineers use daily."
                  delay={0.5}
                  revealed={emailRevealed}
                />
                <NewsletterArticle
                  number={3}
                  match={89}
                  source="Alpha Signal"
                  title="Building AI Agents with Tool Use"
                  delay={0.8}
                  revealed={emailRevealed}
                  isLast
                />
              </div>

              {/* Newsletter footer */}
              <div className="px-3 sm:px-5 py-3 border-t border-white/[0.06] text-center">
                <p className="text-[9px] text-white/10">
                  Curated for <span className="text-white/20">Backend Dev</span> <span className="text-violet-400/30">→</span> <span className="text-violet-400/40">ML Engineer</span> &middot; <span className="underline">Unsubscribe</span> &middot; <span className="underline">Preferences</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function NewsletterArticle({
  number,
  match,
  source,
  title,
  reason,
  delay,
  revealed,
  isLast = false,
}: {
  number: number;
  match: number;
  source: string;
  title: string;
  reason?: string;
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
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-[11px] font-semibold text-violet-400/50 mt-0.5 shrink-0">{number}.</span>
        <div className="min-w-0 space-y-1">
          <p className="text-[12px] text-white/55 font-medium leading-snug">{title}</p>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-white/20">{source}</span>
            <span className="text-[9px] text-emerald-400/50 bg-emerald-400/8 px-1.5 py-px rounded-sm">{match}% match</span>
          </div>
          {reason && (
            <p className="text-[10px] text-white/20 leading-relaxed italic">
              &quot;{reason}&quot;
            </p>
          )}
          <p className="text-[10px] text-violet-400/40 hover:text-violet-400/60 cursor-default">
            Read article →
          </p>
        </div>
      </div>
    </div>
  );
}
