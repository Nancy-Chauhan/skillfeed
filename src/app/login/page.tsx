"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle2, Zap } from "lucide-react";

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
    <div className="min-h-screen flex bg-[#0A0A0A]">
      {/* Left side form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#525252] hover:text-[#A3A3A3] transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-lg bg-[#00FF88]/10 border border-[#00FF88]/20 flex items-center justify-center neon-box-glow">
            <Zap className="w-4.5 h-4.5 text-[#00FF88]" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-semibold text-white tracking-tight">
            SkillFeed
          </span>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00FF88]/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#00FF88]" />
            </div>
            <h1 className="text-2xl font-semibold text-white">Check your email</h1>
            <p className="text-[#737373] leading-relaxed">
              We sent a magic link to <strong className="text-[#A3A3A3]">{email}</strong>.
              <br />
              Click it to sign in.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-white tracking-tight">Welcome back</h1>
              <p className="text-[#737373]">
                Sign in to your personalized learning journey.
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-[#A3A3A3]">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 rounded-xl border-[#262626] focus:border-[#00FF88]/50 bg-[#141414] text-white placeholder:text-[#525252]"
                  />
                </div>
              </div>
              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#00FF88] text-[#0A0A0A] hover:bg-[#00FF88]/90 cursor-pointer text-sm font-semibold shadow-[0_0_20px_rgba(0,255,136,0.15)] hover:shadow-[0_0_30px_rgba(0,255,136,0.25)] transition-all"
              >
                {loading ? "Sending..." : "Continue with Email"}
              </Button>
            </form>
            <p className="text-xs text-[#525252] text-center">
              We&apos;ll send you a magic link. No password needed.
            </p>
          </div>
        )}
      </div>

      {/* Right side decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative border-l border-[#262626]">
        {/* Glow effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#00FF88]/8 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#A78BFA]/8 blur-[100px] pointer-events-none" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative text-center space-y-4 px-12">
          <p className="text-4xl font-bold text-white/80 leading-tight tracking-tight">
            Ditch the duplicates.
            <br />
            <span className="text-[#00FF88]/70 neon-glow">Read what matters.</span>
          </p>
          <p className="text-sm text-[#525252] max-w-sm mx-auto">
            One personalized developer newsletter, curated by AI from 500+ sources.
          </p>
        </div>
      </div>
    </div>
  );
}
