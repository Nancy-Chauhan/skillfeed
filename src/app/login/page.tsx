"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { GoogleIcon } from "@/components/landing/google-icon";

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
          className="inline-flex items-center gap-2 text-[13px] text-white/50 hover:text-white/75 transition-colors mb-12"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>

        <div className="mb-10">
          <span className="font-mono text-sm font-semibold text-white tracking-tight">
            skillfeed<span className="text-violet-400">_</span>
          </span>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-white/55 leading-relaxed">
              Sign in to access your personalized career briefs and learning dashboard.
            </p>
          </div>

          {authError && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/[0.08] border border-red-500/[0.15]">
              <p className="text-sm text-red-400">
                Authentication failed. Please try again.
              </p>
            </div>
          )}

          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-12 rounded-lg bg-white text-gray-800 hover:bg-gray-100 cursor-pointer text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <GoogleIcon className="w-5 h-5" />
            {loading ? "Redirecting..." : "Continue with Google"}
          </Button>

          <div className="flex items-center justify-center gap-2">
            <Shield className="w-3 h-3 text-white/30" />
            <p className="font-mono text-[11px] text-white/35">
              Secure OAuth sign-in &middot; We never see your password
            </p>
          </div>
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
