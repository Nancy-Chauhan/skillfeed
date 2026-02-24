"use client";

import { useState } from "react";
import Link from "next/link";

export function Footer() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setMessage("");
      setTimeout(() => {
        setOpen(false);
        setStatus("idle");
      }, 2000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="relative z-10 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 py-10 md:py-14 relative">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Brand */}
          <div className="space-y-1.5">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="font-mono text-sm font-semibold text-white/70 cursor-pointer"
            >
              skillfeed<span className="text-violet-400/70">_</span>
            </a>
            <p className="text-[12px] text-white/35 leading-relaxed">
              500+ newsletters distilled into one daily career brief.
            </p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <a href="#features" className="text-[13px] text-white/40 hover:text-white/65 transition-colors">
              Features
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="text-[13px] text-white/40 hover:text-white/65 transition-colors cursor-pointer"
            >
              Feedback
            </button>
            <Link href="/login" className="text-[13px] text-white/40 hover:text-white/65 transition-colors">
              Get started
            </Link>
          </nav>
        </div>

        {/* Feedback form */}
        {open && (
          <div className="mt-6 max-w-md">
            {status === "sent" ? (
              <p className="font-mono text-[12px] text-emerald-400/70">Thanks for your feedback!</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you think..."
                  maxLength={1000}
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-md px-3 py-2 text-[13px] text-white/70 placeholder:text-white/25 focus:outline-none focus:border-violet-400/40"
                />
                <button
                  type="submit"
                  disabled={status === "sending" || !message.trim()}
                  className="px-4 py-2 bg-violet-500/80 hover:bg-violet-400/80 text-white text-[12px] font-medium rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {status === "sending" ? "..." : "Send"}
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="font-mono text-[11px] text-red-400/70 mt-2">Something went wrong. Try again.</p>
            )}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="font-mono text-[11px] text-white/25">
            &copy; {new Date().getFullYear()} SkillFeed
          </p>
          <p className="font-mono text-[11px] text-white/25">
            Built for people who never stop learning.
          </p>
        </div>
      </div>
    </footer>
  );
}
