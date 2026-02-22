"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function LoginContent() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const authError = searchParams.get("error") === "auth_failed";

  async function handleGoogleSignIn() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090B] px-6 relative overflow-hidden">
      <div className="fixed inset-0 dot-grid pointer-events-none z-0" />
      {/* Background glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-violet-500/[0.05] blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] text-white/60 hover:text-white/80 transition-colors mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>

        <div className="mb-8">
          <span className="font-mono text-sm font-semibold text-white tracking-tight">
            skillfeed<span className="text-violet-400">_</span>
          </span>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Sign in</h1>
            <p className="text-[13px] text-white/70">
              Continue with your Google account.
            </p>
          </div>

          {authError && (
            <p className="text-sm text-red-400 font-mono">
              Authentication failed. Please try again.
            </p>
          )}

          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-11 rounded-lg bg-violet-500 text-white hover:bg-violet-400 cursor-pointer text-sm font-medium transition-all duration-200 shadow-[0_0_20px_rgba(167,139,250,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Redirecting..." : "Continue with Google"}
          </Button>

          <p className="font-mono text-[11px] text-white/50 text-center">
            secure sign-in via Google
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
