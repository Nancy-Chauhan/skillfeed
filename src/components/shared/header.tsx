import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { LogOut, Zap } from "lucide-react";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0C0C0C]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-[#00FF88]/10 border border-[#00FF88]/20 flex items-center justify-center group-hover:bg-[#00FF88]/15 transition-all duration-200">
            <Zap className="w-3.5 h-3.5 text-[#00FF88]" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold text-white/90 tracking-tight">
            SkillFeed
          </span>
        </Link>
        <nav className="flex items-center gap-5">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-white/50 hover:text-white/80 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <form action="/auth/signout" method="post">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/30 hover:text-white/60 cursor-pointer h-8"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-white/50 hover:text-white/80 transition-colors duration-200 hidden sm:block"
              >
                Sign in
              </Link>
              <Link href="/login">
                <Button className="rounded-full bg-[#00FF88] text-[#0C0C0C] hover:bg-[#00FF88]/90 px-4 h-8 cursor-pointer text-xs font-semibold transition-all duration-200">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
