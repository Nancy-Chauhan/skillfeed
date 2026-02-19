"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090B] px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-violet-500/[0.05] blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] text-white/25 hover:text-white/50 transition-colors mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>

        <div className="mb-8">
          <span className="font-mono text-sm font-semibold text-white tracking-tight">
            skillfeed<span className="text-violet-400">_</span>
          </span>
        </div>

        {sent ? (
          <div className="space-y-4 reveal">
            <CheckCircle2 className="w-7 h-7 text-emerald-400/80" />
            <h1 className="text-xl font-bold text-white tracking-tight">Check your email</h1>
            <p className="text-sm text-white/35 leading-relaxed">
              We sent a magic link to <span className="font-mono text-violet-400/80">{email}</span>.
              Click it to sign in.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Sign in</h1>
              <p className="text-[13px] text-white/35">
                Enter your email to continue.
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[13px] text-white/40">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 rounded-lg border-white/[0.06] focus:border-violet-500/40 bg-white/[0.03] text-white placeholder:text-white/15 font-mono text-sm focus:ring-1 focus:ring-violet-500/20"
                />
              </div>
              {error && (
                <p className="text-sm text-red-400 font-mono">{error}</p>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-lg bg-violet-500 text-white hover:bg-violet-400 cursor-pointer text-sm font-medium transition-all duration-200 shadow-[0_0_20px_rgba(167,139,250,0.2)]"
              >
                {loading ? "Sending..." : "Continue with Email"}
              </Button>
            </form>
            <p className="font-mono text-[11px] text-white/15 text-center">
              magic link &middot; no password needed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
