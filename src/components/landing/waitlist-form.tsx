"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "conflict" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.status === 409) {
        setStatus("conflict");
        return;
      }

      if (!res.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 justify-center text-emerald-400 font-mono text-sm">
        <Check className="w-4 h-4" />
        You&apos;re on the list! Check your inbox.
      </div>
    );
  }

  if (status === "conflict") {
    return (
      <div className="flex items-center gap-2 justify-center text-violet-400 font-mono text-sm">
        <Check className="w-4 h-4" />
        You&apos;re already on the list — sit tight!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 w-full max-w-sm">
        <input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 h-11 px-4 rounded-md bg-white/[0.06] border border-white/[0.08] text-sm text-white placeholder:text-white/25 font-mono focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-11 px-5 rounded-md bg-violet-500 text-white text-sm font-medium hover:bg-violet-400 transition-all duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Join waitlist
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
      {status === "error" && (
        <p className="text-red-400 font-mono text-xs">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
